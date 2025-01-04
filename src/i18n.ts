import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector) // Automatically detect user language
  .use(initReactI18next) // Bind react-i18next to the i18next instance
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome to the dashboard!",
          language: "Language",
        },
      },
      ar: {
        translation: {
          welcome: "مرحبًا بك في لوحة التحكم!",
          language: "اللغة",
        },
      },
    },
    fallbackLng: "en", // Default language
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
