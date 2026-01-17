'use client';

/**
 * ALATHASIBA - EGG PRODUCTION CALCULATOR
 * Calculate egg production estimates
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Egg, DollarSign, Activity } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface EggProductionResult {
  dailyEggs: number;
  weeklyEggs: number;
  monthlyEggs: number;
  annualEggs: number;
  revenue: number;
}

export default function EggProductionCalculator() {
  const { t } = useTranslation(['calc/agriculture', 'common']);
  const [henCount, setHenCount] = useState<string>('');
  const [layRate, setLayRate] = useState<string>('80');
  const [pricePerDozen, setPricePerDozen] = useState<string>('3.00');
  const [result, setResult] = useState<EggProductionResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => { initDateInputRTL(); }, []);

  const calculate = () => {
    const count = parseFloat(henCount);
    const rate = parseFloat(layRate);
    const price = parseFloat(pricePerDozen);

    if (isNaN(count) || isNaN(rate) || isNaN(price)) {
      setError(t("egg_production.error_invalid_input"));
      return;
    }

    if (count <= 0) {
      setError(t("egg_production.error_hen_count_positive"));
      return;
    }

    if (rate <= 0 || rate > 100) {
      setError(t("egg_production.error_lay_rate_range"));
      return;
    }

    if (price < 0) {
      setError(t("egg_production.error_price_negative"));
      return;
    }

    setShowResult(false);
    setError('');

    setTimeout(() => {
      const dailyEggs = count * (rate / 100);
      const weeklyEggs = dailyEggs * 7;
      const monthlyEggs = dailyEggs * 30;
      const annualEggs = dailyEggs * 365;
      const revenue = (annualEggs / 12) * price;

      setResult({ dailyEggs, weeklyEggs, monthlyEggs, annualEggs, revenue });
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setHenCount('');
      setLayRate('80');
      setPricePerDozen('3.00');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">{t("egg_production.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("egg_production.hen_count_label")} tooltip={t("egg_production.hen_count_tooltip")}>
          <NumberInput
            value={henCount}
            onValueChange={(val) => setHenCount(val.toString())}
            onKeyPress={handleKeyPress}
            min={0}
            startIcon={<Egg className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("egg_production.lay_rate_label")} tooltip={t("egg_production.lay_rate_tooltip")}>
          <NumberInput
            value={layRate}
            onValueChange={(val) => setLayRate(val.toString())}
            onKeyPress={handleKeyPress}
            min={0}
            max={100}
            startIcon={<Activity className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("egg_production.price_label")} tooltip={t("egg_production.price_tooltip")}>
          <NumberInput
            value={pricePerDozen}
            onValueChange={(val) => setPricePerDozen(val.toString())}
            onKeyPress={handleKeyPress}
            min={0}
            step={0.01}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>
      </div>
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>
      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("egg_production.info_title")}</h2>
          <p className="text-foreground-70">{t("egg_production.info_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("egg_production.result_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">{result.dailyEggs.toFixed(0)}</div>
        <div className="text-lg text-foreground-70">{t("egg_production.result_daily")}</div>
      </div>
      <div className="divider my-6"></div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("egg_production.weekly")}</div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.weeklyEggs.toFixed(0)} {t("egg_production.unit_eggs")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("egg_production.monthly")}</div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.monthlyEggs.toFixed(0)} {t("egg_production.unit_eggs")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("egg_production.annual")}</div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.annualEggs.toFixed(0)} {t("egg_production.unit_eggs")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            {t("egg_production.annual_revenue")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{t("common:units.currencySymbol")}{result.revenue.toFixed(2)}</div>
        </div>
      </div>
    </div>
  ) : null;

  return <CalculatorLayout title={t("egg_production.title")} description={t("egg_production.description")} inputSection={inputSection} resultSection={resultSection} className="rtl" />;
}
