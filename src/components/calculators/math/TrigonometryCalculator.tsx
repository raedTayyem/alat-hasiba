'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

export default function TrigonometryCalculator() {
  const { t } = useTranslation('calc/math');

  const [function1, setFunction] = useState<string>('sin');
  const [angle, setAngle] = useState<string>('');
  const [angleUnit, setAngleUnit] = useState<string>('degrees');
  const [result, setResult] = useState<{value: number; inverse?: number} | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  const toDegrees = (radians: number) => radians * (180 / Math.PI);

  const validateInputs = (): boolean => {
    setError('');
    const ang = parseFloat(angle);

    if (isNaN(ang)) {
      setError(t("trigonometry_calculator.invalid_angle"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        let ang = parseFloat(angle);
        if (angleUnit === 'degrees') {
          ang = toRadians(ang);
        }

        let resultValue = 0;
        let inverseValue;

        switch (function1) {
          case 'sin':
            resultValue = Math.sin(ang);
            inverseValue = toDegrees(Math.asin(resultValue));
            break;
          case 'cos':
            resultValue = Math.cos(ang);
            inverseValue = toDegrees(Math.acos(resultValue));
            break;
          case 'tan':
            resultValue = Math.tan(ang);
            inverseValue = toDegrees(Math.atan(resultValue));
            break;
          case 'cot':
            resultValue = 1 / Math.tan(ang);
            inverseValue = toDegrees(Math.atan(1 / resultValue));
            break;
          case 'sec':
            resultValue = 1 / Math.cos(ang);
            break;
          case 'csc':
            resultValue = 1 / Math.sin(ang);
            break;
        }

        setResult({value: resultValue, inverse: inverseValue});
        setShowResult(true);
      } catch (err) {
        setError(t("trigonometry_calculator.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setAngle('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const functionOptions = [
    { value: 'sin', label: t("trigonometry_calculator.sin") },
    { value: 'cos', label: t("trigonometry_calculator.cos") },
    { value: 'tan', label: t("trigonometry_calculator.tan") },
    { value: 'cot', label: t("trigonometry_calculator.cot") },
    { value: 'sec', label: t("trigonometry_calculator.sec") },
    { value: 'csc', label: t("trigonometry_calculator.csc") },
  ];

  const angleUnitOptions = [
    { value: 'degrees', label: t("trigonometry_calculator.degrees") },
    { value: 'radians', label: t("trigonometry_calculator.radians") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("trigonometry_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("trigonometry_calculator.function")} tooltip={t("trigonometry_calculator.function_tooltip")}>
          <Combobox
            options={functionOptions}
            value={function1}
            onChange={(val) => setFunction(val)}
            placeholder={t("trigonometry_calculator.function")}
          />
        </FormField>

        <FormField label={t("trigonometry_calculator.angle_unit")} tooltip={t("trigonometry_calculator.unit_tooltip")}>
          <Combobox
            options={angleUnitOptions}
            value={angleUnit}
            onChange={(val) => setAngleUnit(val)}
            placeholder={t("trigonometry_calculator.angle_unit")}
          />
        </FormField>

        <FormField label={t("trigonometry_calculator.angle")} tooltip={t("trigonometry_calculator.angle_tooltip")}>
          <NumberInput
            value={angle}
            onValueChange={(val) => setAngle(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="45"
            startIcon={<Compass className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold mb-4">{t("trigonometry_calculator.result")}</h3>
        <div className="text-4xl font-bold text-primary">{result.value.toFixed(8)}</div>
      </div>

      {result.inverse !== undefined && (
        <div className="text-center mb-4">
          <div className="text-foreground-70 mb-2">{t("trigonometry_calculator.inverse")}</div>
          <div className="text-2xl font-bold text-primary">{result.inverse.toFixed(4)}°</div>
        </div>
      )}

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("trigonometry_calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70 font-mono" dir="ltr">
              {function1}({angle}°) = {result.value.toFixed(8)}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("trigonometry_calculator.title")}
      description={t("trigonometry_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
