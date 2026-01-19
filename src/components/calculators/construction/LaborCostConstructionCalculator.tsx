'use client';

/**
 * LABOR COST CONSTRUCTION CALCULATOR
 *
 * Calculates labor costs for construction projects including
 * worker wages, hours, and overhead expenses.
 *
 * Formulas:
 * - Base Labor Cost = Hours × Hourly Rate × Workers Count
 * - Overtime Cost = Overtime Hours × Hourly Rate × Overtime Multiplier × Workers
 * - Total Labor = Base Labor Cost + Overtime Cost
 * - Overhead = Total Labor × Overhead Rate
 * - Grand Total = Total Labor + Overhead
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Info, Clock, Briefcase } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface LaborCostResult {
  regularHours: number;
  overtimeHours: number;
  workersCount: number;
  hourlyRate: number;
  baseLaborCost: number;
  overtimeCost: number;
  totalLaborCost: number;
  overheadAmount: number;
  grandTotal: number;
  costPerHour: number;
  costPerWorker: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const DEFAULT_OVERTIME_MULTIPLIER = 1.5; // Time and a half

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function LaborCostConstructionCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [regularHours, setRegularHours] = useState<string>('');
  const [overtimeHours, setOvertimeHours] = useState<string>('0');
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [workersCount, setWorkersCount] = useState<string>('1');
  const [overheadRate, setOverheadRate] = useState<string>('15');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<string>('1.5');
  const [currency, setCurrency] = useState<string>('USD');

  // Result state
  const [result, setResult] = useState<LaborCostResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Combobox options
  const currencyOptions: ComboboxOption[] = [
    { value: 'USD', label: t("labor_cost.currencies.usd") },
    { value: 'EUR', label: t("labor_cost.currencies.eur") },
    { value: 'GBP', label: t("labor_cost.currencies.gbp") },
    { value: 'SAR', label: t("labor_cost.currencies.sar") },
    { value: 'AED', label: t("labor_cost.currencies.aed") },
    { value: 'JOD', label: t("labor_cost.currencies.jod") }
  ];

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const hours = parseFloat(regularHours);
    const rate = parseFloat(hourlyRate);
    const workers = parseFloat(workersCount);
    const overhead = parseFloat(overheadRate);
    const otHours = parseFloat(overtimeHours);
    const otMultiplier = parseFloat(overtimeMultiplier);

    if (isNaN(hours) || isNaN(rate)) {
      setError(t("labor_cost.errors.invalid_inputs"));
      return false;
    }

    if (hours <= 0 || rate <= 0) {
      setError(t("labor_cost.errors.positive_values"));
      return false;
    }

    if (isNaN(workers) || workers < 1) {
      setError(t("labor_cost.errors.invalid_workers"));
      return false;
    }

    if (isNaN(overhead) || overhead < 0 || overhead > 100) {
      setError(t("labor_cost.errors.invalid_overhead"));
      return false;
    }

    if (!isNaN(otHours) && otHours < 0) {
      setError(t("labor_cost.errors.invalid_overtime"));
      return false;
    }

    if (isNaN(otMultiplier) || otMultiplier < 1) {
      setError(t("labor_cost.errors.invalid_multiplier"));
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
        const hours = parseFloat(regularHours);
        const rate = parseFloat(hourlyRate);
        const workers = parseFloat(workersCount);
        const overhead = parseFloat(overheadRate) / 100;
        const otHours = parseFloat(overtimeHours) || 0;
        const otMultiplier = parseFloat(overtimeMultiplier) || DEFAULT_OVERTIME_MULTIPLIER;

        // Base Labor Cost = Hours × Hourly Rate × Workers Count
        const baseLaborCost = hours * rate * workers;

        // Overtime Cost = Overtime Hours × Hourly Rate × Overtime Multiplier × Workers
        const overtimeCost = otHours * rate * otMultiplier * workers;

        // Total Labor = Base Labor Cost + Overtime Cost
        const totalLaborCost = baseLaborCost + overtimeCost;

        // Overhead = Total Labor × Overhead Rate
        const overheadAmount = totalLaborCost * overhead;

        // Grand Total = Total Labor + Overhead
        const grandTotal = totalLaborCost + overheadAmount;

        // Per-unit calculations
        const totalHours = (hours + otHours) * workers;
        const costPerHour = totalHours > 0 ? grandTotal / totalHours : 0;
        const costPerWorker = grandTotal / workers;

        setResult({
          regularHours: hours,
          overtimeHours: otHours,
          workersCount: workers,
          hourlyRate: rate,
          baseLaborCost,
          overtimeCost,
          totalLaborCost,
          overheadAmount,
          grandTotal,
          costPerHour,
          costPerWorker
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common:common.errors.calculationError"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setRegularHours('');
      setOvertimeHours('0');
      setHourlyRate('');
      setWorkersCount('1');
      setOverheadRate('15');
      setOvertimeMultiplier('1.5');
      setCurrency('USD');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // ---------------------------------------------------------------------------
  // INPUT SECTION
  // ---------------------------------------------------------------------------
  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">

        {/* Currency Selection */}
        <InputContainer
          label={t("labor_cost.currency")}
          tooltip={t("labor_cost.currency_tooltip")}
        >
          <Combobox options={currencyOptions} value={currency} onChange={setCurrency} />
        </InputContainer>

        {/* Regular Hours */}
        <InputContainer
          label={t("labor_cost.regular_hours")}
          tooltip={t("labor_cost.regular_hours_tooltip")}
        >
          <NumberInput
            value={regularHours}
            onValueChange={(value) => {
                setRegularHours(String(value));
                if (error) setError('');
              }}
            placeholder={t("labor_cost.placeholders.hours")}
            min={0}
            step={1}
            unit={t("labor_cost.hours_unit")}
          />
        </InputContainer>

        {/* Overtime Hours */}
        <InputContainer
          label={t("labor_cost.overtime_hours")}
          tooltip={t("labor_cost.overtime_hours_tooltip")}
        >
          <NumberInput
            value={overtimeHours}
            onValueChange={(value) => {
                setOvertimeHours(String(value));
                if (error) setError('');
              }}
            placeholder={t("labor_cost.placeholders.overtime")}
            min={0}
            step={1}
            unit={t("labor_cost.hours_unit")}
          />
        </InputContainer>

        {/* Hourly Rate */}
        <InputContainer
          label={t("labor_cost.hourly_rate")}
          tooltip={t("labor_cost.hourly_rate_tooltip")}
        >
          <NumberInput
            value={hourlyRate}
            onValueChange={(value) => {
                setHourlyRate(String(value));
                if (error) setError('');
              }}
            placeholder={t("labor_cost.placeholders.rate")}
            min={0}
            step={0.5}
            unit={t("labor_cost.per_hour")}
          />
        </InputContainer>

        {/* Workers Count */}
        <InputContainer
          label={t("labor_cost.workers_count")}
          tooltip={t("labor_cost.workers_count_tooltip")}
        >
          <NumberInput
            value={workersCount}
            onValueChange={(value) => {
                setWorkersCount(String(value));
                if (error) setError('');
              }}
            placeholder={t("labor_cost.placeholders.workers")}
            min={1}
            step={1}
            unit={t("labor_cost.workers_unit")}
          />
        </InputContainer>

        {/* Overtime Multiplier */}
        <InputContainer
          label={t("labor_cost.overtime_multiplier")}
          tooltip={t("labor_cost.overtime_multiplier_tooltip")}
        >
          <NumberInput
            value={overtimeMultiplier}
            onValueChange={(value) => {
                setOvertimeMultiplier(String(value));
                if (error) setError('');
              }}
            placeholder={t("labor_cost.placeholders.multiplier")}
            min={1}
            step={0.1}
            unit={t("common:units.times")}
          />
        </InputContainer>

        {/* Overhead Rate */}
        <InputContainer
          label={t("labor_cost.overhead_rate")}
          tooltip={t("labor_cost.overhead_rate_tooltip")}
        >
          <NumberInput
            value={overheadRate}
            onValueChange={(value) => {
                setOverheadRate(String(value));
                if (error) setError('');
              }}
            placeholder={t("labor_cost.placeholders.overhead")}
            min={0}
            max={100}
            step={1}
            unit={t("common:units.percent")}
          />
        </InputContainer>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons
          onCalculate={calculate}
          onReset={resetCalculator}
        />
      </div>

      {/* Error Message */}
      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {/* Information Section */}
      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("labor_cost.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("labor_cost.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("labor_cost.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("labor_cost.use_case_1")}</li>
              <li>{t("labor_cost.use_case_2")}</li>
              <li>{t("labor_cost.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  // ---------------------------------------------------------------------------
  // RESULT SECTION
  // ---------------------------------------------------------------------------
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">

      {/* Main Result */}
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("labor_cost.result_total")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatCurrency(result.grandTotal)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("labor_cost.workers_summary", { count: result.workersCount })}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("labor_cost.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Regular Labor */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("labor_cost.regular_labor")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(result.baseLaborCost)}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {result.regularHours} {t("labor_cost.hours_label")} × {result.workersCount} {t("labor_cost.workers_label")}
            </div>
          </div>

          {/* Overtime */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("labor_cost.overtime_labor")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(result.overtimeCost)}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {result.overtimeHours} {t("labor_cost.hours_label")} × {parseFloat(overtimeMultiplier)}×
            </div>
          </div>

          {/* Total Labor */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("labor_cost.total_labor")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(result.totalLaborCost)}
            </div>
          </div>

          {/* Overhead */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Briefcase className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("labor_cost.overhead")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(result.overheadAmount)}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              ({overheadRate}%)
            </div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Per-unit Costs */}
      <div className="space-y-3">
        <h3 className="font-medium mb-3">
          {t("labor_cost.per_unit")}
        </h3>

        <div className="flex justify-between items-center p-3 bg-card rounded-lg">
          <span className="text-foreground-70">{t("labor_cost.cost_per_hour")}</span>
          <span className="font-medium">{formatCurrency(result.costPerHour)}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-card rounded-lg">
          <span className="text-foreground-70">{t("labor_cost.cost_per_worker")}</span>
          <span className="font-medium">{formatCurrency(result.costPerWorker)}</span>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("labor_cost.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("labor_cost.formula")}
            </p>
          </div>
        </div>
      </div>

    </div>
  ) : null;

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <CalculatorLayout
      title={t("labor_cost.title")}
      description={t("labor_cost.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.grandTotal}
      results={result}
    />
  );
}
