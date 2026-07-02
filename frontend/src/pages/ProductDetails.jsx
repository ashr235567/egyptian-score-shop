import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart, FaMinus, FaPlus, FaWhatsapp } from 'react-icons/fa';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import RatingStars from '../components/common/RatingStars';
import PriceTag from '../components/common/PriceTag';
import ProductCard from '../components/common/ProductCard';
import { WHATSAPP_NUMBER } from '../config';

const ProductDetails = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await productApi.getProduct(slug);
        setProduct(data.product);
        setSelectedVariant(data.product.variants[0] || null);
        setSelectedImage(0);
        setSelectedSize(null);
        setQuantity(1);

        const relatedRes = await productApi.getRelated(data.product._id);
        setRelated(relatedRes.data.products);
      } catch (err) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (loading) return <Loader fullPage />;
  if (!product) return null;

  const displayName = isAr && product.nameAr ? product.nameAr : product.name;
  const displayDescription = isAr && product.descriptionAr ? product.descriptionAr : product.description;
  const hasDiscount = product.isOnSale && product.discountPrice > 0;
  const finalPrice = hasDiscount ? product.discountPrice : product.price;
  const currentSizeStock = selectedSize ? selectedVariant?.sizes.find((s) => s.size === selectedSize)?.stock || 0 : null;
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error(t('product.pleaseSelectColor'));
      return;
    }
    if (!selectedSize) {
      toast.error(t('product.pleaseSelectSize'));
      return;
    }
    addItem({
      productId: product._id,
      slug: product.slug,
      name: displayName,
      image: selectedVariant.images[0] || product.coverImage,
      color: selectedVariant.color,
      size: selectedSize,
      price: finalPrice,
      quantity,
      maxStock: currentSizeStock
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (selectedVariant && selectedSize) {
      navigate('/cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      const { data } = await productApi.addReview(product._id, reviewForm);
      setProduct(data.product);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const whatsappQuestion = encodeURIComponent(`Hi! I have a question about: ${product.name} (${product.slug})`);

  return (
    <div className="container" style={{ padding: '32px 20px 60px' }}>
      <div className="pdp-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 44 }}>
        {/* Gallery */}
        <div>
          <div className="card" style={{ aspectRatio: '1/1', overflow: 'hidden', marginBottom: 12 }}>
            <img
              src={selectedVariant?.images[selectedImage] || product.coverImage}
              alt={displayName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {(selectedVariant?.images || [product.coverImage]).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: selectedImage === idx ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  padding: 0
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            {product.brand}
          </span>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0' }}>{displayName}</h1>
          <RatingStars rating={product.rating} showCount count={product.numReviews} size={15} />
          <div style={{ margin: '18px 0' }}>
            <PriceTag price={product.price} discountPrice={product.discountPrice} isOnSale={product.isOnSale} size="lg" />
          </div>

          {product.variants.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">{t('product.selectColor')}: {selectedVariant?.color}</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {product.variants.map((v) => (
                  <button
                    key={v.color}
                    onClick={() => {
                      setSelectedVariant(v);
                      setSelectedImage(0);
                      setSelectedSize(null);
                    }}
                    title={v.color}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: v.colorHex,
                      border: selectedVariant?.color === v.color ? '3px solid var(--color-primary)' : '2px solid var(--color-border)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {selectedVariant && (
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">{t('product.selectSize')}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedVariant.sizes.map((s) => {
                  const disabled = s.stock === 0;
                  const active = selectedSize === s.size;
                  return (
                    <button
                      key={s.size}
                      disabled={disabled}
                      onClick={() => setSelectedSize(s.size)}
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 8,
                        border: `1.5px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: active ? 'var(--color-primary-light)' : 'transparent',
                        color: disabled ? 'var(--color-border)' : active ? 'var(--color-primary)' : 'var(--color-text)',
                        fontWeight: 700,
                        textDecoration: disabled ? 'line-through' : 'none',
                        cursor: disabled ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
              {selectedSize && currentSizeStock > 0 && currentSizeStock <= 5 && (
                <p style={{ color: 'var(--color-warning)', fontSize: 12.5, marginTop: 8, fontWeight: 600 }}>
                  {t('product.lowStock', { count: currentSizeStock })}
                </p>
              )}
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <label className="form-label">{t('product.quantity')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="btn btn-outline btn-sm"
                style={{ width: 36, height: 36, padding: 0 }}
              >
                <FaMinus size={11} />
              </button>
              <span style={{ fontWeight: 700, fontSize: 16, minWidth: 24, textAlign: 'center' }}>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => (currentSizeStock ? Math.min(currentSizeStock, q + 1) : q + 1))}
                className="btn btn-outline btn-sm"
                style={{ width: 36, height: 36, padding: 0 }}
              >
                <FaPlus size={11} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={handleAddToCart} className="btn btn-primary" style={{ flex: 1, minWidth: 180 }}>
              {t('product.addToCart')}
            </button>
            <button onClick={handleBuyNow} className="btn btn-accent" style={{ flex: 1, minWidth: 180 }}>
              {t('product.buyNow')}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className="btn btn-outline"
              style={{ width: 48, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label={t('product.addToWishlist')}
            >
              {inWishlist ? <FaHeart color="var(--color-danger)" /> : <FaRegHeart />}
            </button>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappQuestion}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, color: '#25D366', fontWeight: 600, fontSize: 13.5 }}
          >
            <FaWhatsapp size={18} /> Ask about this product on WhatsApp
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginTop: 56 }}>
        <div style={{ display: 'flex', gap: 28, borderBottom: '1px solid var(--color-border)', marginBottom: 24 }}>
          {['description', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 4px',
                fontWeight: 700,
                fontSize: 15,
                color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent'
              }}
            >
              {t(`product.${tab}`)} {tab === 'reviews' && `(${product.numReviews})`}
            </button>
          ))}
        </div>

        {activeTab === 'description' ? (
          <p style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)', maxWidth: 760 }}>{displayDescription}</p>
        ) : (
          <div style={{ maxWidth: 700 }}>
            {product.reviews.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)' }}>{t('product.noReviewsYet')}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 32 }}>
                {product.reviews.map((review) => (
                  <div key={review._id} className="card" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{review.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <RatingStars rating={review.rating} size={13} />
                    <p style={{ marginTop: 8, fontSize: 13.5, color: 'var(--color-text-secondary)' }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="card" style={{ padding: 20 }}>
              <h4 style={{ marginBottom: 14 }}>{t('product.writeReview')}</h4>
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label">{t('product.yourRating')}</label>
                  <select
                    className="form-select"
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} stars
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('product.yourComment')}</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    required
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  />
                </div>
                <button type="submit" disabled={submittingReview} className="btn btn-primary">
                  {t('product.submitReview')}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div style={{ marginTop: 60 }}>
          <h2 className="section-title">{t('product.relatedProducts')}</h2>
          <div className="related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginTop: 20 }}>
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .pdp-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 1024px) {
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;
