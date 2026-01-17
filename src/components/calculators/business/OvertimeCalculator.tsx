'use client';

/**
 * Overtime Calculator
 *
 * Calculates overtime pay based on regular and OT hours
 * Formula: Total = (Regular Hours × Rate) + (OT Hours × Rate × Multiplier)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Clock, Percent, TrendingUp } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  regularPay: number;
  overtimePay: number;
  totalPay: number;
  effectiveHourlyRate: number;
  overtimeRate: number;
  totalHours: number;
  overtimePercentage: number;
}

export default function OvertimeCalculator() {
  const { t } = useTranslation('calc/business');
  const [regularHours, setRegularHours] = useState<string>('40');
  const [overtimeHours, setOvertimeHours] = useState<string>('');
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<string>('1.5');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const regular = parseFloat(regularHours);
    const overtime = parseFloat(overtimeHours);
    const rate = parseFloat(hourlyRate);
    const multiplier = parseFloat(overtimeMultiplier);

    if (isNaN(regular) || isNaN(overtime) || isNaN(rate) || isNaN(multiplier)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (regular < 0 || overtime < 0 || rate <= 0 || multiplier <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (regular + overtime > 168) {
      setError(t("overtime.errors.hours_too_high"));
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
        const regular = parseFloat(regularHours);
        const overtime = parseFloat(overtimeHours);
        const rate = parseFloat(hourlyRate);
        const multiplier = parseFloat(overtimeMultiplier);

        // Regular Pay = Regular Hours × Hourly Rate
        const regularPay = regular * rate;

        // Overtime Rate = Hourly Rate × Multiplier
        const overtimeRate = rate * multiplier;

        // Overtime Pay = OT Hours × OT Rate
        const overtimePay = overtime * overtimeRate;

        // Total Pay = Regular Pay + Overtime Pay
        const totalPay = regularPay + overtimePay;

        // Total Hours
        const totalHours = regular + overtime;

        // Effective Hourly Rate
        const effectiveHourlyRate = totalHours > 0 ? totalPay / totalHours : 0;

        // Overtime as percentage of total
        const overtimePercentage = totalPay > 0 ? (overtimePay / totalPay) * 100 : 0;

        setResult({
          regularPay,
          overtimePay,
          totalPay,
          effectiveHourlyRate,
          overtimeRate,
          totalHours,
          overtimePercentage,
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
      setRegularHours('40');
      setOvertimeHours('');
      setHourlyRate('');
      setOvertimeMultiplier('1.5');
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
        {t("overtime.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("overtime.inputs.regular_hours")}
          tooltip={t("overtime.inputs.regular_hours_tooltip")}
        >
          <NumberInput
            value={regularHours}
            onValueChange={(val) => {
              setRegularHours(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("overtime.inputs.regular_hours_placeholder")}
            startIcon={<Clock className="h-4 w-4" />}
            min={0}
            max={168}
          />
        </FormField>

        <FormField
          label={t("overtime.inputs.overtime_hours")}
          tooltip={t("overtime.inputs.overtime_hours_tooltip")}
        >
          <NumberInput
            value={overtimeHours}
            onValueChange={(val) => {
              setOvertimeHours(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("overtime.inputs.overtime_hours_placeholder")}
            startIcon={<Clock className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("overtime.inputs.hourly_rate")}
          tooltip={t("overtime.inputs.hourly_rate_tooltip")}
        >
          <NumberInput
            value={hourlyRate}
            onValueChange={(val) => {
              setHourlyRate(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("overtime.inputs.hourly_rate_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
            step={0.01}
          />
        </FormField>

        <FormField
          label={t("overtime.inputs.overtime_multiplier")}
          tooltip={t("overtime.inputs.overtime_multiplier_tooltip")}
        >
          <NumberInput
            value={overtimeMultiplier}
            onValueChange={(val) => {
              setOvertimeMultiplier(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("overtime.inputs.overtime_multiplier_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            min={1}
            max={3}
            step={0.25}
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
              {t("overtime.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("overtime.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("overtime.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("overtime.info.use_case_1")}</li>
              <li>{t("overtime.info.use_case_2")}</li>
              <li>{t("overtime.info.use_case_3")}</li>
            </ul>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("overtime.info.common_multipliers")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("overtime.info.multiplier_1")}</li>
              <li>{t("overtime.info.multiplier_2")}</li>
              <li>{t("overtime.info.multiplier_3")}</li>
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
          {t("overtime.results.total_pay")}
        </div>
        <div className="text-4xl font-bold mb-2 text-success">
          ${formatNumber(result.totalPay)}
        </div>
        <div className="text-lg text-foreground-70">
          {result.totalHours} {t("overtime.results.hours_worked")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("overtime.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("overtime.results.regular_pay")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.regularPay)}</div>
            <div className="text-sm text-foreground-70">{parseFloat(regularHours)} {t("overtime.results.hours")} @ ${formatNumber(parseFloat(hourlyRate))}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t("overtime.results.overtime_pay")}</div>
            </div>
            <div className="text-2xl font-bold text-warning">${formatNumber(result.overtimePay)}</div>
            <div className="text-sm text-foreground-70">{parseFloat(overtimeHours)} {t("overtime.results.hours")} @ ${formatNumber(result.overtimeRate)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-info ml-2" />
              <div className="font-medium">{t("overtime.results.overtime_rate")}</div>
            </div>
            <div className="text-2xl font-bold text-info">${formatNumber(result.overtimeRate)}</div>
            <div className="text-sm text-foreground-70">{t("overtime.results.per_hour")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t("overtime.results.effective_rate")}</div>
            </div>
            <div className="text-2xl font-bold text-success">${formatNumber(result.effectiveHourlyRate)}</div>
            <div className="text-sm text-foreground-70">{t("overtime.results.average_per_hour")}</div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border mt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">{t("overtime.results.overtime_percentage")}</span>
            <span className="text-lg font-bold text-warning">{formatNumber(result.overtimePercentage)}%</span>
          </div>
          <div className="w-full bg-border rounded-full h-2 mt-2">
            <div
              className="bg-warning h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(result.overtimePercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Clock className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("overtime.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("overtime.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("overtime.title")}
      description={t("overtime.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
