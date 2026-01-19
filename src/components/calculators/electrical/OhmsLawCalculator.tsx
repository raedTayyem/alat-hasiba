'use client';

/**
 * OHMS LAW CALCULATOR
 * Calculates voltage, current, resistance, and power using Ohm's Law
 * Formulas: V = IR, I = V/R, R = V/I, P = VI = I²R = V²/R
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

interface OhmsLawResult {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
  powerVI: number;
  powerI2R: number;
  powerV2R: number;
}

export default function OhmsLawCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [voltage, setVoltage] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const [resistance, setResistance] = useState<string>('');
  const [calculateFor, setCalculateFor] = useState<string>('voltage');

  const [result, setResult] = useState<OhmsLawResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');



  const validateInputs = (): boolean => {
    setError('');

    if (calculateFor === 'voltage') {
      const i = parseFloat(current);
      const r = parseFloat(resistance);

      if (isNaN(i) || isNaN(r)) {
        setError(t("common.errors.invalid"));
        return false;
      }

      if (i <= 0 || r <= 0) {
        setError(t("common.errors.positiveNumber"));
        return false;
      }
    } else if (calculateFor === 'current') {
      const v = parseFloat(voltage);
      const r = parseFloat(resistance);

      if (isNaN(v) || isNaN(r)) {
        setError(t("common.errors.invalid"));
        return false;
      }

      if (v <= 0 || r <= 0) {
        setError(t("common.errors.positiveNumber"));
        return false;
      }
    } else if (calculateFor === 'resistance') {
      const v = parseFloat(voltage);
      const i = parseFloat(current);

      if (isNaN(v) || isNaN(i)) {
        setError(t("common.errors.invalid"));
        return false;
      }

      if (v <= 0 || i <= 0) {
        setError(t("common.errors.positiveNumber"));
        return false;
      }
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
        let calcVoltage = 0;
        let calcCurrent = 0;
        let calcResistance = 0;

        if (calculateFor === 'voltage') {
          const i = parseFloat(current);
          const r = parseFloat(resistance);
          calcVoltage = i * r; // V = IR
          calcCurrent = i;
          calcResistance = r;
        } else if (calculateFor === 'current') {
          const v = parseFloat(voltage);
          const r = parseFloat(resistance);
          calcVoltage = v;
          calcCurrent = v / r; // I = V/R
          calcResistance = r;
        } else if (calculateFor === 'resistance') {
          const v = parseFloat(voltage);
          const i = parseFloat(current);
          calcVoltage = v;
          calcCurrent = i;
          calcResistance = v / i; // R = V/I
        }

        // Calculate power using all three formulas
        const powerVI = calcVoltage * calcCurrent; // P = VI
        const powerI2R = calcCurrent * calcCurrent * calcResistance; // P = I²R
        const powerV2R = (calcVoltage * calcVoltage) / calcResistance; // P = V²/R

        setResult({
          voltage: calcVoltage,
          current: calcCurrent,
          resistance: calcResistance,
          power: powerVI,
          powerVI,
          powerI2R,
          powerV2R,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common.errors.calculationError"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);

    setTimeout(() => {
      setVoltage('');
      setCurrent('');
      setResistance('');
      setCalculateFor('voltage');
      setResult(null);
      setError('');
    }, 300);
  };

  const calculateForOptions: ComboboxOption[] = [
    { value: 'voltage', label: t("ohms_law.voltage") },
    { value: 'current', label: t("ohms_law.current") },
    { value: 'resistance', label: t("ohms_law.resistance") }
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("ohms_law.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">

        <InputContainer
          label={t("ohms_law.calculate_for")}
          tooltip={t("ohms_law.calculate_for_tooltip")}
        >
          <Combobox
            options={calculateForOptions}
            value={calculateFor}
            onChange={(value) => {
              setCalculateFor(value);
              setResult(null);
              setError('');
            }}
          />
        </InputContainer>

        {calculateFor !== 'voltage' && (
          <InputContainer
            label={t("ohms_law.voltage")}
            tooltip={t("ohms_law.enter_voltage")}
          >
            <NumberInput
              value={voltage}
              onValueChange={(val) => {
                setVoltage(String(val));
                if (error) setError('');
              }}
              unit={t("ohms_law.unit_voltage")}
              placeholder={t("ohms_law.enter_voltage")}
              min={0}
              step={0.01}
            />
          </InputContainer>
        )}

        {calculateFor !== 'current' && (
          <InputContainer
            label={t("ohms_law.current")}
            tooltip={t("ohms_law.enter_current")}
          >
            <NumberInput
              value={current}
              onValueChange={(val) => {
                setCurrent(String(val));
                if (error) setError('');
              }}
              unit={t("ohms_law.unit_current")}
              placeholder={t("ohms_law.enter_current")}
              min={0}
              step={0.001}
            />
          </InputContainer>
        )}

        {calculateFor !== 'resistance' && (
          <InputContainer
            label={t("ohms_law.resistance")}
            tooltip={t("ohms_law.enter_resistance")}
          >
            <NumberInput
              value={resistance}
              onValueChange={(val) => {
                setResistance(String(val));
                if (error) setError('');
              }}
              unit={t("ohms_law.unit_resistance")}
              placeholder={t("ohms_law.enter_resistance")}
              min={0}
              step={0.1}
            />
          </InputContainer>
        )}
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("ohms_law.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("ohms_law.about_desc")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("ohms_law.formulas_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("ohms_law.formula_v")} ({t("ohms_law.voltage_formula")})</li>
              <li>{t("ohms_law.formula_i")} ({t("ohms_law.current_formula")})</li>
              <li>{t("ohms_law.formula_r")} ({t("ohms_law.resistance_formula")})</li>
              <li>{t("ohms_law.formula_p")} ({t("ohms_law.power_formula")})</li>
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
          {t("ohms_law.results_title")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.power).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("ohms_law.watts")} ({t("ohms_law.unit_power")})
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("ohms_law.electrical_parameters")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="font-medium">{t("ohms_law.voltage")}</div>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {(result.voltage).toFixed(2)} {t("ohms_law.unit_voltage")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="font-medium">{t("ohms_law.current")}</div>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {(result.current).toFixed(2)} {t("ohms_law.unit_current")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("ohms_law.resistance")}</div>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {(result.resistance).toFixed(2)} {t("ohms_law.unit_resistance")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="font-medium">{t("ohms_law.power")}</div>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {(result.power).toFixed(2)} {t("ohms_law.unit_power")}
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
            <h4 className="font-medium mb-1">{t("ohms_law.power_calculations")}</h4>
            <p className="text-sm text-foreground-70">
              {t("ohms_law.formula_p_vi")} = {(result.powerVI).toFixed(2)} {t("ohms_law.unit_power")}
            </p>
            <p className="text-sm text-foreground-70">
              {t("ohms_law.formula_p_i2r")} = {(result.powerI2R).toFixed(2)} {t("ohms_law.unit_power")}
            </p>
            <p className="text-sm text-foreground-70">
              {t("ohms_law.formula_p_v2r")} = {(result.powerV2R).toFixed(2)} {t("ohms_law.unit_power")}
            </p>
          </div>
        </div>
      </div>

    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("ohms_law.title")}
      description={t("ohms_law.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
