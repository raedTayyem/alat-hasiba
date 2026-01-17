'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

export default function PetAdoptionCostCalculator() {
  const { t } = useTranslation('calc/pet');
  const [petType, setPetType] = useState<string>('dog');
  const [petSize, setPetSize] = useState<string>('medium');
  const [foodQuality, setFoodQuality] = useState<string>('standard');
  const [result, setResult] = useState<{
    initialCost: number;
    monthlyFood: number;
    monthlyVet: number;
    monthlyMisc: number;
    monthlyTotal: number;
    annualTotal: number;
  } | null>(null);

  const calculate = () => {
    // Initial costs
    const initialCosts: Record<string, number> = {
      dog: 500,
      cat: 300
    };

    // Monthly food costs
    const foodCosts: Record<string, Record<string, number>> = {
      dog: { small: 100, medium: 200, large: 350 },
      cat: { small: 80, medium: 80, large: 80 }
    };

    const qualityFactors: Record<string, number> = {
      budget: 0.7,
      standard: 1.0,
      premium: 1.5
    };

    const initialCost = initialCosts[petType];
    const monthlyFood = foodCosts[petType][petSize] * qualityFactors[foodQuality];
    const monthlyVet = petType === 'dog' ? 50 : 40;
    const monthlyMisc = petType === 'dog' ? 100 : 70; // toys, grooming, etc.
    const monthlyTotal = monthlyFood + monthlyVet + monthlyMisc;
    const annualTotal = (monthlyTotal * 12) + initialCost;

    setResult({
      initialCost,
      monthlyFood: parseFloat(monthlyFood.toFixed(2)),
      monthlyVet,
      monthlyMisc,
      monthlyTotal: parseFloat(monthlyTotal.toFixed(2)),
      annualTotal: parseFloat(annualTotal.toFixed(2))
    });
  };

  const reset = () => {
    setPetType('dog');
    setPetSize('medium');
    setFoodQuality('standard');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("pet-adoption-cost-calculator.input_title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputContainer label={t("pet-adoption-cost-calculator.pet_type")}>
          <select value={petType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPetType(e.target.value)} className="calculator-input w-full">
            <option value="dog">{t("pet-adoption-cost-calculator.pet_dog")}</option>
            <option value="cat">{t("pet-adoption-cost-calculator.pet_cat")}</option>
          </select>
        </InputContainer>

        <InputContainer label={t("pet-adoption-cost-calculator.pet_size")}>
          <select value={petSize} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPetSize(e.target.value)} className="calculator-input w-full">
            <option value="small">{t("pet-adoption-cost-calculator.size_small")}</option>
            <option value="medium">{t("pet-adoption-cost-calculator.size_medium")}</option>
            <option value="large">{t("pet-adoption-cost-calculator.size_large")}</option>
          </select>
        </InputContainer>

        <InputContainer label={t("pet-adoption-cost-calculator.food_quality")}>
          <select value={foodQuality} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFoodQuality(e.target.value)} className="calculator-input w-full">
            <option value="budget">{t("pet-adoption-cost-calculator.quality_budget")}</option>
            <option value="standard">{t("pet-adoption-cost-calculator.quality_standard")}</option>
            <option value="premium">{t("pet-adoption-cost-calculator.quality_premium")}</option>
          </select>
        </InputContainer>
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("pet-adoption-cost-calculator.calculate_btn")}
        resetText={t("pet-adoption-cost-calculator.reset_btn")}
      />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("pet-adoption-cost-calculator.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("pet-adoption-cost-calculator.initial_cost")}</div>
          <div className="text-3xl font-bold text-primary">{result.initialCost} {t("pet-adoption-cost-calculator.currency")}</div>
        </div>

        <div className="bg-foreground/5 p-4 rounded-lg">
          <h4 className="font-bold mb-3">{t("pet-adoption-cost-calculator.monthly_breakdown")}</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{t("pet-adoption-cost-calculator.monthly_food")}</span>
              <span className="font-bold">{result.monthlyFood} {t("pet-adoption-cost-calculator.currency")}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("pet-adoption-cost-calculator.monthly_vet")}</span>
              <span className="font-bold">{result.monthlyVet} {t("pet-adoption-cost-calculator.currency")}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("pet-adoption-cost-calculator.monthly_misc")}</span>
              <span className="font-bold">{result.monthlyMisc} {t("pet-adoption-cost-calculator.currency")}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between">
              <span className="font-bold">{t("pet-adoption-cost-calculator.monthly_total")}</span>
              <span className="font-bold text-blue-600">{result.monthlyTotal} {t("pet-adoption-cost-calculator.currency")}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("pet-adoption-cost-calculator.annual_total")}</div>
          <div className="text-2xl font-bold text-blue-600">{result.annualTotal} {t("pet-adoption-cost-calculator.currency")}</div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4"><span className="text-6xl">💰</span></div>
      <p className="text-foreground-70">{t("pet-adoption-cost-calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("pet-adoption-cost-calculator.title")}
      description={t("pet-adoption-cost-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("pet-adoption-cost-calculator.footer_note")}
      className="rtl" />
  );
}
