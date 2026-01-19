'use client';

/**
 * Cake Servings Calculator
 * Calculates servings based on cake size and shape
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Info, Ruler } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CakeServingsResult {
  servings: number;
  cakeSize: string;
  cakeShape: string;
}

const CAKE_SERVINGS = {
  round: {
    '6': 6,
    '8': 12,
    '10': 20,
    '12': 30,
    '14': 40,
  },
  square: {
    '8': 16,
    '9': 24,
    '10': 30,
    '12': 40,
  },
  sheet: {
    '9x13': 24,
    '11x15': 35,
    '12x18': 54,
  },
};

export default function CakeServingCalculator() {
  const { t } = useTranslation(['calc/cooking', 'common']);
  const [cakeShape, setCakeShape] = useState<string>('round');
  const [cakeSize, setCakeSize] = useState<string>('8');

  const [result, setResult] = useState<CakeServingsResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const getSizeOptions = () => {
    const sizes = Object.keys(CAKE_SERVINGS[cakeShape as keyof typeof CAKE_SERVINGS]);
    return sizes.map(size => ({
      value: size,
      label: `${size}${t("common:common.units.in")} ${cakeShape !== 'sheet' ? t("cake-serving-calculator.size_suffix") : ''}`
    }));
  };

  const calculate = () => {
    setShowResult(false);

    setTimeout(() => {
      try {
        const shapeData = CAKE_SERVINGS[cakeShape as keyof typeof CAKE_SERVINGS];
        const servings = (shapeData as Record<string, number>)[cakeSize] || 0;

        setResult({
          servings,
          cakeSize,
          cakeShape,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("cake-serving-calculator.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCakeShape('round');
      setCakeSize('8');
      setResult(null);
      setError('');
    }, 300);
  };

  useEffect(() => {
    // Reset size when shape changes
    const newSizeOptions = getSizeOptions();
    const shapeData = CAKE_SERVINGS[cakeShape as keyof typeof CAKE_SERVINGS];
    if (!(shapeData as Record<string, number>)[cakeSize]) {
      setCakeSize(newSizeOptions[0].value);
    }
  }, [cakeShape]);

  const shapeOptions = [
    { value: 'round', label: t("cake-serving-calculator.shape_round") },
    { value: 'square', label: t("cake-serving-calculator.shape_square") },
    { value: 'sheet', label: t("cake-serving-calculator.shape_sheet") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("cake-serving-calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("cake-serving-calculator.cake_shape_label")}
          tooltip={t("cake-serving-calculator.cake_shape_tooltip")}
        >
          <Combobox
            options={shapeOptions}
            value={cakeShape}
            onChange={(val) => setCakeShape(val)}
            placeholder={t("cake-serving-calculator.cake_shape_label")}
          />
        </FormField>

        <FormField
          label={t("cake-serving-calculator.cake_size_label")}
          tooltip={t("cake-serving-calculator.cake_size_tooltip")}
        >
          <Combobox
            options={getSizeOptions()}
            value={cakeSize}
            onChange={(val) => setCakeSize(val)}
            placeholder={t("cake-serving-calculator.cake_size_label")}
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
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("cake-serving-calculator.info_title")}</h2>
            <p className="text-foreground-70 mb-3">{t("cake-serving-calculator.info_description")}</p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t("cake-serving-calculator.use_cases_title")}</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("cake-serving-calculator.use_case_1")}</li>
              <li>{t("cake-serving-calculator.use_case_2")}</li>
              <li>{t("cake-serving-calculator.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("cake-serving-calculator.result_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{(result.servings).toFixed(0)}</div>
        <div className="text-lg text-foreground-70">{t("cake-serving-calculator.servings_unit")}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("cake-serving-calculator.details_title")}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("cake-serving-calculator.cake_shape_result_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">{t(`cake-serving-calculator.shape_${result.cakeShape}`)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("cake-serving-calculator.cake_size_result_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">{result.cakeSize}{t("common:common.units.in")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("cake-serving-calculator.per_serving_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">1{t("common:common.units.in")} x 2{t("common:common.units.in")} {t("cake-serving-calculator.slice_size_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("cake-serving-calculator.cutting_style_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">{t("cake-serving-calculator.party_style")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("cake-serving-calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">{t("cake-serving-calculator.formula_explanation")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("cake-serving-calculator.title")}
      description={t("cake-serving-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
