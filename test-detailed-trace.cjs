const fs = require('fs');
const glob = require('glob');

const translations = { en: {} };

function loadTranslationFile(filePath, lang) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const relativePath = filePath.replace(/.*\/public\/locales\/[^\/]+\//, '').replace('.json', '');

    if (relativePath.startsWith('calc/')) {
      const namespace = relativePath;

      // Detailed logging
      const isExisting = !!translations[lang][namespace];

      if (!translations[lang][namespace]) {
        translations[lang][namespace] = {};
      }

      const before = Object.keys(translations[lang][namespace]).length;
      Object.assign(translations[lang][namespace], content);
      const after = Object.keys(translations[lang][namespace]).length;

      if (namespace === 'calc/business' || namespace.startsWith('calc/business')) {
        console.log('File:', filePath.split('/').slice(-2).join('/'));
        console.log('  Namespace:', namespace);
        console.log('  Was existing:', isExisting);
        console.log('  Keys before assign:', before);
        console.log('  Keys in content:', Object.keys(content).length);
        console.log('  Keys after assign:', after);
        console.log('  First 3 content keys:', Object.keys(content).slice(0, 3));
        console.log('');
      }
    } else {
      Object.assign(translations[lang], content);
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
  }
}

glob.sync('/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/en/**/*.json').forEach(file => loadTranslationFile(file, 'en'));

console.log('=== FINAL STATE ===');
console.log('calc/business:', Object.keys(translations.en['calc/business'] || {}).length, 'keys');
console.log('  Keys:', Object.keys(translations.en['calc/business'] || {}).slice(0, 5));
console.log('calc/business/general:', Object.keys(translations.en['calc/business/general'] || {}).length, 'keys');
console.log('  Keys:', Object.keys(translations.en['calc/business/general'] || {}).slice(0, 5));
