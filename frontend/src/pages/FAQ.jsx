import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';

const FAQ_ITEMS_EN = [
  { q: 'Are all products 100% original?', a: 'Yes, every product sold on Egyptian Score Shop is sourced directly from authorized distributors and is 100% authentic. We never sell replicas or first-copy products.' },
  { q: 'How long does delivery take?', a: 'Delivery typically takes 2-5 business days depending on your governorate. Cairo and Giza usually receive orders within 1-3 business days.' },
  { q: 'Do you offer Cash on Delivery?', a: 'Yes, Cash on Delivery (COD) is our primary payment method. You pay when your order arrives at your doorstep.' },
  { q: 'How do I know my size?', a: 'Each product page includes a size guide. If you are unsure, message us on WhatsApp and our team will help you choose the right fit.' },
  { q: 'Can I return or exchange a product?', a: 'Yes, we offer a 14-day return/exchange policy for unworn items in their original packaging. Contact us via WhatsApp to start a return.' },
  { q: 'How do I track my order?', a: 'Use the Track Order page with your order number and phone number to see real-time status updates.' },
  { q: 'Do you ship to all governorates in Egypt?', a: 'Yes, we deliver to all 27 governorates across Egypt.' },
  { q: 'How can I apply a discount coupon?', a: 'Enter your coupon code at checkout in the designated field, and the discount will be applied automatically before you confirm your order.' }
];

const FAQ_ITEMS_AR = [
  { q: 'هل جميع المنتجات أصلية 100%؟', a: 'نعم، كل منتج يُباع في إيجيبشن سكور شوب يتم الحصول عليه مباشرة من موزعين معتمدين وهو أصلي 100%. لا نبيع أبدًا منتجات مقلدة.' },
  { q: 'كم يستغرق التوصيل؟', a: 'يستغرق التوصيل عادةً من 2 إلى 5 أيام عمل حسب محافظتك. القاهرة والجيزة عادةً ما تصل الطلبات خلال 1-3 أيام عمل.' },
  { q: 'هل تتوفر خدمة الدفع عند الاستلام؟', a: 'نعم، الدفع عند الاستلام هو طريقة الدفع الأساسية لدينا. تدفع عند استلام طلبك.' },
  { q: 'كيف أعرف مقاسي؟', a: 'تحتوي كل صفحة منتج على دليل مقاسات. إذا لم تكن متأكدًا، راسلنا عبر واتساب وسيساعدك فريقنا في اختيار المقاس المناسب.' },
  { q: 'هل يمكنني إرجاع أو استبدال منتج؟', a: 'نعم، نوفر سياسة إرجاع/استبدال خلال 14 يومًا للمنتجات غير المستخدمة وفي عبوتها الأصلية. تواصل معنا عبر واتساب لبدء عملية الإرجاع.' },
  { q: 'كيف أتتبع طلبي؟', a: 'استخدم صفحة تتبع الطلب مع رقم طلبك ورقم هاتفك لمعرفة حالة طلبك لحظة بلحظة.' },
  { q: 'هل توصلون لجميع محافظات مصر؟', a: 'نعم، نوصل إلى جميع محافظات مصر السبع والعشرين.' },
  { q: 'كيف أستخدم كوبون الخصم؟', a: 'أدخل كود الكوبون في الحقل المخصص عند إتمام الطلب، وسيتم تطبيق الخصم تلقائيًا قبل تأكيد طلبك.' }
];

const FAQ = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const items = isAr ? FAQ_ITEMS_AR : FAQ_ITEMS_EN;
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="container" style={{ padding: '50px 20px 70px', maxWidth: 800 }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800 }}>{t('faq.title')}</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>{t('faq.subtitle')}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, idx) => {
          const open = openIndex === idx;
          return (
            <div key={idx} className="card" style={{ overflow: 'hidden' }}>
              <button
                onClick={() => setOpenIndex(open ? -1 : idx)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 18,
                  background: 'none',
                  border: 'none',
                  textAlign: 'start',
                  fontWeight: 700,
                  fontSize: 15
                }}
              >
                {item.q}
                <FaChevronDown
                  size={13}
                  style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease', flexShrink: 0, marginInlineStart: 10 }}
                />
              </button>
              {open && (
                <div style={{ padding: '0 18px 18px', color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
