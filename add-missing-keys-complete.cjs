#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Translations to add to specific files
const updates = {
  'public/locales/en/calc/pet.json': {
    cat_calorie_calculator: {
      error_invalid_weight: "Please enter a valid weight",
      results_title: "Daily Calorie Needs"
    },
    cat_food_calculator: {
      error_invalid_weight: "Please enter a valid weight",
      unit_kg: "kg",
      results_title: "Daily Food Amount",
      footer_note: "These are general guidelines. Consult your veterinarian for specific recommendations."
    },
    aquarium_calculator: {
      error_invalid_dimensions: "Please enter valid dimensions",
      footer_note: "These calculations are estimates. Actual requirements may vary based on fish species and setup."
    },
    "pet-medication-dosage-calculator": {
      error_invalid_weight: "Please enter a valid weight",
      error_invalid_dosage: "Please enter a valid dosage",
      error_invalid_frequency: "Please enter a valid frequency",
      administration_per_day: "times per day"
    }
  },
  'public/locales/ar/calc/pet.json': {
    cat_calorie_calculator: {
      error_invalid_weight: "الرجاء إدخال وزن صحيح",
      results_title: "احتياج السعرات اليومي"
    },
    cat_food_calculator: {
      error_invalid_weight: "الرجاء إدخال وزن صحيح",
      unit_kg: "كجم",
      results_title: "كمية الطعام اليومية",
      footer_note: "هذه إرشادات عامة. استشر الطبيب البيطري للحصول على توصيات محددة."
    },
    aquarium_calculator: {
      error_invalid_dimensions: "الرجاء إدخال أبعاد صحيحة",
      footer_note: "هذه الحسابات تقديرية. قد تختلف المتطلبات الفعلية بناءً على نوع الأسماك والإعداد."
    },
    "pet-medication-dosage-calculator": {
      error_invalid_weight: "الرجاء إدخال وزن صحيح",
      error_invalid_dosage: "الرجاء إدخال جرعة صحيحة",
      error_invalid_frequency: "الرجاء إدخال تكرار صحيح",
      administration_per_day: "مرات في اليوم"
    }
  },
  'public/locales/en/calc/real-estate.json': {
    home_affordability_calculator: {
      dti_ratio: "Debt-to-Income Ratio",
      tip_dti: "Aim for a DTI ratio below 43% for better loan approval chances",
      tip_down_payment: "A 20% down payment helps avoid private mortgage insurance (PMI)",
      tip_emergency: "Maintain an emergency fund covering 3-6 months of expenses",
      tip_costs: "Budget for property taxes, insurance, and maintenance costs",
      tip_pre_approval: "Get pre-approved for a mortgage before house hunting"
    },
    closing_cost_calculator: {
      invalid_input: "Invalid input. Please check your values.",
      calculation_error: "An error occurred during calculation"
    },
    cap_rate_calculator: {
      invalid_input: "Invalid input. Please check your values.",
      calculation_error: "An error occurred during calculation"
    },
    cost_per_square_foot_calculator: {
      enter_value_4: "Enter value"
    },
    home_maintenance_cost_calculator: {
      enter_value_4: "Enter value",
      calc_726: "Home Maintenance Cost Calculator"
    }
  },
  'public/locales/ar/calc/real-estate.json': {
    home_affordability_calculator: {
      dti_ratio: "نسبة الدين إلى الدخل",
      tip_dti: "استهدف نسبة الدين إلى الدخل أقل من 43% لفرص أفضل في الموافقة على القرض",
      tip_down_payment: "دفعة مقدمة بنسبة 20% تساعد على تجنب تأمين الرهن العقاري الخاص (PMI)",
      tip_emergency: "احتفظ بصندوق طوارئ يغطي 3-6 أشهر من النفقات",
      tip_costs: "ضع ميزانية للضرائب العقارية والتأمين وتكاليف الصيانة",
      tip_pre_approval: "احصل على موافقة مسبقة للرهن العقاري قبل البحث عن منزل"
    },
    closing_cost_calculator: {
      invalid_input: "مدخلات غير صحيحة. الرجاء التحقق من القيم.",
      calculation_error: "حدث خطأ أثناء الحساب"
    },
    cap_rate_calculator: {
      invalid_input: "مدخلات غير صحيحة. الرجاء التحقق من القيم.",
      calculation_error: "حدث خطأ أثناء الحساب"
    },
    cost_per_square_foot_calculator: {
      enter_value_4: "أدخل القيمة"
    },
    home_maintenance_cost_calculator: {
      enter_value_4: "أدخل القيمة",
      calc_726: "حاسبة تكلفة صيانة المنزل"
    }
  },
  'public/locales/en/calc/automotive.json': {
    fuel_consumption: {
      price_label: "Fuel Price per Liter/Gallon",
      price_tooltip: "Current fuel price in your area",
      price_placeholder: "e.g., 1.50"
    },
    wheel_offset: {
      mode_offset: "Calculate Offset",
      mode_backspacing: "Calculate Backspacing",
      placeholders: {
        wheel_width: "Enter wheel width"
      }
    }
  },
  'public/locales/ar/calc/automotive.json': {
    fuel_consumption: {
      price_label: "سعر الوقود لكل لتر/جالون",
      price_tooltip: "سعر الوقود الحالي في منطقتك",
      price_placeholder: "مثال: 1.50"
    },
    wheel_offset: {
      mode_offset: "حساب الإزاحة",
      mode_backspacing: "حساب المسافة الخلفية",
      placeholders: {
        wheel_width: "أدخل عرض العجلة"
      }
    }
  },
  'public/locales/en/calc/cooking.json': {
    "coffee-ratio-calculator": {
      coffeeTablespoons: "Coffee (Tablespoons)"
    }
  },
  'public/locales/ar/calc/cooking.json': {
    "coffee-ratio-calculator": {
      coffeeTablespoons: "القهوة (ملاعق كبيرة)"
    }
  },
  'public/locales/en/calc/date-time.json': {
    "coptic-to-gregorian": {
      tooltip_year: "Enter the Coptic year",
      tooltip_day: "Enter the day of the month",
      empty_state: "Select a date to see the conversion",
      footer_note: "The Coptic calendar is used by the Coptic Orthodox Church and has 13 months."
    }
  },
  'public/locales/ar/calc/date-time.json': {
    "coptic-to-gregorian": {
      tooltip_year: "أدخل السنة القبطية",
      tooltip_day: "أدخل يوم الشهر",
      empty_state: "اختر تاريخاً لرؤية التحويل",
      footer_note: "التقويم القبطي يستخدم من قبل الكنيسة القبطية الأرثوذكسية ويتكون من 13 شهراً."
    }
  },
  'public/locales/en/calc/agriculture.json': {
    fertilizer: {
      error_soil_negative: "Soil values cannot be negative",
      note_title: "Important Note",
      note_description: "These are general recommendations. Consult with agricultural experts for specific soil conditions."
    }
  },
  'public/locales/ar/calc/agriculture.json': {
    fertilizer: {
      error_soil_negative: "قيم التربة لا يمكن أن تكون سالبة",
      note_title: "ملاحظة مهمة",
      note_description: "هذه توصيات عامة. استشر خبراء زراعيين للحصول على توصيات خاصة بحالة تربتك."
    }
  },
  'public/locales/en/calc/physics.json': {
    force: {
      formulas: {
        newton_2: "F = ma",
        newton_2_desc: "Force equals mass times acceleration"
      }
    }
  },
  'public/locales/ar/calc/physics.json': {
    force: {
      formulas: {
        newton_2: "ق = ك × ت",
        newton_2_desc: "القوة تساوي الكتلة مضروبة في التسارع"
      }
    }
  },
  'public/locales/en/calc/environmental.json': {
    plastic_footprint: {
      note_space: " "
    },
    water_footprint: {
      sustainable_lifestyle: {
        options: {
          meat_heavy: "Meat-heavy diet"
        }
      },
      note_space: " "
    }
  },
  'public/locales/ar/calc/environmental.json': {
    plastic_footprint: {
      note_space: " "
    },
    water_footprint: {
      sustainable_lifestyle: {
        options: {
          meat_heavy: "نظام غذائي غني باللحوم"
        }
      },
      note_space: " "
    }
  },
  'public/locales/en/calc/finance.json': {
    investment: {
      errors: {
        invalid_input: "Invalid input. Please check your values."
      }
    },
    zakat: {
      inputs: {
        wealth_tooltip: "Total cash and savings held for one lunar year",
        gold_tooltip: "Weight of gold owned (in grams)",
        gold_price_tooltip: "Current market price per gram of 24K gold"
      }
    }
  },
  'public/locales/ar/calc/finance.json': {
    investment: {
      errors: {
        invalid_input: "مدخلات غير صحيحة. الرجاء التحقق من القيم."
      }
    },
    zakat: {
      inputs: {
        wealth_tooltip: "إجمالي النقد والمدخرات المحتفظ بها لمدة عام قمري واحد",
        gold_tooltip: "وزن الذهب المملوك (بالجرامات)",
        gold_price_tooltip: "سعر السوق الحالي للجرام من الذهب عيار 24"
      }
    }
  },
  'public/locales/en/calc/fitness.json': {
    swimming_pace: {
      tips_title: "Swimming Tips",
      tips_desc: "Maintain consistent pace, proper breathing, and efficient stroke technique for best results."
    },
    workout_volume: {
      empty_state: "Add exercises to calculate total workout volume",
      footer_note: "Track your volume over time to monitor progress and avoid overtraining."
    }
  },
  'public/locales/ar/calc/fitness.json': {
    swimming_pace: {
      tips_title: "نصائح للسباحة",
      tips_desc: "حافظ على وتيرة ثابتة، تنفس صحيح، وتقنية سباحة فعالة للحصول على أفضل النتائج."
    },
    workout_volume: {
      empty_state: "أضف تمارين لحساب حجم التمرين الإجمالي",
      footer_note: "تتبع حجم تدريبك مع مرور الوقت لمراقبة التقدم وتجنب الإفراط في التدريب."
    }
  },
  'public/locales/en/calc/health.json': {
    bmi: {
      errors: {
        empty_state: {
          title: "Calculate Your BMI",
          subtitle: "Enter your weight and height to get started"
        }
      }
    },
    pregnancy: {
      error: {
        calculationError: "An error occurred during calculation"
      }
    }
  },
  'public/locales/ar/calc/health.json': {
    bmi: {
      errors: {
        empty_state: {
          title: "احسب مؤشر كتلة الجسم",
          subtitle: "أدخل وزنك وطولك للبدء"
        }
      }
    },
    pregnancy: {
      error: {
        calculationError: "حدث خطأ أثناء الحساب"
      }
    }
  },
  'public/locales/en/calc/business.json': {
    break_even: {
      errors: {
        price_greater_than_variable: "Price must be greater than variable cost"
      }
    }
  },
  'public/locales/ar/calc/business.json': {
    break_even: {
      errors: {
        price_greater_than_variable: "يجب أن يكون السعر أكبر من التكلفة المتغيرة"
      }
    }
  }
};

// Function to deep merge objects
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

// Apply updates
let filesUpdated = 0;
Object.keys(updates).forEach(filePath => {
  const fullPath = path.join('/Users/raedtayyem/Desktop/work/alathasiba-claudecode', filePath);

  try {
    // Read existing file
    const existing = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

    // Merge new translations
    const updated = deepMerge(existing, updates[filePath]);

    // Write back
    fs.writeFileSync(fullPath, JSON.stringify(updated, null, 2) + '\n');

    filesUpdated++;
    console.log(`✓ Updated: ${filePath}`);
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message);
  }
});

console.log(`\n✓ Successfully updated ${filesUpdated} files`);
console.log('\nNote: Most missing translations were common:units references already handled in common.json');
