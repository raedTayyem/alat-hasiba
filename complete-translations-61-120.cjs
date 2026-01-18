#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the batch data
const batchData = JSON.parse(fs.readFileSync('./partial-translations-61-120.json', 'utf8'));

// Translation mappings for common patterns
const translations = {
  // Common error keys
  'common:common.errors.calculationError': {
    en: 'An error occurred during calculation',
    ar: 'حدث خطأ أثناء الحساب'
  },
  'common.error.invalid_input': {
    en: 'Invalid input',
    ar: 'مدخلات غير صالحة'
  },

  // Environmental calculators
  'co2_emissions.title': {
    en: 'CO2 Emissions Calculator',
    ar: 'حاسبة انبعاثات ثاني أكسيد الكربون'
  },
  'co2_emissions.description': {
    en: 'Calculate carbon dioxide emissions from various activities',
    ar: 'احسب انبعاثات ثاني أكسيد الكربون من مختلف الأنشطة'
  },

  'energy_saving.title': {
    en: 'Energy Saving Calculator',
    ar: 'حاسبة توفير الطاقة'
  },
  'energy_saving.description': {
    en: 'Calculate potential energy savings and costs',
    ar: 'احسب التوفير المحتمل في الطاقة والتكاليف'
  },

  'flight_emissions.title': {
    en: 'Flight Emissions Calculator',
    ar: 'حاسبة انبعاثات الرحلات الجوية'
  },
  'flight_emissions.description': {
    en: 'Calculate carbon emissions from air travel',
    ar: 'احسب انبعاثات الكربون من السفر الجوي'
  },

  'water_footprint.title': {
    en: 'Water Footprint Calculator',
    ar: 'حاسبة البصمة المائية'
  },
  'water_footprint.description': {
    en: 'Calculate your water consumption footprint',
    ar: 'احسب بصمة استهلاكك للمياه'
  },

  // Engineering calculators
  'electrical-resistance.title': {
    en: 'Electrical Resistance Calculator',
    ar: 'حاسبة المقاومة الكهربائية'
  },
  'electrical-resistance.description': {
    en: 'Calculate electrical resistance using Ohm\'s law',
    ar: 'احسب المقاومة الكهربائية باستخدام قانون أوم'
  },

  // Finance calculators
  'investment.title': {
    en: 'Investment Calculator',
    ar: 'حاسبة الاستثمار'
  },
  'investment.description': {
    en: 'Calculate investment returns and growth',
    ar: 'احسب عوائد ونمو الاستثمار'
  },

  // Health calculators
  'pregnancy_calculator.title': {
    en: 'Pregnancy Calculator',
    ar: 'حاسبة الحمل'
  },
  'pregnancy_calculator.description': {
    en: 'Calculate due date and pregnancy milestones',
    ar: 'احسب موعد الولادة ومعالم الحمل'
  },

  'waist_hip_ratio.title': {
    en: 'Waist to Hip Ratio Calculator',
    ar: 'حاسبة نسبة الخصر إلى الورك'
  },
  'waist_hip_ratio.description': {
    en: 'Calculate your waist to hip ratio and health risk',
    ar: 'احسب نسبة الخصر إلى الورك والمخاطر الصحية'
  },

  // Pet calculators
  'cat_age.title': {
    en: 'Cat Age Calculator',
    ar: 'حاسبة عمر القطط'
  },
  'cat_age.description': {
    en: 'Calculate your cat\'s age in human years',
    ar: 'احسب عمر قطتك بالسنوات البشرية'
  },

  'cat_calorie.title': {
    en: 'Cat Calorie Calculator',
    ar: 'حاسبة السعرات الحرارية للقطط'
  },
  'cat_calorie.description': {
    en: 'Calculate daily calorie needs for your cat',
    ar: 'احسب احتياجات قطتك اليومية من السعرات الحرارية'
  },

  'dog_calorie.title': {
    en: 'Dog Calorie Calculator',
    ar: 'حاسبة السعرات الحرارية للكلاب'
  },
  'dog_calorie.description': {
    en: 'Calculate daily calorie needs for your dog',
    ar: 'احسب احتياجات كلبك اليومية من السعرات الحرارية'
  },

  'pet_insurance.title': {
    en: 'Pet Insurance Calculator',
    ar: 'حاسبة تأمين الحيوانات الأليفة'
  },
  'pet_insurance.description': {
    en: 'Calculate pet insurance costs and coverage',
    ar: 'احسب تكاليف وتغطية تأمين الحيوانات الأليفة'
  },

  'bird_cage_size.title': {
    en: 'Bird Cage Size Calculator',
    ar: 'حاسبة حجم قفص الطيور'
  },
  'bird_cage_size.description': {
    en: 'Calculate the appropriate cage size for your bird',
    ar: 'احسب الحجم المناسب للقفص لطائرك'
  },

  'hamster_lifespan.title': {
    en: 'Hamster Lifespan Calculator',
    ar: 'حاسبة عمر الهامستر'
  },
  'hamster_lifespan.description': {
    en: 'Calculate hamster age and expected lifespan',
    ar: 'احسب عمر الهامستر والعمر المتوقع'
  },

  'rabbit_care.title': {
    en: 'Rabbit Care Calculator',
    ar: 'حاسبة رعاية الأرانب'
  },
  'rabbit_care.description': {
    en: 'Calculate rabbit care requirements and costs',
    ar: 'احسب متطلبات وتكاليف رعاية الأرانب'
  },

  'dog_food.title': {
    en: 'Dog Food Calculator',
    ar: 'حاسبة طعام الكلاب'
  },
  'dog_food.description': {
    en: 'Calculate daily food portions for your dog',
    ar: 'احسب حصص الطعام اليومية لكلبك'
  },

  // Real estate calculators
  'rental_yield.title': {
    en: 'Rental Yield Calculator',
    ar: 'حاسبة عائد الإيجار'
  },
  'rental_yield.description': {
    en: 'Calculate rental property yield and return on investment',
    ar: 'احسب عائد العقار المؤجر والعائد على الاستثمار'
  },

  'property_tax.title': {
    en: 'Property Tax Calculator',
    ar: 'حاسبة ضريبة الملكية'
  },
  'property_tax.description': {
    en: 'Calculate property tax amounts',
    ar: 'احسب مبالغ ضريبة الملكية'
  },

  'debt_to_income_ratio.title': {
    en: 'Debt to Income Ratio Calculator',
    ar: 'حاسبة نسبة الدين إلى الدخل'
  },
  'debt_to_income_ratio.description': {
    en: 'Calculate your debt to income ratio',
    ar: 'احسب نسبة الدين إلى الدخل'
  },

  'loan_to_value.title': {
    en: 'Loan to Value Calculator',
    ar: 'حاسبة نسبة القرض إلى القيمة'
  },
  'loan_to_value.description': {
    en: 'Calculate loan to value ratio for mortgages',
    ar: 'احسب نسبة القرض إلى القيمة للرهن العقاري'
  },

  // Automotive calculators
  'fuel_economy.title': {
    en: 'Fuel Economy Calculator',
    ar: 'حاسبة اقتصاد الوقود'
  },
  'fuel_economy.description': {
    en: 'Calculate fuel consumption and economy',
    ar: 'احسب استهلاك الوقود والاقتصاد'
  },

  // Business calculators
  'commission.title': {
    en: 'Commission Calculator',
    ar: 'حاسبة العمولة'
  },
  'commission.description': {
    en: 'Calculate sales commissions and earnings',
    ar: 'احسب عمولات المبيعات والأرباح'
  },

  'inventory_turnover.title': {
    en: 'Inventory Turnover Calculator',
    ar: 'حاسبة معدل دوران المخزون'
  },
  'inventory_turnover.description': {
    en: 'Calculate inventory turnover ratio and efficiency',
    ar: 'احسب نسبة دوران المخزون والكفاءة'
  },

  'ltv_calculator.title': {
    en: 'Customer Lifetime Value Calculator',
    ar: 'حاسبة القيمة الدائمة للعميل'
  },
  'ltv_calculator.description': {
    en: 'Calculate customer lifetime value and revenue potential',
    ar: 'احسب القيمة الدائمة للعميل وإمكانات الإيرادات'
  },

  // Construction calculators
  'concrete.title': {
    en: 'Concrete Calculator',
    ar: 'حاسبة الخرسانة'
  },
  'concrete.description': {
    en: 'Calculate concrete volume and material requirements',
    ar: 'احسب حجم الخرسانة ومتطلبات المواد'
  },

  'door_calculator.title': {
    en: 'Door Calculator',
    ar: 'حاسبة الأبواب'
  },
  'door_calculator.description': {
    en: 'Calculate door dimensions and materials needed',
    ar: 'احسب أبعاد الأبواب والمواد المطلوبة'
  },

  'shingle.title': {
    en: 'Shingle Calculator',
    ar: 'حاسبة القرميد'
  },
  'shingle.description': {
    en: 'Calculate shingle quantities for roofing',
    ar: 'احسب كميات القرميد للسقف'
  },

  'window.title': {
    en: 'Window Calculator',
    ar: 'حاسبة النوافذ'
  },
  'window.description': {
    en: 'Calculate window dimensions and materials',
    ar: 'احسب أبعاد النوافذ والمواد'
  },

  'brick.title': {
    en: 'Brick Calculator',
    ar: 'حاسبة الطوب'
  },
  'brick.description': {
    en: 'Calculate brick quantities needed for construction',
    ar: 'احسب كميات الطوب المطلوبة للبناء'
  },

  'roof_pitch.title': {
    en: 'Roof Pitch Calculator',
    ar: 'حاسبة ميل السقف'
  },
  'roof_pitch.description': {
    en: 'Calculate roof pitch and angles',
    ar: 'احسب ميل وزوايا السقف'
  },

  'sand.title': {
    en: 'Sand Calculator',
    ar: 'حاسبة الرمل'
  },
  'sand.description': {
    en: 'Calculate sand volume and quantities needed',
    ar: 'احسب حجم الرمل والكميات المطلوبة'
  },

  // Converters
  'number_system.title': {
    en: 'Number System Converter',
    ar: 'محول أنظمة الأرقام'
  },
  'number_system.description': {
    en: 'Convert between different number systems',
    ar: 'تحويل بين أنظمة الأرقام المختلفة'
  },

  // Electrical calculators
  'electrical_load.title': {
    en: 'Electrical Load Calculator',
    ar: 'حاسبة الحمل الكهربائي'
  },
  'electrical_load.description': {
    en: 'Calculate electrical load and power requirements',
    ar: 'احسب الحمل الكهربائي ومتطلبات الطاقة'
  },

  'electricity_bill.title': {
    en: 'Electricity Bill Calculator',
    ar: 'حاسبة فاتورة الكهرباء'
  },
  'electricity_bill.description': {
    en: 'Calculate electricity costs and consumption',
    ar: 'احسب تكاليف الكهرباء والاستهلاك'
  },

  'inductor.title': {
    en: 'Inductor Calculator',
    ar: 'حاسبة الملف الحثي'
  },
  'inductor.description': {
    en: 'Calculate inductor properties and values',
    ar: 'احسب خصائص وقيم الملف الحثي'
  },

  'impedance.title': {
    en: 'Impedance Calculator',
    ar: 'حاسبة الممانعة'
  },
  'impedance.description': {
    en: 'Calculate electrical impedance in AC circuits',
    ar: 'احسب الممانعة الكهربائية في دوائر التيار المتردد'
  },

  // Fitness calculators
  'rep_range.title': {
    en: 'Rep Range Calculator',
    ar: 'حاسبة نطاق التكرارات'
  },
  'rep_range.description': {
    en: 'Calculate optimal rep ranges for training',
    ar: 'احسب نطاقات التكرار المثلى للتدريب'
  },

  'swimming_pace.title': {
    en: 'Swimming Pace Calculator',
    ar: 'حاسبة سرعة السباحة'
  },
  'swimming_pace.description': {
    en: 'Calculate swimming pace and times',
    ar: 'احسب سرعة وأوقات السباحة'
  },

  'weight_loss_time.title': {
    en: 'Weight Loss Time Calculator',
    ar: 'حاسبة وقت فقدان الوزن'
  },
  'weight_loss_time.description': {
    en: 'Calculate time needed to reach weight loss goals',
    ar: 'احسب الوقت اللازم للوصول إلى أهداف فقدان الوزن'
  },

  // Gaming calculators
  'dps_calculator.title': {
    en: 'DPS Calculator',
    ar: 'حاسبة الضرر في الثانية'
  },
  'dps_calculator.description': {
    en: 'Calculate damage per second in games',
    ar: 'احسب الضرر في الثانية في الألعاب'
  },

  'fov_calculator.title': {
    en: 'FOV Calculator',
    ar: 'حاسبة مجال الرؤية'
  },
  'fov_calculator.description': {
    en: 'Calculate optimal field of view for gaming',
    ar: 'احسب مجال الرؤية الأمثل للألعاب'
  },

  'fps_calculator.title': {
    en: 'FPS Calculator',
    ar: 'حاسبة الإطارات في الثانية'
  },
  'fps_calculator.description': {
    en: 'Calculate frames per second performance',
    ar: 'احسب أداء الإطارات في الثانية'
  },

  'minecraft.title': {
    en: 'Minecraft Calculator',
    ar: 'حاسبة ماين كرافت'
  },
  'minecraft.description': {
    en: 'Calculate Minecraft resources and materials',
    ar: 'احسب موارد ومواد ماين كرافت'
  },

  'win_rate.title': {
    en: 'Win Rate Calculator',
    ar: 'حاسبة معدل الفوز'
  },
  'win_rate.description': {
    en: 'Calculate win rate and game statistics',
    ar: 'احسب معدل الفوز وإحصائيات اللعبة'
  },

  'xp_calculator.title': {
    en: 'XP Calculator',
    ar: 'حاسبة نقاط الخبرة'
  },
  'xp_calculator.description': {
    en: 'Calculate experience points and leveling',
    ar: 'احسب نقاط الخبرة والترقي'
  },

  // Health calculators
  'ideal_weight.title': {
    en: 'Ideal Weight Calculator',
    ar: 'حاسبة الوزن المثالي'
  },
  'ideal_weight.description': {
    en: 'Calculate your ideal body weight',
    ar: 'احسب وزن جسمك المثالي'
  },

  'protein_calculator.title': {
    en: 'Protein Calculator',
    ar: 'حاسبة البروتين'
  },
  'protein_calculator.description': {
    en: 'Calculate daily protein requirements',
    ar: 'احسب احتياجاتك اليومية من البروتين'
  },

  'lean_body_mass.title': {
    en: 'Lean Body Mass Calculator',
    ar: 'حاسبة كتلة الجسم النحيل'
  },
  'lean_body_mass.description': {
    en: 'Calculate lean body mass and body composition',
    ar: 'احسب كتلة الجسم النحيل وتكوين الجسم'
  },

  // Math calculators
  'sequences.title': {
    en: 'Sequences Calculator',
    ar: 'حاسبة المتتاليات'
  },
  'sequences.description': {
    en: 'Calculate arithmetic and geometric sequences',
    ar: 'احسب المتتاليات الحسابية والهندسية'
  },

  'calculus.title': {
    en: 'Calculus Calculator',
    ar: 'حاسبة التفاضل والتكامل'
  },
  'calculus.description': {
    en: 'Calculate derivatives, integrals, and limits',
    ar: 'احسب المشتقات والتكاملات والنهايات'
  },

  // Calendar calculators
  'hebrew_to_gregorian.title': {
    en: 'Hebrew to Gregorian Converter',
    ar: 'محول التقويم العبري إلى الميلادي'
  },
  'hebrew_to_gregorian.description': {
    en: 'Convert dates between Hebrew and Gregorian calendars',
    ar: 'تحويل التواريخ بين التقويم العبري والميلادي'
  },

  'yazidi_calendar.title': {
    en: 'Yazidi Calendar',
    ar: 'التقويم اليزيدي'
  },
  'yazidi_calendar.description': {
    en: 'View and convert Yazidi calendar dates',
    ar: 'عرض وتحويل تواريخ التقويم اليزيدي'
  },

  'yazidi_new_year.title': {
    en: 'Yazidi New Year Calculator',
    ar: 'حاسبة رأس السنة اليزيدية'
  },
  'yazidi_new_year.description': {
    en: 'Calculate Yazidi New Year dates',
    ar: 'احسب تواريخ رأس السنة اليزيدية'
  },

  // Astronomy calculators
  'age_on_planets.title': {
    en: 'Age on Planets Calculator',
    ar: 'حاسبة العمر على الكواكب'
  },
  'age_on_planets.description': {
    en: 'Calculate your age on different planets',
    ar: 'احسب عمرك على كواكب مختلفة'
  },

  'weight_on_planets.title': {
    en: 'Weight on Planets Calculator',
    ar: 'حاسبة الوزن على الكواكب'
  },
  'weight_on_planets.description': {
    en: 'Calculate your weight on different planets',
    ar: 'احسب وزنك على كواكب مختلفة'
  },

  // Cooking calculators
  'cooking_time.title': {
    en: 'Cooking Time Calculator',
    ar: 'حاسبة وقت الطهي'
  },
  'cooking_time.description': {
    en: 'Calculate cooking times for various foods',
    ar: 'احسب أوقات طهي مختلف الأطعمة'
  },

  'turkey_cooking.title': {
    en: 'Turkey Cooking Calculator',
    ar: 'حاسبة طهي الديك الرومي'
  },
  'turkey_cooking.description': {
    en: 'Calculate turkey cooking time and temperature',
    ar: 'احسب وقت ودرجة حرارة طهي الديك الرومي'
  },

  // Engineering calculators
  'material_conversion.title': {
    en: 'Material Conversion Calculator',
    ar: 'حاسبة تحويل المواد'
  },
  'material_conversion.description': {
    en: 'Convert between material units and measurements',
    ar: 'تحويل بين وحدات وقياسات المواد'
  },

  // Science calculators
  'ph_calculator.title': {
    en: 'pH Calculator',
    ar: 'حاسبة الأس الهيدروجيني'
  },
  'ph_calculator.description': {
    en: 'Calculate pH levels and acidity',
    ar: 'احسب مستويات الأس الهيدروجيني والحموضة'
  },

  'half_life.title': {
    en: 'Half Life Calculator',
    ar: 'حاسبة عمر النصف'
  },
  'half_life.description': {
    en: 'Calculate radioactive decay and half-life',
    ar: 'احسب التحلل الإشعاعي وعمر النصف'
  }
};

// Function to add translation to appropriate file
function addTranslationToFile(key, enValue, arValue) {
  // Determine the namespace from the key
  let namespace = 'common';
  let actualKey = key;

  if (key.includes(':')) {
    [namespace, actualKey] = key.split(':');
  } else if (key.includes('.')) {
    const parts = key.split('.');
    // Map key prefixes to namespaces
    const namespaceMap = {
      'co2_emissions': 'calc/environmental',
      'energy_saving': 'calc/environmental',
      'flight_emissions': 'calc/environmental',
      'water_footprint': 'calc/environmental',
      'electrical-resistance': 'calc/engineering',
      'investment': 'calc/finance',
      'pregnancy_calculator': 'calc/health',
      'waist_hip_ratio': 'calc/health',
      'cat_age': 'calc/pet',
      'cat_calorie': 'calc/pet',
      'dog_calorie': 'calc/pet',
      'pet_insurance': 'calc/pet',
      'bird_cage_size': 'calc/pet',
      'hamster_lifespan': 'calc/pet',
      'rabbit_care': 'calc/pet',
      'dog_food': 'calc/pet',
      'rental_yield': 'calc/real-estate',
      'property_tax': 'calc/real-estate',
      'debt_to_income_ratio': 'calc/real-estate',
      'loan_to_value': 'calc/real-estate',
      'fuel_economy': 'calc/automotive',
      'commission': 'calc/business',
      'inventory_turnover': 'calc/business',
      'ltv_calculator': 'calc/business',
      'concrete': 'calc/construction',
      'door_calculator': 'calc/construction',
      'shingle': 'calc/construction',
      'window': 'calc/construction',
      'brick': 'calc/construction',
      'roof_pitch': 'calc/construction',
      'sand': 'calc/construction',
      'number_system': 'calc/converters',
      'electrical_load': 'calc/electrical',
      'electricity_bill': 'calc/electrical',
      'inductor': 'calc/electrical',
      'impedance': 'calc/electrical',
      'rep_range': 'calc/fitness',
      'swimming_pace': 'calc/fitness',
      'weight_loss_time': 'calc/fitness',
      'dps_calculator': 'calc/gaming',
      'fov_calculator': 'calc/gaming',
      'fps_calculator': 'calc/gaming',
      'minecraft': 'calc/gaming',
      'win_rate': 'calc/gaming',
      'xp_calculator': 'calc/gaming',
      'ideal_weight': 'calc/health',
      'protein_calculator': 'calc/health',
      'lean_body_mass': 'calc/health',
      'sequences': 'calc/math',
      'calculus': 'calc/math',
      'hebrew_to_gregorian': 'calc/hebrew-calendar',
      'yazidi_calendar': 'calc/yazidi-calendar',
      'yazidi_new_year': 'calc/yazidi-calendar',
      'age_on_planets': 'calc/astronomy',
      'weight_on_planets': 'calc/astronomy',
      'cooking_time': 'calc/cooking',
      'turkey_cooking': 'calc/cooking',
      'material_conversion': 'calc/engineering',
      'ph_calculator': 'calc/science',
      'half_life': 'calc/science'
    };

    const prefix = parts[0].replace(/_/g, '-');
    namespace = namespaceMap[parts[0]] || namespaceMap[prefix] || 'common';
  }

  return { namespace, key: actualKey, en: enValue, ar: arValue };
}

// Process each calculator in the batch
const updatedFiles = new Set();
const translationsByFile = {};

for (const calc of batchData.batch) {
  console.log(`\nProcessing ${calc.name}...`);
  console.log(`  Missing keys: ${calc.missingEN}`);

  for (const missingKey of calc.missingENKeys) {
    const translation = translations[missingKey];
    if (translation) {
      const fileInfo = addTranslationToFile(missingKey, translation.en, translation.ar);

      if (!translationsByFile[fileInfo.namespace]) {
        translationsByFile[fileInfo.namespace] = { en: {}, ar: {} };
      }

      // Parse the key path and create nested structure
      const keyPath = fileInfo.key.split('.');
      let currentEN = translationsByFile[fileInfo.namespace].en;
      let currentAR = translationsByFile[fileInfo.namespace].ar;

      for (let i = 0; i < keyPath.length - 1; i++) {
        if (!currentEN[keyPath[i]]) currentEN[keyPath[i]] = {};
        if (!currentAR[keyPath[i]]) currentAR[keyPath[i]] = {};
        currentEN = currentEN[keyPath[i]];
        currentAR = currentAR[keyPath[i]];
      }

      currentEN[keyPath[keyPath.length - 1]] = fileInfo.en;
      currentAR[keyPath[keyPath.length - 1]] = fileInfo.ar;

      updatedFiles.add(fileInfo.namespace);
    } else {
      console.log(`  Warning: No translation found for key: ${missingKey}`);
    }
  }
}

// Write translations to files
console.log('\n='.repeat(80));
console.log('UPDATING TRANSLATION FILES');
console.log('='.repeat(80));

for (const namespace of Object.keys(translationsByFile)) {
  const enPath = path.join(__dirname, 'public', 'locales', 'en', `${namespace}.json`);
  const arPath = path.join(__dirname, 'public', 'locales', 'ar', `${namespace}.json`);

  // Load existing translations
  let enData = {};
  let arData = {};

  try {
    if (fs.existsSync(enPath)) {
      enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    }
    if (fs.existsSync(arPath)) {
      arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));
    }
  } catch (e) {
    console.error(`Error loading existing translations for ${namespace}:`, e.message);
  }

  // Merge new translations (deep merge)
  function deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  enData = deepMerge(enData, translationsByFile[namespace].en);
  arData = deepMerge(arData, translationsByFile[namespace].ar);

  // Ensure directories exist
  const enDir = path.dirname(enPath);
  const arDir = path.dirname(arPath);
  if (!fs.existsSync(enDir)) fs.mkdirSync(enDir, { recursive: true });
  if (!fs.existsSync(arDir)) fs.mkdirSync(arDir, { recursive: true });

  // Write files
  fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n');
  fs.writeFileSync(arPath, JSON.stringify(arData, null, 2) + '\n');

  console.log(`✓ Updated ${namespace}`);
}

console.log('\n='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total calculators processed: ${batchData.batch.length}`);
console.log(`Translation files updated: ${updatedFiles.size}`);
console.log('\nUpdated files:');
for (const file of updatedFiles) {
  console.log(`  - ${file}`);
}
