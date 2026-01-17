'use client';

/**
 * Retirement Savings Calculator
 *
 * Calculates future retirement savings with compound interest
 * Formula: FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r
 * Where:
 *   FV = Future Value
 *   PV = Present Value (current savings)
 *   PMT = Monthly payment
 *   r = Monthly interest rate
 *   n = Total number of months
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Calendar, Percent, PiggyBank, TrendingUp, Target } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  currentSavings: number;
  monthlyContribution: number;
  yearsToRetirement: number;
  annualReturnRate: number;
  monthlyBreakdown: {
    year: number;
    balance: number;
    contributions: number;
    interest: number;
  }[];
}

export default function RetirementSavingsCalculator() {
  const { t, i18n } = useTranslation('calc/business');
  const [currentSavings, setCurrentSavings] = useState<string>('');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('');
  const [yearsToRetirement, setYearsToRetirement] = useState<string>('');
  const [annualReturnRate, setAnnualReturnRate] = useState<string>('7');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const savings = parseFloat(currentSavings);
    const contribution = parseFloat(monthlyContribution);
    const years = parseFloat(yearsToRetirement);
    const rate = parseFloat(annualReturnRate);

    if (isNaN(savings) || isNaN(contribution) || isNaN(years) || isNaN(rate)) {
      setError(t('errors.invalid_input'));
      return false;
    }

    if (savings < 0 || contribution < 0 || years <= 0 || rate < 0) {
      setError(t('errors.positive_values_required'));
      return false;
    }

    if (savings === 0 && contribution === 0) {
      setError(t('retirement_savings.errors.need_savings_or_contribution'));
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
        const PV = parseFloat(currentSavings);
        const PMT = parseFloat(monthlyContribution);
        const years = parseFloat(yearsToRetirement);
        const annualRate = parseFloat(annualReturnRate) / 100;

        const monthlyRate = annualRate / 12;
        const totalMonths = years * 12;

        // Calculate Future Value using compound interest formula
        // FV = PV(1+r)^n + PMT × ((1+r)^n - 1)/r
        let futureValue: number;

        if (monthlyRate === 0) {
          // If no interest, simple addition
          futureValue = PV + (PMT * totalMonths);
        } else {
          const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
          const futurePV = PV * compoundFactor;
          const futurePMT = PMT * ((compoundFactor - 1) / monthlyRate);
          futureValue = futurePV + futurePMT;
        }

        const totalContributions = PV + (PMT * totalMonths);
        const totalInterest = futureValue - totalContributions;

        // Generate yearly breakdown
        const monthlyBreakdown: CalculatorResult['monthlyBreakdown'] = [];
        let runningBalance = PV;
        let runningContributions = PV;
        let runningInterest = 0;

        for (let year = 1; year <= years; year++) {
          for (let month = 1; month <= 12; month++) {
            const interestEarned = runningBalance * monthlyRate;
            runningBalance += interestEarned + PMT;
            runningContributions += PMT;
            runningInterest += interestEarned;
          }

          monthlyBreakdown.push({
            year,
            balance: runningBalance,
            contributions: runningContributions,
            interest: runningInterest,
          });
        }

        setResult({
          futureValue,
          totalContributions,
          totalInterest,
          currentSavings: PV,
          monthlyContribution: PMT,
          yearsToRetirement: years,
          annualReturnRate: annualRate * 100,
          monthlyBreakdown,
        });

        setShowResult(true);
      } catch (err) {
        setError(t('errors.calculation_error'));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCurrentSavings('');
      setMonthlyContribution('');
      setYearsToRetirement('');
      setAnnualReturnRate('7');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const formatPercent = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('retirement_savings.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t('retirement_savings.inputs.current_savings')}
          tooltip={t('retirement_savings.inputs.current_savings_tooltip')}
        >
          <NumberInput
            value={currentSavings}
            onValueChange={(val) => {
              setCurrentSavings(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t('retirement_savings.inputs.current_savings_placeholder')}
            startIcon={<PiggyBank className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t('retirement_savings.inputs.monthly_contribution')}
          tooltip={t('retirement_savings.inputs.monthly_contribution_tooltip')}
        >
          <NumberInput
            value={monthlyContribution}
            onValueChange={(val) => {
              setMonthlyContribution(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t('retirement_savings.inputs.monthly_contribution_placeholder')}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t('retirement_savings.inputs.years_to_retirement')}
          tooltip={t('retirement_savings.inputs.years_to_retirement_tooltip')}
        >
          <NumberInput
            value={yearsToRetirement}
            onValueChange={(val) => {
              setYearsToRetirement(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t('retirement_savings.inputs.years_to_retirement_placeholder')}
            startIcon={<Calendar className="h-4 w-4" />}
            min={1}
            max={50}
          />
        </FormField>

        <FormField
          label={t('retirement_savings.inputs.annual_return_rate')}
          tooltip={t('retirement_savings.inputs.annual_return_rate_tooltip')}
        >
          <NumberInput
            value={annualReturnRate}
            onValueChange={(val) => {
              setAnnualReturnRate(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t('retirement_savings.inputs.annual_return_rate_placeholder')}
            startIcon={<Percent className="h-4 w-4" />}
            min={0}
            max={30}
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
              {t('retirement_savings.info.title')}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t('retirement_savings.description')}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t('retirement_savings.info.use_cases')}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t('retirement_savings.info.use_case_1')}</li>
              <li>{t('retirement_savings.info.use_case_2')}</li>
              <li>{t('retirement_savings.info.use_case_3')}</li>
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
          {t('retirement_savings.results.future_value')}
        </div>
        <div className="text-4xl font-bold text-success mb-2">
          ${formatCurrency(result.futureValue)}
        </div>
        <div className="text-lg text-foreground-70">
          {t('retirement_savings.results.in_years', { years: result.yearsToRetirement })}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t('retirement_savings.results.breakdown')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <PiggyBank className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('retirement_savings.results.total_contributions')}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatCurrency(result.totalContributions)}</div>
            <div className="text-sm text-foreground-70">
              {formatPercent((result.totalContributions / result.futureValue) * 100)}% {t('retirement_savings.results.of_total')}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t('retirement_savings.results.total_interest')}</div>
            </div>
            <div className="text-2xl font-bold text-success">${formatCurrency(result.totalInterest)}</div>
            <div className="text-sm text-foreground-70">
              {formatPercent((result.totalInterest / result.futureValue) * 100)}% {t('retirement_savings.results.of_total')}
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <Target className="w-5 h-5 text-info ml-2" />
            <div className="font-medium">{t('retirement_savings.results.growth_summary')}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mt-2">
            <div>
              <span className="text-foreground-70">{t('retirement_savings.results.starting_balance')}:</span>
              <div className="font-medium">${formatCurrency(result.currentSavings)}</div>
            </div>
            <div>
              <span className="text-foreground-70">{t('retirement_savings.results.monthly_contribution')}:</span>
              <div className="font-medium">${formatCurrency(result.monthlyContribution)}</div>
            </div>
            <div>
              <span className="text-foreground-70">{t('retirement_savings.results.return_rate')}:</span>
              <div className="font-medium">{formatPercent(result.annualReturnRate)}%</div>
            </div>
            <div>
              <span className="text-foreground-70">{t('retirement_savings.results.growth_multiple')}:</span>
              <div className="font-medium">{(result.futureValue / result.totalContributions).toFixed(2)}x</div>
            </div>
          </div>
        </div>

        {result.monthlyBreakdown.length > 0 && (
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-medium mb-3">{t('retirement_savings.results.yearly_projection')}</h4>
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="text-foreground-70">
                    <th className="text-start py-2">{t('retirement_savings.results.year')}</th>
                    <th className="text-end py-2">{t('retirement_savings.results.balance')}</th>
                    <th className="text-end py-2">{t('retirement_savings.results.interest_earned')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.monthlyBreakdown.filter((_, i) => i % 5 === 4 || i === 0 || i === result.monthlyBreakdown.length - 1).map((row) => (
                    <tr key={row.year} className="border-t border-border">
                      <td className="py-2">{row.year}</td>
                      <td className="text-end py-2 font-medium">${formatCurrency(row.balance)}</td>
                      <td className="text-end py-2 text-success">${formatCurrency(row.interest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <TrendingUp className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('retirement_savings.results.formula_title')}</h4>
            <p className="text-sm text-foreground-70">
              {t('retirement_savings.results.formula')}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('retirement_savings.title')}
      description={t('retirement_savings.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
