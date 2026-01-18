const fs = require('fs');
const path = require('path');

// Load translation files
const loadTranslations = (locale) => {
  const translations = {};
  const localeDir = path.join(process.cwd(), 'public', 'locales', locale);

  // Load main files
  ['common.json', 'translation.json', 'calculators.json'].forEach(file => {
    const filePath = path.join(localeDir, file);
    if (fs.existsSync(filePath)) {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      translations[file.replace('.json', '')] = content;
    }
  });

  // Load calc directory
  const calcDir = path.join(localeDir, 'calc');
  if (fs.existsSync(calcDir)) {
    const loadCalcFiles = (dir, prefix = '') => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          loadCalcFiles(fullPath, prefix + file + '/');
        } else if (file.endsWith('.json')) {
          const key = 'calc/' + prefix + file.replace('.json', '');
          translations[key] = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        }
      });
    };
    loadCalcFiles(calcDir);
  }

  return translations;
};

// Check if key exists
const hasKey = (translations, key) => {
  const parts = key.split(':');
  const namespace = parts[0] || 'translation';
  const keyPath = parts[1] || parts[0];

  if (!translations[namespace]) return false;

  const keys = keyPath.split('.');
  let obj = translations[namespace];

  for (const k of keys) {
    if (obj && typeof obj === 'object' && k in obj) {
      obj = obj[k];
    } else {
      return false;
    }
  }

  return true;
};

// Extract translation keys from file
const extractKeys = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const keys = new Set();

  // Match t('key') or t("key")
  const regex = /t\(['"]([^'"]+)['"]/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }

  return Array.from(keys);
};

const enTranslations = loadTranslations('en');
const arTranslations = loadTranslations('ar');

const calculatorFiles = [
  'src/components/calculators/misc/ClothingSizeConverter.tsx',
  'src/components/calculators/misc/ShoeSizeConverter.tsx',
  'src/components/calculators/misc/BiorhythmCalculator.tsx',
];

calculatorFiles.forEach(file => {
  if (!fs.existsSync(file)) return;

  const keys = extractKeys(file);
  const missingEN = keys.filter(k => !hasKey(enTranslations, k));
  const missingAR = keys.filter(k => !hasKey(arTranslations, k));

  console.log(`\n${path.basename(file)}`);
  console.log(`Total keys: ${keys.length}`);
  console.log(`Missing EN: ${missingEN.length}`);
  console.log(`Missing AR: ${missingAR.length}`);

  if (missingEN.length > 0) {
    console.log('\nMissing EN keys:');
    missingEN.forEach(k => console.log(`  - ${k}`));
  }
});
