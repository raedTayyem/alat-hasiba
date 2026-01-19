#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

// Images to optimize
const imagesToOptimize = [
  {
    input: 'og-image.png',
    outputs: [
      { name: 'og-image.png', format: 'png', quality: 90 },
      { name: 'og-image.webp', format: 'webp', quality: 85 }
    ]
  },
  {
    input: 'android-chrome-192x192.png',
    outputs: [
      { name: 'android-chrome-192x192.png', format: 'png', quality: 90 },
      { name: 'android-chrome-192x192.webp', format: 'webp', quality: 85 }
    ]
  },
  {
    input: 'android-chrome-512x512.png',
    outputs: [
      { name: 'android-chrome-512x512.png', format: 'png', quality: 90 },
      { name: 'android-chrome-512x512.webp', format: 'webp', quality: 85 }
    ]
  },
  {
    input: 'apple-touch-icon.png',
    outputs: [
      { name: 'apple-touch-icon.png', format: 'png', quality: 90 }
    ]
  },
  {
    input: 'favicon-16x16.png',
    outputs: [
      { name: 'favicon-16x16.png', format: 'png', quality: 90 }
    ]
  },
  {
    input: 'favicon-32x32.png',
    outputs: [
      { name: 'favicon-32x32.png', format: 'png', quality: 90 }
    ]
  },
  {
    input: 'الات حاسبه.png',
    outputs: [
      { name: 'الات حاسبه.png', format: 'png', quality: 90 },
      { name: 'الات حاسبه.webp', format: 'webp', quality: 85 }
    ]
  }
];

async function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

async function optimizeImages() {
  console.log('Starting image optimization...\n');

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  const results = [];

  for (const imageConfig of imagesToOptimize) {
    const inputPath = path.join(publicDir, imageConfig.input);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${imageConfig.input} - file not found`);
      continue;
    }

    const originalSize = await getFileSize(inputPath);
    totalOriginalSize += originalSize;

    console.log(`Processing ${imageConfig.input}...`);

    for (const output of imageConfig.outputs) {
      const outputPath = path.join(publicDir, output.name);

      try {
        let processor = sharp(inputPath);

        if (output.format === 'png') {
          processor = processor.png({
            compressionLevel: 9,
            quality: output.quality
          });
        } else if (output.format === 'webp') {
          processor = processor.webp({
            quality: output.quality,
            effort: 6
          });
        }

        await processor.toFile(outputPath + '.temp');

        const newSize = await getFileSize(outputPath + '.temp');
        const existingSize = await getFileSize(outputPath);

        // Only replace if the new file is smaller or doesn't exist
        if (!fs.existsSync(outputPath) || newSize < existingSize) {
          fs.renameSync(outputPath + '.temp', outputPath);
          totalOptimizedSize += newSize;

          const savings = existingSize > 0 ? existingSize - newSize : originalSize - newSize;
          const savingsPercent = existingSize > 0
            ? ((savings / existingSize) * 100).toFixed(1)
            : ((savings / originalSize) * 100).toFixed(1);

          results.push({
            file: output.name,
            original: formatBytes(existingSize > 0 ? existingSize : originalSize),
            optimized: formatBytes(newSize),
            saved: formatBytes(savings),
            percent: savingsPercent
          });

          console.log(`  ✅ ${output.name}: ${formatBytes(newSize)} (saved ${formatBytes(savings)} / ${savingsPercent}%)`);
        } else {
          fs.unlinkSync(outputPath + '.temp');
          totalOptimizedSize += existingSize;
          console.log(`  ℹ️  ${output.name}: Already optimized`);
        }
      } catch (error) {
        console.error(`  ❌ Error processing ${output.name}:`, error.message);
        if (fs.existsSync(outputPath + '.temp')) {
          fs.unlinkSync(outputPath + '.temp');
        }
      }
    }
    console.log('');
  }

  // Generate report
  console.log('\n' + '='.repeat(80));
  console.log('OPTIMIZATION SUMMARY');
  console.log('='.repeat(80));
  console.log('\nOptimized Images:');
  console.log('-'.repeat(80));
  console.log(
    'File'.padEnd(35) +
    'Original'.padEnd(15) +
    'Optimized'.padEnd(15) +
    'Saved'.padEnd(15)
  );
  console.log('-'.repeat(80));

  results.forEach(result => {
    console.log(
      result.file.padEnd(35) +
      result.original.padEnd(15) +
      result.optimized.padEnd(15) +
      `${result.saved} (${result.percent}%)`.padEnd(15)
    );
  });

  const totalSavings = totalOriginalSize - totalOptimizedSize;
  const totalPercent = totalOriginalSize > 0
    ? ((totalSavings / totalOriginalSize) * 100).toFixed(1)
    : 0;

  console.log('-'.repeat(80));
  console.log(`Total Savings: ${formatBytes(totalSavings)} (${totalPercent}%)`);
  console.log('='.repeat(80));
}

optimizeImages().catch(console.error);
