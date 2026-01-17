'use client';

/** DOWN PAYMENT CALCULATOR - LTV, PMI Requirements */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Percent, Info, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

interface CalculatorResult {
  downPayment: number;
  loanAmount: number;
  ltv: number;
  needsPMI: boolean;
  pmiEstimate: number;
}

export default function DownPaymentCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [homePrice, setHomePrice] = useState<string>('');
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>('20');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    const price = parseFloat(homePrice);
    const percent = parseFloat(downPaymentPercent);

    if (isNaN(price) || isNaN(percent) || price <= 0 || percent < 0 || percent > 100) {
      setError(t("calculators.invalid_input"));
      return;
    }

    setShowResult(false);
    setTimeout(() => {
      const downPayment = (price * percent) / 100;
      const loanAmount = price - downPayment;
      const ltv = (loanAmount / price) * 100;
      const needsPMI = ltv > 80;
      const pmiEstimate = needsPMI ? (loanAmount * 0.005) / 12 : 0;

      setResult({ downPayment, loanAmount, ltv, needsPMI, pmiEstimate });
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setHomePrice('');
      setDownPaymentPercent('20');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatCurrency = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatPercent = (num: number) => num.toFixed(2);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("down_payment_calculator.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("down_payment_calculator.home_price")}
          tooltip={t("down_payment_calculator.home_price_tooltip")}
        >
          <NumberInput
            value={homePrice}
            onValueChange={(val) => {
              setHomePrice(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="300000"
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("down_payment_calculator.down_percent")}
          tooltip={t("down_payment_calculator.down_percent_tooltip")}
        >
          <NumberInput
            value={downPaymentPercent}
            onValueChange={(val) => {
              setDownPaymentPercent(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="20"
            min={0}
            max={100}
            startIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>
      </div>
      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("down_payment_calculator.calculate_btn")}
        </button>
        <button onClick={resetCalculator} className="outline-button min-w-[120px] flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("down_payment_calculator.reset_btn")}
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
            <h2 className="font-bold mb-2 text-lg">{t("down_payment_calculator.info_title")}</h2>
            <p className="text-foreground-70 mb-3">{t("down_payment_calculator.info_description")}</p>
          </div>
          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("down_payment_calculator.use_cases_title")}</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("down_payment_calculator.use_case_1")}</li>
              <li>{t("down_payment_calculator.use_case_2")}</li>
              <li>{t("down_payment_calculator.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("down_payment_calculator.down_payment_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">${formatCurrency(result.downPayment)}</div>
        <div className="text-lg text-foreground-70">{formatPercent(parseFloat(downPaymentPercent))}% {t("down_payment_calculator.of_price")}</div>
      </div>
      <div className="divider my-6"></div>
      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("down_payment_calculator.details")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("down_payment_calculator.loan_amount")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">${formatCurrency(result.loanAmount)}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("down_payment_calculator.ltv")}</div>
            </div>
            <div className={`text-sm font-bold ${result.ltv > 80 ? 'text-orange-600' : 'text-green-600'}`} dir="ltr">{formatPercent(result.ltv)}%</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border col-span-1 sm:col-span-2">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("down_payment_calculator.pmi_status")}</div>
            </div>
            <div className="text-sm text-foreground-70 flex items-center">
              {result.needsPMI ? (
                <>
                  <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                  <span className="text-orange-600">{t("down_payment_calculator.pmi_required")} ~$${formatCurrency(result.pmiEstimate)}/mo</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-green-600">{t("down_payment_calculator.no_pmi")}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("down_payment_calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">{t("down_payment_calculator.formula_explanation")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("down_payment_calculator.title")}
      description={t("down_payment_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
