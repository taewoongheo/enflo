import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import main_en from '../components/MainPage/locales/en.json';
import main_ko from '../components/MainPage/locales/ko.json';

i18n.use(initReactI18next).init({
  lng: getLocales()[0].languageCode as 'en' | 'ko',
  fallbackLng: 'en',
  ns: ['main'],
  defaultNS: 'main',
  resources: {
    en: { main: main_en },
    ko: { main: main_ko },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
