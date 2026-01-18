'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function TransformerCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [primaryVoltage, setPrimaryVoltage] = useState<string>('');
  const [secondaryVoltage, setSecondaryVoltage] = useState<string>('');
  const [primaryTurns, setPrimaryTurns] = useState<string>('');
  const [secondaryTurns, setSecondaryTurns] = useState<string>('');
  const [power, setPower] = useState<string>('');
  const [efficiency, setEfficiency] = useState<string>('95');
  const [result, setResult] = useState<{
    turnsRatio: number;
    voltageRatio: number;
    primaryCurrent: number;
    secondaryCurrent: number;
    outputPower: number;
    losses: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const vp = parseFloat(primaryVoltage);
    const vs = parseFloat(secondaryVoltage);
    const np = parseFloat(primaryTurns);
    const ns = parseFloat(secondaryTurns);
    const p = parseFloat(power);
    const eff = parseFloat(efficiency) / 100;

    if ((!vp && !vs) || (!np && !ns) || !p) {
      setError(t("common.errors.invalid"));
      return;
    }

    let turnsRatio = 0;
    let voltageRatio = 0;
    let calcVp = vp;
    let calcVs = vs;

    if (np && ns) {
      turnsRatio = ns / np;
      if (vp && !vs) calcVs = vp * turnsRatio;
      if (vs && !vp) calcVp = vs / turnsRatio;
    } else if (vp && vs) {
      voltageRatio = vs / vp;
      turnsRatio = voltageRatio;
    }

    // Power calculations
    const outputPower = p * eff;
    const losses = p - outputPower;

    // Current calculations
    const primaryCurrent = p / calcVp;
    const secondaryCurrent = outputPower / calcVs;

    setResult({
      turnsRatio: parseFloat(turnsRatio.toFixed(4)),
      voltageRatio: parseFloat((calcVs / calcVp).toFixed(4)),
      primaryCurrent: parseFloat(primaryCurrent.toFixed(3)),
      secondaryCurrent: parseFloat(secondaryCurrent.toFixed(3)),
      outputPower: parseFloat(outputPower.toFixed(2)),
      losses: parseFloat(losses.toFixed(2))
    });
  };

  const reset = () => {
    setPrimaryVoltage('');
    setSecondaryVoltage('');
    setPrimaryTurns('');
    setSecondaryTurns('');
    setPower('');
    setEfficiency('95');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("transformer.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("transformer.primary_voltage")} tooltip={t("transformer.enter_primary_v")}>
          <NumberInput
            value={primaryVoltage}
            onValueChange={(val) => setPrimaryVoltage(String(val))}
            unit={t("ohms_law.unit_voltage")}
            placeholder={t("transformer.enter_primary_v")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("transformer.secondary_voltage")} tooltip={t("transformer.enter_secondary_v")}>
          <NumberInput
            value={secondaryVoltage}
            onValueChange={(val) => setSecondaryVoltage(String(val))}
            unit={t("ohms_law.unit_voltage")}
            placeholder={t("transformer.enter_secondary_v")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("transformer.primary_turns")} tooltip={t("transformer.enter_primary_turns")}>
          <NumberInput
            value={primaryTurns}
            onValueChange={(val) => setPrimaryTurns(String(val))}
            unit={t("transformer.unit_turns")}
            placeholder={t("transformer.enter_primary_turns")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("transformer.secondary_turns")} tooltip={t("transformer.enter_secondary_turns")}>
          <NumberInput
            value={secondaryTurns}
            onValueChange={(val) => setSecondaryTurns(String(val))}
            unit={t("transformer.unit_turns")}
            placeholder={t("transformer.enter_secondary_turns")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("transformer.power")} tooltip={t("transformer.enter_power")}>
          <NumberInput
            value={power}
            onValueChange={(val) => setPower(String(val))}
            unit={t("common:units.W")}
            placeholder={t("transformer.enter_power")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("transformer.efficiency")} tooltip={t("transformer.enter_efficiency")}>
          <NumberInput
            value={efficiency}
            onValueChange={(val) => setEfficiency(String(val))}
            unit={t("common:units.percent")}
            placeholder={t("transformer.enter_efficiency")}
            min={0}
            max={100}
            step={0.1}
          />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("ohms_law.results_title")}</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("transformer.turns_ratio")}
            </div>
            <div className="text-2xl font-bold text-blue-600">1 : {result.turnsRatio.toFixed(2)}</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("transformer.voltage_ratio")}
            </div>
            <div className="text-2xl font-bold text-purple-600">{result.voltageRatio.toFixed(4)}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("transformer.primary_current")}
            </div>
            <div className="text-2xl font-bold text-green-600">{result.primaryCurrent} {t("ohms_law.unit_current")}</div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("transformer.secondary_current")}
            </div>
            <div className="text-2xl font-bold text-orange-600">{result.secondaryCurrent} {t("ohms_law.unit_current")}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("transformer.output_power")}
            </div>
            <div className="text-2xl font-bold text-primary">{result.outputPower} {t("ohms_law.unit_power")}</div>
          </div>

          <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("transformer.losses")}
            </div>
            <div className="text-2xl font-bold text-red-600">{result.losses} {t("ohms_law.unit_power")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("transformer.how_it_works")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("transformer.turns_voltage_relation")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("resistors_parallel.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("transformer.title")}
      description={t("transformer.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("resistors_parallel.footer_note")}
      className="rtl"
    />
  );
}
