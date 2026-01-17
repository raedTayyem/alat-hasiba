'use client';

/**
 * Cooking Time Calculator
 * Calculates cooking times based on weight, meat type, and cooking method
 * Supports chicken, beef, pork, turkey with roasting, grilling, and baking methods
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Flame, Clock, Thermometer, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CookingTimeResult {
  totalMinutes: number;
  hours: number;
  minutes: number;
  temperature: number;
  meatType: string;
  cookingMethod: string;
  weight: number;
}

const COOKING_TIMES: Record<string, Record<string, { minutesPerPound: number; temperature: number }>> = {
  chicken: {
    roasting: { minutesPerPound: 20, temperature: 350 },
    grilling: { minutesPerPound: 15, temperature: 375 },
    baking: { minutesPerPound: 20, temperature: 375 },
  },
  beef: {
    roasting: { minutesPerPound: 20, temperature: 325 },
    grilling: { minutesPerPound: 18, temperature: 400 },
    baking: { minutesPerPound: 25, temperature: 350 },
  },
  pork: {
    roasting: { minutesPerPound: 25, temperature: 350 },
    grilling: { minutesPerPound: 20, temperature: 375 },
    baking: { minutesPerPound: 30, temperature: 325 },
  },
  turkey: {
    roasting: { minutesPerPound: 15, temperature: 325 },
    grilling: { minutesPerPound: 12, temperature: 350 },
    baking: { minutesPerPound: 15, temperature: 325 },
  },
};

export default function CookingTimeCalculator() {
  const { t } = useTranslation(['calc/cooking', 'common']);
  const [weight, setWeight] = useState<string>('');
  const [meatType, setMeatType] = useState<string>('chicken');
  const [cookingMethod, setCookingMethod] = useState<string>('roasting');

  const [result, setResult] = useState<CookingTimeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const w = parseFloat(weight);

    if (isNaN(w)) {
      setError(t("cooking-time.error_invalid_input"));
      return false;
    }

    if (w <= 0) {
      setError(t("cooking-time.error_positive_weight"));
      return false;
    }

    if (w > 100) {
      setError(t("cooking-time.error_weight_too_large"));
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
        const w = parseFloat(weight);
        const cookingData = COOKING_TIMES[meatType][cookingMethod];

        const totalMinutes = Math.round(w * cookingData.minutesPerPound);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        setResult({
          totalMinutes,
          hours,
          minutes,
          temperature: cookingData.temperature,
          meatType,
          cookingMethod,
          weight: w,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("cooking-time.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);

    setTimeout(() => {
      setWeight('');
      setMeatType('chicken');
      setCookingMethod('roasting');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const meatTypeOptions = [
    { value: 'chicken', label: t("cooking-time.meat_chicken") },
    { value: 'beef', label: t("cooking-time.meat_beef") },
    { value: 'pork', label: t("cooking-time.meat_pork") },
    { value: 'turkey', label: t("cooking-time.meat_turkey") },
  ];

  const cookingMethodOptions = [
    { value: 'roasting', label: t("cooking-time.method_roasting") },
    { value: 'grilling', label: t("cooking-time.method_grilling") },
    { value: 'baking', label: t("cooking-time.method_baking") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("cooking-time.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("cooking-time.weight_label")}
          tooltip={t("cooking-time.weight_tooltip")}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => {
              setWeight(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("cooking-time.weight_placeholder")}
            startIcon={<Scale className="h-4 w-4" />}
            min={0}
            step={0.1}
          />
        </FormField>

        <FormField
          label={t("cooking-time.meat_type_label")}
          tooltip={t("cooking-time.meat_type_tooltip")}
        >
          <Combobox
            options={meatTypeOptions}
            value={meatType}
            onChange={(val) => setMeatType(val)}
            placeholder={t("cooking-time.meat_type_label")}
          />
        </FormField>

        <FormField
          label={t("cooking-time.cooking_method_label")}
          tooltip={t("cooking-time.cooking_method_tooltip")}
        >
          <Combobox
            options={cookingMethodOptions}
            value={cookingMethod}
            onChange={(val) => setCookingMethod(val)}
            placeholder={t("cooking-time.cooking_method_label")}
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
              {t("cooking-time.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("cooking-time.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("cooking-time.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("cooking-time.use_case_1")}</li>
              <li>{t("cooking-time.use_case_2")}</li>
              <li>{t("cooking-time.use_case_3")}</li>
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
          {t("cooking-time.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.hours > 0 ? `${result.hours}${t("common:common.units.h")} ${result.minutes}${t("common:common.units.min")}` : `${result.minutes}${t("common:common.units.min")}`}
        </div>
        <div className="text-lg text-foreground-70">
          {t("cooking-time.result_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("cooking-time.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Thermometer className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("cooking-time.temperature_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.temperature}{t("common:common.units.F")} ({Math.round((result.temperature - 32) * 5/9)}{t("common:common.units.C")})
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("cooking-time.total_time_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.totalMinutes} {t("cooking-time.minutes")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Flame className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("cooking-time.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("cooking-time.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("cooking-time.title")}
      description={t("cooking-time.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
