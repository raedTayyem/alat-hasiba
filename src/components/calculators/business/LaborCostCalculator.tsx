'use client';

/**
 * Labor Cost Calculator
 * Calculates total labor cost including benefits and overhead
 * Formula: Total Labor Cost = Hourly Rate x Hours x (1 + Benefits% + Overhead%)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Clock, Percent, Calculator, Users, Briefcase, Building } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  baseWages: number;
  benefitsCost: number;
  overheadCost: number;
  totalLaborCost: number;
  effectiveHourlyRate: number;
  costMultiplier: number;
  monthlyCost: number;
  annualCost: number;
}

export default function LaborCostCalculator() {
  const { t, i18n } = useTranslation('calc/business');
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('');
  const [benefitsPercentage, setBenefitsPercentage] = useState<string>('25');
  const [overheadPercentage, setOverheadPercentage] = useState<string>('15');
  const [numberOfEmployees, setNumberOfEmployees] = useState<string>('1');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const rate = parseFloat(hourlyRate);
    const hours = parseFloat(hoursPerWeek);
    const benefits = parseFloat(benefitsPercentage);
    const overhead = parseFloat(overheadPercentage);
    const employees = parseInt(numberOfEmployees);

    if (isNaN(rate) || isNaN(hours)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (rate <= 0 || hours <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (benefits < 0 || benefits > 200) {
      setError(t("labor_cost.errors.invalid_benefits"));
      return false;
    }

    if (overhead < 0 || overhead > 200) {
      setError(t("labor_cost.errors.invalid_overhead"));
      return false;
    }

    if (employees < 1) {
      setError(t("labor_cost.errors.invalid_employees"));
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
        const rate = parseFloat(hourlyRate);
        const hours = parseFloat(hoursPerWeek);
        const benefits = parseFloat(benefitsPercentage) || 0;
        const overhead = parseFloat(overheadPercentage) || 0;
        const employees = parseInt(numberOfEmployees) || 1;

        // Base wages per employee per week
        const weeklyBaseWages = rate * hours;

        // Benefits cost per employee per week
        const weeklyBenefitsCost = weeklyBaseWages * (benefits / 100);

        // Overhead cost per employee per week
        const weeklyOverheadCost = weeklyBaseWages * (overhead / 100);

        // Total weekly cost per employee
        const weeklyTotalPerEmployee = weeklyBaseWages + weeklyBenefitsCost + weeklyOverheadCost;

        // Scale by number of employees
        const totalWeeklyBaseWages = weeklyBaseWages * employees;
        const totalWeeklyBenefits = weeklyBenefitsCost * employees;
        const totalWeeklyOverhead = weeklyOverheadCost * employees;
        const totalWeeklyCost = weeklyTotalPerEmployee * employees;

        // Effective hourly rate (including benefits and overhead)
        const effectiveHourlyRate = rate * (1 + benefits / 100 + overhead / 100);

        // Cost multiplier (burden rate)
        const costMultiplier = 1 + (benefits / 100) + (overhead / 100);

        // Monthly cost (assuming 4.33 weeks per month)
        const weeksPerMonth = 4.33;
        const monthlyCost = totalWeeklyCost * weeksPerMonth;

        // Annual cost (52 weeks)
        const annualCost = totalWeeklyCost * 52;

        setResult({
          baseWages: totalWeeklyBaseWages,
          benefitsCost: totalWeeklyBenefits,
          overheadCost: totalWeeklyOverhead,
          totalLaborCost: totalWeeklyCost,
          effectiveHourlyRate,
          costMultiplier,
          monthlyCost,
          annualCost,
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
      setHourlyRate('');
      setHoursPerWeek('');
      setBenefitsPercentage('25');
      setOverheadPercentage('15');
      setNumberOfEmployees('1');
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
        {t("labor_cost.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("labor_cost.hourly_rate")}
          tooltip={t("labor_cost.hourly_rate_tooltip")}
        >
          <NumberInput
            value={hourlyRate}
            onValueChange={(val) => {
              setHourlyRate(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("labor_cost.hourly_rate_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
            step={0.01}
          />
        </FormField>

        <FormField
          label={t("labor_cost.hours_per_week")}
          tooltip={t("labor_cost.hours_per_week_tooltip")}
        >
          <NumberInput
            value={hoursPerWeek}
            onValueChange={(val) => {
              setHoursPerWeek(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("labor_cost.hours_per_week_placeholder")}
            startIcon={<Clock className="h-4 w-4" />}
            min={0}
            max={168}
          />
        </FormField>

        <FormField
          label={t("labor_cost.benefits_percentage")}
          tooltip={t("labor_cost.benefits_percentage_tooltip")}
        >
          <NumberInput
            value={benefitsPercentage}
            onValueChange={(val) => {
              setBenefitsPercentage(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("labor_cost.benefits_percentage_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            min={0}
            max={200}
          />
        </FormField>

        <FormField
          label={t("labor_cost.overhead_percentage")}
          tooltip={t("labor_cost.overhead_percentage_tooltip")}
        >
          <NumberInput
            value={overheadPercentage}
            onValueChange={(val) => {
              setOverheadPercentage(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("labor_cost.overhead_percentage_placeholder")}
            startIcon={<Building className="h-4 w-4" />}
            min={0}
            max={200}
          />
        </FormField>

        <FormField
          label={t("labor_cost.number_of_employees")}
          tooltip={t("labor_cost.number_of_employees_tooltip")}
        >
          <NumberInput
            value={numberOfEmployees}
            onValueChange={(val) => {
              setNumberOfEmployees(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("labor_cost.number_of_employees_placeholder")}
            startIcon={<Users className="h-4 w-4" />}
            min={1}
            step={1}
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
              {t("labor_cost.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("labor_cost.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("labor_cost.info.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("labor_cost.info.use_case_1")}</li>
              <li>{t("labor_cost.info.use_case_2")}</li>
              <li>{t("labor_cost.info.use_case_3")}</li>
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
          {t("labor_cost.results.weekly_total")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          ${formatNumber(result.totalLaborCost)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("labor_cost.results.effective_hourly_rate")}: ${formatNumber(result.effectiveHourlyRate)}/hr
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("labor_cost.results.cost_breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("labor_cost.results.base_wages")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.baseWages)}</div>
            <div className="text-sm text-foreground-70">{t("labor_cost.results.per_week")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Briefcase className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t("labor_cost.results.benefits_cost")}</div>
            </div>
            <div className="text-2xl font-bold text-warning">${formatNumber(result.benefitsCost)}</div>
            <div className="text-sm text-foreground-70">{t("labor_cost.results.per_week")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Building className="w-5 h-5 text-info ml-2" />
              <div className="font-medium">{t("labor_cost.results.overhead_cost")}</div>
            </div>
            <div className="text-2xl font-bold text-info">${formatNumber(result.overheadCost)}</div>
            <div className="text-sm text-foreground-70">{t("labor_cost.results.per_week")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calculator className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t("labor_cost.results.cost_multiplier")}</div>
            </div>
            <div className="text-2xl font-bold text-success">{formatNumber(result.costMultiplier)}x</div>
            <div className="text-sm text-foreground-70">{t("labor_cost.results.burden_rate")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("labor_cost.results.monthly_cost")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.monthlyCost)}</div>
            <div className="text-sm text-foreground-70">{t("labor_cost.results.per_month")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-error ml-2" />
              <div className="font-medium">{t("labor_cost.results.annual_cost")}</div>
            </div>
            <div className="text-2xl font-bold text-error">${formatNumber(result.annualCost)}</div>
            <div className="text-sm text-foreground-70">{t("labor_cost.results.per_year")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("labor_cost.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("labor_cost.results.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("labor_cost.title")}
      description={t("labor_cost.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
