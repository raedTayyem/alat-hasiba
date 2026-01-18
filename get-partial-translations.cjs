#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// Load all translation files
const loadTranslations = (locale) => {
  const basePath = path.join(__dirname, 'public', 'locales', locale);
  const translations = {};

  const loadDir = (dir, namespace = '') => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        loadDir(filePath, namespace ? `${namespace}/${file}` : file);
      } else if (file.endsWith('.json')) {
        const ns = namespace ? `${namespace}/${file.replace('.json', '')}` : file.replace('.json', '');
        try {
          translations[ns] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
          console.error(`Error loading ${filePath}:`, e.message);
        }
      }
    }
  };

  loadDir(basePath);
  return translations;
};

// Check if key exists in translations
const hasTranslation = (key, translations) => {
  // Handle namespace:key format
  if (key.includes(':')) {
    const [ns, ...keyParts] = key.split(':');
    const actualKey = keyParts.join(':');
    const nsData = translations[ns];
    if (!nsData) return false;

    const keyPath = actualKey.split('.');
    let current = nsData;
    for (const part of keyPath) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return false;
      }
    }
    return true;
  }

  // Check in all namespaces for plain keys
  for (const ns in translations) {
    const keyPath = key.split('.');
    let current = translations[ns];
    for (const part of keyPath) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        current = null;
        break;
      }
    }
    if (current !== null) return true;
  }

  return false;
};

// Extract translation keys from component
const extractKeys = (filePath) => {
  const source = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);
  const keys = new Set();

  const visit = (node) => {
    if (ts.isCallExpression(node)) {
      const expr = node.expression;
      if (ts.isIdentifier(expr) && expr.text === 't') {
        if (node.arguments.length > 0) {
          const arg = node.arguments[0];
          if (ts.isStringLiteral(arg)) {
            keys.add(arg.text);
          } else if (ts.isTemplateExpression(arg)) {
            // Handle template literals
            const parts = [arg.head.text];
            arg.templateSpans.forEach(span => {
              if (ts.isStringLiteral(span.literal)) {
                parts.push(span.literal.text);
              }
            });
            if (parts.every(p => typeof p === 'string')) {
              keys.add(parts.join(''));
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return Array.from(keys);
};

// Find all calculator components
const findCalculators = () => {
  const calculatorsPath = path.join(__dirname, 'src', 'components', 'calculators');
  const calculators = [];

  const scan = (dir) => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scan(filePath);
      } else if (file.endsWith('.tsx')) {
        calculators.push(filePath);
      }
    }
  };

  scan(calculatorsPath);
  return calculators;
};

// Main analysis
console.log('Analyzing translations...\n');

const enTranslations = loadTranslations('en');
const arTranslations = loadTranslations('ar');

console.log(`Loaded EN namespaces: ${Object.keys(enTranslations).length}`);
console.log(`Loaded AR namespaces: ${Object.keys(arTranslations).length}\n`);

const calculators = findCalculators();
const results = [];

for (const calcPath of calculators) {
  const name = path.basename(calcPath, '.tsx');
  const keys = extractKeys(calcPath);

  if (keys.length === 0) continue;

  const missingEN = keys.filter(k => !hasTranslation(k, enTranslations));
  const missingAR = keys.filter(k => !hasTranslation(k, arTranslations));

  const totalKeys = keys.length;
  const translatedEN = totalKeys - missingEN.length;
  const translatedAR = totalKeys - missingAR.length;
  const percentEN = Math.round((translatedEN / totalKeys) * 100);
  const percentAR = Math.round((translatedAR / totalKeys) * 100);

  results.push({
    name,
    path: calcPath,
    totalKeys,
    translatedEN,
    translatedAR,
    percentEN,
    percentAR,
    missingEN: missingEN.length,
    missingAR: missingAR.length,
    keys,
    missingENKeys: missingEN,
    missingARKeys: missingAR
  });
}

// Sort by percentage (partially translated first)
results.sort((a, b) => {
  // Prioritize partially translated (1-99%)
  const aPartial = a.percentEN > 0 && a.percentEN < 100;
  const bPartial = b.percentEN > 0 && b.percentEN < 100;

  if (aPartial && !bPartial) return -1;
  if (!aPartial && bPartial) return 1;

  // Then by percentage
  return b.percentEN - a.percentEN;
});

// Filter for partially translated (1-99%)
const partiallyTranslated = results.filter(r => r.percentEN > 0 && r.percentEN < 100);

console.log(`Total calculators: ${results.length}`);
console.log(`Partially translated (1-99%): ${partiallyTranslated.length}`);
console.log(`Fully translated (100%): ${results.filter(r => r.percentEN === 100).length}`);
console.log(`Not translated (0%): ${results.filter(r => r.percentEN === 0).length}\n`);

// Get calculators 61-120 from partially translated list
console.log('='.repeat(80));
console.log('PARTIALLY TRANSLATED CALCULATORS 61-120');
console.log('='.repeat(80));
console.log();

const batch = partiallyTranslated.slice(60, 120);

for (let i = 0; i < batch.length; i++) {
  const calc = batch[i];
  const index = i + 61;

  console.log(`${index}. ${calc.name}`);
  console.log(`   Path: ${calc.path}`);
  console.log(`   Total Keys: ${calc.totalKeys}`);
  console.log(`   EN: ${calc.translatedEN}/${calc.totalKeys} (${calc.percentEN}%)`);
  console.log(`   AR: ${calc.translatedAR}/${calc.totalKeys} (${calc.percentAR}%)`);
  console.log(`   Missing EN: ${calc.missingEN}`);
  console.log(`   Missing AR: ${calc.missingAR}`);
  console.log();
}

console.log(`\nTotal in this batch: ${batch.length} calculators`);

// Save detailed results to file
const output = {
  summary: {
    total: results.length,
    partiallyTranslated: partiallyTranslated.length,
    fullyTranslated: results.filter(r => r.percentEN === 100).length,
    notTranslated: results.filter(r => r.percentEN === 0).length
  },
  batch: batch
};

fs.writeFileSync(
  path.join(__dirname, 'partial-translations-61-120.json'),
  JSON.stringify(output, null, 2)
);

console.log('\nDetailed results saved to: partial-translations-61-120.json');
