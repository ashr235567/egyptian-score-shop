import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaBox, FaTruck, FaHome, FaClock, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { orderApi } from '../api/orderApi';
import Loader from '../components/common/Loader';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const STATUS_ICONS = {
  pending: <FaClock />,
  confirmed: <FaCheckCircle />,
  processing: <FaBox />,
  shipped: <FaTruck />,
  delivered: <FaHome />,
  cancelled: <FaTimesCircle />
};

const OrderTracking = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await orderApi.trackOrder(orderNumber.trim(), phone.trim());
      setOrder(data.order);
    } catch (err) {
      setOrder(null);
      toast.error(t('tracking.notFound'));
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;
  const isCancelled = order?.status === 'cancelled';

  return (
    <div className="container" style={{ padding: '50px 20px 70px', maxWidth: 700 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>{t('tracking.title')}</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>{t('tracking.subtitle')}</p>
      </div>

      <form onSubmit={handleTrack} className="card" style={{ padding: 24, marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="track-form">
          <div className="form-group">
            <label className="form-label">{t('tracking.orderNumber')}</label>
            <input required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="form-input" placeholder="ESS-XXXXXXXXX" />
          </div>
          <div className="form-group">
            <label className="form-label">{t('tracking.phone')}</label>
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" placeholder="01XXXXXXXXX" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: 10 }}>
          {t('tracking.track')}
        </button>
        <style>{`
          @media (max-width: 600px) {
            .track-form { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </form>

      {loading && <Loader />}

      {!loading && searched && !order && (
        <div className="card" style={{ padding: 30, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          {t('tracking.notFound')}
        </div>
      )}

      {!loading && order && (
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Order Number</div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{order.orderNumber}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{t('tracking.orderDate')}</div>
              <div style={{ fontWeight: 700 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{t('cart.total')}</div>
              <div style={{ fontWeight: 700 }}>{order.totalPrice.toLocaleString()} {t('common.currency')}</div>
            </div>
          </div>

          {/* Status timeline */}
          {!isCancelled ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30, position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 18,
                  insetInlineStart: '10%',
                  insetInlineEnd: '10%',
                  height: 2,
                  background: 'var(--color-border)',
                  zIndex: 0
                }}
              />
              {STATUS_STEPS.map((step, idx) => {
                const reached = idx <= currentStepIndex;
                return (
                  <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: reached ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                        color: reached ? '#fff' : 'var(--color-text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: reached ? 'none' : '1px solid var(--color-border)'
                      }}
                    >
                      {STATUS_ICONS[step]}
                    </div>
                    <span style={{ fontSize: 11, marginTop: 6, textAlign: 'center', fontWeight: reached ? 700 : 500 }}>
                      {t(`orderStatus.${step}`)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-danger)', fontWeight: 700, marginBottom: 24 }}>
              <FaTimesCircle /> {t('orderStatus.cancelled')}
            </div>
          )}

          <h4 style={{ marginBottom: 14 }}>{t('tracking.items')}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1, fontSize: 13.5 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>
                    {item.color} / {item.size} x{item.quantity}
                  </div>
                </div>
                <span style={{ fontWeight: 700 }}>{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
