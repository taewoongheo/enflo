import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import main_en from '../components/MainPage/locales/en.json';
import main_ko from '../components/MainPage/locales/ko.json';
import timer_en from '../components/TimerPage/locales/en.json';
import timer_ko from '../components/TimerPage/locales/ko.json';

i18n.use(initReactI18next).init({
  lng: getLocales()[0].languageCode as 'en' | 'ko',
  // lng: 'en',
  fallbackLng: 'en',
  ns: ['main', 'timer'],
  defaultNS: 'main',
  resources: {
    en: { main: main_en, timer: timer_en },
    ko: { main: main_ko, timer: timer_ko },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
