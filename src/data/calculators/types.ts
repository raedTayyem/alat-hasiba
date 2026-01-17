// Type definitions for calculators and categories

export interface Calculator {
  id: number;
  name?: string;
  nameEn?: string; // English name (optional)
  slug: string;
  description?: string;
  descriptionEn?: string; // English description (optional)
  nameKey?: string; // i18next key for name (overrides name and nameEn)
  descriptionKey?: string; // i18next key for description (overrides description and descriptionEn)
  category: string;
  icon?: string; // Make icon optional
  popularity?: number; // 1-10, with 10 being most popular (optional)
  componentName?: string; // Component name (optional)
  keywords?: string[]; // Add optional keywords array
  relatedCalculators?: string[]; // Related calculator slugs (optional)
}

export interface Category {
  id: number;
  name?: string;
  nameEn?: string; // English name (optional)
  slug: string;
  description?: string;
  descriptionEn?: string; // English description (optional)
  icon: string;
  count?: number; // Will be calculated
} 