'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

export default function PlasticFootprintCalculator() {
  const { t } = useTranslation('calc/environmental');

  const [bottles, setBottles] = useState<string>('');
  const [bags, setBags] = useState<string>('');
  const [packaging, setPackaging] = useState<string>('');
  const [straws, setStraws] = useState<string>('');
  const [containers, setContainers] = useState<string>('');
  const [result, setResult] = useState<{
    weeklyPlastic: number;
    annualPlastic: number;
    co2Impact: number;
    oceanEquivalent: number;
    replacementCost: number;
  } | null>(null);

  const calculate = () => {
    const bottlesVal = parseFloat(bottles) || 0;
    const bagsVal = parseFloat(bags) || 0;
    const packagingVal = parseFloat(packaging) || 0;
    const strawsVal = parseFloat(straws) || 0;
    const containersVal = parseFloat(containers) || 0;

    // Weight per item (grams)
    const bottleWeight = 15;
    const bagWeight = 6;
    const strawWeight = 1;
    const containerWeight = 20;

    const weeklyPlastic = (bottlesVal * bottleWeight + bagsVal * bagWeight +
                          packagingVal + strawsVal * strawWeight +
                          containersVal * containerWeight) / 1000; // Convert to kg

    const annualPlastic = weeklyPlastic * 52;

    // CO2 impact (2 kg CO2 per kg plastic)
    const co2Impact = annualPlastic * 2;

    // Ocean equivalent (8 million tons enter ocean yearly)
    const oceanEquivalent = (annualPlastic / 8000000000) * 100;

    // Cost of replacement with reusables
    const replacementCost = (bottlesVal * 52 * 2) + (bagsVal * 52 * 0.5);

    setResult({
      weeklyPlastic: parseFloat(weeklyPlastic.toFixed(2)),
      annualPlastic: parseFloat(annualPlastic.toFixed(2)),
      co2Impact: parseFloat(co2Impact.toFixed(2)),
      oceanEquivalent: parseFloat(oceanEquivalent.toFixed(8)),
      replacementCost: parseFloat(replacementCost.toFixed(2))
    });
  };

  const reset = () => {
    setBottles('');
    setBags('');
    setPackaging('');
    setStraws('');
    setContainers('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("plastic_footprint.section_title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("plastic_footprint.bottles")} tooltip={t("plastic_footprint.bottles_tooltip")}>
          <NumericInput value={bottles} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBottles(e.target.value)} unit={t("plastic_footprint.bottles_unit")} placeholder={t("plastic_footprint.enter_number")} min={0} />
        </InputContainer>

        <InputContainer label={t("plastic_footprint.bags")} tooltip={t("plastic_footprint.bags_tooltip")}>
          <NumericInput value={bags} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBags(e.target.value)} unit={t("plastic_footprint.bags_unit")} placeholder={t("plastic_footprint.enter_number")} min={0} />
        </InputContainer>

        <InputContainer label={t("plastic_footprint.packaging")} tooltip={t("plastic_footprint.packaging_tooltip")}>
          <NumericInput value={packaging} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPackaging(e.target.value)} unit={t("co2_emissions.kg_co2").split(' ')[0].replace('kg', 'g')} placeholder={t("plastic_footprint.enter_weight")} min={0} />
        </InputContainer>

        <InputContainer label={t("plastic_footprint.straws")} tooltip={t("plastic_footprint.straws_tooltip")}>
          <NumericInput value={straws} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStraws(e.target.value)} unit={t("plastic_footprint.straws_unit")} placeholder={t("plastic_footprint.enter_number")} min={0} />
        </InputContainer>

        <InputContainer label={t("plastic_footprint.containers")} tooltip={t("plastic_footprint.containers_tooltip")}>
          <NumericInput value={containers} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContainers(e.target.value)} unit={t("plastic_footprint.containers_unit")} placeholder={t("plastic_footprint.enter_number")} min={0} />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("plastic_footprint.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("plastic_footprint.annual_plastic")}</div>
          <div className="text-3xl font-bold text-primary">{result.annualPlastic.toLocaleString()} {t("co2_emissions.kg_co2").split(' ')[0]}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("plastic_footprint.weekly")}</div>
            <div className="text-xl font-bold">{result.weeklyPlastic.toLocaleString()} {t("co2_emissions.kg_co2").split(' ')[0]}</div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("plastic_footprint.co2_emissions")}</div>
            <div className="text-xl font-bold text-orange-700 dark:text-orange-400">
              {result.co2Impact.toLocaleString()} {t("co2_emissions.kg_co2").split(' ')[0]}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("plastic_footprint.savings_reusables")}</div>
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {result.replacementCost.toLocaleString()} {t("carbon_offset.sar")}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("plastic_footprint.alternatives_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("plastic_footprint.alt_bottle")}</li>
            <li>{t("plastic_footprint.alt_bags")}</li>
            <li>{t("plastic_footprint.alt_straws")}</li>
            <li>{t("plastic_footprint.alt_containers")}</li>
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
        {t("plastic_footprint.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("plastic_footprint.title")}
      description={t("plastic_footprint.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("plastic_footprint.footer_note")}
     className="rtl" />
  );
}
