import { Calculator } from './types';

/**
 * Agriculture & Farming Calculators (25 calculators)
 * Comprehensive agricultural and farming calculation tools
 */
const agricultureCalculators: Calculator[] = [
  // Crop Calculations
  {
    id: 2000,
    nameKey: "calc/agriculture:seed-rate-calculator.title",
    name: 'حاسبة معدل البذور',
    nameEn: 'Seed Rate Calculator',
    descriptionKey: "calc/agriculture:seed-rate-calculator.description",
    description: 'احسب كمية البذور المطلوبة للفدان أو الدونم',
    descriptionEn: 'Calculate seed quantity required per acre or hectare',
    category: 'agriculture',
    slug: 'seed-rate-calculator',
    icon: '🌱',
    keywords: ['بذور', 'زراعة', 'فدان', 'seed', 'planting'],
    relatedCalculators: ['fertilizer-calculator', 'irrigation-calculator'],
    componentName: 'SeedRateCalculator'
  },
  {
    id: 2001,
    nameKey: "calc/agriculture:fertilizer-calculator.title",
    name: 'حاسبة الأسمدة',
    nameEn: 'Fertilizer Calculator',
    descriptionKey: "calc/agriculture:fertilizer-calculator.description",
    description: 'احسب كمية السماد المطلوبة حسب نوع المحصول والمساحة',
    descriptionEn: 'Calculate fertilizer quantity based on crop type and area',
    category: 'agriculture',
    slug: 'fertilizer-calculator',
    icon: '🧪',
    keywords: ['سماد', 'تسميد', 'محصول', 'fertilizer', 'npk'],
    relatedCalculators: ['seed-rate-calculator', 'soil-ph-calculator'],
    componentName: 'FertilizerCalculator'
  },
  {
    id: 2002,
    nameKey: "calc/agriculture:irrigation-calculator.title",
    name: 'حاسبة الري',
    nameEn: 'Irrigation Calculator',
    descriptionKey: "calc/agriculture:irrigation-calculator.description",
    description: 'احسب كمية المياه المطلوبة للري',
    descriptionEn: 'Calculate water requirements for irrigation',
    category: 'agriculture',
    slug: 'irrigation-calculator',
    icon: '💧',
    keywords: ['ري', 'مياه', 'irrigation', 'water'],
    relatedCalculators: ['crop-yield-calculator', 'rainfall-calculator'],
    componentName: 'IrrigationCalculator'
  },
  // Livestock
  {
    id: 2006,
    nameKey: "calc/agriculture:milk-production-calculator.title",
    name: 'حاسبة إنتاج الحليب',
    nameEn: 'Milk Production Calculator',
    descriptionKey: "calc/agriculture:milk-production-calculator.description",
    description: 'احسب إنتاج الحليب المتوقع',
    descriptionEn: 'Calculate expected milk production',
    category: 'agriculture',
    slug: 'milk-production-calculator',
    icon: '🥛',
    keywords: ['حليب', 'إنتاج', 'milk', 'dairy'],
    relatedCalculators: ['feed-ration-calculator', 'dairy-profit-calculator'],
    componentName: 'MilkProductionCalculator'
  },
  {
    id: 2009,
    nameKey: "calc/agriculture:egg-production-calculator.title",
    name: 'حاسبة إنتاج البيض',
    nameEn: 'Egg Production Calculator',
    descriptionKey: "calc/agriculture:egg-production-calculator.description",
    description: 'احسب إنتاج البيض المتوقع',
    descriptionEn: 'Calculate expected egg production',
    category: 'agriculture',
    slug: 'egg-production-calculator',
    icon: '🥚',
    keywords: ['بيض', 'دجاج', 'egg', 'poultry'],
    relatedCalculators: ['poultry-feed-calculator', 'broiler-growth-calculator'],
    componentName: 'EggProductionCalculator'
  },

  // Farm Management
  /*
    {
      id: 2010,
      name: 'حاسبة ربح المزرعة',
      nameEn: 'Farm Profit Calculator',
      description: 'احسب الربح والعائد من المزرعة',
      descriptionEn: 'Calculate farm profit and ROI',
      category: 'agriculture',
      slug: 'farm-profit-calculator',
      icon: '💰',
      keywords: ['ربح', 'مزرعة', 'profit', 'farm'],
      relatedCalculators: ['crop-yield-calculator', 'operating-cost-calculator'],
      componentName: 'FarmProfitCalculator'
    },
    */
  {
    id: 2011,
    nameKey: "calc/agriculture:pesticide-calculator.title",
    name: 'حاسبة المبيدات',
    nameEn: 'Pesticide Calculator',
    descriptionKey: "calc/agriculture:pesticide-calculator.description",
    description: 'احسب كمية المبيد المطلوبة للرش',
    descriptionEn: 'Calculate pesticide quantity for spraying',
    category: 'agriculture',
    slug: 'pesticide-calculator',
    icon: '🚜',
    keywords: ['مبيد', 'رش', 'pesticide', 'spray'],
    relatedCalculators: ['spray-volume-calculator', 'crop-protection-calculator'],
    componentName: 'PesticideCalculator'
  },
  {
    id: 2013,
    nameKey: "calc/agriculture:compost-calculator.title",
    name: 'حاسبة السماد العضوي',
    nameEn: 'Compost Calculator',
    descriptionKey: "calc/agriculture:compost-calculator.description",
    description: 'احسب نسب مكونات السماد العضوي',
    descriptionEn: 'Calculate compost ingredient ratios',
    category: 'agriculture',
    slug: 'compost-calculator',
    icon: '♻️',
    keywords: ['سماد عضوي', 'كومبوست', 'compost', 'organic'],
    relatedCalculators: ['fertilizer-calculator', 'organic-matter-calculator'],
    componentName: 'CompostCalculator'
  },
  {
    id: 2014,
    nameKey: "calc/agriculture:greenhouse-calculator.title",
    name: 'حاسبة الصوبة الزراعية',
    nameEn: 'Greenhouse Calculator',
    descriptionKey: "calc/agriculture:greenhouse-calculator.description",
    description: 'احسب مواصفات وتكاليف الصوبة',
    descriptionEn: 'Calculate greenhouse specifications and costs',
    category: 'agriculture',
    slug: 'greenhouse-calculator',
    icon: '🏠',
    keywords: ['صوبة', 'بيت محمي', 'greenhouse'],
    relatedCalculators: ['heating-cost-calculator', 'ventilation-calculator'],
    componentName: 'GreenhouseCalculator'
  },
  {
    id: 2020,
    nameKey: "calc/agriculture:tractor-fuel-calculator.title",
    name: 'حاسبة وقود الجرار',
    nameEn: 'Tractor Fuel Calculator',
    descriptionKey: "calc/agriculture:tractor-fuel-calculator.description",
    description: 'احسب استهلاك الوقود للجرار الزراعي',
    descriptionEn: 'Calculate tractor fuel consumption',
    category: 'agriculture',
    slug: 'tractor-fuel-calculator',
    icon: '🚜',
    keywords: ['جرار', 'وقود', 'tractor', 'fuel'],
    relatedCalculators: ['farm-equipment-cost', 'operating-cost-calculator'],
    componentName: 'TractorFuelCalculator'
  },
];

export default agricultureCalculators;
