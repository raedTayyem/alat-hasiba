'use client';

/**
 * Baking Conversion Calculator
 * Converts between cups, grams, and ounces for common baking ingredients
 * Handles liquid and dry measurements with ingredient-specific conversions
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Info, Utensils } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface ConversionResult {
  cups: number;
  grams: number;
  ounces: number;
  ingredient: string;
  measurementType: string;
}

const INGREDIENT_CONVERSIONS: Record<string, { gramsPerCup: number; type: string }> = {
  flour_all_purpose: { gramsPerCup: 120, type: 'dry' },
  flour_bread: { gramsPerCup: 127, type: 'dry' },
  flour_cake: { gramsPerCup: 114, type: 'dry' },
  flour_whole_wheat: { gramsPerCup: 120, type: 'dry' },
  sugar_white: { gramsPerCup: 200, type: 'dry' },
  sugar_brown: { gramsPerCup: 220, type: 'dry' },
  sugar_powdered: { gramsPerCup: 120, type: 'dry' },
  butter: { gramsPerCup: 227, type: 'solid' },
  oil: { gramsPerCup: 218, type: 'liquid' },
  milk: { gramsPerCup: 244, type: 'liquid' },
  water: { gramsPerCup: 237, type: 'liquid' },
  honey: { gramsPerCup: 340, type: 'liquid' },
  cocoa_powder: { gramsPerCup: 85, type: 'dry' },
  nuts: { gramsPerCup: 120, type: 'dry' },
  oats: { gramsPerCup: 90, type: 'dry' },
};

export default function BakingConversionCalculator() {
  const { t } = useTranslation('calc/cooking');
  const [amount, setAmount] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('cups');
  const [ingredient, setIngredient] = useState<string>('flour_all_purpose');

  const [result, setResult] = useState<ConversionResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const amt = parseFloat(amount);

    if (isNaN(amt)) {
      setError(t("baking-conversion.error_invalid_input"));
      return false;
    }

    if (amt <= 0) {
      setError(t("baking-conversion.error_positive_amount"));
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
        const amt = parseFloat(amount);
        const ingredientData = INGREDIENT_CONVERSIONS[ingredient];
        const gramsPerCup = ingredientData.gramsPerCup;

        let cups: number;
        let grams: number;
        let ounces: number;

        if (fromUnit === 'cups') {
          cups = amt;
          grams = amt * gramsPerCup;
          ounces = grams / 28.3495;
        } else if (fromUnit === 'grams') {
          grams = amt;
          cups = amt / gramsPerCup;
          ounces = grams / 28.3495;
        } else { // ounces
          ounces = amt;
          grams = amt * 28.3495;
          cups = grams / gramsPerCup;
        }

        setResult({
          cups,
          grams,
          ounces,
          ingredient,
          measurementType: ingredientData.type,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("baking-conversion.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);

    setTimeout(() => {
      setAmount('');
      setFromUnit('cups');
      setIngredient('flour_all_purpose');
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
    { value: 'cups', label: t("baking-conversion.unit_cups") },
    { value: 'grams', label: t("baking-conversion.unit_grams") },
    { value: 'ounces', label: t("baking-conversion.unit_ounces") },
  ];

  const ingredientOptions = [
    // Flour group
    { value: 'flour_all_purpose', label: `${t("baking-conversion.group_flour")}: ${t("baking-conversion.flour_all_purpose")}` },
    { value: 'flour_bread', label: `${t("baking-conversion.group_flour")}: ${t("baking-conversion.flour_bread")}` },
    { value: 'flour_cake', label: `${t("baking-conversion.group_flour")}: ${t("baking-conversion.flour_cake")}` },
    { value: 'flour_whole_wheat', label: `${t("baking-conversion.group_flour")}: ${t("baking-conversion.flour_whole_wheat")}` },
    // Sugar group
    { value: 'sugar_white', label: `${t("baking-conversion.group_sugar")}: ${t("baking-conversion.sugar_white")}` },
    { value: 'sugar_brown', label: `${t("baking-conversion.group_sugar")}: ${t("baking-conversion.sugar_brown")}` },
    { value: 'sugar_powdered', label: `${t("baking-conversion.group_sugar")}: ${t("baking-conversion.sugar_powdered")}` },
    // Fats group
    { value: 'butter', label: `${t("baking-conversion.group_fats")}: ${t("baking-conversion.butter")}` },
    { value: 'oil', label: `${t("baking-conversion.group_fats")}: ${t("baking-conversion.oil")}` },
    // Liquids group
    { value: 'milk', label: `${t("baking-conversion.group_liquids")}: ${t("baking-conversion.milk")}` },
    { value: 'water', label: `${t("baking-conversion.group_liquids")}: ${t("baking-conversion.water")}` },
    { value: 'honey', label: `${t("baking-conversion.group_liquids")}: ${t("baking-conversion.honey")}` },
    // Other group
    { value: 'cocoa_powder', label: `${t("baking-conversion.group_other")}: ${t("baking-conversion.cocoa_powder")}` },
    { value: 'nuts', label: `${t("baking-conversion.group_other")}: ${t("baking-conversion.nuts")}` },
    { value: 'oats', label: `${t("baking-conversion.group_other")}: ${t("baking-conversion.oats")}` },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("baking-conversion.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("baking-conversion.amount_label")}
          tooltip={t("baking-conversion.amount_tooltip")}
        >
          <NumberInput
            value={amount}
            onValueChange={(val) => {
              setAmount(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("baking-conversion.amount_placeholder")}
            startIcon={<Scale className="h-4 w-4" />}
            min={0}
            step={0.1}
          />
        </FormField>

        <FormField
          label={t("baking-conversion.from_unit_label")}
          tooltip={t("baking-conversion.from_unit_tooltip")}
        >
          <Combobox
            options={unitOptions}
            value={fromUnit}
            onChange={(val) => setFromUnit(val)}
            placeholder={t("baking-conversion.from_unit_label")}
          />
        </FormField>

        <FormField
          label={t("baking-conversion.ingredient_label")}
          tooltip={t("baking-conversion.ingredient_tooltip")}
        >
          <Combobox
            options={ingredientOptions}
            value={ingredient}
            onChange={(val) => setIngredient(val)}
            placeholder={t("baking-conversion.ingredient_label")}
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
              {t("baking-conversion.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("baking-conversion.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("baking-conversion.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("baking-conversion.use_case_1")}</li>
              <li>{t("baking-conversion.use_case_2")}</li>
              <li>{t("baking-conversion.use_case_3")}</li>
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
          {t("baking-conversion.result_label")}
        </div>
        <div className="text-2xl font-bold text-primary mb-2">
          {(result.cups).toFixed(2)} {t("baking-conversion.unit_cups")} = {(result.grams).toFixed(2)}{t("common:common.units.g")} = {(result.ounces).toFixed(2)}{t("common:common.units.oz")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("baking-conversion.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Utensils className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("baking-conversion.unit_cups")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.cups).toFixed(2)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("baking-conversion.unit_grams")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.grams).toFixed(2)}{t("common:common.units.g")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("baking-conversion.unit_ounces")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.ounces).toFixed(2)}{t("common:common.units.oz")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("baking-conversion.tip_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("baking-conversion.tip_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("baking-conversion.title")}
      description={t("baking-conversion.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
