'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, ArrowRightLeft, Info, Coins, AlertTriangle } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface Currency {
  label: string;
  symbol: string;
  toUSD: number; // Exchange rate to USD (base currency)
}

export default function CurrencyConverter() {
  const { t } = useTranslation(['calc/converters', 'common']);

  // Hardcoded exchange rates (as of approximate 2024 rates)
  // Note: These are static rates. Consider API integration for real-time rates in production.
  const currencies: Record<string, Currency> = {
    USD: { label: t("currency.usd"), symbol: "$", toUSD: 1 },
    EUR: { label: t("currency.eur"), symbol: "$", toUSD: 1.08 },
    GBP: { label: t("currency.gbp"), symbol: "$", toUSD: 1.27 },
    JPY: { label: t("currency.jpy"), symbol: "$", toUSD: 0.0067 },
    SAR: { label: t("currency.sar"), symbol: "$", toUSD: 0.27 },
    AED: { label: t("currency.aed"), symbol: "$", toUSD: 0.27 },
    EGP: { label: t("currency.egp"), symbol: "$", toUSD: 0.032 },
  };

  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('SAR');
  const [inputValue, setInputValue] = useState<string>('100');
  const [result, setResult] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(true);

  useEffect(() => {
    initDateInputRTL();
  }, []);

  useEffect(() => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      // Convert to USD first, then to target currency
      const valueInUSD = numValue * currencies[fromCurrency].toUSD;
      const convertedValue = valueInUSD / currencies[toCurrency].toUSD;
      setResult(convertedValue);
    } else {
      setResult(0);
    }
  }, [inputValue, fromCurrency, toCurrency]);

  const formatCurrency = (num: number): string => {
    if (num === 0) return '0.00';
    return num.toFixed(2);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowResult(true);
    }
  };

  const currencyOptions = Object.entries(currencies).map(([key, currency]) => ({
    value: key,
    label: currency.label
  }));

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("currency.title")}
      </div>

      {/* Rate Update Notice */}
      <div className="mb-6 p-3 bg-warning/10 rounded-lg border border-warning/20 text-sm text-center flex items-center justify-center gap-2">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <span className="mr-1">{t("currency.static_rates_notice")}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {/* From Currency */}
        <div className="p-4 border border-border rounded-lg bg-card">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Coins className="w-4 h-4 text-primary" />
            {t("currency.from")}
          </h3>
          <FormField
            label={t("currency.select_currency")}
            tooltip={t("currency.from_tooltip")}
          >
            <Combobox
              options={currencyOptions}
              value={fromCurrency}
              onChange={(val) => setFromCurrency(val)}
              placeholder={t("currency.select_currency")}
            />
          </FormField>

          <div className="mt-4">
            <FormField
              label={t("currency.amount")}
              tooltip={t("currency.amount_placeholder")}
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-70 z-10" dir="ltr">
                  {currencies[fromCurrency].symbol}
                </span>
                <NumberInput
                  value={inputValue}
                  onValueChange={(val) => setInputValue(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t("currency.amount_placeholder")}
                  min={0}
                  step={0.01}
                  className="pl-10"
                />
              </div>
            </FormField>
          </div>
        </div>

        {/* To Currency */}
        <div className="p-4 border border-border rounded-lg bg-card">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Coins className="w-4 h-4 text-primary" />
            {t("currency.to")}
          </h3>
          <FormField
            label={t("currency.select_currency")}
            tooltip={t("currency.to_tooltip")}
          >
            <Combobox
              options={currencyOptions}
              value={toCurrency}
              onChange={(val) => setToCurrency(val)}
              placeholder={t("currency.select_currency")}
            />
          </FormField>

          <div className="mt-4">
            <FormField
              label={t("currency.result")}
              tooltip={t("currency.result")}
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-70 z-10" dir="ltr">
                  {currencies[toCurrency].symbol}
                </span>
                <div className="w-full p-3 pl-10 border rounded-md bg-muted/30 text-lg font-medium" dir="ltr">
                  {formatCurrency(result)}
                </div>
              </div>
            </FormField>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4">
        <button
          onClick={() => setShowResult(!showResult)}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 ml-1" />
          {t("common.calculate")}
        </button>
        <button
          onClick={() => { const temp = fromCurrency; setFromCurrency(toCurrency); setToCurrency(temp); }}
          className="outline-button flex items-center justify-center"
        >
          <ArrowRightLeft className="w-5 h-5 ml-1" />
          {t("currency.swap")}
        </button>
      </div>

      <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-bold mb-2 text-lg">{t("currency.info_title")}</h2>
        <p className="text-foreground-70 mb-3">
          {t("currency.info_desc")}
        </p>
      </div>

      <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-bold mb-2 text-lg">{t("currency.use_cases")}</h2>
        <ul className="list-disc list-inside space-y-1 text-foreground-70">
          <li>{t("currency.use_case_1")}</li>
          <li>{t("currency.use_case_2")}</li>
          <li>{t("currency.use_case_3")}</li>
        </ul>
      </div>
    </>
  );

  const resultSection = (
    <div className={`bg-card-bg border border-border rounded-xl p-6 shadow-sm h-full space-y-6 ${showResult ? 'animate-fadeIn' : 'opacity-0'}`}>
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-2">{t("currency.exchange_rate")}</h3>
        <div className="p-4 bg-primary/5 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("currency.current_rate")}</div>
          <div className="text-2xl font-mono" dir="ltr">
            1 {fromCurrency} = {formatCurrency(1 / currencies[toCurrency].toUSD * currencies[fromCurrency].toUSD)} {toCurrency}
          </div>
        </div>
      </div>

      <div className="divider my-4"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-2">{t("currency.details")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-3 rounded-lg border border-border">
            <div className="font-medium mb-1">{t("currency.you_send")}</div>
            <div className="text-lg" dir="ltr">{currencies[fromCurrency].symbol} {formatCurrency(parseFloat(inputValue) || 0)}</div>
            <div className="text-sm text-foreground-70">{currencies[fromCurrency].label}</div>
          </div>
          <div className="bg-card p-3 rounded-lg border border-border">
            <div className="font-medium mb-1">{t("currency.they_receive")}</div>
            <div className="text-lg text-primary" dir="ltr">{currencies[toCurrency].symbol} {formatCurrency(result)}</div>
            <div className="text-sm text-foreground-70">{currencies[toCurrency].label}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("currency.notice")}</h4>
            <p className="text-sm text-foreground-70">
              {t("currency.disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("currency.title")}
      description={t("currency.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
