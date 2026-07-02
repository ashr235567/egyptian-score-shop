import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../api/authApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
      toast.success('Reset email sent if the account exists');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 440 }}>
      <div className="card" style={{ padding: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Forgot Password</h1>
        {sent ? (
          <p style={{ color: 'var(--color-text-secondary)' }}>
            If an account exists for {email}, you'll receive a password reset link shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" required className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
              Send Reset Link
            </button>
          </form>
        )}
        <Link to="/login" style={{ display: 'block', textAlign: 'center', marginTop: 18, fontSize: 13.5, color: 'var(--color-primary)' }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
