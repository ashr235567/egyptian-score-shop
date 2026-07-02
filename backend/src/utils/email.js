const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_USER === 'your_smtp_user') {
      console.log(`[Email skipped - SMTP not configured] To: ${to} | Subject: ${subject}`);
      return { skipped: true };
    }
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"Egyptian Score Shop" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });
    return info;
  } catch (err) {
    console.error('Email send error:', err.message);
    return { error: err.message };
  }
};

const welcomeEmailTemplate = (name) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
    <div style="background:#0a7d32; padding:24px; text-align:center;">
      <h1 style="color:#fff; margin:0; letter-spacing:1px;">EGYPTIAN SCORE SHOP</h1>
    </div>
    <div style="padding:24px; color:#222;">
      <h2>Welcome, ${name}! ⚽</h2>
      <p>Thanks for joining Egyptian Score Shop, your home for 100% original football boots in Egypt.</p>
      <p>Start browsing the latest arrivals from Nike, Adidas, Puma and more.</p>
      <a href="${process.env.CLIENT_URL}/products" style="display:inline-block; margin-top:16px; background:#0a7d32; color:#fff; padding:12px 24px; text-decoration:none; border-radius:6px;">Shop Now</a>
    </div>
    <div style="background:#f5f5f5; padding:16px; text-align:center; color:#777; font-size:12px;">
      © ${new Date().getFullYear()} Egyptian Score Shop. All rights reserved.
    </div>
  </div>
`;

const orderConfirmationTemplate = (order) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
    <div style="background:#0a7d32; padding:24px; text-align:center;">
      <h1 style="color:#fff; margin:0; letter-spacing:1px;">EGYPTIAN SCORE SHOP</h1>
    </div>
    <div style="padding:24px; color:#222;">
      <h2>Order Confirmed! 🎉</h2>
      <p>Order Number: <strong>${order.orderNumber}</strong></p>
      <table style="width:100%; border-collapse:collapse; margin-top:16px;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th style="padding:8px; text-align:left;">Item</th>
            <th style="padding:8px; text-align:left;">Size</th>
            <th style="padding:8px; text-align:left;">Qty</th>
            <th style="padding:8px; text-align:left;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td style="padding:8px; border-bottom:1px solid #eee;">${item.name} (${item.color})</td>
              <td style="padding:8px; border-bottom:1px solid #eee;">${item.size}</td>
              <td style="padding:8px; border-bottom:1px solid #eee;">${item.quantity}</td>
              <td style="padding:8px; border-bottom:1px solid #eee;">${item.price} EGP</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
      <p style="margin-top:16px; font-size:18px;"><strong>Total: ${order.totalPrice} EGP</strong></p>
      <p>We will contact you shortly via WhatsApp/phone to confirm delivery details.</p>
    </div>
    <div style="background:#f5f5f5; padding:16px; text-align:center; color:#777; font-size:12px;">
      © ${new Date().getFullYear()} Egyptian Score Shop. All rights reserved.
    </div>
  </div>
`;

module.exports = { sendEmail, welcomeEmailTemplate, orderConfirmationTemplate };
