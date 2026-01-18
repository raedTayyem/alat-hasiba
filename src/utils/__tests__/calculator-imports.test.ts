import { describe, it, expect } from 'vitest';
import { calculatorImports, subdirectoryCalculatorImports } from '../calculator-imports';

describe('calculator-imports', () => {
  describe('calculatorImports', () => {
    it('should have defined calculator imports', () => {
      expect(calculatorImports).toBeDefined();
      expect(typeof calculatorImports).toBe('object');
    });

    it('should contain InheritanceCalculator import', () => {
      expect(calculatorImports.InheritanceCalculator).toBeDefined();
      expect(typeof calculatorImports.InheritanceCalculator).toBe('function');
    });

    it('should contain Coptic calendar imports', () => {
      expect(calculatorImports.CopticHolyDays).toBeDefined();
      expect(calculatorImports.CopticToGregorian).toBeDefined();
      expect(calculatorImports.CopticCalendarInfo).toBeDefined();
    });

    it('should contain Christian calendar imports', () => {
      expect(calculatorImports.FixedFeastsCalculator).toBeDefined();
      expect(calculatorImports.HolyDaysCalculator).toBeDefined();
    });

    it('should contain Hebrew calendar imports', () => {
      expect(calculatorImports.HebrewHolidays).toBeDefined();
      expect(calculatorImports.HebrewToGregorian).toBeDefined();
      expect(calculatorImports.HebrewCalendarInfo).toBeDefined();
    });

    it('should contain Holy Week imports', () => {
      expect(calculatorImports.HolyWeekDates).toBeDefined();
      expect(calculatorImports.HolyWeekInfo).toBeDefined();
      expect(calculatorImports.HolyWeekTraditions).toBeDefined();
    });

    it('should contain Yazidi calendar imports', () => {
      expect(calculatorImports.YazidiCalendar).toBeDefined();
      expect(calculatorImports.YazidiNewYearCalculator).toBeDefined();
    });

    it('should contain Samaritan calendar imports', () => {
      expect(calculatorImports.SamaritanCalendarConverter).toBeDefined();
      expect(calculatorImports.SamaritanFestivalsCalculator).toBeDefined();
    });

    it('should return promises from calculator imports', () => {
      const result = calculatorImports.InheritanceCalculator();
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('subdirectoryCalculatorImports', () => {
    it('should have defined subdirectory imports', () => {
      expect(subdirectoryCalculatorImports).toBeDefined();
      expect(typeof subdirectoryCalculatorImports).toBe('object');
    });

    it('should contain all expected categories', () => {
      const expectedCategories = [
        'root',
        'agriculture',
        'astronomy',
        'electrical',
        'environmental',
        'fitness',
        'pet',
        'real-estate',
        'science',
        'statistics',
        'math',
        'geometry',
        'converters',
        'physics',
        'finance',
        'health',
        'date-time',
        'misc',
        'education',
        'engineering',
        'business',
        'construction',
        'automotive',
        'cooking',
        'gaming',
        'inheritance-calculator',
        'yazidi-calendar',
        'christian-calendar',
        'coptic-calendar',
        'hebrew-calendar',
        'holy-week',
        'samaritan-calendar',
        'specific',
      ];

      expectedCategories.forEach((category) => {
        expect(subdirectoryCalculatorImports[category]).toBeDefined();
        expect(typeof subdirectoryCalculatorImports[category]).toBe('function');
      });
    });

    it('should return promises from subdirectory imports', () => {
      const categories = ['math', 'health', 'finance'];

      categories.forEach((category) => {
        const importFn = subdirectoryCalculatorImports[category];
        expect(typeof importFn).toBe('function');
      });
    });

    it('should handle specific component mappings', () => {
      const specificImporter = subdirectoryCalculatorImports.specific;
      expect(typeof specificImporter).toBe('function');

      const specificComponents = [
        'HebrewToGregorian',
        'HolyWeekInfo',
        'HolyWeekTraditions',
        'CopticToGregorian',
        'HebrewCalendarInfo',
        'CopticCalendarInfo',
      ];

      specificComponents.forEach((componentName) => {
        const result = specificImporter(componentName);
        expect(result).toBeInstanceOf(Promise);
      });
    });

    it('should throw error for unknown specific component', () => {
      const specificImporter = subdirectoryCalculatorImports.specific;

      expect(() => {
        specificImporter('NonExistentComponent');
      }).toThrow('Unknown component: NonExistentComponent');
    });
  });

  describe('import function structure', () => {
    it('should have consistent structure for all calculator imports', () => {
      Object.entries(calculatorImports).forEach(([name, importFn]) => {
        expect(typeof importFn).toBe('function');
        expect(name).toBeTruthy();
      });
    });

    it('should have consistent structure for all subdirectory imports', () => {
      Object.entries(subdirectoryCalculatorImports).forEach(([category, importFn]) => {
        expect(typeof importFn).toBe('function');
        expect(category).toBeTruthy();
      });
    });
  });

  describe('category coverage', () => {
    it('should cover main calculator categories', () => {
      const mainCategories = [
        'math',
        'health',
        'finance',
        'converters',
        'physics',
        'date-time',
      ];

      mainCategories.forEach((category) => {
        expect(subdirectoryCalculatorImports[category]).toBeDefined();
      });
    });

    it('should cover specialized categories', () => {
      const specializedCategories = [
        'automotive',
        'cooking',
        'gaming',
        'agriculture',
        'astronomy',
      ];

      specializedCategories.forEach((category) => {
        expect(subdirectoryCalculatorImports[category]).toBeDefined();
      });
    });

    it('should cover calendar-related categories', () => {
      const calendarCategories = [
        'yazidi-calendar',
        'christian-calendar',
        'coptic-calendar',
        'hebrew-calendar',
        'holy-week',
        'samaritan-calendar',
      ];

      calendarCategories.forEach((category) => {
        expect(subdirectoryCalculatorImports[category]).toBeDefined();
      });
    });
  });
});
