'use client';

/**
 * Loan Amortization Calculator
 *
 * Calculates loan payment schedule with full amortization table
 * Formula: PMT = P * r(1+r)^n / ((1+r)^n - 1)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Calendar, Percent, Calculator, TrendingUp, ChevronDown, ChevronUp } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface CalculatorResult {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  schedule: AmortizationRow[];
}

export default function LoanAmortizationCalculator() {
  const { t } = useTranslation('calc/business');
  const [principal, setPrincipal] = useState<string>('');
  const [annualRate, setAnnualRate] = useState<string>('');
  const [termMonths, setTermMonths] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const p = parseFloat(principal);
    const r = parseFloat(annualRate);
    const n = parseFloat(termMonths);

    if (isNaN(p) || isNaN(r) || isNaN(n)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (p <= 0 || n <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (r < 0) {
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
        const P = parseFloat(principal);
        const annualInterest = parseFloat(annualRate) / 100;
        const n = parseInt(termMonths);

        let monthlyPayment: number;
        const schedule: AmortizationRow[] = [];
        let totalInterest = 0;

        if (annualInterest === 0) {
          // No interest case
          monthlyPayment = P / n;
          let balance = P;

          for (let month = 1; month <= n; month++) {
            const principalPortion = monthlyPayment;
            balance -= principalPortion;

            schedule.push({
              month,
              payment: monthlyPayment,
              principal: principalPortion,
              interest: 0,
              balance: Math.max(0, balance),
            });
          }
        } else {
          // Standard amortization formula: PMT = P * r(1+r)^n / ((1+r)^n - 1)
          const r = annualInterest / 12; // Monthly interest rate
          const rPlusOne = 1 + r;
          const rPlusOnePowN = Math.pow(rPlusOne, n);

          monthlyPayment = P * (r * rPlusOnePowN) / (rPlusOnePowN - 1);

          let balance = P;

          for (let month = 1; month <= n; month++) {
            const interestPortion = balance * r;
            const principalPortion = monthlyPayment - interestPortion;
            balance -= principalPortion;

            totalInterest += interestPortion;

            schedule.push({
              month,
              payment: monthlyPayment,
              principal: principalPortion,
              interest: interestPortion,
              balance: Math.max(0, balance),
            });
          }
        }

        const totalPayments = monthlyPayment * n;

        setResult({
          monthlyPayment,
          totalPayments,
          totalInterest,
          schedule,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setShowFullSchedule(false);
    setTimeout(() => {
      setPrincipal('');
      setAnnualRate('');
      setTermMonths('');
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
      <div className="text-2xl font-bold mb-6 text-center">
        {t("loan_amortization.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("loan_amortization.principal")}
          tooltip={t("loan_amortization.principal_tooltip")}
        >
          <NumberInput
            value={principal}
            onValueChange={(val) => {
              setPrincipal(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("loan_amortization.principal_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("loan_amortization.interest_rate")}
          tooltip={t("loan_amortization.interest_rate_tooltip")}
        >
          <NumberInput
            value={annualRate}
            onValueChange={(val) => {
              setAnnualRate(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("loan_amortization.interest_rate_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            min={0}
            step={0.1}
          />
        </FormField>

        <FormField
          label={t("loan_amortization.term")}
          tooltip={t("loan_amortization.term_tooltip")}
        >
          <NumberInput
            value={termMonths}
            onValueChange={(val) => {
              setTermMonths(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("loan_amortization.term_placeholder")}
            startIcon={<Calendar className="h-4 w-4" />}
            min={1}
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
              {t("loan_amortization.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("loan_amortization.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("loan_amortization.info.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("loan_amortization.info.use_case_1")}</li>
              <li>{t("loan_amortization.info.use_case_2")}</li>
              <li>{t("loan_amortization.info.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const displayedSchedule = showFullSchedule ? result?.schedule : result?.schedule.slice(0, 12);

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("loan_amortization.results.monthly_payment")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          ${formatNumber(result.monthlyPayment)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("loan_amortization.results.per_month")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("loan_amortization.results.summary")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("loan_amortization.results.total_payments")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.totalPayments)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-error ml-2" />
              <div className="font-medium">{t("loan_amortization.results.total_interest")}</div>
            </div>
            <div className="text-2xl font-bold text-error">${formatNumber(result.totalInterest)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-3">
          {t("loan_amortization.results.amortization_schedule")}
        </h3>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-center">{t("loan_amortization.results.month")}</TableHead>
                <TableHead className="text-center">{t("loan_amortization.results.payment")}</TableHead>
                <TableHead className="text-center">{t("loan_amortization.results.principal")}</TableHead>
                <TableHead className="text-center">{t("loan_amortization.results.interest")}</TableHead>
                <TableHead className="text-center">{t("loan_amortization.results.balance")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedSchedule?.map((row) => (
                <TableRow key={row.month}>
                  <TableCell className="text-center font-medium">{row.month}</TableCell>
                  <TableCell className="text-center">${formatNumber(row.payment)}</TableCell>
                  <TableCell className="text-center text-success">${formatNumber(row.principal)}</TableCell>
                  <TableCell className="text-center text-error">${formatNumber(row.interest)}</TableCell>
                  <TableCell className="text-center">${formatNumber(row.balance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {result.schedule.length > 12 && (
          <button
            onClick={() => setShowFullSchedule(!showFullSchedule)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            {showFullSchedule ? (
              <>
                <ChevronUp className="w-4 h-4" />
                {t("loan_amortization.results.show_less")}
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                {t("loan_amortization.results.show_all", { count: result.schedule.length })}
              </>
            )}
          </button>
        )}
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("loan_amortization.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("loan_amortization.results.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("loan_amortization.title")}
      description={t("loan_amortization.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
