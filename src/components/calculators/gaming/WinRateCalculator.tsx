'use client';

/**
 * Win Rate Calculator
 * Calculates win percentage and statistics
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, XCircle, MinusCircle, PieChart, Target, TrendingUp } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  winRate: number;
  lossRate: number;
  winsNeededFor50: number;
  winsNeededFor60: number;
  gamesPlayed: number;
}

export default function WinRateCalculator() {
  const { t, i18n } = useTranslation('calc/gaming');
  const [wins, setWins] = useState<string>('');
  const [losses, setLosses] = useState<string>('');
  const [draws, setDraws] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const w = parseFloat(wins);
    const l = parseFloat(losses);
    const d = parseFloat(draws) || 0;

    if (isNaN(w) || isNaN(l)) {
      setError(t("win_rate.error_invalid"));
      return false;
    }

    if (w < 0 || l < 0 || d < 0) {
      setError(t("win_rate.error_negative"));
      return false;
    }

    if (w + l + d === 0) {
      setError(t("win_rate.error_no_games"));
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
        const w = parseFloat(wins);
        const l = parseFloat(losses);
        const d = parseFloat(draws) || 0;

        const gamesPlayed = w + l + d;
        const winRate = (w / gamesPlayed) * 100;
        const lossRate = (l / gamesPlayed) * 100;

        // Calculate wins needed for specific win rates
        // For target% win rate: (w + x) / (games + x) = target
        // Solving: w + x = target * (games + x)
        //          w + x = target * games + target * x
        //          x - target * x = target * games - w
        //          x * (1 - target) = target * games - w
        //          x = (target * games - w) / (1 - target)

        // For 50% win rate
        const winsFor50Raw = (0.5 * gamesPlayed - w) / (1 - 0.5);
        const winsFor50 = winRate >= 50 ? 0 : Math.max(0, Math.ceil(winsFor50Raw));

        // For 60% win rate
        const winsFor60Raw = (0.6 * gamesPlayed - w) / (1 - 0.6);
        const winsFor60 = winRate >= 60 ? 0 : Math.max(0, Math.ceil(winsFor60Raw));

        setResult({
          winRate,
          lossRate,
          winsNeededFor50: winsFor50,
          winsNeededFor60: winsFor60,
          gamesPlayed,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("win_rate.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setWins('');
      setLosses('');
      setDraws('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
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
        {t("win_rate.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("win_rate.wins_label")}
          tooltip={t("win_rate.wins_tooltip")}
        >
          <NumberInput
            value={wins}
            onValueChange={(val) => {
              setWins(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("win_rate.wins_placeholder")}
            startIcon={<Trophy className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("win_rate.losses_label")}
          tooltip={t("win_rate.losses_tooltip")}
        >
          <NumberInput
            value={losses}
            onValueChange={(val) => {
              setLosses(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("win_rate.losses_placeholder")}
            startIcon={<XCircle className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("win_rate.draws_label")}
          tooltip={t("win_rate.draws_tooltip")}
        >
          <NumberInput
            value={draws}
            onValueChange={(val) => {
              setDraws(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("win_rate.draws_placeholder")}
            startIcon={<MinusCircle className="h-4 w-4" />}
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
              {t("win_rate.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("win_rate.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("win_rate.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("win_rate.use_case_1")}</li>
              <li>{t("win_rate.use_case_2")}</li>
              <li>{t("win_rate.use_case_3")}</li>
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
          {t("win_rate.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatNumber(result.winRate)}%
        </div>
        <div className="text-lg text-foreground-70">
          {t("win_rate.result_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("win_rate.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <PieChart className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("win_rate.games_played_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.gamesPlayed)}</div>
            <div className="text-sm text-foreground-70">{t("win_rate.games_played_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <XCircle className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("win_rate.loss_rate_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.lossRate)}%</div>
            <div className="text-sm text-foreground-70">{t("win_rate.loss_rate_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("win_rate.wins_for_50_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.winsNeededFor50)}</div>
            <div className="text-sm text-foreground-70">{t("win_rate.wins_for_50_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("win_rate.wins_for_60_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.winsNeededFor60)}</div>
            <div className="text-sm text-foreground-70">{t("win_rate.wins_for_60_unit")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("win_rate.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("win_rate.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("win_rate.title")}
      description={t("win_rate.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
