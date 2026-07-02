import { useLocation, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaWhatsapp } from 'react-icons/fa';

const OrderSuccess = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { order, whatsappLink } = location.state || {};

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="container" style={{ padding: '70px 20px', textAlign: 'center', maxWidth: 560 }}>
      <FaCheckCircle size={64} color="var(--color-success)" />
      <h1 style={{ fontSize: 26, fontWeight: 800, marginTop: 20 }}>{t('checkout.orderSuccess')}</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }}>{t('checkout.orderSuccessDesc')}</p>
      <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 28 }}>Order #{order.orderNumber}</p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
          <FaWhatsapp size={18} /> {t('checkout.openWhatsApp')}
        </a>
        <Link to={`/track-order?orderNumber=${order.orderNumber}`} className="btn btn-outline">
          {t('nav.trackOrder')}
        </Link>
        <Link to="/products" className="btn btn-outline">
          {t('cart.continueShopping')}
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
