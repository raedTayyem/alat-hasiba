'use client';

/**
 * Unit Cost Calculator
 * Calculates cost per unit based on fixed and variable costs
 * Formula: Unit Cost = (Fixed Costs + Variable Costs) / Units Produced
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Building, TrendingDown, Calculator, PieChart, BarChart } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  fixedCosts: number;
  variableCosts: number;
  totalCosts: number;
  unitsProduced: number;
  unitCost: number;
  fixedCostPerUnit: number;
  variableCostPerUnit: number;
  fixedPercentage: number;
  variablePercentage: number;
}

export default function UnitCostCalculator() {
  const { t } = useTranslation(['calc/business', 'common']);

  const [fixedCosts, setFixedCosts] = useState<string>('');
  const [variableCosts, setVariableCosts] = useState<string>('');
  const [unitsProduced, setUnitsProduced] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const fixed = parseFloat(fixedCosts);
    const variable = parseFloat(variableCosts);
    const units = parseFloat(unitsProduced);

    if (isNaN(units) || units <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if ((fixedCosts && isNaN(fixed)) || (variableCosts && isNaN(variable))) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if ((fixedCosts && fixed < 0) || (variableCosts && variable < 0)) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if ((!fixedCosts || fixed === 0) && (!variableCosts || variable === 0)) {
      setError(t("errors.invalid_input"));
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
        const fixed = fixedCosts ? parseFloat(fixedCosts) : 0;
        const variable = variableCosts ? parseFloat(variableCosts) : 0;
        const units = parseFloat(unitsProduced);

        // Calculate total costs
        const totalCosts = fixed + variable;

        // Calculate unit cost
        const unitCost = totalCosts / units;

        // Calculate cost per unit breakdown
        const fixedCostPerUnit = fixed / units;
        const variableCostPerUnit = variable / units;

        // Calculate percentages
        const fixedPercentage = totalCosts > 0 ? (fixed / totalCosts) * 100 : 0;
        const variablePercentage = totalCosts > 0 ? (variable / totalCosts) * 100 : 0;

        setResult({
          fixedCosts: fixed,
          variableCosts: variable,
          totalCosts,
          unitsProduced: units,
          unitCost,
          fixedCostPerUnit,
          variableCostPerUnit,
          fixedPercentage,
          variablePercentage,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setFixedCosts('');
      setVariableCosts('');
      setUnitsProduced('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("unit_cost.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("unit_cost.inputs.fixed_costs")}
          tooltip={t("unit_cost.inputs.fixed_costs_tooltip")}
        >
          <NumberInput
            value={fixedCosts}
            onValueChange={(val) => {
              setFixedCosts(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("unit_cost.inputs.fixed_costs_placeholder")}
            startIcon={<Building className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("unit_cost.inputs.variable_costs")}
          tooltip={t("unit_cost.inputs.variable_costs_tooltip")}
        >
          <NumberInput
            value={variableCosts}
            onValueChange={(val) => {
              setVariableCosts(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("unit_cost.inputs.variable_costs_placeholder")}
            startIcon={<TrendingDown className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("unit_cost.inputs.units_produced")}
          tooltip={t("unit_cost.inputs.units_produced_tooltip")}
        >
          <NumberInput
            value={unitsProduced}
            onValueChange={(val) => {
              setUnitsProduced(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("unit_cost.inputs.units_produced_placeholder")}
            startIcon={<Package className="h-4 w-4" />}
            min={1}
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
              {t("unit_cost.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("unit_cost.info.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("unit_cost.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("unit_cost.info.use_case_1")}</li>
              <li>{t("unit_cost.info.use_case_2")}</li>
              <li>{t("unit_cost.info.use_case_3")}</li>
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
          {t("unit_cost.results.cost_per_unit")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          ${formatNumber(result.unitCost)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("unit_cost.results.for_units", { units: formatNumber(result.unitsProduced) })}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("unit_cost.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Building className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("unit_cost.results.fixed_costs")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.fixedCosts)}</div>
            <div className="text-sm text-foreground-70">{formatNumber(result.fixedPercentage)}% {t("unit_cost.results.of_total")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingDown className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("unit_cost.results.variable_costs")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.variableCosts)}</div>
            <div className="text-sm text-foreground-70">{formatNumber(result.variablePercentage)}% {t("unit_cost.results.of_total")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <BarChart className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("unit_cost.results.fixed_per_unit")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.fixedCostPerUnit)}</div>
            <div className="text-sm text-foreground-70">{t("unit_cost.results.per_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <BarChart className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("unit_cost.results.variable_per_unit")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.variableCostPerUnit)}</div>
            <div className="text-sm text-foreground-70">{t("unit_cost.results.per_unit")}</div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <PieChart className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("unit_cost.results.total_costs")}</div>
          </div>
          <div className="text-2xl font-bold text-primary">${formatNumber(result.totalCosts)}</div>
          <div className="text-sm text-foreground-70">{t("unit_cost.results.all_costs")}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("unit_cost.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("unit_cost.results.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("unit_cost.title")}
      description={t("unit_cost.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
