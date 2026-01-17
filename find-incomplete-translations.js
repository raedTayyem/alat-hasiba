import fs from 'fs';
import path from 'path';

const LOCALES_PATH = '/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/';

// Patterns to detect
const PLACEHOLDER_PATTERNS = [
  /^title$/i,
  /^description$/i,
  /^label$/i,
  /^text$/i,
  /^value$/i,
  /^name$/i,
  /^message$/i,
  /^button$/i,
  /^placeholder$/i,
  /\bTODO\b/,
  /\bFIXME\b/,
  /\bTBD\b/,
  /\bXXX\b/,
  /\bHACK\b/,
  /lorem ipsum/i,
  /^sample$/i,
  /^example$/i,
  /^test$/i,
  /^demo$/i,
  /^untitled$/i,
  /^unnamed$/i,
  /^unknown$/i,
  /^n\/a$/i,
  /^na$/i,
  /^none$/i,
  /^null$/i,
  /^undefined$/i,
];

// Valid short values that are acceptable
const VALID_SHORT_VALUES = [
  'am', 'pm', 'kg', 'lb', 'km', 'mi', 'cm', 'mm', 'm', 'ft', 'in',
  'hr', 'min', 'sec', 's', 'ms', 'mb', 'gb', 'tb', 'kb',
  'ok', 'no', 'yes', 'id', 'or', 'an', 'at', 'by', 'to', 'of', 'on', 'in', 'is', 'it',
  'mr', 'ms', 'dr', 'vs', 'pm', 'am', 'us', 'uk', 'eu',
  '&', '+', '-', '/', '*', '%', '#', '@', '!', '?', '.', ',', ':', ';',
  // Arabic short words
  'أو', 'في', 'من', 'إلى', 'عن', 'مع', 'لا', 'نعم', 'ال', 'هو', 'هي', 'هم', 'أن', 'ما', 'كل',
];

// Code-like patterns
const CODE_PATTERNS = [
  /=>/,
  /\bfunction\b/,
  /\bconst\b/,
  /\blet\b/,
  /\bvar\b/,
  /\breturn\b/,
  /\bif\s*\(/,
  /\belse\b/,
  /\bfor\s*\(/,
  /\bwhile\s*\(/,
  /\bnew\s+\w+\(/,
  /\bconsole\./,
  /\bimport\b/,
  /\bexport\b/,
];

const issues = [];

function checkUnbalancedBrackets(value) {
  const brackets = { '{': '}', '[': ']', '(': ')' };
  const stack = [];
  let inString = false;
  let stringChar = null;

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    // Handle string detection (skip brackets inside strings)
    if ((char === '"' || char === "'") && (i === 0 || value[i-1] !== '\\')) {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
      continue;
    }

    if (inString) continue;

    if (brackets[char]) {
      stack.push(brackets[char]);
    } else if (Object.values(brackets).includes(char)) {
      if (stack.length === 0 || stack.pop() !== char) {
        return true; // Unbalanced
      }
    }
  }

  return stack.length > 0;
}

function checkUnbalancedQuotes(value) {
  // Count quotes that aren't escaped
  let singleQuotes = 0;
  let doubleQuotes = 0;

  for (let i = 0; i < value.length; i++) {
    if (value[i] === "'" && (i === 0 || value[i-1] !== '\\')) singleQuotes++;
    if (value[i] === '"' && (i === 0 || value[i-1] !== '\\')) doubleQuotes++;
  }

  return singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0;
}

function analyzeValue(value, keyPath, language, filePath) {
  const foundIssues = [];

  // 1. Empty strings
  if (value === '') {
    foundIssues.push({ type: 'Empty string', value: '""' });
    return foundIssues;
  }

  // 2. Whitespace only
  if (typeof value === 'string' && value.trim() === '' && value.length > 0) {
    foundIssues.push({ type: 'Whitespace only', value: `"${value}" (${value.length} chars)` });
    return foundIssues;
  }

  // 3. Placeholder text patterns
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(value)) {
      foundIssues.push({ type: 'Placeholder text', value: `"${value}"` });
      break;
    }
  }

  // 4. Key equals value
  const keyName = keyPath.split('.').pop();
  if (value.toLowerCase() === keyName.toLowerCase()) {
    foundIssues.push({ type: 'Key equals value', value: `"${value}"` });
  }

  // 5. Values that are just numbers (when they shouldn't be)
  if (/^\d+$/.test(value) && value.length < 5) {
    foundIssues.push({ type: 'Numeric value only', value: `"${value}"` });
  }

  // 6. Suspiciously short values
  if (typeof value === 'string' && value.length < 3 && value.length > 0) {
    const lowerValue = value.toLowerCase();
    if (!VALID_SHORT_VALUES.includes(lowerValue) && !VALID_SHORT_VALUES.includes(value)) {
      foundIssues.push({ type: 'Suspiciously short value', value: `"${value}"` });
    }
  }

  // 7. Values that look like code
  for (const pattern of CODE_PATTERNS) {
    if (pattern.test(value)) {
      foundIssues.push({ type: 'Code-like value', value: `"${value.substring(0, 50)}${value.length > 50 ? '...' : ''}"` });
      break;
    }
  }

  // 8. Unbalanced brackets or quotes
  if (checkUnbalancedBrackets(value)) {
    foundIssues.push({ type: 'Unbalanced brackets', value: `"${value.substring(0, 50)}${value.length > 50 ? '...' : ''}"` });
  }

  if (checkUnbalancedQuotes(value)) {
    foundIssues.push({ type: 'Unbalanced quotes', value: `"${value.substring(0, 50)}${value.length > 50 ? '...' : ''}"` });
  }

  return foundIssues;
}

function traverseObject(obj, keyPath, language, filePath) {
  for (const key of Object.keys(obj)) {
    const fullKeyPath = keyPath ? `${keyPath}.${key}` : key;
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      traverseObject(value, fullKeyPath, language, filePath);
    } else if (typeof value === 'string') {
      const foundIssues = analyzeValue(value, fullKeyPath, language, filePath);
      for (const issue of foundIssues) {
        issues.push({
          language,
          filePath,
          keyPath: fullKeyPath,
          currentValue: issue.value,
          issueType: issue.type,
        });
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'string') {
          const arrayKeyPath = `${fullKeyPath}[${index}]`;
          const foundIssues = analyzeValue(item, arrayKeyPath, language, filePath);
          for (const issue of foundIssues) {
            issues.push({
              language,
              filePath,
              keyPath: arrayKeyPath,
              currentValue: issue.value,
              issueType: issue.type,
            });
          }
        } else if (typeof item === 'object' && item !== null) {
          traverseObject(item, `${fullKeyPath}[${index}]`, language, filePath);
        }
      });
    }
  }
}

function processFile(filePath, language) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    const relativePath = filePath.replace(LOCALES_PATH, '');
    traverseObject(json, '', language, relativePath);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
}

function processDirectory(dirPath, language) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath, language);
    } else if (file.endsWith('.json')) {
      processFile(fullPath, language);
    }
  }
}

function main() {
  console.log('='.repeat(80));
  console.log('TRANSLATION ISSUES FINDER');
  console.log('='.repeat(80));
  console.log('');

  const languages = ['ar', 'en'];

  for (const lang of languages) {
    const langPath = path.join(LOCALES_PATH, lang);
    if (fs.existsSync(langPath)) {
      processDirectory(langPath, lang);
    } else {
      console.log(`Warning: Directory not found: ${langPath}`);
    }
  }

  // Group issues by type
  const issuesByType = {};
  for (const issue of issues) {
    if (!issuesByType[issue.issueType]) {
      issuesByType[issue.issueType] = [];
    }
    issuesByType[issue.issueType].push(issue);
  }

  // Print results
  console.log(`Total issues found: ${issues.length}`);
  console.log('');

  for (const [type, typeIssues] of Object.entries(issuesByType).sort((a, b) => b[1].length - a[1].length)) {
    console.log('-'.repeat(80));
    console.log(`${type.toUpperCase()} (${typeIssues.length} issues)`);
    console.log('-'.repeat(80));

    for (const issue of typeIssues) {
      console.log(`  Language: ${issue.language}`);
      console.log(`  File:     ${issue.filePath}`);
      console.log(`  Key:      ${issue.keyPath}`);
      console.log(`  Value:    ${issue.currentValue}`);
      console.log('');
    }
  }

  // Summary
  console.log('='.repeat(80));
  console.log('SUMMARY BY ISSUE TYPE');
  console.log('='.repeat(80));

  for (const [type, typeIssues] of Object.entries(issuesByType).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${type}: ${typeIssues.length}`);
  }

  console.log('');
  console.log('='.repeat(80));
  console.log('SUMMARY BY LANGUAGE');
  console.log('='.repeat(80));

  const byLanguage = { ar: 0, en: 0 };
  for (const issue of issues) {
    byLanguage[issue.language]++;
  }
  console.log(`  Arabic (ar): ${byLanguage.ar}`);
  console.log(`  English (en): ${byLanguage.en}`);

  console.log('');
  console.log('='.repeat(80));
  console.log(`TOTAL ISSUES: ${issues.length}`);
  console.log('='.repeat(80));
}

main();
