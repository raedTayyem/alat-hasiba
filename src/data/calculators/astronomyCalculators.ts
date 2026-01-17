import { Calculator } from './types';

/**
 * Astronomy & Space Calculators (5 calculators)
 * Comprehensive astronomy and space exploration calculation tools
 */
const astronomyCalculators: Calculator[] = [
  {
    id: 3100,
    nameKey: "calc/astronomy:weight-on-planets.title",
    name: 'حاسبة الوزن على الكواكب',
    nameEn: 'Weight on Planets Calculator',
    descriptionKey: "calc/astronomy:weight-on-planets.description",
    description: 'احسب وزنك على كواكب المجموعة الشمسية المختلفة',
    descriptionEn: 'Calculate your weight on different planets in the solar system.',
    category: 'astronomy',
    slug: 'weight-on-planets-calculator',
    icon: '🪐',
    keywords: ['weight', 'planets', 'gravity', 'solar system'],
    componentName: 'WeightOnPlanetsCalculator',
    popularity: 5
  },
  {
    id: 3101,
    nameKey: "calc/astronomy:age-on-planets.title",
    name: 'حاسبة العمر على الكواكب',
    nameEn: 'Age on Planets Calculator',
    descriptionKey: "calc/astronomy:age-on-planets.description",
    description: 'احسب عمرك بالسنوات الكوكبية',
    descriptionEn: 'Calculate your age in planetary years based on orbital periods.',
    category: 'astronomy',
    slug: 'age-on-planets-calculator',
    icon: '⏳',
    keywords: ['age', 'planets', 'orbit', 'years'],
    componentName: 'AgeOnPlanetsCalculator',
    popularity: 4
  },
  {
    id: 3102,
    nameKey: "calc/astronomy:light-year-converter.title",
    name: 'محول السنوات الضوئية',
    nameEn: 'Light Year Converter',
    descriptionKey: "calc/astronomy:light-year-converter.description",
    description: 'تحويل المسافات بين السنوات الضوئية والوحدات الأخرى',
    descriptionEn: 'Convert distances between light years, kilometers, and miles.',
    category: 'astronomy',
    slug: 'light-year-converter',
    icon: '🌠',
    keywords: ['light year', 'distance', 'space', 'converter'],
    componentName: 'LightYearConverter',
    popularity: 6
  },
  {
    id: 3103,
    nameKey: "calc/astronomy:telescope-magnification.title",
    name: 'حاسبة تكبير التلسكوب',
    nameEn: 'Telescope Magnification Calculator',
    descriptionKey: "calc/astronomy:telescope-magnification.description",
    description: 'احسب قوة تكبير التلسكوب بناءً على العدسات',
    descriptionEn: 'Calculate telescope magnification power based on focal lengths.',
    category: 'astronomy',
    slug: 'telescope-magnification-calculator',
    icon: '🔭',
    keywords: ['telescope', 'magnification', 'lens', 'optics'],
    componentName: 'TelescopeMagnificationCalculator',
    popularity: 3
  },
  {
    id: 3104,
    nameKey: "calc/astronomy:star-distance.title",
    name: 'حاسبة مسافة النجوم',
    nameEn: 'Star Distance Calculator',
    descriptionKey: "calc/astronomy:star-distance.description",
    description: 'تقدير بعد النجوم باستخدام زاوية الاختلاف',
    descriptionEn: 'Estimate star distance using parallax angle.',
    category: 'astronomy',
    slug: 'star-distance-calculator',
    icon: '⭐',
    keywords: ['star', 'distance', 'parallax', 'astronomy'],
    componentName: 'StarDistanceCalculator',
    popularity: 4
  }
];

export default astronomyCalculators;
