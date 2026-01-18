const fs = require('fs');
const path = require('path');

// List of calculators that need translations
const missingCalculators = [
  'AmazonFBACalculator',
  'EbayFeesCalculator',
  'IncomeTaxCalculator',
  'ProjectBudgetCalculator',
  'ShopifyProfitCalculator',
  'TimeTrackingCalculator',
  'UnitCostCalculator'
];

const calcDir = './src/components/calculators/business';

missingCalculators.forEach(calc => {
  const filePath = path.join(calcDir, `${calc}.tsx`);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Extract translation key pattern
  const baseKey = calc
    .replace('Calculator', '')
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');

  console.log(`\n=== ${calc} (${baseKey}) ===`);

  // Find all translation keys
  const regex = /t\(["']([^"']+)["']\)/g;
  const keys = new Set();
  let match;

  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    if (key.startsWith(baseKey + '.') || key.includes(baseKey)) {
      keys.add(key);
    }
  }

  console.log('Keys found:', keys.size);
  Array.from(keys).sort().forEach(k => console.log('  -', k));
});
