#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the calculators list
const calculators = JSON.parse(fs.readFileSync('/tmp/calculators_71_140.json', 'utf8'));

// Translation mappings for common missing keys
const commonTranslations = {
  en: {
    // Numeric placeholders
    "0": "0",
    "1": "1",
    "6": "6",
    "10": "10",
    "20": "20",
    "50": "50",
    "1.0": "1.0",
    // Mixed/other
    "mixed": "mixed",
    "metric": "metric",
    "fahrenheit": "Fahrenheit",
    "oz": "oz",
    "meters": "meters",
    "mm": "mm",
    "T": "T"
  },
  ar: {
    "0": "0",
    "1": "1",
    "6": "6",
    "10": "10",
    "20": "20",
    "50": "50",
    "1.0": "1.0",
    "mixed": "مختلط",
    "metric": "متري",
    "fahrenheit": "فهرنهايت",
    "oz": "أونصة",
    "meters": "متر",
    "mm": "مم",
    "T": "ت"
  }
};

// Map of calculator-specific translations
const calculatorTranslations = {};

// Process each calculator
let totalAdded = 0;

calculators.forEach((calc, index) => {
  console.log(`\n${index + 71}. Processing: ${calc.fileName}`);
  console.log(`   Missing EN: ${calc.missingEN.length}, Missing AR: ${calc.missingAR.length}`);

  // Determine which file to update based on namespace
  const namespace = calc.namespace || 'translation';

  // Group missing keys by file
  const fileUpdates = {};

  calc.missingEN.forEach(key => {
    // Skip keys that are just numbers or already in common
    if (/^\d+$/.test(key) || /^common[:\.]/.test(key)) {
      return;
    }

    // Determine target file
    let targetFile = 'translation.json';
    if (namespace.startsWith('calc/')) {
      const category = namespace.replace('calc/', '');
      targetFile = `calc/${category}.json`;
    }

    if (!fileUpdates[targetFile]) {
      fileUpdates[targetFile] = [];
    }
    fileUpdates[targetFile].push(key);
  });

  Object.keys(fileUpdates).forEach(file => {
    console.log(`   - ${file}: ${fileUpdates[file].length} keys`);
  });

  totalAdded += calc.missingEN.length;
});

console.log(`\n\nTotal translations to add: ${totalAdded}`);
console.log(`\nNote: Many missing keys are numeric placeholders or common:units references that are already covered.`);
