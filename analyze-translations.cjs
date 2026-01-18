const fs = require('fs');
const path = require('path');

// Flatten nested JSON to get all keys
function flattenKeys(obj, prefix = '') {
  const keys = new Set();
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenKeys(value, fullKey).forEach(k => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }
  return keys;
}

// Function to load all translation files for a language
function loadAllTranslations(lang) {
  const translations = {};
  const keyToFile = {}; // Track which file each key comes from

  // Load common.json
  const commonPath = `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/${lang}/common.json`;
  if (fs.existsSync(commonPath)) {
    const commonData = JSON.parse(fs.readFileSync(commonPath, 'utf8'));
    translations.common = commonData;
    const keys = flattenKeys(commonData);
    keys.forEach(key => {
      keyToFile[key] = 'common.json';
    });
  }

  // Load all calc/**/*.json files
  const calcDir = `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/${lang}/calc`;

  function loadCalcFiles(dir, namespace = '') {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        loadCalcFiles(fullPath, namespace ? `${namespace}/${entry.name}` : entry.name);
      } else if (entry.name.endsWith('.json')) {
        const calcData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        const fileName = entry.name.replace('.json', '');
        const fullNamespace = namespace ? `${namespace}/${fileName}` : fileName;

        if (!translations.calc) {
          translations.calc = {};
        }

        // Store in nested structure
        let current = translations.calc;
        const parts = fullNamespace.split('/');
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = calcData;

        // Track keys to files
        const keys = flattenKeys(calcData);
        keys.forEach(key => {
          const fullKey = `calc.${fullNamespace.replace(/\//g, '.')}.${key}`;
          keyToFile[fullKey] = `calc/${fullNamespace}.json`;
        });
      }
    }
  }

  loadCalcFiles(calcDir);

  return { translations, keyToFile };
}

// Load all translations
console.log('Loading all translation files...\n');
const { translations: enTranslations, keyToFile: enKeyToFile } = loadAllTranslations('en');
const { translations: arTranslations, keyToFile: arKeyToFile } = loadAllTranslations('ar');
console.log(`EN files loaded: ${Object.keys(enKeyToFile).length} keys total`);
console.log(`AR files loaded: ${Object.keys(arKeyToFile).length} keys total\n`);

// Find all calculator data files
const calculatorsDir = '/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/data/calculators';
const dataFiles = fs.readdirSync(calculatorsDir)
  .filter(f => f.endsWith('.ts') && !['types.ts', 'index.ts', 'categories.ts'].includes(f));

// Extract all calculator slugs
const allCalculators = [];
const slugCounts = {};

for (const file of dataFiles) {
  const content = fs.readFileSync(path.join(calculatorsDir, file), 'utf8');
  const slugMatches = content.matchAll(/slug:\s*['"]([^'"]+)['"]/g);

  for (const match of slugMatches) {
    const slug = match[1];
    const lineNum = content.substring(0, match.index).split('\n').length;

    if (!slugCounts[slug]) {
      slugCounts[slug] = [];
    }
    slugCounts[slug].push({ file, line: lineNum });
    allCalculators.push({ slug, file, line: lineNum });
  }
}

// Find duplicates
const duplicates = Object.entries(slugCounts).filter(([slug, locations]) => locations.length > 1);

console.log('DUPLICATE SLUGS (' + duplicates.length + '):');
duplicates.forEach(([slug, locations], index) => {
  console.log(`${index + 1}. ${slug}`);
  locations.forEach(loc => {
    const category = loc.file.replace('Calculators.ts', '');
    console.log(`   - ${category}: src/data/calculators/${loc.file}:${loc.line}`);
  });
  console.log('');
});

// Get unique slugs
const uniqueSlugs = [...new Set(allCalculators.map(c => c.slug))];
console.log(`\nTOTAL UNIQUE CALCULATORS: ${uniqueSlugs.length}\n`);

// Find component files
const componentsDir = '/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/components/calculators';

function findComponentFile(slug) {
  // Convert slug to potential component names
  const possibleNames = [
    slug,
    slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(''),
    slug.split('-').map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('')
  ];

  // Search in all subdirectories
  function searchDir(dir) {
    if (!fs.existsSync(dir)) return null;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const result = searchDir(fullPath);
        if (result) return result;
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        const basename = entry.name.replace(/\.(tsx|ts)$/, '');
        for (const name of possibleNames) {
          if (basename.toLowerCase() === name.toLowerCase() ||
              basename.toLowerCase().replace(/calculator$/, '') === name.toLowerCase().replace(/-calculator$/, '')) {
            return fullPath;
          }
        }
      }
    }
    return null;
  }

  return searchDir(componentsDir);
}

// Extract translation keys from a component file
function extractTranslationKeys(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return new Set();

  const content = fs.readFileSync(filePath, 'utf8');
  const keys = new Set();

  // Match t('key') and t("key") patterns
  const regex = /\bt\s*\(\s*['"]((?:[^'"\\]|\\.)+)['"]\s*\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }

  return keys;
}

// Check if key exists in translations
function checkKey(key, translations) {
  // Handle i18next namespace format: "namespace:key.path"
  // Examples: "calc/misc:abjad.standard_title", "translation:common.error"

  let namespace = 'common';
  let keyPath = key;

  // Check if key contains namespace separator (:)
  if (key.includes(':')) {
    const parts = key.split(':');
    namespace = parts[0];
    keyPath = parts[1];
  }

  // Handle different namespace formats
  if (namespace === 'translation' || namespace === 'common') {
    // Check in common translations
    const parts = keyPath.split('.');
    let current = translations.common;

    for (const part of parts) {
      if (!current || typeof current !== 'object' || !(part in current)) {
        return false;
      }
      current = current[part];
    }
    return true;
  }

  // Handle calc namespace: "calc/category:key.path" or "calc.category.key.path"
  if (namespace.startsWith('calc/') || namespace.startsWith('calc.') || key.startsWith('calc.')) {
    // Convert "calc/misc:abjad.title" to "calc.misc.abjad.title"
    let fullPath = namespace.replace(/\//g, '.') + '.' + keyPath;

    // Or handle "calc.misc.abjad.title" format
    if (!key.includes(':') && key.startsWith('calc.')) {
      fullPath = key;
    }

    const parts = fullPath.split('.');
    let current = translations;

    for (const part of parts) {
      if (!current || typeof current !== 'object' || !(part in current)) {
        return false;
      }
      current = current[part];
    }
    return true;
  }

  // Fallback: try as simple path in common
  const parts = key.split('.');
  let current = translations.common;

  for (const part of parts) {
    if (!current || typeof current !== 'object' || !(part in current)) {
      return false;
    }
    current = current[part];
  }
  return true;
}

// Get the file where a key is found
function getKeyFile(key, keyToFile) {
  // Handle i18next namespace format
  let namespace = 'common';
  let keyPath = key;

  if (key.includes(':')) {
    const parts = key.split(':');
    namespace = parts[0];
    keyPath = parts[1];
  }

  // For common/translation namespace
  if (namespace === 'translation' || namespace === 'common') {
    if (keyToFile[keyPath]) {
      return 'common.json';
    }
    return 'common.json';
  }

  // For calc namespace
  if (namespace.startsWith('calc/')) {
    const fullPath = namespace.replace(/\//g, '.') + '.' + keyPath;
    if (keyToFile[fullPath]) {
      return keyToFile[fullPath];
    }
    // Try to find the file based on namespace
    const namespaceFile = namespace.replace('calc/', 'calc/') + '.json';
    return namespaceFile;
  }

  // Try direct lookup
  if (keyToFile[key]) {
    return keyToFile[key];
  }

  return 'NOT FOUND';
}

console.log('TRANSLATION ANALYSIS:\n');

const stats = {
  totalCalculators: 0,
  totalKeys: 0,
  fullyTranslated: 0,
  partiallyTranslated: 0,
  missingTranslations: 0,
  noComponent: 0,
  totalENCoverage: 0,
  totalARCoverage: 0
};

const calculatorDetails = [];

// Analyze each unique calculator
for (const slug of uniqueSlugs.sort()) {
  const componentPath = findComponentFile(slug);

  if (!componentPath) {
    console.log(`Calculator: ${slug}`);
    console.log(`  Component: NOT FOUND`);
    console.log('');
    stats.noComponent++;
    stats.totalCalculators++;
    calculatorDetails.push({
      slug,
      totalKeys: 0,
      enCoverage: 0,
      arCoverage: 0,
      missingEN: [],
      missingAR: [],
      componentFound: false
    });
    continue;
  }

  const keys = extractTranslationKeys(componentPath);
  const keysArray = Array.from(keys);

  const enTranslated = keysArray.filter(k => checkKey(k, enTranslations)).length;
  const arTranslated = keysArray.filter(k => checkKey(k, arTranslations)).length;

  const missingEN = keysArray.filter(k => !checkKey(k, enTranslations));
  const missingAR = keysArray.filter(k => !checkKey(k, arTranslations));

  const enPerc = keysArray.length > 0 ? Math.round((enTranslated / keysArray.length) * 100) : 0;
  const arPerc = keysArray.length > 0 ? Math.round((arTranslated / keysArray.length) * 100) : 0;

  console.log(`Calculator: ${slug}`);
  console.log(`  Component: ${componentPath.replace('/Users/raedtayyem/Desktop/work/alathasiba-claudecode/', '')}`);
  console.log(`  Total Keys: ${keysArray.length}`);
  console.log(`  EN Translated: ${enTranslated}/${keysArray.length} (${enPerc}%)`);
  console.log(`  AR Translated: ${arTranslated}/${keysArray.length} (${arPerc}%)`);

  if (missingEN.length > 0 || missingAR.length > 0) {
    console.log(`  Missing:`);
    if (missingEN.length > 0) {
      console.log(`    EN: ${missingEN.slice(0, 5).join(', ')}${missingEN.length > 5 ? ` ... (${missingEN.length - 5} more)` : ''}`);
    }
    if (missingAR.length > 0) {
      console.log(`    AR: ${missingAR.slice(0, 5).join(', ')}${missingAR.length > 5 ? ` ... (${missingAR.length - 5} more)` : ''}`);
    }
  } else {
    console.log(`  Missing: None`);
  }
  console.log('');

  stats.totalCalculators++;
  stats.totalKeys += keysArray.length;
  stats.totalENCoverage += enPerc;
  stats.totalARCoverage += arPerc;

  calculatorDetails.push({
    slug,
    totalKeys: keysArray.length,
    enCoverage: enPerc,
    arCoverage: arPerc,
    missingEN,
    missingAR,
    componentFound: true,
    enTranslated,
    arTranslated
  });

  if (enTranslated === keysArray.length && arTranslated === keysArray.length && keysArray.length > 0) {
    stats.fullyTranslated++;
  } else if (enTranslated > 0 || arTranslated > 0) {
    stats.partiallyTranslated++;
  } else if (keysArray.length > 0) {
    stats.missingTranslations++;
  }
}

console.log('\n==============================================');
console.log('OVERALL STATISTICS');
console.log('==============================================\n');
console.log(`Total Calculators: ${stats.totalCalculators}`);
console.log(`Total Translation Keys Across All: ${stats.totalKeys}`);
console.log(`Average Keys per Calculator: ${stats.totalCalculators > 0 ? Math.round(stats.totalKeys / stats.totalCalculators) : 0}`);
console.log(`Average EN Coverage: ${stats.totalCalculators > 0 ? Math.round(stats.totalENCoverage / stats.totalCalculators) : 0}%`);
console.log(`Average AR Coverage: ${stats.totalCalculators > 0 ? Math.round(stats.totalARCoverage / stats.totalCalculators) : 0}%`);
console.log(`Fully Translated (EN+AR 100%): ${stats.fullyTranslated} calculators`);
console.log(`Partially Translated: ${stats.partiallyTranslated} calculators`);
console.log(`Missing All Translations: ${stats.missingTranslations} calculators`);
console.log(`No Component Found: ${stats.noComponent} calculators`);

// Sort by most missing translations
const sortedByMissing = calculatorDetails
  .filter(c => c.componentFound && (c.missingEN.length > 0 || c.missingAR.length > 0))
  .sort((a, b) => {
    const aMissing = a.missingEN.length + a.missingAR.length;
    const bMissing = b.missingEN.length + b.missingAR.length;
    return bMissing - aMissing;
  });

console.log('\n==============================================');
console.log('TOP 20 CALCULATORS WITH MOST MISSING TRANSLATIONS');
console.log('==============================================\n');

sortedByMissing.slice(0, 20).forEach((calc, index) => {
  const totalMissing = calc.missingEN.length + calc.missingAR.length;
  console.log(`${index + 1}. ${calc.slug}`);
  console.log(`   Total Keys: ${calc.totalKeys}`);
  console.log(`   EN Coverage: ${calc.enCoverage}% (${calc.missingEN.length} missing)`);
  console.log(`   AR Coverage: ${calc.arCoverage}% (${calc.missingAR.length} missing)`);
  console.log(`   Total Missing: ${totalMissing}`);
  console.log('');
});

console.log('\n==============================================');
console.log('FULLY TRANSLATED CALCULATORS (100% EN+AR)');
console.log('==============================================\n');

const fullyTranslatedList = calculatorDetails
  .filter(c => c.componentFound && c.enCoverage === 100 && c.arCoverage === 100 && c.totalKeys > 0)
  .sort((a, b) => a.slug.localeCompare(b.slug));

console.log(`Total: ${fullyTranslatedList.length} calculators\n`);
fullyTranslatedList.forEach((calc, index) => {
  console.log(`${index + 1}. ${calc.slug} (${calc.totalKeys} keys)`);
});

// Write detailed report to file
const reportPath = '/Users/raedtayyem/Desktop/work/alathasiba-claudecode/translation-coverage-report.txt';
const reportLines = [];

reportLines.push('==============================================');
reportLines.push('COMPREHENSIVE TRANSLATION COVERAGE REPORT');
reportLines.push('==============================================');
reportLines.push('');
reportLines.push(`Generated: ${new Date().toISOString()}`);
reportLines.push(`Total Calculators: ${stats.totalCalculators}`);
reportLines.push('');

reportLines.push('==============================================');
reportLines.push('SUMMARY STATISTICS');
reportLines.push('==============================================');
reportLines.push('');
reportLines.push(`Total Translation Keys: ${stats.totalKeys}`);
reportLines.push(`Average Keys per Calculator: ${stats.totalCalculators > 0 ? Math.round(stats.totalKeys / stats.totalCalculators) : 0}`);
reportLines.push(`Average EN Coverage: ${stats.totalCalculators > 0 ? Math.round(stats.totalENCoverage / stats.totalCalculators) : 0}%`);
reportLines.push(`Average AR Coverage: ${stats.totalCalculators > 0 ? Math.round(stats.totalARCoverage / stats.totalCalculators) : 0}%`);
reportLines.push(`Fully Translated (100% EN+AR): ${stats.fullyTranslated} calculators`);
reportLines.push(`Partially Translated: ${stats.partiallyTranslated} calculators`);
reportLines.push(`Missing All Translations: ${stats.missingTranslations} calculators`);
reportLines.push(`No Component Found: ${stats.noComponent} calculators`);
reportLines.push('');

reportLines.push('==============================================');
reportLines.push('DETAILED CALCULATOR BREAKDOWN');
reportLines.push('==============================================');
reportLines.push('');

calculatorDetails.sort((a, b) => a.slug.localeCompare(b.slug)).forEach(calc => {
  reportLines.push(`Calculator: ${calc.slug}`);
  if (!calc.componentFound) {
    reportLines.push('  Component: NOT FOUND');
  } else {
    reportLines.push(`  Total Keys: ${calc.totalKeys}`);
    reportLines.push(`  EN Coverage: ${calc.enCoverage}% (${calc.enTranslated}/${calc.totalKeys})`);
    reportLines.push(`  AR Coverage: ${calc.arCoverage}% (${calc.arTranslated}/${calc.totalKeys})`);
    if (calc.missingEN.length > 0) {
      reportLines.push(`  Missing EN (${calc.missingEN.length}):`);
      calc.missingEN.forEach(key => {
        reportLines.push(`    - ${key}`);
      });
    }
    if (calc.missingAR.length > 0) {
      reportLines.push(`  Missing AR (${calc.missingAR.length}):`);
      calc.missingAR.forEach(key => {
        reportLines.push(`    - ${key}`);
      });
    }
  }
  reportLines.push('');
});

fs.writeFileSync(reportPath, reportLines.join('\n'));
console.log(`\nDetailed report written to: translation-coverage-report.txt`);
