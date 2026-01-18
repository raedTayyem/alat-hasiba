/**
 * Tree-shakeable date utilities
 * Import from this file instead of directly from 'date-fns'
 * to ensure optimal bundling
 *
 * This approach re-exports from date-fns, allowing Vite's tree-shaking
 * to work properly while keeping all date functions in one place.
 */

export {
  format,
  addDays,
  subDays,
  differenceInDays,
  isValid,
  parse,
  addMonths,
  subMonths,
  addYears,
  subYears,
  differenceInMonths,
  differenceInYears,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
  endOfDay,
} from 'date-fns';
