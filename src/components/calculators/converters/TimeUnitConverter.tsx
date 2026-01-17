'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, ArrowRightLeft, Info, Clock } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface UnitConversion {
  label: string;
  toSeconds: number;
}

export default function TimeUnitConverter() {
  const { t } = useTranslation(['calc/converters', 'common']);

  const timeUnits: Record<string, UnitConversion> = {
    second: { label: t("time.units.second"), toSeconds: 1 },
    minute: { label: t("time.units.minute"), toSeconds: 60 },
    hour: { label: t("time.units.hour"), toSeconds: 3600 },
    day: { label: t("time.units.day"), toSeconds: 86400 },
    week: { label: t("time.units.week"), toSeconds: 604800 },
    month: { label: t("time.units.month"), toSeconds: 2629746 },
    year: { label: t("time.units.year"), toSeconds: 31556952 },
  };

  const [fromUnit, setFromUnit] = useState<string>('hour');
  const [toUnit, setToUnit] = useState<string>('minute');
  const [inputValue, setInputValue] = useState<string>('1');
  const [result, setResult] = useState<number>(0);
  const [recentConversions, setRecentConversions] = useState<Array<{
    from: string;
    to: string;
    value: number;
    result: number;
  }>>([]);
  const [showResult, setShowResult] = useState<boolean>(true);

  useEffect(() => {
    initDateInputRTL();
  }, []);

  useEffect(() => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      convertTime(numValue, fromUnit, toUnit);
    } else {
      setResult(0);
    }
  }, [inputValue, fromUnit, toUnit]);

  const convertTime = (value: number, from: string, to: string) => {
    const valueInSeconds = value * timeUnits[from].toSeconds;
    const convertedValue = valueInSeconds / timeUnits[to].toSeconds;
    setResult(convertedValue);
  };

  const handleConvert = () => {
    setShowResult(false);
    setTimeout(() => {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        setRecentConversions(prev => [{
          from: fromUnit,
          to: toUnit,
          value: numValue,
          result: result
        }, ...prev].slice(0, 5));
        setShowResult(true);
      }
    }, 300);
  };

  const handleSwapUnits = () => {
    setShowResult(false);
    setTimeout(() => {
      const temp = fromUnit;
      setFromUnit(toUnit);
      setToUnit(temp);
      setShowResult(true);
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConvert();
    }
  };

  const unitOptions = Object.entries(timeUnits).map(([key, unit]) => ({
    value: key,
    label: unit.label
  }));

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("time.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="p-4 border border-border rounded-lg bg-card">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            {t("common.from")}
          </h3>
          <FormField
            label={t("common.unit")}
            tooltip={t("time.from_tooltip")}
          >
            <Combobox
              options={unitOptions}
              value={fromUnit}
              onChange={(val) => setFromUnit(val)}
              placeholder={t("common.unit")}
            />
          </FormField>

          <div className="mt-4">
            <FormField
              label={t("common.value")}
              tooltip={t("time.enter_value")}
            >
              <NumberInput
                value={inputValue}
                onValueChange={(val) => setInputValue(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t("common.value")}
                min={0}
              />
            </FormField>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg bg-card">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            {t("common.to")}
          </h3>
          <FormField
            label={t("common.unit")}
            tooltip={t("time.to_tooltip")}
          >
            <Combobox
              options={unitOptions}
              value={toUnit}
              onChange={(val) => setToUnit(val)}
              placeholder={t("common.unit")}
            />
          </FormField>

          <div className="mt-4">
            <FormField
              label={t("common.result")}
              tooltip={t("common.result")}
            >
              <div className="w-full p-3 border rounded-md bg-muted/30 text-lg font-medium text-center" dir="ltr">
                {(result).toFixed(4)}
              </div>
            </FormField>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4">
        <button onClick={handleConvert} className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0">
          <Calculator className="w-5 h-5 ml-1" />
          {t("common.calculate")}
        </button>
        <button onClick={handleSwapUnits} className="outline-button flex items-center justify-center">
          <ArrowRightLeft className="w-5 h-5 ml-1" />
          {t("common.swap")}
        </button>
      </div>

      {recentConversions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-medium mb-3">{t("common.recent_conversions")}</h3>
          <div className="space-y-2">
            {recentConversions.map((conversion, index) => (
              <div key={index} className="p-3 bg-primary/5 rounded-md flex justify-between items-center text-sm">
                <span>{(conversion.value).toFixed(2)} {timeUnits[conversion.from].label}</span>
                <span className="text-primary">
                  <ArrowRightLeft className="h-4 w-4 inline mx-2" />
                </span>
                <span>{(conversion.result).toFixed(2)} {timeUnits[conversion.to].label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const resultSection = (
    <div className={`bg-card-bg border border-border rounded-xl p-6 shadow-sm h-full space-y-6 ${showResult ? 'animate-fadeIn' : 'opacity-0'}`}>
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-2">{t("common.conversion_table")}</h3>
        <div className="space-y-2 text-sm overflow-hidden rounded-md border border-border">
          <div className="grid grid-cols-3 gap-1 text-center font-medium bg-primary/10 p-2.5">
            <div>{t("common.from")}</div>
            <div>{t("common.equals")}</div>
            <div>{t("common.result")}</div>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center p-2.5 odd:bg-muted/20">
            <div>1 {timeUnits[fromUnit].label}</div>
            <div>=</div>
            <div>{(result / parseFloat(inputValue || '1')).toFixed(4)} {timeUnits[toUnit].label}</div>
          </div>
        </div>
      </div>

      <div className="divider my-4"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-2">{t("common.selected_units")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-3 rounded-lg border border-border">
            <div className="font-medium mb-1">{timeUnits[fromUnit].label}</div>
            <div className="text-sm text-foreground-70">{t("common.source_unit")}</div>
          </div>
          <div className="bg-card p-3 rounded-lg border border-border">
            <div className="font-medium mb-1">{timeUnits[toUnit].label}</div>
            <div className="text-sm text-foreground-70">{t("common.target_unit")}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("common.conversion_formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("time.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("time.title")}
      description={t("time.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
