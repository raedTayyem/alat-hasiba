'use client';

/**
 * CPC Calculator
 *
 * Calculates Cost Per Click
 * Formula: CPC = Cost / Clicks
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, MousePointer, TrendingUp } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  cpc: number;
  totalClicks: number;
  totalCost: number;
}

export default function CPCCalculator() {
  const { t } = useTranslation(['calc/business', 'common']);
  const [totalCost, setTotalCost] = useState<string>('');
  const [clicks, setClicks] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const cost = parseFloat(totalCost);
    const clicksNum = parseFloat(clicks);

    if (isNaN(cost) || isNaN(clicksNum)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (cost < 0 || clicksNum <= 0) {
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
        const clicksNum = parseFloat(clicks);

        const cpc = cost / clicksNum;

        setResult({
          cpc,
          totalClicks: clicksNum,
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
      setClicks('');
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
        {t("cpc.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("cpc.inputs.total_cost")}
          tooltip={t("cpc.inputs.total_cost_tooltip")}
        >
          <NumberInput
            value={totalCost}
            onValueChange={(val) => {
              setTotalCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("cpc.inputs.total_cost_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("cpc.inputs.clicks")}
          tooltip={t("cpc.inputs.clicks_tooltip")}
        >
          <NumberInput
            value={clicks}
            onValueChange={(val) => {
              setClicks(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("cpc.inputs.clicks_placeholder")}
            startIcon={<MousePointer className="h-4 w-4" />}
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
              {t("cpc.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("cpc.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("cpc.info.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("cpc.info.use_case_1")}</li>
              <li>{t("cpc.info.use_case_2")}</li>
              <li>{t("cpc.info.use_case_3")}</li>
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
          {t("cpc.results.cpc")}
        </div>
        <div className="text-4xl font-bold mb-2 text-primary">
          {t("common:units.currencySymbol")}{formatNumber(result.cpc)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("cpc.results.per_click")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("cpc.results.summary")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("cpc.results.total_cost")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:units.currencySymbol")}{formatNumber(result.totalCost)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <MousePointer className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("cpc.results.total_clicks")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.totalClicks, 0)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <TrendingUp className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("calculators.formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("cpc.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("cpc.title")}
      description={t("cpc.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
