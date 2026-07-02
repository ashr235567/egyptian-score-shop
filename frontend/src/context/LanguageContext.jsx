import { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const language = i18n.language && i18n.language.startsWith('ar') ? 'ar' : 'en';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const switchLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleLanguage = () => switchLanguage(language === 'en' ? 'ar' : 'en');

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, toggleLanguage, isRTL: language === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
