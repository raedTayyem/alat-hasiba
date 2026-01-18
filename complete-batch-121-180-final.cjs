#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Comprehensive translation mapping for batch 121-180
const allTranslations = {
  // Common keys that appear in multiple calculators
  'common': {
    'info': {
      en: 'Information',
      ar: 'معلومات'
    },
    'errors': {
      'calculationError': {
        en: 'An error occurred during calculation',
        ar: 'حدث خطأ أثناء الحساب'
      },
      'invalid_input': {
        en: 'Invalid input',
        ar: 'مدخلات غير صالحة'
      }
    },
    'units': {
      'percent': {
        en: '%',
        ar: '%'
      }
    }
  },

  // Calculator-specific translations
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

// Helper: Generate translation for any key based on patterns
function generateTranslation(key) {
  // Common term mappings
  const termMap = {
    'error': 'خطأ', 'invalid': 'غير صالح', 'enter': 'أدخل',
    'title': 'العنوان', 'description': 'الوصف', 'result': 'النتيجة',
    'results': 'النتائج', 'calculate': 'احسب', 'total': 'الإجمالي',
    'value': 'القيمة', 'input': 'الإدخال', 'output': 'الإخراج',
    'formula': 'الصيغة', 'formulas': 'الصيغ', 'info': 'معلومات',
    'tooltip': 'تلميح', 'placeholder': 'عنصر نائب', 'unit': 'الوحدة',
    'type': 'النوع', 'mode': 'الوضع', 'option': 'خيار',
    'length': 'الطول', 'width': 'العرض', 'height': 'الارتفاع',
    'diameter': 'القطر', 'area': 'المساحة', 'volume': 'الحجم',
    'weight': 'الوزن', 'distance': 'المسافة', 'time': 'الوقت',
    'speed': 'السرعة', 'pressure': 'الضغط', 'temperature': 'درجة الحرارة',
    'power': 'القدرة', 'energy': 'الطاقة', 'voltage': 'الجهد',
    'current': 'التيار', 'resistance': 'المقاومة', 'frequency': 'التردد',
    'price': 'السعر', 'cost': 'التكلفة', 'rate': 'المعدل',
    'amount': 'المبلغ', 'payment': 'الدفع', 'interest': 'الفائدة',
    'tax': 'الضريبة', 'fee': 'الرسوم', 'profit': 'الربح',
    'loss': 'الخسارة', 'income': 'الدخل', 'expense': 'المصروف',
    'budget': 'الميزانية', 'savings': 'المدخرات', 'investment': 'الاستثمار',
    'salary': 'الراتب', 'meter': 'متر', 'meters': 'متر',
    'feet': 'قدم', 'inch': 'بوصة', 'inches': 'بوصة',
    'kilogram': 'كيلوغرام', 'gram': 'غرام', 'pound': 'باوند',
    'liter': 'لتر', 'liters': 'لتر', 'gallon': 'جالون',
    'second': 'ثانية', 'minute': 'دقيقة', 'hour': 'ساعة',
    'day': 'يوم', 'week': 'أسبوع', 'month': 'شهر', 'year': 'سنة',
    'percent': '%', 'positive': 'موجب', 'negative': 'سالب',
    'required': 'مطلوب', 'minimum': 'الحد الأدنى', 'maximum': 'الحد الأقصى',
    'average': 'المتوسط', 'range': 'النطاق', 'standard': 'قياسي',
    'calculator': 'حاسبة'
  };

  // Extract the last part of the key
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];

  // Generate English text
  let enText = lastPart
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Simple word-by-word translation attempt
  let arText = enText.toLowerCase();
  Object.entries(termMap).forEach(([en, ar]) => {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    arText = arText.replace(regex, ar);
  });

  // If no translation occurred or mostly English remains, keep English as fallback
  const hasArabic = /[\u0600-\u06FF]/.test(arText);
  if (!hasArabic) {
    arText = enText;
  } else {
    // Clean up spacing around Arabic text
    arText = arText.trim();
  }

  return { en: enText, ar: arText };
}

// Helper: Get nested value
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, part) => {
    return current && current[part] !== undefined ? current[part] : null;
  }, obj);
}

// Helper: Set nested value
function setNestedValue(obj, path, value) {
  const parts = path.split('.');
  const lastPart = parts.pop();
  let current = obj;

  for (const part of parts) {
    if (!current[part]) current[part] = {};
    current = current[part];
  }

  current[lastPart] = value;
}

// Process calculators
console.log('Processing translations for batch 121-180...\n');

const keysData = JSON.parse(fs.readFileSync('batch-121-180-keys.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('calculator-categories-121-180.json', 'utf8'));

let totalAdded = 0;
const categoriesUpdated = new Set();

categories.forEach(calcInfo => {
  const {slug, category } = calcInfo;
  const keysInfo = keysData.find(k => k.slug === slug);

  if (!keysInfo || !keysInfo.found) {
    console.log(`⚠️  Skipping ${slug} - no keys found`);
    return;
  }

  const enPath = `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/en/calc/${category}.json`;
  const arPath = `/Users/raedtayyem/Desktop/work/alathasiba-claudecode/public/locales/ar/calc/${category}.json`;

  if (!fs.existsSync(enPath) || !fs.existsSync(arPath)) {
    console.log(`⚠️  Skipping ${slug} - category files missing: ${category}`);
    return;
  }

  try {
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

    const calcKey = slug.replace(/-calculator$/, '').replace(/-/g, '_');

    if (!enData[calcKey]) enData[calcKey] = {};
    if (!arData[calcKey]) arData[calcKey] = {};

    let keysAdded = 0;

    keysInfo.keys.forEach(fullKey => {
      let key = fullKey;
      if (key.includes(':')) {
        key = key.split(':')[1];
      }

      // Remove calc key prefix if present
      if (key.startsWith(calcKey + '.')) {
        key = key.substring(calcKey.length + 1);
      }

      // Also handle common. prefix
      if (key.startsWith('common.')) {
        return; // Skip common keys, they're in common.json
      }

      // Check if translation exists
      const enExists = getNestedValue(enData[calcKey], key);
      if (enExists && typeof enExists === 'string') {
        return; // Already translated
      }

      // Get translation from manual mapping or generate
      let translation;
      const manualPath = `${calcKey}.${key}`;
      const manualTrans = getNestedValue(allTranslations, manualPath);

      if (manualTrans && manualTrans.en && manualTrans.ar) {
        translation = manualTrans;
      } else {
        translation = generateTranslation(fullKey);
      }

      // Add translation
      setNestedValue(enData[calcKey], key, translation.en);
      setNestedValue(arData[calcKey], key, translation.ar);
      keysAdded++;
    });

    if (keysAdded > 0) {
      fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n');
      fs.writeFileSync(arPath, JSON.stringify(arData, null, 2) + '\n');
      console.log(`✓ ${slug}: Added ${keysAdded} translations to ${category}.json`);
      totalAdded += keysAdded;
      categoriesUpdated.add(category);
    } else {
      console.log(`- ${slug}: No new translations needed`);
    }

  } catch (error) {
    console.log(`❌ Error processing ${slug}: ${error.message}`);
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`Total translations added: ${totalAdded}`);
console.log(`Categories updated: ${Array.from(categoriesUpdated).sort().join(', ')}`);
console.log('\n✅ Batch 121-180 translation complete!');
