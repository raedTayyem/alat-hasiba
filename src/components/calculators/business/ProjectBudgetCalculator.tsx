'use client';

/**
 * Project Budget Calculator
 * Calculates total project budget including contingency
 * Formula: Total Budget = (Labor + Materials + Overhead) x (1 + Contingency%)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Users, Package, Building, Percent, Calculator, TrendingUp, PieChart } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  laborCost: number;
  materialsCost: number;
  overheadCost: number;
  subtotal: number;
  contingencyAmount: number;
  totalBudget: number;
  laborPercentage: number;
  materialsPercentage: number;
  overheadPercentage: number;
}

export default function ProjectBudgetCalculator() {
  const { t, i18n } = useTranslation(['calc/business', 'common']);

  const [laborCost, setLaborCost] = useState<string>('');
  const [materialsCost, setMaterialsCost] = useState<string>('');
  const [overheadCost, setOverheadCost] = useState<string>('');
  const [contingencyPercent, setContingencyPercent] = useState<string>('10');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const labor = parseFloat(laborCost);
    const materials = parseFloat(materialsCost);
    const overhead = parseFloat(overheadCost);
    const contingency = parseFloat(contingencyPercent);

    if (isNaN(labor) && isNaN(materials) && isNaN(overhead)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if ((laborCost && labor < 0) || (materialsCost && materials < 0) || (overheadCost && overhead < 0)) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (contingencyPercent && (isNaN(contingency) || contingency < 0 || contingency > 100)) {
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
        const labor = laborCost ? parseFloat(laborCost) : 0;
        const materials = materialsCost ? parseFloat(materialsCost) : 0;
        const overhead = overheadCost ? parseFloat(overheadCost) : 0;
        const contingency = contingencyPercent ? parseFloat(contingencyPercent) : 0;

        // Calculate subtotal
        const subtotal = labor + materials + overhead;

        // Calculate contingency amount
        const contingencyAmount = (subtotal * contingency) / 100;

        // Calculate total budget
        const totalBudget = subtotal + contingencyAmount;

        // Calculate percentages
        const laborPercentage = totalBudget > 0 ? (labor / totalBudget) * 100 : 0;
        const materialsPercentage = totalBudget > 0 ? (materials / totalBudget) * 100 : 0;
        const overheadPercentage = totalBudget > 0 ? (overhead / totalBudget) * 100 : 0;

        setResult({
          laborCost: labor,
          materialsCost: materials,
          overheadCost: overhead,
          subtotal,
          contingencyAmount,
          totalBudget,
          laborPercentage,
          materialsPercentage,
          overheadPercentage,
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
      setLaborCost('');
      setMaterialsCost('');
      setOverheadCost('');
      setContingencyPercent('10');
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
        {t("project_budget.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("project_budget.inputs.labor_cost")}
          tooltip={t("project_budget.inputs.labor_cost_tooltip")}
        >
          <NumberInput
            value={laborCost}
            onValueChange={(val) => {
              setLaborCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("project_budget.inputs.labor_cost_placeholder")}
            startIcon={<Users className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("project_budget.inputs.materials_cost")}
          tooltip={t("project_budget.inputs.materials_cost_tooltip")}
        >
          <NumberInput
            value={materialsCost}
            onValueChange={(val) => {
              setMaterialsCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("project_budget.inputs.materials_cost_placeholder")}
            startIcon={<Package className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("project_budget.inputs.overhead_cost")}
          tooltip={t("project_budget.inputs.overhead_cost_tooltip")}
        >
          <NumberInput
            value={overheadCost}
            onValueChange={(val) => {
              setOverheadCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("project_budget.inputs.overhead_cost_placeholder")}
            startIcon={<Building className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("project_budget.inputs.contingency")}
          tooltip={t("project_budget.inputs.contingency_tooltip")}
        >
          <NumberInput
            value={contingencyPercent}
            onValueChange={(val) => {
              setContingencyPercent(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("project_budget.inputs.contingency_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            min={0}
            max={100}
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
              {t("project_budget.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("project_budget.info.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("project_budget.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("project_budget.info.use_case_1")}</li>
              <li>{t("project_budget.info.use_case_2")}</li>
              <li>{t("project_budget.info.use_case_3")}</li>
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
          {t("project_budget.results.total_budget")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          ${formatNumber(result.totalBudget)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("project_budget.results.including_contingency")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("project_budget.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("project_budget.results.labor")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.laborCost)}</div>
            <div className="text-sm text-foreground-70">{formatNumber(result.laborPercentage)}% {t("project_budget.results.of_total")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("project_budget.results.materials")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.materialsCost)}</div>
            <div className="text-sm text-foreground-70">{formatNumber(result.materialsPercentage)}% {t("project_budget.results.of_total")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Building className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("project_budget.results.overhead")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.overheadCost)}</div>
            <div className="text-sm text-foreground-70">{formatNumber(result.overheadPercentage)}% {t("project_budget.results.of_total")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("project_budget.results.contingency")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.contingencyAmount)}</div>
            <div className="text-sm text-foreground-70">{contingencyPercent}% {t("project_budget.results.buffer")}</div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <PieChart className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("project_budget.results.subtotal")}</div>
          </div>
          <div className="text-2xl font-bold">${formatNumber(result.subtotal)}</div>
          <div className="text-sm text-foreground-70">{t("project_budget.results.before_contingency")}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("project_budget.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("project_budget.results.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("project_budget.title")}
      description={t("project_budget.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
