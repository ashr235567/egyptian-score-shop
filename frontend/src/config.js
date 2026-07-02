// Central config for values needed across multiple components.
// WhatsApp number here is for general "contact us" style links (floating button,
// footer, product inquiry). The actual order checkout WhatsApp link is generated
// server-side using backend/.env's WHATSAPP_NUMBER - see backend/src/controllers/orderController.js.
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '201234567890';
