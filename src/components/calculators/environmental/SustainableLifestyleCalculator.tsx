'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

export default function SustainableLifestyleCalculator() {
  const { t } = useTranslation('calc/environmental');

  const [energy, setEnergy] = useState<string>('grid');
  const [transport, setTransport] = useState<string>('car');
  const [diet, setDiet] = useState<string>('mixed');
  const [waste, setWaste] = useState<string>('sometimes');
  const [water, setWater] = useState<string>('moderate');
  const [shopping, setShopping] = useState<string>('regular');
  const [result, setResult] = useState<{
    score: number;
    rating: string;
    category: string;
    co2Annual: number;
    planetCount: number;
    improvements: { area: string; impact: string }[];
  } | null>(null);

  const energyOptions = [
    { value: 'solar', label: t("sustainable_lifestyle.options.solar") },
    { value: 'green', label: t("sustainable_lifestyle.options.green") },
    { value: 'efficient', label: t("sustainable_lifestyle.options.efficient") },
    { value: 'grid', label: t("sustainable_lifestyle.options.grid") }
  ];

  const transportOptions = [
    { value: 'walk', label: t("sustainable_lifestyle.options.walk") },
    { value: 'public', label: t("sustainable_lifestyle.options.public") },
    { value: 'hybrid', label: t("sustainable_lifestyle.options.hybrid") },
    { value: 'car', label: t("sustainable_lifestyle.options.car") }
  ];

  const dietOptions = [
    { value: 'vegan', label: t("sustainable_lifestyle.options.vegan") },
    { value: 'vegetarian', label: t("sustainable_lifestyle.options.vegetarian") },
    { value: 'flexitarian', label: t("sustainable_lifestyle.options.flexitarian") },
    { value: 'mixed', label: t("sustainable_lifestyle.options.mixed") }
  ];

  const wasteOptions = [
    { value: 'zero', label: t("sustainable_lifestyle.options.zero") },
    { value: 'minimal', label: t("sustainable_lifestyle.options.minimal") },
    { value: 'sometimes', label: t("sustainable_lifestyle.options.sometimes") },
    { value: 'regular', label: t("sustainable_lifestyle.options.regular") }
  ];

  const waterOptions = [
    { value: 'minimal', label: t("sustainable_lifestyle.options.conservative") },
    { value: 'moderate', label: t("sustainable_lifestyle.options.moderate") },
    { value: 'high', label: t("sustainable_lifestyle.options.high") }
  ];

  const shoppingOptions = [
    { value: 'minimal', label: t("sustainable_lifestyle.options.sustainable") },
    { value: 'conscious', label: t("sustainable_lifestyle.options.conscious") },
    { value: 'regular', label: t("sustainable_lifestyle.options.regular") },
    { value: 'excessive', label: t("sustainable_lifestyle.options.excessive") }
  ];

  const calculate = () => {
    // Calculate CO2 footprint based on choices
    const energyCO2 = { solar: 500, green: 1000, efficient: 2000, grid: 3500 };
    const transportCO2 = { walk: 0, public: 500, hybrid: 1500, car: 3000 };
    const dietCO2 = { vegan: 1500, vegetarian: 1700, flexitarian: 2000, mixed: 2500 };
    const wasteCO2 = { zero: 100, minimal: 300, sometimes: 600, regular: 1000 };
    const waterCO2 = { minimal: 200, moderate: 400, high: 800 };
    const shoppingCO2 = { minimal: 500, conscious: 1000, regular: 2000, excessive: 3500 };

    const co2Annual = energyCO2[energy as keyof typeof energyCO2] +
                      transportCO2[transport as keyof typeof transportCO2] +
                      dietCO2[diet as keyof typeof dietCO2] +
                      wasteCO2[waste as keyof typeof wasteCO2] +
                      waterCO2[water as keyof typeof waterCO2] +
                      shoppingCO2[shopping as keyof typeof shoppingCO2];

    // Calculate score (0-100)
    const maxCO2 = 14300;
    const minCO2 = 2800;
    const score = Math.round(((maxCO2 - co2Annual) / (maxCO2 - minCO2)) * 100);

    // Rating
    let rating = '';
    if (score >= 85) rating = t("sustainable_lifestyle.ratings.excellent");
    else if (score >= 70) rating = t("sustainable_lifestyle.ratings.very_good");
    else if (score >= 50) rating = t("sustainable_lifestyle.ratings.good");
    else if (score >= 30) rating = t("sustainable_lifestyle.ratings.average");
    else rating = t("sustainable_lifestyle.ratings.poor");

    // Planet count (how many Earths needed if everyone lived like you)
    const avgCO2 = 4000; // Global average per capita
    const planetCount = parseFloat((co2Annual / avgCO2).toFixed(2));

    // Generate improvements
    const improvements: { area: string; impact: string }[] = [];
    if (energy === 'grid') {
      improvements.push({
        area: t("sustainable_lifestyle.energy"),
        impact: t("sustainable_lifestyle.suggestions.energy")
      });
    }
    if (transport === 'car') {
      improvements.push({
        area: t("sustainable_lifestyle.transport"),
        impact: t("sustainable_lifestyle.suggestions.transport")
      });
    }
    if (diet === 'mixed') {
      improvements.push({
        area: t("sustainable_lifestyle.diet"),
        impact: t("sustainable_lifestyle.suggestions.diet")
      });
    }
    if (waste === 'regular') {
      improvements.push({
        area: t("sustainable_lifestyle.waste"),
        impact: t("sustainable_lifestyle.suggestions.waste")
      });
    }

    setResult({
      score,
      rating,
      category: 'lifestyle',
      co2Annual,
      planetCount,
      improvements
    });
  };

  const reset = () => {
    setEnergy('grid');
    setTransport('car');
    setDiet('mixed');
    setWaste('sometimes');
    setWater('moderate');
    setShopping('regular');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("sustainable_lifestyle.section_title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("sustainable_lifestyle.energy")} tooltip={t("sustainable_lifestyle.energy_tooltip")}>
          <select value={energy} onChange={(e: any) => setEnergy(e.target.value)} className="calculator-input w-full">
            {energyOptions.map((opt: any) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </InputContainer>

        <InputContainer label={t("sustainable_lifestyle.transport")} tooltip={t("sustainable_lifestyle.transport_tooltip")}>
          <select value={transport} onChange={(e: any) => setTransport(e.target.value)} className="calculator-input w-full">
            {transportOptions.map((opt: any) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </InputContainer>

        <InputContainer label={t("sustainable_lifestyle.diet")} tooltip={t("sustainable_lifestyle.diet_tooltip")}>
          <select value={diet} onChange={(e: any) => setDiet(e.target.value)} className="calculator-input w-full">
            {dietOptions.map((opt: any) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </InputContainer>

        <InputContainer label={t("sustainable_lifestyle.waste")} tooltip={t("sustainable_lifestyle.waste_tooltip")}>
          <select value={waste} onChange={(e: any) => setWaste(e.target.value)} className="calculator-input w-full">
            {wasteOptions.map((opt: any) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </InputContainer>

        <InputContainer label={t("sustainable_lifestyle.water")} tooltip={t("sustainable_lifestyle.water_tooltip")}>
          <select value={water} onChange={(e: any) => setWater(e.target.value)} className="calculator-input w-full">
            {waterOptions.map((opt: any) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </InputContainer>

        <InputContainer label={t("sustainable_lifestyle.shopping")} tooltip={t("sustainable_lifestyle.shopping_tooltip")}>
          <select value={shopping} onChange={(e: any) => setShopping(e.target.value)} className="calculator-input w-full">
            {shoppingOptions.map((opt: any) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("sustainable_lifestyle.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg text-center">
          <div className="text-sm text-foreground-70 mb-2">{t("sustainable_lifestyle.score_label")}</div>
          <div className="text-6xl font-bold text-primary mb-2">{result.score}</div>
          <div className="text-lg font-semibold">{result.rating}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("sustainable_lifestyle.annual_footprint")}</div>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
              {result.co2Annual.toLocaleString()} {t("co2_emissions.kg_co2")}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("sustainable_lifestyle.earths_required")}</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{result.planetCount}</div>
            <div className="text-xs mt-1 text-foreground-70">{t("sustainable_lifestyle.if_everyone")}</div>
          </div>
        </div>

        {result.improvements.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 rounded-lg">
            <h4 className="font-bold mb-2">{t("sustainable_lifestyle.improvements_title")}</h4>
            <div className="space-y-2">
              {result.improvements.map((imp, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <div className="text-sm">
                    <span className="font-semibold">{imp.area}:</span> {imp.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("sustainable_lifestyle.steps_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("sustainable_lifestyle.step_small")}</li>
            <li>{t("sustainable_lifestyle.step_focus")}</li>
            <li>{t("sustainable_lifestyle.step_share")}</li>
            <li>{t("sustainable_lifestyle.step_reassess")}</li>
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
        {t("sustainable_lifestyle.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("sustainable_lifestyle.title")}
      description={t("sustainable_lifestyle.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("sustainable_lifestyle.footer_note")}
     className="rtl" />
  );
}
