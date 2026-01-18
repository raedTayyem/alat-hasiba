'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function PowerFactorCalculator() {
  const { t } = useTranslation('calc/electrical');
  const [activePower, setActivePower] = useState<string>('');
  const [reactivePower, setReactivePower] = useState<string>('');
  const [targetPF, setTargetPF] = useState<string>('0.95');
  const [voltage, setVoltage] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('');
  const [result, setResult] = useState<{
    currentPF: number;
    phaseAngle: number;
    apparentPower: number;
    capacitorKVAR: number;
    capacitorUF: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const p = parseFloat(activePower);
    const q = parseFloat(reactivePower);
    const pf_target = parseFloat(targetPF);
    const v = parseFloat(voltage);
    const f = parseFloat(frequency);

    if (!p || !q || !pf_target || !v || !f) return;

    // Current power factor
    const s = Math.sqrt(Math.pow(p, 2) + Math.pow(q, 2));
    const currentPF = p / s;

    // Phase angle
    const phaseAngle = Math.acos(currentPF) * (180 / Math.PI);

    // Apparent power
    const apparentPower = p / currentPF;

    // Calculate required capacitor for improvement
    const currentAngle = Math.acos(currentPF);
    const targetAngle = Math.acos(pf_target);

    const q_current = p * Math.tan(currentAngle);
    const q_target = p * Math.tan(targetAngle);
    const capacitorKVAR = q_current - q_target;

    // Capacitor value in µF for three-phase
    // C = KVAR × 10^9 / (2πfV²)
    const capacitorUF = (capacitorKVAR * 1000 * 1000000) / (2 * Math.PI * f * Math.pow(v, 2));

    setResult({
      currentPF: parseFloat(currentPF.toFixed(3)),
      phaseAngle: parseFloat(phaseAngle.toFixed(2)),
      apparentPower: parseFloat(apparentPower.toFixed(2)),
      capacitorKVAR: parseFloat(Math.abs(capacitorKVAR).toFixed(2)),
      capacitorUF: parseFloat(capacitorUF.toFixed(2))
    });
  };

  const reset = () => {
    setActivePower('');
    setReactivePower('');
    setTargetPF('0.95');
    setVoltage('380');
    setFrequency('50');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("power_factor.active_power")} tooltip={t("power_factor.enter_active")}>
          <NumberInput
            value={activePower}
            onValueChange={(val) => setActivePower(String(val))}
            unit={t("ohms_law.unit_kilo_watt")}
            placeholder={t("power_factor.enter_active")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("power_factor.reactive_power")} tooltip={t("power_factor.enter_reactive")}>
          <NumberInput
            value={reactivePower}
            onValueChange={(val) => setReactivePower(String(val))}
            unit={t("ohms_law.unit_volt_ampere_reactive_kilo")}
            placeholder={t("power_factor.enter_reactive")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("power_factor.target_pf")} tooltip={t("power_factor.enter_target")}>
          <NumberInput
            value={targetPF}
            onValueChange={(val) => setTargetPF(String(val))}
            unit=""
            placeholder="0.95"
            min={0}
            max={1}
            step={0.01}
          />
        </InputContainer>

        <InputContainer label={t("power_factor.voltage")} tooltip={t("power_factor.enter_voltage")}>
          <NumberInput
            value={voltage}
            onValueChange={(val) => setVoltage(String(val))}
            unit={t("ohms_law.unit_voltage")}
            placeholder="380"
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("power_factor.frequency")} tooltip={t("power_factor.enter_frequency")}>
          <NumberInput
            value={frequency}
            onValueChange={(val) => setFrequency(String(val))}
            unit={t("ohms_law.unit_hertz")}
            placeholder="50"
            min={0}
            step={1}
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
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("power_factor.current_pf")}</div>
          <div className="text-3xl font-bold text-primary">{result.currentPF}</div>
            <div className="text-xs text-foreground-70 mt-1">{(result.currentPF * 100).toFixed(1)}%</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("power_factor.phase_angle")}</div>
          <div className="text-3xl font-bold text-blue-600">{result.phaseAngle}°</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("power_factor.apparent_power")}</div>
            <div className="text-2xl font-bold text-green-600">{result.apparentPower} {t("ohms_law.unit_volt_ampere_kilo")}</div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("power_factor.capacitor_rating")}</div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <div className="text-xs text-foreground-70">{t("power_factor.capacitor_rating")}</div>
                <div className="text-xl font-bold text-orange-600">{result.capacitorKVAR} {t("ohms_law.unit_volt_ampere_reactive_kilo")}</div>
              </div>
              <div>
                <div className="text-xs text-foreground-70">{t("power_factor.capacitance")}</div>
                <div className="text-xl font-bold text-orange-600">{result.capacitorUF} {t("ohms_law.unit_micro_farad")}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("power_factor.how_it_works")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("power_factor.formula_pf")}</li>
            <li>{t("power_factor.formula_cap")}</li>
            <li>{t("power_factor.formula_uf")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("resistors_parallel.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("power_factor.title")}
      description={t("power_factor.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("resistors_parallel.footer_note")}
     className="rtl" />
  );
}
