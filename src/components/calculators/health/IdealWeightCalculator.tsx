'use client';

/**
 * Ideal Weight Calculator
 * Calculates ideal body weight using multiple formulas: Devine, Robinson, Miller, Hamwi
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Ruler, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface IdealWeightResult {
  devine: number;
  robinson: number;
  miller: number;
  hamwi: number;
  average: number;
  healthyRange: { min: number; max: number };
}

export default function IdealWeightCalculator() {
  const { t } = useTranslation(['calc/health', 'common']);
  const [gender, setGender] = useState<string>('male');
  const [height, setHeight] = useState<string>('');
  const [result, setResult] = useState<IdealWeightResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');


  const validateInputs = (): boolean => {
    setError('');
    const heightVal = parseFloat(height);

    if (isNaN(heightVal)) {
      setError(t("ideal_weight.errors.enter_height"));
      return false;
    }

    if (heightVal < 140 || heightVal > 250) {
      setError(t("ideal_weight.errors.height_range"));
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
        const heightCm = parseFloat(height);
        const heightInches = heightCm / 2.54;

        // All formulas work with inches over 5 feet (60 inches)
        const inchesOver5Feet = heightInches - 60;

        let devine: number, robinson: number, miller: number, hamwi: number;

        if (gender === 'male') {
          // Devine Formula: 50 kg + 2.3 kg per inch over 5 feet
          devine = 50 + (2.3 * inchesOver5Feet);
          // Robinson Formula: 52 kg + 1.9 kg per inch over 5 feet
          robinson = 52 + (1.9 * inchesOver5Feet);
          // Miller Formula: 56.2 kg + 1.41 kg per inch over 5 feet
          miller = 56.2 + (1.41 * inchesOver5Feet);
          // Hamwi Formula: 48 kg + 2.7 kg per inch over 5 feet
          hamwi = 48 + (2.7 * inchesOver5Feet);
        } else {
          // Devine Formula: 45.5 kg + 2.3 kg per inch over 5 feet
          devine = 45.5 + (2.3 * inchesOver5Feet);
          // Robinson Formula: 49 kg + 1.7 kg per inch over 5 feet
          robinson = 49 + (1.7 * inchesOver5Feet);
          // Miller Formula: 53.1 kg + 1.36 kg per inch over 5 feet
          miller = 53.1 + (1.36 * inchesOver5Feet);
          // Hamwi Formula: 45.5 kg + 2.2 kg per inch over 5 feet
          hamwi = 45.5 + (2.2 * inchesOver5Feet);
        }

        const average = (devine + robinson + miller + hamwi) / 4;

        // Healthy BMI range: 18.5 - 24.9
        const heightM = heightCm / 100;
        const minHealthy = 18.5 * heightM * heightM;
        const maxHealthy = 24.9 * heightM * heightM;

        setResult({
          devine: Math.round(devine * 10) / 10,
          robinson: Math.round(robinson * 10) / 10,
          miller: Math.round(miller * 10) / 10,
          hamwi: Math.round(hamwi * 10) / 10,
          average: Math.round(average * 10) / 10,
          healthyRange: {
            min: Math.round(minHealthy * 10) / 10,
            max: Math.round(maxHealthy * 10) / 10,
          },
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common.errors.calculationError"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setGender('male');
      setHeight('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const genderOptions = [
    { value: 'male', label: t("ideal_weight.inputs.male") },
    { value: 'female', label: t("ideal_weight.inputs.female") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("ideal_weight.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">

        <FormField
          label={t("ideal_weight.inputs.gender")}
          tooltip={t("ideal_weight.tooltips.gender")}
        >
          <Combobox
            options={genderOptions}
            value={gender}
            onChange={(val) => setGender(val)}
            placeholder={t("ideal_weight.inputs.gender")}
          />
        </FormField>

        <FormField
          label={t("ideal_weight.inputs.height")}
          tooltip={t("ideal_weight.tooltips.height")}
        >
          <NumberInput
            value={height}
            onValueChange={(val) => {
              setHeight(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={140}
            max={250}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("ideal_weight.about.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("ideal_weight.about.desc")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("ideal_weight.about.formulas_used")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("ideal_weight.formulas.devine")}</li>
              <li>{t("ideal_weight.formulas.robinson")}</li>
              <li>{t("ideal_weight.formulas.miller")}</li>
              <li>{t("ideal_weight.formulas.hamwi")}</li>
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
          {t("ideal_weight.results.average_ideal")}
        </div>
        <div className="text-5xl font-bold text-primary mb-2">
          {result.average} {t("common:common.units.kg")}
        </div>
        <div className="text-lg text-foreground-70">
          {t("ideal_weight.results.healthy_range")}: {result.healthyRange.min} - {result.healthyRange.max} {t("common:common.units.kg")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("ideal_weight.results.by_formula")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("ideal_weight.formulas.devine")}</div>
            <div className="text-2xl font-bold text-primary">
              {result.devine} {t("common:common.units.kg")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("ideal_weight.formulas.robinson")}</div>
            <div className="text-2xl font-bold text-primary">
              {result.robinson} {t("common:common.units.kg")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("ideal_weight.formulas.miller")}</div>
            <div className="text-2xl font-bold text-primary">
              {result.miller} {t("common:common.units.kg")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("ideal_weight.formulas.hamwi")}</div>
            <div className="text-2xl font-bold text-primary">
              {result.hamwi} {t("common:common.units.kg")}
            </div>
          </div>

        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("ideal_weight.about.note_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("ideal_weight.about.note_desc")}
            </p>
          </div>
        </div>
      </div>

    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("ideal_weight.title")}
      description={t("ideal_weight.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
