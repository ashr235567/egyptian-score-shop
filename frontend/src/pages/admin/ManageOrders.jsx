import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { orderApi } from '../../api/orderApi';
import Loader from '../../components/common/Loader';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = { pending: '#f0a500', confirmed: '#0a7d32', processing: '#2563eb', shipped: '#7c3aed', delivered: '#1aa260', cancelled: '#e0303f' };

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async (p = 1, status = statusFilter) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 15 };
      if (status) params.status = status;
      const { data } = await orderApi.getAllOrders(params);
      setOrders(data.orders);
      setPages(data.pages);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, statusFilter);
  }, [statusFilter]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderApi.updateOrderStatus(orderId, { status });
      toast.success('Order status updated');
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Manage Orders</h1>
        <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 200 }}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((order) => (
            <div key={order._id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800 }}>#{order.orderNumber}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>
                    {order.user?.name || 'Guest'} · {order.shippingAddress.phone} · {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontWeight: 700 }}>{order.totalPrice.toLocaleString()} EGP</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="form-select"
                    style={{
                      width: 150,
                      padding: '7px 10px',
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: STATUS_COLORS[order.status],
                      borderColor: STATUS_COLORS[order.status]
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                    className="btn btn-outline btn-sm"
                  >
                    {expandedId === order._id ? 'Hide' : 'Details'}
                  </button>
                </div>
              </div>

              {expandedId === order._id && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="order-detail-grid">
                    <div>
                      <h4 style={{ fontSize: 13, marginBottom: 8 }}>Shipping Address</h4>
                      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                        {order.shippingAddress.fullName}
                        <br />
                        {order.shippingAddress.street}, Bldg {order.shippingAddress.building || '-'}, Floor {order.shippingAddress.floor || '-'}
                        <br />
                        {order.shippingAddress.city}, {order.shippingAddress.governorate}
                        <br />
                        {order.shippingAddress.phone}
                      </p>
                    </div>
                    <div>
                      <h4 style={{ fontSize: 13, marginBottom: 8 }}>Items</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: 8, fontSize: 12.5 }}>
                            <img src={item.image} alt={item.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                            <span style={{ flex: 1 }}>
                              {item.name} ({item.color}, {item.size}) x{item.quantity}
                            </span>
                            <span style={{ fontWeight: 700 }}>{(item.price * item.quantity).toLocaleString()} EGP</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'center' }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchOrders(p)}
              className="btn btn-sm"
              style={{ background: p === page ? 'var(--color-primary)' : 'transparent', color: p === page ? '#fff' : 'inherit', border: '1px solid var(--color-border)' }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 700px) {
          .order-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default ManageOrders;
