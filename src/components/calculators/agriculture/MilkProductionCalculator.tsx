'use client';

/**
 * ALATHASIBA - MILK PRODUCTION CALCULATOR
 * Calculate milk production estimates
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Milk, DollarSign, Activity } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface MilkProductionResult {
  dailyProduction: number;
  weeklyProduction: number;
  monthlyProduction: number;
  annualProduction: number;
  revenue: number;
}

export default function MilkProductionCalculator() {
  const { t, i18n } = useTranslation(['calc/agriculture', 'common']);
  const [cowCount, setCowCount] = useState<string>('');
  const [avgMilkPerCow, setAvgMilkPerCow] = useState<string>('');
  const [pricePerGallon, setPricePerGallon] = useState<string>('3.50');
  const [result, setResult] = useState<MilkProductionResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => { initDateInputRTL(); }, []);

  const calculate = () => {
    const count = parseFloat(cowCount);
    const milk = parseFloat(avgMilkPerCow);
    const price = parseFloat(pricePerGallon);

    if (isNaN(count) || isNaN(milk) || isNaN(price)) {
      setError(t("milk_production.error_invalid_input"));
      return;
    }

    if (count <= 0 || milk <= 0) {
      setError(t("milk_production.error_positive_required"));
      return;
    }

    if (price < 0) {
      setError(t("milk_production.error_price_negative"));
      return;
    }

    setShowResult(false);
    setError('');

    setTimeout(() => {
      const dailyProduction = count * milk;
      const weeklyProduction = dailyProduction * 7;
      const monthlyProduction = dailyProduction * 30;
      const annualProduction = dailyProduction * 365;
      const revenue = annualProduction * price;

      setResult({ dailyProduction, weeklyProduction, monthlyProduction, annualProduction, revenue });
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCowCount('');
      setAvgMilkPerCow('');
      setPricePerGallon('3.50');
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
      <div className="text-2xl font-bold mb-6 text-center">{t("milk_production.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("milk_production.cow_count_label")} tooltip={t("milk_production.cow_count_tooltip")}>
          <NumberInput
            value={cowCount}
            onValueChange={(val) => setCowCount(val.toString())}
            onKeyPress={handleKeyPress}
            min={0}
            startIcon={<Activity className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("milk_production.milk_per_cow_label")} tooltip={t("milk_production.milk_per_cow_tooltip")}>
          <NumberInput
            value={avgMilkPerCow}
            onValueChange={(val) => setAvgMilkPerCow(val.toString())}
            onKeyPress={handleKeyPress}
            min={0}
            step={0.1}
            startIcon={<Milk className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("milk_production.price_label")} tooltip={t("milk_production.price_tooltip")}>
          <NumberInput
            value={pricePerGallon}
            onValueChange={(val) => setPricePerGallon(val.toString())}
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
          <h2 className="font-bold mb-2 text-lg">{t("milk_production.info_title")}</h2>
          <p className="text-foreground-70">{t("milk_production.info_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("milk_production.result_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">{result.dailyProduction.toFixed(1)}</div>
        <div className="text-lg text-foreground-70">{t("milk_production.result_daily")}</div>
      </div>
      <div className="divider my-6"></div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("milk_production.weekly")}</div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.weeklyProduction.toFixed(0)} {t("milk_production.unit_gal")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("milk_production.monthly")}</div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.monthlyProduction.toFixed(0)} {t("milk_production.unit_gal")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("milk_production.annual")}</div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.annualProduction.toFixed(0)} {t("milk_production.unit_gal")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            {t("milk_production.annual_revenue")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{t("common:units.currencySymbol")}{result.revenue.toLocaleString('en-US', {maximumFractionDigits: 2})}</div>
        </div>
      </div>
    </div>
  ) : null;

  return <CalculatorLayout title={t("milk_production.title")} description={t("milk_production.description")} inputSection={inputSection} resultSection={resultSection} className="rtl" />;
}
