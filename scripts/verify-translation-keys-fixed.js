#!/usr/bin/env node

/**
 * Fixed Translation Key Verification Script
 *
 * This script properly handles split namespaces as defined in i18n config.
 * It merges split files before checking keys, matching runtime behavior.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SRC_DIR = path.join(__dirname, '..', 'src');
const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');
const AR_DIR = path.join(LOCALES_DIR, 'ar');
const EN_DIR = path.join(LOCALES_DIR, 'en');

// Split namespaces configuration (from i18n/config.ts)
const splitNamespaces = {
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

// Patterns to extract translation keys
const TRANSLATION_PATTERNS = [
  /\bt\s*\(\s*(['"`])([^'"`\n]+?)\1/g,
  /\bt\s*\(\s*(['"`])([a-zA-Z0-9_\-/:]+:[^'"`\n]+?)\1/g,
  /i18n\.t\s*\(\s*(['"`])([^'"`\n]+?)\1/g,
  /\{\s*t\s*\(\s*(['"`])([^'"`\n]+?)\1/g,
  /\bt\s*\(\s*(['"`])([^'"`\n]+?)\1\s*,/g,
  /<Trans[^>]+i18nKey\s*=\s*(['"`])([^'"`\n]+?)\1/g,
];

// Deep merge helper
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// Get all TSX/TS files
function getAllTsxFiles(dir, files = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      getAllTsxFiles(fullPath, files);
    } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.ts'))) {
      files.push(fullPath);
    }
  }
  return files;
}

// Load and merge translation files for a namespace
function loadNamespaceTranslations(localeDir, namespace) {
  const namespacePath = namespace.replace(/:/g, '/');
  const fullPath = path.join(localeDir, namespacePath);

  // Check if this namespace has split files
  if (splitNamespaces[namespace]) {
    let merged = {};

    // Load all split files
    for (const splitFile of splitNamespaces[namespace]) {
      const filePath = path.join(fullPath, `${splitFile}.json`);
      if (fs.existsSync(filePath)) {
        try {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          merged = deepMerge(merged, content);
        } catch (e) {
          console.error(`Error loading ${filePath}: ${e.message}`);
        }
      }
    }

    return merged;
  } else {
    // Load single file
    const filePath = path.join(fullPath + '.json');
    if (fs.existsSync(filePath)) {
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (e) {
        console.error(`Error loading ${filePath}: ${e.message}`);
      }
    }
  }

  return {};
}

// Recursively extract keys from object
function extractKeysFromObject(obj, prefix = '') {
  const keys = new Set();
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      extractKeysFromObject(obj[key], fullKey).forEach(k => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }
  return keys;
}

// Load all translation keys properly handling split namespaces
function loadAllTranslationKeys(localeDir) {
  const allKeys = new Set();

  // Get all namespaces including split ones
  const namespacesToCheck = [
    'translation',
    'common',
    'navigation',
    'calculators',
    'pages',
    'specialized',
    ...Object.keys(splitNamespaces),
    // Also check for other calc/ namespaces
    'calc/agriculture',
    'calc/astronomy',
    'calc/cooking',
    'calc/converters',
    'calc/education',
    'calc/engineering',
    'calc/finance',
    'calc/gaming',
    'calc/geometry',
    'calc/health',
    'calc/math',
    'calc/misc',
    'calc/physics',
    'calc/science',
    'calc/statistics'
  ];

  for (const namespace of namespacesToCheck) {
    const data = loadNamespaceTranslations(localeDir, namespace);
    const keys = extractKeysFromObject(data);

    // Add keys with namespace prefix
    for (const key of keys) {
      allKeys.add(`${namespace}:${key}`);
      // Also add without namespace for default namespace
      if (namespace === 'translation') {
        allKeys.add(key);
      }
    }
  }

  return allKeys;
}

// Extract translation keys from a file
function extractTranslationKeys(filePath, content) {
  const keys = [];

  // Find namespaces used in useTranslation
  let namespaces = ['translation'];
  const arrayMatch = content.match(/useTranslation\s*\(\s*\[([^\]]+)\]/);
  if (arrayMatch) {
    namespaces = arrayMatch[1]
      .split(',')
      .map(s => s.trim().replace(/['"]/g, ''))
      .filter(Boolean);
  } else {
    const singleMatch = content.match(/useTranslation\s*\(\s*(['"])([^'"]+)\1/);
    if (singleMatch) {
      namespaces = [singleMatch[2]];
    }
  }

  // Extract all t() calls
  for (const pattern of TRANSLATION_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const rawKey = match[2];
      if (rawKey) {
        keys.push({
          key: rawKey,
          file: filePath,
          namespaces: namespaces,
        });
      }
    }
  }

  return keys;
}

// Check if a key exists considering namespaces
function keyExists(key, translationKeys, namespaces) {
  // Direct key check
  if (translationKeys.has(key)) return true;

  // Key with namespace prefix
  if (key.includes(':')) {
    const [ns, keyPath] = key.split(':', 2);
    // Check various combinations
    if (translationKeys.has(key)) return true;
    if (translationKeys.has(keyPath)) return true;
    // Check with slash instead of colon
    const nsSlash = ns.replace(/:/g, '/');
    if (translationKeys.has(`${nsSlash}:${keyPath}`)) return true;
    return false;
  }

  // Check with each namespace
  for (const ns of namespaces) {
    if (translationKeys.has(`${ns}:${key}`)) return true;
    // Also try with slash
    const nsSlash = ns.replace(/:/g, '/');
    if (translationKeys.has(`${nsSlash}:${key}`)) return true;
  }

  return false;
}

// Main execution
function main() {
  console.log('='.repeat(70));
  console.log('FIXED TRANSLATION KEY VERIFICATION');
  console.log('Properly handles split namespaces from i18n config');
  console.log('='.repeat(70));
  console.log();

  // Load translation keys with proper split namespace handling
  console.log('Loading translation files with split namespace support...');
  const arKeys = loadAllTranslationKeys(AR_DIR);
  const enKeys = loadAllTranslationKeys(EN_DIR);
  console.log(`Arabic translations: ${arKeys.size} keys`);
  console.log(`English translations: ${enKeys.size} keys`);
  console.log();

  // Get all TSX/TS files
  console.log('Scanning source files...');
  const files = getAllTsxFiles(SRC_DIR);
  console.log(`Found ${files.length} TypeScript/TSX files`);
  console.log();

  // Extract all translation keys
  const allKeys = [];
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(SRC_DIR, file);
      const keys = extractTranslationKeys(relativePath, content);
      allKeys.push(...keys);
    } catch (e) {
      console.error(`Error processing ${file}: ${e.message}`);
    }
  }

  // Get unique keys
  const uniqueKeys = new Map();
  for (const keyInfo of allKeys) {
    if (!uniqueKeys.has(keyInfo.key)) {
      uniqueKeys.set(keyInfo.key, []);
    }
    uniqueKeys.get(keyInfo.key).push(keyInfo);
  }

  console.log('='.repeat(70));
  console.log('=== TRANSLATION KEYS USED IN CODE ===');
  console.log('='.repeat(70));
  console.log(`Total key usages found: ${allKeys.length}`);
  console.log(`Unique keys: ${uniqueKeys.size}`);
  console.log();

  // Check for missing keys
  const missingFromAr = [];
  const missingFromEn = [];

  for (const [key, usages] of uniqueKeys) {
    const firstUsage = usages[0];
    const namespaces = firstUsage.namespaces || ['translation'];

    // Skip dynamic keys (template literals)
    if (key.includes('${')) {
      continue;
    }

    if (!keyExists(key, arKeys, namespaces)) {
      missingFromAr.push({ key, usages });
    }
    if (!keyExists(key, enKeys, namespaces)) {
      missingFromEn.push({ key, usages });
    }
  }

  // Group by file and show results
  console.log('='.repeat(70));
  console.log('=== MISSING FROM ARABIC ===');
  console.log('='.repeat(70));
  if (missingFromAr.length === 0) {
    console.log('✓ No missing keys in Arabic translations!');
  } else {
    console.log(`Found ${missingFromAr.length} keys missing from Arabic translations:`);
    console.log();

    // Group by file
    const byFile = new Map();
    for (const { key, usages } of missingFromAr) {
      const file = usages[0].file;
      if (!byFile.has(file)) byFile.set(file, []);
      byFile.get(file).push({ key, usages });
    }

    // Show top 20 files
    const sortedFiles = Array.from(byFile.entries()).sort((a, b) => b[1].length - a[1].length);
    for (const [file, keys] of sortedFiles.slice(0, 20)) {
      console.log(`\n  FILE: ${file} (${keys.length} missing keys)`);
      console.log(`  Namespaces: ${keys[0].usages[0].namespaces.join(', ')}`);
      for (const { key } of keys.slice(0, 5)) {
        console.log(`    - ${key}`);
      }
      if (keys.length > 5) {
        console.log(`    ... and ${keys.length - 5} more`);
      }
    }

    if (sortedFiles.length > 20) {
      console.log(`\n  ... and ${sortedFiles.length - 20} more files`);
    }
  }
  console.log();

  console.log('='.repeat(70));
  console.log('=== MISSING FROM ENGLISH ===');
  console.log('='.repeat(70));
  if (missingFromEn.length === 0) {
    console.log('✓ No missing keys in English translations!');
  } else {
    console.log(`Found ${missingFromEn.length} keys missing from English translations:`);
    console.log();

    const byFile = new Map();
    for (const { key, usages } of missingFromEn) {
      const file = usages[0].file;
      if (!byFile.has(file)) byFile.set(file, []);
      byFile.get(file).push({ key, usages });
    }

    const sortedFiles = Array.from(byFile.entries()).sort((a, b) => b[1].length - a[1].length);
    for (const [file, keys] of sortedFiles.slice(0, 20)) {
      console.log(`\n  FILE: ${file} (${keys.length} missing keys)`);
      console.log(`  Namespaces: ${keys[0].usages[0].namespaces.join(', ')}`);
      for (const { key } of keys.slice(0, 5)) {
        console.log(`    - ${key}`);
      }
      if (keys.length > 5) {
        console.log(`    ... and ${keys.length - 5} more`);
      }
    }

    if (sortedFiles.length > 20) {
      console.log(`\n  ... and ${sortedFiles.length - 20} more files`);
    }
  }

  console.log();
  console.log('='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total unique translation keys used: ${uniqueKeys.size}`);
  console.log(`Missing from Arabic: ${missingFromAr.length}`);
  console.log(`Missing from English: ${missingFromEn.length}`);
  console.log('='.repeat(70));

  if (missingFromAr.length === 0 && missingFromEn.length === 0) {
    console.log('\n✓ All translation keys are present in both languages!');
  }
}

main();
