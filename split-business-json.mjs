import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Define the split structure
const splitConfig = {
  'vat.json': ['vat', 'sales_tax', 'vat-calculator', 'sales-tax-calculator'],
  'profit-margin.json': [
    'profit_margin', 'markup', 'discount', 'price_comparison', 'price_elasticity', 'bulk_pricing',
    'profit-margin-calculator', 'markup-calculator', 'discount-calculator',
    'price-comparison-calculator', 'price-elasticity-calculator', 'bulk-pricing-calculator'
  ],
  'investment.json': [
    'roi', 'npv', 'irr', 'cash_flow', 'inflation', 'business_valuation',
    'retirement_savings', 'four_oh_one_k', 'ltv', 'payback_period',
    'roi-calculator', 'net-present-value-calculator', 'internal-rate-of-return-calculator',
    'cash-flow-calculator', 'inflation-calculator', 'business-valuation-calculator',
    'retirement-savings-calculator', '401k-calculator', 'ltv-calculator', 'payback-period-calculator'
  ],
  'inventory.json': [
    'eoq', 'inventory_turnover',
    'economic-order-quantity-calculator', 'inventory-turnover-calculator'
  ],
  'depreciation.json': ['depreciation', 'depreciation-calculator'],
  'payroll.json': [
    'bonus', 'salary', 'hourly_wage', 'overtime', 'commission', 'labor_cost',
    'bonus-calculator', 'salary-calculator', 'hourly-wage-calculator',
    'overtime-calculator', 'commission-calculator', 'labor-cost-calculator'
  ],
  'general.json': [
    'errors', 'calculators', 'break_even', 'franchise', 'startup_cost',
    'shipping_cost', 'fuel_cost', 'travel_cost', 'productivity', 'quick_ratio',
    'working_capital', 'current_ratio', 'debt_to_equity', 'loan_amortization',
    'lease', 'lease_vs_buy', 'cpm', 'cpc', 'cpa', 'roas', 'conversion_rate',
    'social_media_engagement', 'inheritance-results',
    'break-even-calculator', 'franchise-calculator', 'startup-cost-calculator',
    'shipping-cost-calculator', 'productivity-calculator', 'quick-ratio-calculator',
    'working-capital-calculator', 'current-ratio-calculator', 'debt-to-equity-calculator',
    'cpm-calculator', 'cpc-calculator', 'cpa-calculator', 'roas-calculator',
    'conversion-rate-calculator', 'social-media-engagement-calculator',
    'amazon-fba-calculator', 'ebay-fees-calculator', 'shopify-profit-calculator',
    'unit-cost-calculator', 'time-tracking-calculator', 'project-budget-calculator',
    'income-tax-calculator', 'labor-cost-calculator'
  ]
};

const locales = ['en', 'ar'];
const basePath = '/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales';

for (const locale of locales) {
  const inputPath = join(basePath, locale, 'calc', 'business.json');
  const outputDir = join(basePath, locale, 'calc', 'business');

  console.log(`Processing ${locale}...`);

  // Read the source file
  const sourceData = JSON.parse(readFileSync(inputPath, 'utf8'));

  // Create output directory if not exists
  try {
    mkdirSync(outputDir, { recursive: true });
  } catch (e) {}

  // Track which keys have been used
  const usedKeys = new Set();

  // Split into separate files
  for (const [filename, keys] of Object.entries(splitConfig)) {
    const splitData = {};

    for (const key of keys) {
      if (sourceData[key] !== undefined) {
        splitData[key] = sourceData[key];
        usedKeys.add(key);
      }
    }

    if (Object.keys(splitData).length > 0) {
      const outputPath = join(outputDir, filename);
      writeFileSync(outputPath, JSON.stringify(splitData, null, 2), 'utf8');
      console.log(`  Created ${filename} with ${Object.keys(splitData).length} keys`);
    }
  }

  // Check for any keys that weren't assigned
  const remainingKeys = Object.keys(sourceData).filter(k => !usedKeys.has(k));
  if (remainingKeys.length > 0) {
    console.log(`  Warning: ${remainingKeys.length} unassigned keys in ${locale}:`, remainingKeys);

    // Add remaining keys to general.json
    const generalPath = join(outputDir, 'general.json');
    const generalData = JSON.parse(readFileSync(generalPath, 'utf8'));

    for (const key of remainingKeys) {
      generalData[key] = sourceData[key];
    }

    writeFileSync(generalPath, JSON.stringify(generalData, null, 2), 'utf8');
    console.log(`  Added remaining keys to general.json`);
  }

  // Create index.ts file
  const indexContent = `// Auto-generated index file for business calculators
import vat from './vat.json';
import profitMargin from './profit-margin.json';
import investment from './investment.json';
import inventory from './inventory.json';
import depreciation from './depreciation.json';
import payroll from './payroll.json';
import general from './general.json';

export default {
  ...vat,
  ...profitMargin,
  ...investment,
  ...inventory,
  ...depreciation,
  ...payroll,
  ...general,
};
`;

  writeFileSync(join(outputDir, 'index.ts'), indexContent, 'utf8');
  console.log(`  Created index.ts`);
}

console.log('Done!');
