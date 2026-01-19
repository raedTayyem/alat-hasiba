#!/usr/bin/env node

const { optimize } = require('svgo');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const logoPath = path.join(publicDir, 'logo.svg');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

async function optimizeSvg() {
  console.log('Starting SVG optimization...\n');

  const svgContent = fs.readFileSync(logoPath, 'utf8');
  const originalSize = Buffer.byteLength(svgContent, 'utf8');

  const result = optimize(svgContent, {
    path: logoPath,
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // Preserve viewBox for responsive scaling
            removeViewBox: false,
          },
        },
      },
      // Remove metadata
      'removeMetadata',
      // Remove unnecessary descriptive elements
      'removeDesc',
      // Remove comments
      'removeComments',
      // Minify styles
      'minifyStyles',
      // Remove empty attributes
      'removeEmptyAttrs',
      // Remove empty containers
      'removeEmptyContainers',
      // Clean up IDs
      'cleanupIds',
    ],
  });

  const optimizedSize = Buffer.byteLength(result.data, 'utf8');
  const savings = originalSize - optimizedSize;
  const savingsPercent = ((savings / originalSize) * 100).toFixed(1);

  // Write optimized SVG
  fs.writeFileSync(logoPath, result.data);

  console.log('='.repeat(80));
  console.log('SVG OPTIMIZATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`File: logo.svg`);
  console.log(`Original Size: ${formatBytes(originalSize)}`);
  console.log(`Optimized Size: ${formatBytes(optimizedSize)}`);
  console.log(`Savings: ${formatBytes(savings)} (${savingsPercent}%)`);
  console.log('='.repeat(80));
}

optimizeSvg().catch(console.error);
