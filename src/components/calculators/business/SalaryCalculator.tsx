'use client';

/**
 * Salary Calculator
 *
 * Breaks down annual salary into different pay frequencies
 * Outputs: monthly, bi-weekly, weekly, daily, hourly rates
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Calendar, Clock, Briefcase } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  annual: number;
  monthly: number;
  semiMonthly: number;
  biWeekly: number;
  weekly: number;
  daily: number;
  hourly: number;
}

type PayFrequency = 'annual' | 'monthly' | 'biweekly' | 'weekly' | 'hourly';

export default function SalaryCalculator() {
  const { t, i18n } = useTranslation('calc/business');
  const [salary, setSalary] = useState<string>('');
  const [payFrequency, setPayFrequency] = useState<PayFrequency>('annual');
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

    const salaryVal = parseFloat(salary);
    const hours = parseFloat(hoursPerWeek);
    const weeks = parseFloat(weeksPerYear);

    if (isNaN(salaryVal) || isNaN(hours) || isNaN(weeks)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (salaryVal <= 0 || hours <= 0 || weeks <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (hours > 168) {
      setError(t("salary.errors.hours_too_high"));
      return false;
    }

    if (weeks > 52) {
      setError(t("salary.errors.weeks_too_high"));
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
        const salaryVal = parseFloat(salary);
        const hours = parseFloat(hoursPerWeek);
        const weeks = parseFloat(weeksPerYear);

        let annual: number;

        // Convert input to annual salary based on frequency
        switch (payFrequency) {
          case 'annual':
            annual = salaryVal;
            break;
          case 'monthly':
            annual = salaryVal * 12;
            break;
          case 'biweekly':
            annual = salaryVal * 26;
            break;
          case 'weekly':
            annual = salaryVal * weeks;
            break;
          case 'hourly':
            annual = salaryVal * hours * weeks;
            break;
          default:
            annual = salaryVal;
        }

        // Calculate all breakdowns
        const monthly = annual / 12;
        const semiMonthly = annual / 24;
        const biWeekly = annual / 26;
        const weekly = annual / weeks;
        const daily = annual / (weeks * 5); // Assuming 5 working days per week
        const hourly = annual / (hours * weeks);

        setResult({
          annual,
          monthly,
          semiMonthly,
          biWeekly,
          weekly,
          daily,
          hourly,
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
      setSalary('');
      setPayFrequency('annual');
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

  const frequencyOptions: { value: PayFrequency; label: string }[] = [
    { value: 'annual', label: t("salary.inputs.frequency_annual") },
    { value: 'monthly', label: t("salary.inputs.frequency_monthly") },
    { value: 'biweekly', label: t("salary.inputs.frequency_biweekly") },
    { value: 'weekly', label: t("salary.inputs.frequency_weekly") },
    { value: 'hourly', label: t("salary.inputs.frequency_hourly") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("salary.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("salary.inputs.salary")}
          tooltip={t("salary.inputs.salary_tooltip")}
        >
          <NumberInput
            value={salary}
            onValueChange={(val) => {
              setSalary(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("salary.inputs.salary_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("salary.inputs.pay_frequency")}
          tooltip={t("salary.inputs.pay_frequency_tooltip")}
        >
          <select
            value={payFrequency}
            onChange={(e) => {
              setPayFrequency(e.target.value as PayFrequency);
              if (error) setError('');
            }}
            className="w-full h-14 rounded-2xl border-2 border-border bg-background px-4 text-lg font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
          >
            {frequencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label={t("salary.inputs.hours_per_week")}
          tooltip={t("salary.inputs.hours_per_week_tooltip")}
        >
          <NumberInput
            value={hoursPerWeek}
            onValueChange={(val) => {
              setHoursPerWeek(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("salary.inputs.hours_per_week_placeholder")}
            startIcon={<Clock className="h-4 w-4" />}
            min={1}
            max={168}
          />
        </FormField>

        <FormField
          label={t("salary.inputs.weeks_per_year")}
          tooltip={t("salary.inputs.weeks_per_year_tooltip")}
        >
          <NumberInput
            value={weeksPerYear}
            onValueChange={(val) => {
              setWeeksPerYear(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("salary.inputs.weeks_per_year_placeholder")}
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
              {t("salary.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("salary.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("salary.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("salary.info.use_case_1")}</li>
              <li>{t("salary.info.use_case_2")}</li>
              <li>{t("salary.info.use_case_3")}</li>
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
          {t("salary.results.annual_salary")}
        </div>
        <div className="text-4xl font-bold mb-2 text-primary">
          ${formatNumber(result.annual)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("salary.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("salary.results.monthly")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.monthly)}</div>
            <div className="text-sm text-foreground-70">{t("salary.results.per_month")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("salary.results.semi_monthly")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.semiMonthly)}</div>
            <div className="text-sm text-foreground-70">{t("salary.results.twice_monthly")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Briefcase className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("salary.results.bi_weekly")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.biWeekly)}</div>
            <div className="text-sm text-foreground-70">{t("salary.results.every_two_weeks")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Briefcase className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("salary.results.weekly")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.weekly)}</div>
            <div className="text-sm text-foreground-70">{t("salary.results.per_week")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("salary.results.daily")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.daily)}</div>
            <div className="text-sm text-foreground-70">{t("salary.results.per_day")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("salary.results.hourly")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.hourly)}</div>
            <div className="text-sm text-foreground-70">{t("salary.results.per_hour")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Briefcase className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("salary.results.note_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("salary.results.note")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("salary.title")}
      description={t("salary.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
