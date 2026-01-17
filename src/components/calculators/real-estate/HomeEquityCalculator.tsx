'use client';

/** HOME EQUITY CALCULATOR - Equity = Current Value - Remaining Mortgage */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Percent, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult { equity: number; equityPercent: number; availableHELOC: number; loanToValue: number; }

export default function HomeEquityCalculator() {
  const { t, i18n } = useTranslation('calc/real-estate');
  const [currentValue, setCurrentValue] = useState<string>('');
  const [remainingMortgage, setRemainingMortgage] = useState<string>('');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => { initDateInputRTL(); }, []);

  const calculate = () => {
    const value = parseFloat(currentValue);
    const mortgage = parseFloat(remainingMortgage);

    if (isNaN(value) || isNaN(mortgage) || value <= 0 || mortgage < 0) {
      setError(t("calculators.invalid_input"));
      return;
    }

    setShowResult(false);
    setTimeout(() => {
      const equity = value - mortgage;
      const equityPercent = (equity / value) * 100;
      const availableHELOC = (value * 0.85) - mortgage;
      const loanToValue = (mortgage / value) * 100;

      setResult({ equity, equityPercent, availableHELOC: Math.max(0, availableHELOC), loanToValue });
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => { setCurrentValue(''); setRemainingMortgage(''); setResult(null); setError(''); }, 300);
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
      <div className="calculator-section-title">{t("home_equity_calculator.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("home_equity_calculator.current_value")}
          tooltip={t("home_equity_calculator.current_value_tooltip")}
        >
          <NumberInput
            value={currentValue}
            onValueChange={(val) => {
              setCurrentValue(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="400000"
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>
        <FormField
          label={t("home_equity_calculator.remaining_mortgage")}
          tooltip={t("home_equity_calculator.remaining_mortgage_tooltip")}
        >
          <NumberInput
            value={remainingMortgage}
            onValueChange={(val) => {
              setRemainingMortgage(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="250000"
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>
      </div>
      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0">
          <Calculator className="w-4 h-4 mr-2" />
          {t("home_equity_calculator.calculate_btn")}
        </button>
        <button onClick={resetCalculator} className="outline-button min-w-[120px] flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("home_equity_calculator.reset_btn")}
        </button>
      </div>
      {error && (
        <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn max-w-md mx-auto">
          <Info className="w-5 h-5 ml-2 flex-shrink-0" />
          {error}
        </div>
      )}
      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("home_equity_calculator.info_title")}</h2>
            <p className="text-foreground-70 mb-3">{t("home_equity_calculator.info_description")}</p>
          </div>
          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("home_equity_calculator.use_cases_title")}</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("home_equity_calculator.use_case_1")}</li>
              <li>{t("home_equity_calculator.use_case_2")}</li>
              <li>{t("home_equity_calculator.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("home_equity_calculator.equity_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">${formatCurrency(result.equity)}</div>
        <div className="text-lg text-foreground-70">{formatPercent(result.equityPercent)}% {t("home_equity_calculator.of_value")}</div>
      </div>
      <div className="divider my-6"></div>
      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("home_equity_calculator.details")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("home_equity_calculator.available_heloc")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">${formatCurrency(result.availableHELOC)}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("home_equity_calculator.ltv")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">{formatPercent(result.loanToValue)}%</div>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("home_equity_calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">{t("home_equity_calculator.formula_explanation")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("home_equity_calculator.title")}
      description={t("home_equity_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
