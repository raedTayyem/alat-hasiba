'use client';

/** Debt-to-Equity Ratio Calculator - Formula: Total Debt / Total Equity */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, AlertTriangle } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

export default function DebtToEquityCalculator() {
  const { t } = useTranslation(['calc/business', 'common']);
  const [totalDebt, setTotalDebt] = useState<string>('');
  const [totalEquity, setTotalEquity] = useState<string>('');
  const [result, setResult] = useState<{ratio: number; risk: string} | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { initDateInputRTL(); }, []);

  const calculate = () => {
    const debt = parseFloat(totalDebt);
    const equity = parseFloat(totalEquity);
    if (isNaN(debt) || isNaN(equity) || equity === 0) { setError(t("errors.invalid_input")); return; }
    setShowResult(false);
    setTimeout(() => {
      const ratio = debt / equity;
      const risk = ratio > 2 ? t("debt_to_equity.results.high_risk") : ratio > 1 ? t("debt_to_equity.results.moderate_risk") : t("debt_to_equity.results.low_risk");
      setResult({ ratio, risk });
      setShowResult(true);
    }, 300);
  };

  const reset = () => { setShowResult(false); setTimeout(() => { setTotalDebt(''); setTotalEquity(''); setResult(null); setError(''); }, 300); };
  const formatNumber = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">{t("debt_to_equity.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("debt_to_equity.inputs.total_debt")} tooltip={t("debt_to_equity.inputs.total_debt_tooltip")}>
          <NumberInput 
            value={totalDebt} 
            onValueChange={(val) => {setTotalDebt(val.toString()); if(error) setError('');}}
            onKeyPress={handleKeyPress}
            placeholder={t("debt_to_equity.inputs.total_debt")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>
        <FormField label={t("debt_to_equity.inputs.total_equity")} tooltip={t("debt_to_equity.inputs.total_equity_tooltip")}>
          <NumberInput 
            value={totalEquity} 
            onValueChange={(val) => {setTotalEquity(val.toString()); if(error) setError('');}}
            onKeyPress={handleKeyPress}
            placeholder={t("debt_to_equity.inputs.total_equity")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>
      </div>
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={reset} />
        <ErrorDisplay error={error} />
      </div>
      {!result && <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 max-w-2xl mx-auto">
        <p className="text-foreground-70">{t("debt_to_equity.info.description")}</p>
      </div>}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("debt_to_equity.results.ratio")}</div>
        <div className="text-4xl font-bold text-primary">{formatNumber(result.ratio)}</div>
        <div className="flex items-center justify-center mt-2 text-lg text-foreground-70">
          <AlertTriangle className="w-5 h-5 ml-2 text-warning" />
          {result.risk}
        </div>
      </div>
    </div>
  ) : null;

  return <CalculatorLayout title={t("debt_to_equity.title")} description={t("debt_to_equity.description")}
    inputSection={inputSection} resultSection={resultSection} className="rtl" />;
}
