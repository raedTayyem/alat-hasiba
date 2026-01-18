'use client';

/**
 * RENT VS BUY CALCULATOR
 * Compares the cost of renting vs buying a home over time
 * - Monthly cost comparison (rent vs mortgage+taxes+insurance+maintenance)
 * - Total cost over 5, 10, 15 years
 * - Break-even year analysis
 * - Opportunity cost of down payment invested
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Percent, Calendar, FileText, Shield, Building, Wrench, TrendingUp, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

interface YearlyComparison {
  year: number;
  buyingTotalCost: number;
  rentingTotalCost: number;
  difference: number;
  homeEquity: number;
  investmentValue: number;
}

interface CalculatorResult {
  monthlyMortgage: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  monthlyHOA: number;
  monthlyMaintenance: number;
  totalMonthlyBuying: number;
  totalMonthlyRenting: number;
  monthlySavings: number;
  downPayment: number;
  loanAmount: number;
  breakEvenYear: number | null;
  yearlyComparisons: YearlyComparison[];
  totalCost5Years: { buying: number; renting: number; difference: number };
  totalCost10Years: { buying: number; renting: number; difference: number };
  totalCost15Years: { buying: number; renting: number; difference: number };
  recommendation: string;
}

export default function RentVsBuyCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [homePrice, setHomePrice] = useState<string>('');
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>('20');
  const [interestRate, setInterestRate] = useState<string>('6.5');
  const [loanTermYears, setLoanTermYears] = useState<string>('30');
  const [propertyTaxRate, setPropertyTaxRate] = useState<string>('1.2');
  const [homeInsurance, setHomeInsurance] = useState<string>('1200');
  const [hoaFees, setHoaFees] = useState<string>('0');
  const [maintenanceRate, setMaintenanceRate] = useState<string>('1');
  const [homeAppreciationRate, setHomeAppreciationRate] = useState<string>('3');
  const [monthlyRent, setMonthlyRent] = useState<string>('');
  const [rentIncreaseRate, setRentIncreaseRate] = useState<string>('3');
  const [rentersInsurance, setRentersInsurance] = useState<string>('180');
  const [investmentReturnRate, setInvestmentReturnRate] = useState<string>('7');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const price = parseFloat(homePrice);
    const downPayment = parseFloat(downPaymentPercent);
    const rate = parseFloat(interestRate);
    const term = parseFloat(loanTermYears);
    const propTax = parseFloat(propertyTaxRate);
    const insurance = parseFloat(homeInsurance);
    const hoa = parseFloat(hoaFees);
    const maintenance = parseFloat(maintenanceRate);
    const appreciation = parseFloat(homeAppreciationRate);
    const rent = parseFloat(monthlyRent);
    const rentInc = parseFloat(rentIncreaseRate);
    const renterIns = parseFloat(rentersInsurance);
    const invReturn = parseFloat(investmentReturnRate);

    if (isNaN(price) || isNaN(downPayment) || isNaN(rate) || isNaN(term) ||
        isNaN(propTax) || isNaN(insurance) || isNaN(hoa) || isNaN(maintenance) ||
        isNaN(appreciation) || isNaN(rent) || isNaN(rentInc) || isNaN(renterIns) || isNaN(invReturn)) {
      setError(t("calculators.invalid_input"));
      return false;
    }

    if (price <= 0) {
      setError(t("rent_vs_buy_calculator.price_required"));
      return false;
    }

    if (rent <= 0) {
      setError(t("rent_vs_buy_calculator.rent_required"));
      return false;
    }

    if (downPayment < 0 || downPayment > 100) {
      setError(t("rent_vs_buy_calculator.down_payment_range"));
      return false;
    }

    if (rate <= 0 || rate > 30) {
      setError(t("rent_vs_buy_calculator.interest_rate_range"));
      return false;
    }

    if (term <= 0 || term > 40) {
      setError(t("rent_vs_buy_calculator.loan_term_range"));
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
        const price = parseFloat(homePrice);
        const downPayment = parseFloat(downPaymentPercent) / 100;
        const rate = parseFloat(interestRate) / 100 / 12; // Monthly rate
        const term = parseFloat(loanTermYears) * 12; // Months
        const propTax = parseFloat(propertyTaxRate) / 100;
        const insurance = parseFloat(homeInsurance);
        const hoa = parseFloat(hoaFees);
        const maintenance = parseFloat(maintenanceRate) / 100;
        const appreciation = parseFloat(homeAppreciationRate) / 100;
        const rent = parseFloat(monthlyRent);
        const rentInc = parseFloat(rentIncreaseRate) / 100;
        const renterIns = parseFloat(rentersInsurance);
        const invReturn = parseFloat(investmentReturnRate) / 100;

        // Calculate down payment and loan amount
        const downPaymentAmount = price * downPayment;
        const loanAmount = price - downPaymentAmount;

        // Calculate monthly mortgage payment
        let monthlyMortgage: number;
        if (rate === 0) {
          monthlyMortgage = loanAmount / term;
        } else {
          monthlyMortgage = loanAmount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
        }

        // Calculate monthly costs for buying
        const monthlyPropertyTax = (price * propTax) / 12;
        const monthlyHomeInsurance = insurance / 12;
        const monthlyHOA = hoa;
        const monthlyMaintenance = (price * maintenance) / 12;
        const totalMonthlyBuying = monthlyMortgage + monthlyPropertyTax + monthlyHomeInsurance + monthlyHOA + monthlyMaintenance;

        // Calculate monthly costs for renting
        const totalMonthlyRenting = rent + (renterIns / 12);

        const monthlySavings = totalMonthlyBuying - totalMonthlyRenting;

        // Calculate yearly comparisons for up to 15 years
        const yearlyComparisons: YearlyComparison[] = [];
        let buyingCumulativeCost = downPaymentAmount;
        let rentingCumulativeCost = 0;
        let homeValue = price;
        let remainingBalance = loanAmount;
        let investmentValue = downPaymentAmount; // Opportunity cost of down payment
        let currentRent = rent;
        let breakEvenYear: number | null = null;

        for (let year = 1; year <= 15; year++) {
          // Update home value with appreciation
          homeValue = homeValue * (1 + appreciation);

          // Calculate buying costs for this year
          let yearlyInterest = 0;
          let yearlyPrincipal = 0;
          for (let month = 1; month <= 12; month++) {
            if (remainingBalance > 0) {
              const interestPayment = remainingBalance * rate;
              const principalPayment = monthlyMortgage - interestPayment;
              yearlyInterest += interestPayment;
              yearlyPrincipal += principalPayment;
              remainingBalance -= principalPayment;
            }
          }

          const yearlyPropertyTax = price * propTax;
          const yearlyMaintenance = price * maintenance;
          const yearlyBuyingCost = yearlyInterest + yearlyPrincipal + yearlyPropertyTax + insurance + (hoa * 12) + yearlyMaintenance;
          buyingCumulativeCost += yearlyBuyingCost;

          // Calculate renting costs for this year
          const yearlyRentingCost = (currentRent * 12) + renterIns;
          rentingCumulativeCost += yearlyRentingCost;

          // Update investment value (opportunity cost of down payment)
          investmentValue = investmentValue * (1 + invReturn);

          // Calculate home equity
          const homeEquity = homeValue - remainingBalance;

          // Net position for buying includes equity minus cumulative costs
          const buyingNetPosition = homeEquity - buyingCumulativeCost;
          // Net position for renting includes investment value minus cumulative costs
          const rentingNetPosition = investmentValue - rentingCumulativeCost;

          const difference = buyingNetPosition - rentingNetPosition;

          yearlyComparisons.push({
            year,
            buyingTotalCost: buyingCumulativeCost,
            rentingTotalCost: rentingCumulativeCost,
            difference,
            homeEquity,
            investmentValue,
          });

          // Check for break-even point
          if (breakEvenYear === null && difference >= 0) {
            breakEvenYear = year;
          }

          // Update rent for next year
          currentRent = currentRent * (1 + rentInc);
        }

        // Get specific year comparisons
        const totalCost5Years = {
          buying: yearlyComparisons[4].buyingTotalCost,
          renting: yearlyComparisons[4].rentingTotalCost,
          difference: yearlyComparisons[4].difference,
        };

        const totalCost10Years = {
          buying: yearlyComparisons[9].buyingTotalCost,
          renting: yearlyComparisons[9].rentingTotalCost,
          difference: yearlyComparisons[9].difference,
        };

        const totalCost15Years = {
          buying: yearlyComparisons[14].buyingTotalCost,
          renting: yearlyComparisons[14].rentingTotalCost,
          difference: yearlyComparisons[14].difference,
        };

        // Generate recommendation
        let recommendation: string;
        if (breakEvenYear === null) {
          recommendation = t("rent_vs_buy_calculator.recommend_rent");
        } else if (breakEvenYear <= 3) {
          recommendation = t("rent_vs_buy_calculator.recommend_buy_short");
        } else if (breakEvenYear <= 7) {
          recommendation = t("rent_vs_buy_calculator.recommend_buy_medium", { years: 7 });
        } else {
          recommendation = t("rent_vs_buy_calculator.recommend_buy_long");
        }

        setResult({
          monthlyMortgage,
          monthlyPropertyTax,
          monthlyHomeInsurance,
          monthlyHOA,
          monthlyMaintenance,
          totalMonthlyBuying,
          totalMonthlyRenting,
          monthlySavings,
          downPayment: downPaymentAmount,
          loanAmount,
          breakEvenYear,
          yearlyComparisons,
          totalCost5Years,
          totalCost10Years,
          totalCost15Years,
          recommendation,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("calculators.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setHomePrice('');
      setDownPaymentPercent('20');
      setInterestRate('6.5');
      setLoanTermYears('30');
      setPropertyTaxRate('1.2');
      setHomeInsurance('1200');
      setHoaFees('0');
      setMaintenanceRate('1');
      setHomeAppreciationRate('3');
      setMonthlyRent('');
      setRentIncreaseRate('3');
      setRentersInsurance('180');
      setInvestmentReturnRate('7');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("rent_vs_buy_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Buying Inputs */}
        <div className="bg-card-bg border border-border rounded-lg p-4">
          <h3 className="font-medium mb-3">{t("rent_vs_buy_calculator.buying_section")}</h3>

          <div className="space-y-4">
            <FormField
              label={t("rent_vs_buy_calculator.home_price")}
              tooltip={t("rent_vs_buy_calculator.price_tooltip")}
            >
              <NumberInput
                value={homePrice}
                onValueChange={(val) => { setHomePrice(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder="300000"
                min={0}
                startIcon={<DollarSign className="h-4 w-4" />}
              />
            </FormField>

            <FormField
              label={t("rent_vs_buy_calculator.down_payment")}
              tooltip={t("rent_vs_buy_calculator.down_payment_tooltip")}
            >
              <NumberInput
                value={downPaymentPercent}
                onValueChange={(val) => { setDownPaymentPercent(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder="20"
                min={0}
                max={100}
                startIcon={<Percent className="h-4 w-4" />}
              />
            </FormField>

            <FormField
              label={t("rent_vs_buy_calculator.interest_rate")}
              tooltip={t("rent_vs_buy_calculator.interest_tooltip")}
            >
              <NumberInput
                value={interestRate}
                onValueChange={(val) => { setInterestRate(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder="6.5"
                min={0}
                step={0.1}
                startIcon={<Percent className="h-4 w-4" />}
              />
            </FormField>

            <FormField
              label={t("rent_vs_buy_calculator.loan_term")}
              tooltip={t("rent_vs_buy_calculator.loan_term_tooltip")}
            >
              <NumberInput
                value={loanTermYears}
                onValueChange={(val) => { setLoanTermYears(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder="30"
                min={1}
                max={40}
                startIcon={<Calendar className="h-4 w-4" />}
              />
            </FormField>

            <FormField
              label={t("rent_vs_buy_calculator.property_tax_rate")}
              tooltip={t("rent_vs_buy_calculator.property_tax_tooltip")}
            >
              <NumberInput
                value={propertyTaxRate}
                onValueChange={(val) => { setPropertyTaxRate(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder="1.2"
                min={0}
                step={0.1}
                startIcon={<Percent className="h-4 w-4" />}
              />
            </FormField>

            <FormField
              label={t("rent_vs_buy_calculator.home_insurance")}
              tooltip={t("rent_vs_buy_calculator.home_insurance_tooltip")}
            >
              <NumberInput
                value={homeInsurance}
                onValueChange={(val) => { setHomeInsurance(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder="1200"
                min={0}
                startIcon={<Shield className="h-4 w-4" />}
              />
            </FormField>

            <FormField
              label={t("rent_vs_buy_calculator.hoa_fees")}
              tooltip={t("rent_vs_buy_calculator.hoa_tooltip")}
            >
              <NumberInput
                value={hoaFees}
                onValueChange={(val) => { setHoaFees(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder="0"
                min={0}
                startIcon={<Building className="h-4 w-4" />}
              />
            </FormField>

            <FormField
              label={t("rent_vs_buy_calculator.maintenance_rate")}
              tooltip={t("rent_vs_buy_calculator.maintenance_tooltip")}
            >
              <NumberInput
                value={maintenanceRate}
                onValueChange={(val) => { setMaintenanceRate(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder="1"
                min={0}
                step={0.1}
                startIcon={<Wrench className="h-4 w-4" />}
              />
            </FormField>

            <FormField
              label={t("rent_vs_buy_calculator.appreciation_rate")}
              tooltip={t("rent_vs_buy_calculator.appreciation_tooltip")}
            >
              <NumberInput
                value={homeAppreciationRate}
                onValueChange={(val) => { setHomeAppreciationRate(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder="3"
                min={0}
                step={0.1}
                startIcon={<TrendingUp className="h-4 w-4" />}
              />
            </FormField>
          </div>
        </div>

        {/* Renting Inputs */}
        <div className="bg-card-bg border border-border rounded-lg p-4">
          <h3 className="font-medium mb-3">{t("rent_vs_buy_calculator.renting_section")}</h3>

          <div className="space-y-4">
            <FormField
              label={t("rent_vs_buy_calculator.monthly_rent")}
              tooltip={t("rent_vs_buy_calculator.rent_tooltip")}
            >
              <NumberInput
                value={monthlyRent}
                onValueChange={(val) => { setMonthlyRent(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder="1500"
                min={0}
                startIcon={<DollarSign className="h-4 w-4" />}
              />
            </FormField>

            <FormField
              label={t("rent_vs_buy_calculator.rent_increase_rate")}
              tooltip={t("rent_vs_buy_calculator.rent_increase_tooltip")}
            >
              <NumberInput
                value={rentIncreaseRate}
                onValueChange={(val) => { setRentIncreaseRate(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder="3"
                min={0}
                step={0.1}
                startIcon={<TrendingUp className="h-4 w-4" />}
              />
            </FormField>

            <FormField
              label={t("rent_vs_buy_calculator.renters_insurance")}
              tooltip={t("rent_vs_buy_calculator.renters_insurance_tooltip")}
            >
              <NumberInput
                value={rentersInsurance}
                onValueChange={(val) => { setRentersInsurance(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder="180"
                min={0}
                startIcon={<Shield className="h-4 w-4" />}
              />
            </FormField>

            <FormField
              label={t("rent_vs_buy_calculator.investment_return")}
              tooltip={t("rent_vs_buy_calculator.investment_tooltip")}
            >
              <NumberInput
                value={investmentReturnRate}
                onValueChange={(val) => { setInvestmentReturnRate(val.toString()); if (error) setError(''); }}
                onKeyPress={handleKeyPress}
                placeholder="7"
                min={0}
                step={0.1}
                startIcon={<TrendingUp className="h-4 w-4" />}
              />
            </FormField>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button
          onClick={calculate}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 mr-2" />
          {t("rent_vs_buy_calculator.calculate_btn")}
        </button>

        <button
          onClick={resetCalculator}
          className="outline-button min-w-[120px] flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          {t("rent_vs_buy_calculator.reset_btn")}
        </button>
      </div>

      {error && (
        <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn max-w-md mx-auto">
          <Info className="w-5 h-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("rent_vs_buy_calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("rent_vs_buy_calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("rent_vs_buy_calculator.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("rent_vs_buy_calculator.use_case_1")}</li>
              <li>{t("rent_vs_buy_calculator.use_case_2")}</li>
              <li>{t("rent_vs_buy_calculator.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      {/* Monthly Comparison */}
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("rent_vs_buy_calculator.monthly_comparison")}
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">{t("rent_vs_buy_calculator.buying")}</div>
            <div className="text-2xl font-bold text-primary" dir="ltr">${formatCurrency(result.totalMonthlyBuying)}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">{t("rent_vs_buy_calculator.renting")}</div>
            <div className="text-2xl font-bold text-blue-500" dir="ltr">${formatCurrency(result.totalMonthlyRenting)}</div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Break-even Analysis */}
      <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <h3 className="font-medium mb-2">{t("rent_vs_buy_calculator.breakeven_title")}</h3>
        <p className="text-foreground-70">
          {result.breakEvenYear !== null
            ? t("rent_vs_buy_calculator.breakeven_message", { years: result.breakEvenYear })
            : t("rent_vs_buy_calculator.no_breakeven")}
        </p>
      </div>

      {/* Recommendation */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
        <h3 className="font-medium mb-2">{t("rent_vs_buy_calculator.recommendation_title")}</h3>
        <p className="text-foreground-70">{result.recommendation}</p>
      </div>

      {/* Cost Comparison Over Time */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("rent_vs_buy_calculator.cost_over_time")}</h3>
        <div className="grid grid-cols-1 gap-4">
          {/* 5 Years */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("rent_vs_buy_calculator.after_5_years")}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-foreground-70">{t("rent_vs_buy_calculator.buying_cost")}:</div>
              <div dir="ltr">${formatCurrency(result.totalCost5Years.buying)}</div>
              <div className="text-foreground-70">{t("rent_vs_buy_calculator.renting_cost")}:</div>
              <div dir="ltr">${formatCurrency(result.totalCost5Years.renting)}</div>
              <div className="text-foreground-70">{t("rent_vs_buy_calculator.net_difference")}:</div>
              <div className={result.totalCost5Years.difference >= 0 ? 'text-green-600' : 'text-red-600'} dir="ltr">
                ${formatCurrency(Math.abs(result.totalCost5Years.difference))}
              </div>
            </div>
          </div>

          {/* 10 Years */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("rent_vs_buy_calculator.after_10_years")}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-foreground-70">{t("rent_vs_buy_calculator.buying_cost")}:</div>
              <div dir="ltr">${formatCurrency(result.totalCost10Years.buying)}</div>
              <div className="text-foreground-70">{t("rent_vs_buy_calculator.renting_cost")}:</div>
              <div dir="ltr">${formatCurrency(result.totalCost10Years.renting)}</div>
              <div className="text-foreground-70">{t("rent_vs_buy_calculator.net_difference")}:</div>
              <div className={result.totalCost10Years.difference >= 0 ? 'text-green-600' : 'text-red-600'} dir="ltr">
                ${formatCurrency(Math.abs(result.totalCost10Years.difference))}
              </div>
            </div>
          </div>

          {/* 15 Years */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("rent_vs_buy_calculator.after_15_years")}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-foreground-70">{t("rent_vs_buy_calculator.buying_cost")}:</div>
              <div dir="ltr">${formatCurrency(result.totalCost15Years.buying)}</div>
              <div className="text-foreground-70">{t("rent_vs_buy_calculator.renting_cost")}:</div>
              <div dir="ltr">${formatCurrency(result.totalCost15Years.renting)}</div>
              <div className="text-foreground-70">{t("rent_vs_buy_calculator.net_difference")}:</div>
              <div className={result.totalCost15Years.difference >= 0 ? 'text-green-600' : 'text-red-600'} dir="ltr">
                ${formatCurrency(Math.abs(result.totalCost15Years.difference))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="mt-6 space-y-4">
        <h3 className="font-medium mb-3">{t("rent_vs_buy_calculator.monthly_breakdown")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("rent_vs_buy_calculator.mortgage_payment")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">${formatCurrency(result.monthlyMortgage)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <FileText className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("rent_vs_buy_calculator.property_tax")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">${formatCurrency(result.monthlyPropertyTax)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("rent_vs_buy_calculator.insurance")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">${formatCurrency(result.monthlyHomeInsurance)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Wrench className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("rent_vs_buy_calculator.maintenance")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">${formatCurrency(result.monthlyMaintenance)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("rent_vs_buy_calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("rent_vs_buy_calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("rent_vs_buy_calculator.title")}
      description={t("rent_vs_buy_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
