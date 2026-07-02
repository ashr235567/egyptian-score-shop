const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const ErrorResponse = require('../utils/errorResponse');
const { sendEmail, orderConfirmationTemplate } = require('../utils/email');

const SHIPPING_FLAT_RATE = 60;
const FREE_SHIPPING_THRESHOLD = 3000;

// Defines which status changes are permitted. Terminal states (delivered, cancelled)
// have no outgoing transitions.
const ALLOWED_STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
};

// Reverses the stock/sold decrement made at order creation time. Only called once,
// guarded by the status transition check in updateOrderStatus (nothing transitions
// out of 'cancelled', so this can never run twice for the same order).
const restoreStockForOrder = async (order) => {
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    const variant = product.variants.find((v) => v.color === item.color);
    if (!variant) continue;

    const sizeEntry = variant.sizes.find((s) => s.size === item.size);
    if (!sizeEntry) continue;

    sizeEntry.stock += item.quantity;
    product.sold = Math.max(0, product.sold - item.quantity);
    await product.save();
  }
};

// Builds the WhatsApp click-to-chat URL with a formatted order summary
const buildWhatsAppLink = (order) => {
  const lines = [];
  lines.push(`*New Order - Egyptian Score Shop* ⚽`);
  lines.push(`Order Number: ${order.orderNumber}`);
  lines.push('');
  lines.push('*Items:*');
  order.items.forEach((item, idx) => {
    lines.push(`${idx + 1}. ${item.name} | Color: ${item.color} | Size: ${item.size} | Qty: ${item.quantity} | ${item.price} EGP`);
  });
  lines.push('');
  lines.push(`Subtotal: ${order.itemsPrice} EGP`);
  if (order.discountAmount > 0) lines.push(`Discount: -${order.discountAmount} EGP`);
  lines.push(`Shipping: ${order.shippingPrice} EGP`);
  lines.push(`*Total: ${order.totalPrice} EGP*`);
  lines.push('');
  lines.push('*Shipping Details:*');
  lines.push(`Name: ${order.shippingAddress.fullName}`);
  lines.push(`Phone: ${order.shippingAddress.phone}`);
  lines.push(
    `Address: ${order.shippingAddress.street}, Bldg ${order.shippingAddress.building || '-'}, Floor ${
      order.shippingAddress.floor || '-'
    }, Apt ${order.shippingAddress.apartment || '-'}, ${order.shippingAddress.city}, ${order.shippingAddress.governorate}`
  );
  if (order.shippingAddress.notes) lines.push(`Notes: ${order.shippingAddress.notes}`);
  lines.push('');
  lines.push('Payment Method: Cash on Delivery');

  const text = encodeURIComponent(lines.join('\n'));
  const phone = process.env.WHATSAPP_NUMBER;
  return `https://wa.me/${phone}?text=${text}`;
};

// @desc    Create new order (from cart) and generate WhatsApp link
// @route   POST /api/orders
// @access  Private (or guest with email)
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { items, shippingAddress, couponCode, guestEmail } = req.body;

  if (!items || items.length === 0) {
    return next(new ErrorResponse('No order items provided', 400));
  }

  // Re-validate items & prices server-side against DB (never trust client price)
  let itemsPrice = 0;
  const validatedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      return next(new ErrorResponse(`Product not found: ${item.productId}`, 404));
    }

    const variant = product.variants.find((v) => v.color === item.color);
    if (!variant) {
      return next(new ErrorResponse(`Color ${item.color} not available for ${product.name}`, 400));
    }
    const sizeEntry = variant.sizes.find((s) => s.size === item.size);
    if (!sizeEntry || sizeEntry.stock < item.quantity) {
      return next(new ErrorResponse(`Insufficient stock for ${product.name} (size ${item.size})`, 400));
    }

    const price = product.isOnSale && product.discountPrice > 0 ? product.discountPrice : product.price;
    itemsPrice += price * item.quantity;

    validatedItems.push({
      product: product._id,
      name: product.name,
      image: variant.images[0] || product.coverImage,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      price
    });

    // Decrement stock
    sizeEntry.stock -= item.quantity;
    product.sold += item.quantity;
    await product.save();
  }

  // Coupon validation
  let discountAmount = 0;
  let couponData = undefined;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!coupon || !coupon.isValidNow()) {
      return next(new ErrorResponse('Coupon is invalid or expired', 400));
    }
    if (itemsPrice < coupon.minOrderValue) {
      return next(new ErrorResponse(`Minimum order value for this coupon is ${coupon.minOrderValue} EGP`, 400));
    }
    if (req.user) {
      const userUsage = coupon.usedBy.find((u) => u.user.toString() === req.user.id.toString());
      if (userUsage && userUsage.count >= coupon.perUserLimit) {
        return next(new ErrorResponse('You have already used this coupon the maximum number of times', 400));
      }
    }

    discountAmount =
      coupon.discountType === 'percentage' ? (itemsPrice * coupon.discountValue) / 100 : coupon.discountValue;

    if (coupon.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }
    discountAmount = Math.min(discountAmount, itemsPrice);

    couponData = {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    };

    coupon.usedCount += 1;
    if (req.user) {
      const userUsage = coupon.usedBy.find((u) => u.user.toString() === req.user.id.toString());
      if (userUsage) userUsage.count += 1;
      else coupon.usedBy.push({ user: req.user.id, count: 1 });
    }
    await coupon.save();
  }

  const shippingPrice = itemsPrice - discountAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const totalPrice = Math.max(0, itemsPrice - discountAmount) + shippingPrice;

  const order = await Order.create({
    user: req.user ? req.user.id : undefined,
    guestEmail: req.user ? undefined : guestEmail,
    items: validatedItems,
    shippingAddress,
    coupon: couponData,
    itemsPrice,
    shippingPrice,
    discountAmount,
    totalPrice
  });

  const whatsappLink = buildWhatsAppLink(order);
  order.whatsappSent = true;
  await order.save();

  const recipientEmail = req.user ? req.user.email : guestEmail;
  if (recipientEmail) {
    sendEmail({
      to: recipientEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: orderConfirmationTemplate(order)
    }).catch((e) => console.error(e));
  }

  res.status(201).json({ success: true, order, whatsappLink });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
});

// @desc    Get single order by id (owner or admin)
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }
  if (req.user.role !== 'admin' && (!order.user || order.user._id.toString() !== req.user.id.toString())) {
    return next(new ErrorResponse('Not authorized to view this order', 403));
  }
  res.status(200).json({ success: true, order });
});

// @desc    Track order by order number + phone (public, for guests too)
// @route   GET /api/orders/track/:orderNumber
// @access  Public
exports.trackOrder = asyncHandler(async (req, res, next) => {
  const { orderNumber } = req.params;
  const { phone } = req.query;

  const order = await Order.findOne({ orderNumber });
  if (!order) {
    return next(new ErrorResponse('Order not found. Please check your order number.', 404));
  }
  if (phone && order.shippingAddress.phone !== phone) {
    return next(new ErrorResponse('Order not found. Please check your order number and phone.', 404));
  }

  res.status(200).json({
    success: true,
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      statusHistory: order.statusHistory,
      items: order.items,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      deliveredAt: order.deliveredAt
    }
  });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, parseInt(limit));

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Order.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    orders
  });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  const validStatuses = Object.keys(ALLOWED_STATUS_TRANSITIONS);
  if (!validStatuses.includes(status)) {
    return next(new ErrorResponse(`Invalid status value: ${status}`, 400));
  }

  const allowedNextStatuses = ALLOWED_STATUS_TRANSITIONS[order.status] || [];
  if (!allowedNextStatuses.includes(status)) {
    return next(
      new ErrorResponse(
        `Cannot change order status from '${order.status}' to '${status}'. Allowed next status${
          allowedNextStatuses.length === 1 ? '' : 'es'
        } from '${order.status}': ${allowedNextStatuses.length ? allowedNextStatuses.join(', ') : 'none (final state)'}.`,
        400
      )
    );
  }

  order.status = status;
  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.isPaid = true;
    order.paidAt = new Date();
  }
  if (status === 'cancelled') {
    order.cancelledAt = new Date();
    order.cancelReason = note;
    await restoreStockForOrder(order);
  }
  if (note) {
    order.statusHistory.push({ status, changedAt: new Date(), note });
  }

  await order.save();
  res.status(200).json({ success: true, order });
});
