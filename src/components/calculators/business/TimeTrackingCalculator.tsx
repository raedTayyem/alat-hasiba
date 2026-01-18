'use client';

/**
 * Time Tracking Calculator
 * Calculates billable hours and invoice amount
 * Formula: Invoice Total = (Hours Worked x Hourly Rate) + Expenses
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, DollarSign, Receipt, Calculator, TrendingUp, CreditCard } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  hoursWorked: number;
  hourlyRate: number;
  laborTotal: number;
  expenses: number;
  invoiceTotal: number;
  effectiveRate: number;
}

export default function TimeTrackingCalculator() {
  const { t } = useTranslation(['calc/business', 'common']);

  const [hoursWorked, setHoursWorked] = useState<string>('');
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [expenses, setExpenses] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const hours = parseFloat(hoursWorked);
    const rate = parseFloat(hourlyRate);

    if (isNaN(hours) || isNaN(rate)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (hours <= 0 || rate <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (expenses && parseFloat(expenses) < 0) {
      setError(t("errors.positive_values_required"));
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
        const hours = parseFloat(hoursWorked);
        const rate = parseFloat(hourlyRate);
        const exp = expenses ? parseFloat(expenses) : 0;

        // Calculate labor total
        const laborTotal = hours * rate;

        // Calculate invoice total
        const invoiceTotal = laborTotal + exp;

        // Calculate effective hourly rate (including expenses)
        const effectiveRate = hours > 0 ? invoiceTotal / hours : 0;

        setResult({
          hoursWorked: hours,
          hourlyRate: rate,
          laborTotal,
          expenses: exp,
          invoiceTotal,
          effectiveRate,
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
      setHoursWorked('');
      setHourlyRate('');
      setExpenses('');
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
        {t("time_tracking.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("time_tracking.inputs.hours_worked")}
          tooltip={t("time_tracking.inputs.hours_worked_tooltip")}
        >
          <NumberInput
            value={hoursWorked}
            onValueChange={(val) => {
              setHoursWorked(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("time_tracking.inputs.hours_worked_placeholder")}
            startIcon={<Clock className="h-4 w-4" />}
            min={0}
            step={0.5}
          />
        </FormField>

        <FormField
          label={t("time_tracking.inputs.hourly_rate")}
          tooltip={t("time_tracking.inputs.hourly_rate_tooltip")}
        >
          <NumberInput
            value={hourlyRate}
            onValueChange={(val) => {
              setHourlyRate(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("time_tracking.inputs.hourly_rate_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("time_tracking.inputs.expenses")}
          tooltip={t("time_tracking.inputs.expenses_tooltip")}
        >
          <NumberInput
            value={expenses}
            onValueChange={(val) => {
              setExpenses(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("time_tracking.inputs.expenses_placeholder")}
            startIcon={<Receipt className="h-4 w-4" />}
            min={0}
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
              {t("time_tracking.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("time_tracking.info.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("time_tracking.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("time_tracking.info.use_case_1")}</li>
              <li>{t("time_tracking.info.use_case_2")}</li>
              <li>{t("time_tracking.info.use_case_3")}</li>
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
          {t("time_tracking.results.invoice_total")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {t("common:units.currencySymbol")}{formatNumber(result.invoiceTotal)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("time_tracking.results.for_hours", { hours: formatNumber(result.hoursWorked) })}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("time_tracking.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("time_tracking.results.hours")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.hoursWorked)}</div>
            <div className="text-sm text-foreground-70">{t("time_tracking.results.billable_hours")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("time_tracking.results.rate")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:units.currencySymbol")}{formatNumber(result.hourlyRate)}</div>
            <div className="text-sm text-foreground-70">{t("time_tracking.results.per_hour")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <CreditCard className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("time_tracking.results.labor_total")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:units.currencySymbol")}{formatNumber(result.laborTotal)}</div>
            <div className="text-sm text-foreground-70">{t("time_tracking.results.hours_x_rate")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Receipt className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("time_tracking.results.expenses")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:units.currencySymbol")}{formatNumber(result.expenses)}</div>
            <div className="text-sm text-foreground-70">{t("time_tracking.results.reimbursable")}</div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("time_tracking.results.effective_rate")}</div>
          </div>
          <div className="text-2xl font-bold text-success">{t("common:units.currencySymbol")}{formatNumber(result.effectiveRate)}</div>
          <div className="text-sm text-foreground-70">{t("time_tracking.results.effective_rate_desc")}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("time_tracking.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("time_tracking.results.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("time_tracking.title")}
      description={t("time_tracking.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
