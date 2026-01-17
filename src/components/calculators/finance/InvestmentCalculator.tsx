'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Calendar, TrendingUp, Percent, Info, PieChart } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function InvestmentCalculator() {
  const { t } = useTranslation(['calc/finance', 'common']);
  const [initialInvestment, setInitialInvestment] = useState<string>('10000');
  const [additionalContribution, setAdditionalContribution] = useState<string>('100');
  const [years, setYears] = useState<string>('10');
  const [returnRate, setReturnRate] = useState<string>('7');
  const [contributionFrequency, setContributionFrequency] = useState<string>('monthly');
  const [compoundFrequency, setCompoundFrequency] = useState<string>('monthly');

  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [totalContributions, setTotalContributions] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [roi, setROI] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  const calculate = () => {
    const P = parseFloat(initialInvestment);
    const PMT = parseFloat(additionalContribution);
    const tVal = parseFloat(years);
    const r = parseFloat(returnRate) / 100;

    if (isNaN(P) || isNaN(PMT) || isNaN(tVal) || isNaN(r) || P < 0 || PMT < 0 || tVal <= 0 || r < 0) {
      setError(t('investment.errors.invalid_input'));
      return;
    }

    setError('');

    // Determine number of periods per year
    const contributionPeriodsPerYear = contributionFrequency === 'monthly' ? 12 : contributionFrequency === 'quarterly' ? 4 : 1;
    const compoundPeriodsPerYear = compoundFrequency === 'monthly' ? 12 : compoundFrequency === 'quarterly' ? 4 : 1;

    // Calculate future value with compound interest
    // FV = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
    const n = compoundPeriodsPerYear;
    const periodicRate = r / n;
    const totalPeriods = n * tVal;

    // Future value of initial investment
    const FV_initial = P * Math.pow(1 + periodicRate, totalPeriods);

    // Future value of regular contributions
    let FV_contributions = 0;
    if (PMT > 0) {
      const contributionPeriods = contributionPeriodsPerYear * tVal;

      // Adjust for different contribution and compound frequencies
      if (contributionPeriodsPerYear === compoundPeriodsPerYear) {
        FV_contributions = PMT * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
      } else {
        // Calculate effective rate per contribution period
        // This accounts for the compound frequency when contributions are made at a different frequency
        const effectiveRatePerContribution = Math.pow(1 + periodicRate, compoundPeriodsPerYear / contributionPeriodsPerYear) - 1;
        FV_contributions = PMT * ((Math.pow(1 + effectiveRatePerContribution, contributionPeriods) - 1) / effectiveRatePerContribution);
      }
    }

    const FV = FV_initial + FV_contributions;
    const totalContrib = P + (PMT * contributionPeriodsPerYear * tVal);
    const interest = FV - totalContrib;
    const roiValue = ((FV - totalContrib) / totalContrib) * 100;

    setShowResult(false);
    setTimeout(() => {
      setFutureValue(FV);
      setTotalContributions(totalContrib);
      setTotalInterest(interest);
      setROI(roiValue);
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setInitialInvestment('10000');
      setAdditionalContribution('100');
      setYears('10');
      setReturnRate('7');
      setContributionFrequency('monthly');
      setCompoundFrequency('monthly');
      setFutureValue(null);
      setTotalContributions(null);
      setTotalInterest(null);
      setROI(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const frequencyOptions = [
    { value: 'monthly', label: t("investment.options.monthly") },
    { value: 'quarterly', label: t("investment.options.quarterly") },
    { value: 'annually', label: t("investment.options.annually") },
  ];

  const inputSection = (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">{t("investment.inputs.initial")}</h2>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t("investment.labels.initial_investment")}
            tooltip={t("investment.tooltips.initial")}
          >
            <NumberInput
              value={initialInvestment}
              onValueChange={(val) => setInitialInvestment(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("investment.labels.initial_investment")}
              min={0}
              step={100}
              startIcon={<DollarSign className="h-4 w-4" />}
            />
          </FormField>

          <FormField
            label={t("investment.labels.periodic_contribution")}
            tooltip={t("investment.tooltips.contribution")}
          >
            <NumberInput
              value={additionalContribution}
              onValueChange={(val) => setAdditionalContribution(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("investment.labels.periodic_contribution")}
              min={0}
              step={10}
              startIcon={<DollarSign className="h-4 w-4" />}
            />
          </FormField>

          <FormField
            label={t("investment.labels.investment_period")}
            tooltip={t("investment.tooltips.years")}
          >
            <NumberInput
              value={years}
              onValueChange={(val) => setYears(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("investment.labels.investment_period")}
              min={1}
              step={1}
              startIcon={<Calendar className="h-4 w-4" />}
            />
          </FormField>

          <FormField
            label={t("investment.labels.annual_return")}
            tooltip={t("investment.tooltips.rate")}
          >
            <NumberInput
              value={returnRate}
              onValueChange={(val) => setReturnRate(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("investment.labels.annual_return")}
              min={0}
              step={0.1}
              startIcon={<Percent className="h-4 w-4" />}
            />
          </FormField>

          <FormField
            label={t("investment.inputs.frequency")}
            tooltip={t("investment.tooltips.frequency")}
          >
            <Combobox
              options={frequencyOptions}
              value={contributionFrequency}
              onChange={(val) => setContributionFrequency(val)}
              placeholder={t("investment.inputs.frequency")}
            />
          </FormField>

          <FormField
            label={t("investment.labels.compound_frequency")}
            tooltip={t("investment.tooltips.compound")}
          >
            <Combobox
              options={frequencyOptions}
              value={compoundFrequency}
              onChange={(val) => setCompoundFrequency(val)}
              placeholder={t("investment.labels.compound_frequency")}
            />
          </FormField>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>
    </>
  );

  const resultSection = futureValue !== null && showResult ? (
    <div className="space-y-6">
      {/* Main Result */}
      <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm">
        <div className="text-center">
          <div className="text-foreground-70 mb-2">{t("investment.results.future_value")}</div>
          <div className="text-5xl font-bold text-primary flex items-center justify-center gap-2">
            <TrendingUp className="w-8 h-8" />
            {formatCurrency(futureValue)}
          </div>
          <div className="text-sm text-foreground-70 mt-2">{t("investment.results.after")} {years} {t("common.years")}</div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm text-center">
          <div className="text-foreground-70 mb-2">{t("investment.results.total_contributions")}</div>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(totalContributions!)}
          </div>
        </div>

        <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm text-center">
          <div className="text-foreground-70 mb-2">{t("investment.results.total_interest")}</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalInterest!)}
          </div>
        </div>

        <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm text-center">
          <div className="text-foreground-70 mb-2">{t("investment.results.roi")}</div>
          <div className="text-2xl font-bold text-primary">
            {roi!.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Investment Summary */}
      <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          {t("investment.results.summary")}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground-70">{t("investment.labels.initial_investment")}:</span>
            <span className="font-semibold">{formatCurrency(parseFloat(initialInvestment))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-70">{t("investment.labels.periodic_contribution")}:</span>
            <span className="font-semibold">{formatCurrency(parseFloat(additionalContribution))} ({t(`investment.options.${contributionFrequency}`)})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-70">{t("investment.labels.investment_period")}:</span>
            <span className="font-semibold">{years} {t("common.years")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-70">{t("investment.labels.annual_return")}:</span>
            <span className="font-semibold">{returnRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-70">{t("investment.labels.compound_frequency")}:</span>
            <span className="font-semibold">{t(`investment.options.${compoundFrequency}`)}</span>
          </div>
        </div>
      </div>

      {/* Visual Breakdown */}
      <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          {t("investment.results.breakdown")}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden flex">
              <div
                className="bg-primary h-full"
                style={{ width: `${(parseFloat(initialInvestment) / futureValue) * 100}%` }}
              ></div>
              <div
                className="bg-blue-500 h-full"
                style={{ width: `${((totalContributions! - parseFloat(initialInvestment)) / futureValue) * 100}%` }}
              ></div>
              <div
                className="bg-green-500 h-full"
                style={{ width: `${(totalInterest! / futureValue) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
              <span>{t("investment.results.initial_percentage")}: {((parseFloat(initialInvestment) / futureValue) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>{t("investment.results.contribution_percentage")}: {(((totalContributions! - parseFloat(initialInvestment)) / futureValue) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>{t("investment.results.interest_percentage")}: {((totalInterest! / futureValue) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("investment.title")}
      description={t("investment.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
