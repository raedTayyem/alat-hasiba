const fs = require('fs');
const glob = require('glob');

const translations = { en: {} };

function loadTranslationFile(filePath, lang, verbose = false) {
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
      // This is the problematic line
      const before = Object.keys(translations[lang]);
      Object.assign(translations[lang], content);
      const after = Object.keys(translations[lang]);

      if (verbose) {
        console.log('Loading non-calc file:', relativePath);
        console.log('  Keys before:', before.length);
        console.log('  Content keys:', Object.keys(content).slice(0, 10));
        console.log('  Keys after:', after.length);

        // Check if any calc/* keys were overwritten
        const calcKeys = before.filter(k => k.startsWith('calc/'));
        const calcKeysAfter = after.filter(k => k.startsWith('calc/'));
        if (calcKeys.length !== calcKeysAfter.length) {
          console.log('  WARNING: calc/* keys changed!', calcKeys.length, '->', calcKeysAfter.length);
        }

        // Check if content has keys that match namespace names
        const contentKeys = Object.keys(content);
        const conflicts = contentKeys.filter(k => before.includes(k) && k.startsWith('calc/'));
        if (conflicts.length > 0) {
          console.log('  CONFLICT: These keys will overwrite namespaces:', conflicts);
        }
        console.log('');
      }
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
  }
}

// Load ALL files
const allFiles = glob.sync('/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/en/**/*.json');

// Load calc files first (silently)
allFiles.filter(f => f.includes('/calc/')).forEach(file => loadTranslationFile(file, 'en', false));

console.log('After loading calc files:');
console.log('  Total keys:', Object.keys(translations.en).length);
console.log('  calc/business keys:', Object.keys(translations.en['calc/business'] || {}).length);
console.log('');

// Now load non-calc files (verbosely)
console.log('Loading non-calc files:');
console.log('='.repeat(60));
allFiles.filter(f => !f.includes('/calc/')).forEach(file => loadTranslationFile(file, 'en', true));

console.log('='.repeat(60));
console.log('FINAL STATE:');
console.log('  Total keys:', Object.keys(translations.en).length);
console.log('  calc/business keys:', Object.keys(translations.en['calc/business'] || {}).length);
if (translations.en['calc/business']) {
  console.log('  calc/business type:', typeof translations.en['calc/business']);
  console.log('  calc/business sample:', Object.keys(translations.en['calc/business']).slice(0, 5));
}
