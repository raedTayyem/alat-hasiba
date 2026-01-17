'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

export default function DietCarbonFootprintCalculator() {
  const { t } = useTranslation('calc/environmental');

  const [beef, setBeef] = useState<string>('');
  const [chicken, setChicken] = useState<string>('');
  const [fish, setFish] = useState<string>('');
  const [dairy, setDairy] = useState<string>('');
  const [vegetables, setVegetables] = useState<string>('');
  const [grains, setGrains] = useState<string>('');
  const [result, setResult] = useState<{
    totalCO2: number;
    breakdown: { [key: string]: number };
    comparison: string;
    treesNeeded: number;
  } | null>(null);

  const calculate = () => {
    const beefVal = parseFloat(beef) || 0;
    const chickenVal = parseFloat(chicken) || 0;
    const fishVal = parseFloat(fish) || 0;
    const dairyVal = parseFloat(dairy) || 0;
    const vegetablesVal = parseFloat(vegetables) || 0;
    const grainsVal = parseFloat(grains) || 0;

    // CO2 emissions per kg of food (kg CO2e)
    const emissionFactors: { [key: string]: number } = {
      beef: 27,
      chicken: 6.9,
      fish: 6,
      dairy: 1.9,
      vegetables: 2,
      grains: 2.5
    };

    const beefCO2 = beefVal * emissionFactors.beef * 52;
    const chickenCO2 = chickenVal * emissionFactors.chicken * 52;
    const fishCO2 = fishVal * emissionFactors.fish * 52;
    const dairyCO2 = dairyVal * emissionFactors.dairy * 52;
    const vegetablesCO2 = vegetablesVal * emissionFactors.vegetables * 52;
    const grainsCO2 = grainsVal * emissionFactors.grains * 52;

    const totalCO2 = beefCO2 + chickenCO2 + fishCO2 + dairyCO2 + vegetablesCO2 + grainsCO2;

    const breakdown = {
      beef: parseFloat(beefCO2.toFixed(2)),
      chicken: parseFloat(chickenCO2.toFixed(2)),
      fish: parseFloat(fishCO2.toFixed(2)),
      dairy: parseFloat(dairyCO2.toFixed(2)),
      vegetables: parseFloat(vegetablesCO2.toFixed(2)),
      grains: parseFloat(grainsCO2.toFixed(2))
    };

    let comparison = '';
    if (totalCO2 < 1500) {
      comparison = t("diet_footprint.categories.very_low");
    } else if (totalCO2 < 1700) {
      comparison = t("diet_footprint.categories.low");
    } else if (totalCO2 < 2500) {
      comparison = t("diet_footprint.categories.average");
    } else {
      comparison = t("diet_footprint.categories.high");
    }

    const treesNeeded = totalCO2 / 21;

    setResult({
      totalCO2: parseFloat(totalCO2.toFixed(2)),
      breakdown,
      comparison,
      treesNeeded: parseFloat(treesNeeded.toFixed(1))
    });
  };

  const reset = () => {
    setBeef('');
    setChicken('');
    setFish('');
    setDairy('');
    setVegetables('');
    setGrains('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("diet_footprint.consumption_title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("diet_footprint.beef")} tooltip={t("diet_footprint.beef_tooltip")}>
          <NumericInput
            value={beef}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBeef(e.target.value)}
            endIcon={<span className="text-xs text-muted-foreground">{t("co2_emissions.kg_co2").split(' ')[0]}</span>}
            placeholder={t("diet_footprint.enter_amount")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("diet_footprint.chicken")} tooltip={t("diet_footprint.chicken_tooltip")}>
          <NumericInput
            value={chicken}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChicken(e.target.value)}
            endIcon={<span className="text-xs text-muted-foreground">{t("co2_emissions.kg_co2").split(' ')[0]}</span>}
            placeholder={t("diet_footprint.enter_amount")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("diet_footprint.fish")} tooltip={t("diet_footprint.fish_tooltip")}>
          <NumericInput
            value={fish}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFish(e.target.value)}
            endIcon={<span className="text-xs text-muted-foreground">{t("co2_emissions.kg_co2").split(' ')[0]}</span>}
            placeholder={t("diet_footprint.enter_amount")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("diet_footprint.dairy")} tooltip={t("diet_footprint.dairy_tooltip")}>
          <NumericInput
            value={dairy}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDairy(e.target.value)}
            endIcon={<span className="text-xs text-muted-foreground">{t("co2_emissions.kg_co2").split(' ')[0]}</span>}
            placeholder={t("diet_footprint.enter_amount")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("diet_footprint.vegetables")} tooltip={t("diet_footprint.vegetables_tooltip")}>
          <NumericInput
            value={vegetables}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVegetables(e.target.value)}
            endIcon={<span className="text-xs text-muted-foreground">{t("co2_emissions.kg_co2").split(' ')[0]}</span>}
            placeholder={t("diet_footprint.enter_amount")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("diet_footprint.grains")} tooltip={t("diet_footprint.grains_tooltip")}>
          <NumericInput
            value={grains}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGrains(e.target.value)}
            endIcon={<span className="text-xs text-muted-foreground">{t("co2_emissions.kg_co2").split(' ')[0]}</span>}
            placeholder={t("diet_footprint.enter_amount")}
            min={0}
            step={0.1}
          />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("diet_footprint.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("diet_footprint.annual_emissions")}</div>
          <div className="text-3xl font-bold text-primary">{result.totalCO2.toLocaleString()} {t("co2_emissions.kg_co2")}e</div>
          <div className="text-sm mt-2 font-semibold">{t("diet_footprint.category")} {result.comparison}</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {result.breakdown.beef > 0 && (
            <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-900/20">
              <div className="text-xs text-foreground-70">{t("diet_footprint.beef")}</div>
              <div className="text-lg font-bold text-red-700 dark:text-red-400">{result.breakdown.beef} {t("co2_emissions.kg_co2").split(' ')[0]}</div>
            </div>
          )}
          {result.breakdown.chicken > 0 && (
            <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-900/20">
              <div className="text-xs text-foreground-70">{t("diet_footprint.chicken")}</div>
              <div className="text-lg font-bold text-orange-700 dark:text-orange-400">{result.breakdown.chicken} {t("co2_emissions.kg_co2").split(' ')[0]}</div>
            </div>
          )}
          {result.breakdown.fish > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-900/20">
              <div className="text-xs text-foreground-70">{t("diet_footprint.fish")}</div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-400">{result.breakdown.fish} {t("co2_emissions.kg_co2").split(' ')[0]}</div>
            </div>
          )}
          {result.breakdown.dairy > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-900/20">
              <div className="text-xs text-foreground-70">{t("diet_footprint.dairy")}</div>
              <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">{result.breakdown.dairy} {t("co2_emissions.kg_co2").split(' ')[0]}</div>
            </div>
          )}
          {result.breakdown.vegetables > 0 && (
            <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-900/20">
              <div className="text-xs text-foreground-70">{t("diet_footprint.vegetables")}</div>
              <div className="text-lg font-bold text-green-700 dark:text-green-400">{result.breakdown.vegetables} {t("co2_emissions.kg_co2").split(' ')[0]}</div>
            </div>
          )}
          {result.breakdown.grains > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/20">
              <div className="text-xs text-foreground-70">{t("diet_footprint.grains")}</div>
              <div className="text-lg font-bold text-amber-700 dark:text-amber-400">{result.breakdown.grains} {t("co2_emissions.kg_co2").split(' ')[0]}</div>
            </div>
          )}
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
          <div className="text-sm text-foreground-70 mb-1">{t("diet_footprint.trees_needed")}</div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">{result.treesNeeded} {t("co2_emissions.trees")}</div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("diet_footprint.facts_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("diet_footprint.fact_beef")}</li>
            <li>{t("diet_footprint.fact_plant")}</li>
            <li>{t("diet_footprint.fact_reduce")}</li>
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
        {t("diet_footprint.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("diet_footprint.title")}
      description={t("diet_footprint.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("diet_footprint.footer_note")}
     className="rtl" />
  );
}
