'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

export default function PetInsuranceCalculator() {
  const { t } = useTranslation('calc/pet');
  const [petType, setPetType] = useState<string>('dog');
  const [petAge, setPetAge] = useState<string>('');
  const [coverageLevel, setCoverageLevel] = useState<string>('basic');
  const [deductible, setDeductible] = useState<string>('500');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{
    monthlyPremium: number;
    annualPremium: number;
    lifetimeSavings: number;
    breakEvenCost: number;
  } | null>(null);

  const calculate = () => {
    setError('');
    const age = parseFloat(petAge);
    if (!age || age <= 0) {
      setError(t("pet-insurance-calculator.error_invalid_age"));
      return;
    }

    // Base premium calculation
    let basePremium = petType === 'dog' ? 50 : 35; // Monthly base

    // Age factor
    if (age < 2) basePremium *= 0.8;
    else if (age > 7) basePremium *= 1.5;

    // Coverage level
    const coverageFactors: Record<string, number> = {
      basic: 1.0,
      standard: 1.5,
      premium: 2.2,
      comprehensive: 3.0
    };
    basePremium *= coverageFactors[coverageLevel];

    // Deductible adjustment
    const deductibleVal = parseFloat(deductible);
    if (deductibleVal >= 1000) basePremium *= 0.8;
    else if (deductibleVal <= 250) basePremium *= 1.2;

    const monthlyPremium = basePremium;
    const annualPremium = monthlyPremium * 12;
    const lifetimeSavings = 15000 - (annualPremium * 10); // Estimated
    const breakEvenCost = annualPremium + deductibleVal;

    setResult({
      monthlyPremium: parseFloat(monthlyPremium.toFixed(2)),
      annualPremium: parseFloat(annualPremium.toFixed(2)),
      lifetimeSavings: parseFloat(lifetimeSavings.toFixed(2)),
      breakEvenCost: parseFloat(breakEvenCost.toFixed(2))
    });
  };

  const reset = () => {
    setPetType('dog');
    setPetAge('');
    setCoverageLevel('basic');
    setDeductible('500');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("pet-insurance-calculator.input_title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer
          label={t("pet-insurance-calculator.pet_type")}
          tooltip={t("pet-insurance-calculator.pet_type_tooltip")}
        >
          <Combobox
            options={[
              { value: "dog", label: t("pet-insurance-calculator.pet_dog") },
              { value: "cat", label: t("pet-insurance-calculator.pet_cat") }
            ]}
            value={petType}
            onChange={setPetType}
          />
        </InputContainer>

        <InputContainer
          label={t("pet-insurance-calculator.pet_age")}
          tooltip={t("pet-insurance-calculator.pet_age_tooltip")}
        >
          <NumericInput
            value={petAge}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPetAge(e.target.value)}
            unit={t("pet-insurance-calculator.age_unit")}
            placeholder={t("pet-insurance-calculator.enter_age")}
            min={0}
            max={20}
            step={1}
          />
        </InputContainer>

        <InputContainer
          label={t("pet-insurance-calculator.coverage_level")}
          tooltip={t("pet-insurance-calculator.coverage_tooltip")}
        >
          <Combobox
            options={[
              { value: "basic", label: t("pet-insurance-calculator.coverage_basic") },
              { value: "standard", label: t("pet-insurance-calculator.coverage_standard") },
              { value: "premium", label: t("pet-insurance-calculator.coverage_premium") },
              { value: "comprehensive", label: t("pet-insurance-calculator.coverage_comprehensive") }
            ]}
            value={coverageLevel}
            onChange={setCoverageLevel}
          />
        </InputContainer>

        <InputContainer
          label={t("pet-insurance-calculator.deductible")}
          tooltip={t("pet-insurance-calculator.deductible_tooltip")}
        >
          <Combobox
            options={[
              { value: "250", label: t("pet-insurance-calculator.deductible_250") },
              { value: "500", label: t("pet-insurance-calculator.deductible_500") },
              { value: "1000", label: t("pet-insurance-calculator.deductible_1000") }
            ]}
            value={deductible}
            onChange={setDeductible}
          />
        </InputContainer>
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("pet-insurance-calculator.calculate_btn")}
        resetText={t("pet-insurance-calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("pet-insurance-calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("pet-insurance-calculator.monthly_premium")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.monthlyPremium} {t("pet-insurance-calculator.currency")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("pet-insurance-calculator.annual_premium")}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {result.annualPremium} {t("pet-insurance-calculator.currency")}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("pet-insurance-calculator.break_even_cost")}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {result.breakEvenCost} {t("pet-insurance-calculator.currency")}
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("pet-insurance-calculator.lifetime_savings")}
          </div>
          <div className="text-2xl font-bold text-green-600">
            {result.lifetimeSavings > 0 ? '+' : ''}{result.lifetimeSavings} {t("pet-insurance-calculator.currency")}
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">
            {t("pet-insurance-calculator.tips_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("pet-insurance-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <span className="text-6xl">🛡️</span>
      </div>
      <p className="text-foreground-70">
        {t("pet-insurance-calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("pet-insurance-calculator.title")}
      description={t("pet-insurance-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("pet-insurance-calculator.footer_note")}
      className="rtl" />
  );
}
