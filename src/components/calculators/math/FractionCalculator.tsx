'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Divide, Hash } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface FractionResult {
  result: string;
  decimal: number;
  simplified: string;
}

export default function FractionCalculator() {
  const { t } = useTranslation('calc/math');

  const [operation, setOperation] = useState<string>('add');
  const [num1, setNum1] = useState<string>('');
  const [denom1, setDenom1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [denom2, setDenom2] = useState<string>('');
  const [result, setResult] = useState<FractionResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const simplifyFraction = (numerator: number, denominator: number): string => {
    if (denominator === 0) return 'undefined';
    const divisor = gcd(numerator, denominator);
    const simpleNum = numerator / divisor;
    const simpleDenom = denominator / divisor;

    if (simpleDenom === 1) return simpleNum.toString();
    if (simpleDenom < 0) return `${-simpleNum}/${-simpleDenom}`;
    return `${simpleNum}/${simpleDenom}`;
  };

  const validateInputs = (): boolean => {
    setError('');

    const n1 = parseInt(num1);
    const d1 = parseInt(denom1);
    const n2 = parseInt(num2);
    const d2 = parseInt(denom2);

    if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) {
      setError(t("fraction_calculator.invalid_input"));
      return false;
    }

    if (d1 === 0 || d2 === 0) {
      setError(t("fraction_calculator.denominator_zero"));
      return false;
    }

    if (operation === 'divide' && n2 === 0) {
      setError(t("fraction_calculator.divide_by_zero"));
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
        const d1 = parseInt(denom1);
        const n2 = parseInt(num2);
        const d2 = parseInt(denom2);

        let resultNum = 0;
        let resultDenom = 1;

        switch (operation) {
          case 'add':
            resultNum = n1 * d2 + n2 * d1;
            resultDenom = d1 * d2;
            break;
          case 'subtract':
            resultNum = n1 * d2 - n2 * d1;
            resultDenom = d1 * d2;
            break;
          case 'multiply':
            resultNum = n1 * n2;
            resultDenom = d1 * d2;
            break;
          case 'divide':
            resultNum = n1 * d2;
            resultDenom = d1 * n2;
            break;
        }

        const simplified = simplifyFraction(resultNum, resultDenom);
        const decimal = resultNum / resultDenom;

        setResult({
          result: `${resultNum}/${resultDenom}`,
          decimal,
          simplified
        });
        setShowResult(true);
      } catch (err) {
        setError(t("fraction_calculator.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setNum1('');
      setDenom1('');
      setNum2('');
      setDenom2('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const operationOptions = [
    { value: 'add', label: t("fraction_calculator.add") },
    { value: 'subtract', label: t("fraction_calculator.subtract") },
    { value: 'multiply', label: t("fraction_calculator.multiply") },
    { value: 'divide', label: t("fraction_calculator.divide") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("fraction_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("fraction_calculator.operation")} tooltip={t("fraction_calculator.operation_tooltip")}>
          <Combobox
            options={operationOptions}
            value={operation}
            onChange={(val) => setOperation(val)}
            placeholder={t("fraction_calculator.operation")}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label={t("fraction_calculator.numerator1")} tooltip={t("fraction_calculator.numerator_tooltip")}>
            <NumberInput
              value={num1}
              onValueChange={(val) => { setNum1(val.toString()); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder="0"
              startIcon={<Hash className="h-4 w-4" />}
            />
          </FormField>

          <FormField label={t("fraction_calculator.denominator1")} tooltip={t("fraction_calculator.denominator_tooltip")}>
            <NumberInput
              value={denom1}
              onValueChange={(val) => { setDenom1(val.toString()); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder="1"
              startIcon={<Divide className="h-4 w-4" />}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label={t("fraction_calculator.numerator2")} tooltip={t("fraction_calculator.numerator_tooltip")}>
            <NumberInput
              value={num2}
              onValueChange={(val) => { setNum2(val.toString()); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder="0"
              startIcon={<Hash className="h-4 w-4" />}
            />
          </FormField>

          <FormField label={t("fraction_calculator.denominator2")} tooltip={t("fraction_calculator.denominator_tooltip")}>
            <NumberInput
              value={denom2}
              onValueChange={(val) => { setDenom2(val.toString()); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder="1"
              startIcon={<Divide className="h-4 w-4" />}
            />
          </FormField>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("fraction_calculator.info_title")}</h2>
          <p className="text-foreground-70">{t("fraction_calculator.description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("fraction_calculator.result_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{result.simplified}</div>
        <div className="text-lg text-foreground-70">{result.decimal.toFixed(4)}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("fraction_calculator.unsimplified")}</div>
          <div className="text-sm text-foreground-70">{result.result}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("fraction_calculator.simplified")}</div>
          <div className="text-sm text-foreground-70">{result.simplified}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("fraction_calculator.decimal_form")}</div>
          <div className="text-sm text-foreground-70">{result.decimal}</div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("fraction_calculator.title")}
      description={t("fraction_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
