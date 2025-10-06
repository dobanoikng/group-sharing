import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// import các file ngôn ngữ
import en from './locales/en.json';
import vi from './locales/vi.json';

// lấy ngôn ngữ máy
const locales = Localization.getLocales();
const defaultLang = locales[0]?.languageCode || 'en';

export default i18n
  .use(initReactI18next) // tích hợp với React
  .init({
    lng: defaultLang, // ngôn ngữ mặc định
    fallbackLng: 'vi', // fallback nếu không có bản dịch
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    interpolation: {
      escapeValue: false, // React tự xử lý XSS rồi
    },
  });

