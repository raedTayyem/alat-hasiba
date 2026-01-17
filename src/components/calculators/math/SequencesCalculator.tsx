'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Hash, ArrowRight, List, Sigma } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface SequenceResult {
  sequenceType: string;
  nthTerm: number;
  sum: number;
  sequence: number[];
}

export default function SequencesCalculator() {
  const { t } = useTranslation('calc/math');

  const [sequenceType, setSequenceType] = useState<string>('arithmetic');
  const [firstTerm, setFirstTerm] = useState<string>('');
  const [commonDiff, setCommonDiff] = useState<string>(''); // for arithmetic
  const [commonRatio, setCommonRatio] = useState<string>(''); // for geometric
  const [nthPosition, setNthPosition] = useState<string>('');
  const [numberOfTerms, setNumberOfTerms] = useState<string>('');
  const [result, setResult] = useState<SequenceResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const calculateArithmetic = (a: number, d: number, n: number, terms: number) => {
    const nthTerm = a + (n - 1) * d;
    const sum = (terms / 2) * (2 * a + (terms - 1) * d);
    const sequence: number[] = [];
    for (let i = 0; i < Math.min(terms, 20); i++) {
      sequence.push(a + i * d);
    }
    return { nthTerm, sum, sequence };
  };

  const calculateGeometric = (a: number, r: number, n: number, terms: number) => {
    const nthTerm = a * Math.pow(r, n - 1);
    const sum = r === 1 ? a * terms : a * (1 - Math.pow(r, terms)) / (1 - r);
    const sequence: number[] = [];
    for (let i = 0; i < Math.min(terms, 20); i++) {
      sequence.push(a * Math.pow(r, i));
    }
    return { nthTerm, sum, sequence };
  };

  const calculateFibonacci = (n: number, terms: number) => {
    const sequence: number[] = [0, 1];
    for (let i = 2; i < Math.min(terms, 30); i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    const nthTerm = n <= sequence.length ? sequence[n - 1] : 0;
    const sum = sequence.reduce((acc, val) => acc + val, 0);
    return { nthTerm, sum, sequence };
  };

  const validateInputs = (): boolean => {
    setError('');

    const a = parseFloat(firstTerm);
    const n = parseInt(nthPosition);
    const terms = parseInt(numberOfTerms);

    if (sequenceType !== 'fibonacci' && isNaN(a)) {
      setError(t("sequences_calculator.invalid_first_term"));
      return false;
    }

    if (isNaN(n) || n < 1) {
      setError(t("sequences_calculator.invalid_position"));
      return false;
    }

    if (isNaN(terms) || terms < 1 || terms > 100) {
      setError(t("sequences_calculator.invalid_terms"));
      return false;
    }

    if (sequenceType === 'arithmetic') {
      const d = parseFloat(commonDiff);
      if (isNaN(d)) {
        setError(t("sequences_calculator.invalid_difference"));
        return false;
      }
    }

    if (sequenceType === 'geometric') {
      const r = parseFloat(commonRatio);
      if (isNaN(r)) {
        setError(t("sequences_calculator.invalid_ratio"));
        return false;
      }
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        const a = parseFloat(firstTerm) || 0;
        const n = parseInt(nthPosition);
        const terms = parseInt(numberOfTerms);

        let calcResult;

        switch (sequenceType) {
          case 'arithmetic': {
            const d = parseFloat(commonDiff);
            calcResult = calculateArithmetic(a, d, n, terms);
            break;
          }
          case 'geometric': {
            const r = parseFloat(commonRatio);
            calcResult = calculateGeometric(a, r, n, terms);
            break;
          }
          case 'fibonacci':
            calcResult = calculateFibonacci(n, terms);
            break;
          default:
            calcResult = { nthTerm: 0, sum: 0, sequence: [] };
        }

        setResult({
          sequenceType,
          nthTerm: calcResult.nthTerm,
          sum: calcResult.sum,
          sequence: calcResult.sequence
        });
        setShowResult(true);
      } catch (err) {
        setError(t("sequences_calculator.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setFirstTerm('');
      setCommonDiff('');
      setCommonRatio('');
      setNthPosition('');
      setNumberOfTerms('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const sequenceTypeOptions = [
    { value: 'arithmetic', label: t("sequences_calculator.arithmetic") },
    { value: 'geometric', label: t("sequences_calculator.geometric") },
    { value: 'fibonacci', label: t("sequences_calculator.fibonacci") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("sequences_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("sequences_calculator.sequence_type")} tooltip={t("sequences_calculator.type_tooltip")}>
          <Combobox
            options={sequenceTypeOptions}
            value={sequenceType}
            onChange={(val) => setSequenceType(val)}
            placeholder={t("sequences_calculator.sequence_type")}
          />
        </FormField>

        {sequenceType !== 'fibonacci' && (
          <FormField label={t("sequences_calculator.first_term")} tooltip={t("sequences_calculator.first_term_tooltip")}>
            <NumberInput
              value={firstTerm}
              onValueChange={(val) => setFirstTerm(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("sequences_calculator.first_term_placeholder")}
              startIcon={<Hash className="h-4 w-4" />}
            />
          </FormField>
        )}

        {sequenceType === 'arithmetic' && (
          <FormField label={t("sequences_calculator.common_difference")} tooltip={t("sequences_calculator.difference_tooltip")}>
            <NumberInput
              value={commonDiff}
              onValueChange={(val) => setCommonDiff(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("sequences_calculator.difference_placeholder")}
              startIcon={<Hash className="h-4 w-4" />}
            />
          </FormField>
        )}

        {sequenceType === 'geometric' && (
          <FormField label={t("sequences_calculator.common_ratio")} tooltip={t("sequences_calculator.ratio_tooltip")}>
            <NumberInput
              value={commonRatio}
              onValueChange={(val) => setCommonRatio(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("sequences_calculator.ratio_placeholder")}
              startIcon={<Hash className="h-4 w-4" />}
            />
          </FormField>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField label={t("sequences_calculator.nth_position")} tooltip={t("sequences_calculator.position_tooltip")}>
            <NumberInput
              value={nthPosition}
              onValueChange={(val) => setNthPosition(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("sequences_calculator.position_placeholder")}
              min={1}
              startIcon={<ArrowRight className="h-4 w-4" />}
            />
          </FormField>

          <FormField label={t("sequences_calculator.number_of_terms")} tooltip={t("sequences_calculator.terms_tooltip")}>
            <NumberInput
              value={numberOfTerms}
              onValueChange={(val) => setNumberOfTerms(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("sequences_calculator.terms_placeholder")}
              min={1}
              max={100}
              startIcon={<List className="h-4 w-4" />}
            />
          </FormField>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-4">{t("sequences_calculator.results")}</h3>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="text-foreground-70 mb-2">{t("sequences_calculator.nth_term_value")}</div>
            <div className="text-3xl font-bold text-primary">
              {result.nthTerm.toFixed(4)}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="text-foreground-70 mb-2">{t("sequences_calculator.sum_of_terms")}</div>
            <div className="text-3xl font-bold text-primary">
              {result.sum.toFixed(4)}
            </div>
          </div>
        </div>

        <div className="text-start">
          <h4 className="font-medium mb-3">{t("sequences_calculator.sequence_preview")}</h4>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="flex flex-wrap gap-2" dir="ltr">
              {result.sequence.map((val, i) => (
                <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded font-mono">
                  {val.toFixed(2)}
                </span>
              ))}
              {result.sequence.length >= 20 && (
                <span className="px-3 py-1 text-foreground-70">...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Sigma className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("sequences_calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t(`sequences_calculator.formula_${result.sequenceType}`)}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("sequences_calculator.title")}
      description={t("sequences_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
