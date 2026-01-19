const fs = require('fs');
const glob = require('glob');

// Load all translation files
const translations = { en: {}, ar: {} };

function loadTranslationFile(filePath, lang) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const relativePath = filePath.replace(/.*\/public\/locales\/[^\/]+\//, '').replace('.json', '');

    if (relativePath.startsWith('calc/')) {
      const namespace = relativePath;
      if (!translations[lang][namespace]) {
        translations[lang][namespace] = {};
      }
      Object.assign(translations[lang][namespace], content);
    } else {
      Object.assign(translations[lang], content);
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
  }
}

// Load EN translations
glob.sync('/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/en/**/*.json').forEach(file => loadTranslationFile(file, 'en'));

console.log('Loaded namespaces:', Object.keys(translations.en).length);
console.log('calc/business exists:', !!translations.en['calc/business']);
console.log('calc/business keys:', translations.en['calc/business'] ? Object.keys(translations.en['calc/business']).slice(0, 10) : 'N/A');
console.log('');

function checkNestedKey(obj, key) {
  const parts = key.split('.');
  let current = obj;

  console.log('  Checking nested key:', key);
  console.log('  Parts:', parts);

  for (const part of parts) {
    console.log('  Looking for part:', part, 'in:', typeof current);
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
      console.log('    Found! Type:', typeof current);
    } else {
      console.log('    NOT FOUND');
      return false;
    }
  }

  return true;
}

function hasTranslation(lang, namespace, key) {
  console.log('hasTranslation called:');
  console.log('  lang:', lang);
  console.log('  namespace:', namespace);
  console.log('  key:', key);
  console.log('  namespace exists:', !!translations[lang][namespace]);

  if (namespace && translations[lang][namespace]) {
    return checkNestedKey(translations[lang][namespace], key);
  }
  return checkNestedKey(translations[lang], key);
}

// Test one key
console.log('=== Testing amazon_fba.title ===');
const result = hasTranslation('en', 'calc/business', 'amazon_fba.title');
console.log('Result:', result);
