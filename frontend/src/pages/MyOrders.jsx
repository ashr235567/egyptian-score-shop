import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { orderApi } from '../api/orderApi';
import Loader from '../components/common/Loader';

const STATUS_COLORS = {
  pending: '#f0a500',
  confirmed: '#0a7d32',
  processing: '#2563eb',
  shipped: '#7c3aed',
  delivered: '#1aa260',
  cancelled: '#e0303f'
};

const MyOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi
      .getMyOrders()
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>You haven't placed any orders yet.</p>
        <Link to="/products" className="btn btn-primary">
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {orders.map((order) => (
        <div key={order._id} className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
            <div>
              <span style={{ fontWeight: 800 }}>#{order.orderNumber}</span>
              <span style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', marginInlineStart: 10 }}>
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 100,
                fontSize: 11.5,
                fontWeight: 700,
                color: '#fff',
                background: STATUS_COLORS[order.status]
              }}
            >
              {t(`orderStatus.${order.status}`)}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 12 }}>
            {order.items.map((item, idx) => (
              <img key={idx} src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700 }}>
              {order.totalPrice.toLocaleString()} {t('common.currency')}
            </span>
            <Link to={`/track-order?orderNumber=${order.orderNumber}`} style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
              {t('nav.trackOrder')}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
