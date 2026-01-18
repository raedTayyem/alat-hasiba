'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, Percent, Info, ArrowRight } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

export default function PercentageCalculator() {
  const { t } = useTranslation('calc/math');
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [calculationType, setCalculationType] = useState<string>('percentageOf'); // Default calculation type
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Validation
  const validateInputs = useCallback((): boolean => {
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);

    if (isNaN(v1) || isNaN(v2)) {
      setError(t("percentage.invalid_input"));
      return false;
    }

    if ((calculationType === 'isWhatPercentOf' || calculationType === 'reversePercentage') && v2 === 0) {
      setError(t("percentage.cannot_divide_by_zero"));
      return false;
    }

    if (calculationType === 'percentageChange' && v1 === 0) {
      setError(t("percentage.original_cannot_be_zero"));
      return false;
    }

    return true;
  }, [value1, value2, calculationType, t]);

  // Calculation logic
  const calculate = useCallback(() => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const v1 = parseFloat(value1);
        const v2 = parseFloat(value2);
        let calculatedResult = 0;

        switch (calculationType) {
          case 'percentageOf':
            // What is X% of Y?
            calculatedResult = (v1 / 100) * v2;
            break;
          case 'isWhatPercentOf':
            // X is what % of Y?
            calculatedResult = (v1 / v2) * 100;
            break;
          case 'percentageChange':
            // Percentage change from X to Y
            calculatedResult = ((v2 - v1) / v1) * 100;
            break;
          case 'reversePercentage':
            // X is Y% of what?
            calculatedResult = (v1 * 100) / v2;
            break;
          default:
            calculatedResult = 0;
        }

        setResult(calculatedResult);
        setShowResult(true);
      } catch (err) {
        setError(t("percentage.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  }, [validateInputs, value1, value2, calculationType, t]);

  const resetCalculator = useCallback(() => {
    setShowResult(false);
    setTimeout(() => {
      setValue1('');
      setValue2('');
      setResult(null);
      setError('');
    }, 300);
  }, []);

  // Format number
  // Event handlers
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  }, [calculate]);

  // Get labels based on calculation type
  const getLabels = () => {
    switch (calculationType) {
      case 'percentageOf':
        return {
          label1: t("percentage.percent_label"),
          label2: t("percentage.of_value_label"),
          placeholder1: t("percentage.percent_placeholder"),
          placeholder2: t("percentage.of_value_placeholder"),
          resultLabel: t("percentage.result_is"),
          icon1: <Percent className="h-4 w-4" />,
          icon2: <ArrowRight className="h-4 w-4" />
        };
      case 'isWhatPercentOf':
        return {
          label1: t("percentage.value_label"),
          label2: t("percentage.total_label"),
          placeholder1: t("percentage.value_placeholder"),
          placeholder2: t("percentage.total_placeholder"),
          resultLabel: t("percentage.is_percent"),
          icon1: <ArrowRight className="h-4 w-4" />,
          icon2: <ArrowRight className="h-4 w-4" />
        };
      case 'percentageChange':
        return {
          label1: t("percentage.original_label"),
          label2: t("percentage.new_label"),
          placeholder1: t("percentage.original_placeholder"),
          placeholder2: t("percentage.new_placeholder"),
          resultLabel: t("percentage.change_is"),
          icon1: <ArrowRight className="h-4 w-4" />,
          icon2: <ArrowRight className="h-4 w-4" />
        };
      case 'reversePercentage':
        return {
          label1: t("percentage.part_label"),
          label2: t("percentage.percentage_label"),
          placeholder1: t("percentage.part_placeholder"),
          placeholder2: t("percentage.percentage_placeholder"),
          resultLabel: t("percentage.whole_is"),
          icon1: <ArrowRight className="h-4 w-4" />,
          icon2: <Percent className="h-4 w-4" />
        };
      default:
        return {
          label1: '',
          label2: '',
          placeholder1: '',
          placeholder2: '',
          resultLabel: '',
          icon1: <ArrowRight className="h-4 w-4" />,
          icon2: <ArrowRight className="h-4 w-4" />
        };
    }
  };

  const labels = getLabels();

  const calculationTypeOptions = [
    { value: 'percentageOf', label: t("percentage.what_is_percent_of") },
    { value: 'isWhatPercentOf', label: t("percentage.is_what_percent_of") },
    { value: 'percentageChange', label: t("percentage.percentage_change") },
    { value: 'reversePercentage', label: t("percentage.is_percent_of_what") },
  ];

  // Input section
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("percentage.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Calculation Type Selector */}
        <FormField
          label={t("percentage.calculation_type")}
          tooltip={t("percentage.calculation_type_tooltip")}
        >
          <Combobox
            options={calculationTypeOptions}
            value={calculationType}
            onChange={(val) => setCalculationType(val)}
            placeholder={t("percentage.calculation_type")}
          />
        </FormField>

        {/* Value 1 Input */}
        <FormField
          label={labels.label1}
          tooltip={labels.label1}
        >
          <NumberInput
            value={value1}
            onValueChange={(val) => {
              setValue1(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={labels.placeholder1}
            startIcon={labels.icon1}
          />
        </FormField>

        {/* Value 2 Input */}
        <FormField
          label={labels.label2}
          tooltip={labels.label2}
        >
          <NumberInput
            value={value2}
            onValueChange={(val) => {
              setValue2(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={labels.placeholder2}
            startIcon={labels.icon2}
          />
        </FormField>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      {/* Error Message */}
      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {/* Information Section */}
      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("percentage.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("percentage.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("percentage.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("percentage.use_case_1")}</li>
              <li>{t("percentage.use_case_2")}</li>
              <li>{t("percentage.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  // Result section
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {labels.resultLabel}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result).toFixed(2)}
          {calculationType !== 'reversePercentage' && calculationType !== 'percentageOf' ? '%' : ''}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("percentage.calculation_details")}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calculator className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("percentage.calculation_used")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              {calculationType === 'percentageOf' && `(${value1} / 100) × ${value2}`}
              {calculationType === 'isWhatPercentOf' && `(${value1} / ${value2}) × 100`}
              {calculationType === 'percentageChange' && `((${value2} - ${value1}) / ${value1}) × 100`}
              {calculationType === 'reversePercentage' && `(${value1} × 100) / ${value2}`}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("percentage.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("percentage.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("percentage.page_title")}
      description={t("percentage.page_description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
