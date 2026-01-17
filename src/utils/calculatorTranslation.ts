import i18n from '../i18n/config';
import type { Calculator } from '../data/calculators/types';

/**
 * Get the localized name for a calculator
 * @param calculator - The calculator object
 * @param language - The current language ('ar' or 'en')
 * @returns The localized calculator name
 */
export function getCalculatorName(calculator: Calculator, language: string): string {
  if (calculator.nameKey) {
    const key = calculator.nameKey.replace('{{slug}}', calculator.slug || '');
    const translated = i18n.t(key);
    if (translated !== key) return translated;
  }
  if (language === 'en' && calculator.nameEn) {
    return calculator.nameEn;
  }
  return calculator.name || calculator.nameEn || calculator.slug || 'Calculator';
}

/**
 * Get the localized description for a calculator
 * @param calculator - The calculator object
 * @param language - The current language ('ar' or 'en')
 * @returns The localized calculator description
 */
export function getCalculatorDescription(calculator: Calculator, language: string): string {
  if (calculator.descriptionKey) {
    const key = calculator.descriptionKey.replace('{{slug}}', calculator.slug || '');
    const translated = i18n.t(key);
    if (translated !== key) return translated;
  }
  if (language === 'en' && calculator.descriptionEn) {
    return calculator.descriptionEn;
  }
  return calculator.description || calculator.descriptionEn || '';
}

/**
 * Get both localized name and description
 * @param calculator - The calculator object
 * @param language - The current language ('ar' or 'en')
 * @returns Object with localized name and description
 */
export function getCalculatorContent(calculator: Calculator, language: string) {
  return {
    name: getCalculatorName(calculator, language),
    description: getCalculatorDescription(calculator, language),
  };
}
