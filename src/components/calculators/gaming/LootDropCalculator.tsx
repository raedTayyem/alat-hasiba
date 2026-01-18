'use client';

/**
 * Loot Drop Calculator
 * Calculates drop rate probability: 1 - (1 - rate)^attempts
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Percent, Repeat, CheckCircle, XCircle, Target, ShieldCheck } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  dropChance: number;
  failChance: number;
  expectedAttempts: number;
  guarantee95: number;
  guarantee99: number;
}

export default function LootDropCalculator() {
  const { t } = useTranslation('calc/gaming');
  const [dropRate, setDropRate] = useState<string>('');
  const [attempts, setAttempts] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const rate = parseFloat(dropRate);
    const att = parseFloat(attempts);

    if (isNaN(rate) || isNaN(att)) {
      setError(t("loot_drop.error_invalid"));
      return false;
    }

    if (rate <= 0 || rate > 100) {
      setError(t("loot_drop.error_rate_range"));
      return false;
    }

    if (att <= 0) {
      setError(t("loot_drop.error_positive"));
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
        const rate = parseFloat(dropRate) / 100;
        const att = parseFloat(attempts);

        // Probability of getting at least one drop: 1 - (1 - rate)^attempts
        const dropChance = (1 - Math.pow(1 - rate, att)) * 100;
        const failChance = 100 - dropChance;

        // Expected number of attempts to get one drop: 1 / rate
        const expectedAttempts = 1 / rate;

        // Attempts needed for 95% chance
        const guarantee95 = Math.ceil(Math.log(0.05) / Math.log(1 - rate));

        // Attempts needed for 99% chance
        const guarantee99 = Math.ceil(Math.log(0.01) / Math.log(1 - rate));

        setResult({
          dropChance,
          failChance,
          expectedAttempts,
          guarantee95,
          guarantee99,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("loot_drop.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setDropRate('');
      setAttempts('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) < 1) return num.toFixed(4);
    if (Math.abs(num) < 100) return num.toFixed(2);
    return num.toLocaleString('en-US', { maximumFractionDigits: 1 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("loot_drop.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("loot_drop.drop_rate_label")}
          tooltip={t("loot_drop.drop_rate_tooltip")}
        >
          <NumberInput
            value={dropRate}
            onValueChange={(val) => {
              setDropRate(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("loot_drop.drop_rate_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            step={0.01}
            min={0}
            max={100}
          />
        </FormField>

        <FormField
          label={t("loot_drop.attempts_label")}
          tooltip={t("loot_drop.attempts_tooltip")}
        >
          <NumberInput
            value={attempts}
            onValueChange={(val) => {
              setAttempts(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("loot_drop.attempts_placeholder")}
            startIcon={<Repeat className="h-4 w-4" />}
            min={0}
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
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("loot_drop.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("loot_drop.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("loot_drop.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("loot_drop.use_case_1")}</li>
              <li>{t("loot_drop.use_case_2")}</li>
              <li>{t("loot_drop.use_case_3")}</li>
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
          {t("loot_drop.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatNumber(result.dropChance)}%
        </div>
        <div className="text-lg text-foreground-70">
          {t("loot_drop.result_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("loot_drop.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <XCircle className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("loot_drop.fail_chance_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.failChance)}%</div>
            <div className="text-sm text-foreground-70">{t("loot_drop.fail_chance_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("loot_drop.expected_attempts_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.expectedAttempts)}</div>
            <div className="text-sm text-foreground-70">{t("loot_drop.expected_attempts_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <ShieldCheck className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("loot_drop.guarantee_95_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.guarantee95}</div>
            <div className="text-sm text-foreground-70">{t("loot_drop.guarantee_95_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("loot_drop.guarantee_99_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.guarantee99}</div>
            <div className="text-sm text-foreground-70">{t("loot_drop.guarantee_99_unit")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("loot_drop.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("loot_drop.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("loot_drop.title")}
      description={t("loot_drop.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
