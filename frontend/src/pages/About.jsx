import { useTranslation } from 'react-i18next';
import { FaCertificate, FaTruck, FaHeadset } from 'react-icons/fa';

const About = () => {
  const { t } = useTranslation();

  return (
    <div>
      <section style={{ background: 'var(--color-bg-secondary)', padding: '60px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>{t('about.title')}</h1>
      </section>

      <div className="container" style={{ padding: '50px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', marginBottom: 56 }} className="about-grid">
          <img
            src="https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800"
            alt="Football pitch"
            style={{ borderRadius: 20, width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
          />
          <div>
            <h2 className="section-title">{t('about.mission')}</h2>
            <p style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>{t('about.missionText')}</p>
          </div>
        </div>

        <h2 className="section-title" style={{ textAlign: 'center' }}>{t('about.whyUs')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 28 }}>
          <div className="card" style={{ padding: 26, textAlign: 'center' }}>
            <FaCertificate size={32} color="var(--color-primary)" style={{ marginBottom: 14 }} />
            <h3 style={{ marginBottom: 8 }}>{t('about.authenticity')}</h3>
            <p style={{ fontSize: 13.5, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{t('about.authenticityText')}</p>
          </div>
          <div className="card" style={{ padding: 26, textAlign: 'center' }}>
            <FaTruck size={32} color="var(--color-primary)" style={{ marginBottom: 14 }} />
            <h3 style={{ marginBottom: 8 }}>{t('about.delivery')}</h3>
            <p style={{ fontSize: 13.5, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{t('about.deliveryText')}</p>
          </div>
          <div className="card" style={{ padding: 26, textAlign: 'center' }}>
            <FaHeadset size={32} color="var(--color-primary)" style={{ marginBottom: 14 }} />
            <h3 style={{ marginBottom: 8 }}>{t('about.support')}</h3>
            <p style={{ fontSize: 13.5, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{t('about.supportText')}</p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default About;
