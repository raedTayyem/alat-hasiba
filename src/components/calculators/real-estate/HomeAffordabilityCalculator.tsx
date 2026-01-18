'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Percent, Clock, Info, CheckCircle, AlertTriangle } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function HomeAffordabilityCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [annualIncome, setAnnualIncome] = useState<string>('');
  const [monthlyDebts, setMonthlyDebts] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('5');
  const [loanTerm, setLoanTerm] = useState<string>('20');
  const [result, setResult] = useState<{
    maxHomePrice: number;
    maxLoanAmount: number;
    maxMonthlyPayment: number;
    dtiRatio: number;
    recommendedDownPayment: number;
  } | null>(null);

  const calculate = () => {
    const income = parseFloat(annualIncome) || 0;
    const debts = parseFloat(monthlyDebts) || 0;
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseFloat(loanTerm) || 0;

    if (!income || !rate || !years) return;

    const monthlyIncome = income / 12;

    // DTI ratio - typically 43% maximum
    const maxDTI = 0.43;
    const maxMonthlyPayment = (monthlyIncome * maxDTI) - debts;

    if (maxMonthlyPayment <= 0) {
      setResult({
        maxHomePrice: 0,
        maxLoanAmount: 0,
        maxMonthlyPayment: 0,
        dtiRatio: (debts / monthlyIncome) * 100,
        recommendedDownPayment: 0
      });
      return;
    }

    // Calculate maximum loan amount based on monthly payment
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    const maxLoan = maxMonthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

    // Maximum home price
    const maxHomePrice = maxLoan + down;

    // Recommended down payment (20% of home price)
    const recommendedDown = maxHomePrice * 0.20;

    setResult({
      maxHomePrice: parseFloat(maxHomePrice.toFixed(2)),
      maxLoanAmount: parseFloat(maxLoan.toFixed(2)),
      maxMonthlyPayment: parseFloat(maxMonthlyPayment.toFixed(2)),
      dtiRatio: parseFloat(((debts / monthlyIncome) * 100).toFixed(2)),
      recommendedDownPayment: parseFloat(recommendedDown.toFixed(2))
    });
  };

  const reset = () => {
    setAnnualIncome('');
    setMonthlyDebts('');
    setDownPayment('');
    setInterestRate('5');
    setLoanTerm('20');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("home_affordability_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("home_affordability_calculator.annual_income")}
          tooltip={t("home_affordability_calculator.annual_income_tooltip")}
        >
          <NumberInput
            value={annualIncome}
            onValueChange={(val) => setAnnualIncome(val.toString())}
            placeholder={t("home_affordability_calculator.enter_annual_income")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("home_affordability_calculator.monthly_debts")}
          tooltip={t("home_affordability_calculator.monthly_debts_tooltip")}
        >
          <NumberInput
            value={monthlyDebts}
            onValueChange={(val) => setMonthlyDebts(val.toString())}
            placeholder={t("home_affordability_calculator.enter_monthly_debts")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("home_affordability_calculator.down_payment")}
          tooltip={t("home_affordability_calculator.down_payment_tooltip")}
        >
          <NumberInput
            value={downPayment}
            onValueChange={(val) => setDownPayment(val.toString())}
            placeholder={t("home_affordability_calculator.enter_down_payment")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("home_affordability_calculator.interest_rate")}
          tooltip={t("home_affordability_calculator.interest_rate_tooltip")}
        >
          <NumberInput
            value={interestRate}
            onValueChange={(val) => setInterestRate(val.toString())}
            placeholder={t("home_affordability_calculator.enter_interest_rate")}
            min={0}
            step={0.1}
            startIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("home_affordability_calculator.loan_term")}
          tooltip={t("home_affordability_calculator.loan_term_tooltip")}
        >
          <NumberInput
            value={loanTerm}
            onValueChange={(val) => setLoanTerm(val.toString())}
            placeholder={t("home_affordability_calculator.enter_loan_term")}
            min={1}
            max={30}
            startIcon={<Clock className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("home_affordability_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("home_affordability_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("home_affordability_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("home_affordability_calculator.max_home_price")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.maxHomePrice.toLocaleString()} {t("home_affordability_calculator.currency")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("home_affordability_calculator.max_loan_amount")}
            </div>
            <div className="text-xl font-bold">
              {result.maxLoanAmount.toLocaleString()} {t("home_affordability_calculator.currency")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("home_affordability_calculator.max_monthly_payment")}
            </div>
            <div className="text-xl font-bold">
              {result.maxMonthlyPayment.toLocaleString()} {t("home_affordability_calculator.currency")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("home_affordability_calculator.dti_ratio")}
            </div>
            <div className={`text-xl font-bold flex items-center ${result.dtiRatio > 43 ? 'text-red-600' : 'text-green-600'}`}>
              {result.dtiRatio}%
              {result.dtiRatio > 43 ? (
                <AlertTriangle className="w-4 h-4 ml-2" />
              ) : (
                <CheckCircle className="w-4 h-4 ml-2" />
              )}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("home_affordability_calculator.recommended_down_payment")}
            </div>
            <div className="text-xl font-bold">
              {result.recommendedDownPayment.toLocaleString()} {t("home_affordability_calculator.currency")}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">
              {t("home_affordability_calculator.tips_title")}
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("home_affordability_calculator.tip_dti")}</li>
              <li>{t("home_affordability_calculator.tip_down_payment")}</li>
              <li>{t("home_affordability_calculator.tip_emergency")}</li>
              <li>{t("home_affordability_calculator.tip_costs")}</li>
              <li>{t("home_affordability_calculator.tip_pre_approval")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Calculator className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">
        {t("home_affordability_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("home_affordability_calculator.title")}
      description={t("home_affordability_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("home_affordability_calculator.footer_note")}
     className="rtl" />
  );
}
