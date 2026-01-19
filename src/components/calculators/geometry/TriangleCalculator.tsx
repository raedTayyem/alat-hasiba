'use client';

/**
 * TRIANGLE CALCULATOR
 *
 * Calculates triangle properties including:
 * - Area using Heron's formula
 * - Perimeter
 * - Angles using law of cosines
 * - Semi-perimeter
 * - Inradius and Circumradius
 *
 * Formulas:
 * - Heron's Formula: Area = sqrt(s(s-a)(s-b)(s-c)) where s = (a+b+c)/2
 * - Law of Cosines: cos(A) = (b^2+c^2-a^2)/(2bc)
 * - Perimeter: P = a + b + c
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { NumberInput } from '@/components/ui/number-input';

interface TriangleResult {
  area: number;
  perimeter: number;
  semiPerimeter: number;
  angleA: number;
  angleB: number;
  angleC: number;
  inradius: number;
  circumradius: number;
  isValid: boolean;
}

export default function TriangleCalculator() {
  const { t } = useTranslation('calc/geometry');
  const [sideA, setSideA] = useState<string>('');
  const [sideB, setSideB] = useState<string>('');
  const [sideC, setSideC] = useState<string>('');
  const [result, setResult] = useState<TriangleResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const c = parseFloat(sideC);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      setError(t("triangle_calculator.error_invalid_input"));
      return false;
    }

    if (a <= 0 || b <= 0 || c <= 0) {
      setError(t("triangle_calculator.error_positive_values"));
      return false;
    }

    // Triangle inequality theorem: sum of any two sides must be greater than the third side
    if (a + b <= c || a + c <= b || b + c <= a) {
      setError(t("triangle_calculator.error_invalid_triangle"));
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
        const a = parseFloat(sideA);
        const b = parseFloat(sideB);
        const c = parseFloat(sideC);

        // Calculate perimeter
        const perimeter = a + b + c;

        // Calculate semi-perimeter
        const s = perimeter / 2;

        // Calculate area using Heron's formula
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

        // Calculate angles using law of cosines
        // cos(A) = (b^2 + c^2 - a^2) / (2bc)
        const cosA = (b * b + c * c - a * a) / (2 * b * c);
        const cosB = (a * a + c * c - b * b) / (2 * a * c);
        const cosC = (a * a + b * b - c * c) / (2 * a * b);

        // Convert to degrees
        const angleA = Math.acos(cosA) * (180 / Math.PI);
        const angleB = Math.acos(cosB) * (180 / Math.PI);
        const angleC = Math.acos(cosC) * (180 / Math.PI);

        // Calculate inradius: r = Area / s
        const inradius = area / s;

        // Calculate circumradius: R = (abc) / (4 * Area)
        const circumradius = (a * b * c) / (4 * area);

        setResult({
          area,
          perimeter,
          semiPerimeter: s,
          angleA,
          angleB,
          angleC,
          inradius,
          circumradius,
          isValid: true,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("triangle_calculator.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);

    setTimeout(() => {
      setSideA('');
      setSideB('');
      setSideC('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleSideAChange = (value: string | number) => {
    setSideA(String(value));
    if (error) setError('');
  };

  const handleSideBChange = (value: string | number) => {
    setSideB(String(value));
    if (error) setError('');
  };

  const handleSideCChange = (value: string | number) => {
    setSideC(String(value));
    if (error) setError('');
  };

  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t("triangle_calculator.side_a")}
          tooltip={t("triangle_calculator.side_a_tooltip")}
        >
          <NumberInput
            value={sideA}
            onValueChange={handleSideAChange}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("triangle_calculator.side_a_placeholder")}
            step={0.01}
            min={0}
          />
        </InputContainer>

        <InputContainer
          label={t("triangle_calculator.side_b")}
          tooltip={t("triangle_calculator.side_b_tooltip")}
        >
          <NumberInput
            value={sideB}
            onValueChange={handleSideBChange}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("triangle_calculator.side_b_placeholder")}
            step={0.01}
            min={0}
          />
        </InputContainer>

        <InputContainer
          label={t("triangle_calculator.side_c")}
          tooltip={t("triangle_calculator.side_c_tooltip")}
        >
          <NumberInput
            value={sideC}
            onValueChange={handleSideCChange}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("triangle_calculator.side_c_placeholder")}
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
              {t("triangle_calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("triangle_calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("triangle_calculator.formulas_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("triangle_calculator.formula_heron")}</li>
              <li>{t("triangle_calculator.formula_perimeter")}</li>
              <li>{t("triangle_calculator.formula_angles")}</li>
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
          {t("triangle_calculator.result_area")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.area.toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("triangle_calculator.unit_area")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("triangle_calculator.additional_info")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <div className="font-medium">{t("triangle_calculator.perimeter")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.perimeter.toFixed(2)} {t("triangle_calculator.unit_length")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="font-medium">{t("triangle_calculator.angle_a")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.angleA.toFixed(2)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="font-medium">{t("triangle_calculator.angle_b")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.angleB.toFixed(2)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="font-medium">{t("triangle_calculator.angle_c")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.angleC.toFixed(2)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("triangle_calculator.inradius")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.inradius.toFixed(2)} {t("triangle_calculator.unit_length")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("triangle_calculator.circumradius")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.circumradius.toFixed(2)} {t("triangle_calculator.unit_length")}
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
            <h4 className="font-medium mb-1">{t("triangle_calculator.formula_explanation_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("triangle_calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("triangle_calculator.title")}
      description={t("triangle_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
