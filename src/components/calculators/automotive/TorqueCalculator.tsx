'use client';

/**
 * Torque Calculator
 * Torque = (HP × 5252) / RPM, converts between lb-ft and Nm
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Gauge, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface TorqueResult {
  torque: number;
  torqueNm: number;
  horsepower: number;
  rpm: number;
}

export default function TorqueCalculator() {
  const { t } = useTranslation('calc/automotive');
  const [horsepower, setHorsepower] = useState<string>('');
  const [rpm, setRpm] = useState<string>('');
  const [result, setResult] = useState<TorqueResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');
    const hp = parseFloat(horsepower);
    const r = parseFloat(rpm);
    if (isNaN(hp) || isNaN(r)) {
      setError(t("torque.error_missing_inputs"));
      return false;
    }
    if (hp <= 0 || r <= 0) {
      setError(t("torque.error_positive_values"));
      return false;
    }
    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;
    setShowResult(false);
    setTimeout(() => {
      try {
        const hp = parseFloat(horsepower);
        const r = parseFloat(rpm);
        const torque = (hp * 5252) / r;
        const torqueNm = torque * 1.35582;
        setResult({ torque, torqueNm, horsepower: hp, rpm: r });
        setShowResult(true);
      } catch (err) {
        setError(t("torque.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setHorsepower('');
      setRpm('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">{t("torque.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("torque.horsepower")} tooltip={t("torque.horsepower_tooltip")}>
          <NumberInput
            value={horsepower}
            onValueChange={(val) => { setHorsepower(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("torque.placeholders.horsepower")}
            min={0}
            step={10}
            startIcon={<Zap className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("torque.rpm")} tooltip={t("torque.rpm_tooltip")}>
          <NumberInput
            value={rpm}
            onValueChange={(val) => { setRpm(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("torque.placeholders.rpm")}
            min={0}
            step={100}
            startIcon={<Gauge className="h-4 w-4" />}
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
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("torque.about_title")}</h2>
          <p className="text-foreground-70">{t("torque.about_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("torque.result_title")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{(result.torque).toFixed(2)} {t("torque.units.lb_ft")}</div>
        <div className="text-lg text-foreground-70">{(result.torqueNm).toFixed(2)} {t("torque.units.nm")}</div>
      </div>
      <div className="divider my-6"></div>
      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("torque.calculation_details")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("torque.horsepower_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.horsepower).toFixed(2)} {t("torque.units.hp")}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Gauge className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("torque.rpm_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.rpm).toFixed(2)} {t("torque.units.rpm")}</div>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("torque.formula_title")}</h4>
            <p className="text-sm text-foreground-70">{t("torque.formula_explanation")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (<CalculatorLayout title={t("torque.title")} description={t("torque.description")} inputSection={inputSection} resultSection={resultSection} className="rtl" />);
}
