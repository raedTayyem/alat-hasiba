'use client';

/**
 * XP (Experience Points) Calculator
 * Calculates experience points needed to level up
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Zap, TrendingUp, CheckCircle, BarChart2 } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  xpNeeded: number;
  xpRemaining: number;
  percentComplete: number;
  levelsToGain: number;
  totalXPRequired: number;
}

export default function XPCalculator() {
  const { t } = useTranslation('calc/gaming');
  const [currentLevel, setCurrentLevel] = useState<string>('');
  const [currentXP, setCurrentXP] = useState<string>('');
  const [targetLevel, setTargetLevel] = useState<string>('');
  const [xpPerLevel, setXpPerLevel] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const currLvl = parseFloat(currentLevel);
    // currentXP parsed for potential enhanced validation
    parseFloat(currentXP);
    const targLvl = parseFloat(targetLevel);
    const xpLvl = parseFloat(xpPerLevel);

    if (isNaN(currLvl) || isNaN(targLvl) || isNaN(xpLvl)) {
      setError(t("xp.error_invalid"));
      return false;
    }

    if (currLvl < 0 || targLvl < 0 || xpLvl <= 0) {
      setError(t("xp.error_positive"));
      return false;
    }

    if (targLvl <= currLvl) {
      setError(t("xp.error_target_higher"));
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
        const currLvl = parseFloat(currentLevel);
        const currXp = parseFloat(currentXP) || 0;
        const targLvl = parseFloat(targetLevel);
        const xpLvl = parseFloat(xpPerLevel);

        const levelsToGain = targLvl - currLvl;
        const totalXPRequired = levelsToGain * xpLvl;
        const xpNeeded = totalXPRequired - currXp;
        const xpRemaining = Math.max(0, xpNeeded);
        // Ensure percent complete is between 0 and 100
        const percentComplete = totalXPRequired > 0
          ? Math.min(100, Math.max(0, (currXp / totalXPRequired) * 100))
          : 0;

        setResult({
          xpNeeded: totalXPRequired,
          xpRemaining,
          percentComplete,
          levelsToGain,
          totalXPRequired,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("xp.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCurrentLevel('');
      setCurrentXP('');
      setTargetLevel('');
      setXpPerLevel('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) < 1) return num.toFixed(3);
    if (Math.abs(num) < 100) return num.toFixed(2);
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("xp.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("xp.current_level_label")}
          tooltip={t("xp.current_level_tooltip")}
        >
          <NumberInput
            value={currentLevel}
            onValueChange={(val) => {
              setCurrentLevel(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("xp.current_level_placeholder")}
            startIcon={<Award className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("xp.current_xp_label")}
          tooltip={t("xp.current_xp_tooltip")}
        >
          <NumberInput
            value={currentXP}
            onValueChange={(val) => {
              setCurrentXP(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("xp.current_xp_placeholder")}
            startIcon={<Zap className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("xp.target_level_label")}
          tooltip={t("xp.target_level_tooltip")}
        >
          <NumberInput
            value={targetLevel}
            onValueChange={(val) => {
              setTargetLevel(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("xp.target_level_placeholder")}
            startIcon={<TrendingUp className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("xp.xp_per_level_label")}
          tooltip={t("xp.xp_per_level_tooltip")}
        >
          <NumberInput
            value={xpPerLevel}
            onValueChange={(val) => {
              setXpPerLevel(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("xp.xp_per_level_placeholder")}
            startIcon={<BarChart2 className="h-4 w-4" />}
            min={1}
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
              {t("xp.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("xp.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("xp.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("xp.use_case_1")}</li>
              <li>{t("xp.use_case_2")}</li>
              <li>{t("xp.use_case_3")}</li>
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
          {t("xp.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatNumber(result.xpRemaining)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("xp.result_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("xp.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("xp.levels_to_gain_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.levelsToGain)}</div>
            <div className="text-sm text-foreground-70">{t("xp.levels_to_gain_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("xp.percent_complete_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.percentComplete)}%</div>
            <div className="text-sm text-foreground-70">{t("xp.percent_complete_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("xp.total_xp_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.totalXPRequired)}</div>
            <div className="text-sm text-foreground-70">{t("xp.total_xp_unit")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("xp.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("xp.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("xp.title")}
      description={t("xp.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
