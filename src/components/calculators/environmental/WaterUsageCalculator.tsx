'use client';

/**
 * Water Usage Calculator
 * Calculates daily and monthly water consumption
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  dailyUsage: number;
  monthlyUsage: number;
  yearlyUsage: number;
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  comparison: string;
}

export default function WaterUsageCalculator() {
  const { t } = useTranslation();
  const [showerMinutes, setShowerMinutes] = useState<string>('');
  const [toiletFlushes, setToiletFlushes] = useState<string>('');
  const [dishwashing, setDishwashing] = useState<string>('');
  const [laundryLoads, setLaundryLoads] = useState<string>('');
  const [costPerLiter, setCostPerLiter] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const shower = parseFloat(showerMinutes) || 0;
    const toilet = parseFloat(toiletFlushes) || 0;
    const dish = parseFloat(dishwashing) || 0;
    const laundry = parseFloat(laundryLoads) || 0;
    const cost = parseFloat(costPerLiter);

    if (shower === 0 && toilet === 0 && dish === 0 && laundry === 0) {
      setError(t("calculators.environmental.water_usage.error_at_least_one"));
      return false;
    }

    if (shower < 0 || toilet < 0 || dish < 0 || laundry < 0 || cost < 0) {
      setError(t("calculators.environmental.water_usage.error_negative"));
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
        const shower = parseFloat(showerMinutes) || 0;
        const toilet = parseFloat(toiletFlushes) || 0;
        const dish = parseFloat(dishwashing) || 0;
        const laundry = parseFloat(laundryLoads) || 0;
        const cost = parseFloat(costPerLiter) || 0;

        const showerUsage = shower * 10;
        const toiletUsage = toilet * 6;
        const dishUsage = dish * 15;
        const laundryUsage = laundry * 50;

        const dailyUsage = showerUsage + toiletUsage + dishUsage + laundryUsage;
        const monthlyUsage = dailyUsage * 30;
        const yearlyUsage = dailyUsage * 365;

        const dailyCost = dailyUsage * cost;
        const monthlyCost = monthlyUsage * cost;
        const yearlyCost = yearlyUsage * cost;

        let comparison = '';
        if (dailyUsage < 100) {
          comparison = t("calculators.environmental.water_usage.comparison_low");
        } else if (dailyUsage < 200) {
          comparison = t("calculators.environmental.water_usage.comparison_average");
        } else {
          comparison = t("calculators.environmental.water_usage.comparison_high");
        }

        setResult({
          dailyUsage,
          monthlyUsage,
          yearlyUsage,
          dailyCost,
          monthlyCost,
          yearlyCost,
          comparison,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("calculators.environmental.water_usage.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setShowerMinutes('');
      setToiletFlushes('');
      setDishwashing('');
      setLaundryLoads('');
      setCostPerLiter('');
      setResult(null);
      setError('');
    }, 300);
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("calculators.environmental.water_usage.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t("calculators.environmental.water_usage.shower_label")}
          tooltip={t("calculators.environmental.water_usage.shower_tooltip")}
        >
          <NumberInput
            value={showerMinutes}
            onValueChange={(value) => {
                setShowerMinutes(String(value));
                if (error) setError('');
              }}
            placeholder={t("calculators.environmental.water_usage.shower_placeholder")}
            min={0}
            unit={t("calculators.environmental.water_usage.minutes_unit")}
          />
        </InputContainer>

        <InputContainer
          label={t("calculators.environmental.water_usage.toilet_label")}
          tooltip={t("calculators.environmental.water_usage.toilet_tooltip")}
        >
          <NumberInput
            value={toiletFlushes}
            onValueChange={(value) => {
                setToiletFlushes(String(value));
                if (error) setError('');
              }}
            placeholder={t("calculators.environmental.water_usage.toilet_placeholder")}
            min={0}
            unit={t("calculators.environmental.water_usage.times_unit")}
          />
        </InputContainer>

        <InputContainer
          label={t("calculators.environmental.water_usage.dish_label")}
          tooltip={t("calculators.environmental.water_usage.dish_tooltip")}
        >
          <NumberInput
            value={dishwashing}
            onValueChange={(value) => {
                setDishwashing(String(value));
                if (error) setError('');
              }}
            placeholder={t("calculators.environmental.water_usage.dish_placeholder")}
            min={0}
            unit={t("calculators.environmental.water_usage.minutes_unit")}
          />
        </InputContainer>

        <InputContainer
          label={t("calculators.environmental.water_usage.laundry_label")}
          tooltip={t("calculators.environmental.water_usage.laundry_tooltip")}
        >
          <NumberInput
            value={laundryLoads}
            onValueChange={(value) => {
                setLaundryLoads(String(value));
                if (error) setError('');
              }}
            placeholder={t("calculators.environmental.water_usage.laundry_placeholder")}
            min={0}
            unit={t("calculators.environmental.water_usage.loads_unit")}
          />
        </InputContainer>

        <InputContainer
          label={t("calculators.environmental.water_usage.cost_label")}
          tooltip={t("calculators.environmental.water_usage.cost_tooltip")}
        >
          <NumberInput
            value={costPerLiter}
            onValueChange={(value) => {
                setCostPerLiter(String(value));
                if (error) setError('');
              }}
            placeholder={t("calculators.environmental.water_usage.cost_placeholder")}
            min={0}
            step={0.001}
            unit={t("calculators.environmental.water_usage.currency_unit")}
          />
        </InputContainer>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("calculators.environmental.water_usage.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("calculators.environmental.water_usage.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("calculators.environmental.water_usage.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("calculators.environmental.water_usage.use_case_1")}</li>
              <li>{t("calculators.environmental.water_usage.use_case_2")}</li>
              <li>{t("calculators.environmental.water_usage.use_case_3")}</li>
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
          {t("calculators.environmental.water_usage.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.dailyUsage).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("calculators.environmental.water_usage.result_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("calculators.environmental.water_usage.details_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="font-medium">{t("calculators.environmental.water_usage.monthly_usage")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.monthlyUsage).toFixed(2)} {t("calculators.environmental.water_usage.liters")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div className="font-medium">{t("calculators.environmental.water_usage.yearly_usage")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.yearlyUsage).toFixed(2)} {t("calculators.environmental.water_usage.liters")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("calculators.environmental.water_usage.daily_cost")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.dailyCost).toFixed(2)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div className="font-medium">{t("calculators.environmental.water_usage.monthly_cost")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.monthlyCost).toFixed(2)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("calculators.environmental.water_usage.yearly_cost")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.yearlyCost).toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("calculators.environmental.water_usage.comparison_title")}</h4>
            <p className="text-sm text-foreground-70">{result.comparison}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("calculators.environmental.water_usage.title")}
      description={t("calculators.environmental.water_usage.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
