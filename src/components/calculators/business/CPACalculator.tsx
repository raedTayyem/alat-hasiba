'use client';

/**
 * CPA Calculator
 *
 * Calculates Cost Per Acquisition
 * Formula: CPA = Cost / Conversions
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, UserPlus, TrendingUp } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  cpa: number;
  totalConversions: number;
  totalCost: number;
}

export default function CPACalculator() {
  const { t, i18n } = useTranslation('calc/business');
  const [totalCost, setTotalCost] = useState<string>('');
  const [conversions, setConversions] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const cost = parseFloat(totalCost);
    const conv = parseFloat(conversions);

    if (isNaN(cost) || isNaN(conv)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (cost < 0 || conv <= 0) {
      setError(t("errors.positive_values_required"));
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
        const cost = parseFloat(totalCost);
        const conv = parseFloat(conversions);

        const cpa = cost / conv;

        setResult({
          cpa,
          totalConversions: conv,
          totalCost: cost,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setTotalCost('');
      setConversions('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("cpa.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("cpa.inputs.total_cost")}
          tooltip={t("cpa.inputs.total_cost_tooltip")}
        >
          <NumberInput
            value={totalCost}
            onValueChange={(val) => {
              setTotalCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("cpa.inputs.total_cost_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("cpa.inputs.conversions")}
          tooltip={t("cpa.inputs.conversions_tooltip")}
        >
          <NumberInput
            value={conversions}
            onValueChange={(val) => {
              setConversions(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("cpa.inputs.conversions_placeholder")}
            startIcon={<UserPlus className="h-4 w-4" />}
            min={0}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("cpa.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("cpa.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("cpa.info.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("cpa.info.use_case_1")}</li>
              <li>{t("cpa.info.use_case_2")}</li>
              <li>{t("cpa.info.use_case_3")}</li>
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
          {t("cpa.results.cpa")}
        </div>
        <div className="text-4xl font-bold mb-2 text-primary">
          ${formatNumber(result.cpa)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("cpa.results.per_acquisition")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("cpa.results.summary")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("cpa.results.total_cost")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.totalCost)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <UserPlus className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("cpa.results.total_conversions")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.totalConversions, 0)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <TrendingUp className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("calculators.formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("cpa.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("cpa.title")}
      description={t("cpa.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
