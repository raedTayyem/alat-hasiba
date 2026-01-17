#!/usr/bin/env node

/**
 * Advanced Translation Analysis Script
 * Detects translation issues that simple searches miss
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');

// Configuration
const CONFIG = {
  languages: ['en', 'ar'],
  minTranslationLength: 2,
  suspiciouslyShortMaxLength: 3,
  htmlTags: /<\/?[a-zA-Z][^>]*>/g,
  allowedHtmlPatterns: /<0\/?>|<\/0>|<[0-9]+\/?>|<\/[0-9]+>|<br\/?>/g, // React-i18next components
  placeholderPattern: /\{\{[^}]+\}\}/g,
  keyLikeValuePatterns: [
    /^[a-z]+[A-Z][a-zA-Z]*$/, // camelCase
    /^[a-z]+(_[a-z]+)+$/, // snake_case
    /^[a-z]+(-[a-z]+)+$/, // kebab-case
    /^[A-Z][a-z]+[A-Z]/, // PascalCase
    /\.[a-zA-Z]+$/, // contains dot notation
  ],
  namingConventions: {
    camelCase: /^[a-z]+[a-zA-Z0-9]*$/,
    snake_case: /^[a-z]+(_[a-z0-9]+)*$/,
    kebab_case: /^[a-z]+(-[a-z0-9]+)+$/,
    UPPER_SNAKE: /^[A-Z]+(_[A-Z0-9]+)*$/,
  }
};

// Results storage
const results = {
  syntaxErrors: [],
  duplicateKeys: [],
  missingKeys: { en: [], ar: [] },
  keyLikeValues: [],
  suspiciouslyShort: [],
  unexpectedHtml: [],
  unbalancedPlaceholders: [],
  inconsistentNaming: [],
  nestedKeyIssues: [],
  fileSummary: {},
  totals: { en: 0, ar: 0 }
};

// ==================== UTILITY FUNCTIONS ====================

function getAllJsonFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllJsonFiles(fullPath, files);
    } else if (entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseJsonSafely(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);
    return { success: true, data: json, content };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      content: fs.readFileSync(filePath, 'utf-8')
    };
  }
}

function flattenObject(obj, prefix = '') {
  const result = {};

  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, flattenObject(obj[key], newKey));
    } else {
      result[newKey] = obj[key];
    }
  }

  return result;
}

function getRelativePath(filePath) {
  return path.relative(LOCALES_DIR, filePath);
}

function detectNamingConvention(key) {
  // Get the last segment of the key (after the last dot)
  const lastSegment = key.split('.').pop();

  for (const [convention, pattern] of Object.entries(CONFIG.namingConventions)) {
    if (pattern.test(lastSegment)) {
      return convention;
    }
  }
  return 'mixed';
}

// ==================== ANALYSIS FUNCTIONS ====================

function checkSyntaxErrors(filePath) {
  const result = parseJsonSafely(filePath);
  if (!result.success) {
    results.syntaxErrors.push({
      file: getRelativePath(filePath),
      error: result.error
    });
    return null;
  }
  return result.data;
}

function checkDuplicateKeys(filePath, content) {
  const duplicates = [];
  const seen = new Map();

  // Regex to find all JSON keys
  const keyPattern = /"([^"]+)"\s*:/g;
  let match;
  let lineNumber = 1;
  let lastIndex = 0;

  while ((match = keyPattern.exec(content)) !== null) {
    // Calculate line number
    const textBefore = content.substring(lastIndex, match.index);
    lineNumber += (textBefore.match(/\n/g) || []).length;
    lastIndex = match.index;

    const key = match[1];

    // Get context (parent keys) by counting braces
    const textBeforeKey = content.substring(0, match.index);
    let braceCount = 0;

    for (let i = 0; i < textBeforeKey.length; i++) {
      if (textBeforeKey[i] === '{') braceCount++;
      else if (textBeforeKey[i] === '}') braceCount--;
    }

    const contextKey = `depth:${braceCount}:${key}`;

    if (seen.has(contextKey)) {
      const prevLine = seen.get(contextKey);
      duplicates.push({
        file: getRelativePath(filePath),
        key: key,
        lines: [prevLine, lineNumber]
      });
    } else {
      seen.set(contextKey, lineNumber);
    }
  }

  if (duplicates.length > 0) {
    results.duplicateKeys.push(...duplicates);
  }
}

function checkKeyLikeValues(flatData, filePath, lang) {
  for (const [key, value] of Object.entries(flatData)) {
    if (typeof value !== 'string') continue;

    // Skip very short values
    if (value.length < 4) continue;

    // Check if value looks like a translation key
    for (const pattern of CONFIG.keyLikeValuePatterns) {
      if (pattern.test(value) && !value.includes(' ')) {
        // Additional check: don't flag common abbreviations or technical terms
        if (!/^(BMI|PDF|URL|API|HTML|CSS|JSON|XML|USD|EUR|SAR|AED|LED|HP|PSI|kWh|VO2|Title|Description|Reset|Calculate|Swap|Value|Rate|Time|Year|Month|Hour|Minute|Day|Total|Edit|Sort|Next|Back|Save|Copy|Home|About|Search|Filter|Close|Email|Male|Female|Result|Ratio|Score|Weight|Gender|Offset|Distance|Voltage|Current)$/i.test(value)) {
          results.keyLikeValues.push({
            file: getRelativePath(filePath),
            lang,
            key,
            value,
            pattern: pattern.toString()
          });
        }
        break;
      }
    }
  }
}

function checkSuspiciouslyShortTranslations(flatData, filePath, lang) {
  for (const [key, value] of Object.entries(flatData)) {
    if (typeof value !== 'string') continue;

    // Skip keys that typically have short values
    const shortValueKeys = ['ar', 'en', 'cm', 'kg', 'm', 'g', 'V', 'W', 'A', 'J', 'N', 'C', 'F', 'L'];
    const lastKeySegment = key.split('.').pop();
    if (shortValueKeys.includes(lastKeySegment)) continue;

    // Skip unit abbreviations
    if (key.includes('.units.')) continue;

    // Skip single-char intended values
    if (lastKeySegment === 'plus_sign' || lastKeySegment === 'times') continue;

    // Check for suspiciously short translations (1-3 chars) that aren't units
    if (value.length > 0 && value.length <= CONFIG.suspiciouslyShortMaxLength) {
      // Skip if it's a common short word or symbol
      if (!/^[+\-*/=%$#@!.,;:'"()[\]{}<>]$/.test(value)) {
        results.suspiciouslyShort.push({
          file: getRelativePath(filePath),
          lang,
          key,
          value,
          length: value.length
        });
      }
    }
  }
}

function checkUnexpectedHtml(flatData, filePath, lang) {
  for (const [key, value] of Object.entries(flatData)) {
    if (typeof value !== 'string') continue;

    // Find HTML tags
    const htmlMatches = value.match(CONFIG.htmlTags);
    if (!htmlMatches) continue;

    // Filter out allowed patterns (React-i18next components)
    const unexpectedHtml = htmlMatches.filter(tag => !CONFIG.allowedHtmlPatterns.test(tag));

    if (unexpectedHtml.length > 0) {
      results.unexpectedHtml.push({
        file: getRelativePath(filePath),
        lang,
        key,
        value: value.substring(0, 100) + (value.length > 100 ? '...' : ''),
        htmlFound: unexpectedHtml
      });
    }
  }
}

function checkUnbalancedPlaceholders(enFlat, arFlat, filePath) {
  const enFile = filePath;
  const arFile = filePath.replace('/en/', '/ar/');

  for (const [key, enValue] of Object.entries(enFlat)) {
    if (typeof enValue !== 'string') continue;

    const arValue = arFlat[key];
    if (typeof arValue !== 'string') continue;

    // Extract placeholders
    const enPlaceholders = (enValue.match(CONFIG.placeholderPattern) || []).sort();
    const arPlaceholders = (arValue.match(CONFIG.placeholderPattern) || []).sort();

    // Compare placeholders
    const enStr = enPlaceholders.join(',');
    const arStr = arPlaceholders.join(',');

    if (enStr !== arStr) {
      results.unbalancedPlaceholders.push({
        key,
        enFile: getRelativePath(enFile),
        arFile: getRelativePath(arFile),
        enPlaceholders,
        arPlaceholders
      });
    }
  }
}

function checkInconsistentNaming(flatData, filePath) {
  const conventions = {};

  for (const key of Object.keys(flatData)) {
    const convention = detectNamingConvention(key);
    if (!conventions[convention]) {
      conventions[convention] = [];
    }
    conventions[convention].push(key);
  }

  // If multiple conventions are used in the same file, report it
  const usedConventions = Object.keys(conventions).filter(c => c !== 'mixed');

  if (usedConventions.length > 1) {
    results.inconsistentNaming.push({
      file: getRelativePath(filePath),
      conventions: Object.fromEntries(
        Object.entries(conventions)
          .filter(([conv]) => conv !== 'mixed')
          .map(([conv, keys]) => [conv, keys.length])
      ),
      examples: Object.fromEntries(
        Object.entries(conventions)
          .filter(([conv]) => conv !== 'mixed')
          .map(([conv, keys]) => [conv, keys.slice(0, 3)])
      )
    });
  }
}

function checkNestedKeyIssues(data, filePath, prefix = '') {
  for (const key in data) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = data[key];

    // Check for deeply nested structures (more than 5 levels)
    const depth = fullKey.split('.').length;
    if (depth > 5) {
      results.nestedKeyIssues.push({
        file: getRelativePath(filePath),
        key: fullKey,
        issue: 'excessive_nesting',
        depth
      });
    }

    // Check for keys that shadow parent keys
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      checkNestedKeyIssues(value, filePath, fullKey);
    }

    // Check for empty objects
    if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length === 0) {
      results.nestedKeyIssues.push({
        file: getRelativePath(filePath),
        key: fullKey,
        issue: 'empty_object'
      });
    }
  }
}

function findMissingKeys(enFlat, arFlat, enFile, arFile) {
  const enKeys = new Set(Object.keys(enFlat));
  const arKeys = new Set(Object.keys(arFlat));

  // Keys in EN but not in AR
  for (const key of enKeys) {
    if (!arKeys.has(key)) {
      results.missingKeys.ar.push({
        key,
        enFile: getRelativePath(enFile),
        arFile: getRelativePath(arFile)
      });
    }
  }

  // Keys in AR but not in EN
  for (const key of arKeys) {
    if (!enKeys.has(key)) {
      results.missingKeys.en.push({
        key,
        enFile: getRelativePath(enFile),
        arFile: getRelativePath(arFile)
      });
    }
  }
}

// ==================== MAIN ANALYSIS ====================

function analyzeFile(filePath, lang) {
  const relativePath = getRelativePath(filePath);

  // Check syntax
  const data = checkSyntaxErrors(filePath);
  if (!data) return null;

  // Read raw content for duplicate key detection
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  checkDuplicateKeys(filePath, rawContent);

  // Flatten for analysis
  const flatData = flattenObject(data);
  const keyCount = Object.keys(flatData).length;

  // Store file summary
  if (!results.fileSummary[relativePath]) {
    results.fileSummary[relativePath] = {};
  }
  results.fileSummary[relativePath][lang] = keyCount;
  results.totals[lang] += keyCount;

  // Run checks
  checkKeyLikeValues(flatData, filePath, lang);
  checkSuspiciouslyShortTranslations(flatData, filePath, lang);
  checkUnexpectedHtml(flatData, filePath, lang);
  checkInconsistentNaming(flatData, filePath);
  checkNestedKeyIssues(data, filePath);

  return { data, flatData };
}

function analyzeAllFiles() {
  console.log('='.repeat(80));
  console.log('TRANSLATION ANALYSIS REPORT');
  console.log('='.repeat(80));
  console.log(`\nAnalyzing translations in: ${LOCALES_DIR}\n`);

  const enDir = path.join(LOCALES_DIR, 'en');
  const arDir = path.join(LOCALES_DIR, 'ar');

  const enFiles = getAllJsonFiles(enDir);
  const arFiles = getAllJsonFiles(arDir);

  console.log(`Found ${enFiles.length} English files`);
  console.log(`Found ${arFiles.length} Arabic files\n`);

  // Analyze each file pair
  for (const enFile of enFiles) {
    const relativePath = path.relative(enDir, enFile);
    const arFile = path.join(arDir, relativePath);

    const enResult = analyzeFile(enFile, 'en');

    if (fs.existsSync(arFile)) {
      const arResult = analyzeFile(arFile, 'ar');

      if (enResult && arResult) {
        // Compare EN and AR
        findMissingKeys(enResult.flatData, arResult.flatData, enFile, arFile);
        checkUnbalancedPlaceholders(enResult.flatData, arResult.flatData, enFile);
      }
    } else {
      console.log(`WARNING: Missing Arabic file for ${relativePath}`);
    }
  }

  // Check for Arabic files without English counterparts
  for (const arFile of arFiles) {
    const relativePath = path.relative(arDir, arFile);
    const enFile = path.join(enDir, relativePath);

    if (!fs.existsSync(enFile)) {
      console.log(`WARNING: Missing English file for ${relativePath}`);
    }
  }

  printResults();
}

function printResults() {
  console.log('\n' + '='.repeat(80));
  console.log('1. SYNTAX ERRORS');
  console.log('='.repeat(80));
  if (results.syntaxErrors.length === 0) {
    console.log('No syntax errors found.');
  } else {
    console.log(`Found ${results.syntaxErrors.length} files with syntax errors:\n`);
    for (const err of results.syntaxErrors) {
      console.log(`  File: ${err.file}`);
      console.log(`  Error: ${err.error}\n`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('2. DUPLICATE KEYS');
  console.log('='.repeat(80));
  if (results.duplicateKeys.length === 0) {
    console.log('No duplicate keys found.');
  } else {
    console.log(`Found ${results.duplicateKeys.length} duplicate keys:\n`);
    for (const dup of results.duplicateKeys) {
      console.log(`  File: ${dup.file}`);
      console.log(`  Key: "${dup.key}" (lines ${dup.lines.join(', ')})\n`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('3. MISSING KEYS');
  console.log('='.repeat(80));
  console.log(`\nMissing in Arabic (${results.missingKeys.ar.length} keys):`);
  if (results.missingKeys.ar.length > 0) {
    const grouped = {};
    for (const item of results.missingKeys.ar) {
      if (!grouped[item.enFile]) grouped[item.enFile] = [];
      grouped[item.enFile].push(item.key);
    }
    for (const [file, keys] of Object.entries(grouped)) {
      console.log(`\n  ${file}: ${keys.length} missing keys`);
      for (const key of keys.slice(0, 10)) {
        console.log(`    - ${key}`);
      }
      if (keys.length > 10) {
        console.log(`    ... and ${keys.length - 10} more`);
      }
    }
  } else {
    console.log('  None');
  }

  console.log(`\nMissing in English (${results.missingKeys.en.length} keys):`);
  if (results.missingKeys.en.length > 0) {
    const grouped = {};
    for (const item of results.missingKeys.en) {
      if (!grouped[item.arFile]) grouped[item.arFile] = [];
      grouped[item.arFile].push(item.key);
    }
    for (const [file, keys] of Object.entries(grouped)) {
      console.log(`\n  ${file}: ${keys.length} missing keys`);
      for (const key of keys.slice(0, 10)) {
        console.log(`    - ${key}`);
      }
      if (keys.length > 10) {
        console.log(`    ... and ${keys.length - 10} more`);
      }
    }
  } else {
    console.log('  None');
  }

  console.log('\n' + '='.repeat(80));
  console.log('4. VALUES THAT LOOK LIKE TRANSLATION KEYS (not actual translations)');
  console.log('='.repeat(80));
  if (results.keyLikeValues.length === 0) {
    console.log('No key-like values found.');
  } else {
    console.log(`Found ${results.keyLikeValues.length} suspicious values:\n`);
    for (const item of results.keyLikeValues.slice(0, 30)) {
      console.log(`  File: ${item.file} [${item.lang}]`);
      console.log(`  Key: ${item.key}`);
      console.log(`  Value: "${item.value}"\n`);
    }
    if (results.keyLikeValues.length > 30) {
      console.log(`  ... and ${results.keyLikeValues.length - 30} more`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('5. SUSPICIOUSLY SHORT TRANSLATIONS');
  console.log('='.repeat(80));
  if (results.suspiciouslyShort.length === 0) {
    console.log('No suspiciously short translations found.');
  } else {
    console.log(`Found ${results.suspiciouslyShort.length} short translations:\n`);
    for (const item of results.suspiciouslyShort.slice(0, 30)) {
      console.log(`  File: ${item.file} [${item.lang}]`);
      console.log(`  Key: ${item.key}`);
      console.log(`  Value: "${item.value}" (${item.length} chars)\n`);
    }
    if (results.suspiciouslyShort.length > 30) {
      console.log(`  ... and ${results.suspiciouslyShort.length - 30} more`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('6. UNEXPECTED HTML IN TRANSLATIONS');
  console.log('='.repeat(80));
  if (results.unexpectedHtml.length === 0) {
    console.log('No unexpected HTML found.');
  } else {
    console.log(`Found ${results.unexpectedHtml.length} translations with unexpected HTML:\n`);
    for (const item of results.unexpectedHtml) {
      console.log(`  File: ${item.file} [${item.lang}]`);
      console.log(`  Key: ${item.key}`);
      console.log(`  HTML found: ${item.htmlFound.join(', ')}`);
      console.log(`  Value: "${item.value}"\n`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('7. UNBALANCED PLACEHOLDERS ({{variable}}) BETWEEN LANGUAGES');
  console.log('='.repeat(80));
  if (results.unbalancedPlaceholders.length === 0) {
    console.log('No unbalanced placeholders found.');
  } else {
    console.log(`Found ${results.unbalancedPlaceholders.length} unbalanced placeholders:\n`);
    for (const item of results.unbalancedPlaceholders) {
      console.log(`  Key: ${item.key}`);
      console.log(`  EN (${item.enFile}): ${item.enPlaceholders.join(', ') || 'none'}`);
      console.log(`  AR (${item.arFile}): ${item.arPlaceholders.join(', ') || 'none'}\n`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('8. INCONSISTENT NAMING CONVENTIONS');
  console.log('='.repeat(80));
  if (results.inconsistentNaming.length === 0) {
    console.log('All files use consistent naming conventions.');
  } else {
    console.log(`Found ${results.inconsistentNaming.length} files with mixed naming:\n`);
    for (const item of results.inconsistentNaming) {
      console.log(`  File: ${item.file}`);
      console.log(`  Conventions used: ${JSON.stringify(item.conventions)}`);
      console.log(`  Examples:`);
      for (const [conv, examples] of Object.entries(item.examples)) {
        console.log(`    ${conv}: ${examples.join(', ')}`);
      }
      console.log();
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('9. NESTED KEY ISSUES');
  console.log('='.repeat(80));
  if (results.nestedKeyIssues.length === 0) {
    console.log('No nested key issues found.');
  } else {
    console.log(`Found ${results.nestedKeyIssues.length} nested key issues:\n`);
    for (const item of results.nestedKeyIssues) {
      console.log(`  File: ${item.file}`);
      console.log(`  Key: ${item.key}`);
      console.log(`  Issue: ${item.issue}${item.depth ? ` (depth: ${item.depth})` : ''}\n`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('10. FILE SUMMARY');
  console.log('='.repeat(80));

  console.log(`\nTotal Translation Keys:`);
  console.log(`  English: ${results.totals.en}`);
  console.log(`  Arabic: ${results.totals.ar}`);

  console.log(`\nPer-File Breakdown:`);
  console.log('-'.repeat(80));
  console.log(`${'File'.padEnd(50)} ${'EN'.padStart(8)} ${'AR'.padStart(8)} ${'Complete'.padStart(10)}`);
  console.log('-'.repeat(80));

  // Group by base filename
  const baseFiles = new Set();
  for (const file of Object.keys(results.fileSummary)) {
    const baseName = file.replace(/^(en|ar)\//, '');
    baseFiles.add(baseName);
  }

  const priorityList = [];

  for (const baseName of [...baseFiles].sort()) {
    const enFile = `en/${baseName}`;
    const arFile = `ar/${baseName}`;

    const enCount = results.fileSummary[enFile]?.en || 0;
    const arCount = results.fileSummary[arFile]?.ar || 0;

    const maxCount = Math.max(enCount, arCount);
    const completeness = maxCount > 0 ? Math.round((Math.min(enCount, arCount) / maxCount) * 100) : 100;

    console.log(`${baseName.padEnd(50)} ${String(enCount).padStart(8)} ${String(arCount).padStart(8)} ${(completeness + '%').padStart(10)}`);

    if (completeness < 100 || enCount !== arCount) {
      priorityList.push({
        file: baseName,
        enCount,
        arCount,
        completeness,
        missingInAr: enCount - arCount,
        missingInEn: arCount - enCount
      });
    }
  }

  // Priority list
  console.log('\n' + '='.repeat(80));
  console.log('11. PRIORITY FILES NEEDING ATTENTION');
  console.log('='.repeat(80));

  priorityList.sort((a, b) => {
    // Sort by absolute difference (most mismatched first)
    const aDiff = Math.abs(a.enCount - a.arCount);
    const bDiff = Math.abs(b.enCount - b.arCount);
    return bDiff - aDiff;
  });

  if (priorityList.length === 0) {
    console.log('\nAll files are complete and synchronized!');
  } else {
    console.log(`\n${priorityList.length} files need attention:\n`);
    for (const item of priorityList.slice(0, 20)) {
      console.log(`  ${item.file}`);
      if (item.missingInAr > 0) {
        console.log(`    - Missing ${item.missingInAr} Arabic translations`);
      }
      if (item.missingInEn > 0) {
        console.log(`    - Missing ${item.missingInEn} English translations`);
      }
      console.log(`    - Completeness: ${item.completeness}%\n`);
    }
    if (priorityList.length > 20) {
      console.log(`  ... and ${priorityList.length - 20} more files`);
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(80));
  console.log('ANALYSIS COMPLETE');
  console.log('='.repeat(80));
  console.log(`
Summary of Issues Found:
  - Syntax Errors: ${results.syntaxErrors.length}
  - Duplicate Keys: ${results.duplicateKeys.length}
  - Missing in Arabic: ${results.missingKeys.ar.length} keys
  - Missing in English: ${results.missingKeys.en.length} keys
  - Key-like Values: ${results.keyLikeValues.length}
  - Short Translations: ${results.suspiciouslyShort.length}
  - Unexpected HTML: ${results.unexpectedHtml.length}
  - Unbalanced Placeholders: ${results.unbalancedPlaceholders.length}
  - Inconsistent Naming: ${results.inconsistentNaming.length} files
  - Nested Key Issues: ${results.nestedKeyIssues.length}
  - Files Needing Attention: ${priorityList.length}

Total Issues: ${
    results.syntaxErrors.length +
    results.duplicateKeys.length +
    results.missingKeys.ar.length +
    results.missingKeys.en.length +
    results.keyLikeValues.length +
    results.suspiciouslyShort.length +
    results.unexpectedHtml.length +
    results.unbalancedPlaceholders.length +
    results.inconsistentNaming.length +
    results.nestedKeyIssues.length
  }
`);
}

// Run the analysis
analyzeAllFiles();
