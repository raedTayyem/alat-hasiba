'use client';

/**
 * Coffee Ratio Calculator
 * Calculates coffee-ratio-calculator and water amounts based on golden ratio and brewing method
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Coffee, Droplets, Scale, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CoffeeResult {
  coffeeGrams: number;
  waterGrams: number;
  coffeeTablespoons: number;
  waterCups: number;
  ratio: string;
  strength: string;
}

const RATIOS = {
  weak: 18, // 1:18 coffee to water
  normal: 16, // 1:16 golden ratio
  strong: 14, // 1:14
};

const GRAMS_PER_TABLESPOON = 5;
const GRAMS_PER_CUP_WATER = 236.6; // 1 cup = 236.6g water

export default function CoffeeRatioCalculator() {
  const { t } = useTranslation(['calc/cooking', 'common']);
  const [cups, setCups] = useState<string>('');
  const [strength, setStrength] = useState<string>('normal');

  const [result, setResult] = useState<CoffeeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const cupsNum = parseFloat(cups);

    if (isNaN(cupsNum)) {
      setError(t("coffee-ratio-calculator.error_invalid_input"));
      return false;
    }

    if (cupsNum <= 0) {
      setError(t("coffee-ratio-calculator.error_positive_values"));
      return false;
    }

    if (cupsNum > 100) {
      setError(t("coffee-ratio-calculator.error_too_many_cups"));
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
        const cupsNum = parseFloat(cups);
        const ratio = RATIOS[strength as keyof typeof RATIOS];

        // Calculate water needed in grams
        const waterGrams = cupsNum * GRAMS_PER_CUP_WATER;

        // Calculate coffee needed using ratio (1:ratio)
        const coffeeGrams = waterGrams / ratio;

        // Convert to tablespoons
        const coffeeTablespoons = coffeeGrams / GRAMS_PER_TABLESPOON;

        setResult({
          coffeeGrams,
          waterGrams,
          coffeeTablespoons,
          waterCups: cupsNum,
          ratio: `1:${ratio}`,
          strength,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("coffee-ratio-calculator.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);

    setTimeout(() => {
      setCups('');
      setStrength('normal');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const strengthOptions = [
    { value: 'weak', label: t("coffee-ratio-calculator.strength_weak") },
    { value: 'normal', label: t("coffee-ratio-calculator.strength_normal") },
    { value: 'strong', label: t("coffee-ratio-calculator.strength_strong") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("coffee-ratio-calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("coffee-ratio-calculator.cups_label")}
          tooltip={t("coffee-ratio-calculator.cups_tooltip")}
        >
          <NumberInput
            value={cups}
            onValueChange={(val) => {
              setCups(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("coffee-ratio-calculator.cups_placeholder")}
            startIcon={<Coffee className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("coffee-ratio-calculator.strength_label")}
          tooltip={t("coffee-ratio-calculator.strength_tooltip")}
        >
          <Combobox
            options={strengthOptions}
            value={strength}
            onChange={(val) => setStrength(val)}
            placeholder={t("coffee-ratio-calculator.strength_label")}
          />
        </FormField>
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
              {t("coffee-ratio-calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("coffee-ratio-calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("coffee-ratio-calculator.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("coffee-ratio-calculator.use_case_1")}</li>
              <li>{t("coffee-ratio-calculator.use_case_2")}</li>
              <li>{t("coffee-ratio-calculator.use_case_3")}</li>
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
          {t("coffee-ratio-calculator.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.coffeeGrams).toFixed(2)}g
        </div>
        <div className="text-lg text-foreground-70">
          (~{(result.coffeeTablespoons).toFixed(2)} {t("coffee-ratio-calculator.tablespoons_unit")})
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("coffee-ratio-calculator.title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Droplets className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("coffee-ratio-calculator.water_needed_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.waterGrams).toFixed(2)}{t("common:common.units.g")} ({(result.waterCups).toFixed(2)} {t("coffee-ratio-calculator.cups_unit")})
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("coffee-ratio-calculator.ratio_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.ratio}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Coffee className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("coffee-ratio-calculator.strength_result_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t(`coffee-ratio-calculator.strength_${result.strength}`)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("coffee-ratio-calculator.coffeeTablespoons")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.coffeeTablespoons).toFixed(2)} {t("common.tablespoon")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("coffee-ratio-calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("coffee-ratio-calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("calculators.cooking.coffee-ratio-calculator.title")}
      description={t("calculators.cooking.coffee-ratio-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
