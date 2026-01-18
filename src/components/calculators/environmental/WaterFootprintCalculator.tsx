'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

export default function WaterFootprintCalculator() {
  const { t } = useTranslation('calc/environmental');

  const [diet, setDiet] = useState<string>('mixed');
  const [showerMinutes, setShowerMinutes] = useState<string>('10');
  const [laundryLoads, setLaundryLoads] = useState<string>('3');
  const [carWashes, setCarWashes] = useState<string>('1');
  const [result, setResult] = useState<{
    totalFootprint: number;
    directWater: number;
    indirectWater: number;
    breakdown: { [key: string]: number };
  } | null>(null);

  const dietOptions: ComboboxOption[] = [
    { value: 'vegan', label: t("sustainable_lifestyle.options.vegan") },
    { value: 'vegetarian', label: t("sustainable_lifestyle.options.vegetarian") },
    { value: 'mixed', label: t("sustainable_lifestyle.options.mixed") },
    { value: 'meat-heavy', label: t("sustainable_lifestyle.options.meat_heavy") }
  ];

  const calculate = () => {
    const showerVal = parseFloat(showerMinutes) || 0;
    const laundryVal = parseFloat(laundryLoads) || 0;
    const carWashVal = parseFloat(carWashes) || 0;

    // Direct water use (liters per day)
    const showerDaily = showerVal * 10; // 10 L per minute
    const toiletDaily = 30; // Average 5 flushes × 6L
    const cookingDaily = 15; // Cooking and drinking
    const directDaily = showerDaily + toiletDaily + cookingDaily;

    // Indirect water (virtual water) - liters per day
    const dietWater: { [key: string]: number } = {
      'vegan': 2500,        // Low virtual water
      'vegetarian': 3500,   // Medium virtual water
      'mixed': 5000,        // High virtual water
      'meat-heavy': 7500    // Very high virtual water
    };

    const laundryWeekly = laundryVal * 150; // 150L per load
    const laundryDaily = laundryWeekly / 7;

    const carWashMonthly = carWashVal * 400; // 400L per wash
    const carWashDaily = carWashMonthly / 30;

    const indirectDaily = dietWater[diet] + laundryDaily + carWashDaily;

    const totalDaily = directDaily + indirectDaily;
    const totalAnnual = totalDaily * 365;

    const breakdown = {
      diet: dietWater[diet],
      shower: showerDaily,
      toilet: toiletDaily,
      cooking: cookingDaily,
      laundry: laundryDaily,
      carWash: carWashDaily
    };

    setResult({
      totalFootprint: parseFloat(totalAnnual.toFixed(2)),
      directWater: parseFloat((directDaily * 365).toFixed(2)),
      indirectWater: parseFloat((indirectDaily * 365).toFixed(2)),
      breakdown
    });
  };

  const reset = () => {
    setDiet('mixed');
    setShowerMinutes('10');
    setLaundryLoads('3');
    setCarWashes('1');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("water_footprint.section_title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer
          label={t("water_footprint.diet")}
          tooltip={t("water_footprint.diet_tooltip")}
        >
          <Combobox options={dietOptions} value={diet} onChange={setDiet} />
        </InputContainer>

        <InputContainer
          label={t("water_footprint.shower")}
          tooltip={t("water_footprint.shower_tooltip")}
        >
          <NumericInput
            value={showerMinutes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowerMinutes(e.target.value)}
            unit={t("green_commute.min")}
            placeholder={t("water_footprint.enter_minutes")}
            min={0}
          />
        </InputContainer>

        <InputContainer
          label={t("water_footprint.laundry")}
          tooltip={t("water_footprint.laundry_tooltip")}
        >
          <NumericInput
            value={laundryLoads}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLaundryLoads(e.target.value)}
            unit={t("water_footprint.laundry_tooltip").split(' ')[3]}
            placeholder={t("water_footprint.enter_number")}
            min={0}
          />
        </InputContainer>

        <InputContainer
          label={t("water_footprint.car_wash")}
          tooltip={t("water_footprint.car_wash_tooltip")}
        >
          <NumericInput
            value={carWashes}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCarWashes(e.target.value)}
            unit={t("water_footprint.car_wash_tooltip").split(' ')[2]}
            placeholder={t("water_footprint.enter_number")}
            min={0}
          />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("water_footprint.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("water_footprint.total_footprint")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.totalFootprint.toLocaleString()} {t("rainwater_harvesting.liters_year")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("water_footprint.direct_water")}
            </div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
              {result.directWater.toLocaleString()} {t("rainwater_harvesting.liters_short")}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("water_footprint.indirect_water")}
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {result.indirectWater.toLocaleString()} {t("rainwater_harvesting.liters_short")}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">
            {t("water_footprint.virtual_water_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("water_footprint.virtual_water_beef")}</li>
            <li>{t("water_footprint.virtual_water_chicken")}</li>
            <li>{t("water_footprint.virtual_water_rice")}</li>
            <li>{t("water_footprint.virtual_water_veg")}</li>
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
        {t("water_footprint.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("water_footprint.title")}
      description={t("water_footprint.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("water_footprint.footer_note")}
     className="rtl" />
  );
}
