import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';

const ProfileLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="container" style={{ padding: '32px 20px 60px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>{t('nav.myAccount')}</h1>
      <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28 }}>
        <nav className="card" style={{ padding: 10, height: 'fit-content' }}>
          <ProfileLink to="/profile" label={t('nav.myAccount')} end />
          <ProfileLink to="/profile/orders" label={t('nav.myOrders')} />
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .profile-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const ProfileLink = ({ to, label, end }) => (
  <NavLink
    to={to}
    end={end}
    style={({ isActive }) => ({
      display: 'block',
      padding: '11px 14px',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 4,
      background: isActive ? 'var(--color-primary-light)' : 'transparent',
      color: isActive ? 'var(--color-primary)' : 'var(--color-text)'
    })}
  >
    {label}
  </NavLink>
);

export const ProfileDetails = () => {
  const { t } = useTranslation();
  const { user, updateUserState } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await authApi.updateDetails(form);
      updateUserState(data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await authApi.updatePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <form onSubmit={handleProfileSubmit} className="card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 18 }}>Account Details</h3>
        <div className="form-group">
          <label className="form-label">{t('auth.name')}</label>
          <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">{t('auth.email')}</label>
          <input className="form-input" value={user?.email} disabled style={{ opacity: 0.7 }} />
        </div>
        <div className="form-group">
          <label className="form-label">{t('auth.phone')}</label>
          <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <button type="submit" disabled={savingProfile} className="btn btn-primary">
          {t('common.save')}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 18 }}>Change Password</h3>
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            required
            className="form-input"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">New Password</label>
          <input
            type="password"
            required
            minLength={6}
            className="form-input"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          />
        </div>
        <button type="submit" disabled={savingPassword} className="btn btn-primary">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ProfileLayout;
