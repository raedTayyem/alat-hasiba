import { Calculator } from './types';

// Physics Calculators
const physicsCalculators: Calculator[] = [
  {
    id: 906,
    name: 'حاسبة الحركة الدورانية',
    nameEn: 'Rotational Motion Calculator - Angular Velocity and Acceleration',
    nameKey: 'calc/physics:rotational_motion.title',
    slug: 'rotational-motion-calculator',
    description: 'حساب متغيرات الحركة الدورانية',
    descriptionEn: 'Calculate rotational motion variables including angular velocity, angular acceleration, and torque. Free online calculator for physics students studying circular motion and rotation dynamics.',
    descriptionKey: 'calc/physics:rotational_motion.description',
    category: 'physics',
    icon: '⚙️',
    popularity: 5,
    componentName: 'RotationalMotionCalculator'
  },
  {
    id: 907,
    name: 'حاسبة قوانين نيوتن',
    nameEn: 'Newton Laws Calculator - Force Mass Acceleration',
    nameKey: 'calc/physics:newton_laws.title',
    slug: 'newton-laws-calculator',
    description: 'تطبيقات على قوانين نيوتن للحركة',
    descriptionEn: 'Apply Newton\'s laws of motion to calculate force, mass, and acceleration. Free physics calculator for understanding F=ma and Newton\'s three laws. Perfect for mechanics and dynamics problems.',
    descriptionKey: 'calc/physics:newton_laws.description',
    category: 'physics',
    icon: '🍎',
    popularity: 6,
    componentName: 'NewtonLawsCalculator'
  },
  {
    id: 141,
    name: 'حاسبة السرعة والتسارع',
    nameEn: 'Velocity and Acceleration Calculator - Motion Physics',
    nameKey: 'calc/physics:velocity_acceleration.title',
    slug: 'velocity-acceleration-calculator',
    description: 'حساب السرعة والتسارع والمسافة والزمن',
    descriptionEn: 'Calculate velocity, acceleration, distance, and time for motion problems. Free kinematics calculator for physics students. Solve linear motion equations quickly and accurately.',
    descriptionKey: 'calc/physics:velocity_acceleration.description',
    category: 'physics',
    icon: '🚀',
    popularity: 7,
    componentName: 'VelocityAccelerationCalculator'
  },

  {
    id: 145,
    name: 'حاسبة التسارع',
    nameEn: 'Acceleration Calculator',
    nameKey: 'calc/physics:acceleration.title',
    slug: 'acceleration-calculator',
    description: 'حساب التسارع بناءً على السرعة والزمن',
    descriptionEn: 'Calculate acceleration based on change in velocity and time.',
    descriptionKey: 'calc/physics:acceleration.description',
    category: 'physics',
    icon: '🏎️',
    popularity: 6,
    componentName: 'AccelerationCalculator'
  },
  {
    id: 146,
    name: 'حاسبة القوة',
    nameEn: 'Force Calculator',
    nameKey: 'calc/physics:force.title',
    slug: 'force-calculator',
    description: 'حساب القوة والكتلة والتسارع (قانون نيوتن الثاني)',
    descriptionEn: 'Calculate force, mass, and acceleration using Newton\'s second law.',
    descriptionKey: 'calc/physics:force.description',
    category: 'physics',
    icon: '💪',
    popularity: 7,
    componentName: 'ForceCalculator'
  },
  {
    id: 147,
    name: 'حاسبة الزخم',
    nameEn: 'Momentum Calculator',
    nameKey: 'calc/physics:momentum.title',
    slug: 'momentum-calculator',
    description: 'حساب الزخم بناءً على الكتلة والسرعة',
    descriptionEn: 'Calculate momentum based on mass and velocity.',
    descriptionKey: 'calc/physics:momentum.description',
    category: 'physics',
    icon: '🎾',
    popularity: 5,
    componentName: 'MomentumCalculator'
  },

  {
    id: 143,
    name: 'حاسبة الطاقة',
    nameEn: 'Energy Calculator - Kinetic and Potential Energy',
    nameKey: 'calc/physics:energy.title',
    slug: 'energy-calculator',
    description: 'حساب أنواع الطاقة المختلفة والتحويل بينها',
    descriptionEn: 'Calculate different types of energy including kinetic, potential, and thermal energy. Free energy calculator for physics problems. Convert between energy units and solve work-energy problems.',
    descriptionKey: 'calc/physics:energy.description',
    category: 'physics',
    icon: '⚡',
    popularity: 6,
    componentName: 'EnergyCalculator'
  },
  {
    id: 144,
    name: 'حاسبة القدرة والكهرباء',
    nameEn: 'Power and Electricity Calculator - Watts Voltage Current',
    nameKey: 'calc/physics:power.title',
    slug: 'power-electricity-calculator',
    description: 'حساب القدرة والطاقة الكهربائية',
    descriptionEn: 'Calculate electrical power, voltage, current, and resistance using Ohm\'s law. Free electricity calculator for electrical engineering and physics. Solve circuit problems easily.',
    descriptionKey: 'calc/physics:power.description',
    category: 'physics',
    icon: '💡',
    popularity: 6,
    componentName: 'PowerElectricityCalculator'
  },

  // Electrical resistance calculator moved to engineering
];

export default physicsCalculators;
