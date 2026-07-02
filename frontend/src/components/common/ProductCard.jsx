import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PriceTag from './PriceTag';
import RatingStars from './RatingStars';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isAr = i18n.language === 'ar';
  const inWishlist = isInWishlist(product._id);
  const isOutOfStock = product.totalStock === 0;

  const displayName = isAr && product.nameAr ? product.nameAr : product.name;

  return (
    <motion.div
      className="card fade-in"
      whileHover={{ y: -4 }}
      style={{ overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product);
        }}
        aria-label={t('product.addToWishlist')}
        style={{
          position: 'absolute',
          top: 10,
          insetInlineEnd: 10,
          zIndex: 2,
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: '50%',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {inWishlist ? <FaHeart color="var(--color-danger)" /> : <FaRegHeart color="var(--color-text-secondary)" />}
      </button>

      <Link to={`/products/${product.slug}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: 'var(--color-bg-secondary)' }}>
          <img
            src={product.coverImage}
            alt={displayName}
            loading="lazy"
            className="card-media"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: 10, insetInlineStart: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {product.isOnSale && product.discountPrice > 0 && <span className="badge badge-sale">SALE</span>}
            {product.isNewArrival && <span className="badge badge-new">NEW</span>}
            {isOutOfStock && <span className="badge badge-out">{t('product.outOfStock')}</span>}
          </div>
        </div>

        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            {product.brand}
          </span>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, lineHeight: 1.3, minHeight: 39 }}>{displayName}</h3>
          <RatingStars rating={product.rating} showCount count={product.numReviews} size={12} />
          <div style={{ marginTop: 'auto', paddingTop: 6 }}>
            <PriceTag price={product.price} discountPrice={product.discountPrice} isOnSale={product.isOnSale} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
