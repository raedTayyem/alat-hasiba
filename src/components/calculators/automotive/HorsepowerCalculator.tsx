'use client';

/**
 * Horsepower Calculator
 * HP = (Torque × RPM) / 5252, converts between HP, kW, PS
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Gauge, Calculator, RotateCcw, Info, Activity } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface HorsepowerResult {
  horsepower: number;
  kilowatts: number;
  pferdestarke: number;
  torque: number;
  rpm: number;
}

export default function HorsepowerCalculator() {
  const { t } = useTranslation('calc/automotive');
  const [torque, setTorque] = useState<string>('');
  const [rpm, setRpm] = useState<string>('');
  const [inputUnit, setInputUnit] = useState<string>('lbft');
  const [result, setResult] = useState<HorsepowerResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');
    const torqueVal = parseFloat(torque);
    const rpmVal = parseFloat(rpm);
    if (isNaN(torqueVal) || isNaN(rpmVal)) {
      setError(t("horsepower.error_missing_inputs"));
      return false;
    }
    if (torqueVal <= 0 || rpmVal <= 0) {
      setError(t("horsepower.error_positive_values"));
      return false;
    }
    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;
    setShowResult(false);
    setTimeout(() => {
      try {
        let tVal = parseFloat(torque);
        const rVal = parseFloat(rpm);
        if (inputUnit === 'nm') tVal = tVal / 1.35582; // Convert Nm to lb-ft
        const horsepower = (tVal * rVal) / 5252;
        const kilowatts = horsepower * 0.745700;
        const pferdestarke = horsepower * 1.01387;
        setResult({ horsepower, kilowatts, pferdestarke, torque: tVal, rpm: rVal });
        setShowResult(true);
      } catch (err) {
        setError(t("horsepower.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setTorque('');
      setRpm('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const unitOptions = [
    { value: 'lbft', label: t("horsepower.lb_ft") },
    { value: 'nm', label: t("horsepower.nm") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">{t("horsepower.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("horsepower.torque_unit")}
          tooltip={t("horsepower.torque_unit_tooltip")}
        >
          <Combobox
            options={unitOptions}
            value={inputUnit}
            onChange={(val) => setInputUnit(val)}
            placeholder={t("horsepower.torque_unit")}
          />
        </FormField>

        <FormField
          label={t("horsepower.torque")}
          tooltip={t("horsepower.torque_tooltip")}
        >
          <NumberInput
            value={torque}
            onValueChange={(val) => { setTorque(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("horsepower.placeholders.torque")}
            min={0}
            step={10}
            startIcon={<Zap className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("horsepower.rpm")}
          tooltip={t("horsepower.rpm_tooltip")}
        >
          <NumberInput
            value={rpm}
            onValueChange={(val) => { setRpm(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("horsepower.placeholders.rpm")}
            min={0}
            step={100}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0">
          <Calculator className="w-5 h-5 ml-1" />
          {t("common.calculate")}
        </button>
        <button onClick={resetCalculator} className="outline-button min-w-[120px] flex items-center justify-center">
          <RotateCcw className="w-5 h-5 ml-1" />
          {t("common.reset")}
        </button>
      </div>

      {error && (
        <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn max-w-md mx-auto">
          <Info className="w-5 h-5 ml-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("horsepower.about_title")}</h2>
          <p className="text-foreground-70">{t("horsepower.about_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("horsepower.result_title")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{(result.horsepower).toFixed(2)} {t("horsepower.units.hp")}</div>
        <div className="text-lg text-foreground-70">{(result.kilowatts).toFixed(2)} {t("horsepower.units.kw")}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("horsepower.conversions")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Activity className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("horsepower.ps")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.pferdestarke).toFixed(2)} {t("horsepower.units.ps")}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("horsepower.torque_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.torque).toFixed(2)} {t("horsepower.units.lb_ft")} @ {(result.rpm).toFixed(2)} {t("horsepower.units.rpm")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("horsepower.formula_title")}</h4>
            <p className="text-sm text-foreground-70">{t("horsepower.formula_explanation")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("horsepower.title")}
      description={t("horsepower.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
