import 'intl-pluralrules';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json'; // Adjust the path according to your directory structure
import fr from './locales/fr.json';

// Initialize i18n with translation resources
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: Localization.locale, // Set the language based on device locale
    fallbackLng: 'en', // Fallback language if the locale is not available
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
  });

export default i18n;