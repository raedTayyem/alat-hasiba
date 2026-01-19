'use client';

/**
 * Pasta Calculator
 * Calculates pasta portions, dry to cooked expansion, and servings
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Utensils, Scale, Info, Layers } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface PastaResult {
  dryPastaOz: number;
  dryPastaGrams: number;
  cookedPastaOz: number;
  cookedPastaGrams: number;
  servings: number;
}

const DRY_PASTA_PER_SERVING_OZ = 2; // 2 oz per serving
const DRY_PASTA_PER_SERVING_GRAMS = 56; // 56g per serving
const EXPANSION_RATIO = 2.5; // Pasta expands 2.5x when cooked

export default function PastaCookingCalculator() {
  const { t } = useTranslation(['calc/cooking', 'common']);
  const [servings, setServings] = useState<string>('');
  const [unit, setUnit] = useState<string>('oz'); // oz or grams

  const [result, setResult] = useState<PastaResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const servingsNum = parseFloat(servings);

    if (isNaN(servingsNum)) {
      setError(t("pasta-cooking-calculator.error_invalid_input"));
      return false;
    }

    if (servingsNum <= 0) {
      setError(t("pasta-cooking-calculator.error_positive_values"));
      return false;
    }

    if (servingsNum > 100) {
      setError(t("pasta-cooking-calculator.error_too_many_servings"));
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
        const servingsNum = parseFloat(servings);

        // Calculate dry pasta needed
        const dryPastaOz = servingsNum * DRY_PASTA_PER_SERVING_OZ;
        const dryPastaGrams = servingsNum * DRY_PASTA_PER_SERVING_GRAMS;

        // Calculate cooked pasta amount
        const cookedPastaOz = dryPastaOz * EXPANSION_RATIO;
        const cookedPastaGrams = dryPastaGrams * EXPANSION_RATIO;

        setResult({
          dryPastaOz,
          dryPastaGrams,
          cookedPastaOz,
          cookedPastaGrams,
          servings: servingsNum,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("pasta-cooking-calculator.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);

    setTimeout(() => {
      setServings('');
      setUnit('oz');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const unitOptions = [
    { value: 'oz', label: t("pasta-cooking-calculator.unit_oz") },
    { value: 'grams', label: t("pasta-cooking-calculator.unit_grams") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("pasta-cooking-calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("pasta-cooking-calculator.servings_label")}
          tooltip={t("pasta-cooking-calculator.servings_tooltip")}
        >
          <NumberInput
            value={servings}
            onValueChange={(val) => {
              setServings(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("pasta-cooking-calculator.servings_placeholder")}
            startIcon={<Utensils className="h-4 w-4" />}
            min={0}
            step={1}
          />
        </FormField>

        <FormField
          label={t("pasta-cooking-calculator.unit_label")}
          tooltip={t("pasta-cooking-calculator.unit_tooltip")}
        >
          <Combobox
            options={unitOptions}
            value={unit}
            onChange={(val) => setUnit(val)}
            placeholder={t("pasta-cooking-calculator.unit_label")}
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
              {t("pasta-cooking-calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("pasta-cooking-calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("pasta-cooking-calculator.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("pasta-cooking-calculator.use_case_1")}</li>
              <li>{t("pasta-cooking-calculator.use_case_2")}</li>
              <li>{t("pasta-cooking-calculator.use_case_3")}</li>
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
          {t("pasta-cooking-calculator.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {unit === 'oz' ? (result.dryPastaOz).toFixed(2) : (result.dryPastaGrams).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {unit === 'oz' ? t("pasta-cooking-calculator.oz_dry") : t("pasta-cooking-calculator.grams_dry")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("pasta-cooking-calculator.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Utensils className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pasta-cooking-calculator.cooked_pasta_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {unit === 'oz' ? `${(result.cookedPastaOz).toFixed(2)} ${t("common:common.units.oz")}` : `${(result.cookedPastaGrams).toFixed(2)} ${t("common:common.units.g")}`}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pasta-cooking-calculator.expansion_ratio_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {EXPANSION_RATIO}x
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Utensils className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pasta-cooking-calculator.servings_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.servings).toFixed(2)} {t("pasta-cooking-calculator.servings_unit")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pasta-cooking-calculator.per_serving_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {DRY_PASTA_PER_SERVING_OZ} {t("common:common.units.oz")} ({DRY_PASTA_PER_SERVING_GRAMS}{t("common:common.units.g")})
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("pasta-cooking-calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("pasta-cooking-calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("pasta-cooking-calculator.title")}
      description={t("pasta-cooking-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
