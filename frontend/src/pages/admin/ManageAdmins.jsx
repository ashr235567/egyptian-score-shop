import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaUserShield, FaSearch, FaArrowDown, FaPlus, FaTimes } from 'react-icons/fa';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';

const ManageAdmins = () => {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPromote, setShowPromote] = useState(false);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await userApi.getUsers({ role: 'admin', limit: 50 });
      setAdmins(data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setSearching(true);
    try {
      const { data } = await userApi.getUsers({ role: 'customer', search: search.trim(), limit: 10 });
      setResults(data.users);
    } finally {
      setSearching(false);
    }
  };

  const promote = async (targetUser) => {
    try {
      await userApi.updateUser(targetUser._id, { role: 'admin' });
      toast.success(`${targetUser.name} is now an admin`);
      setShowPromote(false);
      setResults([]);
      setSearch('');
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to promote user');
    }
  };

  const demote = async (targetUser) => {
    if (targetUser._id === currentUser?._id) {
      toast.error("You can't remove your own admin access");
      return;
    }
    if (!window.confirm(`Remove admin privileges from ${targetUser.name}?`)) return;
    try {
      await userApi.updateUser(targetUser._id, { role: 'customer' });
      toast.success(`${targetUser.name} is no longer an admin`);
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Manage Admins</h1>
        <button onClick={() => setShowPromote(true)} className="btn btn-primary">
          <FaPlus size={12} /> Promote User
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-secondary)', textAlign: 'start' }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Joined</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a._id} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td style={tdStyle}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <FaUserShield color="var(--color-primary)" size={13} /> {a.name}
                      {a._id === currentUser?._id && (
                        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>(you)</span>
                      )}
                    </span>
                  </td>
                  <td style={tdStyle}>{a.email}</td>
                  <td style={tdStyle}>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => demote(a)}
                      disabled={a._id === currentUser?._id}
                      style={{ background: 'none', border: 'none', color: a._id === currentUser?._id ? 'var(--color-border)' : 'var(--color-danger)', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, cursor: a._id === currentUser?._id ? 'not-allowed' : 'pointer' }}
                      title="Remove admin privileges"
                    >
                      <FaArrowDown size={11} /> Demote
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPromote && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ padding: 28, maxWidth: 460, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3>Promote a Customer to Admin</h3>
              <button onClick={() => { setShowPromote(false); setResults([]); setSearch(''); }} className="icon-btn" style={{ background: 'none', border: 'none', padding: 6 }}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="form-input"
                style={{ flex: 1 }}
              />
              <button type="submit" disabled={searching} className="btn btn-outline btn-sm">
                <FaSearch size={12} />
              </button>
            </form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto' }}>
              {results.length === 0 && !searching && (
                <p style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>Search for an existing customer by name or email.</p>
              )}
              {results.map((u) => (
                <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{u.email}</div>
                  </div>
                  <button onClick={() => promote(u)} className="btn btn-primary btn-sm">
                    Promote
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const thStyle = { padding: '12px 14px', fontWeight: 700, fontSize: 12 };
const tdStyle = { padding: '10px 14px' };

export default ManageAdmins;
