'use client';

/**
 * EV Charging Calculator
 * Calculates charging time and cost for electric vehicles
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Battery, BatteryCharging, DollarSign, Clock, Info, Zap, Calculator, RotateCcw, Gauge } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface EVChargingResult {
  energyNeeded: number;
  chargeTime: number;
  chargeCost: number;
  level1Time: number;
  level2Time: number;
  dcFastTime: number;
  level1Cost: number;
  level2Cost: number;
  dcFastCost: number;
}

// Standard charger power levels (kW)
const CHARGER_LEVELS = {
  level1: 1.4,    // Level 1: Standard 120V outlet
  level2: 7.2,    // Level 2: 240V home charger
  dcFast: 50,     // DC Fast Charger
};

export default function EVChargingCalculator() {
  const { t } = useTranslation('calc/automotive');
  const [batteryCapacity, setBatteryCapacity] = useState<string>('');
  const [currentCharge, setCurrentCharge] = useState<string>('');
  const [targetCharge, setTargetCharge] = useState<string>('');
  const [chargerPower, setChargerPower] = useState<string>('');
  const [electricityRate, setElectricityRate] = useState<string>('');

  const [result, setResult] = useState<EVChargingResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const capacity = parseFloat(batteryCapacity);
    const current = parseFloat(currentCharge);
    const target = parseFloat(targetCharge);
    const power = parseFloat(chargerPower);
    const rate = parseFloat(electricityRate);

    if (isNaN(capacity) || isNaN(current) || isNaN(target)) {
      setError(t("ev_charging.error_missing_inputs"));
      return false;
    }

    if (capacity <= 0) {
      setError(t("ev_charging.error_positive_capacity"));
      return false;
    }

    if (current < 0 || current > 100) {
      setError(t("ev_charging.error_valid_current"));
      return false;
    }

    if (target < 0 || target > 100) {
      setError(t("ev_charging.error_valid_target"));
      return false;
    }

    if (target <= current) {
      setError(t("ev_charging.error_target_greater"));
      return false;
    }

    if (chargerPower && power <= 0) {
      setError(t("ev_charging.error_positive_power"));
      return false;
    }

    if (electricityRate && rate < 0) {
      setError(t("ev_charging.error_positive_rate"));
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
        const capacity = parseFloat(batteryCapacity);
        const current = parseFloat(currentCharge);
        const target = parseFloat(targetCharge);
        const power = parseFloat(chargerPower) || CHARGER_LEVELS.level2;
        const rate = parseFloat(electricityRate) || 0;

        // Energy needed = Battery Capacity × (Target% - Current%) / 100
        const energyNeeded = capacity * (target - current) / 100;

        // Charge time (hours) = Energy needed / Charger Power
        const chargeTime = energyNeeded / power;

        // Cost = Energy needed × Electricity Rate
        const chargeCost = energyNeeded * rate;

        // Calculate times for different charger levels
        const level1Time = energyNeeded / CHARGER_LEVELS.level1;
        const level2Time = energyNeeded / CHARGER_LEVELS.level2;
        const dcFastTime = energyNeeded / CHARGER_LEVELS.dcFast;

        // Calculate costs for different charger levels
        const level1Cost = energyNeeded * rate;
        const level2Cost = energyNeeded * rate;
        const dcFastCost = energyNeeded * rate;

        setResult({
          energyNeeded,
          chargeTime,
          chargeCost,
          level1Time,
          level2Time,
          dcFastTime,
          level1Cost,
          level2Cost,
          dcFastCost,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("ev_charging.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setBatteryCapacity('');
      setCurrentCharge('');
      setTargetCharge('');
      setChargerPower('');
      setElectricityRate('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const formatTime = (hours: number): string => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} ${t("ev_charging.minutes")}`;
    } else if (hours < 24) {
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      if (m === 0) {
        return `${h} ${t("ev_charging.hours")}`;
      }
      return `${h} ${t("ev_charging.hours")} ${m} ${t("ev_charging.minutes")}`;
    } else {
      const d = Math.floor(hours / 24);
      const h = Math.round(hours % 24);
      return `${d} ${t("ev_charging.days")} ${h} ${t("ev_charging.hours")}`;
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("ev_charging.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("ev_charging.battery_capacity")}
          tooltip={t("ev_charging.battery_capacity_tooltip")}
        >
          <NumberInput
            value={batteryCapacity}
            onValueChange={(val) => { setBatteryCapacity(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("ev_charging.placeholders.battery_capacity")}
            min={0}
            step={1}
            startIcon={<Battery className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("ev_charging.current_charge")}
          tooltip={t("ev_charging.current_charge_tooltip")}
        >
          <NumberInput
            value={currentCharge}
            onValueChange={(val) => { setCurrentCharge(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("ev_charging.placeholders.current_charge")}
            min={0}
            max={100}
            step={1}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("ev_charging.target_charge")}
          tooltip={t("ev_charging.target_charge_tooltip")}
        >
          <NumberInput
            value={targetCharge}
            onValueChange={(val) => { setTargetCharge(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("ev_charging.placeholders.target_charge")}
            min={0}
            max={100}
            step={1}
            startIcon={<BatteryCharging className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("ev_charging.charger_power")}
          tooltip={t("ev_charging.charger_power_tooltip")}
        >
          <NumberInput
            value={chargerPower}
            onValueChange={(val) => { setChargerPower(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("ev_charging.placeholders.charger_power")}
            min={0}
            step={0.1}
            startIcon={<Zap className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("ev_charging.electricity_rate")}
          tooltip={t("ev_charging.electricity_rate_tooltip")}
        >
          <NumberInput
            value={electricityRate}
            onValueChange={(val) => { setElectricityRate(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("ev_charging.placeholders.electricity_rate")}
            min={0}
            step={0.01}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button
          onClick={calculate}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 ml-1" />
          {t("common.calculate")}
        </button>

        <button
          onClick={resetCalculator}
          className="outline-button min-w-[120px] flex items-center justify-center"
        >
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
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("ev_charging.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("ev_charging.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("ev_charging.charger_types_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("ev_charging.level1_description")}</li>
              <li>{t("ev_charging.level2_description")}</li>
              <li>{t("ev_charging.dcfast_description")}</li>
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
          {t("ev_charging.result_title")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatTime(result.chargeTime)}
        </div>
        <div className="text-lg text-foreground-70">
          {result.energyNeeded.toFixed(2)} kWh {t("ev_charging.energy_needed")}
        </div>
        {electricityRate && (
          <div className="text-lg text-foreground-70">
            {t("common.currencySymbol")}{result.chargeCost.toFixed(2)} {t("ev_charging.total_cost")}
          </div>
        )}
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("ev_charging.charger_comparison")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-yellow-500 ml-2" />
              <div className="font-medium">{t("ev_charging.level1")}</div>
            </div>
            <div className="text-xs text-foreground-50 mb-2">{CHARGER_LEVELS.level1} kW</div>
            <div className="flex items-center text-sm text-foreground-70">
              <Clock className="w-4 h-4 ml-1" />
              {formatTime(result.level1Time)}
            </div>
            {electricityRate && (
              <div className="text-sm text-foreground-70 mt-1">
                {t("common.currencySymbol")}{result.level1Cost.toFixed(2)}
              </div>
            )}
          </div>

          <div className="bg-card p-4 rounded-lg border border-border border-primary">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-blue-500 ml-2" />
              <div className="font-medium">{t("ev_charging.level2")}</div>
            </div>
            <div className="text-xs text-foreground-50 mb-2">{CHARGER_LEVELS.level2} kW</div>
            <div className="flex items-center text-sm text-foreground-70">
              <Clock className="w-4 h-4 ml-1" />
              {formatTime(result.level2Time)}
            </div>
            {electricityRate && (
              <div className="text-sm text-foreground-70 mt-1">
                {t("common.currencySymbol")}{result.level2Cost.toFixed(2)}
              </div>
            )}
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-green-500 ml-2" />
              <div className="font-medium">{t("ev_charging.dcfast")}</div>
            </div>
            <div className="text-xs text-foreground-50 mb-2">{CHARGER_LEVELS.dcFast} kW</div>
            <div className="flex items-center text-sm text-foreground-70">
              <Clock className="w-4 h-4 ml-1" />
              {formatTime(result.dcFastTime)}
            </div>
            {electricityRate && (
              <div className="text-sm text-foreground-70 mt-1">
                {t("common.currencySymbol")}{result.dcFastCost.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("ev_charging.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("ev_charging.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("ev_charging.title")}
      description={t("ev_charging.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
