'use client';

/**
 * VAT Calculator
 * Add VAT to price or extract VAT from price
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Percent, Plus, Tag } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface VATResult {
  priceWithoutVAT: number;
  vatAmount: number;
  priceWithVAT: number;
  vatRate: number;
  mode: 'add' | 'extract';
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function VATCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation('calc/business');
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [price, setPrice] = useState<string>('');
  const [vatRate, setVatRate] = useState<string>('15');
  const [mode, setMode] = useState<'add' | 'extract'>('add');

  // Result state
  const [result, setResult] = useState<VATResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    initDateInputRTL();
  }, []);

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const priceValue = parseFloat(price);
    const rateValue = parseFloat(vatRate);

    if (isNaN(priceValue) || isNaN(rateValue)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (priceValue <= 0 || rateValue < 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (rateValue > 100) {
      setError(t("errors.invalid_input"));
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------------------------
  // CALCULATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const priceValue = parseFloat(price);
        const rateValue = parseFloat(vatRate);

        let priceWithoutVAT: number;
        let vatAmount: number;
        let priceWithVAT: number;

        if (mode === 'add') {
          // Add VAT to price
          priceWithoutVAT = priceValue;
          vatAmount = (priceValue * rateValue) / 100;
          priceWithVAT = priceValue + vatAmount;
        } else {
          // Extract VAT from price
          priceWithVAT = priceValue;
          priceWithoutVAT = priceValue / (1 + rateValue / 100);
          vatAmount = priceValue - priceWithoutVAT;
        }

        setResult({
          priceWithoutVAT,
          vatAmount,
          priceWithVAT,
          vatRate: rateValue,
          mode
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setPrice('');
      setVatRate('15');
      setMode('add');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const setQuickRate = (rate: number) => {
    setVatRate(rate.toString());
    if (error) setError('');
  };

  const modeOptions = [
    { value: 'add', label: t("vat.inputs.add_vat") },
    { value: 'extract', label: t("vat.inputs.extract_vat") },
  ];

  // ---------------------------------------------------------------------------
  // JSX SECTIONS
  // ---------------------------------------------------------------------------

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("vat.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">

        <FormField
          label={t("vat.inputs.mode")}
          tooltip={t("vat.inputs.mode_tooltip")}
        >
          <Combobox
            options={modeOptions}
            value={mode}
            onChange={(val) => setMode(val as 'add' | 'extract')}
            placeholder={t("vat.inputs.mode")}
          />
        </FormField>

        <FormField
          label={mode === 'add' ? t("vat.results.price_without") : t("vat.results.price_with")}
          tooltip={mode === 'add' ? t("vat.inputs.price_tooltip") : t("vat.inputs.price_tooltip")}
        >
          <NumberInput
            value={price}
            onValueChange={(val) => {
              setPrice(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={mode === 'add' ? t("vat.inputs.price_placeholder") : t("vat.inputs.price_placeholder")}
            startIcon={<Tag className="h-4 w-4" />}
            min={0}
            step={0.01}
          />
        </FormField>

        <FormField
          label={t("vat.inputs.rate")}
          tooltip={t("vat.inputs.rate_tooltip")}
        >
          <NumberInput
            value={vatRate}
            onValueChange={(val) => {
              setVatRate(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("vat.inputs.rate_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            min={0}
            max={100}
            step={0.1}
          />
        </FormField>

        {/* Quick VAT Rate Buttons */}
        <div className="flex gap-2 justify-center flex-wrap">
          {[5, 10, 15, 20, 25].map(rate => (
            <button
              key={rate}
              onClick={() => setQuickRate(rate)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                vatRate === rate.toString()
                  ? 'bg-primary text-white border-primary'
                  : 'bg-background border-border hover:border-primary'
              }`}
            >
              {rate}%
            </button>
          ))}
        </div>

      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("vat.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("vat.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("vat.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("vat.info.use_case_1")}</li>
              <li>{t("vat.info.use_case_2")}</li>
              <li>{t("vat.info.use_case_3")}</li>
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
          {result.mode === 'add' ? t("vat.results.final_price_with") : t("vat.results.final_price_without")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          ${formatNumber(result.mode === 'add' ? result.priceWithVAT : result.priceWithoutVAT)}
        </div>
        <div className="text-lg text-foreground-70">
          {result.mode === 'add' ? t("vat.results.including") : t("vat.results.excluding")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("vat.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("vat.results.price_without")}</div>
            </div>
            <div className="text-2xl font-bold">
              ${formatNumber(result.priceWithoutVAT)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Plus className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("vat.results.vat_amount")}</div>
            </div>
            <div className="text-2xl font-bold text-success">
              ${formatNumber(result.vatAmount)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Tag className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("vat.results.price_with")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              ${formatNumber(result.priceWithVAT)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("vat.results.rate")}</div>
            </div>
            <div className="text-2xl font-bold">
              {result.vatRate}%
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
            <h4 className="font-medium mb-1">{t("vat.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {result.mode === 'add'
                ? t("vat.results.formula_add")
                : t("vat.results.formula_extract")}
            </p>
          </div>
        </div>
      </div>

    </div>
  ) : null;

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <CalculatorLayout
      title={t("vat.title")}
      description={t("vat.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
