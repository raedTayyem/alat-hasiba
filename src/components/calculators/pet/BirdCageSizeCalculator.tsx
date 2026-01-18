'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

export default function BirdCageSizeCalculator() {
  const { t } = useTranslation('calc/pet');
  const [birdType, setBirdType] = useState<string>('budgie');
  const [numberOfBirds, setNumberOfBirds] = useState<string>('1');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{
    minLength: number;
    minWidth: number;
    minHeight: number;
    barSpacing: number;
    perchDiameter: number;
  } | null>(null);

  const calculate = () => {
    setError('');
    const birds = parseFloat(numberOfBirds);
    if (!birds || birds <= 0) {
      setError(t("bird_cage_calculator.error_invalid_birds"));
      return;
    }

    // Minimum cage sizes (cm) for single bird
    const cageSizes: Record<string, { l: number; w: number; h: number; bar: number; perch: number }> = {
      budgie: { l: 50, w: 40, h: 60, bar: 1.2, perch: 1.5 },
      cockatiel: { l: 60, w: 50, h: 80, bar: 1.5, perch: 2.0 },
      lovebird: { l: 60, w: 50, h: 70, bar: 1.5, perch: 1.8 },
      conure: { l: 80, w: 60, h: 100, bar: 2.0, perch: 2.5 },
      parrot: { l: 100, w: 80, h: 120, bar: 2.5, perch: 3.0 },
      macaw: { l: 150, w: 100, h: 180, bar: 3.5, perch: 5.0 }
    };

    const base = cageSizes[birdType];

    // Increase size for multiple birds (add 50% for each additional bird)
    const multiplier = 1 + ((birds - 1) * 0.5);

    const minLength = Math.ceil(base.l * multiplier);
    const minWidth = Math.ceil(base.w * multiplier);
    const minHeight = Math.ceil(base.h);

    setResult({
      minLength,
      minWidth,
      minHeight,
      barSpacing: base.bar,
      perchDiameter: base.perch
    });
  };

  const reset = () => {
    setBirdType('budgie');
    setNumberOfBirds('1');
    setResult(null);
    setError('');
  };

  const birdTypeOptions: ComboboxOption[] = [
    { value: 'budgie', label: t("bird_cage_calculator.budgie") },
    { value: 'cockatiel', label: t("bird_cage_calculator.cockatiel") },
    { value: 'lovebird', label: t("bird_cage_calculator.lovebird") },
    { value: 'conure', label: t("bird_cage_calculator.conure") },
    { value: 'parrot', label: t("bird_cage_calculator.parrot") },
    { value: 'macaw', label: t("bird_cage_calculator.macaw") }
  ];

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("bird_cage_calculator.title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("bird_cage_calculator.bird_type")}>
          <Combobox
            options={birdTypeOptions}
            value={birdType}
            onChange={setBirdType}
            placeholder={t("bird_cage_calculator.bird_type")}
          />
        </InputContainer>

        <InputContainer label={t("bird_cage_calculator.number_of_birds")}>
          <NumericInput value={numberOfBirds} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumberOfBirds(e.target.value)} unit={t("aquarium_calculator.fish")} placeholder="1" min={1} max={10} step={1} />
        </InputContainer>
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("bird_cage_calculator.calculate_btn")}
        resetText={t("bird_cage_calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("bird_cage_calculator.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-2">{t("bird_cage_calculator.min_dimensions")}</div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-xs text-foreground-50">{t("bird_cage_calculator.length")}</div>
              <div className="text-xl font-bold text-primary">{result.minLength} {t("aquarium_calculator.length")}</div>
            </div>
            <div>
              <div className="text-xs text-foreground-50">{t("bird_cage_calculator.width")}</div>
              <div className="text-xl font-bold text-primary">{result.minWidth} {t("aquarium_calculator.width")}</div>
            </div>
            <div>
              <div className="text-xs text-foreground-50">{t("bird_cage_calculator.height")}</div>
              <div className="text-xl font-bold text-primary">{result.minHeight} {t("aquarium_calculator.height")}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("bird_cage_calculator.bar_spacing")}</div>
            <div className="text-2xl font-bold text-blue-600">{result.barSpacing} {t("aquarium_calculator.length")}</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("bird_cage_calculator.perch_diameter")}</div>
            <div className="text-2xl font-bold text-blue-600">{result.perchDiameter} {t("aquarium_calculator.length")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 rounded-lg">
          <h4 className="font-bold mb-2">{t("bird_cage_calculator.tips_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("bird-cage-size-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4"><span className="text-6xl">🦜</span></div>
      <p className="text-foreground-70">{t("bird_cage_calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("bird_cage_calculator.title")}
      description={t("bird_cage_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("bird-cage-size-calculator.tips.0")}
     className="rtl" />
  );
}
