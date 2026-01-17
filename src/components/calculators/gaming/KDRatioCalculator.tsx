'use client';

/**
 * K/D Ratio Calculator
 * Calculates Kill/Death ratio for FPS gaming statistics
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sword, Skull, Gamepad2, Target, Crosshair, TrendingUp, Percent } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  kdRatio: number;
  avgKillsPerGame: number;
  avgDeathsPerGame: number;
  killEfficiency: number;
}

export default function KDRatioCalculator() {
  const { t, i18n } = useTranslation('calc/gaming');
  const [kills, setKills] = useState<string>('');
  const [deaths, setDeaths] = useState<string>('');
  const [games, setGames] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const k = parseFloat(kills);
    const d = parseFloat(deaths);
    const g = parseFloat(games) || 1;

    if (isNaN(k) || isNaN(d)) {
      setError(t("kd_ratio.error_invalid"));
      return false;
    }

    if (k < 0 || d < 0 || g < 0) {
      setError(t("kd_ratio.error_negative"));
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
        const k = parseFloat(kills);
        const d = parseFloat(deaths);
        const g = parseFloat(games) || 1;

        // Calculate K/D Ratio
        const kdRatio = d === 0 ? k : k / d;

        // Calculate averages per game
        const avgKillsPerGame = k / g;
        const avgDeathsPerGame = d / g;

        // Calculate Kill Efficiency Rating (percentage of kills relative to total engagements)
        const totalEngagements = k + d;
        const killEfficiency = totalEngagements === 0 ? 0 : (k / totalEngagements) * 100;

        setResult({
          kdRatio,
          avgKillsPerGame,
          avgDeathsPerGame,
          killEfficiency,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("kd_ratio.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setKills('');
      setDeaths('');
      setGames('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) < 1) return num.toFixed(3);
    if (Math.abs(num) < 100) return num.toFixed(2);
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("kd_ratio.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("kd_ratio.kills_label")}
          tooltip={t("kd_ratio.kills_tooltip")}
        >
          <NumberInput
            value={kills}
            onValueChange={(val) => {
              setKills(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("kd_ratio.kills_placeholder")}
            startIcon={<Sword className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("kd_ratio.deaths_label")}
          tooltip={t("kd_ratio.deaths_tooltip")}
        >
          <NumberInput
            value={deaths}
            onValueChange={(val) => {
              setDeaths(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("kd_ratio.deaths_placeholder")}
            startIcon={<Skull className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("kd_ratio.games_label")}
          tooltip={t("kd_ratio.games_tooltip")}
        >
          <NumberInput
            value={games}
            onValueChange={(val) => {
              setGames(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("kd_ratio.games_placeholder")}
            startIcon={<Gamepad2 className="h-4 w-4" />}
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
              {t("kd_ratio.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("kd_ratio.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("kd_ratio.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("kd_ratio.use_case_1")}</li>
              <li>{t("kd_ratio.use_case_2")}</li>
              <li>{t("kd_ratio.use_case_3")}</li>
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
          {t("kd_ratio.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatNumber(result.kdRatio)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("kd_ratio.result_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("kd_ratio.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Sword className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("kd_ratio.avg_kills_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.avgKillsPerGame)}</div>
            <div className="text-sm text-foreground-70">{t("kd_ratio.avg_kills_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Skull className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("kd_ratio.avg_deaths_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.avgDeathsPerGame)}</div>
            <div className="text-sm text-foreground-70">{t("kd_ratio.avg_deaths_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("kd_ratio.kill_efficiency_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.killEfficiency)}%</div>
            <div className="text-sm text-foreground-70">{t("kd_ratio.kill_efficiency_unit")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("kd_ratio.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("kd_ratio.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("kd_ratio.title")}
      description={t("kd_ratio.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
