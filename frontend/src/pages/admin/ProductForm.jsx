import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { productApi } from '../../api/productApi';
import Loader from '../../components/common/Loader';

const CATEGORIES = ['Firm Ground', 'Indoor', 'Street', 'Turf', 'Soft Ground', 'Kids'];
const SIZE_OPTIONS = ['28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];

const emptyVariant = () => ({ color: '', colorHex: '#000000', images: [''], sizes: SIZE_OPTIONS.slice(11, 18).map((s) => ({ size: s, stock: 0 })) });

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    nameAr: '',
    brand: '',
    category: 'Firm Ground',
    description: '',
    descriptionAr: '',
    price: '',
    discountPrice: '',
    isOnSale: false,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    isActive: true,
    coverImage: '',
    tags: '',
    variants: [emptyVariant()]
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      productApi
        .getProduct(id)
        .then(({ data }) => {
          const p = data.product;
          setForm({
            name: p.name,
            nameAr: p.nameAr || '',
            brand: p.brand,
            category: p.category,
            description: p.description,
            descriptionAr: p.descriptionAr || '',
            price: p.price,
            discountPrice: p.discountPrice || '',
            isOnSale: p.isOnSale,
            isFeatured: p.isFeatured,
            isBestSeller: p.isBestSeller,
            isNewArrival: p.isNewArrival,
            isActive: p.isActive,
            coverImage: p.coverImage,
            tags: (p.tags || []).join(', '),
            variants: p.variants.length ? p.variants : [emptyVariant()]
          });
        })
        .catch(() => toast.error('Failed to load product'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const updateVariant = (idx, key, value) => {
    setForm((f) => {
      const variants = [...f.variants];
      variants[idx] = { ...variants[idx], [key]: value };
      return { ...f, variants };
    });
  };

  const updateVariantImage = (vIdx, imgIdx, value) => {
    setForm((f) => {
      const variants = [...f.variants];
      const images = [...variants[vIdx].images];
      images[imgIdx] = value;
      variants[vIdx] = { ...variants[vIdx], images };
      return { ...f, variants };
    });
  };

  const addVariantImage = (vIdx) => {
    setForm((f) => {
      const variants = [...f.variants];
      variants[vIdx] = { ...variants[vIdx], images: [...variants[vIdx].images, ''] };
      return { ...f, variants };
    });
  };

  const removeVariantImage = (vIdx, imgIdx) => {
    setForm((f) => {
      const variants = [...f.variants];
      const images = variants[vIdx].images.filter((_, i) => i !== imgIdx);
      variants[vIdx] = { ...variants[vIdx], images: images.length ? images : [''] };
      return { ...f, variants };
    });
  };

  const updateSizeStock = (vIdx, sizeIdx, stock) => {
    setForm((f) => {
      const variants = [...f.variants];
      const sizes = [...variants[vIdx].sizes];
      sizes[sizeIdx] = { ...sizes[sizeIdx], stock: Number(stock) };
      variants[vIdx] = { ...variants[vIdx], sizes };
      return { ...f, variants };
    });
  };

  const toggleSize = (vIdx, size) => {
    setForm((f) => {
      const variants = [...f.variants];
      const sizes = [...variants[vIdx].sizes];
      const existingIdx = sizes.findIndex((s) => s.size === size);
      if (existingIdx > -1) {
        sizes.splice(existingIdx, 1);
      } else {
        sizes.push({ size, stock: 0 });
      }
      variants[vIdx] = { ...variants[vIdx], sizes };
      return { ...f, variants };
    });
  };

  const addVariant = () => setForm((f) => ({ ...f, variants: [...f.variants, emptyVariant()] }));
  const removeVariant = (idx) => setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        variants: form.variants
          .filter((v) => v.color.trim())
          .map((v) => ({ ...v, images: v.images.filter((img) => img.trim()) }))
      };

      if (isEdit) {
        await productApi.updateProduct(id, payload);
        toast.success('Product updated successfully');
      } else {
        await productApi.createProduct(payload);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 22 }}>{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: 24, marginBottom: 18 }}>
          <h3 style={{ marginBottom: 18 }}>Basic Information</h3>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Name (English)</label>
              <input required className="form-input" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Name (Arabic)</label>
              <input className="form-input" dir="rtl" value={form.nameAr} onChange={(e) => updateField('nameAr', e.target.value)} />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input required className="form-input" value={form.brand} onChange={(e) => updateField('brand', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={(e) => updateField('category', e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description (English)</label>
            <textarea required rows={3} className="form-textarea" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Description (Arabic)</label>
            <textarea rows={3} dir="rtl" className="form-textarea" value={form.descriptionAr} onChange={(e) => updateField('descriptionAr', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <input required className="form-input" value={form.coverImage} onChange={(e) => updateField('coverImage', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input className="form-input" value={form.tags} onChange={(e) => updateField('tags', e.target.value)} />
          </div>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 18 }}>
          <h3 style={{ marginBottom: 18 }}>Pricing</h3>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Price (EGP)</label>
              <input required type="number" min={0} className="form-input" value={form.price} onChange={(e) => updateField('price', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Discount Price (EGP)</label>
              <input type="number" min={0} className="form-input" value={form.discountPrice} onChange={(e) => updateField('discountPrice', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <CheckboxLabel label="On Sale" checked={form.isOnSale} onChange={(v) => updateField('isOnSale', v)} />
            <CheckboxLabel label="Featured" checked={form.isFeatured} onChange={(v) => updateField('isFeatured', v)} />
            <CheckboxLabel label="Best Seller" checked={form.isBestSeller} onChange={(v) => updateField('isBestSeller', v)} />
            <CheckboxLabel label="New Arrival" checked={form.isNewArrival} onChange={(v) => updateField('isNewArrival', v)} />
            <CheckboxLabel label="Active" checked={form.isActive} onChange={(v) => updateField('isActive', v)} />
          </div>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3>Colors & Sizes</h3>
            <button type="button" onClick={addVariant} className="btn btn-outline btn-sm">
              <FaPlus size={11} /> Add Color
            </button>
          </div>

          {form.variants.map((variant, vIdx) => (
            <div key={vIdx} style={{ border: '1px solid var(--color-border)', borderRadius: 10, padding: 18, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 13.5 }}>Variant {vIdx + 1}</span>
                {form.variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(vIdx)} className="icon-btn" style={{ background: 'none', border: 'none', padding: 6 }}>
                    <FaTrash size={13} color="var(--color-danger)" />
                  </button>
                )}
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Color Name</label>
                  <input required className="form-input" value={variant.color} onChange={(e) => updateVariant(vIdx, 'color', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Color Hex</label>
                  <input type="color" className="form-input" style={{ height: 42, padding: 4 }} value={variant.colorHex} onChange={(e) => updateVariant(vIdx, 'colorHex', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Images (URLs)</label>
                {variant.images.map((img, imgIdx) => (
                  <div key={imgIdx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      className="form-input"
                      placeholder="https://..."
                      value={img}
                      onChange={(e) => updateVariantImage(vIdx, imgIdx, e.target.value)}
                    />
                    <button type="button" onClick={() => removeVariantImage(vIdx, imgIdx)} className="btn btn-outline btn-sm" style={{ width: 38, padding: 0 }}>
                      <FaTrash size={11} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addVariantImage(vIdx)} className="btn btn-outline btn-sm">
                  <FaPlus size={10} /> Add Image
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Available Sizes</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {SIZE_OPTIONS.map((size) => {
                    const active = variant.sizes.some((s) => s.size === size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(vIdx, size)}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 6,
                          border: `1.5px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          background: active ? 'var(--color-primary-light)' : 'transparent',
                          color: active ? 'var(--color-primary)' : 'var(--color-text)',
                          fontSize: 12,
                          fontWeight: 600
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {variant.sizes.map((s, sIdx) => (
                    <div key={s.size} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, minWidth: 24 }}>{s.size}:</span>
                      <input
                        type="number"
                        min={0}
                        value={s.stock}
                        onChange={(e) => updateSizeStock(vIdx, sIdx, e.target.value)}
                        className="form-input"
                        style={{ width: 64, padding: '6px 8px', fontSize: 12.5 }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>

      <style>{`
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-row-3 { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; }
        @media (max-width: 700px) {
          .form-row-2, .form-row-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const CheckboxLabel = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    {label}
  </label>
);

export default ProductForm;
