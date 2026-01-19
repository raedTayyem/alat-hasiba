const fs = require('fs');
const glob = require('glob');

const translations = { en: {} };

function loadTranslationFile(filePath, lang) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const relativePath = filePath.replace(/.*\/public\/locales\/[^\/]+\//, '').replace('.json', '');

    console.log('Loading file:', filePath.split('/').pop());
    console.log('  Relative path:', relativePath);

    if (relativePath.startsWith('calc/')) {
      const namespace = relativePath;
      console.log('  Namespace:', namespace);
      if (!translations[lang][namespace]) {
        translations[lang][namespace] = {};
      }
      console.log('  Content keys:', Object.keys(content).slice(0, 5).join(', '));
      Object.assign(translations[lang][namespace], content);
      console.log('  After assign, namespace has:', Object.keys(translations[lang][namespace]).length, 'keys');
    }
    console.log('');
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
  }
}

const files = glob.sync('/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/en/**/*.json');
const businessFiles = files.filter(f => f.includes('/calc/business'));

console.log('=== Loading business-related files ===\n');
businessFiles.forEach(file => loadTranslationFile(file, 'en'));

console.log('=== Final state ===');
Object.keys(translations.en).filter(k => k.includes('business')).forEach(ns => {
  console.log(ns, '-> keys:', Object.keys(translations.en[ns]).length);
  console.log('  Sample keys:', Object.keys(translations.en[ns]).slice(0, 5).join(', '));
});
