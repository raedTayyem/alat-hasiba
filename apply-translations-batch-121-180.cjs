const fs = require('fs');
const path = require('path');

// Load mapping data
const keysData = JSON.parse(fs.readFileSync('batch-121-180-keys.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('calculator-categories-121-180.json', 'utf8'));

// Manual professional translations for better quality
const translations = {
  'ph_calculator': {
    title: {
      en: 'pH Calculator',
      ar: 'حاسبة الأس الهيدروجيني'
    },
    description: {
      en: 'Calculate pH, pOH, and ion concentrations for solutions',
      ar: 'احسب الأس الهيدروجيني والأس الهيدروكسيلي وتركيز الأيونات للمحاليل'
    },
    errors: {
      enter_value: {
        en: 'Please enter a value',
        ar: 'الرجاء إدخال قيمة'
      },
      concentration_positive: {
        en: 'Concentration must be positive',
        ar: 'يجب أن يكون التركيز موجباً'
      },
      ph_range: {
        en: 'pH must be between 0 and 14',
        ar: 'يجب أن يكون الأس الهيدروجيني بين 0 و 14'
      },
      poh_range: {
        en: 'pOH must be between 0 and 14',
        ar: 'يجب أن يكون الأس الهيدروكسيلي بين 0 و 14'
      },
      calculation_error: {
        en: 'Error in calculation',
        ar: 'خطأ في الحساب'
      }
    },
    modes: {
      pH_from_H: {
        en: 'Calculate pH from H⁺',
        ar: 'احسب pH من H⁺'
      },
      H_from_pH: {
        en: 'Calculate H⁺ from pH',
        ar: 'احسب H⁺ من pH'
      },
      pOH_from_OH: {
        en: 'Calculate pOH from OH⁻',
        ar: 'احسب pOH من OH⁻'
      },
      OH_from_pOH: {
        en: 'Calculate OH⁻ from pOH',
        ar: 'احسب OH⁻ من pOH'
      }
    },
    inputs: {
      h_concentration: {
        en: 'H⁺ Concentration (M)',
        ar: 'تركيز H⁺ (مول/لتر)'
      },
      pH: {
        en: 'pH Value',
        ar: 'قيمة pH'
      },
      oh_concentration: {
        en: 'OH⁻ Concentration (M)',
        ar: 'تركيز OH⁻ (مول/لتر)'
      },
      pOH: {
        en: 'pOH Value',
        ar: 'قيمة pOH'
      }
    },
    tooltips: {
      h_concentration: {
        en: 'Enter hydrogen ion concentration in molarity',
        ar: 'أدخل تركيز أيون الهيدروجين بالمولارية'
      },
      pH: {
        en: 'Enter pH value (0-14 scale)',
        ar: 'أدخل قيمة pH (مقياس 0-14)'
      },
      oh_concentration: {
        en: 'Enter hydroxide ion concentration in molarity',
        ar: 'أدخل تركيز أيون الهيدروكسيد بالمولارية'
      },
      pOH: {
        en: 'Enter pOH value (0-14 scale)',
        ar: 'أدخل قيمة pOH (مقياس 0-14)'
      }
    },
    formulas: {
      ph: {
        en: 'pH = -log[H⁺]',
        ar: 'pH = -log[H⁺]'
      },
      ph_desc: {
        en: 'pH is the negative logarithm of hydrogen ion concentration',
        ar: 'الأس الهيدروجيني هو اللوغاريتم السالب لتركيز أيون الهيدروجين'
      }
    },
    results: {
      solution_type: {
        en: 'Solution Type',
        ar: 'نوع المحلول'
      },
      pH: {
        en: 'pH',
        ar: 'الأس الهيدروجيني'
      },
      pOH: {
        en: 'pOH',
        ar: 'الأس الهيدروكسيلي'
      },
      h_concentration: {
        en: 'H⁺ Concentration',
        ar: 'تركيز H⁺'
      },
      oh_concentration: {
        en: 'OH⁻ Concentration',
        ar: 'تركيز OH⁻'
      }
    }
  }
};

// Generic translation function for remaining keys
function generateTranslation(key, calcSlug) {
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];
  const category = parts[0];

  // Check if we have manual translation
  if (translations[category] && parts.length > 1) {
    let current = translations[category];
    for (let i = 1; i < parts.length && current; i++) {
      current = current[parts[i]];
    }
    if (current && current.en && current.ar) {
      return current;
    }
  }

  // Generate generic translation
  let enText = lastPart
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Common term translations
  const termMap = {
    'Calculator': 'حاسبة', 'Error': 'خطأ', 'Invalid': 'غير صالح',
    'Enter': 'أدخل', 'Title': 'العنوان', 'Description': 'الوصف',
    'Result': 'النتيجة', 'Results': 'النتائج', 'Calculate': 'احسب',
    'Total': 'الإجمالي', 'Value': 'القيمة', 'Input': 'الإدخال',
    'Output': 'الإخراج', 'Formula': 'الصيغة', 'Info': 'معلومات',
    'Tooltip': 'تلميح', 'Unit': 'الوحدة', 'Type': 'النوع',
    'Mode': 'الوضع', 'Option': 'خيار', 'Options': 'خيارات',
    'Length': 'الطول', 'Width': 'العرض', 'Height': 'الارتفاع',
    'Diameter': 'القطر', 'Area': 'المساحة', 'Volume': 'الحجم',
    'Weight': 'الوزن', 'Distance': 'المسافة', 'Time': 'الوقت',
    'Speed': 'السرعة', 'Pressure': 'الضغط', 'Temperature': 'درجة الحرارة',
    'Power': 'القدرة', 'Energy': 'الطاقة', 'Voltage': 'الجهد',
    'Current': 'التيار', 'Resistance': 'المقاومة', 'Frequency': 'التردد',
    'Price': 'السعر', 'Cost': 'التكلفة', 'Rate': 'المعدل',
    'Amount': 'المبلغ', 'Payment': 'الدفع', 'Interest': 'الفائدة',
    'Tax': 'الضريبة', 'Fee': 'الرسوم', 'Profit': 'الربح',
    'Loss': 'الخسارة', 'Income': 'الدخل', 'Expense': 'المصروف',
    'Budget': 'الميزانية', 'Savings': 'المدخرات', 'Investment': 'الاستثمار',
    'Salary': 'الراتب', 'Meter': 'متر', 'Meters': 'متر',
    'Feet': 'قدم', 'Inch': 'بوصة', 'Inches': 'بوصة',
    'Kilogram': 'كيلوغرام', 'Gram': 'غرام', 'Pound': 'باوند',
    'Liter': 'لتر', 'Liters': 'لتر', 'Gallon': 'جالون',
    'Second': 'ثانية', 'Minute': 'دقيقة', 'Hour': 'ساعة',
    'Day': 'يوم', 'Week': 'أسبوع', 'Month': 'شهر', 'Year': 'سنة',
    'Percent': '%', 'Positive': 'موجب', 'Negative': 'سالب',
    'Required': 'مطلوب', 'Minimum': 'الحد الأدنى', 'Maximum': 'الحد الأقصى',
    'Average': 'المتوسط', 'Range': 'النطاق', 'Standard': 'قياسي',
    'Custom': 'مخصص', 'Default': 'افتراضي', 'Advanced': 'متقدم',
    'Basic': 'أساسي', 'None': 'لا شيء', 'Yes': 'نعم', 'No': 'لا',
    'Add': 'إضافة', 'Remove': 'إزالة', 'Edit': 'تحرير',
    'Save': 'حفظ', 'Cancel': 'إلغاء', 'Reset': 'إعادة تعيين',
    'Clear': 'مسح', 'Submit': 'إرسال', 'Confirm': 'تأكيد'
  };

  // Simple word-by-word translation
  let arText = enText;
  Object.entries(termMap).forEach(([en, ar]) => {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    arText = arText.replace(regex, ar);
  });

  // If no translation occurred, prepend with generic prefix
  if (arText === enText && !Object.values(termMap).some(v => arText.includes(v))) {
    arText = enText; // Keep English if no match
  }

  return { en: enText, ar: arText };
}

// Process each calculator
console.log('Applying translations to files...\n');

const categoriesProcessed = new Set();
const stats = {
  total: 0,
  added: 0,
  skipped: 0,
  errors: []
};

categories.forEach(calcInfo => {
  const { slug, category, namespace } = calcInfo;
  const keysInfo = keysData.find(k => k.slug === slug);

  if (!keysInfo || !keysInfo.found) {
    console.log(`⚠️  Skipping ${slug} - no component found`);
    stats.skipped++;
    return;
  }

  const enPath = `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/en/calc/${category}.json`;
  const arPath = `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/ar/calc/${category}.json`;

  if (!fs.existsSync(enPath) || !fs.existsSync(arPath)) {
    console.log(`⚠️  Category files missing for ${category}`);
    stats.errors.push(`Missing files for ${category}`);
    return;
  }

  try {
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

    // Get calculator key (remove '-calculator' suffix and convert to snake_case)
    const calcKey = slug.replace(/-calculator$/, '').replace(/-/g, '_');

    // Initialize calculator object if it doesn't exist
    if (!enData[calcKey]) enData[calcKey] = {};
    if (!arData[calcKey]) arData[calcKey] = {};

    let keysAdded = 0;

    // Process each translation key
    keysInfo.keys.forEach(fullKey => {
      // Remove namespace prefix
      let key = fullKey;
      if (key.includes(':')) {
        key = key.split(':')[1];
      }

      // Remove calculator prefix if present
      if (key.startsWith(calcKey + '.')) {
        key = key.substring(calcKey.length + 1);
      }

      // Check if key already exists
      const keyParts = key.split('.');
      let enCurrent = enData[calcKey];
      let arCurrent = arData[calcKey];
      let exists = true;

      for (const part of keyParts) {
        if (!enCurrent || !enCurrent[part]) {
          exists = false;
          break;
        }
        enCurrent = enCurrent[part];
      }

      if (exists && typeof enCurrent === 'string') {
        // Key already has translation, skip
        return;
      }

      // Add missing translation
      const translation = generateTranslation(fullKey, slug);

      // Create nested structure
      enCurrent = enData[calcKey];
      arCurrent = arData[calcKey];

      for (let i = 0; i < keyParts.length; i++) {
        const part = keyParts[i];
        if (i === keyParts.length - 1) {
          enCurrent[part] = translation.en;
          arCurrent[part] = translation.ar;
          keysAdded++;
        } else {
          if (!enCurrent[part]) enCurrent[part] = {};
          if (!arCurrent[part]) arCurrent[part] = {};
          enCurrent = enCurrent[part];
          arCurrent = arCurrent[part];
        }
      }
    });

    // Write back to files
    fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n');
    fs.writeFileSync(arPath, JSON.stringify(arData, null, 2) + '\n');

    console.log(`✓ ${slug}: ${keysAdded} keys added to ${category}.json`);
    stats.total++;
    stats.added += keysAdded;
    categoriesProcessed.add(category);

  } catch (error) {
    console.log(`❌ Error processing ${slug}: ${error.message}`);
    stats.errors.push(`${slug}: ${error.message}`);
  }
});

console.log(`\n${'='.repeat(50)}`);
console.log('SUMMARY');
console.log('='.repeat(50));
console.log(`Calculators processed: ${stats.total}`);
console.log(`Translation keys added: ${stats.added}`);
console.log(`Calculators skipped: ${stats.skipped}`);
console.log(`Categories updated: ${categoriesProcessed.size}`);
console.log(`Categories: ${Array.from(categoriesProcessed).sort().join(', ')}`);

if (stats.errors.length > 0) {
  console.log(`\nErrors (${stats.errors.length}):`);
  stats.errors.forEach(err => console.log(`  - ${err}`));
}

console.log('\n✅ Translation update complete!');
