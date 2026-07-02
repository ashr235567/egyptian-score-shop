const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard statistics & analytics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [totalProducts, totalCustomers, totalOrders, orders] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Order.countDocuments(),
    Order.find()
  ]);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const ordersByStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  // Revenue for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const dailyRevenue = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    dailyRevenue[key] = 0;
  }
  orders
    .filter((o) => o.status !== 'cancelled' && o.createdAt >= sevenDaysAgo)
    .forEach((o) => {
      const key = o.createdAt.toISOString().slice(0, 10);
      if (dailyRevenue[key] !== undefined) dailyRevenue[key] += o.totalPrice;
    });

  // Low stock products
  const lowStockProducts = await Product.find({ totalStock: { $lte: 5 }, isActive: true })
    .select('name brand totalStock coverImage')
    .limit(10);

  // Top selling products
  const topProducts = await Product.find().sort({ sold: -1 }).limit(5).select('name brand sold coverImage price');

  // Recent orders
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');

  res.status(200).json({
    success: true,
    stats: {
      totalProducts,
      totalCustomers,
      totalOrders,
      totalRevenue,
      ordersByStatus,
      dailyRevenue: Object.entries(dailyRevenue).map(([date, revenue]) => ({ date, revenue })),
      lowStockProducts,
      topProducts,
      recentOrders
    }
  });
});
