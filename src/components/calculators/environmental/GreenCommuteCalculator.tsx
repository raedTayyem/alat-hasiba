'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

export default function GreenCommuteCalculator() {
  const { t } = useTranslation('calc/environmental');

  const [distance, setDistance] = useState<string>('');
  const [currentMode, setCurrentMode] = useState<string>('car');
  const [alternativeMode, setAlternativeMode] = useState<string>('bike');
  const [daysPerWeek, setDaysPerWeek] = useState<string>('5');
  const [result, setResult] = useState<{
    co2Savings: number;
    costSavings: number;
    caloriesBurned: number;
    timeDifference: number;
  } | null>(null);

  const modeOptions = [
    { value: 'car', label: t("green_commute.options.car") },
    { value: 'bus', label: t("green_commute.options.bus") },
    { value: 'metro', label: t("green_commute.options.metro") },
    { value: 'bike', label: t("green_commute.options.bike") },
    { value: 'walk', label: t("green_commute.options.walk") },
    { value: 'ebike', label: t("green_commute.options.ebike") }
  ];

  const calculate = () => {
    const distVal = parseFloat(distance);
    const daysVal = parseFloat(daysPerWeek);

    if (!distVal || !daysVal) return;

    // CO2 emissions per km
    const emissions: { [key: string]: number } = {
      'car': 0.2, 'bus': 0.08, 'metro': 0.05, 'bike': 0, 'walk': 0, 'ebike': 0.01
    };

    // Cost per km (SAR)
    const costs: { [key: string]: number } = {
      'car': 0.6, 'bus': 0.2, 'metro': 0.15, 'bike': 0.02, 'walk': 0, 'ebike': 0.05
    };

    // Speed (km/h)
    const speeds: { [key: string]: number } = {
      'car': 40, 'bus': 25, 'metro': 35, 'bike': 15, 'walk': 5, 'ebike': 25
    };

    // Calories burned per km
    const calories: { [key: string]: number } = {
      'car': 0, 'bus': 5, 'metro': 10, 'bike': 40, 'walk': 60, 'ebike': 20
    };

    const weeklyDistance = distVal * 2 * daysVal; // Round trip
    const annualDistance = weeklyDistance * 50; // ~50 working weeks

    const currentCO2 = annualDistance * emissions[currentMode];
    const altCO2 = annualDistance * emissions[alternativeMode];
    const co2Savings = currentCO2 - altCO2;

    const currentCost = annualDistance * costs[currentMode];
    const altCost = annualDistance * costs[alternativeMode];
    const costSavings = currentCost - altCost;

    const caloriesBurned = annualDistance * calories[alternativeMode];

    const currentTime = distVal / speeds[currentMode] * 60; // minutes
    const altTime = distVal / speeds[alternativeMode] * 60;
    const timeDifference = altTime - currentTime;

    setResult({
      co2Savings: parseFloat(co2Savings.toFixed(2)),
      costSavings: parseFloat(costSavings.toFixed(2)),
      caloriesBurned: parseFloat(caloriesBurned.toFixed(0)),
      timeDifference: parseFloat(timeDifference.toFixed(1))
    });
  };

  const reset = () => {
    setDistance('');
    setCurrentMode('car');
    setAlternativeMode('bike');
    setDaysPerWeek('5');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("green_commute.section_title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("green_commute.distance")} tooltip={t("green_commute.distance_tooltip")}>
          <NumericInput value={distance} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDistance(e.target.value)} unit={t("green_commute.kg")} placeholder={t("green_commute.enter_distance")} min={0} />
        </InputContainer>

        <InputContainer label={t("green_commute.current_mode")} tooltip={t("green_commute.current_mode_tooltip")}>
          <select value={currentMode} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrentMode(e.target.value)} className="calculator-input w-full">
            {modeOptions.map((opt: any) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </InputContainer>

        <InputContainer label={t("green_commute.alternative_mode")} tooltip={t("green_commute.alternative_mode_tooltip")}>
          <select value={alternativeMode} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAlternativeMode(e.target.value)} className="calculator-input w-full">
            {modeOptions.map((opt: any) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </InputContainer>

        <InputContainer label={t("green_commute.days_per_week")} tooltip={t("green_commute.days_per_week_tooltip")}>
          <NumericInput value={daysPerWeek} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDaysPerWeek(e.target.value)} unit={t("co2_emissions.days")} placeholder={t("green_commute.enter_days")} min={1} max={7} />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("green_commute.results_title")}</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("green_commute.co2_reduction")}</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {result.co2Savings > 0 ? '+' : ''}{result.co2Savings.toLocaleString()} {t("green_commute.kg")}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("green_commute.cost_savings")}</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {result.costSavings > 0 ? '+' : ''}{result.costSavings.toLocaleString()} {t("carbon_offset.sar")}
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("green_commute.calories_burned")}</div>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
              {result.caloriesBurned.toLocaleString()} {t("green_commute.cal")}
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${result.timeDifference > 0 ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/20' : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/20'}`}>
            <div className="text-sm text-foreground-70 mb-1">{t("green_commute.time_difference")}</div>
            <div className={`text-2xl font-bold ${result.timeDifference > 0 ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
              {result.timeDifference > 0 ? '+' : ''}{result.timeDifference} {t("green_commute.min")}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("green_commute.benefits_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("green_commute.benefit_congestion")}</li>
            <li>{t("green_commute.benefit_health")}</li>
            <li>{t("green_commute.benefit_pollution")}</li>
            <li>{t("green_commute.benefit_money")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <p className="text-foreground-70">
        {t("green_commute.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("green_commute.title")}
      description={t("green_commute.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("green_commute.footer_note")}
     className="rtl" />
  );
}
