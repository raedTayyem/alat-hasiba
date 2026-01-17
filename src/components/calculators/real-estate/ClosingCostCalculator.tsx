'use client';

/**
 * CLOSING COST CALCULATOR
 * Calculates total closing costs for a real estate purchase
 * - Typical closing costs: 2-5% of purchase price
 * - Breakdown: Title, Appraisal, Attorney, Recording, Transfer Tax, Lender Fees
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Percent, FileText, Briefcase, Stamp, Building, Info, FileCheck, Landmark } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

interface CalculatorInputs {
  purchasePrice: number;
  loanAmount: number;
  titleFee: number;
  appraisalFee: number;
  attorneyFee: number;
  recordingFee: number;
  transferTaxRate: number;
  lenderFeePercent: number;
}

interface CalculatorResult {
  totalClosingCosts: number;
  closingCostPercent: number;
  titleFee: number;
  appraisalFee: number;
  attorneyFee: number;
  recordingFee: number;
  transferTax: number;
  lenderFees: number;
  totalCashNeeded: number;
  downPayment: number;
}

const DEFAULT_VALUES: CalculatorInputs = {
  purchasePrice: 300000,
  loanAmount: 240000,
  titleFee: 1000,
  appraisalFee: 400,
  attorneyFee: 1000,
  recordingFee: 200,
  transferTaxRate: 1.0,
  lenderFeePercent: 1.0,
};

export default function ClosingCostCalculator() {
  const { t, i18n } = useTranslation('calc/real-estate');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [titleFee, setTitleFee] = useState<string>('1000');
  const [appraisalFee, setAppraisalFee] = useState<string>('400');
  const [attorneyFee, setAttorneyFee] = useState<string>('1000');
  const [recordingFee, setRecordingFee] = useState<string>('200');
  const [transferTaxRate, setTransferTaxRate] = useState<string>('1.0');
  const [lenderFeePercent, setLenderFeePercent] = useState<string>('1.0');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const price = parseFloat(purchasePrice);
    const loan = parseFloat(loanAmount);
    const title = parseFloat(titleFee);
    const appraisal = parseFloat(appraisalFee);
    const attorney = parseFloat(attorneyFee);
    const recording = parseFloat(recordingFee);
    const transferTax = parseFloat(transferTaxRate);
    const lenderFee = parseFloat(lenderFeePercent);

    if (isNaN(price) || isNaN(loan) || isNaN(title) || isNaN(appraisal) ||
        isNaN(attorney) || isNaN(recording) || isNaN(transferTax) || isNaN(lenderFee)) {
      setError(t("closing_cost_calculator.invalid_input") || t("calculators.invalid_input"));
      return false;
    }

    if (price <= 0) {
      setError(t("closing_cost_calculator.price_required"));
      return false;
    }

    if (loan < 0 || loan > price) {
      setError(t("closing_cost_calculator.loan_invalid"));
      return false;
    }

    if (title < 0 || appraisal < 0 || attorney < 0 || recording < 0) {
      setError(t("closing_cost_calculator.fees_positive"));
      return false;
    }

    if (transferTax < 0 || transferTax > 10) {
      setError(t("closing_cost_calculator.transfer_tax_range"));
      return false;
    }

    if (lenderFee < 0 || lenderFee > 5) {
      setError(t("closing_cost_calculator.lender_fee_range"));
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
        const price = parseFloat(purchasePrice);
        const loan = parseFloat(loanAmount);
        const title = parseFloat(titleFee);
        const appraisal = parseFloat(appraisalFee);
        const attorney = parseFloat(attorneyFee);
        const recording = parseFloat(recordingFee);
        const transferTax = parseFloat(transferTaxRate) / 100;
        const lenderFee = parseFloat(lenderFeePercent) / 100;

        // Calculate fees
        const transferTaxAmount = price * transferTax;
        const lenderFeesAmount = loan * lenderFee;

        // Total closing costs
        const totalClosingCosts = title + appraisal + attorney + recording +
                                  transferTaxAmount + lenderFeesAmount;

        // Closing cost as percentage of purchase price
        const closingCostPercent = (totalClosingCosts / price) * 100;

        // Down payment
        const downPayment = price - loan;

        // Total cash needed at closing
        const totalCashNeeded = downPayment + totalClosingCosts;

        setResult({
          totalClosingCosts,
          closingCostPercent,
          titleFee: title,
          appraisalFee: appraisal,
          attorneyFee: attorney,
          recordingFee: recording,
          transferTax: transferTaxAmount,
          lenderFees: lenderFeesAmount,
          totalCashNeeded,
          downPayment,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("closing_cost_calculator.calculation_error") || t("calculators.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setPurchasePrice('');
      setLoanAmount('');
      setTitleFee('1000');
      setAppraisalFee('400');
      setAttorneyFee('1000');
      setRecordingFee('200');
      setTransferTaxRate('1.0');
      setLenderFeePercent('1.0');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPercent = (num: number): string => {
    return num.toFixed(2);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("closing_cost_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("closing_cost_calculator.purchase_price")}
          tooltip={t("closing_cost_calculator.purchase_price_tooltip")}
        >
          <NumberInput
            value={purchasePrice}
            onValueChange={(val) => setPurchasePrice(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="300000"
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("closing_cost_calculator.loan_amount")}
          tooltip={t("closing_cost_calculator.loan_amount_tooltip")}
        >
          <NumberInput
            value={loanAmount}
            onValueChange={(val) => setLoanAmount(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="240000"
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("closing_cost_calculator.title_fee")}
          tooltip={t("closing_cost_calculator.title_fee_tooltip")}
        >
          <NumberInput
            value={titleFee}
            onValueChange={(val) => setTitleFee(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="1000"
            min={0}
            startIcon={<FileText className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("closing_cost_calculator.appraisal_fee")}
          tooltip={t("closing_cost_calculator.appraisal_fee_tooltip")}
        >
          <NumberInput
            value={appraisalFee}
            onValueChange={(val) => setAppraisalFee(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="400"
            min={0}
            startIcon={<Stamp className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("closing_cost_calculator.attorney_fee")}
          tooltip={t("closing_cost_calculator.attorney_fee_tooltip")}
        >
          <NumberInput
            value={attorneyFee}
            onValueChange={(val) => setAttorneyFee(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="1000"
            min={0}
            startIcon={<Briefcase className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("closing_cost_calculator.recording_fee")}
          tooltip={t("closing_cost_calculator.recording_fee_tooltip")}
        >
          <NumberInput
            value={recordingFee}
            onValueChange={(val) => setRecordingFee(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="200"
            min={0}
            startIcon={<FileCheck className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("closing_cost_calculator.transfer_tax_rate")}
          tooltip={t("closing_cost_calculator.transfer_tax_tooltip")}
        >
          <NumberInput
            value={transferTaxRate}
            onValueChange={(val) => setTransferTaxRate(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="1.0"
            min={0}
            step={0.1}
            startIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("closing_cost_calculator.lender_fee_percent")}
          tooltip={t("closing_cost_calculator.lender_fee_tooltip")}
        >
          <NumberInput
            value={lenderFeePercent}
            onValueChange={(val) => setLenderFeePercent(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="1.0"
            min={0}
            step={0.1}
            startIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button
          onClick={calculate}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 mr-2" />
          {t("closing_cost_calculator.calculate_btn")}
        </button>

        <button
          onClick={resetCalculator}
          className="outline-button min-w-[120px] flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          {t("closing_cost_calculator.reset_btn")}
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
              {t("closing_cost_calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("closing_cost_calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("closing_cost_calculator.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("closing_cost_calculator.use_case_1")}</li>
              <li>{t("closing_cost_calculator.use_case_2")}</li>
              <li>{t("closing_cost_calculator.use_case_3")}</li>
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
          {t("closing_cost_calculator.total_closing_costs")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">
          ${formatCurrency(result.totalClosingCosts)}
        </div>
        <div className="text-lg text-foreground-70" dir="ltr">
          {formatPercent(result.closingCostPercent)}% {t("closing_cost_calculator.of_purchase_price")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("closing_cost_calculator.cost_breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <FileText className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("closing_cost_calculator.title_fee_label")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.titleFee)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Stamp className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("closing_cost_calculator.appraisal_fee_label")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.appraisalFee)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Briefcase className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("closing_cost_calculator.attorney_fee_label")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.attorneyFee)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <FileCheck className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("closing_cost_calculator.recording_fee_label")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.recordingFee)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Building className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("closing_cost_calculator.transfer_tax_label")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.transferTax)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Landmark className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("closing_cost_calculator.lender_fees_label")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.lenderFees)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("closing_cost_calculator.down_payment_label")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.downPayment)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("closing_cost_calculator.total_cash_needed")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.totalCashNeeded)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("closing_cost_calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("closing_cost_calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("closing_cost_calculator.title")}
      description={t("closing_cost_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
