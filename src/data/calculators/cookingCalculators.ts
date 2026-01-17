import { Calculator } from './types';

/**
 * Cooking & Nutrition Calculators (35 calculators)
 * Comprehensive cooking, recipe, and nutrition calculation tools
 */

const cookingCalculators: Calculator[] = [
  // Recipe Conversion
  {
    id: 2503,
    name: 'حاسبة تحويل الخبز',
    nameEn: 'Baking Conversion Calculator',
    nameKey: 'calc/cooking:baking-conversion.title',
    slug: 'baking-conversion',
    description: 'تحويل بين وحدات القياس للمخبوزات',
    descriptionEn: 'Convert between cups, grams, and ounces for common baking ingredients.',
    descriptionKey: 'calc/cooking:baking-conversion.description',
    category: 'cooking',
    icon: '🥖',
    componentName: 'BakingConversionCalculator',
    popularity: 95
  },
  {
    id: 2505,
    name: 'محول درجة حرارة الفرن',
    nameEn: 'Oven Temperature Converter',
    nameKey: 'calc/cooking:oven-temperature-converter.title',
    slug: 'oven-temperature-converter',
    description: 'تحويل بين درجات حرارة الفرن المختلفة',
    descriptionEn: 'Convert between Celsius, Fahrenheit, and Gas Mark.',
    descriptionKey: 'calc/cooking:oven-temperature-converter.description',
    category: 'cooking',
    icon: '🌡️',
    componentName: 'OvenTemperatureConverter',
    popularity: 91
  },
  {
    id: 2506,
    name: 'حاسبة وقت الطهي',
    nameEn: 'Cooking Time Calculator',
    nameKey: 'calc/cooking:cooking-time.title',
    slug: 'cooking-time',
    description: 'حساب أوقات الطهي بناءً على الوزن ونوع اللحم',
    descriptionEn: 'Calculate cooking times based on weight, meat type, and cooking method.',
    descriptionKey: 'calc/cooking:cooking-time.description',
    category: 'cooking',
    icon: '⏱️',
    componentName: 'CookingTimeCalculator',
    popularity: 90
  },
  {
    id: 2507,
    nameKey: "calc/cooking:turkey-cooking-calculator.title", name: 'حاسبة طهي الديك الرومي',
    nameEn: 'Turkey Cooking Calculator - Free Roasting Time Tool',
    descriptionKey: "calc/cooking:turkey-cooking-calculator.description", description: 'احسب وقت شواء الديك الرومي',
    descriptionEn: 'Calculate perfect turkey roasting time and temperature. Free online calculator for Thanksgiving and holiday meal planning.',
    slug: 'turkey-cooking-calculator',
    category: 'cooking',
    icon: '🦃',
    componentName: 'TurkeyCookingCalculator',
    popularity: 78
  },
  {
    id: 2509,
    nameKey: "calc/cooking:pasta-cooking-calculator.title", name: 'حاسبة طهي المعكرونة',
    nameEn: 'Pasta Cooking Calculator - Free Serving Size Tool',
    descriptionKey: "calc/cooking:pasta-cooking-calculator.description", description: 'احسب كمية ووقت طهي المعكرونة',
    descriptionEn: 'Calculate pasta quantity and cooking time per person. Free online calculator for perfect spaghetti, penne, and all pasta types.',
    slug: 'pasta-cooking-calculator',
    category: 'cooking',
    icon: '🍝',
    componentName: 'PastaCookingCalculator',
    popularity: 84
  },
  {
    id: 2511,
    nameKey: "calc/cooking:cake-serving-calculator.title", name: 'حاسبة حجم الكيك',
    nameEn: 'Cake Serving Calculator - Free Party Planning Tool',
    descriptionKey: "calc/cooking:cake-serving-calculator.description", description: 'احسب حجم الكيك المطلوب حسب عدد الضيوف',
    descriptionEn: 'Calculate cake size needed for your guests. Free calculator determines perfect cake portions for weddings, birthdays, and events.',
    slug: 'cake-serving-calculator',
    category: 'cooking',
    icon: '🎂',
    componentName: 'CakeServingCalculator',
    popularity: 86
  },
  {
    id: 2520,
    nameKey: "calc/cooking:coffee-ratio-calculator.title", name: 'حاسبة نسبة القهوة',
    nameEn: 'Coffee Ratio Calculator - Free Brewing Guide Tool',
    descriptionKey: "calc/cooking:coffee-ratio-calculator.description", description: 'احسب نسبة القهوة للماء المثالية',
    descriptionEn: 'Calculate perfect coffee to water ratio for brewing. Free online calculator for espresso, pour over, French press, and more.',
    slug: 'coffee-ratio-calculator',
    category: 'cooking',
    icon: '☕',
    componentName: 'CoffeeRatioCalculator',
    popularity: 87
  },
  {
    id: 2521,
    nameKey: "calc/cooking:rice-calculator.title", name: 'حاسبة الأرز والماء',
    nameEn: 'Rice to Water Ratio Calculator',
    descriptionKey: "calc/cooking:rice-calculator.description", description: 'احسب كمية الماء المناسبة لطهي الأرز',
    descriptionEn: 'Calculate the perfect amount of water for different types of rice. Free online cooking tool for fluffy rice every time.',
    slug: 'rice-water-ratio-calculator',
    category: 'cooking',
    icon: '🍚',
    componentName: 'RiceWaterRatioCalculator',
    popularity: 88
  },
  {
    id: 2530,
    nameKey: "calc/cooking:rice-cooking-calculator.title", name: 'حاسبة طهي الأرز',
    nameEn: 'Rice Cooking Calculator - Free Water Ratio Timer Tool',
    descriptionKey: "calc/cooking:rice-cooking-calculator.description", description: 'احسب نسبة الماء للأرز ووقت الطهي',
    descriptionEn: 'Calculate perfect rice to water ratio and cooking time. Free calculator for white, brown, basmati, jasmine, and all rice types.',
    slug: 'rice-cooking-calculator',
    category: 'cooking',
    icon: '🍚',
    componentName: 'RiceCookingCalculator',
    popularity: 89
  },
  {
    id: 2531,
    nameKey: "calc/cooking:pizza-dough-calculator.title", name: 'حاسبة عجينة البيتزا',
    nameEn: 'Pizza Dough Calculator - Free Recipe Ingredient Tool',
    descriptionKey: "calc/cooking:pizza-dough-calculator.description", description: 'احسب مكونات عجينة البيتزا',
    descriptionEn: 'Calculate pizza dough ingredients for any number of pizzas. Free calculator with flour, yeast, water, and salt measurements.',
    slug: 'pizza-dough-calculator',
    category: 'cooking',
    icon: '🍕',
    componentName: 'PizzaDoughCalculator',
    popularity: 88
  }
];

export default cookingCalculators;
