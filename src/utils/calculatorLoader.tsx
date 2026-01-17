import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, getCalculatorBySlug, getCalculatorsByCategory } from '../data/calculators';
import { calculatorImports, subdirectoryCalculatorImports } from './calculator-imports';
import { getCalculatorName, getCalculatorDescription } from './calculatorTranslation';

// Define the type for calculator components with metadata
export interface CalculatorComponentWithMetadata {
  component: React.ComponentType;
  title: string;
  description: string;
  category: string;
  slug: string;
}

// Cache for loaded calculator components to avoid repeated dynamic imports
const calculatorComponentCache: Record<string, React.ComponentType> = {};

// Function to dynamically load calculator components based on their componentName
export const loadCalculatorComponent = async (componentName: string, category?: string): Promise<React.ComponentType> => {
  // Return from cache if already loaded
  if (calculatorComponentCache[componentName]) {
    return calculatorComponentCache[componentName];
  }

  try {
    let module: any = null;

    // Check if we have a specific import mapping for this component
    if (calculatorImports[componentName]) {
      module = await calculatorImports[componentName]();
    } else {
      // 1. If category is provided, try that first
      if (category && subdirectoryCalculatorImports[category]) {
        try {
          module = await subdirectoryCalculatorImports[category](componentName);
        } catch (e) {
          // Continue if category-specific load fails
        }
      }

      // 2. Try "root" if still not found
      if (!module && subdirectoryCalculatorImports['root']) {
        try {
          module = await subdirectoryCalculatorImports['root'](componentName);
        } catch (e) {
          // Continue
        }
      }

      // 3. Try the specific mapping for components with known issues
      if (!module && subdirectoryCalculatorImports['specific']) {
        try {
          module = await subdirectoryCalculatorImports['specific'](componentName);
        } catch (e) {
          // Continue
        }
      }

      // 4. Fallback: try each subdirectory one by one
      if (!module) {
        for (const [subdirKey, importFn] of Object.entries(subdirectoryCalculatorImports)) {
          if (subdirKey === 'specific' || subdirKey === 'root' || subdirKey === category) continue;

          try {
            module = await importFn(componentName);
            if (module) break;
          } catch (e) {
            // Continue to next
          }
        }
      }
    }

    if (!module || !module.default) {
      throw new Error(`Calculator component not found or missing default export: ${componentName}`);
    }

    const Component = module.default;

    // Store in cache for future use
    calculatorComponentCache[componentName] = Component;

    return Component;
  } catch (error) {
    console.error(`Error loading calculator component: ${componentName}`, error);

    // Production-ready error component
    return () => {
      const { t } = useTranslation();

      return (
        <div className="p-8 text-center bg-card border border-border rounded-lg shadow-md">
          <div className="mb-4 text-4xl text-primary">⚠️</div>
          <h3 className="text-xl font-bold mb-2">{t('calculator.loadError')}</h3>
          <p className="text-foreground-70 mb-4">
            {t('calculator.loadErrorDescription')}
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
          >
            {t('errors.goHome')}
          </a>
        </div>
      );
    };
  }
};

// Get a calculator by slug with its component
export const getCalculatorComponentBySlug = async (slug: string, language: string = 'ar'): Promise<CalculatorComponentWithMetadata | undefined> => {
  const calculator = getCalculatorBySlug(slug);

  if (!calculator || !calculator.componentName) {
    return undefined;
  }

  try {
    const component = await loadCalculatorComponent(calculator.componentName, calculator.category);

    return {
      component,
      title: getCalculatorName(calculator, language),
      description: getCalculatorDescription(calculator, language),
      category: calculator.category,
      slug: calculator.slug
    };
  } catch (error) {
    console.error(`Error loading calculator component for slug: ${slug}`, error);
    return undefined;
  }
};

// Get related calculators from the same category
export const getRelatedCalculators = (currentSlug: string, limit = 4): Calculator[] => {
  const calculator = getCalculatorBySlug(currentSlug);

  if (!calculator) {
    return [];
  }

  return getCalculatorsByCategory(calculator.category)
    .filter(calc => calc.slug !== currentSlug)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
}; 