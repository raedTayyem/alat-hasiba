'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

export default function RainwaterHarvestingCalculator() {
  const { t } = useTranslation(['calc/environmental', 'common']);

  const [roofArea, setRoofArea] = useState<string>('');
  const [annualRainfall, setAnnualRainfall] = useState<string>('100');
  const [efficiency, setEfficiency] = useState<string>('85');
  const [result, setResult] = useState<{
    annualCollection: number;
    monthlyAverage: number;
    tankSize: number;
    waterSavings: number;
    costSavings: number;
  } | null>(null);

  const calculate = () => {
    const areaVal = parseFloat(roofArea);
    const rainfallVal = parseFloat(annualRainfall);
    const efficiencyVal = parseFloat(efficiency);

    if (!areaVal || !rainfallVal || !efficiencyVal) return;

    // Annual collection (liters) = Area (m²) × Rainfall (mm) × Efficiency (%)
    // 1 mm of rain over 1 m² = 1 liter
    const annualCollection = areaVal * rainfallVal * (efficiencyVal / 100);

    const monthlyAverage = annualCollection / 12;

    // Recommended tank size (1 month of heavy rainfall + buffer)
    const tankSize = (areaVal * (rainfallVal / 12) * 1.5 * (efficiencyVal / 100));

    // Water savings (assuming 50% of collection is used)
    const waterSavings = annualCollection * 0.5;

    // Cost savings (SAR per cubic meter)
    const costPerM3 = 3.67;
    const costSavings = (waterSavings / 1000) * costPerM3;

    setResult({
      annualCollection: parseFloat(annualCollection.toFixed(0)),
      monthlyAverage: parseFloat(monthlyAverage.toFixed(0)),
      tankSize: parseFloat(tankSize.toFixed(0)),
      waterSavings: parseFloat(waterSavings.toFixed(0)),
      costSavings: parseFloat(costSavings.toFixed(2))
    });
  };

  const reset = () => {
    setRoofArea('');
    setAnnualRainfall('100');
    setEfficiency('85');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("rainwater_harvesting.section_title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("rainwater_harvesting.roof_area")} tooltip={t("rainwater_harvesting.roof_area_tooltip")}>
          <NumericInput value={roofArea} onChange={(e: any) => setRoofArea(e.target.value)} unit={t("composting.sq_m")} placeholder={t("rainwater_harvesting.enter_area")} min={0} />
        </InputContainer>

        <InputContainer label={t("rainwater_harvesting.rainfall")} tooltip={t("rainwater_harvesting.rainfall_tooltip")}>
          <NumericInput value={annualRainfall} onChange={(e: any) => setAnnualRainfall(e.target.value)} unit={t("rainwater_harvesting.rainfall").split('(')[1].replace(')', '')} placeholder={t("rainwater_harvesting.enter_rate")} min={0} />
        </InputContainer>

        <InputContainer label={t("rainwater_harvesting.efficiency")} tooltip={t("rainwater_harvesting.efficiency_tooltip")}>
          <NumericInput value={efficiency} onChange={(e: any) => setEfficiency(e.target.value)} unit={t("common:units.percent")} placeholder={t("rainwater_harvesting.enter_efficiency")} min={0} max={100} />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("rainwater_harvesting.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("rainwater_harvesting.annual_collection")}</div>
          <div className="text-3xl font-bold text-primary">{result.annualCollection.toLocaleString()} {t("rainwater_harvesting.liters")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("rainwater_harvesting.monthly_average")}</div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
              {result.monthlyAverage.toLocaleString()} {t("rainwater_harvesting.liters_short")}
            </div>
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-950/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("rainwater_harvesting.tank_size")}</div>
            <div className="text-xl font-bold text-cyan-700 dark:text-cyan-400">
              {result.tankSize.toLocaleString()} {t("rainwater_harvesting.liters_short")}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("rainwater_harvesting.water_savings")}</div>
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {result.waterSavings.toLocaleString()} {t("rainwater_harvesting.liters_year")}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("rainwater_harvesting.cost_savings")}</div>
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {result.costSavings.toLocaleString()} {t("carbon_offset.sar")}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("rainwater_harvesting.uses_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("rainwater_harvesting.use_garden")}</li>
            <li>{t("rainwater_harvesting.use_car")}</li>
            <li>{t("rainwater_harvesting.use_cleaning")}</li>
            <li>{t("rainwater_harvesting.use_toilet")}</li>
            <li>{t("rainwater_harvesting.use_groundwater")}</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("rainwater_harvesting.info_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("rainwater_harvesting.info_filtration")}</li>
            <li>{t("rainwater_harvesting.info_clean")}</li>
            <li>{t("rainwater_harvesting.info_permits")}</li>
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
        {t("rainwater_harvesting.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("rainwater_harvesting.title")}
      description={t("rainwater_harvesting.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("rainwater_harvesting.footer_note")}
     className="rtl" />
  );
}
