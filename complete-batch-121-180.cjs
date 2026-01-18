const fs = require('fs');
const path = require('path');

// List of calculators 121-180
const calculators = [
  'ph-calculator',
  'pipe-calculator',
  'pizza-dough-calculator',
  'power-electricity-calculator',
  'pregnancy-calculator',
  'pressure-converter',
  'price-comparison-calculator',
  'price-elasticity-calculator',
  'productivity-calculator',
  'project-budget-calculator',
  'property-tax-calculator',
  'protein-calculator',
  'race-time-predictor',
  'rainwater-harvesting-calculator',
  'reactance-calculator',
  'recovery-time-calculator',
  'recycling-impact-calculator',
  'refinance-calculator',
  'registration-fee-calculator',
  'rent-vs-buy-calculator',
  'rental-yield-calculator',
  'rep-range-calculator',
  'resistors-series-parallel-calculator',
  'retirement-savings-calculator',
  'rice-cooking-calculator',
  'rice-water-ratio-calculator',
  'roas-calculator',
  'roi-calculator',
  'roofing-calculator',
  'salary-calculator',
  'sales-tax-calculator',
  'sample-size-calculator',
  'sand-calculator',
  'scientific-calculator',
  'shingle-calculator',
  'shipping-cost-calculator',
  'shopify-profit-calculator',
  'siding-calculator',
  'social-media-engagement-calculator',
  'solar-panel-roi-calculator',
  'speed-converter',
  'star-distance-calculator',
  'startup-cost-calculator',
  'stress-strain-calculator',
  'swimming-pace-calculator',
  'tdee-calculator',
  'telescope-magnification-calculator',
  'temperature-converter',
  'three-phase-calculator',
  'tile-calculator',
  'time-tracking-calculator',
  'tire-pressure-calculator',
  'tire-size-calculator',
  'top-speed-calculator',
  'tractor-fuel-calculator',
  'transformer-calculator',
  'travel-cost-calculator',
  'trip-cost-calculator',
  'turkey-cooking-calculator',
  'unit-cost-calculator'
];

// Find component file for a calculator
function findComponentFile(slug) {
  const componentsDir = '/Users/raedtayyem/Desktop/work/alathasiba-claudecode/src/components/calculators';

  function searchDir(dir) {
    if (!fs.existsSync(dir)) return null;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const result = searchDir(fullPath);
        if (result) return result;
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        const basename = entry.name.replace(/\.(tsx|ts)$/, '');
        if (basename.toLowerCase() === slug.toLowerCase().replace(/-/g, '') ||
            basename.toLowerCase().replace(/calculator$/, '') === slug.toLowerCase().replace(/-calculator$/, '').replace(/-/g, '')) {
          return fullPath;
        }
      }
    }
    return null;
  }

  return searchDir(componentsDir);
}

// Extract translation keys from a component file
function extractTranslationKeys(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return new Set();

  const content = fs.readFileSync(filePath, 'utf8');
  const keys = new Set();

  const regex = /\bt\s*\(\s*['"]((?:[^'"\\]|\\.)+)['"]\s*\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }

  return keys;
}

console.log('Extracting translation keys for calculators 121-180...\n');

const results = [];

for (const slug of calculators) {
  const componentPath = findComponentFile(slug);

  if (!componentPath) {
    console.log(`⚠️  ${slug}: Component not found`);
    results.push({ slug, found: false, keys: [] });
    continue;
  }

  const keys = Array.from(extractTranslationKeys(componentPath));
  console.log(`✓ ${slug}: ${keys.length} keys found`);
  results.push({ slug, found: true, keys, componentPath });
}

// Write results to JSON file for processing
const outputPath = '/Users/raedtayyem/Desktop/work/alathasiba-claudecode/batch-121-180-keys.json';
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

console.log(`\nExtracted keys written to: batch-121-180-keys.json`);
console.log(`Total calculators processed: ${results.length}`);
console.log(`Components found: ${results.filter(r => r.found).length}`);
console.log(`Total unique keys: ${results.reduce((sum, r) => sum + r.keys.length, 0)}`);
