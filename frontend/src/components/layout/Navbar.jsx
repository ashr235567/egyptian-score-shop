import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaHeart, FaShoppingCart, FaUser, FaSun, FaMoon, FaBars, FaTimes, FaGlobe } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const NAV_LINKS = [
  { key: 'home', path: '/' },
  { key: 'products', path: '/products' },
  { key: 'about', path: '/about' },
  { key: 'contact', path: '/contact' },
  { key: 'faq', path: '/faq' },
  { key: 'trackOrder', path: '/track-order' }
];

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [userMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(search.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--color-bg-elevated)',
        borderBottom: '1px solid var(--color-border)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className="container navbar-row" style={{ display: 'flex', alignItems: 'center', height: 'var(--header-height)', gap: 20 }}>
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'none', background: 'none', border: 'none', fontSize: 22, color: 'var(--color-text)' }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 16
            }}
          >
            ES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }} className="navbar-wordmark">
            <span style={{ fontWeight: 800, fontSize: 16 }}>EGYPTIAN</span>
            <span style={{ fontWeight: 600, fontSize: 11, letterSpacing: 1.5, color: 'var(--color-text-secondary)' }} className="navbar-subtitle">
              SCORE SHOP
            </span>
          </div>
        </Link>

        <nav className="desktop-nav" style={{ display: 'flex', gap: 22, flex: 1 }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={handleSearch}
          className="desktop-search"
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--color-bg-secondary)',
            borderRadius: 100,
            padding: '8px 14px',
            width: 240,
            gap: 8
          }}
        >
          <FaSearch size={13} color="var(--color-text-secondary)" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('nav.searchPlaceholder')}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: 13.5, color: 'var(--color-text)' }}
          />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }} className="navbar-icon-group">
          <button onClick={toggleLanguage} aria-label="Switch language" className="icon-btn lang-theme-toggle" style={iconBtnStyle} title={language === 'en' ? 'العربية' : 'English'}>
            <FaGlobe size={17} />
          </button>
          <button onClick={toggleTheme} aria-label="Toggle theme" className="icon-btn lang-theme-toggle" style={iconBtnStyle}>
            {theme === 'light' ? <FaMoon size={17} /> : <FaSun size={17} />}
          </button>
          <Link to="/wishlist" className="icon-btn" style={{ ...iconBtnStyle, position: 'relative' }} aria-label={t('nav.wishlist')}>
            <FaHeart size={18} />
            {wishlistItems.length > 0 && <span style={badgeStyle}>{wishlistItems.length}</span>}
          </Link>
          <Link to="/cart" className="icon-btn" style={{ ...iconBtnStyle, position: 'relative' }} aria-label={t('nav.cart')}>
            <FaShoppingCart size={18} />
            {itemCount > 0 && <span style={badgeStyle}>{itemCount}</span>}
          </Link>

          <div style={{ position: 'relative' }} ref={userMenuRef}>
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="icon-btn" style={iconBtnStyle} aria-label="Account">
              <FaUser size={17} />
            </button>
            {userMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  insetInlineEnd: 0,
                  top: 44,
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  boxShadow: 'var(--shadow-md)',
                  minWidth: 190,
                  padding: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                {isAuthenticated ? (
                  <>
                    <div style={{ padding: '8px 10px', fontSize: 13, fontWeight: 700, borderBottom: '1px solid var(--color-border)', marginBottom: 4 }}>
                      {user?.name}
                    </div>
                    <Link to="/profile" className="dropdown-item" style={dropdownItemStyle} onClick={() => setUserMenuOpen(false)}>
                      {t('nav.myAccount')}
                    </Link>
                    <Link to="/profile/orders" style={dropdownItemStyle} onClick={() => setUserMenuOpen(false)}>
                      {t('nav.myOrders')}
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" style={dropdownItemStyle} onClick={() => setUserMenuOpen(false)}>
                        {t('nav.adminDashboard')}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      style={{ ...dropdownItemStyle, textAlign: 'start', background: 'none', border: 'none', color: 'var(--color-danger)' }}
                    >
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" style={dropdownItemStyle} onClick={() => setUserMenuOpen(false)}>
                      {t('nav.login')}
                    </Link>
                    <Link to="/register" style={dropdownItemStyle} onClick={() => setUserMenuOpen(false)}>
                      {t('nav.register')}
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-nav" style={{ borderTop: '1px solid var(--color-border)', padding: 16 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="form-input"
            />
          </form>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <button onClick={toggleLanguage} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
              <FaGlobe size={13} /> {language === 'en' ? 'العربية' : 'English'}
            </button>
            <button onClick={toggleTheme} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
              {theme === 'light' ? <FaMoon size={13} /> : <FaSun size={13} />} {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.key} to={link.path} onClick={() => setMobileOpen(false)} style={{ fontWeight: 600 }}>
                {t(`nav.${link.key}`)}
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .desktop-search { display: none !important; }
        }
        @media (max-width: 880px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; align-items:center; justify-content:center; }
          .lang-theme-toggle { display: none !important; }
        }
        @media (min-width: 881px) {
          .mobile-nav { display: none !important; }
        }
        @media (max-width: 480px) {
          .navbar-row { gap: 10px !important; }
          .navbar-subtitle { display: none !important; }
        }
        @media (max-width: 360px) {
          .navbar-wordmark { display: none !important; }
          .navbar-icon-group { gap: 8px !important; }
        }
      `}</style>
    </header>
  );
};

const iconBtnStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--color-text)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36
};

const badgeStyle = {
  position: 'absolute',
  top: -2,
  insetInlineEnd: -4,
  background: 'var(--color-accent)',
  color: '#fff',
  borderRadius: '50%',
  fontSize: 10,
  fontWeight: 700,
  width: 17,
  height: 17,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const dropdownItemStyle = {
  padding: '9px 10px',
  borderRadius: 6,
  fontSize: 13.5,
  fontWeight: 500,
  display: 'block',
  width: '100%'
};

export default Navbar;
