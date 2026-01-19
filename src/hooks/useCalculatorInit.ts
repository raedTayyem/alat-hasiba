/**
 * Common hook for calculator initialization
 * Reduces duplication across calculator components
 */

import { useEffect } from 'react';
import { initDateInputRTL } from '../utils/dateInputRTL';

/**
 * Initialize calculator with RTL support for date inputs
 * This hook should be called once in every calculator component
 */
export const useCalculatorInit = () => {
  useEffect(() => {
    initDateInputRTL();
  }, []);
};
