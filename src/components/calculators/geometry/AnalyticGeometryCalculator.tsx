'use client';

/**
 * ANALYTIC GEOMETRY CALCULATOR
 *
 * Calculates:
 * - Distance between two points: d = sqrt[(x2-x1)^2 + (y2-y1)^2]
 * - Midpoint: M = ((x1+x2)/2, (y1+y2)/2)
 * - Slope: m = (y2-y1)/(x2-x1)
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { NumberInput } from '@/components/ui/number-input';

interface AnalyticGeometryResult {
  distance: number;
  midpointX: number;
  midpointY: number;
  slope: number | null;
  isVertical: boolean;
}

export default function AnalyticGeometryCalculator() {
  const { t } = useTranslation('calc/geometry');
  const [x1, setX1] = useState<string>('');
  const [y1, setY1] = useState<string>('');
  const [x2, setX2] = useState<string>('');
  const [y2, setY2] = useState<string>('');
  const [result, setResult] = useState<AnalyticGeometryResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');
    const [a, b, c, d] = [parseFloat(x1), parseFloat(y1), parseFloat(x2), parseFloat(y2)];
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
      setError(t("analytic_geometry_calculator.error_invalid_input"));
      return false;
    }
    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;
    setShowResult(false);
    setTimeout(() => {
      try {
        const [a, b, c, d] = [parseFloat(x1), parseFloat(y1), parseFloat(x2), parseFloat(y2)];
        const distance = Math.sqrt((c - a) ** 2 + (d - b) ** 2);
        const midpointX = (a + c) / 2;
        const midpointY = (b + d) / 2;
        const isVertical = c === a;
        const slope = isVertical ? null : (d - b) / (c - a);
        setResult({ distance, midpointX, midpointY, slope, isVertical });
        setShowResult(true);
      } catch (err) {
        setError(t("analytic_geometry_calculator.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setX1('');
      setY1('');
      setX2('');
      setY2('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleInputChange = (setter: (value: string) => void) => (value: string | number) => {
    setter(String(value));
    if (error) setError('');
  };

  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputContainer label={t("analytic_geometry_calculator.x1")} tooltip={t("analytic_geometry_calculator.x1_tooltip")}>
            <NumberInput
              value={x1}
              onValueChange={handleInputChange(setX1)}
              className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
              placeholder={t("analytic_geometry_calculator.x1_placeholder")}
              step={0.01}
            />
          </InputContainer>
          <InputContainer label={t("analytic_geometry_calculator.y1")} tooltip={t("analytic_geometry_calculator.y1_tooltip")}>
            <NumberInput
              value={y1}
              onValueChange={handleInputChange(setY1)}
              className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
              placeholder={t("analytic_geometry_calculator.y1_placeholder")}
              step={0.01}
            />
          </InputContainer>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputContainer label={t("analytic_geometry_calculator.x2")} tooltip={t("analytic_geometry_calculator.x2_tooltip")}>
            <NumberInput
              value={x2}
              onValueChange={handleInputChange(setX2)}
              className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
              placeholder={t("analytic_geometry_calculator.x2_placeholder")}
              step={0.01}
            />
          </InputContainer>
          <InputContainer label={t("analytic_geometry_calculator.y2")} tooltip={t("analytic_geometry_calculator.y2_tooltip")}>
            <NumberInput
              value={y2}
              onValueChange={handleInputChange(setY2)}
              className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
              placeholder={t("analytic_geometry_calculator.y2_placeholder")}
              step={0.01}
            />
          </InputContainer>
        </div>
      </div>
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>
      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("analytic_geometry_calculator.info_title")}</h2>
            <p className="text-foreground-70 mb-3">{t("analytic_geometry_calculator.info_description")}</p>
          </div>
          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("analytic_geometry_calculator.formulas_title")}</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("analytic_geometry_calculator.formula_distance")}</li>
              <li>{t("analytic_geometry_calculator.formula_midpoint")}</li>
              <li>{t("analytic_geometry_calculator.formula_slope")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("analytic_geometry_calculator.result_distance")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{result.distance.toFixed(2)}</div>
        <div className="text-lg text-foreground-70">{t("analytic_geometry_calculator.unit_length")}</div>
      </div>
      <div className="divider my-6"></div>
      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("analytic_geometry_calculator.additional_info")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("analytic_geometry_calculator.midpoint")}</div>
            </div>
            <div className="text-sm text-foreground-70">({result.midpointX.toFixed(2)}, {result.midpointY.toFixed(2)})</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="font-medium">{t("analytic_geometry_calculator.slope")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.isVertical ? t("analytic_geometry_calculator.undefined") : result.slope!.toFixed(2)}
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
            <h4 className="font-medium mb-1">{t("analytic_geometry_calculator.formula_explanation_title")}</h4>
            <p className="text-sm text-foreground-70">{t("analytic_geometry_calculator.formula_explanation")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("analytic_geometry_calculator.title")}
      description={t("analytic_geometry_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
