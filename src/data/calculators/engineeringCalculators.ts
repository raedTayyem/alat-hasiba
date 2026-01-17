import { Calculator } from './types';

// Engineering Calculators
const engineeringCalculators: Calculator[] = [
  {
    id: 908,
    name: 'حاسبة المقاومة الكهربائية',
    nameEn: 'Electrical Resistance Calculator - Ohms Law Calculator',
    nameKey: 'calc/engineering:electrical-resistance.title',
    slug: 'electrical-resistance-calculator',
    description: 'حساب المقاومة الكهربائية وفق قانون أوم',
    descriptionEn: 'Calculate electrical resistance using Ohm\'s law online. Free resistance calculator for voltage, current, and resistance calculations. Essential for electrical engineering and electronics.',
    descriptionKey: 'calc/engineering:electrical-resistance.description',
    category: 'engineering',
    icon: '⚡',
    popularity: 7,
    componentName: 'ElectricalResistanceCalculator'
  },
  {
    id: 909,
    name: 'حاسبة تحويل المواد',
    nameEn: 'Material Conversion Calculator - Engineering Units Converter',
    nameKey: 'calc/engineering:material-conversion.title',
    slug: 'material-conversion-calculator',
    description: 'تحويل الوحدات والكميات للمواد الهندسية',
    descriptionEn: 'Convert units and quantities for engineering materials online. Free material conversion calculator for construction, manufacturing, and engineering projects.',
    descriptionKey: 'calc/engineering:material-conversion.description',
    category: 'engineering',
    icon: '🧱',
    popularity: 5,
    componentName: 'MaterialConversionCalculator'
  },
  {
    id: 403,
    name: 'حاسبة الخرسانة',
    nameEn: 'Concrete Calculator - Calculate Concrete Mix and Quantity',
    slug: 'concrete-calculator',
    description: 'حساب كميات الخرسانة ومكوناتها',
    descriptionEn: 'Calculate concrete quantities and mix components for construction projects. Free concrete calculator for cement, sand, gravel, and water ratios. Perfect for builders and contractors.',
    category: 'engineering',
    icon: '🏗️',
    popularity: 7,
    componentName: 'ConcreteCalculator'
  },
  {
    id: 11003,
    name: 'Stress and Strain Calculator',
    nameEn: 'Stress and Strain Calculator',
    nameKey: 'calc/engineering:stress_strain.title',
    slug: 'stress-strain-calculator',
    description: 'Calculate stress, strain, and Young\'s modulus for materials.',
    descriptionEn: 'Calculate stress, strain, and Young\'s modulus for materials.',
    descriptionKey: 'calc/engineering:stress_strain.description',
    category: 'engineering',
    icon: '🏗️',
    popularity: 5,
    componentName: 'StressStrainCalculator'
  },
  {
    id: 11004,
    name: 'Hydraulic Cylinder Calculator',
    nameEn: 'Hydraulic Cylinder Calculator',
    nameKey: 'calc/engineering:hydraulic_cylinder.title',
    slug: 'hydraulic-cylinder-calculator',
    description: 'Calculate force, pressure, and area for hydraulic cylinders.',
    descriptionEn: 'Calculate force, pressure, and area for hydraulic cylinders.',
    descriptionKey: 'calc/engineering:hydraulic_cylinder.description',
    category: 'engineering',
    icon: '🔧',
    popularity: 4,
    componentName: 'HydraulicCylinderCalculator'
  }
];

export default engineeringCalculators;
