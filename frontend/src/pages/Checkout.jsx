import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { couponApi } from '../api/adminApi';

const GOVERNORATES = [
  'Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Sharqia', 'Dakahlia', 'Beheira',
  'Gharbia', 'Monufia', 'Kafr El Sheikh', 'Damietta', 'Port Said', 'Ismailia',
  'Suez', 'North Sinai', 'South Sinai', 'Beni Suef', 'Faiyum', 'Minya',
  'Asyut', 'Sohag', 'Qena', 'Luxor', 'Aswan', 'Red Sea', 'New Valley', 'Matrouh'
];

const SHIPPING_FLAT_RATE = 60;
const FREE_SHIPPING_THRESHOLD = 3000;

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    governorate: '',
    city: '',
    street: '',
    building: '',
    floor: '',
    apartment: '',
    notes: ''
  });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const total = Math.max(0, subtotal - discount) + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const { data } = await couponApi.validate({ code: couponCode.trim(), subtotal });
      setDiscount(data.discountAmount);
      setAppliedCoupon(data.coupon);
      toast.success('Coupon applied!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setDiscount(0);
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated && !form.email) {
      toast.error('Please provide an email or log in to track your order');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          color: i.color,
          size: i.size,
          quantity: i.quantity
        })),
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          governorate: form.governorate,
          city: form.city,
          street: form.street,
          building: form.building,
          floor: form.floor,
          apartment: form.apartment,
          notes: form.notes
        },
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        guestEmail: !isAuthenticated ? form.email : undefined
      };

      const { data } = await orderApi.createOrder(payload);
      clearCart();
      toast.success(t('checkout.orderSuccess'));
      window.open(data.whatsappLink, '_blank');
      navigate(`/order-success`, { state: { order: data.order, whatsappLink: data.whatsappLink } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '32px 20px 60px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>{t('checkout.title')}</h1>

      <form onSubmit={handleSubmit} className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 18 }}>{t('checkout.shippingInfo')}</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('checkout.fullName')}</label>
              <input name="fullName" required value={form.fullName} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('checkout.phone')}</label>
              <input name="phone" required value={form.phone} onChange={handleChange} className="form-input" placeholder="01XXXXXXXXX" />
            </div>
          </div>

          {!isAuthenticated && (
            <div className="form-group">
              <label className="form-label">{t('checkout.email')}</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('checkout.governorate')}</label>
              <select name="governorate" required value={form.governorate} onChange={handleChange} className="form-select">
                <option value="">--</option>
                {GOVERNORATES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('checkout.city')}</label>
              <input name="city" required value={form.city} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('checkout.street')}</label>
            <input name="street" required value={form.street} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-row form-row-3">
            <div className="form-group">
              <label className="form-label">{t('checkout.building')}</label>
              <input name="building" value={form.building} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('checkout.floor')}</label>
              <input name="floor" value={form.floor} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('checkout.apartment')}</label>
              <input name="apartment" value={form.apartment} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('checkout.notes')}</label>
            <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} className="form-textarea" />
          </div>

          <div style={{ marginTop: 20, padding: 14, background: 'var(--color-bg-secondary)', borderRadius: 10 }}>
            <strong style={{ fontSize: 13.5 }}>{t('checkout.paymentMethod')}: </strong>
            <span style={{ fontSize: 13.5 }}>{t('checkout.cod')}</span>
          </div>
        </div>

        <div className="card" style={{ padding: 22, height: 'fit-content', position: 'sticky', top: 100 }}>
          <h3 style={{ marginBottom: 16 }}>{t('checkout.orderSummary')}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, maxHeight: 220, overflowY: 'auto' }}>
            {items.map((item) => (
              <div key={`${item.productId}-${item.color}-${item.size}`} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                <div style={{ flex: 1, fontSize: 12.5 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: 'var(--color-text-secondary)' }}>
                    {item.color} / {item.size} x{item.quantity}
                  </div>
                </div>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder={t('cart.couponCode')}
              className="form-input"
              style={{ flex: 1 }}
            />
            <button type="button" onClick={handleApplyCoupon} disabled={applyingCoupon} className="btn btn-outline btn-sm">
              {t('cart.applyCoupon')}
            </button>
          </div>

          <SummaryRow label={t('cart.subtotal')} value={subtotal} />
          {discount > 0 && <SummaryRow label={t('cart.discount')} value={-discount} accent />}
          <SummaryRow label={t('cart.shipping')} value={shipping} isFree={shipping === 0} />
          <div style={{ borderTop: '1px solid var(--color-border)', margin: '14px 0', paddingTop: 14 }}>
            <SummaryRow label={t('cart.total')} value={total} bold />
          </div>

          <button type="submit" disabled={submitting} className="btn btn-whatsapp btn-block">
            <FaWhatsapp size={18} /> {submitting ? t('checkout.placingOrder') : t('checkout.placeOrder')}
          </button>
        </div>
      </form>

      <style>{`
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-row-3 { grid-template-columns: 1fr 1fr 1fr; }
        @media (max-width: 860px) {
          .checkout-layout { grid-template-columns: 1fr !important; }
          .form-row, .form-row-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const SummaryRow = ({ label, value, bold, isFree, accent }) => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: bold ? 17 : 14, fontWeight: bold ? 800 : 500 }}>
      <span>{label}</span>
      <span style={{ color: isFree ? 'var(--color-success)' : accent ? 'var(--color-danger)' : 'inherit' }}>
        {isFree ? 'Free' : `${value.toLocaleString()} ${t('common.currency')}`}
      </span>
    </div>
  );
};

export default Checkout;
