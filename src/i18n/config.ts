import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Define which namespaces have been split into multiple files
// The key is the namespace, the value is an array of file names (without .json extension)
const splitNamespaces: Record<string, string[]> = {
  'calc/business': ['vat', 'profit-margin', 'investment', 'inventory', 'depreciation', 'payroll', 'general'],
  'calc/construction': ['concrete', 'structural', 'roofing', 'excavation', 'finishing', 'labor', 'woodwork', 'general'],
  'calc/automotive': ['fuel', 'tires', 'maintenance', 'finance', 'performance', 'electric'],
  'calc/fitness': ['body-composition', 'cardio', 'strength', 'nutrition', 'general'],
  'calc/pet': ['age', 'nutrition', 'health', 'costs', 'general'],
  'calc/real-estate': ['mortgage', 'property-tax', 'rental', 'investment', 'general'],
  'calc/electrical': ['ohms-law', 'power', 'circuits', 'wiring'],
  'calc/environmental': ['carbon-footprint', 'water-footprint', 'emissions', 'energy'],
  'calc/date-time': ['age', 'duration', 'timezone', 'calendar'],
};

// Helper function to deep merge objects
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(
        (result[key] as Record<string, unknown>) || {},
        source[key] as Record<string, unknown>
      );
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// Custom request function that handles split translation files
async function customRequest(
  _options: { url: string },
  url: string,
  _payload: unknown,
  callback: (error: Error | null, response: { status: number; data: string } | null) => void
) {
  // Extract language and namespace from URL
  // URL format: /locales/{lng}/{ns}.json
  const urlMatch = url.match(/\/locales\/([^/]+)\/(.+)\.json$/);

  if (!urlMatch) {
    // Fallback to standard fetch if URL doesn't match expected pattern
    try {
      const response = await fetch(url);
      if (!response.ok) {
        callback(new Error(`Failed to load ${url}`), null);
        return;
      }
      const data = await response.text();
      callback(null, { status: response.status, data });
    } catch (error) {
      callback(error as Error, null);
    }
    return;
  }

  const [, lng, ns] = urlMatch;

  // Check if this namespace has split files
  if (splitNamespaces[ns]) {
    const splitFiles = splitNamespaces[ns];
    const basePath = `/locales/${lng}/${ns}`;

    try {
      // Fetch all split files in parallel
      const fetchPromises = splitFiles.map(async (fileName) => {
        const filePath = `${basePath}/${fileName}.json`;
        const response = await fetch(filePath);
        if (!response.ok) {
          // If file doesn't exist, return empty object (graceful degradation)
          console.warn(`Translation file not found: ${filePath}`);
          return {};
        }
        return response.json();
      });

      // Also try to fetch the main file if it exists (for backward compatibility)
      const mainFilePromise = fetch(`/locales/${lng}/${ns}.json`)
        .then(response => response.ok ? response.json() : {})
        .catch(() => ({}));

      const [mainFileData, ...splitFilesData] = await Promise.all([
        mainFilePromise,
        ...fetchPromises
      ]);

      // Merge all data: start with main file, then merge split files
      let mergedData: Record<string, unknown> = mainFileData as Record<string, unknown>;
      for (const fileData of splitFilesData) {
        mergedData = deepMerge(mergedData, fileData as Record<string, unknown>);
      }

      callback(null, { status: 200, data: JSON.stringify(mergedData) });
    } catch (error) {
      // Fallback to loading the main file only
      try {
        const response = await fetch(url);
        if (!response.ok) {
          callback(new Error(`Failed to load ${url}`), null);
          return;
        }
        const data = await response.text();
        callback(null, { status: response.status, data });
      } catch (fallbackError) {
        callback(fallbackError as Error, null);
      }
    }
  } else {
    // Standard fetch for non-split namespaces
    try {
      const response = await fetch(url);
      if (!response.ok) {
        callback(new Error(`Failed to load ${url}`), null);
        return;
      }
      const data = await response.text();
      callback(null, { status: response.status, data });
    } catch (error) {
      callback(error as Error, null);
    }
  }
}

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
      // Use custom request function to handle split translation files
      request: customRequest,
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
