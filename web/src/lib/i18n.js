import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enJSON from '../locales/en.json';
import jaJSON from '../locales/ja.json';
import zhJSON from '../locales/zh.json';

i18n
    .use(LanguageDetector) // Automatically detects user's browser language
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources: {
            en: { translation: enJSON },
            ja: { translation: jaJSON },
            zh: { translation: zhJSON },
        },
        fallbackLng: 'en', // Default language if detection fails
        interpolation: {
            escapeValue: false, // React already protects from XSS
        },
    });

export default i18n;
