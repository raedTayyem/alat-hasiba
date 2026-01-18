'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Hash, CheckCircle } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function LogarithmCalculator() {
  const { t } = useTranslation('calc/math');

  const [logType, setLogType] = useState<string>('log10');
  const [value, setValue] = useState<string>('');
  const [base, setBase] = useState<string>('10');
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');
    const val = parseFloat(value);

    if (isNaN(val)) {
      setError(t("logarithm_calculator.invalid_input"));
      return false;
    }

    if (val <= 0) {
      setError(t("logarithm_calculator.positive_only"));
      return false;
    }

    if (logType === 'custom') {
      const b = parseFloat(base);
      if (isNaN(b) || b <= 0 || b === 1) {
        setError(t("logarithm_calculator.invalid_base"));
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
        const val = parseFloat(value);
        let resultValue = 0;

        switch (logType) {
          case 'log10':
            resultValue = Math.log10(val);
            break;
          case 'ln':
            resultValue = Math.log(val);
            break;
          case 'log2':
            resultValue = Math.log2(val);
            break;
          case 'custom': {
            const b = parseFloat(base);
            resultValue = Math.log(val) / Math.log(b);
            break;
          }
        }

        setResult(resultValue);
        setShowResult(true);
      } catch (err) {
        setError(t("logarithm_calculator.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setValue('');
      setBase('10');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const logTypeOptions = [
    { value: 'log10', label: t("logarithm_calculator.log10") },
    { value: 'ln', label: t("logarithm_calculator.ln") },
    { value: 'log2', label: t("logarithm_calculator.log2") },
    { value: 'custom', label: t("logarithm_calculator.custom") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("logarithm_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("logarithm_calculator.log_type")} tooltip={t("logarithm_calculator.type_tooltip")}>
          <Combobox
            options={logTypeOptions}
            value={logType}
            onChange={(val) => setLogType(val)}
            placeholder={t("logarithm_calculator.log_type")}
          />
        </FormField>

        <FormField label={t("logarithm_calculator.value")} tooltip={t("logarithm_calculator.value_tooltip")}>
          <NumberInput
            value={value}
            onValueChange={(val) => setValue(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="100"
            startIcon={<Hash className="h-4 w-4" />}
          />
        </FormField>

        {logType === 'custom' && (
          <FormField label={t("logarithm_calculator.base")} tooltip={t("logarithm_calculator.base_tooltip")}>
            <NumberInput
              value={base}
              onValueChange={(val) => setBase(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder="10"
              startIcon={<Hash className="h-4 w-4" />}
            />
          </FormField>
        )}
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <h3 className="text-xl font-bold mb-4 text-center">{t("logarithm_calculator.result")}</h3>
      <div className="text-center">
        <div className="text-4xl font-bold text-primary">{result.toFixed(8)}</div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <CheckCircle className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("logarithm_calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70 font-mono" dir="ltr">
              {logType === 'log10' && `log₁₀(${value}) = ${result.toFixed(8)}`}
              {logType === 'ln' && `ln(${value}) = ${result.toFixed(8)}`}
              {logType === 'log2' && `log₂(${value}) = ${result.toFixed(8)}`}
              {logType === 'custom' && `log₍${base}₎(${value}) = ${result.toFixed(8)}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("logarithm_calculator.title")}
      description={t("logarithm_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
