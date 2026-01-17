'use client';

/**
 * Bonus Calculator
 *
 * Calculates employee bonus based on base salary, bonus percentage, and performance factor
 * Formula: Bonus = Base Salary × Bonus Percentage × Performance Factor
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Percent, TrendingUp, Award, Star } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  bonusAmount: number;
  totalCompensation: number;
  effectiveBonusRate: number;
  baseSalary: number;
  bonusPercentage: number;
  performanceFactor: number;
  monthlyBonus: number;
}

export default function BonusCalculator() {
  const { t } = useTranslation(['calc/business', 'common']);
  const [baseSalary, setBaseSalary] = useState<string>('');
  const [bonusPercentage, setBonusPercentage] = useState<string>('');
  const [performanceFactor, setPerformanceFactor] = useState<string>('1.0');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const salary = parseFloat(baseSalary);
    const percentage = parseFloat(bonusPercentage);
    const factor = parseFloat(performanceFactor);

    if (isNaN(salary) || isNaN(percentage) || isNaN(factor)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (salary <= 0 || percentage < 0 || factor < 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (percentage > 100) {
      setError(t("bonus.errors.percentage_too_high"));
      return false;
    }

    if (factor > 3) {
      setError(t("bonus.errors.factor_too_high"));
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
        const salary = parseFloat(baseSalary);
        const percentage = parseFloat(bonusPercentage) / 100;
        const factor = parseFloat(performanceFactor);

        // Bonus = Base Salary × Bonus % × Performance Factor
        const bonusAmount = salary * percentage * factor;

        // Total Compensation = Base Salary + Bonus
        const totalCompensation = salary + bonusAmount;

        // Effective Bonus Rate (actual bonus percentage after performance adjustment)
        const effectiveBonusRate = (bonusAmount / salary) * 100;

        // Monthly Bonus
        const monthlyBonus = bonusAmount / 12;

        setResult({
          bonusAmount,
          totalCompensation,
          effectiveBonusRate,
          baseSalary: salary,
          bonusPercentage: parseFloat(bonusPercentage),
          performanceFactor: factor,
          monthlyBonus,
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
      setBaseSalary('');
      setBonusPercentage('');
      setPerformanceFactor('1.0');
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

  const getPerformanceRating = (factor: number): string => {
    if (factor >= 1.5) return t("bonus.ratings.exceptional");
    if (factor >= 1.25) return t("bonus.ratings.exceeds_expectations");
    if (factor >= 1.0) return t("bonus.ratings.meets_expectations");
    if (factor >= 0.75) return t("bonus.ratings.needs_improvement");
    return t("bonus.ratings.below_expectations");
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("bonus.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("bonus.inputs.base_salary")}
          tooltip={t("bonus.inputs.base_salary_tooltip")}
        >
          <NumberInput
            value={baseSalary}
            onValueChange={(val) => {
              setBaseSalary(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("bonus.inputs.base_salary_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("bonus.inputs.bonus_percentage")}
          tooltip={t("bonus.inputs.bonus_percentage_tooltip")}
        >
          <NumberInput
            value={bonusPercentage}
            onValueChange={(val) => {
              setBonusPercentage(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("bonus.inputs.bonus_percentage_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            min={0}
            max={100}
            step={0.5}
          />
        </FormField>

        <FormField
          label={t("bonus.inputs.performance_factor")}
          tooltip={t("bonus.inputs.performance_factor_tooltip")}
        >
          <NumberInput
            value={performanceFactor}
            onValueChange={(val) => {
              setPerformanceFactor(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("bonus.inputs.performance_factor_placeholder")}
            startIcon={<Star className="h-4 w-4" />}
            min={0}
            max={3}
            step={0.1}
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
              {t("bonus.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("bonus.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("bonus.info.performance_factors")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("bonus.info.factor_1")}</li>
              <li>{t("bonus.info.factor_2")}</li>
              <li>{t("bonus.info.factor_3")}</li>
              <li>{t("bonus.info.factor_4")}</li>
              <li>{t("bonus.info.factor_5")}</li>
            </ul>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("bonus.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("bonus.info.use_case_1")}</li>
              <li>{t("bonus.info.use_case_2")}</li>
              <li>{t("bonus.info.use_case_3")}</li>
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
          {t("bonus.results.bonus_amount")}
        </div>
        <div className="text-4xl font-bold mb-2 text-success">
          {t("common:units.currencySymbol")}{formatNumber(result.bonusAmount)}
        </div>
        <div className="text-lg text-foreground-70">
          {getPerformanceRating(result.performanceFactor)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("bonus.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("bonus.results.base_salary")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:units.currencySymbol")}{formatNumber(result.baseSalary)}</div>
            <div className="text-sm text-foreground-70">{t("bonus.results.annual")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t("bonus.results.total_compensation")}</div>
            </div>
            <div className="text-2xl font-bold text-success">{t("common:units.currencySymbol")}{formatNumber(result.totalCompensation)}</div>
            <div className="text-sm text-foreground-70">{t("bonus.results.salary_plus_bonus")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-info ml-2" />
              <div className="font-medium">{t("bonus.results.effective_rate")}</div>
            </div>
            <div className="text-2xl font-bold text-info">{formatNumber(result.effectiveBonusRate)}%</div>
            <div className="text-sm text-foreground-70">{t("bonus.results.after_performance")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Award className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t("bonus.results.monthly_bonus")}</div>
            </div>
            <div className="text-2xl font-bold text-warning">{t("common:units.currencySymbol")}{formatNumber(result.monthlyBonus)}</div>
            <div className="text-sm text-foreground-70">{t("bonus.results.per_month")}</div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{t("bonus.results.performance_impact")}</span>
            <span className="text-lg font-bold">{result.performanceFactor}x</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground-70">{t("bonus.results.target_bonus")}:</span>
            <span className="text-sm font-medium">{result.bonusPercentage}%</span>
            <span className="text-sm text-foreground-70">→</span>
            <span className="text-sm font-medium text-success">{formatNumber(result.effectiveBonusRate)}%</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Award className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("bonus.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("bonus.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("bonus.title")}
      description={t("bonus.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
