import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const FREE_SHIPPING_THRESHOLD = 3000;
const SHIPPING_FLAT_RATE = 60;

const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <FaShoppingBag size={56} color="var(--color-border)" />
        <h2 style={{ marginTop: 20 }}>{t('cart.empty')}</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>{t('cart.emptyDesc')}</p>
        <Link to="/products" className="btn btn-primary">
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 20px 60px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>{t('cart.title')}</h1>

      <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.color}-${item.size}`}
              className="card"
              style={{ display: 'flex', gap: 14, padding: 14, alignItems: 'center' }}
            >
              <Link to={`/products/${item.slug}`} style={{ flexShrink: 0 }}>
                <img src={item.image} alt={item.name} style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 10 }} />
              </Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/products/${item.slug}`} style={{ fontWeight: 700, fontSize: 14.5 }}>
                  {item.name}
                </Link>
                <p style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', margin: '4px 0' }}>
                  {item.color} / {t('product.selectSize')}: {item.size}
                </p>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                  {item.price.toLocaleString()} {t('common.currency')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                  className="btn btn-outline btn-sm"
                  style={{ width: 30, height: 30, padding: 0 }}
                >
                  <FaMinus size={9} />
                </button>
                <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                  className="btn btn-outline btn-sm"
                  style={{ width: 30, height: 30, padding: 0 }}
                >
                  <FaPlus size={9} />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.productId, item.color, item.size)}
                aria-label={t('cart.remove')}
                style={{ background: 'none', border: 'none', color: 'var(--color-danger)', padding: 8 }}
              >
                <FaTrash size={15} />
              </button>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 22, position: 'sticky', top: 100 }}>
          <h3 style={{ marginBottom: 18 }}>{t('checkout.orderSummary')}</h3>
          <SummaryRow label={t('cart.subtotal')} value={subtotal} />
          <SummaryRow label={t('cart.shipping')} value={shipping} isFree={shipping === 0} />
          {subtotal < FREE_SHIPPING_THRESHOLD && (
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 12 }}>{t('cart.freeShippingNote')}</p>
          )}
          <div style={{ borderTop: '1px solid var(--color-border)', margin: '14px 0', paddingTop: 14 }}>
            <SummaryRow label={t('cart.total')} value={total} bold />
          </div>
          <button onClick={() => navigate('/checkout')} className="btn btn-primary btn-block">
            {t('cart.proceedToCheckout')}
          </button>
          <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13.5, color: 'var(--color-text-secondary)' }}>
            {t('cart.continueShopping')}
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .cart-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const SummaryRow = ({ label, value, bold, isFree }) => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: bold ? 17 : 14, fontWeight: bold ? 800 : 500 }}>
      <span>{label}</span>
      <span style={{ color: isFree ? 'var(--color-success)' : 'inherit' }}>
        {isFree ? 'Free' : `${value.toLocaleString()} ${t('common.currency')}`}
      </span>
    </div>
  );
};

export default Cart;
