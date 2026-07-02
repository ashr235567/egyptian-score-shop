import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { WHATSAPP_NUMBER } from '../config';

const Contact = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // No backend contact endpoint required by spec; simulate submission and guide to WhatsApp for urgent matters
    setTimeout(() => {
      toast.success(t('contact.sentSuccess'));
      setForm({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 700);
  };

  return (
    <div className="container" style={{ padding: '50px 20px 70px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800 }}>{t('contact.title')}</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>{t('contact.subtitle')}</p>
      </div>

      <div className="contact-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 36 }}>
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ marginBottom: 20 }}>{t('contact.info')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <InfoRow icon={<FaMapMarkerAlt />} label={t('contact.address')} value="Cairo, Egypt" />
            <InfoRow icon={<FaPhone />} label={t('contact.callUs')} value="+20 123 456 7890" />
            <InfoRow icon={<FaEnvelope />} label={t('contact.emailUs')} value="support@egyptianscoreshop.com" />
            <InfoRow
              icon={<FaWhatsapp />}
              label={t('contact.whatsappUs')}
              value="+20 123 456 7890"
              link={`https://wa.me/${WHATSAPP_NUMBER}`}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: 28 }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('contact.name')}</label>
              <input required className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('contact.email')}</label>
              <input type="email" required className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('contact.subject')}</label>
            <input required className="form-input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">{t('contact.message')}</label>
            <textarea required rows={5} className="form-textarea" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {t('contact.send')}
          </button>
        </form>
      </div>

      <style>{`
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 860px) {
          .contact-layout { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const InfoRow = ({ icon, label, value, link }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: 'var(--color-primary-light)',
        color: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{label}</div>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, fontSize: 14 }}>
          {value}
        </a>
      ) : (
        <div style={{ fontWeight: 700, fontSize: 14 }}>{value}</div>
      )}
    </div>
  </div>
);

export default Contact;
