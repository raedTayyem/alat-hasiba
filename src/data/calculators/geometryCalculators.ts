import { Calculator } from './types';

// Geometry Calculators
const geometryCalculators: Calculator[] = [
  {
    id: 12,
    nameKey: "calc/geometry:triangle-calculator.title",
    name: 'حاسبة المثلث',
    nameEn: 'Triangle Calculator - Calculate Triangle Area and Properties',
    slug: 'triangle-calculator',
    descriptionKey: "calc/geometry:triangle-calculator.description",
    description: 'حساب خصائص ومساحة المثلث',
    descriptionEn: 'Calculate triangle properties including area, perimeter, angles, and sides. Free online triangle calculator for geometry problems. Solve any triangle with ease.',
    category: 'geometry',
    icon: '📐',
    popularity: 7,
    componentName: 'TriangleCalculator'
  },
  {
    id: 13,
    nameKey: "calc/geometry:circle-calculator.title",
    name: 'حاسبة الدائرة',
    nameEn: 'Circle Calculator - Calculate Circumference and Area',
    slug: 'circle-calculator',
    descriptionKey: "calc/geometry:circle-calculator.description",
    description: 'حساب محيط ومساحة الدائرة',
    descriptionEn: 'Calculate circle circumference, area, radius, and diameter online. Free circle calculator for geometry and math problems. Get accurate results instantly.',
    category: 'geometry',
    icon: '⭕',
    popularity: 7,
    componentName: 'CircleCalculator'
  },
  {
    id: 14,
    nameKey: "calc/geometry:rectangle-calculator.title",
    name: 'حاسبة المستطيل',
    nameEn: 'Rectangle Calculator - Calculate Rectangle Area and Perimeter',
    slug: 'rectangle-calculator',
    descriptionKey: "calc/geometry:rectangle-calculator.description",
    description: 'حساب محيط ومساحة المستطيل',
    descriptionEn: 'Calculate rectangle area, perimeter, and diagonal online. Free rectangle calculator for geometry and construction. Find dimensions quickly and accurately.',
    category: 'geometry',
    icon: '⬜',
    popularity: 6,
    componentName: 'RectangleCalculator'
  },
  {
    id: 15,
    nameKey: "calc/geometry:parallelogram-calculator.title",
    name: 'حاسبة متوازي الأضلاع',
    nameEn: 'Parallelogram Calculator - Calculate Area and Properties',
    slug: 'parallelogram-calculator',
    descriptionKey: "calc/geometry:parallelogram-calculator.description",
    description: 'حساب خصائص متوازي الأضلاع',
    descriptionEn: 'Calculate parallelogram area, perimeter, height, and angles online. Free parallelogram calculator for geometry problems. Solve for missing dimensions easily.',
    category: 'geometry',
    icon: '◇',
    popularity: 5,
    componentName: 'ParallelogramCalculator'
  },
  {
    id: 16,
    nameKey: "calc/geometry:analytic-geometry.title",
    name: 'حاسبة الهندسة التحليلية',
    nameEn: 'Analytic Geometry Calculator - Coordinate Geometry Online',
    slug: 'analytic-geometry',
    descriptionKey: "calc/geometry:analytic-geometry.description",
    description: 'حل مسائل الهندسة التحليلية',
    descriptionEn: 'Solve analytic geometry problems including distance between points, midpoint, slope, and equations of lines. Free coordinate geometry calculator for math students.',
    category: 'geometry',
    icon: '📏',
    popularity: 5,
    componentName: 'AnalyticGeometryCalculator'
  },
  {
    id: 121,
    nameKey: "calc/geometry:bezier-curve-calculator.title",
    name: 'حاسبة منحنى بيزير',
    nameEn: 'Bezier Curve Calculator - Calculate Bezier Curves Online',
    slug: 'bezier-curve-calculator',
    descriptionKey: "calc/geometry:bezier-curve-calculator.description",
    description: 'حساب منحنيات بيزير والتحكم بها',
    descriptionEn: 'Calculate and visualize Bezier curves online. Free Bezier curve calculator for graphic design, animation, and computer graphics. Control points and curve parameters easily.',
    category: 'geometry',
    icon: '📈',
    popularity: 4,
    componentName: 'BezierCurveCalculator'
  },
  {
    id: 122,
    nameKey: "calc/geometry:coordinates-calculator.title",
    name: 'حاسبة الإحداثيات',
    nameEn: 'Coordinates Calculator - Convert Coordinate Systems',
    slug: 'coordinates-calculator',
    descriptionKey: "calc/geometry:coordinates-calculator.description",
    description: 'حساب وتحويل الإحداثيات المختلفة',
    descriptionEn: 'Calculate and convert between different coordinate systems including Cartesian, polar, and geographic coordinates. Free coordinate converter for math and navigation.',
    category: 'geometry',
    icon: '🧭',
    popularity: 5,
    componentName: 'CoordinatesCalculator'
  },
];

export default geometryCalculators;
