'use client';

/**
 * CIRCLE CALCULATOR
 *
 * Calculates circle properties including:
 * - Circumference: C = 2*pi*r
 * - Area: A = pi*r^2
 * - Diameter: d = 2r
 * - Radius from various inputs
 *
 * Formulas:
 * - Circumference: C = 2*pi*r = pi*d
 * - Area: A = pi*r^2 = pi*(d/2)^2
 * - Diameter: d = 2r
 * - Radius: r = d/2 = C/(2*pi) = sqrt(A/pi)
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

interface CircleResult {
  radius: number;
  diameter: number;
  circumference: number;
  area: number;
}

export default function CircleCalculator() {
  const { t } = useTranslation('calc/geometry');
  const [inputType, setInputType] = useState<'radius' | 'diameter' | 'circumference' | 'area'>('radius');
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<CircleResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');
    const value = parseFloat(inputValue);

    if (isNaN(value)) {
      setError(t("circle_calculator.error_invalid_input"));
      return false;
    }

    if (value <= 0) {
      setError(t("circle_calculator.error_positive_values"));
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
        const value = parseFloat(inputValue);
        let radius: number;

        switch (inputType) {
          case 'radius':
            radius = value;
            break;
          case 'diameter':
            radius = value / 2;
            break;
          case 'circumference':
            radius = value / (2 * Math.PI);
            break;
          case 'area':
            radius = Math.sqrt(value / Math.PI);
            break;
          default:
            radius = value;
        }

        const diameter = 2 * radius;
        const circumference = 2 * Math.PI * radius;
        const area = Math.PI * radius * radius;

        setResult({
          radius,
          diameter,
          circumference,
          area,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("circle_calculator.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);

    setTimeout(() => {
      setInputValue('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleInputValueChange = (value: string | number) => {
    setInputValue(String(value));
    if (error) setError('');
  };

  const handleInputTypeChange = (val: string) => {
    setInputType(val as 'radius' | 'diameter' | 'circumference' | 'area');
    if (error) setError('');
  };

  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t("circle_calculator.input_type")}
          tooltip={t("circle_calculator.input_type_tooltip")}
        >
          <Combobox
            options={[
              { value: 'radius', label: t("circle_calculator.radius") },
              { value: 'diameter', label: t("circle_calculator.diameter") },
              { value: 'circumference', label: t("circle_calculator.circumference") },
              { value: 'area', label: t("circle_calculator.area") }
            ]}
            value={inputType}
            onChange={handleInputTypeChange}
          />
        </InputContainer>

        <InputContainer
          label={t(`circle_calculator.${inputType}_label`)}
          tooltip={t(`circle_calculator.${inputType}_tooltip`)}
        >
          <NumberInput
            value={inputValue}
            onValueChange={handleInputValueChange}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t(`circle_calculator.${inputType}_placeholder`)}
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
              {t("circle_calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("circle_calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("circle_calculator.formulas_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("circle_calculator.formula_circumference")}</li>
              <li>{t("circle_calculator.formula_area")}</li>
              <li>{t("circle_calculator.formula_diameter")}</li>
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
          {t("circle_calculator.result_title")}
        </div>
        <div className="text-3xl font-bold text-primary mb-2">
          {t("circle_calculator.circle_properties")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("circle_calculator.properties")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("circle_calculator.radius")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.radius.toFixed(2)} {t("circle_calculator.unit_length")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <div className="font-medium">{t("circle_calculator.diameter")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.diameter.toFixed(2)} {t("circle_calculator.unit_length")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div className="font-medium">{t("circle_calculator.circumference")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.circumference.toFixed(2)} {t("circle_calculator.unit_length")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <div className="font-medium">{t("circle_calculator.area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.area.toFixed(2)} {t("circle_calculator.unit_area")}
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
            <h4 className="font-medium mb-1">{t("circle_calculator.formula_explanation_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("circle_calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("circle_calculator.title")}
      description={t("circle_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
