'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Leaf } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

export default function EcoScoreCalculator() {
  const { t } = useTranslation('calc/environmental');

  const [transport, setTransport] = useState<string>('car');
  const [diet, setDiet] = useState<string>('mixed');
  const [energy, setEnergy] = useState<string>('grid');
  const [recycling, setRecycling] = useState<string>('sometimes');
  const [shopping, setShopping] = useState<string>('regular');
  const [result, setResult] = useState<{
    totalScore: number;
    rating: string;
    category: string;
    improvements: string[];
  } | null>(null);

  const transportOptions = [
    { value: 'walk', label: t("eco_score.options.walk") },
    { value: 'public', label: t("eco_score.options.public") },
    { value: 'hybrid', label: t("eco_score.options.hybrid") },
    { value: 'car', label: t("eco_score.options.car") }
  ];

  const dietOptions = [
    { value: 'vegan', label: t("eco_score.options.vegan") },
    { value: 'vegetarian', label: t("eco_score.options.vegetarian") },
    { value: 'mixed', label: t("eco_score.options.mixed") },
    { value: 'meat-heavy', label: t("eco_score.options.meat_heavy") }
  ];

  const energyOptions = [
    { value: 'solar', label: t("eco_score.options.solar") },
    { value: 'green', label: t("eco_score.options.green") },
    { value: 'grid', label: t("eco_score.options.grid") }
  ];

  const recyclingOptions = [
    { value: 'always', label: t("eco_score.options.always") },
    { value: 'often', label: t("eco_score.options.often") },
    { value: 'sometimes', label: t("eco_score.options.sometimes") },
    { value: 'never', label: t("eco_score.options.never") }
  ];

  const shoppingOptions = [
    { value: 'minimal', label: t("eco_score.options.minimal") },
    { value: 'moderate', label: t("eco_score.options.moderate") },
    { value: 'regular', label: t("eco_score.options.regular") },
    { value: 'excessive', label: t("eco_score.options.excessive") }
  ];

  const calculate = () => {
    let score = 0;

    // Transport scoring (0-25 points)
    const transportScores: { [key: string]: number } = {
      'walk': 25, 'public': 20, 'hybrid': 15, 'car': 5
    };
    score += transportScores[transport];

    // Diet scoring (0-25 points)
    const dietScores: { [key: string]: number } = {
      'vegan': 25, 'vegetarian': 20, 'mixed': 12, 'meat-heavy': 5
    };
    score += dietScores[diet];

    // Energy scoring (0-20 points)
    const energyScores: { [key: string]: number } = {
      'solar': 20, 'green': 15, 'grid': 5
    };
    score += energyScores[energy];

    // Recycling scoring (0-15 points)
    const recyclingScores: { [key: string]: number } = {
      'always': 15, 'often': 10, 'sometimes': 5, 'never': 0
    };
    score += recyclingScores[recycling];

    // Shopping scoring (0-15 points)
    const shoppingScores: { [key: string]: number } = {
      'minimal': 15, 'moderate': 10, 'regular': 5, 'excessive': 0
    };
    score += shoppingScores[shopping];

    // Rating based on score
    let rating = '';
    let category = '';
    if (score >= 80) {
      rating = t("eco_score.ratings.excellent");
      category = 'A+';
    } else if (score >= 65) {
      rating = t("eco_score.ratings.very_good");
      category = 'A';
    } else if (score >= 50) {
      rating = t("eco_score.ratings.good");
      category = 'B';
    } else if (score >= 35) {
      rating = t("eco_score.ratings.average");
      category = 'C';
    } else {
      rating = t("eco_score.ratings.needs_improvement");
      category = 'D';
    }

    // Generate improvement suggestions
    const improvements: string[] = [];
    if (transportScores[transport] < 20) {
      improvements.push(t("eco_score.suggestions.transport"));
    }
    if (dietScores[diet] < 20) {
      improvements.push(t("eco_score.suggestions.diet"));
    }
    if (energyScores[energy] < 15) {
      improvements.push(t("eco_score.suggestions.energy"));
    }
    if (recyclingScores[recycling] < 10) {
      improvements.push(t("eco_score.suggestions.recycling"));
    }
    if (shoppingScores[shopping] < 10) {
      improvements.push(t("eco_score.suggestions.shopping"));
    }

    setResult({
      totalScore: score,
      rating,
      category,
      improvements
    });
  };

  const reset = () => {
    setTransport('car');
    setDiet('mixed');
    setEnergy('grid');
    setRecycling('sometimes');
    setShopping('regular');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("eco_score.section_title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("eco_score.transport")} tooltip={t("eco_score.transport_tooltip")}>
          <Combobox
            options={transportOptions}
            value={transport}
            onChange={(val) => setTransport(val)}
            placeholder={t("eco_score.transport")}
          />
        </FormField>

        <FormField label={t("eco_score.diet")} tooltip={t("eco_score.diet_tooltip")}>
          <Combobox
            options={dietOptions}
            value={diet}
            onChange={(val) => setDiet(val)}
            placeholder={t("eco_score.diet")}
          />
        </FormField>

        <FormField label={t("eco_score.energy")} tooltip={t("eco_score.energy_tooltip")}>
          <Combobox
            options={energyOptions}
            value={energy}
            onChange={(val) => setEnergy(val)}
            placeholder={t("eco_score.energy")}
          />
        </FormField>

        <FormField label={t("eco_score.recycling")} tooltip={t("eco_score.recycling_tooltip")}>
          <Combobox
            options={recyclingOptions}
            value={recycling}
            onChange={(val) => setRecycling(val)}
            placeholder={t("eco_score.recycling")}
          />
        </FormField>

        <FormField label={t("eco_score.shopping")} tooltip={t("eco_score.shopping_tooltip")}>
          <Combobox
            options={shoppingOptions}
            value={shopping}
            onChange={(val) => setShopping(val)}
            placeholder={t("eco_score.shopping")}
          />
        </FormField>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("eco_score.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg text-center">
          <div className="text-sm text-foreground-70 mb-2">{t("eco_score.total_score")}</div>
          <div className="text-6xl font-bold text-primary mb-2">{result.totalScore}</div>
          <div className="text-2xl font-bold mb-1">{result.rating}</div>
          <div className="inline-block px-4 py-2 bg-primary text-white rounded-lg text-xl font-bold">
            {t("eco_score.category")}: {result.category}
          </div>
        </div>

        {result.improvements.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              {t("eco_score.suggestions_title")}
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {result.improvements.map((imp, idx) => (
                <li key={idx}>{imp}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("eco_score.rating_scale")}</h4>
          <ul className="text-sm space-y-1">
            <li>A+ (80-100): {t("eco_score.scale_desc.excellent")}</li>
            <li>A (65-79): {t("eco_score.scale_desc.very_good")}</li>
            <li>B (50-64): {t("eco_score.scale_desc.good")}</li>
            <li>C (35-49): {t("eco_score.scale_desc.average")}</li>
            <li>D (0-34): {t("eco_score.scale_desc.needs_improvement")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Leaf className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">
        {t("eco_score.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("eco_score.title")}
      description={t("eco_score.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("eco_score.footer_note")}
     className="rtl" />
  );
}
