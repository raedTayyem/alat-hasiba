#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

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

  if (missingEN.length > 0 || missingAR.length > 0) {
    calculatorsWithMissing.push({
      path: componentPath,
      namespace,
      totalKeys: keys.length,
      missingEN,
      missingAR,
      fileName: path.basename(componentPath, '.tsx')
    });
  }
});

calculatorsWithMissing.sort((a, b) => b.missingEN.length - a.missingEN.length);

// Output calculators 71-140
const batch = calculatorsWithMissing.slice(70, 140);
fs.writeFileSync('/tmp/calculators_71_140.json', JSON.stringify(batch, null, 2));
console.log(`Extracted ${batch.length} calculators (71-140) with missing translations`);
console.log(`Total missing translations needed: ${batch.reduce((sum, c) => sum + c.missingEN.length, 0)}`);
