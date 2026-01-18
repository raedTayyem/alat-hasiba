const fs = require('fs');
const path = require('path');

// Calculator configurations with missing keys (from the analysis)
const calculatorsToProcess = [
  { name: 'CeilingCalculator', path: 'src/components/calculators/construction/CeilingCalculator.tsx', namespace: 'calc/construction', missing: 26 },
  { name: 'HalfLifeCalculator', path: 'src/components/calculators/science/HalfLifeCalculator.tsx', namespace: 'calc/science', missing: 26 },
  { name: 'FlooringCalculator', path: 'src/components/calculators/construction/FlooringCalculator.tsx', namespace: 'calc/construction', missing: 21 },
  { name: 'ShingleCalculator', path: 'src/components/calculators/construction/ShingleCalculator.tsx', namespace: 'calc/construction', missing: 21 },
  { name: 'DrywallCalculator', path: 'src/components/calculators/construction/DrywallCalculator.tsx', namespace: 'calc/construction', missing: 19 },
  { name: 'LoanCalculator', path: 'src/components/calculators/finance/LoanCalculator.tsx', namespace: 'calc/finance', missing: 18 },
  { name: 'SwimmingPaceCalculator', path: 'src/components/calculators/health/SwimmingPaceCalculator.tsx', namespace: 'calc/health', missing: 16 },
  { name: 'LevelUpCalculator', path: 'src/components/calculators/gaming/LevelUpCalculator.tsx', namespace: 'calc/gaming', missing: 15 },
  { name: 'BrickCalculator', path: 'src/components/calculators/construction/BrickCalculator.tsx', namespace: 'calc/construction', missing: 14 },
  { name: 'GPACalculator', path: 'src/components/calculators/education/GPACalculator.tsx', namespace: 'calc/education', missing: 14 },
];

// Load translation files
const loadTranslations = (locale) => {
  const translations = {};
  const localeDir = path.join(process.cwd(), 'public', 'locales', locale);

  ['common.json', 'translation.json', 'calculators.json'].forEach(file => {
    const filePath = path.join(localeDir, file);
    if (fs.existsSync(filePath)) {
      translations[file.replace('.json', '')] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  });

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
  const regex = /t\(['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  return Array.from(keys);
};

// Main processing
console.log('Loading translations...');
const enTranslations = loadTranslations('en');
const arTranslations = loadTranslations('ar');

console.log('\nProcessing calculators with missing translations...\n');

calculatorsToProcess.forEach(calc => {
  if (!fs.existsSync(calc.path)) {
    console.log(`❌ ${calc.name}: File not found`);
    return;
  }

  const keys = extractKeys(calc.path);
  const missingEN = keys.filter(k => !hasKey(enTranslations, k));
  const missingAR = keys.filter(k => !hasKey(arTranslations, k));

  console.log(`\n${calc.name}:`);
  console.log(`  Total keys: ${keys.length}`);
  console.log(`  Missing EN: ${missingEN.length}`);
  console.log(`  Missing AR: ${missingAR.length}`);

  if (missingEN.length > 0) {
    console.log(`  Missing keys:`);
    missingEN.slice(0, 10).forEach(k => console.log(`    - ${k}`));
    if (missingEN.length > 10) {
      console.log(`    ... and ${missingEN.length - 10} more`);
    }
  }
});

console.log('\n\nDone! Check the output above for missing keys.');
console.log('Note: Some "missing" keys may be fallback keys or defined in parent namespaces.');
