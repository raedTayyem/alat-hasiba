'use client';

/**
 * Markup Calculator
 *
 * Calculates markup and selling price
 * Formulas:
 * - Markup Amount = Cost × Markup Percentage / 100
 * - Selling Price = Cost + Markup Amount
 * - Markup Percentage = (Selling Price - Cost) / Cost × 100
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Percent, TrendingUp, Package } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  cost: number;
  markupPercentage: number;
  markupAmount: number;
  sellingPrice: number;
  profitMargin: number;
}

type CalculationMode = 'percentage' | 'selling_price';

export default function MarkupCalculator() {
  const { t } = useTranslation('calc/business');
  const [cost, setCost] = useState<string>('');
  const [markupPercentage, setMarkupPercentage] = useState<string>('');
  const [sellingPrice, setSellingPrice] = useState<string>('');
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('percentage');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const costValue = parseFloat(cost);

    if (isNaN(costValue) || costValue <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (calculationMode === 'percentage') {
      const markup = parseFloat(markupPercentage);
      if (isNaN(markup) || markup < 0) {
        setError(t("markup.errors.invalid_percentage"));
        return false;
      }
    } else {
      const selling = parseFloat(sellingPrice);
      if (isNaN(selling) || selling < costValue) {
        setError(t("markup.errors.invalid_selling_price"));
        return false;
      }
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
        const costValue = parseFloat(cost);
        let markupPct: number;
        let markupAmt: number;
        let selling: number;

        if (calculationMode === 'percentage') {
          markupPct = parseFloat(markupPercentage);
          markupAmt = costValue * (markupPct / 100);
          selling = costValue + markupAmt;
        } else {
          selling = parseFloat(sellingPrice);
          markupAmt = selling - costValue;
          markupPct = (markupAmt / costValue) * 100;
        }

        // Profit margin = (Selling - Cost) / Selling × 100
        const profitMargin = ((selling - costValue) / selling) * 100;

        setResult({
          cost: costValue,
          markupPercentage: markupPct,
          markupAmount: markupAmt,
          sellingPrice: selling,
          profitMargin: profitMargin,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCost('');
      setMarkupPercentage('');
      setSellingPrice('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("markup.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("markup.inputs.calculation_mode")}
          tooltip={t("markup.inputs.calculation_mode_tooltip")}
        >
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCalculationMode('percentage')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                calculationMode === 'percentage'
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {t("markup.inputs.by_percentage")}
            </button>
            <button
              type="button"
              onClick={() => setCalculationMode('selling_price')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                calculationMode === 'selling_price'
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {t("markup.inputs.by_selling_price")}
            </button>
          </div>
        </FormField>

        <FormField
          label={t("markup.inputs.cost")}
          tooltip={t("markup.inputs.cost_tooltip")}
        >
          <NumberInput
            value={cost}
            onValueChange={(val) => {
              setCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("markup.inputs.cost_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        {calculationMode === 'percentage' ? (
          <FormField
            label={t("markup.inputs.markup_percentage")}
            tooltip={t("markup.inputs.markup_percentage_tooltip")}
          >
            <NumberInput
              value={markupPercentage}
              onValueChange={(val) => {
                setMarkupPercentage(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t("markup.inputs.markup_percentage_placeholder")}
              startIcon={<Percent className="h-4 w-4" />}
              min={0}
            />
          </FormField>
        ) : (
          <FormField
            label={t("markup.inputs.selling_price")}
            tooltip={t("markup.inputs.selling_price_tooltip")}
          >
            <NumberInput
              value={sellingPrice}
              onValueChange={(val) => {
                setSellingPrice(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t("markup.inputs.selling_price_placeholder")}
              startIcon={<DollarSign className="h-4 w-4" />}
              min={0}
            />
          </FormField>
        )}
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("markup.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("markup.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("markup.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("markup.info.use_case_1")}</li>
              <li>{t("markup.info.use_case_2")}</li>
              <li>{t("markup.info.use_case_3")}</li>
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
          {t("markup.results.selling_price")}
        </div>
        <div className="text-4xl font-bold mb-2 text-success">
          ${formatNumber(result.sellingPrice)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("markup.results.markup_amount")}: ${formatNumber(result.markupAmount)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("markup.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("markup.results.cost")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.cost)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("markup.results.markup_percentage")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.markupPercentage)}%</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t("markup.results.markup_amount")}</div>
            </div>
            <div className="text-2xl font-bold text-success">+${formatNumber(result.markupAmount)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-info ml-2" />
              <div className="font-medium">{t("markup.results.profit_margin")}</div>
            </div>
            <div className="text-2xl font-bold text-info">{formatNumber(result.profitMargin)}%</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <TrendingUp className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("calculators.formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("markup.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("markup.title")}
      description={t("markup.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
