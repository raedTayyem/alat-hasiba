'use client';

/**
 * PARALLELOGRAM CALCULATOR
 *
 * Calculates parallelogram properties including:
 * - Area: A = base * height
 * - Perimeter: P = 2(base + side)
 * - Height calculations
 *
 * Formulas:
 * - Area: A = b * h
 * - Perimeter: P = 2(a + b)
 * - Height: h = A / b
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { NumberInput } from '@/components/ui/number-input';

interface ParallelogramResult {
  area: number;
  perimeter: number;
  base: number;
  side: number;
  height: number;
}

export default function ParallelogramCalculator() {
  const { t } = useTranslation('calc/geometry');
  const [base, setBase] = useState<string>('');
  const [side, setSide] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [result, setResult] = useState<ParallelogramResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const b = parseFloat(base);
    const s = parseFloat(side);
    const h = parseFloat(height);

    if (isNaN(b) || isNaN(s) || isNaN(h)) {
      setError(t("parallelogram_calculator.error_invalid_input"));
      return false;
    }

    if (b <= 0 || s <= 0 || h <= 0) {
      setError(t("parallelogram_calculator.error_positive_values"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        const b = parseFloat(base);
        const s = parseFloat(side);
        const h = parseFloat(height);

        const area = b * h;
        const perimeter = 2 * (b + s);

        setResult({ area, perimeter, base: b, side: s, height: h });
        setShowResult(true);
      } catch (err) {
        setError(t("parallelogram_calculator.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setBase('');
      setSide('');
      setHeight('');
      setResult(null);
      setError('');
    }, 300);
  };


  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t("parallelogram_calculator.base")} tooltip={t("parallelogram_calculator.base_tooltip")}>
          <NumberInput
            value={base}
            onValueChange={(value) => { setBase(String(value)); if (error) setError(''); }}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("parallelogram_calculator.base_placeholder")}
            step={0.01}
            min={0}
          />
        </InputContainer>

        <InputContainer label={t("parallelogram_calculator.side")} tooltip={t("parallelogram_calculator.side_tooltip")}>
          <NumberInput
            value={side}
            onValueChange={(value) => { setSide(String(value)); if (error) setError(''); }}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("parallelogram_calculator.side_placeholder")}
            step={0.01}
            min={0}
          />
        </InputContainer>

        <InputContainer label={t("parallelogram_calculator.height")} tooltip={t("parallelogram_calculator.height_tooltip")}>
          <NumberInput
            value={height}
            onValueChange={(value) => { setHeight(String(value)); if (error) setError(''); }}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("parallelogram_calculator.height_placeholder")}
            step={0.01}
            min={0}
          />
        </InputContainer>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("parallelogram_calculator.info_title")}</h2>
            <p className="text-foreground-70 mb-3">{t("parallelogram_calculator.info_description")}</p>
          </div>
          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("parallelogram_calculator.formulas_title")}</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("parallelogram_calculator.formula_area")}</li>
              <li>{t("parallelogram_calculator.formula_perimeter")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("parallelogram_calculator.result_area")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{result.area.toFixed(2)}</div>
        <div className="text-lg text-foreground-70">{t("parallelogram_calculator.unit_area")}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("parallelogram_calculator.additional_info")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <div className="font-medium">{t("parallelogram_calculator.perimeter")}</div>
            </div>
            <div className="text-sm text-foreground-70">{result.perimeter.toFixed(2)} {t("parallelogram_calculator.unit_length")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("parallelogram_calculator.formula_explanation_title")}</h4>
            <p className="text-sm text-foreground-70">{t("parallelogram_calculator.formula_explanation")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("parallelogram_calculator.title")}
      description={t("parallelogram_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
