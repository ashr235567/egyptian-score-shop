import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaTruck, FaCertificate, FaMoneyBillWave, FaUndo, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { productApi } from '../api/productApi';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';
import RatingStars from '../components/common/RatingStars';

const CATEGORIES = [
  { key: 'Firm Ground', label: 'Firm Ground', img: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=600' },
  { key: 'Turf', label: 'Turf', img: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=600' },
  { key: 'Indoor', label: 'Indoor', img: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=600' },
  { key: 'Kids', label: 'Kids', img: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600' }
];

const BRANDS = ['Nike', 'Adidas', 'Puma'];

const TESTIMONIALS = [
  { name: 'Karim H.', rating: 5, text: 'Got my Mercurial boots in 2 days, 100% authentic. WhatsApp ordering made it so easy!' },
  { name: 'Youssef A.', rating: 5, text: 'Excellent quality and the sizing guide was spot on. Will definitely order again.' },
  { name: 'Mohamed S.', rating: 4.5, text: 'Great customer service over WhatsApp, they helped me pick the right size for my son.' }
];

const Home = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [onSale, setOnSale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [bsRes, naRes, osRes] = await Promise.all([
          productApi.getProducts({ bestSeller: true, limit: 8 }),
          productApi.getProducts({ newArrival: true, limit: 8 }),
          productApi.getProducts({ onSale: true, limit: 8 })
        ]);
        setBestSellers(bsRes.data.products);
        setNewArrivals(naRes.data.products);
        setOnSale(osRes.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success(isAr ? 'تم الاشتراك بنجاح!' : 'Subscribed successfully!');
    setEmail('');
  };

  return (
    <div>
      {/* Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ padding: '80px 20px', position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: 560 }}
          >
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.15)',
                padding: '6px 14px',
                borderRadius: 100,
                fontSize: 12.5,
                fontWeight: 700,
                marginBottom: 18,
                letterSpacing: 0.5
              }}
            >
              ⚽ 100% ORIGINAL FOOTBALL BOOTS
            </span>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
              {t('home.heroTitle')}
            </h1>
            <p style={{ fontSize: 17, opacity: 0.92, marginBottom: 30, lineHeight: 1.6 }}>{t('home.heroSubtitle')}</p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/products" className="btn" style={{ background: '#fff', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                {t('home.shopNow')} <FaArrowRight className="icon-flip" />
              </Link>
              <Link to="/products" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)' }}>
                {t('home.browseCategories')}
              </Link>
            </div>
          </motion.div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1511886929837-354d827aae26?w=900"
          alt="Football boots"
          style={{
            position: 'absolute',
            insetInlineEnd: '-5%',
            top: '50%',
            transform: 'translateY(-50%) rotate(-8deg)',
            width: 420,
            opacity: 0.35,
            zIndex: 1
          }}
          className="hero-image"
        />
      </section>

      {/* Trust badges */}
      <section className="container" style={{ padding: '32px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { icon: <FaTruck size={22} />, title: t('home.freeShipping'), desc: t('home.freeShippingDesc') },
            { icon: <FaCertificate size={22} />, title: t('home.originalGuarantee'), desc: t('home.originalGuaranteeDesc') },
            { icon: <FaMoneyBillWave size={22} />, title: t('home.codAvailable'), desc: t('home.codAvailableDesc') },
            { icon: <FaUndo size={22} />, title: t('home.easyReturns'), desc: t('home.easyReturnsDesc') }
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ color: 'var(--color-primary)' }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{item.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container section">
        <h2 className="section-title">{t('home.featuredCategories')}</h2>
        <p className="section-subtitle">{t('home.browseCategories')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18 }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              to={`/products?category=${encodeURIComponent(cat.key)}`}
              className="card fade-in"
              style={{ overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}
            >
              <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent 60%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 16
                }}
              >
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{cat.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {loading ? (
        <Loader fullPage />
      ) : (
        <>
          {/* Best Sellers */}
          {bestSellers.length > 0 && (
            <section className="container section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                <h2 className="section-title">{t('home.bestSellers')}</h2>
                <Link to="/products?bestSeller=true" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 14 }}>
                  {t('home.viewAll')}
                </Link>
              </div>
              <div className="product-grid">
                {bestSellers.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* New Arrivals */}
          {newArrivals.length > 0 && (
            <section className="container section" style={{ background: 'var(--color-bg-secondary)', borderRadius: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8, padding: '0 8px' }}>
                <h2 className="section-title">{t('home.newArrivals')}</h2>
                <Link to="/products?newArrival=true" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 14 }}>
                  {t('home.viewAll')}
                </Link>
              </div>
              <div className="product-grid" style={{ padding: '0 8px' }}>
                {newArrivals.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* Special Offers */}
          {onSale.length > 0 && (
            <section className="container section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                <h2 className="section-title">{t('home.specialOffers')}</h2>
                <Link to="/products?onSale=true" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: 14 }}>
                  {t('home.viewAll')}
                </Link>
              </div>
              <div className="product-grid">
                {onSale.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Available Brands */}
      <section className="container section">
        <h2 className="section-title">{t('home.availableBrands')}</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {BRANDS.map((brand) => (
            <Link
              key={brand}
              to={`/products?brand=${encodeURIComponent(brand)}`}
              className="card"
              style={{
                padding: '20px 36px',
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: 1,
                flex: '1 1 200px',
                textAlign: 'center'
              }}
            >
              {brand.toUpperCase()}
            </Link>
          ))}
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="container section">
        <h2 className="section-title">{t('home.customerReviews')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          {TESTIMONIALS.map((rev, idx) => (
            <div key={idx} className="card" style={{ padding: 22 }}>
              <RatingStars rating={rev.rating} size={15} />
              <p style={{ margin: '14px 0', fontSize: 14.5, lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                "{rev.text}"
              </p>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{rev.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ background: 'var(--color-primary)', color: '#fff' }}>
        <div className="container" style={{ padding: '52px 20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{t('home.newsletterTitle')}</h2>
          <p style={{ opacity: 0.9, marginBottom: 24 }}>{t('home.newsletterSubtitle')}</p>
          <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: 10, maxWidth: 420, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('home.emailPlaceholder')}
              style={{ flex: 1, minWidth: 220, padding: '13px 16px', borderRadius: 8, border: 'none', fontSize: 14.5 }}
            />
            <button type="submit" className="btn" style={{ background: '#fff', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
              {t('home.subscribe')}
            </button>
          </form>
        </div>
      </section>

      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        @media (max-width: 1024px) {
          .product-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-image { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Home;
