import { Calculator } from './types';

/**
 * Science Calculators (5 calculators)
 * Comprehensive scientific calculation tools for chemistry, physics, biology
 */
const scienceCalculators: Calculator[] = [
  {
    id: 2100,
    nameKey: "calc/science:density.title",
    name: 'حاسبة الكثافة',
    nameEn: 'Density Calculator',
    descriptionKey: "calc/science:density.description",
    description: 'احسب الكثافة أو الكتلة أو الحجم',
    descriptionEn: 'Calculate density, mass, or volume given the other two variables.',
    category: 'science',
    slug: 'density-calculator',
    icon: '🧊',
    keywords: ['density', 'mass', 'volume', 'physics', 'chemistry'],
    componentName: 'DensityCalculator',
    popularity: 8
  },
  {
    id: 2101,
    nameKey: "calc/science:molar-mass.title",
    name: 'حاسبة الكتلة المولية',
    nameEn: 'Molar Mass Calculator',
    descriptionKey: "calc/science:molar-mass.description",
    description: 'احسب الكتلة المولية للمركبات الكيميائية',
    descriptionEn: 'Calculate the molar mass of chemical compounds based on their formula.',
    category: 'science',
    slug: 'molar-mass-calculator',
    icon: '⚗️',
    keywords: ['molar mass', 'chemistry', 'molecules', 'compounds'],
    componentName: 'MolarMassCalculator',
    popularity: 9
  },
  {
    id: 2102,
    nameKey: "calc/science:ph-calculator.title",
    name: 'حاسبة الرقم الهيدروجيني (pH)',
    nameEn: 'pH Calculator',
    descriptionKey: "calc/science:ph-calculator.description",
    description: 'احسب قيمة pH و pOH وتركيز أيونات الهيدروجين',
    descriptionEn: 'Calculate pH, pOH, and hydrogen ion concentration.',
    category: 'science',
    slug: 'ph-calculator',
    icon: '🧪',
    keywords: ['ph', 'acidity', 'chemistry', 'acid', 'base'],
    componentName: 'PHCalculator',
    popularity: 7
  },
  {
    id: 2103,
    nameKey: "calc/science:half-life.title",
    name: 'حاسبة نصف العمر',
    nameEn: 'Half Life Calculator',
    descriptionKey: "calc/science:half-life.description",
    description: 'احسب التحلل الإشعاعي ونصف العمر',
    descriptionEn: 'Calculate radioactive decay and half-life of substances.',
    category: 'science',
    slug: 'half-life-calculator',
    icon: '☢️',
    keywords: ['half life', 'decay', 'radiation', 'physics'],
    componentName: 'HalfLifeCalculator',
    popularity: 6
  },
  {
    id: 2104,
    nameKey: "calc/science:boyles-law.title",
    name: 'حاسبة قانون بويل',
    nameEn: 'Boyle\'s Law Calculator',
    descriptionKey: "calc/science:boyles-law.description",
    description: 'حساب العلاقة بين ضغط الغاز وحجمه',
    descriptionEn: 'Calculate the relationship between pressure and volume of a gas at constant temperature.',
    category: 'science',
    slug: 'boyles-law-calculator',
    icon: '🎈',
    keywords: ['gas', 'pressure', 'volume', 'boyle', 'law'],
    componentName: 'BoylesLawCalculator',
    popularity: 5
  }
];

export default scienceCalculators;
