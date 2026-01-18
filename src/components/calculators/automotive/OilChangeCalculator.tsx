'use client';

/**
 * Oil Change Calculator - Oil change interval based on mileage/time, capacity, cost tracking
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Gauge, Calendar, DollarSign, Droplet, Info, AlertTriangle, Calculator, RotateCcw } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface OilChangeResult {
  nextChangeMileage: number;
  nextChangeDate: string;
  oilNeeded: number;
  estimatedCost: number;
  changesPerYear: number;
  annualCost: number;
}

export default function OilChangeCalculator() {
  const { t } = useTranslation('calc/automotive');
  const [currentMileage, setCurrentMileage] = useState<string>('');
  const [lastChangeDate, setLastChangeDate] = useState<string>('');
  const [changeInterval, setChangeInterval] = useState<string>('5000');
  const [engineSize, setEngineSize] = useState<string>('2.0');
  const [oilPrice, setOilPrice] = useState<string>('25');
  const [annualMileage, setAnnualMileage] = useState<string>('12000');
  const [result, setResult] = useState<OilChangeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');
    const cm = parseFloat(currentMileage);
    const ci = parseFloat(changeInterval);
    const es = parseFloat(engineSize);
    if (isNaN(cm) || isNaN(ci) || isNaN(es)) {
      setError(t("oil_change.error_missing_inputs"));
      return false;
    }
    if (cm < 0 || ci <= 0 || es <= 0) {
      setError(t("oil_change.error_positive_values"));
      return false;
    }
    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;
    setShowResult(false);
    setTimeout(() => {
      try {
        const cm = parseFloat(currentMileage);
        const ci = parseFloat(changeInterval);
        const es = parseFloat(engineSize);
        const op = parseFloat(oilPrice) || 25;
        const am = parseFloat(annualMileage) || 12000;

        const nextChangeMileage = cm + ci;

        let oilNeeded: number;
        if (es < 1.5) oilNeeded = 3.5;
        else if (es < 2.5) oilNeeded = 4.5;
        else if (es < 3.5) oilNeeded = 5;
        else if (es < 5.0) oilNeeded = 6;
        else if (es < 6.0) oilNeeded = 7;
        else oilNeeded = 8;

        const estimatedCost = op;
        const changesPerYear = am / ci;
        const annualCost = changesPerYear * estimatedCost;

        let nextChangeDate = '';
        if (lastChangeDate) {
          const lastDate = new Date(lastChangeDate);
          const monthsToAdd = Math.floor((ci / am) * 12);
          lastDate.setMonth(lastDate.getMonth() + monthsToAdd);
          nextChangeDate = lastDate.toISOString().split('T')[0];
        }

        setResult({ nextChangeMileage, nextChangeDate, oilNeeded, estimatedCost, changesPerYear, annualCost });
        setShowResult(true);
      } catch (err) {
        setError(t("oil_change.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCurrentMileage('');
      setLastChangeDate('');
      setChangeInterval('5000');
      setEngineSize('2.0');
      setOilPrice('25');
      setAnnualMileage('12000');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">{t("oil_change.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("oil_change.current_mileage")}
          tooltip={t("oil_change.current_mileage_tooltip")}
        >
          <NumberInput
            value={currentMileage}
            onValueChange={(val) => { setCurrentMileage(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("oil_change.placeholders.current_mileage")}
            min={0}
            step={1000}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("oil_change.change_interval")}
          tooltip={t("oil_change.change_interval_tooltip")}
        >
          <NumberInput
            value={changeInterval}
            onValueChange={(val) => { setChangeInterval(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("oil_change.placeholders.change_interval")}
            min={0}
            step={1000}
            startIcon={<RotateCcw className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("oil_change.engine_size")}
          tooltip={t("oil_change.engine_size_tooltip")}
        >
          <NumberInput
            value={engineSize}
            onValueChange={(val) => { setEngineSize(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("oil_change.placeholders.engine_size")}
            min={0}
            step={0.1}
            startIcon={<Droplet className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("oil_change.oil_price")}
          tooltip={t("oil_change.oil_price_tooltip")}
        >
          <NumberInput
            value={oilPrice}
            onValueChange={(val) => { setOilPrice(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("oil_change.placeholders.oil_price")}
            min={0}
            step={5}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("oil_change.annual_mileage")}
          tooltip={t("oil_change.annual_mileage_tooltip")}
        >
          <NumberInput
            value={annualMileage}
            onValueChange={(val) => { setAnnualMileage(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("oil_change.placeholders.annual_mileage")}
            min={0}
            step={1000}
            startIcon={<Calendar className="h-4 w-4" />}
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
          <AlertTriangle className="w-5 h-5 ml-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("oil_change.about_title")}</h2>
          <p className="text-foreground-70">{t("oil_change.about_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("oil_change.next_change")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{(result.nextChangeMileage).toFixed(2)} mi</div>
        {result.nextChangeDate && (<div className="text-lg text-foreground-70">{result.nextChangeDate}</div>)}
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("oil_change.maintenance_plan")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Droplet className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("oil_change.oil_capacity")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.oilNeeded).toFixed(2)} quarts</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("oil_change.cost_per_change")}</div>
            </div>
            <div className="text-sm text-foreground-70">${(result.estimatedCost).toFixed(2)}</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <RotateCcw className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("oil_change.changes_per_year")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.changesPerYear).toFixed(2)} changes</div>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("oil_change.annual_cost_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">${(result.annualCost).toFixed(2)}/year</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("oil_change.recommendation_title")}</h4>
            <p className="text-sm text-foreground-70">{t("oil_change.recommendation_text")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("oil_change.title")}
      description={t("oil_change.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
