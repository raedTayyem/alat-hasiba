'use client';

/**
 * Turkey Calculator
 * Calculates turkey cooking time and thawing time based on weight
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Clock, Thermometer, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface TurkeyResult {
  cookingTimeMinutes: number;
  cookingTimeHours: number;
  thawingTimeDays: number;
  weight: number;
  stuffed: boolean;
  ovenTemp: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const STUFFED_MINUTES_PER_POUND = 15;
const UNSTUFFED_MINUTES_PER_POUND = 13;
const THAWING_HOURS_PER_POUND = 24 / 4.5; // 24 hours per 4-5 lbs
const RECOMMENDED_OVEN_TEMP = 325; // °F

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function TurkeyCookingCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/cooking', 'common']);
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [weight, setWeight] = useState<string>('');
  const [stuffed, setStuffed] = useState<boolean>(false);

  // Result state
  const [result, setResult] = useState<TurkeyResult | null>(null);

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

    const weightNum = parseFloat(weight);

    if (isNaN(weightNum)) {
      setError(t("turkey-cooking-calculator.error_invalid_input"));
      return false;
    }

    if (weightNum <= 0) {
      setError(t("turkey-cooking-calculator.error_positive_values"));
      return false;
    }

    if (weightNum > 50) {
      setError(t("turkey-cooking-calculator.error_too_large"));
      return false;
    }

    if (weightNum < 4) {
      setError(t("turkey-cooking-calculator.error_too_small"));
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
        const weightNum = parseFloat(weight);

        // Calculate cooking time
        const minutesPerPound = stuffed ? STUFFED_MINUTES_PER_POUND : UNSTUFFED_MINUTES_PER_POUND;
        const cookingTimeMinutes = weightNum * minutesPerPound;
        const cookingTimeHours = cookingTimeMinutes / 60;

        // Calculate thawing time (in refrigerator)
        const thawingTimeHours = weightNum * THAWING_HOURS_PER_POUND;
        const thawingTimeDays = thawingTimeHours / 24;

        setResult({
          cookingTimeMinutes,
          cookingTimeHours,
          thawingTimeDays,
          weight: weightNum,
          stuffed,
          ovenTemp: RECOMMENDED_OVEN_TEMP,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("turkey-cooking-calculator.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);

    setTimeout(() => {
      setWeight('');
      setStuffed(false);
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
    const formatTime = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}${t("common:common.units.h")} ${m}${t("common:common.units.min")}`;
  };

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
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("turkey-cooking-calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("turkey-cooking-calculator.weight_label")}
          tooltip={t("turkey-cooking-calculator.weight_tooltip")}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => {
              setWeight(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("turkey-cooking-calculator.weight_placeholder")}
            startIcon={<Scale className="h-4 w-4" />}
            min={4}
            max={50}
            step={0.5}
            unit={t("common:common.units.lb")}
          />
        </FormField>

        <FormField
          label={t("turkey-cooking-calculator.stuffed_label")}
          tooltip={t("turkey-cooking-calculator.stuffed_tooltip")}
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={!stuffed}
                onChange={() => setStuffed(false)}
                className="mr-2"
              />
              <span>{t("turkey-cooking-calculator.unstuffed")}</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                checked={stuffed}
                onChange={() => setStuffed(true)}
                className="mr-2"
              />
              <span>{t("turkey-cooking-calculator.stuffed")}</span>
            </label>
          </div>
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
              {t("turkey-cooking-calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("turkey-cooking-calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("turkey-cooking-calculator.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("turkey-cooking-calculator.use_case_1")}</li>
              <li>{t("turkey-cooking-calculator.use_case_2")}</li>
              <li>{t("turkey-cooking-calculator.use_case_3")}</li>
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
          {t("turkey-cooking-calculator.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatTime(result.cookingTimeHours)}
        </div>
        <div className="text-lg text-foreground-70">
          ({(result.cookingTimeMinutes).toFixed(0)} {t("turkey-cooking-calculator.minutes_unit")})
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("turkey-cooking-calculator.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("turkey-cooking-calculator.thawing_time_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.thawingTimeDays).toFixed(1)} {t("turkey-cooking-calculator.days_unit")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Thermometer className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("turkey-cooking-calculator.oven_temp_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.ovenTemp}{t("common:common.units.F")} (163{t("common:common.units.C")})
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("turkey-cooking-calculator.weight_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.weight).toFixed(1)} {t("common:common.units.lb")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Info className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("turkey-cooking-calculator.turkey_type_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.stuffed ? t("turkey-cooking-calculator.stuffed") : t("turkey-cooking-calculator.unstuffed")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("turkey-cooking-calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("turkey-cooking-calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("turkey-cooking-calculator.title")}
      description={t("turkey-cooking-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
