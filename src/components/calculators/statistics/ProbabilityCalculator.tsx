'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// Type definitions
interface ProbabilityResult {
  type: 'combination' | 'permutation' | 'factorial';
  result: number;
  formula: string;
  explanation: string;
}

export default function ProbabilityCalculator() {
  const { t } = useTranslation('calc/statistics');
  // State management
  const [calculationType, setCalculationType] = useState<'combination' | 'permutation' | 'factorial'>('combination');
  const [n, setN] = useState<string>('');
  const [r, setR] = useState<string>('');
  const [result, setResult] = useState<ProbabilityResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Initialize RTL support
  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Factorial calculation
  const factorial = (num: number): number => {
    if (num < 0) return NaN;
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  };

  // Combination calculation: nCr = n! / (r! * (n-r)!)
  const combination = (n: number, r: number): number => {
    if (r > n) return 0;
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  // Permutation calculation: nPr = n! / (n-r)!
  const permutation = (n: number, r: number): number => {
    if (r > n) return 0;
    return factorial(n) / factorial(n - r);
  };

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const nVal = parseInt(n);

    if (calculationType === 'factorial') {
      if (isNaN(nVal)) {
        setError(t("probability_calculator.invalid_input"));
        return false;
      }
      if (nVal < 0) {
        setError(t("probability_calculator.non_negative_required"));
        return false;
      }
      if (nVal > 170) {
        setError(t("probability_calculator.factorial_too_large"));
        return false;
      }
    } else {
      const rVal = parseInt(r);
      if (isNaN(nVal) || isNaN(rVal)) {
        setError(t("probability_calculator.invalid_input"));
        return false;
      }
      if (nVal < 0 || rVal < 0) {
        setError(t("probability_calculator.non_negative_required"));
        return false;
      }
      if (rVal > nVal) {
        setError(t("probability_calculator.r_greater_than_n"));
        return false;
      }
      if (nVal > 170) {
        setError(t("probability_calculator.value_too_large"));
        return false;
      }
    }

    return true;
  };

  // Calculation logic
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const nVal = parseInt(n);
        let calculatedResult: number;
        let formula: string;
        let explanation: string;

        if (calculationType === 'factorial') {
          calculatedResult = factorial(nVal);
          formula = `${nVal}!`;
          explanation = `${nVal}! = ${nVal} × ${nVal - 1} × ... × 2 × 1`;
        } else if (calculationType === 'combination') {
          const rVal = parseInt(r);
          calculatedResult = combination(nVal, rVal);
          formula = `C(${nVal}, ${rVal}) = ${nVal}! / (${rVal}! × ${nVal - rVal}!)`;
          explanation = t("probability_calculator.combination_explanation");
        } else {
          const rVal = parseInt(r);
          calculatedResult = permutation(nVal, rVal);
          formula = `P(${nVal}, ${rVal}) = ${nVal}! / ${nVal - rVal}!`;
          explanation = t("probability_calculator.permutation_explanation");
        }

        setResult({
          type: calculationType,
          result: calculatedResult,
          formula,
          explanation
        });

        setShowResult(true);
      } catch (err) {
        setError(t("probability_calculator.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setN('');
      setR('');
      setResult(null);
      setError('');
    }, 300);
  };

  // Format number
    // Event handlers
  const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setN(e.target.value);
    if (error) setError('');
  };

  const handleRChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setR(e.target.value);
    if (error) setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  // Input section
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("probability_calculator.page_title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Calculation Type Selector */}
        <InputContainer
          label={t("probability_calculator.calculation_type")}
          tooltip={t("probability_calculator.calculation_type_tooltip")}
        >
          <select
            value={calculationType}
            onChange={(e) => setCalculationType(e.target.value as 'combination' | 'permutation' | 'factorial')}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="combination">{t("probability_calculator.combination")}</option>
            <option value="permutation">{t("probability_calculator.permutation")}</option>
            <option value="factorial">{t("probability_calculator.factorial")}</option>
          </select>
        </InputContainer>

        {/* N Input */}
        <InputContainer
          label={calculationType === 'factorial'
            ? t("probability_calculator.number_n")
            : t("probability_calculator.total_items_n")}
          tooltip={calculationType === 'factorial'
            ? t("probability_calculator.number_n_tooltip")
            : t("probability_calculator.total_items_n_tooltip")}
        >
          <input
            type="number"
            value={n}
            onChange={handleNChange}
            onKeyDown={handleKeyDown}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={calculationType === 'factorial' ? "5" : "10"}
            dir="ltr"
            min="0"
            step="1"
          />
        </InputContainer>

        {/* R Input (only for combination and permutation) */}
        {calculationType !== 'factorial' && (
          <InputContainer
            label={t("probability_calculator.selected_items_r")}
            tooltip={t("probability_calculator.selected_items_r_tooltip")}
          >
            <input
              type="number"
              value={r}
              onChange={handleRChange}
              onKeyDown={handleKeyDown}
              className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
              placeholder="3"
              dir="ltr"
              min="0"
              step="1"
            />
          </InputContainer>
        )}
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons
          onCalculate={calculate}
          onReset={resetCalculator}
        />

        {/* Error Message */}
        <ErrorDisplay error={error} />
      </div>

      {/* Information Section */}
      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("probability_calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("probability_calculator.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("probability_calculator.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("probability_calculator.use_case_1")}</li>
              <li>{t("probability_calculator.use_case_2")}</li>
              <li>{t("probability_calculator.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  // Result section
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("probability_calculator.result")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.result).toLocaleString()}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("probability_calculator.calculation_details")}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div className="font-medium">{t("probability_calculator.formula")}</div>
            </div>
            <div className="text-sm font-mono" dir="ltr">
              {result.formula}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("probability_calculator.type")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.type === 'combination' && t("probability_calculator.combination_type")}
              {result.type === 'permutation' && t("probability_calculator.permutation_type")}
              {result.type === 'factorial' && t("probability_calculator.factorial_type")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("probability_calculator.explanation_title")}</h4>
            <p className="text-sm text-foreground-70">
              {result.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("probability_calculator.page_title")}
      description={t("probability_calculator.page_description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
