'use client';

/**
 * KDA (Kill/Death/Assist) Calculator
 * Calculates KDA ratio for gaming statistics
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sword, Skull, Plus, Gamepad2, Users, Target, Crosshair } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  kda: number;
  kdRatio: number;
  killParticipation: number;
  avgKillsPerGame: number;
  avgDeathsPerGame: number;
  avgAssistsPerGame: number;
}

export default function KDACalculator() {
  const { t } = useTranslation('calc/gaming');
  const [kills, setKills] = useState<string>('');
  const [deaths, setDeaths] = useState<string>('');
  const [assists, setAssists] = useState<string>('');
  const [games, setGames] = useState<string>('');
  const [teamKills, setTeamKills] = useState<string>('');

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
    const a = parseFloat(assists);
    const g = parseFloat(games) || 1;
    const tk = parseFloat(teamKills) || 0;

    if (isNaN(k) || isNaN(d) || isNaN(a)) {
      setError(t("kda.error_invalid"));
      return false;
    }

    if (k < 0 || d < 0 || a < 0 || g < 0 || tk < 0) {
      setError(t("kda.error_negative"));
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
        const a = parseFloat(assists);
        const g = parseFloat(games) || 1;
        const tk = parseFloat(teamKills) || 0;

        // Calculate KDA: (Kills + Assists) / Deaths
        const kda = d === 0 ? k + a : (k + a) / d;

        // Calculate K/D Ratio
        const kdRatio = d === 0 ? k : k / d;

        // Calculate Kill Participation
        const killParticipation = tk > 0 ? ((k + a) / tk) * 100 : 0;

        // Calculate averages per game
        const avgKillsPerGame = k / g;
        const avgDeathsPerGame = d / g;
        const avgAssistsPerGame = a / g;

        setResult({
          kda,
          kdRatio,
          killParticipation,
          avgKillsPerGame,
          avgDeathsPerGame,
          avgAssistsPerGame,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("kda.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setKills('');
      setDeaths('');
      setAssists('');
      setGames('');
      setTeamKills('');
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
        {t("kda.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("kda.kills_label")}
          tooltip={t("kda.kills_tooltip")}
        >
          <NumberInput
            value={kills}
            onValueChange={(val) => {
              setKills(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("kda.kills_placeholder")}
            startIcon={<Sword className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("kda.deaths_label")}
          tooltip={t("kda.deaths_tooltip")}
        >
          <NumberInput
            value={deaths}
            onValueChange={(val) => {
              setDeaths(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("kda.deaths_placeholder")}
            startIcon={<Skull className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("kda.assists_label")}
          tooltip={t("kda.assists_tooltip")}
        >
          <NumberInput
            value={assists}
            onValueChange={(val) => {
              setAssists(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("kda.assists_placeholder")}
            startIcon={<Plus className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("kda.games_label")}
          tooltip={t("kda.games_tooltip")}
        >
          <NumberInput
            value={games}
            onValueChange={(val) => {
              setGames(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("kda.games_placeholder")}
            startIcon={<Gamepad2 className="h-4 w-4" />}
            min={1}
          />
        </FormField>

        <FormField
          label={t("kda.team_kills_label")}
          tooltip={t("kda.team_kills_tooltip")}
        >
          <NumberInput
            value={teamKills}
            onValueChange={(val) => {
              setTeamKills(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("kda.team_kills_placeholder")}
            startIcon={<Users className="h-4 w-4" />}
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
              {t("kda.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("kda.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("kda.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("kda.use_case_1")}</li>
              <li>{t("kda.use_case_2")}</li>
              <li>{t("kda.use_case_3")}</li>
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
          {t("kda.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatNumber(result.kda)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("kda.result_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("kda.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Crosshair className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("kda.kd_ratio_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.kdRatio)}</div>
            <div className="text-sm text-foreground-70">{t("kda.kd_ratio_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("kda.kill_participation_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.killParticipation)}%</div>
            <div className="text-sm text-foreground-70">{t("kda.kill_participation_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Sword className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("kda.avg_kills_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.avgKillsPerGame)}</div>
            <div className="text-sm text-foreground-70">{t("kda.avg_kills_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Skull className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("kda.avg_deaths_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.avgDeathsPerGame)}</div>
            <div className="text-sm text-foreground-70">{t("kda.avg_deaths_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
            <div className="flex items-center mb-2">
              <Plus className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("kda.avg_assists_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.avgAssistsPerGame)}</div>
            <div className="text-sm text-foreground-70">{t("kda.avg_assists_unit")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("kda.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("kda.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("kda.title")}
      description={t("kda.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
