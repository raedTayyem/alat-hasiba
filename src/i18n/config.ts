import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // Load translations from public/locales
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n to react-i18next
  .init({
    fallbackLng: 'ar', // Default to Arabic
    supportedLngs: ['ar', 'en', 'he'], // Supported languages

    debug: false, // Set to true for debugging

    // Language detection configuration
    detection: {
      // Order of language detection methods
      order: [
        'localStorage',    // Check localStorage first (user preference)
        'navigator',       // Browser language settings
        'htmlTag',         // HTML lang attribute
        'path',            // URL path (/ar/ or /en/)
        'subdomain',       // Subdomain (ar.alathasiba.com)
      ],
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      caches: ['localStorage'], // Cache user preference
      excludeCacheFor: ['cimode'], // Don't cache in CIMODE
    },

    // Backend configuration for loading translations
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // React-specific configuration
    react: {
      useSuspense: true, // Use Suspense for loading translations
    },

    // Namespace configuration - split into categories for better management
    // All namespaces will be loaded, but 'translation' remains the default
    ns: [
      'translation',
      'common',
      'navigation',
      'calculators',
      'pages',
      'specialized',
      // Calculator category namespaces (loaded on-demand)
      'calc/agriculture',
      'calc/astronomy',
      'calc/automotive',
      'calc/business',
      'calc/construction',
      'calc/cooking',
      'calc/converters',
      'calc/date-time',
      'calc/education',
      'calc/electrical',
      'calc/engineering',
      'calc/environmental',
      'calc/finance',
      'calc/fitness',
      'calc/gaming',
      'calc/geometry',
      'calc/health',
      'calc/math',
      'calc/misc',
      'calc/pet',
      'calc/physics',
      'calc/real-estate',
      'calc/science',
      'calc/statistics'
    ],
    defaultNS: 'translation',

    // Fallback namespace if translation key is missing
    fallbackNS: ['translation', 'calculators', 'common', 'navigation'],

    // Load core namespaces on init
    preload: ['ar', 'en', 'he'],

    // Partitioned - load namespaces on demand
    partialBundledLanguages: true,
  });

export default i18n;
