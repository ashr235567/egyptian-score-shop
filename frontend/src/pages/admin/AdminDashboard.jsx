import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FaMoneyBillWave, FaClipboardList, FaBoxOpen, FaUsers, FaExclamationTriangle } from 'react-icons/fa';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/common/Loader';

const STATUS_COLORS = { pending: '#f0a500', confirmed: '#0a7d32', processing: '#2563eb', shipped: '#7c3aed', delivered: '#1aa260', cancelled: '#e0303f' };

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getStats()
      .then(({ data }) => setStats(data.stats))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullPage />;
  if (!stats) return null;

  const statusData = Object.entries(stats.ordersByStatus).map(([status, count]) => ({ name: status, value: count }));

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon={<FaMoneyBillWave />} label="Total Revenue" value={`${stats.totalRevenue.toLocaleString()} EGP`} color="#0a7d32" />
        <StatCard icon={<FaClipboardList />} label="Total Orders" value={stats.totalOrders} color="#2563eb" />
        <StatCard icon={<FaBoxOpen />} label="Total Products" value={stats.totalProducts} color="#7c3aed" />
        <StatCard icon={<FaUsers />} label="Total Customers" value={stats.totalCustomers} color="#f0a500" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18, marginBottom: 24 }} className="charts-grid">
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ marginBottom: 18, fontSize: 15 }}>Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#0a7d32" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ marginBottom: 18, fontSize: 15 }}>Orders by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {statusData.map((entry, idx) => (
                  <Cell key={idx} fill={STATUS_COLORS[entry.name] || '#888'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="bottom-grid">
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ marginBottom: 14, fontSize: 15 }}>Recent Orders</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats.recentOrders.map((o) => (
              <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span>#{o.orderNumber}</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>{o.user?.name || 'Guest'}</span>
                <span style={{ fontWeight: 700 }}>{o.totalPrice.toLocaleString()} EGP</span>
              </div>
            ))}
          </div>
          <Link to="/admin/orders" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600, marginTop: 12, display: 'inline-block' }}>
            View all orders →
          </Link>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ marginBottom: 14, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaExclamationTriangle color="var(--color-warning)" /> Low Stock Alert
          </h3>
          {stats.lowStockProducts.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>All products are well stocked.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.lowStockProducts.map((p) => (
                <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <img src={p.coverImage} alt={p.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                  <span style={{ flex: 1 }}>{p.name}</span>
                  <span style={{ color: 'var(--color-danger)', fontWeight: 700 }}>{p.totalStock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .charts-grid, .bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{ width: 46, height: 46, borderRadius: 12, background: `${color}1a`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800 }}>{value}</div>
    </div>
  </div>
);

export default AdminDashboard;
