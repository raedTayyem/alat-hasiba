'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Percent, Calendar, FileText, Shield, AlertCircle, TrendingUp } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function AdvancedMortgageCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [propertyTax, setPropertyTax] = useState<string>('');
  const [insurance, setInsurance] = useState<string>('');
  const [pmi, setPmi] = useState<string>('');
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    principalAmount: number;
    monthlyPrincipalInterest: number;
    monthlyPropertyTax: number;
    monthlyInsurance: number;
    monthlyPMI: number;
    amortizationSchedule: Array<{
      month: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }>;
  } | null>(null);

  const calculate = () => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseFloat(loanTerm) || 0;
    const down = parseFloat(downPayment) || 0;
    const tax = parseFloat(propertyTax) || 0;
    const ins = parseFloat(insurance) || 0;
    const pmiRate = parseFloat(pmi) || 0;

    if (!principal || !rate || !years) return;

    const loanPrincipal = principal - down;
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;

    // Calculate monthly principal + interest payment
    const monthlyPI = loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

    // Calculate other monthly costs
    const monthlyTax = tax / 12;
    const monthlyIns = ins / 12;
    const monthlyPMI = (loanPrincipal * pmiRate / 100) / 12;

    // Total monthly payment
    const monthlyPayment = monthlyPI + monthlyTax + monthlyIns + monthlyPMI;

    // Generate amortization schedule
    const schedule = [];
    let balance = loanPrincipal;

    for (let month = 1; month <= numPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPI - interestPayment;
      balance -= principalPayment;

      if (month <= 12 || month % 12 === 0 || month === numPayments) {
        schedule.push({
          month,
          payment: monthlyPI,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance)
        });
      }
    }

    const totalPayment = monthlyPI * numPayments;
    const totalInterest = totalPayment - loanPrincipal;

    setResult({
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalPayment: parseFloat(totalPayment.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      principalAmount: parseFloat(loanPrincipal.toFixed(2)),
      monthlyPrincipalInterest: parseFloat(monthlyPI.toFixed(2)),
      monthlyPropertyTax: parseFloat(monthlyTax.toFixed(2)),
      monthlyInsurance: parseFloat(monthlyIns.toFixed(2)),
      monthlyPMI: parseFloat(monthlyPMI.toFixed(2)),
      amortizationSchedule: schedule
    });
  };

  const reset = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanTerm('');
    setDownPayment('');
    setPropertyTax('');
    setInsurance('');
    setPmi('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("advanced_mortgage_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("advanced_mortgage_calculator.loan_amount")}
          tooltip={t("advanced_mortgage_calculator.loan_amount_tooltip")}
        >
          <NumberInput
            value={loanAmount}
            onValueChange={(val) => setLoanAmount(val.toString())}
            placeholder={t("advanced_mortgage_calculator.enter_loan_amount")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("advanced_mortgage_calculator.down_payment")}
          tooltip={t("advanced_mortgage_calculator.down_payment_tooltip")}
        >
          <NumberInput
            value={downPayment}
            onValueChange={(val) => setDownPayment(val.toString())}
            placeholder={t("advanced_mortgage_calculator.enter_down_payment")}
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("advanced_mortgage_calculator.interest_rate")}
          tooltip={t("advanced_mortgage_calculator.interest_rate_tooltip")}
        >
          <NumberInput
            value={interestRate}
            onValueChange={(val) => setInterestRate(val.toString())}
            placeholder={t("advanced_mortgage_calculator.enter_interest_rate")}
            min={0}
            step={0.1}
            startIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("advanced_mortgage_calculator.loan_term")}
          tooltip={t("advanced_mortgage_calculator.loan_term_tooltip")}
        >
          <NumberInput
            value={loanTerm}
            onValueChange={(val) => setLoanTerm(val.toString())}
            placeholder={t("advanced_mortgage_calculator.enter_loan_term")}
            min={1}
            max={30}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("advanced_mortgage_calculator.property_tax")}
          tooltip={t("advanced_mortgage_calculator.property_tax_tooltip")}
        >
          <NumberInput
            value={propertyTax}
            onValueChange={(val) => setPropertyTax(val.toString())}
            placeholder={t("advanced_mortgage_calculator.enter_property_tax")}
            min={0}
            startIcon={<FileText className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("advanced_mortgage_calculator.insurance")}
          tooltip={t("advanced_mortgage_calculator.insurance_tooltip")}
        >
          <NumberInput
            value={insurance}
            onValueChange={(val) => setInsurance(val.toString())}
            placeholder={t("advanced_mortgage_calculator.enter_insurance")}
            min={0}
            startIcon={<Shield className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("advanced_mortgage_calculator.pmi")}
          tooltip={t("advanced_mortgage_calculator.pmi_tooltip")}
        >
          <NumberInput
            value={pmi}
            onValueChange={(val) => setPmi(val.toString())}
            placeholder={t("advanced_mortgage_calculator.enter_pmi")}
            min={0}
            step={0.1}
            startIcon={<AlertCircle className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("advanced_mortgage_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("advanced_mortgage_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("advanced_mortgage_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("advanced_mortgage_calculator.monthly_payment")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            {result.monthlyPayment.toLocaleString()} {t("advanced_mortgage_calculator.currency")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("advanced_mortgage_calculator.monthly_principal_interest")}
            </div>
            <div className="text-xl font-bold">
              {result.monthlyPrincipalInterest.toLocaleString()} {t("advanced_mortgage_calculator.currency")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("advanced_mortgage_calculator.monthly_property_tax")}
            </div>
            <div className="text-xl font-bold">
              {result.monthlyPropertyTax.toLocaleString()} {t("advanced_mortgage_calculator.currency")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("advanced_mortgage_calculator.monthly_insurance")}
            </div>
            <div className="text-xl font-bold">
              {result.monthlyInsurance.toLocaleString()} {t("advanced_mortgage_calculator.currency")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("advanced_mortgage_calculator.monthly_pmi")}
            </div>
            <div className="text-xl font-bold">
              {result.monthlyPMI.toLocaleString()} {t("advanced_mortgage_calculator.currency")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("advanced_mortgage_calculator.total_payment")}
            </div>
            <div className="text-xl font-bold">
              {result.totalPayment.toLocaleString()} {t("advanced_mortgage_calculator.currency")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1">
              {t("advanced_mortgage_calculator.total_interest")}
            </div>
            <div className="text-xl font-bold text-red-600">
              {result.totalInterest.toLocaleString()} {t("advanced_mortgage_calculator.currency")}
            </div>
          </div>
        </div>

        {result.amortizationSchedule.length > 0 && (
          <div className="mt-4">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t("advanced_mortgage_calculator.amortization_schedule")}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-foreground/5">
                  <tr>
                    <th className="p-2 text-right">{t("advanced_mortgage_calculator.month")}</th>
                    <th className="p-2 text-right">{t("advanced_mortgage_calculator.payment")}</th>
                    <th className="p-2 text-right">{t("advanced_mortgage_calculator.principal")}</th>
                    <th className="p-2 text-right">{t("advanced_mortgage_calculator.interest")}</th>
                    <th className="p-2 text-right">{t("advanced_mortgage_calculator.balance")}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.amortizationSchedule.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="border-t border-border hover:bg-foreground/5 transition-colors">
                      <td className="p-2">{row.month}</td>
                      <td className="p-2">{row.payment.toFixed(2)}</td>
                      <td className="p-2">{row.principal.toFixed(2)}</td>
                      <td className="p-2">{row.interest.toFixed(2)}</td>
                      <td className="p-2">{row.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">
              {t("advanced_mortgage_calculator.tips_title")}
            </h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("advanced_mortgage_calculator.tip_1")}</li>
              <li>{t("advanced_mortgage_calculator.tip_2")}</li>
              <li>{t("advanced_mortgage_calculator.tip_3")}</li>
              <li>{t("advanced_mortgage_calculator.tip_4")}</li>
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
        {t("advanced_mortgage_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("advanced_mortgage_calculator.title")}
      description={t("advanced_mortgage_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("advanced_mortgage_calculator.footer_note")}
     className="rtl" />
  );
}
