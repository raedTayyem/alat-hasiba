'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Hash, Info, Binary, Cpu } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

export default function NumberSystemConverter() {
  const { t } = useTranslation(['calc/converters', 'common']);

  const numberSystems = {
    binary: { label: t("number_system.binary"), base: 2 },
    octal: { label: t("number_system.octal"), base: 8 },
    decimal: { label: t("number_system.decimal"), base: 10 },
    hexadecimal: { label: t("number_system.hexadecimal"), base: 16 },
  };

  const [fromBase, setFromBase] = useState<string>('decimal');
  const [inputValue, setInputValue] = useState<string>('42');
  const [results, setResults] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  useEffect(() => {
    convertNumber();
  }, [inputValue, fromBase]);

  const convertNumber = () => {
    if (!inputValue.trim()) {
      setResults({});
      setError('');
      return;
    }

    try {
      // Parse the input value from the selected base
      const decimalValue = parseInt(inputValue.trim(), numberSystems[fromBase as keyof typeof numberSystems].base);

      if (isNaN(decimalValue)) {
        setError(t("common.errors.invalid"));
        setResults({});
        return;
      }

      // Convert to all bases
      const newResults: Record<string, string> = {};
      Object.entries(numberSystems).forEach(([key, system]) => {
        if (system.base === 2) {
          newResults[key] = decimalValue.toString(2);
        } else if (system.base === 8) {
          newResults[key] = decimalValue.toString(8);
        } else if (system.base === 10) {
          newResults[key] = decimalValue.toString(10);
        } else if (system.base === 16) {
          newResults[key] = decimalValue.toString(16).toUpperCase();
        }
      });

      setResults(newResults);
      setError('');
    } catch (err) {
      setError(t("common.errors.calculationError"));
      setResults({});
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      convertNumber();
    }
  };

  const systemOptions = Object.entries(numberSystems).map(([key, system]) => ({
    value: key,
    label: system.label
  }));

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("number_system.title")}
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="p-4 border border-border rounded-lg bg-card">
          <FormField
            label={t("number_system.input_base")}
            tooltip={t("number_system.select_input_base")}
          >
            <Combobox
              options={systemOptions}
              value={fromBase}
              onChange={(val) => setFromBase(val)}
              placeholder={t("number_system.input_base")}
            />
          </FormField>

          <div className="mt-4">
            <FormField
              label={t("number_system.number_value")}
              tooltip={t("number_system.enter_number_value")}
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-70 z-10">
                  <Hash className="w-4 h-4" />
                </span>
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("number_system.enter_number")}
                  className="pl-10 font-mono text-lg"
                  dir="ltr"
                />
              </div>
            </FormField>
          </div>
        </div>

        {error && (
          <div className="text-error p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn">
            <Info className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="mr-2">{error}</span>
          </div>
        )}

        {Object.keys(results).length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-lg flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              {t("number_system.conversions")}
            </h3>
            {Object.entries(numberSystems).map(([key, system]) => (
              <div key={key} className="p-4 bg-card border border-border rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium flex items-center gap-2">
                    {key === 'binary' ? <Binary className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                    {system.label}
                  </span>
                  <span className="text-xs text-foreground-70 bg-muted px-2 py-1 rounded-full">{t("number_system.base")} {system.base}</span>
                </div>
                <div className="p-3 bg-muted/30 rounded-md font-mono text-lg break-all" dir="ltr">
                  {results[key] || '0'}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm">
          <h2 className="font-bold mb-2 text-lg">{t("number_system.info_title")}</h2>
          <p className="text-foreground-70 mb-3">
            {t("number_system.info_desc")}
          </p>
        </div>

        <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm">
          <h2 className="font-bold mb-2 text-lg">{t("number_system.use_cases.title")}</h2>
          <ul className="list-disc list-inside space-y-1 text-foreground-70">
            <li>{t("number_system.use_cases.case_1")}</li>
            <li>{t("number_system.use_cases.case_2")}</li>
            <li>{t("number_system.use_cases.case_3")}</li>
          </ul>
        </div>
      </div>
    </>
  );

  const resultSection = Object.keys(results).length > 0 ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm h-full space-y-6 animate-fadeIn">
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-2">{t("number_system.conversion_summary")}</h3>
        <div className="space-y-2 text-sm">
          <div className="p-3 bg-primary/5 rounded-md border border-primary/10">
            <div className="font-medium mb-1 text-primary">{t("number_system.decimal_value")}</div>
            <div className="text-2xl font-mono text-foreground" dir="ltr">{results.decimal}</div>
          </div>
        </div>
      </div>

      <div className="divider my-4"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-2">{t("number_system.all_representations")}</h3>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(numberSystems).filter(([key]) => key !== fromBase).map(([key, system]) => (
            <div key={key} className="bg-card p-3 rounded-lg border border-border">
              <div className="font-medium mb-1 text-sm text-foreground-70">{system.label}</div>
              <div className="text-lg font-mono text-primary break-all" dir="ltr">{results[key]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("common.conversion_formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("number_system.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("number_system.title")}
      description={t("number_system.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
