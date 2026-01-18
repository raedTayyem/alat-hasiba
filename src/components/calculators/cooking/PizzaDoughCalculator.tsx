'use client';

/**
 * Pizza Dough Calculator
 * Calculates pizza dough ingredients using baker's percentages
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pizza, Droplets, Scale, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface PizzaDoughResult {
  flour: number;
  water: number;
  yeast: number;
  salt: number;
  oil: number;
  pizzaBalls: number;
  hydration: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const GRAMS_PER_PIZZA = 275; // Average dough weight per pizza
const YEAST_PERCENTAGE = 0.02; // 2% yeast
const SALT_PERCENTAGE = 0.02; // 2% salt
const OIL_PERCENTAGE = 0.03; // 3% oil

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function PizzaDoughCalculator() {
  const { t } = useTranslation(['calc/cooking', 'common']);
  const [pizzas, setPizzas] = useState<string>('');
  const [hydration, setHydration] = useState<string>('65');

  const [result, setResult] = useState<PizzaDoughResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const pizzasNum = parseFloat(pizzas);
    const hydrationNum = parseFloat(hydration);

    if (isNaN(pizzasNum) || isNaN(hydrationNum)) {
      setError(t("pizza-dough-calculator.error_invalid_input"));
      return false;
    }

    if (pizzasNum <= 0) {
      setError(t("pizza-dough-calculator.error_positive_values"));
      return false;
    }

    if (hydrationNum < 50 || hydrationNum > 80) {
      setError(t("pizza-dough-calculator.error_hydration_range"));
      return false;
    }

    if (pizzasNum > 100) {
      setError(t("pizza-dough-calculator.error_too_many_pizzas"));
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
        const pizzasNum = parseFloat(pizzas);
        const hydrationNum = parseFloat(hydration) / 100;

        // Calculate total dough weight
        const totalDough = pizzasNum * GRAMS_PER_PIZZA;

        // Calculate flour (base = 100%)
        const totalPercentage = 1 + hydrationNum + YEAST_PERCENTAGE + SALT_PERCENTAGE + OIL_PERCENTAGE;
        const flour = totalDough / totalPercentage;

        // Calculate other ingredients based on baker's percentage
        const water = flour * hydrationNum;
        const yeast = flour * YEAST_PERCENTAGE;
        const salt = flour * SALT_PERCENTAGE;
        const oil = flour * OIL_PERCENTAGE;

        setResult({
          flour,
          water,
          yeast,
          salt,
          oil,
          pizzaBalls: pizzasNum,
          hydration: hydrationNum * 100,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("pizza-dough-calculator.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);

    setTimeout(() => {
      setPizzas('');
      setHydration('65');
      setResult(null);
      setError('');
    }, 300);
  };

    const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("pizza-dough-calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("pizza-dough-calculator.pizzas_label")}
          tooltip={t("pizza-dough-calculator.pizzas_tooltip")}
        >
          <NumberInput
            value={pizzas}
            onValueChange={(val) => {
              setPizzas(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("pizza-dough-calculator.pizzas_placeholder")}
            startIcon={<Pizza className="h-4 w-4" />}
            min={1}
            step={1}
          />
        </FormField>

        <FormField
          label={t("pizza-dough-calculator.hydration_label")}
          tooltip={t("pizza-dough-calculator.hydration_tooltip")}
        >
          <NumberInput
            value={hydration}
            onValueChange={(val) => {
              setHydration(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("pizza-dough-calculator.hydration_placeholder")}
            startIcon={<Droplets className="h-4 w-4" />}
            min={50}
            max={80}
            step={1}
            unit={t("common:units.percent")}
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
              {t("pizza-dough-calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("pizza-dough-calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("pizza-dough-calculator.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("pizza-dough-calculator.use_case_1")}</li>
              <li>{t("pizza-dough-calculator.use_case_2")}</li>
              <li>{t("pizza-dough-calculator.use_case_3")}</li>
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
          {t("pizza-dough-calculator.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.pizzaBalls).toFixed(0)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("pizza-dough-calculator.pizza_balls_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("pizza-dough-calculator.ingredients_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pizza-dough-calculator.flour_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.flour).toFixed(2)}{t("common:common.units.g")} (100%)
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Droplets className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pizza-dough-calculator.water_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.water).toFixed(2)}{t("common:common.units.g")} ({(result.hydration).toFixed(0)}%)
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pizza-dough-calculator.yeast_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.yeast).toFixed(2)}{t("common:common.units.g")} (2%)
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pizza-dough-calculator.salt_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.salt).toFixed(2)}{t("common:common.units.g")} (2%)
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Droplets className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pizza-dough-calculator.oil_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.oil).toFixed(2)}{t("common:common.units.g")} (3%)
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pizza-dough-calculator.total_weight_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.flour + result.water + result.yeast + result.salt + result.oil).toFixed(2)}{t("common:common.units.g")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("pizza-dough-calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("pizza-dough-calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("pizza-dough-calculator.title")}
      description={t("pizza-dough-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

