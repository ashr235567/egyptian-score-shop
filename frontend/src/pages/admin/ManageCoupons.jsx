import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import { couponApi } from '../../api/adminApi';
import Loader from '../../components/common/Loader';

const emptyForm = {
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: '',
  maxDiscountAmount: '',
  minOrderValue: '',
  usageLimit: '',
  perUserLimit: 1,
  expiresAt: '',
  isActive: true
};

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await couponApi.getCoupons();
      setCoupons(data.coupons);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (coupon) => {
    setForm({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscountAmount: coupon.maxDiscountAmount || '',
      minOrderValue: coupon.minOrderValue || '',
      usageLimit: coupon.usageLimit || '',
      perUserLimit: coupon.perUserLimit,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '',
      isActive: coupon.isActive
    });
    setEditingId(coupon._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : undefined,
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        perUserLimit: Number(form.perUserLimit)
      };

      if (editingId) {
        await couponApi.updateCoupon(editingId, payload);
        toast.success('Coupon updated');
      } else {
        await couponApi.createCoupon(payload);
        toast.success('Coupon created');
      }
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await couponApi.deleteCoupon(id);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Manage Coupons</h1>
        <button onClick={openCreateForm} className="btn btn-primary">
          <FaPlus size={12} /> Add Coupon
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {coupons.map((c) => (
            <div key={c._id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: 1 }}>{c.code}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 100,
                    background: c.isActive ? 'var(--color-primary-light)' : 'var(--color-bg-secondary)',
                    color: c.isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                  }}
                >
                  {c.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', marginBottom: 12 }}>{c.description}</p>
              <div style={{ fontSize: 13, marginBottom: 4 }}>
                <strong>{c.discountType === 'percentage' ? `${c.discountValue}% off` : `${c.discountValue} EGP off`}</strong>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Min order: {c.minOrderValue} EGP</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                Used: {c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 14 }}>
                Expires: {new Date(c.expiresAt).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => openEditForm(c)} className="btn btn-outline btn-sm">
                  <FaEdit size={11} /> Edit
                </button>
                <button onClick={() => handleDelete(c._id)} className="btn btn-outline btn-sm" style={{ color: 'var(--color-danger)' }}>
                  <FaTrash size={11} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ padding: 28, maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3>{editingId ? 'Edit Coupon' : 'Add Coupon'}</h3>
              <button onClick={() => setShowForm(false)} className="icon-btn" style={{ background: 'none', border: 'none', padding: 6 }}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Coupon Code</label>
                <input required className="form-input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Discount Type</label>
                  <select className="form-select" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Value</label>
                  <input required type="number" min={0} className="form-input" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Max Discount (optional)</label>
                  <input type="number" min={0} className="form-input" value={form.maxDiscountAmount} onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Min Order Value</label>
                  <input type="number" min={0} className="form-input" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Usage Limit (optional)</label>
                  <input type="number" min={0} className="form-input" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Per-User Limit</label>
                  <input type="number" min={1} className="form-input" value={form.perUserLimit} onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input required type="date" className="form-input" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, marginBottom: 16 }}>
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                Active
              </label>
              <button type="submit" disabled={saving} className="btn btn-primary btn-block">
                {saving ? 'Saving...' : editingId ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;
