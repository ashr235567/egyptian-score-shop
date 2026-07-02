import { NavLink, Outlet, Link } from 'react-router-dom';
import { FaChartLine, FaBoxOpen, FaClipboardList, FaUsers, FaTicketAlt, FaArrowLeft, FaUserShield } from 'react-icons/fa';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: <FaChartLine />, end: true },
  { to: '/admin/products', label: 'Products', icon: <FaBoxOpen /> },
  { to: '/admin/orders', label: 'Orders', icon: <FaClipboardList /> },
  { to: '/admin/customers', label: 'Customers', icon: <FaUsers /> },
  { to: '/admin/coupons', label: 'Coupons', icon: <FaTicketAlt /> },
  { to: '/admin/admins', label: 'Admins', icon: <FaUserShield /> }
];

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: 'var(--color-bg-elevated)',
          borderInlineEnd: '1px solid var(--color-border)',
          padding: 20,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto'
        }}
        className="admin-sidebar"
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 30, fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 600 }}>
          <FaArrowLeft size={12} /> Back to Store
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 30 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
            ES
          </div>
          <span style={{ fontWeight: 800, fontSize: 14 }}>Admin Panel</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                background: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? '#fff' : 'var(--color-text)'
              })}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 28, background: 'var(--color-bg-secondary)', minWidth: 0 }}>
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 860px) {
          .admin-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
