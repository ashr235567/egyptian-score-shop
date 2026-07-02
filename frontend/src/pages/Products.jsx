import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFilter, FaTimes, FaChevronDown, FaSearch } from 'react-icons/fa';
import { productApi } from '../api/productApi';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';

const Products = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ brands: [], categories: [], sizes: [], priceRange: { min: 0, max: 10000 } });
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const page = parseInt(searchParams.get('page') || '1');
  const keyword = searchParams.get('keyword') || '';
  const selectedBrands = searchParams.get('brand')?.split(',').filter(Boolean) || [];
  const selectedCategories = searchParams.get('category')?.split(',').filter(Boolean) || [];
  const selectedSizes = searchParams.get('size')?.split(',').filter(Boolean) || [];
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';
  const bestSeller = searchParams.get('bestSeller') || '';
  const newArrival = searchParams.get('newArrival') || '';
  const onSale = searchParams.get('onSale') || '';

  useEffect(() => {
    productApi.getFilters().then(({ data }) => setFilters(data)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (keyword) params.keyword = keyword;
      if (selectedBrands.length) params.brand = selectedBrands.join(',');
      if (selectedCategories.length) params.category = selectedCategories.join(',');
      if (selectedSizes.length) params.size = selectedSizes.join(',');
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (bestSeller) params.bestSeller = bestSeller;
      if (newArrival) params.newArrival = newArrival;
      if (onSale) params.onSale = onSale;

      const { data } = await productApi.getProducts(params);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, keyword, sort, selectedBrands.join(','), selectedCategories.join(','), selectedSizes.join(','), minPrice, maxPrice, bestSeller, newArrival, onSale]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value === null) next.delete(key);
    else next.set(key, value);
    next.delete('page');
    setSearchParams(next);
  };

  const toggleArrayParam = (key, value, currentArray) => {
    const exists = currentArray.includes(value);
    const updated = exists ? currentArray.filter((v) => v !== value) : [...currentArray, value];
    updateParam(key, updated.join(','));
  };

  const clearFilters = () => setSearchParams({});

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = selectedBrands.length || selectedCategories.length || selectedSizes.length || minPrice || maxPrice || keyword;

  const FilterPanel = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>{t('filters.title')}</h3>
        {hasActiveFilters > 0 && (
          <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 12.5, fontWeight: 600 }}>
            {t('filters.clearFilters')}
          </button>
        )}
      </div>

      <FilterGroup title={t('filters.brand')}>
        {filters.brands.map((brand) => (
          <CheckboxItem
            key={brand}
            label={brand}
            checked={selectedBrands.includes(brand)}
            onChange={() => toggleArrayParam('brand', brand, selectedBrands)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={t('filters.category')}>
        {filters.categories.map((cat) => (
          <CheckboxItem
            key={cat}
            label={cat}
            checked={selectedCategories.includes(cat)}
            onChange={() => toggleArrayParam('category', cat, selectedCategories)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={t('filters.size')}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {filters.sizes.map((size) => {
            const active = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleArrayParam('size', size, selectedSizes)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  border: `1.5px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: active ? 'var(--color-primary-light)' : 'transparent',
                  color: active ? 'var(--color-primary)' : 'var(--color-text)',
                  fontWeight: 600,
                  fontSize: 12.5
                }}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title={t('filters.price')}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(e) => updateParam('minPrice', e.target.value)}
            className="form-input"
            style={{ padding: '8px 10px', fontSize: 13 }}
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(e) => updateParam('maxPrice', e.target.value)}
            className="form-input"
            style={{ padding: '8px 10px', fontSize: 13 }}
          />
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <div className="container" style={{ padding: '32px 20px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{t('nav.products')}</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13.5, marginTop: 6 }}>
            {t('filters.showing', { count: products.length, total })}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            className="btn btn-outline btn-sm filter-toggle-btn"
            onClick={() => setMobileFiltersOpen(true)}
            style={{ display: 'none' }}
          >
            <FaFilter size={12} /> {t('filters.title')}
          </button>
          <div style={{ position: 'relative' }}>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="form-select"
              style={{ paddingInlineEnd: 32, appearance: 'none', fontSize: 13.5, minWidth: 180 }}
            >
              <option value="newest">{t('filters.newest')}</option>
              <option value="price_asc">{t('filters.priceLowHigh')}</option>
              <option value="price_desc">{t('filters.priceHighLow')}</option>
              <option value="rating">{t('filters.topRated')}</option>
              <option value="best_selling">{t('filters.bestSelling')}</option>
            </select>
            <FaChevronDown size={11} style={{ position: 'absolute', insetInlineEnd: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-secondary)' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32 }} className="products-layout">
        <aside className="desktop-filters">
          <FilterPanel />
        </aside>

        <div>
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="card" style={{ padding: 60, textAlign: 'center' }}>
              <FaSearch size={32} color="var(--color-border)" style={{ marginBottom: 14 }} />
              <p style={{ color: 'var(--color-text-secondary)' }}>{t('filters.noResults')}</p>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 36 }}>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="btn btn-sm"
                      style={{
                        background: p === page ? 'var(--color-primary)' : 'transparent',
                        color: p === page ? '#fff' : 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                        minWidth: 38
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex' }}
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--color-bg-elevated)',
              width: 300,
              maxWidth: '85vw',
              height: '100%',
              padding: 20,
              overflowY: 'auto'
            }}
          >
            <button onClick={() => setMobileFiltersOpen(false)} style={{ background: 'none', border: 'none', marginBottom: 16 }}>
              <FaTimes size={20} />
            </button>
            <FilterPanel />
          </div>
        </div>
      )}

      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }
        @media (max-width: 1024px) {
          .products-layout { grid-template-columns: 1fr !important; }
          .desktop-filters { display: none !important; }
          .filter-toggle-btn { display: flex !important; align-items:center; }
        }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

const FilterGroup = ({ title, children }) => (
  <div style={{ marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid var(--color-border)' }}>
    <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{title}</h4>
    {children}
  </div>
);

const CheckboxItem = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13.5, cursor: 'pointer' }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    {label}
  </label>
);

export default Products;
