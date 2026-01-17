import i18n from '../i18n/config';
import type { Category } from '../data/calculators/types';

/**
 * Get the localized category name based on the current language
 * @param category - The category object
 * @param language - The current language code ('ar' or 'en')
 * @returns The localized category name
 */
export function getCategoryName(category: Category, language: string): string {
  const key = `categoryNames.${category.slug}`;
  const translated = i18n.t(key) as string | undefined;
  if (translated && translated !== key) return translated;

  if (language === 'en' && category.nameEn) {
    return category.nameEn;
  }
  return category.name || category.slug;
}

/**
 * Get the localized category description based on the current language
 * @param category - The category object
 * @param language - The current language code ('ar' or 'en')
 * @returns The localized category description
 */
export function getCategoryDescription(category: Category, language: string): string {
  const key = `categoryDescriptions.${category.slug}`;
  const translated = i18n.t(key) as string | undefined;
  if (translated && translated !== key) return translated;

  if (language === 'en' && category.descriptionEn) {
    return category.descriptionEn;
  }
  return category.description || '';
}
