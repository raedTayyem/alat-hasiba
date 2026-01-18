'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

export default function AquariumCalculator() {
  const { t } = useTranslation('calc/pet');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [fishSize, setFishSize] = useState<string>('small');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{
    volume: number;
    volumeGallons: number;
    maxFish: number;
    filterCapacity: number;
    heaterWattage: number;
  } | null>(null);

  const calculate = () => {
    setError('');
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);

    if (!l || !w || !h || l <= 0 || w <= 0 || h <= 0) {
      setError(t("aquarium_calculator.error_invalid_dimensions"));
      return;
    }

    // Calculate volume in liters
    const volume = (l * w * h) / 1000;
    const volumeGallons = volume * 0.264172;

    // Fish stocking rules (liters per fish)
    const stockingRules: Record<string, number> = {
      small: 4,      // 4L per small fish (1 inch)
      medium: 15,    // 15L per medium fish (3 inches)
      large: 40      // 40L per large fish (6 inches)
    };

    const maxFish = Math.floor(volume / stockingRules[fishSize]);

    // Filter should handle 3-5x tank volume per hour
    const filterCapacity = Math.ceil(volume * 4);

    // Heater: 3-5 watts per gallon (using 4)
    const heaterWattage = Math.ceil(volumeGallons * 4 / 50) * 50; // Round to nearest 50W

    setResult({
      volume: parseFloat(volume.toFixed(2)),
      volumeGallons: parseFloat(volumeGallons.toFixed(2)),
      maxFish,
      filterCapacity,
      heaterWattage
    });
  };

  const reset = () => {
    setLength('');
    setWidth('');
    setHeight('');
    setFishSize('small');
    setResult(null);
    setError('');
  };

  const fishSizeOptions: ComboboxOption[] = [
    { value: 'small', label: t("aquarium_calculator.fish_small") },
    { value: 'medium', label: t("aquarium_calculator.fish_medium") },
    { value: 'large', label: t("aquarium_calculator.fish_large") }
  ];

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("aquarium_calculator.title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputContainer label={t("aquarium_calculator.length")}>
          <NumericInput value={length} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLength(e.target.value)} unit={t("common:common.units.cm")} placeholder="0" min={0} step={1} />
        </InputContainer>

        <InputContainer label={t("aquarium_calculator.width")}>
          <NumericInput value={width} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWidth(e.target.value)} unit={t("common:common.units.cm")} placeholder="0" min={0} step={1} />
        </InputContainer>

        <InputContainer label={t("aquarium_calculator.height")}>
          <NumericInput value={height} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeight(e.target.value)} unit={t("common:common.units.cm")} placeholder="0" min={0} step={1} />
        </InputContainer>
      </div>

      <InputContainer label={t("aquarium_calculator.fish_size")}>
        <Combobox
          options={fishSizeOptions}
          value={fishSize}
          onChange={setFishSize}
          placeholder={t("aquarium_calculator.fish_size")}
        />
      </InputContainer>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("aquarium_calculator.calculate_btn")}
        resetText={t("aquarium_calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("aquarium_calculator.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("aquarium_calculator.volume")}</div>
          <div className="text-3xl font-bold text-primary">{result.volume} {t("aquarium_calculator.liters")}</div>
          <div className="text-sm text-foreground-50 mt-1">({result.volumeGallons} {t("aquarium_calculator.gallons")})</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("aquarium_calculator.max_fish")}</div>
            <div className="text-2xl font-bold text-blue-600">{result.maxFish} {t("aquarium_calculator.fish")}</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("aquarium_calculator.filter_capacity")}</div>
            <div className="text-2xl font-bold text-blue-600">{result.filterCapacity} {t("aquarium_calculator.liters_per_hour")}</div>
          </div>
        </div>

        <div className="bg-foreground/5 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("aquarium_calculator.heater_wattage")}</div>
          <div className="text-xl font-bold">{result.heaterWattage} {t("aquarium_calculator.watts")}</div>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 rounded-lg">
          <h4 className="font-bold mb-2">{t("aquarium_calculator.tips_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("aquarium-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4"><span className="text-6xl">🐠</span></div>
      <p className="text-foreground-70">{t("aquarium_calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("aquarium_calculator.title")}
      description={t("aquarium_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("aquarium_calculator.footer_note")}
      className="rtl" />
  );
}
