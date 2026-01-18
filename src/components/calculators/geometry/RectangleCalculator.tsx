'use client';

/**
 * RECTANGLE CALCULATOR
 *
 * Calculates rectangle properties including:
 * - Area: A = length * width
 * - Perimeter: P = 2(length + width)
 * - Diagonal: d = sqrt(length^2 + width^2)
 *
 * Formulas:
 * - Area: A = l * w
 * - Perimeter: P = 2(l + w)
 * - Diagonal: d = sqrt(l^2 + w^2) (Pythagorean theorem)
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { NumberInput } from '@/components/ui/number-input';

interface RectangleResult {
  area: number;
  perimeter: number;
  diagonal: number;
  length: number;
  width: number;
}

export default function RectangleCalculator() {
  const { t } = useTranslation('calc/geometry');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [result, setResult] = useState<RectangleResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const l = parseFloat(length);
    const w = parseFloat(width);

    if (isNaN(l) || isNaN(w)) {
      setError(t("rectangle_calculator.error_invalid_input"));
      return false;
    }

    if (l <= 0 || w <= 0) {
      setError(t("rectangle_calculator.error_positive_values"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const l = parseFloat(length);
        const w = parseFloat(width);

        const area = l * w;
        const perimeter = 2 * (l + w);
        const diagonal = Math.sqrt(l * l + w * w);

        setResult({
          area,
          perimeter,
          diagonal,
          length: l,
          width: w,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("rectangle_calculator.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);

    setTimeout(() => {
      setLength('');
      setWidth('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleLengthChange = (value: string | number) => {
    setLength(String(value));
    if (error) setError('');
  };

  const handleWidthChange = (value: string | number) => {
    setWidth(String(value));
    if (error) setError('');
  };

  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t("rectangle_calculator.length")}
          tooltip={t("rectangle_calculator.length_tooltip")}
        >
          <NumberInput
            value={length}
            onValueChange={handleLengthChange}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("rectangle_calculator.length_placeholder")}
            step={0.01}
            min={0}
          />
        </InputContainer>

        <InputContainer
          label={t("rectangle_calculator.width")}
          tooltip={t("rectangle_calculator.width_tooltip")}
        >
          <NumberInput
            value={width}
            onValueChange={handleWidthChange}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("rectangle_calculator.width_placeholder")}
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
            <h2 className="font-bold mb-2 text-lg">
              {t("rectangle_calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("rectangle_calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("rectangle_calculator.formulas_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("rectangle_calculator.formula_area")}</li>
              <li>{t("rectangle_calculator.formula_perimeter")}</li>
              <li>{t("rectangle_calculator.formula_diagonal")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("rectangle_calculator.result_area")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.area.toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("rectangle_calculator.unit_area")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("rectangle_calculator.additional_info")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <div className="font-medium">{t("rectangle_calculator.perimeter")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.perimeter.toFixed(2)} {t("rectangle_calculator.unit_length")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="font-medium">{t("rectangle_calculator.diagonal")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.diagonal.toFixed(2)} {t("rectangle_calculator.unit_length")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("rectangle_calculator.length")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.length.toFixed(2)} {t("rectangle_calculator.unit_length")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("rectangle_calculator.width")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.width.toFixed(2)} {t("rectangle_calculator.unit_length")}
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
            <h4 className="font-medium mb-1">{t("rectangle_calculator.formula_explanation_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("rectangle_calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("rectangle_calculator.title")}
      description={t("rectangle_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
