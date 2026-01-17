'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, ArrowRightLeft, Info, Scale } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface UnitConversion {
  label: string;
  toNewtons: number;
}

export default function ForceConverter() {
  const { t } = useTranslation(['calc/converters', 'common']);

  const forceUnits: Record<string, UnitConversion> = {
    newton: { label: t("force.units.newton"), toNewtons: 1 },
    kilonewton: { label: t("force.units.kilonewton"), toNewtons: 1000 },
    poundForce: { label: t("force.units.pound_force"), toNewtons: 4.44822 },
    dyne: { label: t("force.units.dyne"), toNewtons: 0.00001 },
    kilogramForce: { label: t("force.units.kilogram_force"), toNewtons: 9.80665 },
  };

  const [fromUnit, setFromUnit] = useState<string>('newton');
  const [toUnit, setToUnit] = useState<string>('poundForce');
  const [inputValue, setInputValue] = useState<string>('100');
  const [result, setResult] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(true);

  useEffect(() => {
    initDateInputRTL();
  }, []);

  useEffect(() => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      const valueInNewtons = numValue * forceUnits[fromUnit].toNewtons;
      const convertedValue = valueInNewtons / forceUnits[toUnit].toNewtons;
      setResult(convertedValue);
    } else {
      setResult(0);
    }
  }, [inputValue, fromUnit, toUnit]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowResult(true);
    }
  };

  const unitOptions = Object.entries(forceUnits).map(([key, unit]) => ({
    value: key,
    label: unit.label
  }));

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("force.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="p-4 border border-border rounded-lg bg-card">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            {t("common.from")}
          </h3>
          <FormField
            label={t("common.unit")}
            tooltip={t("force.from_tooltip")}
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
              tooltip={t("force.enter_value")}
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
            <Scale className="w-4 h-4 text-primary" />
            {t("common.to")}
          </h3>
          <FormField
            label={t("common.unit")}
            tooltip={t("force.to_tooltip")}
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
        <button onClick={() => setShowResult(!showResult)} className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0">
          <Calculator className="w-5 h-5 ml-1" />
          {t("common.calculate")}
        </button>
        <button onClick={() => { const temp = fromUnit; setFromUnit(toUnit); setToUnit(temp); }} className="outline-button flex items-center justify-center">
          <ArrowRightLeft className="w-5 h-5 ml-1" />
          {t("common.swap")}
        </button>
      </div>

      <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-bold mb-2 text-lg">{t("force.info_title")}</h2>
        <p className="text-foreground-70 mb-3">
          {t("force.info_desc")}
        </p>
      </div>

      <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-bold mb-2 text-lg">{t("force.use_cases.title")}</h2>
        <ul className="list-disc list-inside space-y-1 text-foreground-70">
          <li>{t("force.use_cases.case_1")}</li>
          <li>{t("force.use_cases.case_2")}</li>
          <li>{t("force.use_cases.case_3")}</li>
        </ul>
      </div>
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
            <div>1 {forceUnits[fromUnit].label}</div>
            <div>=</div>
            <div>{(result / parseFloat(inputValue || '1')).toFixed(4)} {forceUnits[toUnit].label}</div>
          </div>
        </div>
      </div>

      <div className="divider my-4"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-2">{t("common.selected_units")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-3 rounded-lg border border-border">
            <div className="font-medium mb-1">{forceUnits[fromUnit].label}</div>
            <div className="text-sm text-foreground-70">{t("common.source_unit")}</div>
          </div>
          <div className="bg-card p-3 rounded-lg border border-border">
            <div className="font-medium mb-1">{forceUnits[toUnit].label}</div>
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
              {t("force.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("force.title")}
      description={t("force.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
