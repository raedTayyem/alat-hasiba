// Main file that exports all calculator data and helper functions

import { Calculator, Category } from './types';
import categories from './categories';
import mathCalculators from './mathCalculators';
import geometryCalculators from './geometryCalculators';
import converterCalculators from './converterCalculators';
import physicsCalculators from './physicsCalculators';
import financeCalculators from './financeCalculators';
import healthCalculators from './healthCalculators';
import dateTimeCalculators from './dateTimeCalculators';
import miscCalculators from './miscCalculators';
import educationCalculators from './educationCalculators';
import engineeringCalculators from './engineeringCalculators';
import subdirectoryCalculators from './subdirectoryCalculators';
import businessCalculators from './businessCalculators';
import constructionCalculators from './constructionCalculators';
import automotiveCalculators from './automotiveCalculators';
import cookingCalculators from './cookingCalculators';
import gamingCalculators from './gamingCalculators';
import agricultureCalculators from './agricultureCalculators';
import scienceCalculators from './scienceCalculators';
import electricalCalculators from './electricalCalculators';
import astronomyCalculators from './astronomyCalculators';
import statisticsCalculators from './statisticsCalculators';
import realEstateCalculators from './realEstateCalculators';
import fitnessCalculators from './fitnessCalculators';
import environmentalCalculators from './environmentalCalculators';
import petCalculators from './petCalculators';

// Combine all calculators into a single array
const allCalculators: Calculator[] = [
  ...mathCalculators,
  ...geometryCalculators,
  ...converterCalculators,
  ...physicsCalculators,
  ...financeCalculators,
  ...healthCalculators,
  ...dateTimeCalculators,
  ...miscCalculators,
  ...educationCalculators,
  ...engineeringCalculators,
  ...subdirectoryCalculators,
  ...businessCalculators,
  ...constructionCalculators,
  ...automotiveCalculators,
  ...cookingCalculators,
  ...gamingCalculators,
  ...agricultureCalculators,
  ...scienceCalculators,
  ...electricalCalculators,
  ...astronomyCalculators,
  ...statisticsCalculators,
  ...realEstateCalculators,
  ...fitnessCalculators,
  ...environmentalCalculators,
  ...petCalculators
];

// Helper functions
export const getCalculators = (): Calculator[] => {
  // Validate calculator categories
  validateCalculatorCategories();

  // Return all calculators (componentName is optional)
  return allCalculators;
};

export const getCategories = (): Category[] => {
  // Get all calculators including those in subdirectories
  const validCalculators = getCalculators();

  const categoriesWithCount = categories.map(category => {
    const count = validCalculators.filter(calc => calc.category === category.slug).length;
    return { ...category, count };
  });
  return categoriesWithCount;
};

export const getCalculatorsByCategory = (categorySlug: string): Calculator[] => {
  // Get all calculators including those in subdirectories
  const validCalculators = getCalculators();
  return validCalculators.filter(calculator => calculator.category === categorySlug);
};

export const getCalculatorBySlug = (slug: string): Calculator | undefined => {
  // Get all calculators including those in subdirectories
  const validCalculators = getCalculators();
  return validCalculators.find(calculator => calculator.slug === slug);
};

export const getMostPopularCalculators = (limit = 8): Calculator[] => {
  // Get all calculators including those in subdirectories
  const validCalculators = getCalculators();
  return validCalculators
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};

export const searchCalculators = (query: string): Calculator[] => {
  // Get all calculators including those in subdirectories
  const validCalculators = getCalculators();
  const normalizedQuery = query.toLowerCase().trim();
  return validCalculators.filter(
    calculator =>
      (calculator.name && calculator.name.toLowerCase().includes(normalizedQuery)) ||
      (calculator.description && calculator.description.toLowerCase().includes(normalizedQuery)) ||
      (calculator.nameEn && calculator.nameEn.toLowerCase().includes(normalizedQuery)) ||
      (calculator.descriptionEn && calculator.descriptionEn.toLowerCase().includes(normalizedQuery))
  );
};

// Export calculators as default for direct importing
export default allCalculators;

// Internal function to validate calculator categories
const validateCalculatorCategories = (): void => {
  const categorySlugs = categories.map(category => category.slug);
  const calculatorsWithoutValidCategory = allCalculators.filter(
    calculator => !categorySlugs.includes(calculator.category)
  );

  if (calculatorsWithoutValidCategory.length > 0) {
    console.warn('The following calculators have invalid categories:');
    calculatorsWithoutValidCategory.forEach(calculator => {
      console.warn(`Calculator "${calculator.name}" (ID: ${calculator.id}, slug: ${calculator.slug}) has invalid category "${calculator.category}"`);
      calculator.category = 'misc';
    });
    console.warn(`Fixed ${calculatorsWithoutValidCategory.length} calculators with invalid categories by setting them to the 'misc' category.`);
  }
};

// Re-export types
export type { Calculator, Category }; 