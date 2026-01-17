#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, '../public/locales');
const EN_DIR = path.join(LOCALES_DIR, 'en');
const AR_DIR = path.join(LOCALES_DIR, 'ar');

const issues = [];

// Helper to flatten nested JSON objects
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

// Get all JSON files recursively
function getAllJsonFiles(dir, baseDir = dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getAllJsonFiles(filePath, baseDir));
    } else if (file.endsWith('.json')) {
      results.push(path.relative(baseDir, filePath));
    }
  });
  return results;
}

// Extract placeholders like {{variable}}
function extractPlaceholders(text) {
  if (typeof text !== 'string') return [];
  const matches = text.match(/\{\{[^}]+\}\}/g) || [];
  return matches.sort();
}

// Extract HTML tags
function extractHtmlTags(text) {
  if (typeof text !== 'string') return [];
  const matches = text.match(/<[^>]+>/g) || [];
  return matches.sort();
}

// Extract markdown formatting
function extractMarkdown(text) {
  if (typeof text !== 'string') return [];
  const patterns = [];
  if (/\*\*[^*]+\*\*/.test(text)) patterns.push('**bold**');
  if (/\*[^*]+\*/.test(text) && !/\*\*/.test(text)) patterns.push('*italic*');
  if (/\[[^\]]+\]\([^)]+\)/.test(text)) patterns.push('[link](url)');
  if (/`[^`]+`/.test(text)) patterns.push('`code`');
  return patterns;
}

// Check for developer comments
function hasDevComments(text) {
  if (typeof text !== 'string') return false;
  return /\/\/|\/\*|\*\/|#\s*TODO|#\s*FIXME|#\s*NOTE|TODO:|FIXME:|XXX:|HACK:/.test(text);
}

// Check for URLs that might need localization
function hasUrlsToLocalize(text) {
  if (typeof text !== 'string') return false;
  return /https?:\/\/[^\s"']+\/(en|ar)\//.test(text) ||
         /\/docs\/|\/help\/|\/support\//.test(text);
}

// Check if text looks truncated
function looksTruncated(text) {
  if (typeof text !== 'string') return false;
  return /\.\.\.$/.test(text.trim()) || /…$/.test(text.trim());
}

// Get character count
function getEffectiveLength(text, isArabic = false) {
  if (typeof text !== 'string') return 0;
  return text.length;
}

// Check for number format differences
function extractNumbers(text) {
  if (typeof text !== 'string') return [];
  const matches = text.match(/\d[\d,.\s]*\d|\d/g) || [];
  return matches;
}

// Main scanning function
function scanTranslations() {
  console.log('Starting exhaustive translation scan...\n');

  const enFiles = getAllJsonFiles(EN_DIR);
  const arFiles = getAllJsonFiles(AR_DIR);

  console.log(`Found ${enFiles.length} English files`);
  console.log(`Found ${arFiles.length} Arabic files\n`);

  // Track all values for duplicate detection
  const enValueMap = new Map();
  const arValueMap = new Map();

  // Process each file pair
  const allFiles = new Set([...enFiles, ...arFiles]);

  for (const relPath of allFiles) {
    const enFilePath = path.join(EN_DIR, relPath);
    const arFilePath = path.join(AR_DIR, relPath);

    let enData = {}, arData = {};
    let enFlat = {}, arFlat = {};

    // Load English file
    if (fs.existsSync(enFilePath)) {
      try {
        enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
        enFlat = flattenObject(enData);
      } catch (e) {
        issues.push({
          file: enFilePath,
          key: 'N/A',
          enValue: 'N/A',
          arValue: 'N/A',
          issueType: 'JSON_PARSE_ERROR',
          details: e.message
        });
      }
    }

    // Load Arabic file
    if (fs.existsSync(arFilePath)) {
      try {
        arData = JSON.parse(fs.readFileSync(arFilePath, 'utf8'));
        arFlat = flattenObject(arData);
      } catch (e) {
        issues.push({
          file: arFilePath,
          key: 'N/A',
          enValue: 'N/A',
          arValue: 'N/A',
          issueType: 'JSON_PARSE_ERROR',
          details: e.message
        });
      }
    }

    // Track values for duplicate detection
    for (const [key, value] of Object.entries(enFlat)) {
      if (typeof value === 'string' && value.length > 3) {
        const existing = enValueMap.get(value) || [];
        existing.push({ file: relPath, key });
        enValueMap.set(value, existing);
      }
    }

    for (const [key, value] of Object.entries(arFlat)) {
      if (typeof value === 'string' && value.length > 3) {
        const existing = arValueMap.get(value) || [];
        existing.push({ file: relPath, key });
        arValueMap.set(value, existing);
      }
    }

    // Compare keys
    const allKeys = new Set([...Object.keys(enFlat), ...Object.keys(arFlat)]);

    for (const key of allKeys) {
      const enValue = enFlat[key];
      const arValue = arFlat[key];

      // Skip if not strings
      if (typeof enValue !== 'string' && typeof arValue !== 'string') continue;

      const enStr = typeof enValue === 'string' ? enValue : '';
      const arStr = typeof arValue === 'string' ? arValue : '';

      // 2. Suspiciously short Arabic translations
      if (enStr.length > 15 && arStr.length > 0 && arStr.length < 5) {
        issues.push({
          file: relPath,
          key,
          enValue: enStr,
          arValue: arStr,
          issueType: 'SUSPICIOUSLY_SHORT_AR',
          details: `Arabic (${arStr.length} chars) much shorter than English (${enStr.length} chars)`
        });
      }

      // 3. Suspiciously long translations (either direction)
      if (enStr.length > 10 && arStr.length > 10) {
        const ratio = arStr.length / enStr.length;
        if (ratio > 3) {
          issues.push({
            file: relPath,
            key,
            enValue: enStr.substring(0, 100) + (enStr.length > 100 ? '...' : ''),
            arValue: arStr.substring(0, 100) + (arStr.length > 100 ? '...' : ''),
            issueType: 'SUSPICIOUSLY_LONG_AR',
            details: `Arabic is ${ratio.toFixed(1)}x longer than English`
          });
        } else if (ratio < 0.33) {
          issues.push({
            file: relPath,
            key,
            enValue: enStr.substring(0, 100) + (enStr.length > 100 ? '...' : ''),
            arValue: arStr.substring(0, 100) + (arStr.length > 100 ? '...' : ''),
            issueType: 'SUSPICIOUSLY_LONG_EN',
            details: `English is ${(1/ratio).toFixed(1)}x longer than Arabic`
          });
        }
      }

      // 4. Broken placeholders
      const enPlaceholders = extractPlaceholders(enStr);
      const arPlaceholders = extractPlaceholders(arStr);
      if (enPlaceholders.length > 0 || arPlaceholders.length > 0) {
        if (JSON.stringify(enPlaceholders) !== JSON.stringify(arPlaceholders)) {
          issues.push({
            file: relPath,
            key,
            enValue: enStr,
            arValue: arStr,
            issueType: 'PLACEHOLDER_MISMATCH',
            details: `EN: ${enPlaceholders.join(', ') || 'none'} | AR: ${arPlaceholders.join(', ') || 'none'}`
          });
        }
      }

      // 5. HTML/Markdown mismatch
      const enHtml = extractHtmlTags(enStr);
      const arHtml = extractHtmlTags(arStr);
      if (enHtml.length > 0 || arHtml.length > 0) {
        if (JSON.stringify(enHtml) !== JSON.stringify(arHtml)) {
          issues.push({
            file: relPath,
            key,
            enValue: enStr,
            arValue: arStr,
            issueType: 'HTML_MISMATCH',
            details: `EN: ${enHtml.join(', ') || 'none'} | AR: ${arHtml.join(', ') || 'none'}`
          });
        }
      }

      const enMd = extractMarkdown(enStr);
      const arMd = extractMarkdown(arStr);
      if (enMd.length > 0 || arMd.length > 0) {
        if (JSON.stringify(enMd) !== JSON.stringify(arMd)) {
          issues.push({
            file: relPath,
            key,
            enValue: enStr,
            arValue: arStr,
            issueType: 'MARKDOWN_MISMATCH',
            details: `EN: ${enMd.join(', ') || 'none'} | AR: ${arMd.join(', ') || 'none'}`
          });
        }
      }

      // 6. Number format differences
      const enNums = extractNumbers(enStr);
      const arNums = extractNumbers(arStr);
      if (enNums.length > 0 && arNums.length > 0) {
        const enNumsClean = enNums.map(n => n.replace(/[\s,]/g, ''));
        const arNumsClean = arNums.map(n => n.replace(/[\s,]/g, ''));
        if (enNumsClean.join('|') === arNumsClean.join('|') && enNums.join('|') !== arNums.join('|')) {
          issues.push({
            file: relPath,
            key,
            enValue: enStr,
            arValue: arStr,
            issueType: 'NUMBER_FORMAT_DIFF',
            details: `EN: ${enNums.join(', ')} | AR: ${arNums.join(', ')}`
          });
        }
      }

      // 7. Keys with "Label" suffix that have generic values
      if (key.endsWith('Label') || key.endsWith('label')) {
        const genericValues = ['Label', 'label', 'Text', 'text', 'Value', 'value', 'Item', 'item', 'التسمية', 'نص'];
        if (genericValues.includes(enStr.trim()) || genericValues.includes(arStr.trim())) {
          issues.push({
            file: relPath,
            key,
            enValue: enStr,
            arValue: arStr,
            issueType: 'GENERIC_LABEL_VALUE',
            details: 'Label key has generic placeholder value'
          });
        }
      }

      // 8. Truncated text
      if (looksTruncated(enStr) && enStr.length < 50) {
        issues.push({
          file: relPath,
          key,
          enValue: enStr,
          arValue: arStr,
          issueType: 'TRUNCATED_TEXT_EN',
          details: 'English text appears truncated (ends with ...)'
        });
      }
      if (looksTruncated(arStr) && arStr.length < 50) {
        issues.push({
          file: relPath,
          key,
          enValue: enStr,
          arValue: arStr,
          issueType: 'TRUNCATED_TEXT_AR',
          details: 'Arabic text appears truncated (ends with ...)'
        });
      }

      // 9. Developer comments left in
      if (hasDevComments(enStr)) {
        issues.push({
          file: relPath,
          key,
          enValue: enStr,
          arValue: arStr,
          issueType: 'DEV_COMMENT_EN',
          details: 'English value contains developer comment markers'
        });
      }
      if (hasDevComments(arStr)) {
        issues.push({
          file: relPath,
          key,
          enValue: enStr,
          arValue: arStr,
          issueType: 'DEV_COMMENT_AR',
          details: 'Arabic value contains developer comment markers'
        });
      }

      // 10. URLs that should be localized
      if (hasUrlsToLocalize(enStr)) {
        issues.push({
          file: relPath,
          key,
          enValue: enStr,
          arValue: arStr,
          issueType: 'URL_NEEDS_LOCALIZATION_EN',
          details: 'English contains URL that may need localization'
        });
      }
      if (hasUrlsToLocalize(arStr)) {
        issues.push({
          file: relPath,
          key,
          enValue: enStr,
          arValue: arStr,
          issueType: 'URL_NEEDS_LOCALIZATION_AR',
          details: 'Arabic contains URL that may need localization'
        });
      }

      // Check for untranslated text (English text in Arabic field)
      if (arStr && /^[a-zA-Z\s.,!?'"()\-:;]+$/.test(arStr) && arStr.length > 10) {
        issues.push({
          file: relPath,
          key,
          enValue: enStr,
          arValue: arStr,
          issueType: 'UNTRANSLATED_AR',
          details: 'Arabic value appears to be English text'
        });
      }

      // Check for identical values (might be untranslated)
      if (enStr && arStr && enStr === arStr && enStr.length > 5 && !/^[\d\s.,+\-*/%=<>()°²³]+$/.test(enStr)) {
        // Skip if it's a proper noun, technical term, URL, or has numbers/symbols
        if (!/^[A-Z][a-z]+$/.test(enStr) && !/^\d/.test(enStr) && !/^https?:/.test(enStr)) {
          issues.push({
            file: relPath,
            key,
            enValue: enStr,
            arValue: arStr,
            issueType: 'IDENTICAL_VALUES',
            details: 'English and Arabic values are identical (might be untranslated)'
          });
        }
      }

      // Check for empty translations
      if ((enStr && !arStr) || (!enStr && arStr)) {
        if (enStr || arStr) { // At least one has a value
          issues.push({
            file: relPath,
            key,
            enValue: enStr || '(empty)',
            arValue: arStr || '(empty)',
            issueType: 'MISSING_TRANSLATION',
            details: enStr ? 'Missing Arabic translation' : 'Missing English translation'
          });
        }
      }
    }
  }

  // 1. Find duplicate values
  console.log('Checking for duplicate values...\n');

  for (const [value, occurrences] of enValueMap) {
    if (occurrences.length > 1 && value.length > 15) {
      // Filter out intentional duplicates
      const commonWords = ['Calculate', 'Result', 'Submit', 'Cancel', 'Save', 'Delete', 'Edit', 'Add', 'Remove', 'Close', 'Open', 'Yes', 'No', 'OK', 'Error', 'Success', 'Warning', 'Info', 'Loading...', 'Enter a value', 'Please enter a valid value', 'Invalid input', 'Required field'];
      if (!commonWords.includes(value)) {
        issues.push({
          file: 'Multiple files',
          key: occurrences.map(o => `${o.file}:${o.key}`).join(' | '),
          enValue: value.substring(0, 100) + (value.length > 100 ? '...' : ''),
          arValue: 'N/A',
          issueType: 'DUPLICATE_VALUE_EN',
          details: `Same English text used ${occurrences.length} times`
        });
      }
    }
  }

  for (const [value, occurrences] of arValueMap) {
    if (occurrences.length > 1 && value.length > 15) {
      const commonArabic = ['احسب', 'النتيجة', 'إرسال', 'إلغاء', 'حفظ', 'حذف', 'تعديل', 'إضافة', 'إزالة', 'إغلاق', 'فتح', 'نعم', 'لا', 'موافق', 'خطأ', 'نجاح', 'تحذير', 'معلومات', 'جاري التحميل...', 'أدخل قيمة', 'الرجاء إدخال قيمة صالحة', 'إدخال غير صالح', 'حقل مطلوب'];
      if (!commonArabic.includes(value)) {
        issues.push({
          file: 'Multiple files',
          key: occurrences.map(o => `${o.file}:${o.key}`).join(' | '),
          enValue: 'N/A',
          arValue: value.substring(0, 100) + (value.length > 100 ? '...' : ''),
          issueType: 'DUPLICATE_VALUE_AR',
          details: `Same Arabic text used ${occurrences.length} times`
        });
      }
    }
  }

  return issues;
}

// Run and report
const allIssues = scanTranslations();

// Group by issue type
const grouped = {};
for (const issue of allIssues) {
  if (!grouped[issue.issueType]) {
    grouped[issue.issueType] = [];
  }
  grouped[issue.issueType].push(issue);
}

console.log('\n' + '='.repeat(100));
console.log('TRANSLATION SCAN RESULTS');
console.log('='.repeat(100) + '\n');

console.log(`Total issues found: ${allIssues.length}\n`);

// Summary
console.log('SUMMARY BY ISSUE TYPE:');
console.log('-'.repeat(50));
for (const [type, items] of Object.entries(grouped).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${type}: ${items.length} issues`);
}
console.log('\n');

// Detailed report
for (const [type, items] of Object.entries(grouped).sort((a, b) => b[1].length - a[1].length)) {
  console.log('='.repeat(100));
  console.log(`\n${type} (${items.length} issues)\n`);
  console.log('='.repeat(100));

  for (const issue of items.slice(0, 50)) {
    console.log(`\nFile: ${issue.file}`);
    console.log(`Key: ${issue.key}`);
    console.log(`EN: ${issue.enValue}`);
    console.log(`AR: ${issue.arValue}`);
    console.log(`Details: ${issue.details}`);
    console.log('-'.repeat(80));
  }

  if (items.length > 50) {
    console.log(`\n... and ${items.length - 50} more issues of this type\n`);
  }
}

// Save to file
const reportPath = path.join(__dirname, 'translation-scan-report.json');
fs.writeFileSync(reportPath, JSON.stringify({ summary: grouped, total: allIssues.length, issues: allIssues }, null, 2));
console.log(`\nFull report saved to: ${reportPath}`);
