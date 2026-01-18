'use client';

/**
 * Tree Planting Calculator
 * Calculates CO2 offset from tree planting
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

interface CalculatorResult {
  totalCO2Offset: number;
  oxygenProduced: number;
  waterFiltered: number;
  wildlifeSupported: number;
  lifetimeCO2: number;
  monetaryValue: number;
}

export default function TreePlantingImpactCalculator() {
  const { t } = useTranslation();
  const [numberOfTrees, setNumberOfTrees] = useState<string>('');
  const [treeAge, setTreeAge] = useState<string>('10');
  const [treeType, setTreeType] = useState<string>('deciduous');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const treeTypeOptions: ComboboxOption[] = [
    { value: 'deciduous', label: t("calculators.environmental.tree_planting.type_deciduous") },
    { value: 'conifer', label: t("calculators.environmental.tree_planting.type_conifer") },
    { value: 'tropical', label: t("calculators.environmental.tree_planting.type_tropical") },
    { value: 'fruit', label: t("calculators.environmental.tree_planting.type_fruit") }
  ];

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const trees = parseFloat(numberOfTrees);
    const age = parseFloat(treeAge);

    if (isNaN(trees) || isNaN(age)) {
      setError(t("calculators.environmental.tree_planting.error_required"));
      return false;
    }

    if (trees <= 0 || age < 0) {
      setError(t("calculators.environmental.tree_planting.error_positive"));
      return false;
    }

    if (age > 100) {
      setError(t("calculators.environmental.tree_planting.error_age_max"));
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
        const trees = parseFloat(numberOfTrees);
        const age = parseFloat(treeAge);

        // CO2 absorption rates per tree per year (kg)
        const co2Rates: { [key: string]: number } = {
          deciduous: 21,
          conifer: 18,
          tropical: 28,
          fruit: 15,
        };

        const co2PerYear = co2Rates[treeType] || 21;
        const totalCO2Offset = trees * co2PerYear * age;

        // A mature tree produces ~120 kg of oxygen per year
        const oxygenProduced = trees * 120 * age;

        // Trees filter ~40000 liters of water per year
        const waterFiltered = trees * 40000 * age;

        // Estimate wildlife supported (birds, insects, etc.)
        const wildlifeSupported = Math.floor(trees * 3);

        // Lifetime CO2 offset (assuming 50 year lifespan)
        const lifetimeCO2 = trees * co2PerYear * 50;

        // Monetary value ($50-100 per tree per year in ecosystem services)
        const monetaryValue = trees * 75 * age;

        setResult({
          totalCO2Offset,
          oxygenProduced,
          waterFiltered,
          wildlifeSupported,
          lifetimeCO2,
          monetaryValue,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("calculators.environmental.tree_planting.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setNumberOfTrees('');
      setTreeAge('10');
      setTreeType('deciduous');
      setResult(null);
      setError('');
    }, 300);
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("calculators.environmental.tree_planting.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t("calculators.environmental.tree_planting.trees_label")}
          tooltip={t("calculators.environmental.tree_planting.trees_tooltip")}
        >
          <NumericInput
            value={numberOfTrees}
            onChange={(e) => {
              setNumberOfTrees(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("calculators.environmental.tree_planting.trees_placeholder")}
            min={1}
            unit={t("calculators.environmental.tree_planting.trees_unit")}
          />
        </InputContainer>

        <InputContainer
          label={t("calculators.environmental.tree_planting.age_label")}
          tooltip={t("calculators.environmental.tree_planting.age_tooltip")}
        >
          <NumericInput
            value={treeAge}
            onChange={(e) => {
              setTreeAge(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("calculators.environmental.tree_planting.age_placeholder")}
            min={0}
            max={100}
            unit={t("calculators.environmental.tree_planting.years_unit")}
          />
        </InputContainer>

        <InputContainer
          label={t("calculators.environmental.tree_planting.type_label")}
          tooltip={t("calculators.environmental.tree_planting.type_tooltip")}
        >
          <Combobox options={treeTypeOptions} value={treeType} onChange={setTreeType} />
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
              {t("calculators.environmental.tree_planting.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("calculators.environmental.tree_planting.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("calculators.environmental.tree_planting.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("calculators.environmental.tree_planting.use_case_1")}</li>
              <li>{t("calculators.environmental.tree_planting.use_case_2")}</li>
              <li>{t("calculators.environmental.tree_planting.use_case_3")}</li>
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
          {t("calculators.environmental.tree_planting.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.totalCO2Offset).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("calculators.environmental.tree_planting.result_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("calculators.environmental.tree_planting.details_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <div className="font-medium">{t("calculators.environmental.tree_planting.oxygen_produced")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.oxygenProduced).toFixed(2)} kg</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <div className="font-medium">{t("calculators.environmental.tree_planting.water_filtered")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.waterFiltered).toFixed(2)} L</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <div className="font-medium">{t("calculators.environmental.tree_planting.wildlife_supported")}</div>
            </div>
            <div className="text-sm text-foreground-70">{result.wildlifeSupported} {t("calculators.environmental.tree_planting.species")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div className="font-medium">{t("calculators.environmental.tree_planting.lifetime_co2")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.lifetimeCO2).toFixed(2)} kg CO₂</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("calculators.environmental.tree_planting.monetary_value")}</div>
            </div>
            <div className="text-sm text-foreground-70">${(result.monetaryValue).toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("calculators.environmental.tree_planting.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("calculators.environmental.tree_planting.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("calculators.environmental.tree_planting.title")}
      description={t("calculators.environmental.tree_planting.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
