'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Scale, Activity, Info, Droplets } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

// Type definitions
interface WaterIntakeResult {
  baseWater: number;
  activityWater: number;
  totalWater: number;
  glasses: number;
  bottles: number;
}

export default function WaterIntakeCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);
  // State management
  const [weight, setWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('sedentary');
  const [climate, setClimate] = useState<string>('moderate');
  const [result, setResult] = useState<WaterIntakeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const weightValue = parseFloat(weight);

    if (isNaN(weightValue) || weightValue <= 0) {
      setError(t("common.errors.invalid"));
      return false;
    }

    if (weightValue < 20 || weightValue > 300) {
      setError(t("water.errors.weight_range"));
      return false;
    }

    return true;
  };

  // Calculation
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const weightValue = parseFloat(weight);

        // Base water intake: 30-35 ml per kg body weight
        const baseWater = weightValue * 0.033; // liters (33ml per kg)

        // Activity level adjustment
        let activityMultiplier = 1.0;
        switch (activityLevel) {
          case 'sedentary':
            activityMultiplier = 1.0;
            break;
          case 'light':
            activityMultiplier = 1.1;
            break;
          case 'moderate':
            activityMultiplier = 1.3;
            break;
          case 'active':
            activityMultiplier = 1.5;
            break;
          case 'very_active':
            activityMultiplier = 1.7;
            break;
        }

        // Climate adjustment
        let climateAddition = 0;
        switch (climate) {
          case 'cold':
            climateAddition = 0;
            break;
          case 'moderate':
            climateAddition = 0.25;
            break;
          case 'hot':
            climateAddition = 0.5;
            break;
          case 'very_hot':
            climateAddition = 1.0;
            break;
        }

        const activityWater = baseWater * (activityMultiplier - 1);
        const totalWater = baseWater * activityMultiplier + climateAddition;

        // Convert to glasses (250ml) and bottles (500ml)
        const glasses = Math.round((totalWater * 1000) / 250);
        const bottles = Math.round((totalWater * 1000) / 500);

        setResult({
          baseWater,
          activityWater,
          totalWater,
          glasses,
          bottles,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common.errors.calculationError"));
      }
    }, 300);
  };

  // Reset
  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setWeight('');
      setActivityLevel('sedentary');
      setClimate('moderate');
      setResult(null);
      setError('');
    }, 300);
  };

  // Event handlers
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const activityOptions = [
    { value: 'sedentary', label: t("protein.inputs.sedentary") },
    { value: 'light', label: t("protein.inputs.light") },
    { value: 'moderate', label: t("protein.inputs.moderate") },
    { value: 'active', label: t("protein.inputs.active") },
    { value: 'very_active', label: t("protein.inputs.very_active") },
  ];

  const climateOptions = [
    { value: 'cold', label: t("water.inputs.climate_cold") },
    { value: 'moderate', label: t("water.inputs.climate_moderate") },
    { value: 'hot', label: t("water.inputs.climate_hot") },
    { value: 'very_hot', label: t("water.inputs.climate_very_hot") },
  ];

  // Input section
  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("water.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Weight Input */}
        <FormField
          label={t("calorie.inputs.weight")}
          tooltip={t("water.tooltips.weight")}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={1}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>

        {/* Activity Level */}
        <FormField
          label={t("protein.inputs.activity_level")}
          tooltip={t("protein.tooltips.activity")}
        >
          <Combobox
            options={activityOptions}
            value={activityLevel}
            onChange={(val) => setActivityLevel(val)}
            placeholder={t("protein.inputs.activity_level")}
          />
        </FormField>

        {/* Climate */}
        <FormField
          label={t("water.inputs.climate")}
          tooltip={t("water.tooltips.climate")}
        >
          <Combobox
            options={climateOptions}
            value={climate}
            onChange={(val) => setClimate(val)}
            placeholder={t("water.inputs.climate")}
          />
        </FormField>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button
          onClick={calculate}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 ml-1" />
          {t("common.calculate")}
        </button>

        <button
          onClick={resetCalculator}
          className="outline-button flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 ml-1" />
          {t("common.reset")}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn max-w-md mx-auto">
          <Info className="w-5 h-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Information Section */}
      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("water.about.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("water.about.desc")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("water.about.benefits_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("water.about.benefit_1")}</li>
              <li>{t("water.about.benefit_2")}</li>
              <li>{t("water.about.benefit_3")}</li>
              <li>{t("water.about.benefit_4")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  // Result section
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      {/* Main Result */}
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("water.results.daily_recommendation")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.totalWater).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("water.results.liters")}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("water.results.breakdown")}
        </h3>

        {/* Result Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Base Water */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Droplets className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("water.results.base")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {(result.baseWater).toFixed(2)} {t("water.results.liters_short")}
            </div>
          </div>

          {/* Activity Addition */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Activity className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("water.results.activity_addition")}</div>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              +{(result.activityWater).toFixed(2)} {t("water.results.liters_short")}
            </div>
          </div>

          {/* Glasses */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Droplets className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("water.results.glasses")}</div>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {result.glasses} {t("water.results.glasses_unit")}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {t("water.results.glass_size")}
            </div>
          </div>

          {/* Bottles */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Droplets className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("water.results.bottles")}</div>
            </div>
            <div className="text-2xl font-bold text-cyan-500">
              {result.bottles} {t("water.results.bottles_unit")}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {t("water.results.bottle_size")}
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("water.tips.title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("water.tips.desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("water.title")}
      description={t("water.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
