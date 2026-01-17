'use client';

/**
 * Level Up Calculator
 * Calculates time needed to reach a target level in games
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Target, Zap, Clock, Calendar, Gamepad2, TrendingUp } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  totalXPNeeded: number;
  estimatedHours: number;
  estimatedDays: number;
  sessionsNeeded2hr: number;
  sessionsNeeded3hr: number;
  sessionsNeeded4hr: number;
  levelsToGain: number;
}

export default function LevelUpCalculator() {
  const { t } = useTranslation('calc/gaming');
  const [currentLevel, setCurrentLevel] = useState<string>('');
  const [targetLevel, setTargetLevel] = useState<string>('');
  const [xpPerHour, setXpPerHour] = useState<string>('');
  const [xpPerLevel, setXpPerLevel] = useState<string>('');
  const [scalingFactor, setScalingFactor] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const currLvl = parseFloat(currentLevel);
    const targLvl = parseFloat(targetLevel);
    const xpHr = parseFloat(xpPerHour);
    const xpLvl = parseFloat(xpPerLevel);

    if (isNaN(currLvl) || isNaN(targLvl) || isNaN(xpHr) || isNaN(xpLvl)) {
      setError(t("level_up.error_invalid"));
      return false;
    }

    if (currLvl < 0 || targLvl < 0 || xpHr <= 0 || xpLvl <= 0) {
      setError(t("level_up.error_positive"));
      return false;
    }

    if (targLvl <= currLvl) {
      setError(t("level_up.error_target_higher"));
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
        const targLvl = parseFloat(targetLevel);
        const xpHr = parseFloat(xpPerHour);
        const xpLvl = parseFloat(xpPerLevel);
        const scaling = parseFloat(scalingFactor) || 0;

        const levelsToGain = targLvl - currLvl;

        let totalXPNeeded = 0;

        if (scaling === 0) {
          // Constant XP per level
          totalXPNeeded = levelsToGain * xpLvl;
        } else {
          // Scaling XP per level: XP = baseXP * (1 + scalingFactor * level)
          for (let lvl = currLvl + 1; lvl <= targLvl; lvl++) {
            totalXPNeeded += xpLvl * (1 + (scaling / 100) * lvl);
          }
        }

        const estimatedHours = totalXPNeeded / xpHr;
        const estimatedDays = estimatedHours / 24;

        // Calculate sessions needed for different session lengths
        const sessionsNeeded2hr = Math.ceil(estimatedHours / 2);
        const sessionsNeeded3hr = Math.ceil(estimatedHours / 3);
        const sessionsNeeded4hr = Math.ceil(estimatedHours / 4);

        setResult({
          totalXPNeeded,
          estimatedHours,
          estimatedDays,
          sessionsNeeded2hr,
          sessionsNeeded3hr,
          sessionsNeeded4hr,
          levelsToGain,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("level_up.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCurrentLevel('');
      setTargetLevel('');
      setXpPerHour('');
      setXpPerLevel('');
      setScalingFactor('');
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

  const formatTime = (hours: number): string => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} ${t("level_up.minutes")}`;
    }
    if (hours < 24) {
      return `${formatNumber(hours)} ${t("level_up.hours")}`;
    }
    const days = hours / 24;
    return `${formatNumber(days)} ${t("level_up.days")}`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("level_up.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("level_up.current_level_label")}
          tooltip={t("level_up.current_level_tooltip")}
        >
          <NumberInput
            value={currentLevel}
            onValueChange={(val) => {
              setCurrentLevel(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("level_up.current_level_placeholder")}
            startIcon={<Award className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("level_up.target_level_label")}
          tooltip={t("level_up.target_level_tooltip")}
        >
          <NumberInput
            value={targetLevel}
            onValueChange={(val) => {
              setTargetLevel(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("level_up.target_level_placeholder")}
            startIcon={<Target className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("level_up.xp_per_hour_label")}
          tooltip={t("level_up.xp_per_hour_tooltip")}
        >
          <NumberInput
            value={xpPerHour}
            onValueChange={(val) => {
              setXpPerHour(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("level_up.xp_per_hour_placeholder")}
            startIcon={<Zap className="h-4 w-4" />}
            min={1}
          />
        </FormField>

        <FormField
          label={t("level_up.xp_per_level_label")}
          tooltip={t("level_up.xp_per_level_tooltip")}
        >
          <NumberInput
            value={xpPerLevel}
            onValueChange={(val) => {
              setXpPerLevel(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("level_up.xp_per_level_placeholder")}
            startIcon={<TrendingUp className="h-4 w-4" />}
            min={1}
          />
        </FormField>

        <FormField
          label={t("level_up.scaling_factor_label")}
          tooltip={t("level_up.scaling_factor_tooltip")}
        >
          <NumberInput
            value={scalingFactor}
            onValueChange={(val) => {
              setScalingFactor(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("level_up.scaling_factor_placeholder")}
            startIcon={<TrendingUp className="h-4 w-4" />}
            step={0.1}
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
              {t("level_up.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("level_up.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("level_up.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("level_up.use_case_1")}</li>
              <li>{t("level_up.use_case_2")}</li>
              <li>{t("level_up.use_case_3")}</li>
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
          {t("level_up.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatTime(result.estimatedHours)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("level_up.result_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("level_up.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("level_up.total_xp_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.totalXPNeeded)}</div>
            <div className="text-sm text-foreground-70">{t("level_up.total_xp_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Award className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("level_up.levels_to_gain_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.levelsToGain)}</div>
            <div className="text-sm text-foreground-70">{t("level_up.levels_to_gain_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("level_up.estimated_hours_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.estimatedHours)}</div>
            <div className="text-sm text-foreground-70">{t("level_up.estimated_hours_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("level_up.estimated_days_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.estimatedDays)}</div>
            <div className="text-sm text-foreground-70">{t("level_up.estimated_days_unit")}</div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-3">{t("level_up.sessions_title")}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Gamepad2 className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("level_up.sessions_2hr_label")}</div>
              </div>
              <div className="text-2xl font-bold text-primary">{result.sessionsNeeded2hr}</div>
              <div className="text-sm text-foreground-70">{t("level_up.sessions_unit")}</div>
            </div>

            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Gamepad2 className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("level_up.sessions_3hr_label")}</div>
              </div>
              <div className="text-2xl font-bold text-primary">{result.sessionsNeeded3hr}</div>
              <div className="text-sm text-foreground-70">{t("level_up.sessions_unit")}</div>
            </div>

            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Gamepad2 className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("level_up.sessions_4hr_label")}</div>
              </div>
              <div className="text-2xl font-bold text-primary">{result.sessionsNeeded4hr}</div>
              <div className="text-sm text-foreground-70">{t("level_up.sessions_unit")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("level_up.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("level_up.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("level_up.title")}
      description={t("level_up.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
