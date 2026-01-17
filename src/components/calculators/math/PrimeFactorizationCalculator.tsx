'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Hash, CheckCircle, AlertTriangle } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface PrimeResult {
  factors: number[];
  factorization: string;
  isPrime: boolean;
  uniqueFactors: number[];
}

export default function PrimeFactorizationCalculator() {
  const { t } = useTranslation('calc/math');

  const [number, setNumber] = useState<string>('');
  const [result, setResult] = useState<PrimeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const findPrimeFactors = (n: number): number[] => {
    const factors: number[] = [];
    let num = Math.abs(n);

    while (num % 2 === 0) {
      factors.push(2);
      num = num / 2;
    }

    for (let i = 3; i * i <= num; i += 2) {
      while (num % i === 0) {
        factors.push(i);
        num = num / i;
      }
    }

    if (num > 2) {
      factors.push(num);
    }

    return factors;
  };

  const validateInputs = (): boolean => {
    setError('');

    const n = parseInt(number);

    if (isNaN(n)) {
      setError(t("prime_factorization.invalid_input"));
      return false;
    }

    if (n < 2) {
      setError(t("prime_factorization.must_be_greater_than_one"));
      return false;
    }

    if (n > 1000000) {
      setError(t("prime_factorization.too_large"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        const n = parseInt(number);
        const factors = findPrimeFactors(n);
        const uniqueFactors = Array.from(new Set(factors)).sort((a, b) => a - b);

        const factorCounts = factors.reduce((acc, factor) => {
          acc[factor] = (acc[factor] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        const factorization = Object.entries(factorCounts)
          .map(([factor, count]) => count > 1 ? `${factor}^${count}` : factor)
          .join(' × ');

        setResult({
          factors,
          factorization,
          isPrime: factors.length === 1,
          uniqueFactors
        });
        setShowResult(true);
      } catch (err) {
        setError(t("prime_factorization.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setNumber('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("prime_factorization.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("prime_factorization.number_label")} tooltip={t("prime_factorization.number_tooltip")}>
          <NumberInput
            value={number}
            onValueChange={(val) => { setNumber(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("prime_factorization.number_placeholder")}
            startIcon={<Hash className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("prime_factorization.info_title")}</h2>
          <p className="text-foreground-70">{t("prime_factorization.description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2 flex items-center justify-center gap-2">
          {result.isPrime ? (
            <span className="flex items-center text-success gap-1"><CheckCircle className="w-4 h-4" /> {t("prime_factorization.is_prime")}</span>
          ) : (
            <span className="flex items-center text-warning gap-1"><AlertTriangle className="w-4 h-4" /> {t("prime_factorization.is_composite")}</span>
          )}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">{number}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <h3 className="font-medium mb-2">{t("prime_factorization.factorization_label")}</h3>
          <div className="text-2xl text-center text-primary font-mono" dir="ltr">{result.factorization}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <h3 className="font-medium mb-2">{t("prime_factorization.all_factors")}</h3>
            <div className="text-sm text-foreground-70">{result.factors.join(', ')}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <h3 className="font-medium mb-2">{t("prime_factorization.unique_factors")}</h3>
            <div className="text-sm text-foreground-70">{result.uniqueFactors.join(', ')}</div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("prime_factorization.title")}
      description={t("prime_factorization.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
