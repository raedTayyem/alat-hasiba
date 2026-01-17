const fs = require('fs');
const path = require('path');

const AR_DIR = '/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/ar/';
const EN_DIR = '/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/en/';

// Flatten nested object to dot-notation keys
function flattenObject(obj, prefix = '', result = {}) {
  if (obj === null || obj === undefined) {
    result[prefix] = obj;
    return result;
  }

  if (Array.isArray(obj)) {
    result[prefix] = `[Array:${obj.length}]`;
    obj.forEach((item, index) => {
      if (typeof item === 'object' && item !== null) {
        flattenObject(item, prefix ? `${prefix}[${index}]` : `[${index}]`, result);
      } else {
        result[prefix ? `${prefix}[${index}]` : `[${index}]`] = item;
      }
    });
    return result;
  }

  if (typeof obj === 'object') {
    if (prefix) {
      result[prefix] = '[Object]';
    }
    for (const key of Object.keys(obj)) {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      flattenObject(obj[key], newPrefix, result);
    }
    return result;
  }

  result[prefix] = obj;
  return result;
}

// Get all JSON files recursively
function getJsonFiles(dir, baseDir = dir) {
  let files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(getJsonFiles(fullPath, baseDir));
    } else if (item.endsWith('.json')) {
      const relativePath = path.relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }

  return files;
}

// Read and parse JSON file
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

// Compare two objects and find structural differences
function findStructuralDifferences(arObj, enObj, prefix = '') {
  const differences = [];

  const arFlat = flattenObject(arObj);
  const enFlat = flattenObject(enObj);

  // Check for type mismatches
  for (const key of Object.keys(arFlat)) {
    if (enFlat.hasOwnProperty(key)) {
      const arVal = arFlat[key];
      const enVal = enFlat[key];

      // Check array length differences
      if (typeof arVal === 'string' && arVal.startsWith('[Array:') &&
          typeof enVal === 'string' && enVal.startsWith('[Array:')) {
        const arLen = parseInt(arVal.match(/\d+/)[0]);
        const enLen = parseInt(enVal.match(/\d+/)[0]);
        if (arLen !== enLen) {
          differences.push(`Array length mismatch at "${key}": AR=${arLen}, EN=${enLen}`);
        }
      }

      // Check object vs string
      if (arVal === '[Object]' && enVal !== '[Object]') {
        differences.push(`Type mismatch at "${key}": AR=Object, EN=${typeof enVal}`);
      } else if (enVal === '[Object]' && arVal !== '[Object]') {
        differences.push(`Type mismatch at "${key}": AR=${typeof arVal}, EN=Object`);
      }
    }
  }

  return differences;
}

// Get leaf keys only (not intermediate object markers)
function getLeafKeys(flatObj) {
  const keys = new Set();
  for (const key of Object.keys(flatObj)) {
    const val = flatObj[key];
    if (val !== '[Object]' && !(typeof val === 'string' && val.startsWith('[Array:'))) {
      keys.add(key);
    }
  }
  return keys;
}

// Main comparison
function compareTranslations() {
  console.log('=== TRANSLATION KEYS COMPARISON REPORT ===\n');
  console.log(`AR Directory: ${AR_DIR}`);
  console.log(`EN Directory: ${EN_DIR}\n`);

  const arFiles = getJsonFiles(AR_DIR);
  const enFiles = getJsonFiles(EN_DIR);

  const allFiles = new Set([...arFiles, ...enFiles]);

  console.log(`Found ${arFiles.length} AR files, ${enFiles.length} EN files`);
  console.log(`Total unique files: ${allFiles.size}\n`);

  let totalMissingInEN = 0;
  let totalMissingInAR = 0;
  let filesWithIssues = 0;

  const sortedFiles = Array.from(allFiles).sort();

  for (const file of sortedFiles) {
    const arPath = path.join(AR_DIR, file);
    const enPath = path.join(EN_DIR, file);

    const arExists = fs.existsSync(arPath);
    const enExists = fs.existsSync(enPath);

    if (!arExists && !enExists) continue;

    console.log('═'.repeat(60));
    console.log(`FILE: ${file}`);
    console.log('═'.repeat(60));

    if (!arExists) {
      console.log(`  ⚠️  FILE MISSING IN AR`);
      const enObj = readJsonFile(enPath);
      if (enObj) {
        const enKeys = getLeafKeys(flattenObject(enObj));
        console.log(`  EN has ${enKeys.size} keys that need AR translation`);
        totalMissingInAR += enKeys.size;
        filesWithIssues++;
      }
      console.log('');
      continue;
    }

    if (!enExists) {
      console.log(`  ⚠️  FILE MISSING IN EN`);
      const arObj = readJsonFile(arPath);
      if (arObj) {
        const arKeys = getLeafKeys(flattenObject(arObj));
        console.log(`  AR has ${arKeys.size} keys that need EN translation`);
        totalMissingInEN += arKeys.size;
        filesWithIssues++;
      }
      console.log('');
      continue;
    }

    const arObj = readJsonFile(arPath);
    const enObj = readJsonFile(enPath);

    if (!arObj || !enObj) {
      console.log(`  ❌ Error reading file(s)`);
      console.log('');
      continue;
    }

    const arFlat = flattenObject(arObj);
    const enFlat = flattenObject(enObj);

    const arKeys = getLeafKeys(arFlat);
    const enKeys = getLeafKeys(enFlat);

    const missingInEN = [];
    const missingInAR = [];

    for (const key of arKeys) {
      if (!enKeys.has(key)) {
        missingInEN.push(key);
      }
    }

    for (const key of enKeys) {
      if (!arKeys.has(key)) {
        missingInAR.push(key);
      }
    }

    const structuralDiffs = findStructuralDifferences(arObj, enObj);

    if (missingInEN.length === 0 && missingInAR.length === 0 && structuralDiffs.length === 0) {
      console.log(`  ✓ PERFECT MATCH (${arKeys.size} keys)`);
    } else {
      filesWithIssues++;

      if (missingInEN.length > 0) {
        console.log(`\n  MISSING IN EN (${missingInEN.length} keys):`);
        missingInEN.sort().forEach(key => {
          console.log(`    - ${key}`);
        });
        totalMissingInEN += missingInEN.length;
      }

      if (missingInAR.length > 0) {
        console.log(`\n  MISSING IN AR (${missingInAR.length} keys):`);
        missingInAR.sort().forEach(key => {
          console.log(`    - ${key}`);
        });
        totalMissingInAR += missingInAR.length;
      }

      if (structuralDiffs.length > 0) {
        console.log(`\n  STRUCTURAL DIFFERENCES:`);
        structuralDiffs.forEach(diff => {
          console.log(`    - ${diff}`);
        });
      }
    }

    console.log('');
  }

  console.log('═'.repeat(60));
  console.log('SUMMARY');
  console.log('═'.repeat(60));
  console.log(`Total files analyzed: ${allFiles.size}`);
  console.log(`Files with issues: ${filesWithIssues}`);
  console.log(`Total keys missing in EN: ${totalMissingInEN}`);
  console.log(`Total keys missing in AR: ${totalMissingInAR}`);
  console.log(`Total missing keys: ${totalMissingInEN + totalMissingInAR}`);
}

compareTranslations();
