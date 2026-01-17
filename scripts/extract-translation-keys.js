#!/usr/bin/env node

/**
 * Translation Key Extraction and Verification Script
 *
 * This script extracts all translation keys from React components and verifies
 * they exist in both Arabic and English translation files.
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

// Patterns to extract translation keys
const TRANSLATION_PATTERNS = [
  // t('key') or t("key") or t(`key`)
  /\bt\s*\(\s*(['"`])([^'"`\n]+?)\1/g,
  // t('namespace:key') patterns
  /\bt\s*\(\s*(['"`])([a-zA-Z0-9_-]+:[^'"`\n]+?)\1/g,
  // i18n.t('key')
  /i18n\.t\s*\(\s*(['"`])([^'"`\n]+?)\1/g,
  // {t('key')}
  /\{\s*t\s*\(\s*(['"`])([^'"`\n]+?)\1/g,
  // t('key', { defaultValue: 'xxx' })
  /\bt\s*\(\s*(['"`])([^'"`\n]+?)\1\s*,/g,
  // Trans component with i18nKey
  /<Trans[^>]+i18nKey\s*=\s*(['"`])([^'"`\n]+?)\1/g,
];

// Helper function to recursively get all .tsx and .ts files
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

// Helper function to recursively get all JSON files
function getAllJsonFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      getAllJsonFiles(fullPath, files);
    } else if (item.isFile() && item.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Load all translation keys from JSON files
function loadTranslationKeys(localeDir) {
  const keys = new Set();
  const jsonFiles = getAllJsonFiles(localeDir);

  for (const file of jsonFiles) {
    try {
      const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const relativePath = path.relative(localeDir, file);
      const namespace = relativePath.replace(/\.json$/, '').replace(/[/\\]/g, '/');

      // Extract all keys recursively
      extractKeysFromObject(content, '', namespace, keys);
    } catch (e) {
      console.error(`Error parsing ${file}: ${e.message}`);
    }
  }

  return keys;
}

// Recursively extract keys from JSON object
function extractKeysFromObject(obj, prefix, namespace, keys) {
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      extractKeysFromObject(value, fullKey, namespace, keys);
    } else {
      // Add key with namespace prefix for non-translation namespace
      if (namespace === 'translation') {
        keys.add(fullKey);
      } else {
        keys.add(`${namespace}:${fullKey}`);
        // Also add without namespace for flexibility
        keys.add(fullKey);
      }
    }
  }
}

// Extract translation keys from a file
function extractTranslationKeys(filePath, content) {
  const keys = [];

  // Find namespaces used in useTranslation
  const namespaceMatch = content.match(/useTranslation\s*\(\s*\[([^\]]+)\]/);
  let namespaces = ['translation'];
  if (namespaceMatch) {
    namespaces = namespaceMatch[1]
      .split(',')
      .map(s => s.trim().replace(/['"]/g, ''))
      .filter(Boolean);
  }

  // Also check for single namespace
  const singleNsMatch = content.match(/useTranslation\s*\(\s*(['"])([^'"]+)\1/);
  if (singleNsMatch) {
    namespaces = [singleNsMatch[2]];
  }

  for (const pattern of TRANSLATION_PATTERNS) {
    // Reset regex state
    pattern.lastIndex = 0;
    let match;

    while ((match = pattern.exec(content)) !== null) {
      const rawKey = match[2];
      if (rawKey) {
        // Find line number
        const position = match.index;
        let lineNumber = 1;
        for (let i = 0; i < position && i < content.length; i++) {
          if (content[i] === '\n') lineNumber++;
        }

        keys.push({
          key: rawKey,
          file: filePath,
          line: lineNumber,
          namespaces: namespaces,
        });
      }
    }
  }

  return keys;
}

// Check for hardcoded strings in JSX - improved version
function findHardcodedStrings(filePath, content) {
  const hardcoded = [];

  // Skip type definition files and non-component files
  if (filePath.endsWith('.d.ts') || !content.includes('return')) {
    return hardcoded;
  }

  // Find JSX return blocks
  const jsxBlocks = [];
  const returnMatches = content.matchAll(/return\s*\(\s*([\s\S]*?)^\s*\);?/gm);
  for (const match of returnMatches) {
    jsxBlocks.push({ start: match.index, content: match[1] });
  }

  // Also check for direct JSX assignments
  const jsxAssignments = content.matchAll(/(?:const|let)\s+\w+\s*=\s*\(\s*([\s\S]*?)^\s*\);/gm);
  for (const match of jsxAssignments) {
    if (match[1].includes('<') && match[1].includes('>')) {
      jsxBlocks.push({ start: match.index, content: match[1] });
    }
  }

  // Pattern for real text content in JSX (between tags, not expressions)
  // Match text that's clearly visible content
  const textPatterns = [
    // Text directly in JSX tags
    { regex: />([A-Za-z\u0600-\u06FF][^<>{}]*?)</g, type: 'text' },
    // placeholder with hardcoded text
    { regex: /placeholder\s*=\s*"([^"]+)"/g, type: 'placeholder' },
    // title with hardcoded text (not data-title or similar)
    { regex: /(?<![a-z-])title\s*=\s*"([^"]+)"/g, type: 'title' },
    // aria-label with hardcoded text
    { regex: /aria-label\s*=\s*"([^"]+)"/g, type: 'aria-label' },
    // alt with hardcoded text
    { regex: /alt\s*=\s*"([^"]+)"/g, type: 'alt' },
  ];

  for (const { regex, type } of textPatterns) {
    regex.lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const text = match[1].trim();

      // Skip if empty or too short
      if (!text || text.length < 2) continue;

      // Skip if it looks like code/state/technical
      if (
        // State patterns
        /^['"`]?\s*$/.test(text) ||
        /useState|useEffect|useRef/.test(text) ||
        // Single characters or punctuation
        /^[.,;:!?*+\-/\\|=_@#$%^&()[\]{}'"<>`~]+$/.test(text) ||
        // Numbers and units
        /^\d+(\.\d+)?(%|px|em|rem|vh|vw|ms|s)?$/.test(text) ||
        // CSS values
        /^(flex|grid|block|inline|none|hidden|auto|inherit|initial)$/i.test(text) ||
        // Technical patterns
        /^(true|false|null|undefined|NaN)$/i.test(text) ||
        // Variable names / code patterns
        /^[a-z_$][a-zA-Z0-9_$]*$/.test(text) ||
        // Template literal parts
        text.includes('${') ||
        // Already translated patterns
        /^\{t\(/.test(text) ||
        text.startsWith('{') ||
        // URLs
        /^https?:\/\//.test(text) ||
        // Color codes
        /^#[0-9a-fA-F]{3,8}$/.test(text) ||
        // Single words that are likely classnames or props
        (/^[a-z]+$/i.test(text) && text.length < 10) ||
        // Technical strings
        /^(className|onClick|onChange|onSubmit|value|key|id|name|type|href|src|dir)$/i.test(text)
      ) {
        continue;
      }

      // Find line number
      const position = match.index;
      let lineNumber = 1;
      for (let i = 0; i < position && i < content.length; i++) {
        if (content[i] === '\n') lineNumber++;
      }

      // Check if it's inside a translation call (look at context)
      const contextStart = Math.max(0, match.index - 50);
      const contextEnd = Math.min(content.length, match.index + text.length + 50);
      const context = content.substring(contextStart, contextEnd);

      // Skip if wrapped in t() or translation function
      if (/\{t\s*\(/.test(context) && context.indexOf('{t(') < context.indexOf(text)) {
        continue;
      }

      hardcoded.push({
        text: text.substring(0, 60) + (text.length > 60 ? '...' : ''),
        file: filePath,
        line: lineNumber,
        type: type,
      });
    }
  }

  return hardcoded;
}

// Check if a key exists in translations
function keyExists(key, translationKeys, namespaces) {
  // Direct key check
  if (translationKeys.has(key)) return true;

  // Key with namespace
  if (key.includes(':')) {
    const colonIndex = key.indexOf(':');
    const ns = key.substring(0, colonIndex);
    const keyPath = key.substring(colonIndex + 1);

    // Check various combinations
    if (translationKeys.has(key)) return true;
    if (translationKeys.has(`${ns}/${keyPath}`)) return true;
    if (translationKeys.has(keyPath)) return true;

    // For calc/ prefixed namespaces
    const nsPath = ns.replace(/:/g, '/');
    if (translationKeys.has(`${nsPath}:${keyPath}`)) return true;
  }

  // Check with each provided namespace
  for (const ns of namespaces) {
    if (translationKeys.has(`${ns}:${key}`)) return true;
    if (translationKeys.has(`${ns}/${key}`)) return true;

    // For calc/ namespaces, construct full path
    const nsPath = ns.replace(/:/g, '/');
    if (translationKeys.has(`${nsPath}:${key}`)) return true;
  }

  return false;
}

// Main execution
function main() {
  console.log('='.repeat(70));
  console.log('TRANSLATION KEY EXTRACTION AND VERIFICATION');
  console.log('='.repeat(70));
  console.log();

  // Load translation keys
  console.log('Loading translation files...');
  const arKeys = loadTranslationKeys(AR_DIR);
  const enKeys = loadTranslationKeys(EN_DIR);
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
  const allHardcoded = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const relativePath = path.relative(SRC_DIR, file);

      // Extract translation keys
      const keys = extractTranslationKeys(relativePath, content);
      allKeys.push(...keys);

      // Find hardcoded strings (only in .tsx files)
      if (file.endsWith('.tsx')) {
        const hardcoded = findHardcodedStrings(relativePath, content);
        allHardcoded.push(...hardcoded);
      }
    } catch (e) {
      console.error(`Error processing ${file}: ${e.message}`);
    }
  }

  // Get unique keys
  const uniqueKeys = new Map();
  for (const keyInfo of allKeys) {
    const keyId = `${keyInfo.key}`;
    if (!uniqueKeys.has(keyId)) {
      uniqueKeys.set(keyId, []);
    }
    uniqueKeys.get(keyId).push(keyInfo);
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

    if (!keyExists(key, arKeys, namespaces)) {
      missingFromAr.push({ key, usages });
    }
    if (!keyExists(key, enKeys, namespaces)) {
      missingFromEn.push({ key, usages });
    }
  }

  // Output missing from AR
  console.log('='.repeat(70));
  console.log('=== MISSING FROM AR ===');
  console.log('='.repeat(70));
  if (missingFromAr.length === 0) {
    console.log('No missing keys in Arabic translations!');
  } else {
    console.log(`Found ${missingFromAr.length} keys missing from Arabic translations:`);
    console.log();

    // Group by component/file for better readability
    const byFile = new Map();
    for (const { key, usages } of missingFromAr) {
      const file = usages[0].file;
      if (!byFile.has(file)) byFile.set(file, []);
      byFile.get(file).push({ key, usages });
    }

    for (const [file, keys] of Array.from(byFile.entries()).sort()) {
      console.log(`\n  FILE: ${file}`);
      for (const { key, usages } of keys.sort((a, b) => a.key.localeCompare(b.key))) {
        console.log(`    - ${key} (line ${usages[0].line})`);
      }
    }
  }
  console.log();

  // Output missing from EN
  console.log('='.repeat(70));
  console.log('=== MISSING FROM EN ===');
  console.log('='.repeat(70));
  if (missingFromEn.length === 0) {
    console.log('No missing keys in English translations!');
  } else {
    console.log(`Found ${missingFromEn.length} keys missing from English translations:`);
    console.log();

    // Group by component/file for better readability
    const byFile = new Map();
    for (const { key, usages } of missingFromEn) {
      const file = usages[0].file;
      if (!byFile.has(file)) byFile.set(file, []);
      byFile.get(file).push({ key, usages });
    }

    for (const [file, keys] of Array.from(byFile.entries()).sort()) {
      console.log(`\n  FILE: ${file}`);
      for (const { key, usages } of keys.sort((a, b) => a.key.localeCompare(b.key))) {
        console.log(`    - ${key} (line ${usages[0].line})`);
      }
    }
  }
  console.log();

  // Output hardcoded strings
  console.log('='.repeat(70));
  console.log('=== HARDCODED STRINGS (POTENTIAL) ===');
  console.log('='.repeat(70));

  // Filter out likely false positives more aggressively
  const filteredHardcoded = allHardcoded.filter(h => {
    const text = h.text;
    // Skip very short strings
    if (text.length < 3) return false;
    // Skip strings that look like CSS classes or technical values
    if (/^[a-z-]+$/.test(text) && text.length < 12) return false;
    // Skip numbers and measurements
    if (/^\d/.test(text)) return false;
    // Skip common symbols
    if (['...', '..', '.', '|', '/', '-', '+', '*', '&', '@'].includes(text)) return false;
    // Skip common code patterns that slip through
    if (/^const |^let |^function |^import |^export /.test(text)) return false;
    // Skip strings starting with special chars
    if (/^['"`;:()[\]{}]/.test(text)) return false;
    return true;
  });

  // Deduplicate by text
  const uniqueHardcoded = new Map();
  for (const h of filteredHardcoded) {
    const key = h.text;
    if (!uniqueHardcoded.has(key)) {
      uniqueHardcoded.set(key, []);
    }
    uniqueHardcoded.get(key).push(h);
  }

  if (uniqueHardcoded.size === 0) {
    console.log('No significant hardcoded strings detected!');
  } else {
    console.log(`Found ${uniqueHardcoded.size} potentially hardcoded strings:`);
    console.log();

    // Group by file
    const byFile = new Map();
    for (const [text, occurrences] of uniqueHardcoded) {
      const file = occurrences[0].file;
      if (!byFile.has(file)) byFile.set(file, []);
      byFile.get(file).push({ text, occurrences });
    }

    let totalShown = 0;
    for (const [file, items] of Array.from(byFile.entries()).sort()) {
      if (totalShown >= 150) {
        console.log(`\n... and more in other files (${uniqueHardcoded.size - totalShown} total remaining)`);
        break;
      }
      console.log(`\n  FILE: ${file}`);
      for (const { text, occurrences } of items.sort((a, b) => a.occurrences[0].line - b.occurrences[0].line)) {
        if (totalShown >= 150) break;
        const first = occurrences[0];
        console.log(`    - "${text}" (${first.type}, line ${first.line})`);
        totalShown++;
      }
    }
  }

  console.log();
  console.log('='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total unique translation keys used: ${uniqueKeys.size}`);
  console.log(`Missing from Arabic: ${missingFromAr.length}`);
  console.log(`Missing from English: ${missingFromEn.length}`);
  console.log(`Potential hardcoded strings: ${uniqueHardcoded.size}`);
  console.log('='.repeat(70));

  // Return exit code
  if (missingFromAr.length > 0 || missingFromEn.length > 0) {
    process.exit(1);
  }
}

main();
