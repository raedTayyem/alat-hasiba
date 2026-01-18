'use client';

/**
 * Franchise Calculator
 *
 * Calculates franchise costs and ongoing royalties
 * Formula: Total Cost = Initial Franchise Fee + (Revenue × Royalty Rate)
 * Annual Royalty = Annual Revenue × Royalty Rate
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Store, DollarSign, Percent, TrendingUp, Calculator, Receipt } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  totalFirstYearCost: number;
  franchiseFee: number;
  annualRoyalty: number;
  monthlyRoyalty: number;
  projectedRevenue: number;
  netRevenueAfterRoyalty: number;
  royaltyRate: number;
  fiveYearRoyaltyCost: number;
}

export default function FranchiseCalculator() {
  const { t } = useTranslation(['calc/business', 'common']);
  const [franchiseFee, setFranchiseFee] = useState<string>('');
  const [royaltyRate, setRoyaltyRate] = useState<string>('');
  const [projectedRevenue, setProjectedRevenue] = useState<string>('');
  const [marketingFeeRate, setMarketingFeeRate] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const fee = parseFloat(franchiseFee);
    const royalty = parseFloat(royaltyRate);
    const revenue = parseFloat(projectedRevenue);

    if (isNaN(fee) || isNaN(royalty) || isNaN(revenue)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (fee < 0 || royalty < 0 || royalty > 100 || revenue <= 0) {
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
        const fee = parseFloat(franchiseFee);
        const royalty = parseFloat(royaltyRate);
        const revenue = parseFloat(projectedRevenue);
        const marketing = parseFloat(marketingFeeRate) || 0;

        // Calculate annual royalty
        const totalRoyaltyRate = royalty + marketing;
        const annualRoyalty = revenue * (totalRoyaltyRate / 100);
        const monthlyRoyalty = annualRoyalty / 12;

        // Total first year cost = Franchise Fee + Annual Royalty
        const totalFirstYearCost = fee + annualRoyalty;

        // Net revenue after royalty
        const netRevenueAfterRoyalty = revenue - annualRoyalty;

        // 5-year royalty cost projection
        const fiveYearRoyaltyCost = annualRoyalty * 5;

        setResult({
          totalFirstYearCost: Math.round(totalFirstYearCost * 100) / 100,
          franchiseFee: fee,
          annualRoyalty: Math.round(annualRoyalty * 100) / 100,
          monthlyRoyalty: Math.round(monthlyRoyalty * 100) / 100,
          projectedRevenue: revenue,
          netRevenueAfterRoyalty: Math.round(netRevenueAfterRoyalty * 100) / 100,
          royaltyRate: totalRoyaltyRate,
          fiveYearRoyaltyCost: Math.round(fiveYearRoyaltyCost * 100) / 100,
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
      setFranchiseFee('');
      setRoyaltyRate('');
      setProjectedRevenue('');
      setMarketingFeeRate('');
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
      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("franchise.inputs.franchise_fee")}
          tooltip={t("franchise.inputs.franchise_fee_tooltip")}
        >
          <NumberInput
            value={franchiseFee}
            onValueChange={(val) => {
              setFranchiseFee(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("franchise.inputs.franchise_fee_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("franchise.inputs.royalty_rate")}
          tooltip={t("franchise.inputs.royalty_rate_tooltip")}
        >
          <NumberInput
            value={royaltyRate}
            onValueChange={(val) => {
              setRoyaltyRate(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("franchise.inputs.royalty_rate_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            min={0}
            max={100}
          />
        </FormField>

        <FormField
          label={t("franchise.inputs.marketing_fee")}
          tooltip={t("franchise.inputs.marketing_fee_tooltip")}
        >
          <NumberInput
            value={marketingFeeRate}
            onValueChange={(val) => {
              setMarketingFeeRate(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("franchise.inputs.marketing_fee_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            min={0}
            max={100}
          />
        </FormField>

        <FormField
          label={t("franchise.inputs.projected_revenue")}
          tooltip={t("franchise.inputs.projected_revenue_tooltip")}
        >
          <NumberInput
            value={projectedRevenue}
            onValueChange={(val) => {
              setProjectedRevenue(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("franchise.inputs.projected_revenue_placeholder")}
            startIcon={<TrendingUp className="h-4 w-4" />}
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
              {t("franchise.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("franchise.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("franchise.info.typical_fees_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("franchise.info.typical_fee_1")}</li>
              <li>{t("franchise.info.typical_fee_2")}</li>
              <li>{t("franchise.info.typical_fee_3")}</li>
            </ul>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("franchise.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("franchise.info.use_case_1")}</li>
              <li>{t("franchise.info.use_case_2")}</li>
              <li>{t("franchise.info.use_case_3")}</li>
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
          {t("franchise.results.first_year_cost")}
        </div>
        <div className="text-4xl font-bold mb-2 text-primary">
          {t("common:units.currencySymbol")}{formatNumber(result.totalFirstYearCost)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("franchise.results.royalty_rate")}: {result.royaltyRate}%
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("franchise.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Store className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("franchise.results.franchise_fee")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:units.currencySymbol")}{formatNumber(result.franchiseFee)}</div>
            <div className="text-sm text-foreground-70">{t("franchise.results.one_time")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Receipt className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("franchise.results.annual_royalty")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:units.currencySymbol")}{formatNumber(result.annualRoyalty)}</div>
            <div className="text-sm text-foreground-70">{t("franchise.results.per_year")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("franchise.results.monthly_royalty")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:units.currencySymbol")}{formatNumber(result.monthlyRoyalty)}</div>
            <div className="text-sm text-foreground-70">{t("franchise.results.per_month")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t("franchise.results.net_revenue")}</div>
            </div>
            <div className="text-2xl font-bold text-success">{t("common:units.currencySymbol")}{formatNumber(result.netRevenueAfterRoyalty)}</div>
            <div className="text-sm text-foreground-70">{t("franchise.results.after_royalties")}</div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <Calculator className="w-5 h-5 text-warning ml-2" />
            <div className="font-medium">{t("franchise.results.five_year_royalty")}</div>
          </div>
          <div className="text-2xl font-bold text-warning">{t("common:units.currencySymbol")}{formatNumber(result.fiveYearRoyaltyCost)}</div>
          <div className="text-sm text-foreground-70">{t("franchise.results.projected_total")}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Store className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("franchise.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("franchise.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("franchise.title")}
      description={t("franchise.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
