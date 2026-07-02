import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHeart } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';

const Wishlist = () => {
  const { t } = useTranslation();
  const { items, loading } = useWishlist();

  if (loading) return <Loader fullPage />;

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <FaHeart size={56} color="var(--color-border)" />
        <h2 style={{ marginTop: 20 }}>{t('wishlist.empty')}</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>{t('wishlist.emptyDesc')}</p>
        <Link to="/products" className="btn btn-primary">
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 20px 60px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>{t('wishlist.title')}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
        {items.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
