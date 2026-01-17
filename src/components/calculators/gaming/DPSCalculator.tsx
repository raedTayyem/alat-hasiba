'use client';

/**
 * DPS (Damage Per Second) Calculator
 * Calculates damage output over time for gaming
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sword, Timer, Percent, Zap, Hourglass } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  dps: number;
  dpm: number;
  totalDamage: number;
  attacksPerSecond: number;
}

export default function DPSCalculator() {
  const { t } = useTranslation('calc/gaming');
  const [damage, setDamage] = useState<string>('');
  const [attackSpeed, setAttackSpeed] = useState<string>('');
  const [critChance, setCritChance] = useState<string>('');
  const [critMultiplier, setCritMultiplier] = useState<string>('');
  const [duration, setDuration] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const dmg = parseFloat(damage);
    const speed = parseFloat(attackSpeed);
    const crit = parseFloat(critChance) || 0;

    if (isNaN(dmg) || isNaN(speed)) {
      setError(t("dps.error_invalid"));
      return false;
    }

    if (dmg <= 0 || speed <= 0) {
      setError(t("dps.error_positive"));
      return false;
    }

    if (crit < 0 || crit > 100) {
      setError(t("dps.error_crit_range"));
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
        const dmg = parseFloat(damage);
        const speed = parseFloat(attackSpeed);
        const crit = parseFloat(critChance) || 0;
        const critMult = parseFloat(critMultiplier) || 1;
        const dur = parseFloat(duration) || 60;

        // Calculate attacks per second
        const attacksPerSecond = speed;

        // Calculate average damage with crit
        const critRate = crit / 100;
        const avgDamage = dmg * (1 - critRate) + (dmg * critMult * critRate);

        // Calculate DPS
        const dps = avgDamage * attacksPerSecond;
        const dpm = dps * 60;
        const totalDamage = dps * dur;

        setResult({
          dps,
          dpm,
          totalDamage,
          attacksPerSecond,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("dps.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setDamage('');
      setAttackSpeed('');
      setCritChance('');
      setCritMultiplier('');
      setDuration('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) < 1) return num.toFixed(3);
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
        {t("dps.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("dps.damage_label")}
          tooltip={t("dps.damage_tooltip")}
        >
          <NumberInput
            value={damage}
            onValueChange={(val) => {
              setDamage(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("dps.damage_placeholder")}
            startIcon={<Sword className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("dps.attack_speed_label")}
          tooltip={t("dps.attack_speed_tooltip")}
        >
          <NumberInput
            value={attackSpeed}
            onValueChange={(val) => {
              setAttackSpeed(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("dps.attack_speed_placeholder")}
            startIcon={<Timer className="h-4 w-4" />}
            step={0.1}
            min={0}
          />
        </FormField>

        <FormField
          label={t("dps.crit_chance_label")}
          tooltip={t("dps.crit_chance_tooltip")}
        >
          <NumberInput
            value={critChance}
            onValueChange={(val) => {
              setCritChance(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("dps.crit_chance_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            min={0}
            max={100}
          />
        </FormField>

        <FormField
          label={t("dps.crit_multiplier_label")}
          tooltip={t("dps.crit_multiplier_tooltip")}
        >
          <NumberInput
            value={critMultiplier}
            onValueChange={(val) => {
              setCritMultiplier(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("dps.crit_multiplier_placeholder")}
            startIcon={<Zap className="h-4 w-4" />}
            step={0.1}
            min={0}
          />
        </FormField>

        <FormField
          label={t("dps.duration_label")}
          tooltip={t("dps.duration_tooltip")}
        >
          <NumberInput
            value={duration}
            onValueChange={(val) => {
              setDuration(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("dps.duration_placeholder")}
            startIcon={<Hourglass className="h-4 w-4" />}
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
              {t("dps.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("dps.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("dps.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("dps.use_case_1")}</li>
              <li>{t("dps.use_case_2")}</li>
              <li>{t("dps.use_case_3")}</li>
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
          {t("dps.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatNumber(result.dps)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("dps.result_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("dps.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("dps.dpm_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.dpm)}</div>
            <div className="text-sm text-foreground-70">{t("dps.dpm_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="font-medium">{t("dps.total_damage_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.totalDamage)}</div>
            <div className="text-sm text-foreground-70">{t("dps.total_damage_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="font-medium">{t("dps.attacks_per_second_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.attacksPerSecond)}</div>
            <div className="text-sm text-foreground-70">{t("dps.attacks_per_second_unit")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("dps.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("dps.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("dps.title")}
      description={t("dps.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
