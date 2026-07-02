import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../api/authApi';

const ResetPassword = () => {
  const { resettoken } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.resetPassword(resettoken, { password: form.password });
      localStorage.setItem('ess_token', data.token);
      toast.success('Password reset successfully!');
      navigate('/');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 440 }}>
      <div className="card" style={{ padding: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="form-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              required
              className="form-input"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
