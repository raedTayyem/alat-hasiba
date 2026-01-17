'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Cpu, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function ACCircuitCalculator() {
  const { t } = useTranslation('calc/electrical');
  const [resistance, setResistance] = useState<string>('');
  const [inductance, setInductance] = useState<string>('');
  const [capacitance, setCapacitance] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('');
  const [voltage, setVoltage] = useState<string>('');
  const [result, setResult] = useState<{
    impedance: number;
    phaseAngle: number;
    current: number;
    powerFactor: number;
    activePower: number;
    reactivePower: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const r = parseFloat(resistance);
    const l = parseFloat(inductance) / 1000; // mH to H
    const c = parseFloat(capacitance) / 1000000; // µF to F
    const f = parseFloat(frequency);
    const v = parseFloat(voltage);

    if (isNaN(r) || isNaN(f) || isNaN(v)) {
        setError(t('common.error.invalid_input'));
        return;
    }

    // Calculate reactances
    const xl = l ? 2 * Math.PI * f * l : 0; // Inductive reactance
    const xc = c ? 1 / (2 * Math.PI * f * c) : 0; // Capacitive reactance
    const x = xl - xc; // Net reactance

    // Calculate impedance: Z = √(R² + X²)
    const impedance = Math.sqrt(Math.pow(r, 2) + Math.pow(x, 2));

    // Calculate phase angle: φ = arctan(X/R)
    const phaseAngle = Math.atan(x / r) * (180 / Math.PI);

    // Calculate current: I = V / Z
    const current = v / impedance;

    // Calculate power factor: cos(φ)
    const powerFactor = Math.cos(phaseAngle * (Math.PI / 180));

    // Active power: P = V × I × cos(φ)
    const activePower = v * current * powerFactor;

    // Reactive power: Q = V × I × sin(φ)
    const reactivePower = v * current * Math.sin(phaseAngle * (Math.PI / 180));

    setResult({
      impedance: parseFloat(impedance.toFixed(3)),
      phaseAngle: parseFloat(phaseAngle.toFixed(2)),
      current: parseFloat(current.toFixed(3)),
      powerFactor: parseFloat(powerFactor.toFixed(3)),
      activePower: parseFloat(activePower.toFixed(2)),
      reactivePower: parseFloat(Math.abs(reactivePower).toFixed(2))
    });
  };

  const reset = () => {
    setResistance('');
    setInductance('');
    setCapacitance('');
    setFrequency('50');
    setVoltage('');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("resonance.resistance")} tooltip={t("resonance.enter_resistance")}>
          <NumberInput
            value={resistance}
            onValueChange={(val) => setResistance(val.toString())}
            placeholder={t("resonance.enter_resistance")}
            min={0}
            step={1}
            unit={t("ohms_law.unit_resistance")}
            startIcon={<Activity className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("inductor.inductance")} tooltip={t("inductor.enter_inductance")}>
          <NumberInput
            value={inductance}
            onValueChange={(val) => setInductance(val.toString())}
            placeholder={t("inductor.enter_inductance")}
            min={0}
            step={0.1}
            unit={t("ohms_law.unit_milli_henry")}
            startIcon={<Activity className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("resonance.capacitance")} tooltip={t("resonance.enter_capacitance")}>
          <NumberInput
            value={capacitance}
            onValueChange={(val) => setCapacitance(val.toString())}
            placeholder={t("resonance.enter_capacitance")}
            min={0}
            step={0.1}
            unit={t("ohms_law.unit_micro_farad")}
            startIcon={<Cpu className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("inductor.frequency")} tooltip={t("inductor.enter_frequency")}>
          <NumberInput
            value={frequency}
            onValueChange={(val) => setFrequency(val.toString())}
            placeholder={t("inductor.enter_frequency")}
            min={0}
            step={1}
            unit={t("ohms_law.unit_hertz")}
            startIcon={<Activity className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("ohms_law.voltage")} tooltip={t("ohms_law.enter_voltage")}>
          <NumberInput
            value={voltage}
            onValueChange={(val) => setVoltage(val.toString())}
            placeholder={t("ohms_law.enter_voltage")}
            min={0}
            step={1}
            unit={t("ohms_law.unit_voltage")}
            startIcon={<Activity className="h-4 w-4" />}
          />
        </FormField>
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
            <div className="text-sm text-foreground-70 mb-1">{t("ac_circuit.impedance")}</div>
            <div className="text-2xl font-bold text-primary">{result.impedance} {t("ohms_law.unit_resistance")}</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("ac_circuit.phase_angle")}</div>
            <div className="text-2xl font-bold text-blue-600">{result.phaseAngle}°</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("ohms_law.current")}</div>
            <div className="text-2xl font-bold text-green-600">{result.current} {t("ohms_law.unit_current")}</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("ac_circuit.power_factor")}</div>
            <div className="text-2xl font-bold text-purple-600">{result.powerFactor}</div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("ac_circuit.active_power")}</div>
            <div className="text-2xl font-bold text-orange-600">{result.activePower} {t("ohms_law.unit_power")}</div>
          </div>

          <div className="bg-pink-50 dark:bg-pink-950/20 border border-pink-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("ac_circuit.reactive_power")}</div>
            <div className="text-2xl font-bold text-pink-600">{result.reactivePower} {t("ohms_law.unit_volt_ampere_reactive")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            {t("ac_circuit.how_it_works")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("ac_circuit.formula_impedance")}</li>
            <li>{t("ac_circuit.formula_current")}</li>
            <li>{t("ac_circuit.formula_power")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("ac_circuit.enter_params")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("ac_circuit.title")}
      description={t("ac_circuit.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("resistors_parallel.footer_note")}
     className="rtl" />
  );
}
