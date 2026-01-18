'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, ArrowRightLeft, Info, HardDrive } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface UnitConversion {
  label: string;
  toBytes: (value: number, isBinary: boolean) => number;
  fromBytes: (value: number, isBinary: boolean) => number;
}

export default function DataStorageConverter() {
  const { t } = useTranslation(['calc/converters', 'common']);

  const dataUnits: Record<string, UnitConversion> = {
    byte: {
      label: t("data_storage.units.byte"),
      toBytes: (v) => v,
      fromBytes: (v) => v
    },
    kilobyte: {
      label: t("data_storage.units.kilobyte"),
      toBytes: (v, bin) => v * (bin ? 1024 : 1000),
      fromBytes: (v, bin) => v / (bin ? 1024 : 1000)
    },
    megabyte: {
      label: t("data_storage.units.megabyte"),
      toBytes: (v, bin) => v * Math.pow((bin ? 1024 : 1000), 2),
      fromBytes: (v, bin) => v / Math.pow((bin ? 1024 : 1000), 2)
    },
    gigabyte: {
      label: t("data_storage.units.gigabyte"),
      toBytes: (v, bin) => v * Math.pow((bin ? 1024 : 1000), 3),
      fromBytes: (v, bin) => v / Math.pow((bin ? 1024 : 1000), 3)
    },
    terabyte: {
      label: t("data_storage.units.terabyte"),
      toBytes: (v, bin) => v * Math.pow((bin ? 1024 : 1000), 4),
      fromBytes: (v, bin) => v / Math.pow((bin ? 1024 : 1000), 4)
    },
    petabyte: {
      label: t("data_storage.units.petabyte"),
      toBytes: (v, bin) => v * Math.pow((bin ? 1024 : 1000), 5),
      fromBytes: (v, bin) => v / Math.pow((bin ? 1024 : 1000), 5)
    },
  };

  const [fromUnit, setFromUnit] = useState<string>('gigabyte');
  const [toUnit, setToUnit] = useState<string>('megabyte');
  const [inputValue, setInputValue] = useState<string>('1');
  const [result, setResult] = useState<number>(0);
  const [isBinaryMode, setIsBinaryMode] = useState<boolean>(true); // Binary (1024) vs Decimal (1000)
  const [showResult, setShowResult] = useState<boolean>(true);

  useEffect(() => {
    initDateInputRTL();
  }, []);

  useEffect(() => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      convertData(numValue, fromUnit, toUnit);
    } else {
      setResult(0);
    }
  }, [inputValue, fromUnit, toUnit, isBinaryMode]);

  const convertData = (value: number, from: string, to: string) => {
    const valueInBytes = dataUnits[from].toBytes(value, isBinaryMode);
    const convertedValue = dataUnits[to].fromBytes(valueInBytes, isBinaryMode);
    setResult(convertedValue);
  };

  const handleConvert = () => {
    setShowResult(false);
    setTimeout(() => {
      setShowResult(true);
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

  const unitOptions = Object.entries(dataUnits).map(([key, unit]) => ({
    value: key,
    label: unit.label
  }));

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("data_storage.title")}
      </div>

      {/* Binary/Decimal Mode Toggle */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-lg border border-border bg-background p-1">
          <button
            onClick={() => setIsBinaryMode(true)}
            className={`px-4 py-2 rounded-md transition-all ${
              isBinaryMode
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-foreground-70 hover:text-foreground'
            }`}
          >
            {t("data_storage.binary_mode")}
          </button>
          <button
            onClick={() => setIsBinaryMode(false)}
            className={`px-4 py-2 rounded-md transition-all ${
              !isBinaryMode
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-foreground-70 hover:text-foreground'
            }`}
          >
            {t("data_storage.decimal_mode")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className="p-4 border border-border rounded-lg bg-card">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-primary" />
            {t("common.from")}
          </h3>
          <FormField
            label={t("common.unit")}
            tooltip={t("data_storage.from_tooltip")}
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
              tooltip={t("data_storage.enter_value")}
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
            <HardDrive className="w-4 h-4 text-primary" />
            {t("common.to")}
          </h3>
          <FormField
            label={t("common.unit")}
            tooltip={t("data_storage.to_tooltip")}
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
                {(result).toFixed(2)}
              </div>
            </FormField>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4">
        <button
          onClick={handleConvert}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 ml-1" />
          {t("common.calculate")}
        </button>
        <button
          onClick={handleSwapUnits}
          className="outline-button flex items-center justify-center"
        >
          <ArrowRightLeft className="w-5 h-5 ml-1" />
          {t("common.swap")}
        </button>
      </div>

      <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-bold mb-2 text-lg">{t("data_storage.info_title")}</h2>
        <p className="text-foreground-70 mb-3">
          {t("data_storage.info_desc")}
        </p>
      </div>

      <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-bold mb-2 text-lg">{t("data_storage.use_cases.title")}</h2>
        <ul className="list-disc list-inside space-y-1 text-foreground-70">
          <li>{t("data_storage.use_cases.case_1")}</li>
          <li>{t("data_storage.use_cases.case_2")}</li>
          <li>{t("data_storage.use_cases.case_3")}</li>
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
            <div>1 {dataUnits[fromUnit].label}</div>
            <div>=</div>
            <div>{(result / parseFloat(inputValue || '1')).toFixed(2)} {dataUnits[toUnit].label}</div>
          </div>
        </div>
      </div>

      <div className="divider my-4"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-2">{t("data_storage.conversion_mode")}</h3>
        <div className="bg-card p-3 rounded-lg border border-border">
          <div className="font-medium mb-1">
            {isBinaryMode ? t("data_storage.binary_1024") : t("data_storage.decimal_1000")}
          </div>
          <div className="text-sm text-foreground-70">
            {isBinaryMode
              ? t("data_storage.binary_desc")
              : t("data_storage.decimal_desc")}
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("common.conversion_formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("data_storage.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("data_storage.title")}
      description={t("data_storage.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
