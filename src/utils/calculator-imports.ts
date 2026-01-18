/**
 * Calculator component dynamic imports
 * This file maps calculator component names to their import functions
 */

// Main calculator imports (existing calculators)
// These are explicit mappings for calculators that don't follow the standard subdirectory pattern
export const calculatorImports: Record<string, () => Promise<any>> = {
  // Inheritance Calculator - uses index.tsx instead of component name
  'InheritanceCalculator': () => import('../components/calculators/inheritance-calculator/index.tsx'),

  // Coptic Calendar calculators - in coptic-calendar subdirectory but category is date-time
  'CopticHolyDays': () => import('../components/calculators/coptic-calendar/CopticHolyDays.tsx'),
  'CopticToGregorian': () => import('../components/calculators/coptic-calendar/CopticToGregorian.tsx'),
  'CopticCalendarInfo': () => import('../components/calculators/coptic-calendar/CopticCalendarInfo.tsx'),

  // Christian Calendar calculators - in christian-calendar subdirectory but category is date-time
  'FixedFeastsCalculator': () => import('../components/calculators/christian-calendar/FixedFeastsCalculator.tsx'),
  'HolyDaysCalculator': () => import('../components/calculators/christian-calendar/HolyDaysCalculator.tsx'),

  // Hebrew Calendar calculators - in hebrew-calendar subdirectory but category is date-time
  'HebrewHolidays': () => import('../components/calculators/hebrew-calendar/HebrewHolidays.tsx'),
  'HebrewToGregorian': () => import('../components/calculators/hebrew-calendar/HebrewToGregorian.tsx'),
  'HebrewCalendarInfo': () => import('../components/calculators/hebrew-calendar/HebrewCalendarInfo.tsx'),

  // Holy Week calculators - in holy-week subdirectory but category is date-time
  'HolyWeekDates': () => import('../components/calculators/holy-week/HolyWeekDates.tsx'),
  'HolyWeekInfo': () => import('../components/calculators/holy-week/HolyWeekInfo.tsx'),
  'HolyWeekTraditions': () => import('../components/calculators/holy-week/HolyWeekTraditions.tsx'),

  // Yazidi Calendar calculators - in yazidi-calendar subdirectory but category is date-time
  'YazidiCalendar': () => import('../components/calculators/yazidi-calendar/YazidiCalendar.tsx'),
  'YazidiNewYearCalculator': () => import('../components/calculators/yazidi-calendar/YazidiNewYearCalculator.tsx'),

  // Samaritan Calendar calculators - in samaritan-calendar subdirectory but category is date-time
  'SamaritanCalendarConverter': () => import('../components/calculators/samaritan-calendar/SamaritanCalendarConverter.tsx'),
  'SamaritanFestivalsCalculator': () => import('../components/calculators/samaritan-calendar/SamaritanFestivalsCalculator.tsx'),
};

// Subdirectory calculator imports for new categories
export const subdirectoryCalculatorImports: Record<string, (componentName: string) => Promise<any>> = {
  // Root-level calculators (math, finance, gaming, etc.)
  root: (componentName: string) =>
    import(`../components/calculators/${componentName}.tsx`),

  // Agriculture calculators
  agriculture: (componentName: string) =>
    import(`../components/calculators/agriculture/${componentName}.tsx`),

  // Astronomy calculators
  astronomy: (componentName: string) =>
    import(`../components/calculators/astronomy/${componentName}.tsx`),

  // Electrical calculators
  electrical: (componentName: string) =>
    import(`../components/calculators/electrical/${componentName}.tsx`),

  // Environmental calculators
  environmental: (componentName: string) =>
    import(`../components/calculators/environmental/${componentName}.tsx`),

  // Fitness calculators
  fitness: (componentName: string) =>
    import(`../components/calculators/fitness/${componentName}.tsx`),

  // Pet calculators
  pet: (componentName: string) =>
    import(`../components/calculators/pet/${componentName}.tsx`),

  // Real Estate calculators
  'real-estate': (componentName: string) =>
    import(`../components/calculators/real-estate/${componentName}.tsx`),

  // Science calculators
  science: (componentName: string) =>
    import(`../components/calculators/science/${componentName}.tsx`),

  // Statistics calculators
  statistics: (componentName: string) =>
    import(`../components/calculators/statistics/${componentName}.tsx`),

  // Math calculators
  math: (componentName: string) =>
    import(`../components/calculators/math/${componentName}.tsx`),

  // Geometry calculators
  geometry: (componentName: string) =>
    import(`../components/calculators/geometry/${componentName}.tsx`),

  // Converters
  converters: (componentName: string) =>
    import(`../components/calculators/converters/${componentName}.tsx`),

  // Physics calculators
  physics: (componentName: string) =>
    import(`../components/calculators/physics/${componentName}.tsx`),

  // Finance calculators
  finance: (componentName: string) =>
    import(`../components/calculators/finance/${componentName}.tsx`),

  // Health calculators
  health: (componentName: string) =>
    import(`../components/calculators/health/${componentName}.tsx`),

  // Date/Time calculators
  'date-time': (componentName: string) =>
    import(`../components/calculators/date-time/${componentName}.tsx`),

  // Misc calculators
  misc: (componentName: string) =>
    import(`../components/calculators/misc/${componentName}.tsx`),

  // Education calculators
  education: (componentName: string) =>
    import(`../components/calculators/education/${componentName}.tsx`),

  // Engineering calculators
  engineering: (componentName: string) =>
    import(`../components/calculators/engineering/${componentName}.tsx`),

  // Business calculators
  business: (componentName: string) =>
    import(`../components/calculators/business/${componentName}.tsx`),

  // Construction calculators
  construction: (componentName: string) =>
    import(`../components/calculators/construction/${componentName}.tsx`),

  // Automotive calculators
  automotive: (componentName: string) =>
    import(`../components/calculators/automotive/${componentName}.tsx`),

  // Cooking calculators
  cooking: (componentName: string) =>
    import(`../components/calculators/cooking/${componentName}.tsx`),

  // Gaming calculators
  gaming: (componentName: string) =>
    import(`../components/calculators/gaming/${componentName}.tsx`),

  // Inheritance calculator
  'inheritance-calculator': (componentName: string) =>
    import(`../components/calculators/inheritance-calculator/${componentName}.tsx`),

  // Specialized Calendars
  'yazidi-calendar': (componentName: string) =>
    import(`../components/calculators/yazidi-calendar/${componentName}.tsx`),
  'christian-calendar': (componentName: string) =>
    import(`../components/calculators/christian-calendar/${componentName}.tsx`),
  'coptic-calendar': (componentName: string) =>
    import(`../components/calculators/coptic-calendar/${componentName}.tsx`),
  'hebrew-calendar': (componentName: string) =>
    import(`../components/calculators/hebrew-calendar/${componentName}.tsx`),
  'holy-week': (componentName: string) =>
    import(`../components/calculators/holy-week/${componentName}.tsx`),
  'samaritan-calendar': (componentName: string) =>
    import(`../components/calculators/samaritan-calendar/${componentName}.tsx`),

  // Specific mapping for failing components
  'specific': (componentName: string) => {
    const componentMappings: Record<string, () => Promise<any>> = {
      'HebrewToGregorian': () => import('../components/calculators/hebrew-calendar/HebrewToGregorian.tsx'),
      'HolyWeekInfo': () => import('../components/calculators/holy-week/HolyWeekInfo.tsx'),
      'HolyWeekTraditions': () => import('../components/calculators/holy-week/HolyWeekTraditions.tsx'),
      'CopticToGregorian': () => import('../components/calculators/coptic-calendar/CopticToGregorian.tsx'),
      'HebrewCalendarInfo': () => import('../components/calculators/hebrew-calendar/HebrewCalendarInfo.tsx'),
      'CopticCalendarInfo': () => import('../components/calculators/coptic-calendar/CopticCalendarInfo.tsx')
    };

    if (componentMappings[componentName]) {
      return componentMappings[componentName]();
    }
    throw new Error(`Unknown component: ${componentName}`);
  }
};
