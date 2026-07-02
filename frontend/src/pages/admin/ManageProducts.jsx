import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { productApi } from '../../api/productApi';
import Loader from '../../components/common/Loader';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchProducts = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await productApi.getProducts({ page: p, limit: 15 });
      setProducts(data.products);
      setPages(data.pages);
      setPage(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await productApi.deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Manage Products</h1>
        <Link to="/admin/products/new" className="btn btn-primary">
          <FaPlus size={12} /> Add Product
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="card" style={{ overflow: 'auto' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-secondary)', textAlign: 'start' }}>
                <th style={thStyle}>Image</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Brand</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Stock</th>
                <th style={thStyle}>Sold</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td style={tdStyle}>
                    <img src={p.coverImage} alt={p.name} style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 6 }} />
                  </td>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>{p.brand}</td>
                  <td style={tdStyle}>{p.price.toLocaleString()} EGP</td>
                  <td style={tdStyle}>
                    <span style={{ color: p.totalStock <= 5 ? 'var(--color-danger)' : 'inherit', fontWeight: p.totalStock <= 5 ? 700 : 400 }}>
                      {p.totalStock}
                    </span>
                  </td>
                  <td style={tdStyle}>{p.sold}</td>
                  <td style={tdStyle}>
                    <span style={{ color: p.isActive ? 'var(--color-success)' : 'var(--color-text-secondary)', fontWeight: 600 }}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <Link to={`/admin/products/${p._id}/edit`} aria-label="Edit">
                        <FaEdit color="var(--color-primary)" />
                      </Link>
                      <button onClick={() => handleDelete(p._id)} className="icon-btn" style={{ background: 'none', border: 'none', padding: 6 }} aria-label="Delete">
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
              onClick={() => fetchProducts(p)}
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

export default ManageProducts;
