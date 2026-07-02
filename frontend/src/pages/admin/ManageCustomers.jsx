import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaSearch, FaBan, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { userApi } from '../../api/userApi';
import Loader from '../../components/common/Loader';

const ManageCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchUsers = async (p = 1, q = search) => {
    setLoading(true);
    try {
      const { data } = await userApi.getUsers({ page: p, limit: 15, search: q, role: 'customer' });
      setUsers(data.users);
      setPages(data.pages);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, '');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, search);
  };

  const toggleActive = async (user) => {
    try {
      await userApi.updateUser(user._id, { isActive: !user.isActive });
      toast.success(`Customer ${user.isActive ? 'deactivated' : 'activated'}`);
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u)));
    } catch (err) {
      toast.error('Failed to update customer');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer account?')) return;
    try {
      await userApi.deleteUser(id);
      toast.success('Customer deleted');
      fetchUsers(page);
    } catch (err) {
      toast.error('Failed to delete customer');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Manage Customers</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="form-input"
            style={{ width: 240 }}
          />
          <button type="submit" className="btn btn-outline btn-sm">
            <FaSearch size={12} />
          </button>
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-secondary)', textAlign: 'start' }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Joined</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.phone || '-'}</td>
                  <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    <span style={{ color: u.isActive ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700 }}>
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => toggleActive(u)} className="icon-btn" style={{ background: 'none', border: 'none', padding: 6 }} title={u.isActive ? 'Deactivate' : 'Activate'}>
                        {u.isActive ? <FaBan color="var(--color-warning)" /> : <FaCheckCircle color="var(--color-success)" />}
                      </button>
                      <button onClick={() => handleDelete(u._id)} className="icon-btn" style={{ background: 'none', border: 'none', padding: 6 }} title="Delete">
                        <FaTrash color="var(--color-danger)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'center' }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchUsers(p)}
              className="btn btn-sm"
              style={{ background: p === page ? 'var(--color-primary)' : 'transparent', color: p === page ? '#fff' : 'inherit', border: '1px solid var(--color-border)' }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const thStyle = { padding: '12px 14px', fontWeight: 700, fontSize: 12 };
const tdStyle = { padding: '10px 14px' };

export default ManageCustomers;
