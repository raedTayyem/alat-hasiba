'use client';

/**
 * Rice Calculator
 * Calculates rice portions, water ratios, and cooking times by rice type
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, Clock, Scale, Info, Utensils } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface RiceResult {
  dryCups: number;
  waterCups: number;
  cookedCups: number;
  cookingTime: number;
  riceType: string;
  servings: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const RICE_TYPES = {
  white: { waterRatio: 2, cookingTime: 18, expansion: 3, name: 'white' },
  brown: { waterRatio: 2.5, cookingTime: 45, expansion: 3.5, name: 'brown' },
  basmati: { waterRatio: 1.5, cookingTime: 15, expansion: 2.5, name: 'basmati' },
  jasmine: { waterRatio: 1.75, cookingTime: 15, expansion: 3, name: 'jasmine' },
};

const SERVINGS_PER_CUP_DRY = 2.5; // Average servings per cup of dry rice

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function RiceCookingCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/cooking', 'common']);
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [servings, setServings] = useState<string>('');
  const [riceType, setRiceType] = useState<string>('white');

  // Result state
  const [result, setResult] = useState<RiceResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    initDateInputRTL();
  }, []);

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const servingsNum = parseFloat(servings);

    if (isNaN(servingsNum)) {
      setError(t("rice-cooking-calculator.error_invalid_input"));
      return false;
    }

    if (servingsNum <= 0) {
      setError(t("rice-cooking-calculator.error_positive_values"));
      return false;
    }

    if (servingsNum > 100) {
      setError(t("rice-cooking-calculator.error_too_many_servings"));
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------------------------
  // CALCULATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const servingsNum = parseFloat(servings);
        const rice = RICE_TYPES[riceType as keyof typeof RICE_TYPES];

        // Calculate dry rice needed
        const dryCups = servingsNum / SERVINGS_PER_CUP_DRY;

        // Calculate water needed based on rice type
        const waterCups = dryCups * rice.waterRatio;

        // Calculate cooked rice
        const cookedCups = dryCups * rice.expansion;

        setResult({
          dryCups,
          waterCups,
          cookedCups,
          cookingTime: rice.cookingTime,
          riceType: rice.name,
          servings: servingsNum,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("rice-cooking-calculator.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);

    setTimeout(() => {
      setServings('');
      setRiceType('white');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
    // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  // ---------------------------------------------------------------------------
  // JSX SECTIONS
  // ---------------------------------------------------------------------------
  const riceTypeOptions = [
    { value: 'white', label: t("rice-cooking-calculator.type_white") },
    { value: 'brown', label: t("rice-cooking-calculator.type_brown") },
    { value: 'basmati', label: t("rice-cooking-calculator.type_basmati") },
    { value: 'jasmine', label: t("rice-cooking-calculator.type_jasmine") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("rice-cooking-calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("rice-cooking-calculator.servings_label")}
          tooltip={t("rice-cooking-calculator.servings_tooltip")}
        >
          <NumberInput
            value={servings}
            onValueChange={(val) => {
              setServings(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("rice-cooking-calculator.servings_placeholder")}
            startIcon={<Utensils className="h-4 w-4" />}
            min={1}
            step={1}
          />
        </FormField>

        <FormField
          label={t("rice-cooking-calculator.rice_type_label")}
          tooltip={t("rice-cooking-calculator.rice_type_tooltip")}
        >
          <Combobox
            options={riceTypeOptions}
            value={riceType}
            onChange={(val) => {
              setRiceType(val);
              if (error) setError('');
            }}
            placeholder={t("rice-cooking-calculator.rice_type_placeholder")}
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
              {t("rice-cooking-calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("rice-cooking-calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("rice-cooking-calculator.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("rice-cooking-calculator.use_case_1")}</li>
              <li>{t("rice-cooking-calculator.use_case_2")}</li>
              <li>{t("rice-cooking-calculator.use_case_3")}</li>
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
          {t("rice-cooking-calculator.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.dryCups).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("rice-cooking-calculator.result_unit_cups_dry")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("rice-cooking-calculator.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Droplets className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("rice-cooking-calculator.water_needed_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.waterCups).toFixed(2)} {t("rice-cooking-calculator.cups_unit")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("rice-cooking-calculator.cooked_rice_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.cookedCups).toFixed(2)} {t("rice-cooking-calculator.cups_unit")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("rice-cooking-calculator.cooking_time_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.cookingTime} {t("common:common.units.min")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Info className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("rice-cooking-calculator.rice_type_result_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t(`rice-cooking-calculator.type_${result.riceType}`)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("rice-cooking-calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("rice-cooking-calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("rice-cooking-calculator.title")}
      description={t("rice-cooking-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
