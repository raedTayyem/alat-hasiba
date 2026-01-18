const fs = require('fs');
const path = require('path');

// Load the extracted keys
const keysData = JSON.parse(fs.readFileSync('batch-121-180-keys.json', 'utf8'));

// Function to create translation structure from flat keys
function createTranslationStructure(keys) {
  const structure = {};

  keys.forEach(key => {
    // Remove namespace prefix (common:, calc/category:, etc.)
    let cleanKey = key;
    if (key.includes(':')) {
      cleanKey = key.split(':')[1];
    }

    const parts = cleanKey.split('.');
    let current = structure;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // Leaf node - we'll fill with translations later
        current[part] = `__TRANSLATE__${cleanKey}__`;
      } else {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    });
  });

  return structure;
}

// Helper function to generate English translation
function generateEnglishTranslation(key) {
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];

  // Convert snake_case or camelCase to Title Case
  let text = lastPart
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Handle special cases
  if (key.includes('error') || key.includes('Error')) {
    if (!text.includes('Error') && !text.startsWith('Invalid') && !text.startsWith('Enter')) {
      text = 'Invalid ' + text.toLowerCase();
    }
  }

  if (key.includes('tooltip')) {
    text = 'Enter ' + text.replace('Tooltip', '').trim().toLowerCase();
  }

  if (key.includes('placeholder')) {
    text = 'Enter ' + text.replace('Placeholder', '').trim().toLowerCase();
  }

  if (key.includes('title')) {
    text = text.replace(' Title', '');
  }

  if (key.includes('description')) {
    text = 'Description for ' + text.replace(' Description', '').toLowerCase();
  }

  return text;
}

// Helper function to generate Arabic translation
function generateArabicTranslation(englishText, key) {
  // Common translation mappings
  const translations = {
    // Common terms
    'Calculator': 'حاسبة',
    'Error': 'خطأ',
    'Invalid': 'غير صالح',
    'Enter': 'أدخل',
    'Title': 'العنوان',
    'Description': 'الوصف',
    'Result': 'النتيجة',
    'Results': 'النتائج',
    'Calculate': 'احسب',
    'Total': 'المجموع',
    'Value': 'القيمة',
    'Input': 'الإدخال',
    'Output': 'الإخراج',
    'Formula': 'الصيغة',
    'Formulas': 'الصيغ',
    'Info': 'معلومات',
    'Information': 'معلومات',
    'Tooltip': 'تلميح',
    'Placeholder': 'عنصر نائب',
    'Unit': 'الوحدة',
    'Units': 'الوحدات',
    'Type': 'النوع',
    'Mode': 'الوضع',
    'Modes': 'الأوضاع',
    'Options': 'خيارات',
    'Settings': 'إعدادات',
    'Advanced': 'متقدم',
    'Basic': 'أساسي',
    'Standard': 'قياسي',
    'Custom': 'مخصص',
    'Default': 'افتراضي',
    'Minimum': 'الحد الأدنى',
    'Maximum': 'الحد الأقصى',
    'Average': 'المتوسط',
    'Range': 'النطاق',
    'Positive': 'موجب',
    'Negative': 'سالب',
    'Required': 'مطلوب',

    // Measurements
    'Length': 'الطول',
    'Width': 'العرض',
    'Height': 'الارتفاع',
    'Depth': 'العمق',
    'Diameter': 'القطر',
    'Radius': 'نصف القطر',
    'Area': 'المساحة',
    'Volume': 'الحجم',
    'Weight': 'الوزن',
    'Mass': 'الكتلة',
    'Distance': 'المسافة',
    'Time': 'الوقت',
    'Speed': 'السرعة',
    'Velocity': 'السرعة',
    'Acceleration': 'التسارع',
    'Force': 'القوة',
    'Pressure': 'الضغط',
    'Temperature': 'درجة الحرارة',
    'Power': 'القدرة',
    'Energy': 'الطاقة',
    'Voltage': 'الجهد',
    'Current': 'التيار',
    'Resistance': 'المقاومة',
    'Frequency': 'التردد',
    'Concentration': 'التركيز',

    // Common units
    'Meters': 'متر',
    'Feet': 'قدم',
    'Inches': 'بوصة',
    'Centimeters': 'سنتيمتر',
    'Millimeters': 'ملليمتر',
    'Kilometers': 'كيلومتر',
    'Miles': 'ميل',
    'Yards': 'ياردة',
    'Liters': 'لتر',
    'Gallons': 'جالون',
    'Kilograms': 'كيلوغرام',
    'Pounds': 'باوند',
    'Grams': 'غرام',
    'Ounces': 'أونصة',
    'Seconds': 'ثانية',
    'Minutes': 'دقيقة',
    'Hours': 'ساعة',
    'Days': 'يوم',
    'Weeks': 'أسبوع',
    'Months': 'شهر',
    'Years': 'سنة',
    'Percent': 'نسبة مئوية',
    'Degrees': 'درجة',

    // Financial terms
    'Price': 'السعر',
    'Cost': 'التكلفة',
    'Rate': 'المعدل',
    'Amount': 'المبلغ',
    'Payment': 'الدفع',
    'Interest': 'الفائدة',
    'Principal': 'رأس المال',
    'Balance': 'الرصيد',
    'Profit': 'الربح',
    'Loss': 'الخسارة',
    'Tax': 'الضريبة',
    'Fee': 'الرسوم',
    'Discount': 'الخصم',
    'Income': 'الدخل',
    'Expense': 'المصروف',
    'Revenue': 'الإيرادات',
    'Budget': 'الميزانية',
    'Savings': 'المدخرات',
    'Investment': 'الاستثمار',
    'Return': 'العائد',
    'Margin': 'الهامش',
    'Salary': 'الراتب',
    'Wage': 'الأجر',

    // Actions
    'Add': 'إضافة',
    'Remove': 'إزالة',
    'Delete': 'حذف',
    'Edit': 'تحرير',
    'Update': 'تحديث',
    'Save': 'حفظ',
    'Cancel': 'إلغاء',
    'Reset': 'إعادة تعيين',
    'Clear': 'مسح',
    'Submit': 'إرسال',
    'Confirm': 'تأكيد',
    'Select': 'اختيار',
    'Choose': 'اختيار',
    'Enable': 'تفعيل',
    'Disable': 'تعطيل',
    'Show': 'عرض',
    'Hide': 'إخفاء',
    'Expand': 'توسيع',
    'Collapse': 'طي',
    'Next': 'التالي',
    'Previous': 'السابق',
    'Back': 'رجوع',
    'Forward': 'إلى الأمام',
    'Start': 'بدء',
    'Stop': 'إيقاف',
    'Pause': 'إيقاف مؤقت',
    'Resume': 'استئناف',
    'Finish': 'إنهاء',
    'Complete': 'إكمال'
  };

  // Try to translate word by word
  let arabicText = englishText;
  Object.entries(translations).forEach(([en, ar]) => {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    arabicText = arabicText.replace(regex, ar);
  });

  // If no translation happened, provide a generic translation
  if (arabicText === englishText) {
    arabicText = 'ترجمة: ' + englishText;
  }

  return arabicText;
}

// Process translations
function fillTranslations(structure, prefix = '') {
  const result = {};

  for (const [key, value] of Object.entries(structure)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && !value.toString().startsWith('__TRANSLATE__')) {
      result[key] = fillTranslations(value, fullKey);
    } else if (typeof value === 'string' && value.startsWith('__TRANSLATE__')) {
      const originalKey = value.replace('__TRANSLATE__', '').replace('__', '');
      result[key] = {
        en: generateEnglishTranslation(originalKey),
        ar: generateArabicTranslation(generateEnglishTranslation(originalKey), originalKey)
      };
    } else {
      result[key] = value;
    }
  }

  return result;
}

console.log('Generating translations for batch 121-180...\n');

const translationsMap = new Map();

keysData.forEach(calc => {
  if (!calc.found || calc.keys.length === 0) return;

  const structure = createTranslationStructure(calc.keys);
  const translations = fillTranslations(structure);
  translationsMap.set(calc.slug, { keys: calc.keys, translations });

  console.log(`✓ ${calc.slug}: ${calc.keys.length} keys prepared`);
});

// Save the translations map
const outputPath = '/Users/raedtayyem/Desktop/work/alathasiba-claudecode/batch-121-180-translations.json';
const output = Array.from(translationsMap.entries()).map(([slug, data]) => ({
  slug,
  keysCount: data.keys.length,
  keys: data.keys,
  translations: data.translations
}));

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`\nTranslations generated and saved to: batch-121-180-translations.json`);
console.log(`Total calculators: ${translationsMap.size}`);
console.log(`Total keys: ${output.reduce((sum, item) => sum + item.keysCount, 0)}`);
