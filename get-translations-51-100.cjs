#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
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
  } catch (error) {}
}

// Load translations
glob.sync('/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/en/**/*.json').forEach(file => loadTranslationFile(file, 'en'));
glob.sync('/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/ar/**/*.json').forEach(file => loadTranslationFile(file, 'ar'));

function hasTranslation(lang, namespace, key) {
  if (namespace && translations[lang][namespace]) {
    return checkNestedKey(translations[lang][namespace], key);
  }
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

function extractKeysFromComponent(componentPath) {
  try {
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
  } catch (error) {
    return { keys: [], namespace: null };
  }
}

const componentFiles = glob.sync('/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/components/calculators/**/*.tsx');
const calculatorsWithMissing = [];

componentFiles.forEach(componentPath => {
  if (componentPath.includes('__tests__')) return;
  if (componentPath.includes('ResultsDisplay')) return;
  if (componentPath.includes('index.tsx') && !componentPath.includes('inheritance-calculator')) return;

  const { keys, namespace } = extractKeysFromComponent(componentPath);
  if (keys.length === 0) return;

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

  if (missingEN.length > 0 || missingAR.length > 0) {
    calculatorsWithMissing.push({
      path: componentPath,
      namespace,
      totalKeys: keys.length,
      missingEN: missingEN.length,
      missingAR: missingAR.length,
      coverage: parseFloat(enCoverage),
      sampleMissing: missingEN.slice(0, 5),
      allMissingEN: missingEN,
      allMissingAR: missingAR
    });
  }
});

// Sort by number of missing keys
calculatorsWithMissing.sort((a, b) => b.missingEN - a.missingEN);

// Output calculators ranked 51-100
console.log('Calculators ranked 51-100 by missing translation count:\n');
calculatorsWithMissing.slice(50, 100).forEach((calc, index) => {
  const fileName = path.basename(calc.path, '.tsx');
  console.log(`${index + 51}. ${fileName}`);
  console.log(`   Path: ${calc.path.replace('/Users/raedtayyem/Desktop/work/alathasiba-claudecode/', '')}`);
  console.log(`   Namespace: ${calc.namespace || 'N/A'}`);
  console.log(`   Total Keys: ${calc.totalKeys}`);
  console.log(`   Missing EN: ${calc.missingEN} (${calc.coverage}% translated)`);
  console.log(`   Missing AR: ${calc.missingAR}`);
  console.log(`   Missing Keys: ${calc.allMissingEN.join(', ')}`);
  console.log();
});

console.log(`\nTotal calculators with missing translations: ${calculatorsWithMissing.length}`);
