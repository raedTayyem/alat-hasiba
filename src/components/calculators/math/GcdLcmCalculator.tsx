'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Hash, Info, Divide, X } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface GcdLcmResult {
  gcd: number;
  lcm: number;
  gcdSteps: string[];
  lcmSteps: string[];
}

export default function GcdLcmCalculator() {
  const { t } = useTranslation('calc/math');

  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [result, setResult] = useState<GcdLcmResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const calculateGCD = (a: number, b: number): { gcd: number; steps: string[] } => {
    const steps: string[] = [];
    let x = Math.abs(a);
    let y = Math.abs(b);

    steps.push(`GCD(${x}, ${y})`);

    while (y !== 0) {
      const remainder = x % y;
      steps.push(`${x} = ${y} × ${Math.floor(x / y)} + ${remainder}`);
      x = y;
      y = remainder;
    }

    steps.push(`GCD = ${x}`);
    return { gcd: x, steps };
  };

  const calculateLCM = (a: number, b: number, gcd: number): { lcm: number; steps: string[] } => {
    const lcm = Math.abs(a * b) / gcd;
    const steps: string[] = [
      `LCM = (${Math.abs(a)} × ${Math.abs(b)}) / GCD`,
      `LCM = ${Math.abs(a * b)} / ${gcd}`,
      `LCM = ${lcm}`
    ];
    return { lcm, steps };
  };

  const validateInputs = (): boolean => {
    setError('');

    const n1 = parseInt(num1);
    const n2 = parseInt(num2);

    if (isNaN(n1) || isNaN(n2)) {
      setError(t("gcd_lcm_calculator.invalid_input"));
      return false;
    }

    if (n1 === 0 || n2 === 0) {
      setError(t("gcd_lcm_calculator.zero_not_allowed"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        const n1 = parseInt(num1);
        const n2 = parseInt(num2);

        const gcdResult = calculateGCD(n1, n2);
        const lcmResult = calculateLCM(n1, n2, gcdResult.gcd);

        setResult({
          gcd: gcdResult.gcd,
          lcm: lcmResult.lcm,
          gcdSteps: gcdResult.steps,
          lcmSteps: lcmResult.steps
        });
        setShowResult(true);
      } catch (err) {
        setError(t("gcd_lcm_calculator.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setNum1('');
      setNum2('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("gcd_lcm_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("gcd_lcm_calculator.first_number")} tooltip={t("gcd_lcm_calculator.first_number_tooltip")}>
          <NumberInput
            value={num1}
            onValueChange={(val) => { setNum1(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("gcd_lcm_calculator.number_placeholder")}
            startIcon={<Hash className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("gcd_lcm_calculator.second_number")} tooltip={t("gcd_lcm_calculator.second_number_tooltip")}>
          <NumberInput
            value={num2}
            onValueChange={(val) => { setNum2(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("gcd_lcm_calculator.number_placeholder")}
            startIcon={<Hash className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("gcd_lcm_calculator.info_title")}</h2>
          <p className="text-foreground-70">{t("gcd_lcm_calculator.description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-center mb-2">
            <Divide className="w-5 h-5 text-primary mr-2" />
            <div className="text-foreground-70">{t("gcd_lcm_calculator.gcd_label")}</div>
          </div>
          <div className="text-4xl font-bold text-primary">{result.gcd}</div>
        </div>
        <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-center mb-2">
            <X className="w-5 h-5 text-primary mr-2" />
            <div className="text-foreground-70">{t("gcd_lcm_calculator.lcm_label")}</div>
          </div>
          <div className="text-4xl font-bold text-primary">{result.lcm}</div>
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <h3 className="font-medium mb-3 flex items-center">
            <Info className="w-4 h-4 ml-2 text-info" />
            {t("gcd_lcm_calculator.gcd_steps")}
          </h3>
          <div className="space-y-1">
            {result.gcdSteps.map((step, index) => (
              <div key={index} className="text-sm text-foreground-70 font-mono pl-4 border-l-2 border-primary/20 py-1">{step}</div>
            ))}
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <h3 className="font-medium mb-3 flex items-center">
            <Info className="w-4 h-4 ml-2 text-info" />
            {t("gcd_lcm_calculator.lcm_steps")}
          </h3>
          <div className="space-y-1">
            {result.lcmSteps.map((step, index) => (
              <div key={index} className="text-sm text-foreground-70 font-mono pl-4 border-l-2 border-primary/20 py-1">{step}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("gcd_lcm_calculator.title")}
      description={t("gcd_lcm_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
