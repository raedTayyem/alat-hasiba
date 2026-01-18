'use client';

/**
 * COORDINATES CALCULATOR
 *
 * Converts between coordinate systems:
 * - Cartesian (x, y) <-> Polar (r, theta)
 * - Cartesian: x = r cos(theta), y = r sin(theta)
 * - Polar: r = sqrt(x^2 + y^2), theta = atan2(y, x)
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

interface CoordinatesResult {
  cartesianX: number;
  cartesianY: number;
  polarR: number;
  polarTheta: number;
  polarThetaDegrees: number;
}

export default function CoordinatesCalculator() {
  const { t } = useTranslation('calc/geometry');
  const [conversionType, setConversionType] = useState<'cartesian-to-polar' | 'polar-to-cartesian'>('cartesian-to-polar');
  const [x, setX] = useState<string>('');
  const [y, setY] = useState<string>('');
  const [r, setR] = useState<string>('');
  const [theta, setTheta] = useState<string>('');
  const [angleUnit, setAngleUnit] = useState<'degrees' | 'radians'>('degrees');
  const [result, setResult] = useState<CoordinatesResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');
    if (conversionType === 'cartesian-to-polar') {
      const [xVal, yVal] = [parseFloat(x), parseFloat(y)];
      if (isNaN(xVal) || isNaN(yVal)) {
        setError(t("coordinates_calculator.error_invalid_input"));
        return false;
      }
    } else {
      const [rVal, thetaVal] = [parseFloat(r), parseFloat(theta)];
      if (isNaN(rVal) || isNaN(thetaVal)) {
        setError(t("coordinates_calculator.error_invalid_input"));
        return false;
      }
      if (rVal < 0) {
        setError(t("coordinates_calculator.error_positive_r"));
        return false;
      }
    }
    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;
    setShowResult(false);
    setTimeout(() => {
      try {
        let cartesianX, cartesianY, polarR, polarTheta, polarThetaDegrees;

        if (conversionType === 'cartesian-to-polar') {
          cartesianX = parseFloat(x);
          cartesianY = parseFloat(y);
          polarR = Math.sqrt(cartesianX ** 2 + cartesianY ** 2);
          polarTheta = Math.atan2(cartesianY, cartesianX);
          polarThetaDegrees = polarTheta * (180 / Math.PI);
        } else {
          polarR = parseFloat(r);
          let thetaRad = parseFloat(theta);
          if (angleUnit === 'degrees') {
            thetaRad = thetaRad * (Math.PI / 180);
          }
          cartesianX = polarR * Math.cos(thetaRad);
          cartesianY = polarR * Math.sin(thetaRad);
          polarTheta = thetaRad;
          polarThetaDegrees = thetaRad * (180 / Math.PI);
        }

        setResult({ cartesianX, cartesianY, polarR, polarTheta, polarThetaDegrees });
        setShowResult(true);
      } catch (err) {
        setError(t("coordinates_calculator.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setX('');
      setY('');
      setR('');
      setTheta('');
      setResult(null);
      setError('');
    }, 300);
  };


  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t("coordinates_calculator.conversion_type")} tooltip={t("coordinates_calculator.conversion_type_tooltip")}>
          <Combobox
            options={[
              { value: 'cartesian-to-polar', label: t("coordinates_calculator.cartesian_to_polar") },
              { value: 'polar-to-cartesian', label: t("coordinates_calculator.polar_to_cartesian") }
            ]}
            value={conversionType}
            onChange={(val) => setConversionType(val as 'cartesian-to-polar' | 'polar-to-cartesian')}
          />
        </InputContainer>

        {conversionType === 'cartesian-to-polar' ? (
          <>
            <InputContainer label={t("coordinates_calculator.x")} tooltip={t("coordinates_calculator.x_tooltip")}>
              <NumberInput
                value={x}
                onValueChange={(value) => { setX(String(value)); if (error) setError(''); }}
                className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
                placeholder={t("coordinates_calculator.x_placeholder")}
                step={0.01}
              />
            </InputContainer>
            <InputContainer label={t("coordinates_calculator.y")} tooltip={t("coordinates_calculator.y_tooltip")}>
              <NumberInput
                value={y}
                onValueChange={(value) => { setY(String(value)); if (error) setError(''); }}
                className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
                placeholder={t("coordinates_calculator.y_placeholder")}
                step={0.01}
              />
            </InputContainer>
          </>
        ) : (
          <>
            <InputContainer label={t("coordinates_calculator.r")} tooltip={t("coordinates_calculator.r_tooltip")}>
              <NumberInput
                value={r}
                onValueChange={(value) => { setR(String(value)); if (error) setError(''); }}
                className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
                placeholder={t("coordinates_calculator.r_placeholder")}
                step={0.01}
                min={0}
              />
            </InputContainer>
            <InputContainer label={t("coordinates_calculator.angle_unit")} tooltip={t("coordinates_calculator.angle_unit_tooltip")}>
              <Combobox
                options={[
                  { value: 'degrees', label: t("coordinates_calculator.degrees") },
                  { value: 'radians', label: t("coordinates_calculator.radians") }
                ]}
                value={angleUnit}
                onChange={(val) => setAngleUnit(val as 'degrees' | 'radians')}
              />
            </InputContainer>
            <InputContainer label={t("coordinates_calculator.theta")} tooltip={t("coordinates_calculator.theta_tooltip")}>
              <NumberInput
                value={theta}
                onValueChange={(value) => { setTheta(String(value)); if (error) setError(''); }}
                className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
                placeholder={t("coordinates_calculator.theta_placeholder")}
                step={0.01}
              />
            </InputContainer>
          </>
        )}
      </div>
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>
      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("coordinates_calculator.info_title")}</h2>
            <p className="text-foreground-70 mb-3">{t("coordinates_calculator.info_description")}</p>
          </div>
          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("coordinates_calculator.formulas_title")}</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("coordinates_calculator.formula_cartesian")}</li>
              <li>{t("coordinates_calculator.formula_polar")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("coordinates_calculator.result_title")}</div>
        <div className="text-3xl font-bold text-primary mb-2">{t("coordinates_calculator.converted_coordinates")}</div>
      </div>
      <div className="divider my-6"></div>
      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("coordinates_calculator.coordinate_systems")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("coordinates_calculator.cartesian")}</div>
            </div>
            <div className="text-sm text-foreground-70">x = {result.cartesianX.toFixed(2)}, y = {result.cartesianY.toFixed(2)}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="font-medium">{t("coordinates_calculator.polar")}</div>
            </div>
            <div className="text-sm text-foreground-70">r = {result.polarR.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">{t("coordinates_calculator.theta")} = {result.polarThetaDegrees.toFixed(2)} {t("coordinates_calculator.degrees_abbr")} ({result.polarTheta.toFixed(2)} {t("coordinates_calculator.radians_abbr")})</div>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("coordinates_calculator.formula_explanation_title")}</h4>
            <p className="text-sm text-foreground-70">{t("coordinates_calculator.formula_explanation")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("coordinates_calculator.title")}
      description={t("coordinates_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
