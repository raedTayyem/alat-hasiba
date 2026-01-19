'use client';

/**
 * Cash Flow Calculator
 *
 * Calculates Net Cash Flow = Inflows - Outflows
 * Provides analysis of cash flow by period
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, TrendingUp, TrendingDown, ArrowRightLeft, Plus, Trash2 } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CashFlowPeriod {
  id: number;
  inflow: string;
  outflow: string;
}

interface CalculatorResult {
  totalInflows: number;
  totalOutflows: number;
  netCashFlow: number;
  periodResults: { period: number; inflow: number; outflow: number; net: number }[];
  averageNetCashFlow: number;
}

export default function CashFlowCalculator() {
  const { t } = useTranslation('calc/business');
  const [periods, setPeriods] = useState<CashFlowPeriod[]>([
    { id: 1, inflow: '', outflow: '' },
    { id: 2, inflow: '', outflow: '' },
    { id: 3, inflow: '', outflow: '' },
  ]);

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const addPeriod = () => {
    const newId = periods.length > 0 ? Math.max(...periods.map(p => p.id)) + 1 : 1;
    setPeriods([...periods, { id: newId, inflow: '', outflow: '' }]);
  };

  const removePeriod = (id: number) => {
    if (periods.length > 1) {
      setPeriods(periods.filter(p => p.id !== id));
    }
  };

  const updatePeriod = (id: number, field: 'inflow' | 'outflow', value: string) => {
    setPeriods(periods.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
    if (error) setError('');
  };

  const validateInputs = (): boolean => {
    setError('');

    for (const period of periods) {
      const inflow = parseFloat(period.inflow);
      const outflow = parseFloat(period.outflow);

      if (isNaN(inflow) || isNaN(outflow)) {
        setError(t("errors.invalid_input"));
        return false;
      }

      if (inflow < 0 || outflow < 0) {
        setError(t("errors.positive_values_required"));
        return false;
      }
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
        let totalInflows = 0;
        let totalOutflows = 0;
        const periodResults: { period: number; inflow: number; outflow: number; net: number }[] = [];

        periods.forEach((period, index) => {
          const inflow = parseFloat(period.inflow);
          const outflow = parseFloat(period.outflow);
          const net = inflow - outflow;

          totalInflows += inflow;
          totalOutflows += outflow;
          periodResults.push({
            period: index + 1,
            inflow,
            outflow,
            net,
          });
        });

        const netCashFlow = totalInflows - totalOutflows;
        const averageNetCashFlow = netCashFlow / periods.length;

        setResult({
          totalInflows,
          totalOutflows,
          netCashFlow,
          periodResults,
          averageNetCashFlow,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setPeriods([
        { id: 1, inflow: '', outflow: '' },
        { id: 2, inflow: '', outflow: '' },
        { id: 3, inflow: '', outflow: '' },
      ]);
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("cash_flow.title")}
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {periods.map((period, index) => (
          <div key={period.id} className="bg-card-bg border border-border rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">{t("cash_flow.inputs.period")} {index + 1}</span>
              {periods.length > 1 && (
                <button
                  onClick={() => removePeriod(period.id)}
                  className="text-error hover:text-error/80 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label={t("cash_flow.inputs.inflow")}
                tooltip={t("cash_flow.inputs.inflow_tooltip")}
              >
                <NumberInput
                  value={period.inflow}
                  onValueChange={(val) => updatePeriod(period.id, 'inflow', val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t("cash_flow.inputs.inflow_placeholder")}
                  startIcon={<DollarSign className="h-4 w-4" />}
                  min={0}
                />
              </FormField>

              <FormField
                label={t("cash_flow.inputs.outflow")}
                tooltip={t("cash_flow.inputs.outflow_tooltip")}
              >
                <NumberInput
                  value={period.outflow}
                  onValueChange={(val) => updatePeriod(period.id, 'outflow', val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t("cash_flow.inputs.outflow_placeholder")}
                  startIcon={<DollarSign className="h-4 w-4" />}
                  min={0}
                />
              </FormField>
            </div>
          </div>
        ))}

        <button
          onClick={addPeriod}
          className="w-full py-3 border-2 border-dashed border-border rounded-xl text-foreground-70 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("cash_flow.inputs.add_period")}
        </button>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("cash_flow.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("cash_flow.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("cash_flow.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("cash_flow.info.use_case_1")}</li>
              <li>{t("cash_flow.info.use_case_2")}</li>
              <li>{t("cash_flow.info.use_case_3")}</li>
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
          {t("cash_flow.results.net_cash_flow")}
        </div>
        <div className={`text-4xl font-bold mb-2 ${result.netCashFlow >= 0 ? 'text-success' : 'text-error'}`}>
          ${formatNumber(result.netCashFlow)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("cash_flow.results.average_per_period")}: ${formatNumber(result.averageNetCashFlow)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 text-success ml-2" />
            <div className="font-medium">{t("cash_flow.results.total_inflows")}</div>
          </div>
          <div className="text-2xl font-bold text-success">${formatNumber(result.totalInflows)}</div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <TrendingDown className="w-5 h-5 text-error ml-2" />
            <div className="font-medium">{t("cash_flow.results.total_outflows")}</div>
          </div>
          <div className="text-2xl font-bold text-error">${formatNumber(result.totalOutflows)}</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("cash_flow.results.period_breakdown")}
        </h3>

        <div className="space-y-2">
          {result.periodResults.map((pr) => (
            <div key={pr.period} className="bg-card p-3 rounded-lg border border-border flex justify-between items-center">
              <span className="font-medium">{t("cash_flow.inputs.period")} {pr.period}</span>
              <span className={`font-bold ${pr.net >= 0 ? 'text-success' : 'text-error'}`}>
                ${formatNumber(pr.net)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <ArrowRightLeft className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("cash_flow.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("cash_flow.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("cash_flow.title")}
      description={t("cash_flow.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
