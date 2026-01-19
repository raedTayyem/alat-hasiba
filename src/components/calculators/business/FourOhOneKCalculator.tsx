'use client';

/**
 * 401(k) Calculator
 *
 * Calculates 401(k) retirement savings projections with employer matching
 * Formula: FV = (Employee Contribution + Employer Match) × ((1+r)^n - 1) / r + PV × (1+r)^n
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Calendar, Percent, Building2, User, TrendingUp, PiggyBank } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  futureValue: number;
  employeeContributions: number;
  employerContributions: number;
  totalContributions: number;
  totalInterest: number;
  annualSalary: number;
  contributionPercent: number;
  employerMatchPercent: number;
  employerMatchLimit: number;
  yearsToRetirement: number;
  yearlyBreakdown: {
    year: number;
    balance: number;
    employeeYTD: number;
    employerYTD: number;
    interestYTD: number;
  }[];
}

export default function FourOhOneKCalculator() {
  const { t } = useTranslation('calc/business');
  const [annualSalary, setAnnualSalary] = useState<string>('');
  const [contributionPercent, setContributionPercent] = useState<string>('6');
  const [employerMatchPercent, setEmployerMatchPercent] = useState<string>('50');
  const [employerMatchLimit, setEmployerMatchLimit] = useState<string>('6');
  const [currentBalance, setCurrentBalance] = useState<string>('0');
  const [yearsToRetirement, setYearsToRetirement] = useState<string>('');
  const [annualReturnRate, setAnnualReturnRate] = useState<string>('7');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const salary = parseFloat(annualSalary);
    const contribution = parseFloat(contributionPercent);
    const matchPercent = parseFloat(employerMatchPercent);
    const matchLimit = parseFloat(employerMatchLimit);
    const years = parseFloat(yearsToRetirement);
    const rate = parseFloat(annualReturnRate);

    if (isNaN(salary) || isNaN(contribution) || isNaN(years) || isNaN(rate)) {
      setError(t('errors.invalid_input'));
      return false;
    }

    if (salary <= 0 || contribution < 0 || years <= 0) {
      setError(t('errors.positive_values_required'));
      return false;
    }

    if (contribution > 100 || matchPercent > 100 || matchLimit > 100) {
      setError(t('four_oh_one_k.errors.invalid_percentage'));
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
        const employeeContribPct = parseFloat(contributionPercent) / 100;
        const matchPct = parseFloat(employerMatchPercent) / 100;
        const matchLimitPct = parseFloat(employerMatchLimit) / 100;
        const PV = parseFloat(currentBalance) || 0;
        const years = parseFloat(yearsToRetirement);
        const annualRate = parseFloat(annualReturnRate) / 100;

        const monthlyRate = annualRate / 12;

        // Calculate monthly contributions
        const monthlyEmployeeContrib = (salary * employeeContribPct) / 12;

        // Employer matches up to the limit
        const matchableAmount = Math.min(employeeContribPct, matchLimitPct) * salary;
        const monthlyEmployerContrib = (matchableAmount * matchPct) / 12;

        const totalMonthlyContrib = monthlyEmployeeContrib + monthlyEmployerContrib;

        // Generate yearly breakdown
        const yearlyBreakdown: CalculatorResult['yearlyBreakdown'] = [];
        let runningBalance = PV;
        let totalEmployeeContrib = 0;
        let totalEmployerContrib = 0;
        let totalInterest = 0;

        for (let year = 1; year <= years; year++) {
          for (let month = 1; month <= 12; month++) {
            const interestEarned = runningBalance * monthlyRate;
            runningBalance += interestEarned + totalMonthlyContrib;
            totalEmployeeContrib += monthlyEmployeeContrib;
            totalEmployerContrib += monthlyEmployerContrib;
            totalInterest += interestEarned;
          }

          yearlyBreakdown.push({
            year,
            balance: runningBalance,
            employeeYTD: totalEmployeeContrib,
            employerYTD: totalEmployerContrib,
            interestYTD: totalInterest,
          });
        }

        const futureValue = runningBalance;
        const totalContributions = totalEmployeeContrib + totalEmployerContrib + PV;

        setResult({
          futureValue,
          employeeContributions: totalEmployeeContrib,
          employerContributions: totalEmployerContrib,
          totalContributions,
          totalInterest,
          annualSalary: salary,
          contributionPercent: employeeContribPct * 100,
          employerMatchPercent: matchPct * 100,
          employerMatchLimit: matchLimitPct * 100,
          yearsToRetirement: years,
          yearlyBreakdown,
        });

        setShowResult(true);
      } catch (err) {
        setError(t('errors.calculation_error'));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setAnnualSalary('');
      setContributionPercent('6');
      setEmployerMatchPercent('50');
      setEmployerMatchLimit('6');
      setCurrentBalance('0');
      setYearsToRetirement('');
      setAnnualReturnRate('7');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('four_oh_one_k.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t('four_oh_one_k.inputs.annual_salary')}
          tooltip={t('four_oh_one_k.inputs.annual_salary_tooltip')}
        >
          <NumberInput
            value={annualSalary}
            onValueChange={(val) => {
              setAnnualSalary(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t('four_oh_one_k.inputs.annual_salary_placeholder')}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t('four_oh_one_k.inputs.contribution_percent')}
          tooltip={t('four_oh_one_k.inputs.contribution_percent_tooltip')}
        >
          <NumberInput
            value={contributionPercent}
            onValueChange={(val) => {
              setContributionPercent(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t('four_oh_one_k.inputs.contribution_percent_placeholder')}
            startIcon={<User className="h-4 w-4" />}
            min={0}
            max={100}
            step={0.5}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label={t('four_oh_one_k.inputs.employer_match_percent')}
            tooltip={t('four_oh_one_k.inputs.employer_match_percent_tooltip')}
          >
            <NumberInput
              value={employerMatchPercent}
              onValueChange={(val) => {
                setEmployerMatchPercent(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t("placeholders.employerMatchPercent")}
              startIcon={<Building2 className="h-4 w-4" />}
              min={0}
              max={100}
            />
          </FormField>

          <FormField
            label={t('four_oh_one_k.inputs.employer_match_limit')}
            tooltip={t('four_oh_one_k.inputs.employer_match_limit_tooltip')}
          >
            <NumberInput
              value={employerMatchLimit}
              onValueChange={(val) => {
                setEmployerMatchLimit(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t("placeholders.employerMatchLimit")}
              startIcon={<Percent className="h-4 w-4" />}
              min={0}
              max={100}
            />
          </FormField>
        </div>

        <FormField
          label={t('four_oh_one_k.inputs.current_balance')}
          tooltip={t('four_oh_one_k.inputs.current_balance_tooltip')}
        >
          <NumberInput
            value={currentBalance}
            onValueChange={(val) => {
              setCurrentBalance(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t('four_oh_one_k.inputs.current_balance_placeholder')}
            startIcon={<PiggyBank className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label={t('four_oh_one_k.inputs.years_to_retirement')}
            tooltip={t('four_oh_one_k.inputs.years_to_retirement_tooltip')}
          >
            <NumberInput
              value={yearsToRetirement}
              onValueChange={(val) => {
                setYearsToRetirement(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t('four_oh_one_k.inputs.years_to_retirement_placeholder')}
              startIcon={<Calendar className="h-4 w-4" />}
              min={1}
              max={50}
            />
          </FormField>

          <FormField
            label={t('four_oh_one_k.inputs.annual_return_rate')}
            tooltip={t('four_oh_one_k.inputs.annual_return_rate_tooltip')}
          >
            <NumberInput
              value={annualReturnRate}
              onValueChange={(val) => {
                setAnnualReturnRate(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t("placeholders.annualReturnRate")}
              startIcon={<Percent className="h-4 w-4" />}
              min={0}
              max={30}
              step={0.1}
            />
          </FormField>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t('four_oh_one_k.info.title')}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t('four_oh_one_k.description')}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t('four_oh_one_k.info.use_cases')}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t('four_oh_one_k.info.use_case_1')}</li>
              <li>{t('four_oh_one_k.info.use_case_2')}</li>
              <li>{t('four_oh_one_k.info.use_case_3')}</li>
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
          {t('four_oh_one_k.results.projected_balance')}
        </div>
        <div className="text-4xl font-bold text-success mb-2">
          ${formatCurrency(result.futureValue)}
        </div>
        <div className="text-lg text-foreground-70">
          {t('four_oh_one_k.results.in_years', { years: result.yearsToRetirement })}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t('four_oh_one_k.results.contribution_breakdown')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <User className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium text-sm">{t('four_oh_one_k.results.your_contributions')}</div>
            </div>
            <div className="text-xl font-bold text-primary">${formatCurrency(result.employeeContributions)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Building2 className="w-5 h-5 text-info ml-2" />
              <div className="font-medium text-sm">{t('four_oh_one_k.results.employer_match')}</div>
            </div>
            <div className="text-xl font-bold text-info">${formatCurrency(result.employerContributions)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-success ml-2" />
              <div className="font-medium text-sm">{t('four_oh_one_k.results.investment_growth')}</div>
            </div>
            <div className="text-xl font-bold text-success">${formatCurrency(result.totalInterest)}</div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <h4 className="font-medium mb-2">{t('four_oh_one_k.results.monthly_breakdown')}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-foreground-70">{t('four_oh_one_k.results.your_monthly')}:</span>
              <div className="font-medium">${formatCurrency((result.annualSalary * result.contributionPercent / 100) / 12)}</div>
            </div>
            <div>
              <span className="text-foreground-70">{t('four_oh_one_k.results.employer_monthly')}:</span>
              <div className="font-medium">${formatCurrency(result.employerContributions / (result.yearsToRetirement * 12))}</div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center mb-2">
            <Building2 className="w-5 h-5 text-success ml-2" />
            <span className="font-medium">{t('four_oh_one_k.results.free_money')}</span>
          </div>
          <p className="text-sm text-foreground-70">
            {t('four_oh_one_k.results.employer_match_value', { amount: formatCurrency(result.employerContributions) })}
          </p>
        </div>

        {result.yearlyBreakdown.length > 0 && (
          <div className="bg-card p-4 rounded-lg border border-border">
            <h4 className="font-medium mb-3">{t('four_oh_one_k.results.yearly_projection')}</h4>
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="text-foreground-70">
                    <th className="text-start py-2">{t('four_oh_one_k.results.year')}</th>
                    <th className="text-end py-2">{t('four_oh_one_k.results.balance')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyBreakdown.filter((_, i) => i % 5 === 4 || i === 0 || i === result.yearlyBreakdown.length - 1).map((row) => (
                    <tr key={row.year} className="border-t border-border">
                      <td className="py-2">{row.year}</td>
                      <td className="text-end py-2 font-medium">${formatCurrency(row.balance)}</td>
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
            <h4 className="font-medium mb-1">{t('four_oh_one_k.results.formula_title')}</h4>
            <p className="text-sm text-foreground-70">
              {t('four_oh_one_k.results.formula')}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('four_oh_one_k.title')}
      description={t('four_oh_one_k.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
