#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Finding ACTUALLY missing translations...\n');

// Load all translation files
const translations = { en: {}, ar: {} };

function loadTranslationFile(filePath, lang) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const relativePath = filePath.replace(/.*\/public\/locales\/[^\/]+\//, '').replace('.json', '');

    // For calc/* files, store under namespace
    if (relativePath.startsWith('calc/')) {
      const namespace = relativePath; // e.g., 'calc/health'
      if (!translations[lang][namespace]) {
        translations[lang][namespace] = {};
      }
      Object.assign(translations[lang][namespace], content);
    } else {
      // For common.json and translation.json
      Object.assign(translations[lang], content);
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
  }
}

// Load EN translations
glob.sync('/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/en/**/*.json').forEach(file => loadTranslationFile(file, 'en'));

// Load AR translations
glob.sync('/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/ar/**/*.json').forEach(file => loadTranslationFile(file, 'ar'));

console.log(`Loaded EN namespaces: ${Object.keys(translations.en).length}`);
console.log(`Loaded AR namespaces: ${Object.keys(translations.ar).length}\n`);

// Helper to check if a key exists in translations
function hasTranslation(lang, namespace, key) {
  if (namespace && translations[lang][namespace]) {
    return checkNestedKey(translations[lang][namespace], key);
  }
  // Fallback to checking in root
  return checkNestedKey(translations[lang], key);
}

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

// Extract translation keys from a component file
function extractKeysFromComponent(componentPath) {
  try {
    const content = fs.readFileSync(componentPath, 'utf8');
    const keys = new Set();

    // Find namespace from useTranslation
    const namespaceMatch = content.match(/useTranslation\(\[?['"]([^'"]+)['"]/);
    const namespace = namespaceMatch ? namespaceMatch[1] : null;

    // Find all t() calls
    const tCallRegex = /t\(['"]([^'"]+)['"]\)/g;
    let match;

    while ((match = tCallRegex.exec(content)) !== null) {
      keys.add({ key: match[1], namespace });
    }

    return { keys: Array.from(keys), namespace };
  } catch (error) {
    return { keys: [], namespace: null };
  }
}

// Analyze all calculator components
const componentFiles = glob.sync('/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/components/calculators/**/*.tsx');

let totalCalculators = 0;
let fullyTranslated = 0;
let partiallyTranslated = 0;
let notTranslated = 0;

const calculatorsWithMissing = [];

console.log('Analyzing calculator components...\n');

componentFiles.forEach(componentPath => {
  if (componentPath.includes('__tests__')) return; // Skip test files
  if (componentPath.includes('ResultsDisplay')) return; // Skip helper files
  if (componentPath.includes('index.tsx') && !componentPath.includes('inheritance-calculator')) return; // Skip index files except inheritance

  const { keys, namespace } = extractKeysFromComponent(componentPath);

  if (keys.length === 0) return; // Skip files with no translation keys

  totalCalculators++;

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

  const enCoverage = ((keys.length - missingEN.length) / keys.length * 100).toFixed(1);
  const arCoverage = ((keys.length - missingAR.length) / keys.length * 100).toFixed(1);

  if (missingEN.length === 0 && missingAR.length === 0) {
    fullyTranslated++;
  } else if (missingEN.length === keys.length) {
    notTranslated++;
    calculatorsWithMissing.push({
      path: componentPath,
      namespace,
      totalKeys: keys.length,
      missingEN: missingEN.length,
      missingAR: missingAR.length,
      coverage: 0
    });
  } else {
    partiallyTranslated++;
    calculatorsWithMissing.push({
      path: componentPath,
      namespace,
      totalKeys: keys.length,
      missingEN: missingEN.length,
      missingAR: missingAR.length,
      coverage: parseFloat(enCoverage),
      sampleMissing: missingEN.slice(0, 5)
    });
  }
});

console.log('='.repeat(60));
console.log('ACTUAL TRANSLATION STATUS');
console.log('='.repeat(60));
console.log();
console.log(`Total Calculators Analyzed: ${totalCalculators}`);
console.log(`Fully Translated (100%): ${fullyTranslated} (${(fullyTranslated/totalCalculators*100).toFixed(1)}%)`);
console.log(`Partially Translated: ${partiallyTranslated} (${(partiallyTranslated/totalCalculators*100).toFixed(1)}%)`);
console.log(`Not Translated (0%): ${notTranslated} (${(notTranslated/totalCalculators*100).toFixed(1)}%)`);
console.log();

if (calculatorsWithMissing.length > 0) {
  console.log('='.repeat(60));
  console.log('CALCULATORS WITH MISSING TRANSLATIONS');
  console.log('='.repeat(60));
  console.log();

  // Sort by number of missing keys
  calculatorsWithMissing.sort((a, b) => b.missingEN - a.missingEN);

  calculatorsWithMissing.slice(0, 30).forEach((calc, index) => {
    const fileName = path.basename(calc.path, '.tsx');
    console.log(`${index + 1}. ${fileName}`);
    console.log(`   Path: ${calc.path.replace('/Users/raedtayyem/Desktop/work/alathasiba-claudecode/', '')}`);
    console.log(`   Namespace: ${calc.namespace || 'N/A'}`);
    console.log(`   Total Keys: ${calc.totalKeys}`);
    console.log(`   Missing EN: ${calc.missingEN} (${calc.coverage}% translated)`);
    console.log(`   Missing AR: ${calc.missingAR}`);
    if (calc.sampleMissing) {
      console.log(`   Sample Missing Keys: ${calc.sampleMissing.slice(0, 3).join(', ')}`);
    }
    console.log();
  });

  if (calculatorsWithMissing.length > 30) {
    console.log(`... and ${calculatorsWithMissing.length - 30} more calculators with missing translations\n`);
  }
}

console.log('='.repeat(60));
console.log('Analysis complete!');
console.log('='.repeat(60));
