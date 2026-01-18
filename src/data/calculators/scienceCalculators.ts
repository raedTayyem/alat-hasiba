import { Calculator } from './types';

/**
 * Science Calculators (5 calculators)
 * Comprehensive scientific calculation tools for chemistry, physics, biology
 */
const scienceCalculators: Calculator[] = [
  {
    id: 2100,
    name: 'حاسبة الكثافة',
    nameEn: 'Density Calculator',
    nameKey: 'calc/science:density.title',
    description: 'احسب الكثافة أو الكتلة أو الحجم',
    descriptionEn: 'Calculate density, mass, or volume given the other two variables.',
    descriptionKey: 'calc/science:density.description',
    category: 'science',
    slug: 'density-calculator',
    icon: '🧊',
    popularity: 7,
    keywords: ['density', 'mass', 'volume', 'physics', 'chemistry', 'كثافة', 'كتلة', 'حجم', 'فيزياء'],
    relatedCalculators: ['molar-mass-calculator', 'boyles-law-calculator', 'half-life-calculator'],
    componentName: 'DensityCalculator'
  },
  {
    id: 2101,
    name: 'حاسبة الكتلة المولية',
    nameEn: 'Molar Mass Calculator',
    nameKey: 'calc/science:molar-mass.title',
    description: 'احسب الكتلة المولية للمركبات الكيميائية',
    descriptionEn: 'Calculate the molar mass of chemical compounds based on their formula.',
    descriptionKey: 'calc/science:molar-mass.description',
    category: 'science',
    slug: 'molar-mass-calculator',
    icon: '⚗️',
    popularity: 8,
    keywords: ['molar mass', 'chemistry', 'molecules', 'compounds', 'كتلة مولية', 'كيمياء', 'جزيئات', 'مركبات'],
    relatedCalculators: ['ph-calculator', 'density-calculator', 'half-life-calculator'],
    componentName: 'MolarMassCalculator'
  },
  {
    id: 2102,
    name: 'حاسبة الرقم الهيدروجيني (pH)',
    nameEn: 'pH Calculator',
    nameKey: 'calc/science:ph-calculator.title',
    description: 'احسب قيمة pH و pOH وتركيز أيونات الهيدروجين',
    descriptionEn: 'Calculate pH, pOH, and hydrogen ion concentration.',
    descriptionKey: 'calc/science:ph-calculator.description',
    category: 'science',
    slug: 'ph-calculator',
    icon: '🧪',
    popularity: 8,
    keywords: ['ph', 'acidity', 'chemistry', 'acid', 'base', 'حموضة', 'قلوية', 'كيمياء', 'أحماض'],
    relatedCalculators: ['molar-mass-calculator', 'density-calculator', 'boyles-law-calculator'],
    componentName: 'PHCalculator'
  },
  {
    id: 2103,
    name: 'حاسبة نصف العمر',
    nameEn: 'Half Life Calculator',
    nameKey: 'calc/science:half-life.title',
    description: 'احسب التحلل الإشعاعي ونصف العمر',
    descriptionEn: 'Calculate radioactive decay and half-life of substances.',
    descriptionKey: 'calc/science:half-life.description',
    category: 'science',
    slug: 'half-life-calculator',
    icon: '☢️',
    popularity: 6,
    keywords: ['half life', 'decay', 'radiation', 'physics', 'نصف عمر', 'تحلل', 'إشعاع', 'فيزياء نووية'],
    relatedCalculators: ['density-calculator', 'molar-mass-calculator', 'boyles-law-calculator'],
    componentName: 'HalfLifeCalculator'
  },
  {
    id: 2104,
    name: 'حاسبة قانون بويل',
    nameEn: 'Boyle\'s Law Calculator',
    nameKey: 'calc/science:boyles-law.title',
    description: 'حساب العلاقة بين ضغط الغاز وحجمه',
    descriptionEn: 'Calculate the relationship between pressure and volume of a gas at constant temperature.',
    descriptionKey: 'calc/science:boyles-law.description',
    category: 'science',
    slug: 'boyles-law-calculator',
    icon: '🎈',
    popularity: 7,
    keywords: ['gas', 'pressure', 'volume', 'boyle', 'law', 'غاز', 'ضغط', 'حجم', 'قانون بويل', 'فيزياء'],
    relatedCalculators: ['density-calculator', 'ph-calculator', 'molar-mass-calculator'],
    componentName: 'BoylesLawCalculator'
  }
];

export default scienceCalculators;
