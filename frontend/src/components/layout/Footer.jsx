import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp, FaMoneyBillWave, FaTruck } from 'react-icons/fa';
import { WHATSAPP_NUMBER } from '../../config';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', marginTop: 60 }}>
      <div className="container" style={{ padding: '48px 20px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32,
            paddingBottom: 32
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 9,
                  background: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800
                }}
              >
                ES
              </div>
              <span style={{ fontWeight: 800, fontSize: 15 }}>EGYPTIAN SCORE SHOP</span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 13.5, lineHeight: 1.7 }}>{t('footer.about')}</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <a href="#" aria-label="Facebook"><FaFacebook size={20} color="var(--color-text-secondary)" /></a>
              <a href="#" aria-label="Instagram"><FaInstagram size={20} color="var(--color-text-secondary)" /></a>
              <a href="#" aria-label="TikTok"><FaTiktok size={20} color="var(--color-text-secondary)" /></a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp size={20} color="var(--color-text-secondary)" />
              </a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{t('footer.quickLinks')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/products" style={linkStyle}>{t('nav.products')}</Link>
              <Link to="/about" style={linkStyle}>{t('nav.about')}</Link>
              <Link to="/contact" style={linkStyle}>{t('nav.contact')}</Link>
              <Link to="/faq" style={linkStyle}>{t('nav.faq')}</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{t('footer.customerService')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/track-order" style={linkStyle}>{t('nav.trackOrder')}</Link>
              <Link to="/profile/orders" style={linkStyle}>{t('nav.myOrders')}</Link>
              <Link to="/cart" style={linkStyle}>{t('nav.cart')}</Link>
              <Link to="/wishlist" style={linkStyle}>{t('nav.wishlist')}</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{t('footer.paymentMethods')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                <FaMoneyBillWave /> Cash on Delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                <FaTruck /> Nationwide Shipping
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: 20,
            textAlign: 'center',
            fontSize: 12.5,
            color: 'var(--color-text-secondary)'
          }}
        >
          © {new Date().getFullYear()} Egyptian Score Shop. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};

const linkStyle = { color: 'var(--color-text-secondary)', fontSize: 13.5 };

export default Footer;
