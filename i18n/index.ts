import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import main_en from '../components/MainPage/locales/en.json';
import main_ko from '../components/MainPage/locales/ko.json';
import main_suggestion_en from '../components/MainPage/locales/main_suggestion_en.json';
import main_suggestion_ko from '../components/MainPage/locales/main_suggestion_ko.json';
import settings_en from '../components/SettingPage/locales/en.json';
import settings_ko from '../components/SettingPage/locales/ko.json';
import stats_en from '../components/StatsPage/locales/en.json';
import stats_ko from '../components/StatsPage/locales/ko.json';
import timer_en from '../components/TimerPage/locales/en.json';
import timer_ko from '../components/TimerPage/locales/ko.json';
import suggestion_en from '../components/TimerPage/locales/suggestion_en.json';
import suggestion_ko from '../components/TimerPage/locales/suggestion_ko.json';

i18n.use(initReactI18next).init({
  lng: getLocales()[0].languageCode as 'en' | 'ko',
  // lng: 'en',
  fallbackLng: 'en',
  ns: ['main', 'timer', 'suggestion', 'mainSuggestion', 'stats', 'settings'],
  defaultNS: 'main',
  resources: {
    en: {
      main: main_en,
      timer: timer_en,
      suggestion: suggestion_en,
      mainSuggestion: main_suggestion_en,
      stats: stats_en,
      settings: settings_en,
    },
    ko: {
      main: main_ko,
      timer: timer_ko,
      suggestion: suggestion_ko,
      mainSuggestion: main_suggestion_ko,
      stats: stats_ko,
      settings: settings_ko,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
