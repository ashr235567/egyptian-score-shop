import { useTranslation } from 'react-i18next';

const PriceTag = ({ price, discountPrice, isOnSale, size = 'md' }) => {
  const { t } = useTranslation();
  const hasDiscount = isOnSale && discountPrice > 0 && discountPrice < price;
  const fontSize = size === 'lg' ? 26 : size === 'sm' ? 14 : 18;
  const smallFontSize = size === 'lg' ? 16 : size === 'sm' ? 11 : 13;

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontSize, fontWeight: 800, color: hasDiscount ? 'var(--color-danger)' : 'var(--color-text)' }}>
        {(hasDiscount ? discountPrice : price).toLocaleString()} {t('common.currency')}
      </span>
      {hasDiscount && (
        <span style={{ fontSize: smallFontSize, color: 'var(--color-text-secondary)', textDecoration: 'line-through' }}>
          {price.toLocaleString()} {t('common.currency')}
        </span>
      )}
    </div>
  );
};

export default PriceTag;
