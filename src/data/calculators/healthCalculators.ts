import { Calculator } from './types';

// Health Calculators
const healthCalculators: Calculator[] = [
  {
    id: 22,
    nameKey: "calc/health:bmi-calculator.title", name: 'حاسبة مؤشر كتلة الجسم',
    nameEn: 'BMI Calculator - Body Mass Index Calculator Online',
    slug: 'bmi-calculator',
    descriptionKey: "calc/health:bmi-calculator.description", description: 'احسب مؤشر كتلة الجسم لمعرفة ما إذا كان وزنك صحياً',
    descriptionEn: 'Calculate your Body Mass Index (BMI) online to determine if your weight is healthy. Free BMI calculator with detailed charts and health recommendations. Essential tool for weight management and fitness tracking.',
    category: 'health',
    icon: '⚖️',
    popularity: 10,
    componentName: 'BMICalculator'
  },
  {
    id: 23,
    nameKey: "calc/health:calorie-calculator.title", name: 'حاسبة السعرات الحرارية',
    nameEn: 'Calorie Calculator - Daily Calorie Needs Calculator',
    slug: 'calorie-calculator',
    descriptionKey: "calc/health:calorie-calculator.description", description: 'احسب احتياجاتك اليومية من السعرات الحرارية بناءً على نشاطك',
    descriptionEn: 'Calculate your daily calorie needs based on activity level, age, weight, and goals. Free calorie calculator for weight loss, maintenance, or muscle gain. Plan your nutrition effectively.',
    category: 'health',
    icon: '🍎',
    popularity: 9,
    componentName: 'CalorieCalculator'
  },
  {
    id: 161,
    nameKey: "calc/health:ideal-weight-calculator.title", name: 'حاسبة الوزن المثالي',
    nameEn: 'Ideal Weight Calculator - Calculate Your Healthy Weight',
    slug: 'ideal-weight-calculator',
    descriptionKey: "calc/health:ideal-weight-calculator.description", description: 'حساب الوزن المثالي بناءً على الطول والعمر والجنس',
    descriptionEn: 'Calculate your ideal weight based on height, age, and gender. Free ideal weight calculator using multiple formulas. Set realistic weight loss or gain goals.',
    category: 'health',
    icon: '🏋️',
    popularity: 8,
    componentName: 'IdealWeightCalculator'
  },
  {
    id: 162,
    nameKey: "calc/health:body-fat-calculator.title", name: 'حاسبة نسبة الدهون',
    nameEn: 'Body Fat Calculator - Calculate Body Fat Percentage',
    slug: 'body-fat-calculator',
    descriptionKey: "calc/health:body-fat-calculator.description", description: 'حساب نسبة الدهون في الجسم',
    descriptionEn: 'Calculate your body fat percentage using various measurement methods. Free body fat calculator for accurate fitness assessment. Track your body composition and health progress.',
    category: 'health',
    icon: '📏',
    popularity: 7,
    componentName: 'BodyFatCalculator'
  },
  {
    id: 165,
    nameKey: "calc/health:pregnancy-calculator.title", name: 'حاسبة الحمل',
    nameEn: 'Pregnancy Calculator - Due Date and Week Calculator',
    slug: 'pregnancy-calculator',
    descriptionKey: "calc/health:pregnancy-calculator.description", description: 'حساب موعد الولادة وأسابيع الحمل',
    descriptionEn: 'Calculate your due date and pregnancy weeks online. Free pregnancy calculator with trimester breakdown and fetal development milestones. Essential tool for expecting mothers.',
    category: 'health',
    icon: '👶',
    popularity: 8,
    componentName: 'PregnancyCalculator'
  },
  {
    id: 166,
    nameKey: "calc/health:protein-calculator.title", name: 'حاسبة احتياجات البروتين',
    nameEn: 'Protein Calculator - Daily Protein Intake Calculator',
    slug: 'protein-calculator',
    descriptionKey: "calc/health:protein-calculator.description", description: 'حساب احتياجك اليومي من البروتين بناءً على وزنك ونشاطك وأهدافك',
    descriptionEn: 'Calculate your daily protein needs based on weight, activity level, and fitness goals. Free protein calculator for muscle building, weight loss, or maintenance. Optimize your nutrition plan.',
    category: 'health',
    icon: '🥩',
    popularity: 9,
    componentName: 'ProteinCalculator'
  },
  {
    id: 167,
    nameKey: "calc/health:water-intake-calculator.title", name: 'حاسبة احتياجات الماء',
    nameEn: 'Water Intake Calculator - Daily Hydration Calculator',
    slug: 'water-intake-calculator',
    descriptionKey: "calc/health:water-intake-calculator.description", description: 'حساب احتياجك اليومي من الماء بناءً على وزنك ونشاطك',
    descriptionEn: 'Calculate your daily water intake needs based on weight and activity level. Free hydration calculator to ensure optimal water consumption. Stay healthy and properly hydrated.',
    category: 'health',
    icon: '💧',
    popularity: 8,
    componentName: 'WaterIntakeCalculator'
  },
];

export default healthCalculators;
