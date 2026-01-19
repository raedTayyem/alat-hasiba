#!/usr/bin/env node

/**
 * Extract translation keys from 15 specific calculators and generate translation files
 */

const fs = require('fs');
const path = require('path');

// The 15 calculators to process
const CALCULATORS = [
  {
    name: 'InheritanceCalculator',
    file: 'src/components/calculators/finance/InheritanceCalculator.tsx',
    namespace: 'calc/finance',
    expectedKeys: 88
  },
  {
    name: 'LeaseVsBuyCalculator',
    file: 'src/components/calculators/automotive/LeaseVsBuyCalculator.tsx',
    namespace: 'calc/automotive',
    expectedKeys: 70
  },
  {
    name: 'PaintCalculator',
    file: 'src/components/calculators/construction/PaintCalculator.tsx',
    namespace: 'calc/construction',
    expectedKeys: 69
  },
  {
    name: 'AmazonFBACalculator',
    file: 'src/components/calculators/business/AmazonFBACalculator.tsx',
    namespace: 'calc/business',
    expectedKeys: 68
  },
  {
    name: 'CarMaintenanceCalculator',
    file: 'src/components/calculators/automotive/CarMaintenanceCalculator.tsx',
    namespace: 'calc/automotive',
    expectedKeys: 66
  },
  {
    name: 'DeckCalculator',
    file: 'src/components/calculators/construction/DeckCalculator.tsx',
    namespace: 'calc/construction',
    expectedKeys: 65
  },
  {
    name: 'PipeCalculator',
    file: 'src/components/calculators/construction/PipeCalculator.tsx',
    namespace: 'calc/construction',
    expectedKeys: 63
  },
  {
    name: 'LaborCostConstructionCalculator',
    file: 'src/components/calculators/construction/LaborCostConstructionCalculator.tsx',
    namespace: 'calc/construction',
    expectedKeys: 62
  },
  {
    name: 'WallpaperCalculator',
    file: 'src/components/calculators/construction/WallpaperCalculator.tsx',
    namespace: 'calc/construction',
    expectedKeys: 62
  },
  {
    name: 'TileCalculator',
    file: 'src/components/calculators/construction/TileCalculator.tsx',
    namespace: 'calc/construction',
    expectedKeys: 61
  },
  {
    name: 'CeilingCalculator',
    file: 'src/components/calculators/construction/CeilingCalculator.tsx',
    namespace: 'calc/construction',
    expectedKeys: 59
  },
  {
    name: 'ExcavationCalculator',
    file: 'src/components/calculators/construction/ExcavationCalculator.tsx',
    namespace: 'calc/construction',
    expectedKeys: 59
  },
  {
    name: 'RoofingCalculator',
    file: 'src/components/calculators/construction/RoofingCalculator.tsx',
    namespace: 'calc/construction',
    expectedKeys: 59
  },
  {
    name: 'CarbonEmissionsCalculator',
    file: 'src/components/calculators/automotive/CarbonEmissionsCalculator.tsx',
    namespace: 'calc/automotive',
    expectedKeys: 58
  },
  {
    name: 'MinecraftCalculator',
    file: 'src/components/calculators/gaming/MinecraftCalculator.tsx',
    namespace: 'calc/gaming',
    expectedKeys: 58
  }
];

function extractTranslationKeys(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const keys = new Set();

  // Match t("key") or t('key') or t(`key`)
  const regex = /\bt\(\s*["'`]([^"'`]+)["'`]\s*(?:,|\))/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    // Skip common namespace references
    if (!key.startsWith('common:') && !key.startsWith('common.')) {
      keys.add(key);
    }
  }

  return Array.from(keys).sort();
}

function generateTranslations(keys, prefix) {
  const translations = {};

  keys.forEach(key => {
    // Remove the prefix from the key (e.g., "paint." -> "")
    const cleanKey = key.replace(new RegExp(`^${prefix}\\.?`), '');

    // Split the key into path parts
    const parts = cleanKey.split('.');

    // Build nested object
    let current = translations;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // Last part - add the translation value
        current[part] = formatKeyToEnglish(part, key);
      } else {
        // Intermediate part - create object if it doesn't exist
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    });
  });

  return translations;
}

function formatKeyToEnglish(part, fullKey) {
  // Common replacements
  const replacements = {
    '_': ' ',
    'tooltip': 'Tooltip',
    'placeholder': 'Placeholder',
    'sqft': 'sq ft',
    'sqm': 'sq m',
    'usd': 'USD',
    'eur': 'EUR',
    'gbp': 'GBP'
  };

  let formatted = part;

  // Apply replacements
  Object.entries(replacements).forEach(([from, to]) => {
    formatted = formatted.replace(new RegExp(from, 'gi'), to);
  });

  // Capitalize first letter
  formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);

  return formatted;
}

function generateArabicTranslations(keys, prefix) {
  const translations = {};

  keys.forEach(key => {
    const cleanKey = key.replace(new RegExp(`^${prefix}\\.?`), '');
    const parts = cleanKey.split('.');

    let current = translations;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = formatKeyToArabic(part, key);
      } else {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    });
  });

  return translations;
}

function formatKeyToArabic(part, fullKey) {
  // Common Arabic translations
  const arabicMap = {
    'title': 'العنوان',
    'description': 'الوصف',
    'calculate': 'احسب',
    'reset': 'إعادة تعيين',
    'results': 'النتائج',
    'total': 'المجموع',
    'error': 'خطأ',
    'warning': 'تحذير',
    'info': 'معلومات',
    'placeholder': 'مثال',
    'tooltip': 'تلميح',
    'length': 'الطول',
    'width': 'العرض',
    'height': 'الارتفاع',
    'depth': 'العمق',
    'area': 'المساحة',
    'volume': 'الحجم',
    'price': 'السعر',
    'cost': 'التكلفة',
    'quantity': 'الكمية',
    'total_cost': 'التكلفة الإجمالية'
  };

  return arabicMap[part.toLowerCase()] || part;
}

console.log('Extracting translation keys from 15 calculators...\n');

const results = {};

CALCULATORS.forEach(calc => {
  console.log(`Processing ${calc.name}...`);

  const keys = extractTranslationKeys(calc.file);
  console.log(`  Found ${keys.length} keys (expected ${calc.expectedKeys})`);

  // Store results grouped by namespace
  if (!results[calc.namespace]) {
    results[calc.namespace] = {
      keys: new Set(),
      calculators: []
    };
  }

  keys.forEach(key => results[calc.namespace].keys.add(key));
  results[calc.namespace].calculators.push(calc.name);
});

console.log('\n' + '='.repeat(60));
console.log('SUMMARY BY NAMESPACE');
console.log('='.repeat(60) + '\n');

// Generate translation files for each namespace
Object.entries(results).forEach(([namespace, data]) => {
  const keys = Array.from(data.keys).sort();
  console.log(`${namespace}:`);
  console.log(`  Total unique keys: ${keys.length}`);
  console.log(`  Calculators: ${data.calculators.join(', ')}`);

  // Determine the prefix (last part of namespace)
  const prefix = namespace.split('/').pop();

  // Generate translations
  const enTranslations = generateTranslations(keys, prefix);
  const arTranslations = generateArabicTranslations(keys, prefix);

  // Save to JSON files
  const enPath = `public/locales/en/${namespace}.json`;
  const arPath = `public/locales/ar/${namespace}.json`;

  // Create directories if they don't exist
  const enDir = path.dirname(enPath);
  const arDir = path.dirname(arPath);

  if (!fs.existsSync(enDir)) {
    fs.mkdirSync(enDir, { recursive: true });
  }
  if (!fs.existsSync(arDir)) {
    fs.mkdirSync(arDir, { recursive: true });
  }

  // Load existing translations
  let existingEn = {};
  let existingAr = {};

  if (fs.existsSync(enPath)) {
    existingEn = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  }
  if (fs.existsSync(arPath)) {
    existingAr = JSON.parse(fs.readFileSync(arPath, 'utf-8'));
  }

  // Merge new translations with existing ones
  const mergedEn = { ...existingEn, ...enTranslations };
  const mergedAr = { ...existingAr, ...arTranslations };

  // Write files
  fs.writeFileSync(enPath, JSON.stringify(mergedEn, null, 2) + '\n');
  fs.writeFileSync(arPath, JSON.stringify(mergedAr, null, 2) + '\n');

  console.log(`  Generated: ${enPath}`);
  console.log(`  Generated: ${arPath}\n`);
});

console.log('='.repeat(60));
console.log('EXTRACTION COMPLETE');
console.log('='.repeat(60));
console.log('\nAll translation files have been updated!');
