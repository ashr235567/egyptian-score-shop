import { FaWhatsapp } from 'react-icons/fa';
import { WHATSAPP_NUMBER } from '../../config';

const FloatingWhatsApp = () => {
  const message = encodeURIComponent("Hi! I'd like to ask about a product on Egyptian Score Shop.");

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        bottom: 24,
        insetInlineEnd: 24,
        zIndex: 1000,
        width: 58,
        height: 58,
        borderRadius: '50%',
        background: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
        animation: 'wa-pulse 2.4s ease infinite'
      }}
    >
      <FaWhatsapp size={30} color="#fff" />
      <style>{`
        @keyframes wa-pulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.55); }
          70% { box-shadow: 0 0 0 14px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
      `}</style>
    </a>
  );
};

export default FloatingWhatsApp;
