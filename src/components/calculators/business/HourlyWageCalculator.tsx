'use client';

/**
 * Hourly Wage Calculator
 *
 * Converts annual salary to hourly wage and vice versa
 * Formula: Hourly = Annual / (Hours per week × 52 weeks)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Clock, Calendar, Briefcase } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
  biWeeklyRate: number;
  monthlyRate: number;
  annualSalary: number;
  totalHoursPerYear: number;
}

export default function HourlyWageCalculator() {
  const { t } = useTranslation('calc/business');
  const [annualSalary, setAnnualSalary] = useState<string>('');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  const [weeksPerYear, setWeeksPerYear] = useState<string>('52');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const salary = parseFloat(annualSalary);
    const hours = parseFloat(hoursPerWeek);
    const weeks = parseFloat(weeksPerYear);

    if (isNaN(salary) || isNaN(hours) || isNaN(weeks)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (salary <= 0 || hours <= 0 || weeks <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (hours > 168) {
      setError(t("hourly_wage.errors.hours_too_high"));
      return false;
    }

    if (weeks > 52) {
      setError(t("hourly_wage.errors.weeks_too_high"));
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
        const salary = parseFloat(annualSalary);
        const hours = parseFloat(hoursPerWeek);
        const weeks = parseFloat(weeksPerYear);

        // Total hours per year
        const totalHoursPerYear = hours * weeks;

        // Hourly Rate = Annual Salary / (Hours per week × Weeks per year)
        const hourlyRate = salary / totalHoursPerYear;

        // Daily Rate (assuming 8-hour workday)
        const dailyRate = hourlyRate * 8;

        // Weekly Rate
        const weeklyRate = hourlyRate * hours;

        // Bi-weekly Rate
        const biWeeklyRate = weeklyRate * 2;

        // Monthly Rate
        const monthlyRate = salary / 12;

        setResult({
          hourlyRate,
          dailyRate,
          weeklyRate,
          biWeeklyRate,
          monthlyRate,
          annualSalary: salary,
          totalHoursPerYear,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setAnnualSalary('');
      setHoursPerWeek('40');
      setWeeksPerYear('52');
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
        {t("hourly_wage.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("hourly_wage.inputs.annual_salary")}
          tooltip={t("hourly_wage.inputs.annual_salary_tooltip")}
        >
          <NumberInput
            value={annualSalary}
            onValueChange={(val) => {
              setAnnualSalary(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("hourly_wage.inputs.annual_salary_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("hourly_wage.inputs.hours_per_week")}
          tooltip={t("hourly_wage.inputs.hours_per_week_tooltip")}
        >
          <NumberInput
            value={hoursPerWeek}
            onValueChange={(val) => {
              setHoursPerWeek(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("hourly_wage.inputs.hours_per_week_placeholder")}
            startIcon={<Clock className="h-4 w-4" />}
            min={1}
            max={168}
          />
        </FormField>

        <FormField
          label={t("hourly_wage.inputs.weeks_per_year")}
          tooltip={t("hourly_wage.inputs.weeks_per_year_tooltip")}
        >
          <NumberInput
            value={weeksPerYear}
            onValueChange={(val) => {
              setWeeksPerYear(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("hourly_wage.inputs.weeks_per_year_placeholder")}
            startIcon={<Calendar className="h-4 w-4" />}
            min={1}
            max={52}
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
              {t("hourly_wage.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("hourly_wage.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("hourly_wage.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("hourly_wage.info.use_case_1")}</li>
              <li>{t("hourly_wage.info.use_case_2")}</li>
              <li>{t("hourly_wage.info.use_case_3")}</li>
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
          {t("hourly_wage.results.hourly_rate")}
        </div>
        <div className="text-4xl font-bold mb-2 text-primary">
          ${formatNumber(result.hourlyRate)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("hourly_wage.results.per_hour")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("hourly_wage.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("hourly_wage.results.daily")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.dailyRate)}</div>
            <div className="text-sm text-foreground-70">{t("hourly_wage.results.per_day")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Briefcase className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("hourly_wage.results.weekly")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.weeklyRate)}</div>
            <div className="text-sm text-foreground-70">{t("hourly_wage.results.per_week")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Briefcase className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("hourly_wage.results.bi_weekly")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.biWeeklyRate)}</div>
            <div className="text-sm text-foreground-70">{t("hourly_wage.results.every_two_weeks")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("hourly_wage.results.monthly")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.monthlyRate)}</div>
            <div className="text-sm text-foreground-70">{t("hourly_wage.results.per_month")}</div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border mt-4">
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 text-success ml-2" />
            <div className="font-medium">{t("hourly_wage.results.annual")}</div>
          </div>
          <div className="text-2xl font-bold text-success">${formatNumber(result.annualSalary)}</div>
          <div className="text-sm text-foreground-70">{formatNumber(result.totalHoursPerYear)} {t("hourly_wage.results.total_hours")}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Clock className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("hourly_wage.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("hourly_wage.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("hourly_wage.title")}
      description={t("hourly_wage.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
