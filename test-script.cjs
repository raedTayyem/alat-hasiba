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
glob.sync('/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/ar/**/*.json').forEach(file => loadTranslationFile(file, 'ar'));

function checkNestedKey(obj, key) {
  const parts = key.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }
  
  return true;
}

function hasTranslation(lang, namespace, key) {
  if (namespace && translations[lang][namespace]) {
    return checkNestedKey(translations[lang][namespace], key);
  }
  return checkNestedKey(translations[lang], key);
}

function extractKeysFromComponent(componentPath) {
  const content = fs.readFileSync(componentPath, 'utf8');
  const keys = new Set();

  const namespaceMatch = content.match(/useTranslation\(\[?['"]([^'"]+)['"]/);
  const namespace = namespaceMatch ? namespaceMatch[1] : null;

  const tCallRegex = /t\(['"]([^'"]+)['"]\)/g;
  let match;

  while ((match = tCallRegex.exec(content)) !== null) {
    keys.add({ key: match[1], namespace });
  }

  return { keys: Array.from(keys), namespace };
}

// Test with AmazonFBACalculator
const componentPath = '/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/components/calculators/business/AmazonFBACalculator.tsx';
const { keys, namespace } = extractKeysFromComponent(componentPath);

console.log('Component:', componentPath.split('/').pop());
console.log('Namespace:', namespace);
console.log('Total keys:', keys.length);
console.log('');

const missingEN = [];
const missingAR = [];

keys.forEach(({ key, namespace: keyNamespace }) => {
  const ns = keyNamespace || namespace;
  
  if (!hasTranslation('en', ns, key)) {
    missingEN.push(key);
  }
  if (!hasTranslation('ar', ns, key)) {
    missingAR.push(key);
  }
});

console.log('Missing EN:', missingEN.length);
console.log('Missing AR:', missingAR.length);

if (missingEN.length > 0) {
  console.log('\nSample missing EN keys:');
  missingEN.slice(0, 10).forEach(key => console.log('  -', key));
}
