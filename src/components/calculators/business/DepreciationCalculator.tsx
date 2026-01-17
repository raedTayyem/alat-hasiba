'use client';

/**
 * Depreciation Calculator
 *
 * Calculates asset depreciation using different methods
 * Formulas:
 * - Straight-line: (Cost - Salvage Value) / Useful Life
 * - Declining Balance: Book Value × (Depreciation Rate)
 * - Double Declining: Book Value × (2 / Useful Life)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Calendar, TrendingDown, Building2 } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface YearlyDepreciation {
  year: number;
  depreciation: number;
  accumulatedDepreciation: number;
  bookValue: number;
}

interface CalculatorResult {
  assetCost: number;
  salvageValue: number;
  usefulLife: number;
  method: DepreciationMethod;
  annualDepreciation: number;
  totalDepreciation: number;
  schedule: YearlyDepreciation[];
}

type DepreciationMethod = 'straight_line' | 'declining_balance' | 'double_declining';

export default function DepreciationCalculator() {
  const { t } = useTranslation('calc/business');
  const [assetCost, setAssetCost] = useState<string>('');
  const [salvageValue, setSalvageValue] = useState<string>('');
  const [usefulLife, setUsefulLife] = useState<string>('');
  const [method, setMethod] = useState<DepreciationMethod>('straight_line');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const cost = parseFloat(assetCost);
    const salvage = parseFloat(salvageValue);
    const life = parseFloat(usefulLife);

    if (isNaN(cost) || cost <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (isNaN(salvage) || salvage < 0) {
      setError(t("depreciation.errors.invalid_salvage"));
      return false;
    }

    if (salvage >= cost) {
      setError(t("depreciation.errors.salvage_exceeds_cost"));
      return false;
    }

    if (isNaN(life) || life <= 0 || !Number.isInteger(life)) {
      setError(t("depreciation.errors.invalid_life"));
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
        const cost = parseFloat(assetCost);
        const salvage = parseFloat(salvageValue);
        const life = parseInt(usefulLife);

        const schedule: YearlyDepreciation[] = [];
        let annualDep = 0;
        let totalDep = 0;

        if (method === 'straight_line') {
          // Straight-line method
          annualDep = (cost - salvage) / life;
          let accumulatedDep = 0;

          for (let year = 1; year <= life; year++) {
            accumulatedDep += annualDep;
            schedule.push({
              year,
              depreciation: annualDep,
              accumulatedDepreciation: accumulatedDep,
              bookValue: cost - accumulatedDep,
            });
          }

          totalDep = cost - salvage;
        } else if (method === 'declining_balance') {
          // Declining Balance (150%)
          const rate = (1 / life) * 1.5;
          let bookValue = cost;
          let accumulatedDep = 0;

          for (let year = 1; year <= life; year++) {
            let yearDep = bookValue * rate;

            // Make sure we don't depreciate below salvage value
            if (bookValue - yearDep < salvage) {
              yearDep = bookValue - salvage;
            }

            accumulatedDep += yearDep;
            bookValue -= yearDep;

            schedule.push({
              year,
              depreciation: yearDep,
              accumulatedDepreciation: accumulatedDep,
              bookValue: bookValue,
            });

            if (bookValue <= salvage) break;
          }

          annualDep = schedule[0]?.depreciation || 0;
          totalDep = cost - (schedule[schedule.length - 1]?.bookValue || salvage);
        } else {
          // Double Declining Balance (200%)
          const rate = 2 / life;
          let bookValue = cost;
          let accumulatedDep = 0;

          for (let year = 1; year <= life; year++) {
            let yearDep = bookValue * rate;

            // Make sure we don't depreciate below salvage value
            if (bookValue - yearDep < salvage) {
              yearDep = bookValue - salvage;
            }

            accumulatedDep += yearDep;
            bookValue -= yearDep;

            schedule.push({
              year,
              depreciation: yearDep,
              accumulatedDepreciation: accumulatedDep,
              bookValue: bookValue,
            });

            if (bookValue <= salvage) break;
          }

          annualDep = schedule[0]?.depreciation || 0;
          totalDep = cost - (schedule[schedule.length - 1]?.bookValue || salvage);
        }

        setResult({
          assetCost: cost,
          salvageValue: salvage,
          usefulLife: life,
          method: method,
          annualDepreciation: annualDep,
          totalDepreciation: totalDep,
          schedule: schedule,
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
      setAssetCost('');
      setSalvageValue('');
      setUsefulLife('');
      setMethod('straight_line');
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
        {t("depreciation.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("depreciation.inputs.asset_cost")}
          tooltip={t("depreciation.inputs.asset_cost_tooltip")}
        >
          <NumberInput
            value={assetCost}
            onValueChange={(val) => {
              setAssetCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("depreciation.inputs.asset_cost_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("depreciation.inputs.salvage_value")}
          tooltip={t("depreciation.inputs.salvage_value_tooltip")}
        >
          <NumberInput
            value={salvageValue}
            onValueChange={(val) => {
              setSalvageValue(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("depreciation.inputs.salvage_value_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("depreciation.inputs.useful_life")}
          tooltip={t("depreciation.inputs.useful_life_tooltip")}
        >
          <NumberInput
            value={usefulLife}
            onValueChange={(val) => {
              setUsefulLife(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("depreciation.inputs.useful_life_placeholder")}
            startIcon={<Calendar className="h-4 w-4" />}
            min={1}
            step={1}
          />
        </FormField>

        <FormField
          label={t("depreciation.inputs.method")}
          tooltip={t("depreciation.inputs.method_tooltip")}
        >
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setMethod('straight_line')}
              className={`py-3 px-4 rounded-xl border-2 transition-all text-start ${
                method === 'straight_line'
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {t("depreciation.inputs.straight_line")}
            </button>
            <button
              type="button"
              onClick={() => setMethod('declining_balance')}
              className={`py-3 px-4 rounded-xl border-2 transition-all text-start ${
                method === 'declining_balance'
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {t("depreciation.inputs.declining_balance")}
            </button>
            <button
              type="button"
              onClick={() => setMethod('double_declining')}
              className={`py-3 px-4 rounded-xl border-2 transition-all text-start ${
                method === 'double_declining'
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {t("depreciation.inputs.double_declining")}
            </button>
          </div>
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
              {t("depreciation.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("depreciation.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("depreciation.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("depreciation.info.use_case_1")}</li>
              <li>{t("depreciation.info.use_case_2")}</li>
              <li>{t("depreciation.info.use_case_3")}</li>
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
          {method === 'straight_line'
            ? t("depreciation.results.annual_depreciation")
            : t("depreciation.results.first_year_depreciation")}
        </div>
        <div className="text-4xl font-bold mb-2 text-primary">
          ${formatNumber(result.annualDepreciation)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("depreciation.results.total_depreciation")}: ${formatNumber(result.totalDepreciation)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("depreciation.results.summary")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Building2 className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("depreciation.results.asset_cost")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.assetCost)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t("depreciation.results.salvage_value")}</div>
            </div>
            <div className="text-2xl font-bold text-success">${formatNumber(result.salvageValue)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-info ml-2" />
              <div className="font-medium">{t("depreciation.results.useful_life")}</div>
            </div>
            <div className="text-2xl font-bold text-info">{result.usefulLife} {t("depreciation.results.years")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingDown className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t("depreciation.results.method")}</div>
            </div>
            <div className="text-lg font-bold text-warning">
              {method === 'straight_line' && t("depreciation.inputs.straight_line")}
              {method === 'declining_balance' && t("depreciation.inputs.declining_balance")}
              {method === 'double_declining' && t("depreciation.inputs.double_declining")}
            </div>
          </div>
        </div>
      </div>

      {/* Depreciation Schedule Table */}
      <div className="mt-6">
        <h3 className="font-medium mb-3">
          {t("depreciation.results.schedule")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-3 text-start">{t("depreciation.results.year")}</th>
                <th className="py-2 px-3 text-start">{t("depreciation.results.depreciation")}</th>
                <th className="py-2 px-3 text-start">{t("depreciation.results.accumulated")}</th>
                <th className="py-2 px-3 text-start">{t("depreciation.results.book_value")}</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((row) => (
                <tr key={row.year} className="border-b border-border/50">
                  <td className="py-2 px-3">{row.year}</td>
                  <td className="py-2 px-3">${formatNumber(row.depreciation)}</td>
                  <td className="py-2 px-3">${formatNumber(row.accumulatedDepreciation)}</td>
                  <td className="py-2 px-3">${formatNumber(row.bookValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <TrendingDown className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("calculators.formula")}</h4>
            <p className="text-sm text-foreground-70">
              {method === 'straight_line' && t("depreciation.results.formula_straight_line")}
              {method === 'declining_balance' && t("depreciation.results.formula_declining")}
              {method === 'double_declining' && t("depreciation.results.formula_double_declining")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("depreciation.title")}
      description={t("depreciation.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
