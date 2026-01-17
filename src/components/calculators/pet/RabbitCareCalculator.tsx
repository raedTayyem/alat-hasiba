'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function RabbitCareCalculator() {
  const { t } = useTranslation('calc/pet');
  const [rabbitWeight, setRabbitWeight] = useState<string>('');
  const [rabbitSize, setRabbitSize] = useState<string>('medium');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{
    dailyHay: number;
    dailyPellets: number;
    dailyVeggies: number;
    hutchLength: number;
    hutchWidth: number;
    hutchHeight: number;
  } | null>(null);

  const calculate = () => {
    setError('');
    const weight = parseFloat(rabbitWeight);
    if (!weight || weight <= 0) {
      setError(t("rabbit-care-calculator.error_invalid_weight"));
      return;
    }

    // Food calculations (grams per day)
    const dailyHay = weight * 100; // Unlimited hay, estimate 100g per kg
    const dailyPellets = weight * 25; // 25g pellets per kg body weight
    const dailyVeggies = weight * 50; // 50g vegetables per kg

    // Hutch size (cm) - rabbit should be able to hop 3 times and stand fully upright
    const sizeFactors: Record<string, { l: number; w: number; h: number }> = {
      small: { l: 120, w: 60, h: 60 },
      medium: { l: 150, w: 75, h: 70 },
      large: { l: 180, w: 90, h: 80 }
    };

    const hutch = sizeFactors[rabbitSize];

    setResult({
      dailyHay: parseFloat(dailyHay.toFixed(0)),
      dailyPellets: parseFloat(dailyPellets.toFixed(0)),
      dailyVeggies: parseFloat(dailyVeggies.toFixed(0)),
      hutchLength: hutch.l,
      hutchWidth: hutch.w,
      hutchHeight: hutch.h
    });
  };

  const reset = () => {
    setRabbitWeight('');
    setRabbitSize('medium');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("rabbit-care-calculator.input_title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("rabbit-care-calculator.rabbit_weight")}>
          <NumericInput value={rabbitWeight} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRabbitWeight(e.target.value)} unit={t("rabbit-care-calculator.kg")} placeholder={t("rabbit-care-calculator.enter_weight")} min={0} max={10} step={0.1} />
        </InputContainer>

        <InputContainer label={t("rabbit-care-calculator.rabbit_size")}>
          <select value={rabbitSize} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRabbitSize(e.target.value)} className="calculator-input w-full">
            <option value="small">{t("rabbit-care-calculator.size_small")}</option>
            <option value="medium">{t("rabbit-care-calculator.size_medium")}</option>
            <option value="large">{t("rabbit-care-calculator.size_large")}</option>
          </select>
        </InputContainer>
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("rabbit-care-calculator.calculate_btn")}
        resetText={t("rabbit-care-calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("rabbit-care-calculator.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <h4 className="font-bold mb-3">{t("rabbit-care-calculator.daily_diet")}</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{t("rabbit-care-calculator.daily_hay")}</span>
              <span className="font-bold text-primary">~{result.dailyHay}g</span>
            </div>
            <div className="flex justify-between">
              <span>{t("rabbit-care-calculator.daily_pellets")}</span>
              <span className="font-bold text-primary">{result.dailyPellets}g</span>
            </div>
            <div className="flex justify-between">
              <span>{t("rabbit-care-calculator.daily_veggies")}</span>
              <span className="font-bold text-primary">{result.dailyVeggies}g</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
          <h4 className="font-bold mb-2">{t("rabbit-care-calculator.hutch_size")}</h4>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div>
              <div className="text-xs text-foreground-50">{t("rabbit-care-calculator.hutch_length")}</div>
              <div className="text-lg font-bold text-blue-600">{result.hutchLength} {t("rabbit-care-calculator.cm")}</div>
            </div>
            <div>
              <div className="text-xs text-foreground-50">{t("rabbit-care-calculator.hutch_width")}</div>
              <div className="text-lg font-bold text-blue-600">{result.hutchWidth} {t("rabbit-care-calculator.cm")}</div>
            </div>
            <div>
              <div className="text-xs text-foreground-50">{t("rabbit-care-calculator.hutch_height")}</div>
              <div className="text-lg font-bold text-blue-600">{result.hutchHeight} {t("rabbit-care-calculator.cm")}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 rounded-lg">
          <h4 className="font-bold mb-2">{t("rabbit-care-calculator.tips_title")}</h4>
          <ul className="text-sm space-y-1 list-disc ps-6">
            {(t("rabbit-care-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4"><span className="text-6xl">🐰</span></div>
      <p className="text-foreground-70">{t("rabbit-care-calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("rabbit-care-calculator.title")}
      description={t("rabbit-care-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("rabbit-care-calculator.footer_note")}
      className="rtl" />
  );
}
