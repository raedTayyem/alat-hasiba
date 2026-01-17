'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function ReptileTankCalculator() {
  const { t, i18n } = useTranslation('calc/pet');
  const isRTL = i18n.language === 'ar';
  const [reptileType, setReptileType] = useState<string>('bearded_dragon');
  const [reptileLength, setReptileLength] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{
    tankLength: number;
    tankWidth: number;
    tankHeight: number;
    baskingTemp: number;
    coolTemp: number;
    uvbRequired: boolean;
    substrate: string;
    substrateEn: string;
  } | null>(null);

  const calculate = () => {
    setError('');
    const length = parseFloat(reptileLength);
    if (!length || length <= 0) {
      setError(t("reptile-tank-calculator.error_invalid_length"));
      return;
    }

    // Tank sizing rules
    const tankSpecs: Record<string, {
      lengthMultiplier: number;
      widthMultiplier: number;
      heightMultiplier: number;
      basking: number;
      cool: number;
      uvb: boolean;
      substrate: string;
      substrateEn: string;
    }> = {
      bearded_dragon: {
        lengthMultiplier: 3,
        widthMultiplier: 1.5,
        heightMultiplier: 1.5,
        basking: 40,
        cool: 26,
        uvb: true,
        substrate: t("reptile-tank-calculator.substrate_bearded_dragon"),
        substrateEn: t("reptile-tank-calculator.substrate_bearded_dragon_en")
      },
      gecko: {
        lengthMultiplier: 2.5,
        widthMultiplier: 1.5,
        heightMultiplier: 2,
        basking: 32,
        cool: 24,
        uvb: false,
        substrate: t("reptile-tank-calculator.substrate_gecko"),
        substrateEn: t("reptile-tank-calculator.substrate_gecko_en")
      },
      snake: {
        lengthMultiplier: 0.75,
        widthMultiplier: 0.5,
        heightMultiplier: 0.75,
        basking: 32,
        cool: 24,
        uvb: false,
        substrate: t("reptile-tank-calculator.substrate_snake"),
        substrateEn: t("reptile-tank-calculator.substrate_snake_en")
      },
      tortoise: {
        lengthMultiplier: 4,
        widthMultiplier: 2,
        heightMultiplier: 1,
        basking: 35,
        cool: 22,
        uvb: true,
        substrate: t("reptile-tank-calculator.substrate_tortoise"),
        substrateEn: t("reptile-tank-calculator.substrate_tortoise_en")
      },
      iguana: {
        lengthMultiplier: 2,
        widthMultiplier: 1,
        heightMultiplier: 2,
        basking: 38,
        cool: 27,
        uvb: true,
        substrate: t("reptile-tank-calculator.substrate_iguana"),
        substrateEn: t("reptile-tank-calculator.substrate_iguana_en")
      }
    };

    const specs = tankSpecs[reptileType];

    const tankLength = Math.ceil(length * specs.lengthMultiplier);
    const tankWidth = Math.ceil(length * specs.widthMultiplier);
    const tankHeight = Math.ceil(length * specs.heightMultiplier);

    setResult({
      tankLength,
      tankWidth,
      tankHeight,
      baskingTemp: specs.basking,
      coolTemp: specs.cool,
      uvbRequired: specs.uvb,
      substrate: specs.substrate,
      substrateEn: specs.substrateEn
    });
  };

  const reset = () => {
    setReptileType('bearded_dragon');
    setReptileLength('');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("reptile-tank-calculator.input_title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("reptile-tank-calculator.reptile_type")}>
          <select value={reptileType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReptileType(e.target.value)} className="calculator-input w-full">
            <option value="bearded_dragon">{t("reptile-tank-calculator.reptile_bearded_dragon")}</option>
            <option value="gecko">{t("reptile-tank-calculator.reptile_gecko")}</option>
            <option value="snake">{t("reptile-tank-calculator.reptile_snake")}</option>
            <option value="tortoise">{t("reptile-tank-calculator.reptile_tortoise")}</option>
            <option value="iguana">{t("reptile-tank-calculator.reptile_iguana")}</option>
          </select>
        </InputContainer>

        <InputContainer label={t("reptile-tank-calculator.reptile_length")}>
          <NumericInput value={reptileLength} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReptileLength(e.target.value)} unit={t("reptile-tank-calculator.cm")} placeholder={t("reptile-tank-calculator.enter_length")} min={0} max={200} step={1} />
        </InputContainer>
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("reptile-tank-calculator.calculate_btn")}
        resetText={t("reptile-tank-calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("reptile-tank-calculator.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-2">{t("reptile-tank-calculator.tank_length")}</div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-xs text-foreground-50">{t("reptile-tank-calculator.tank_length")}</div>
              <div className="text-xl font-bold text-primary">{result.tankLength} {t("reptile-tank-calculator.cm")}</div>
            </div>
            <div>
              <div className="text-xs text-foreground-50">{t("reptile-tank-calculator.tank_width")}</div>
              <div className="text-xl font-bold text-primary">{result.tankWidth} {t("reptile-tank-calculator.cm")}</div>
            </div>
            <div>
              <div className="text-xs text-foreground-50">{t("reptile-tank-calculator.tank_height")}</div>
              <div className="text-xl font-bold text-primary">{result.tankHeight} {t("reptile-tank-calculator.cm")}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("reptile-tank-calculator.temperature_title")}</div>
            <div className="text-2xl font-bold text-orange-600">{result.baskingTemp}°C</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("reptile-tank-calculator.lighting_title")}</div>
            <div className="text-2xl font-bold text-blue-600">{result.coolTemp}°C</div>
          </div>
        </div>

        <div className="bg-foreground/5 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{t("reptile-tank-calculator.uvb_lighting")}</span>
              <span className={`font-bold ${result.uvbRequired ? 'text-green-600' : 'text-muted-foreground'}`}>
                {result.uvbRequired ? (t("reptile-tank-calculator.uvb_required")) : (t("reptile-tank-calculator.uvb_not_required"))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t("reptile-tank-calculator.substrate_title")}</span>
              <span className="font-bold">{isRTL ? result.substrate : result.substrateEn}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 rounded-lg">
          <h4 className="font-bold mb-2">{t("reptile-tank-calculator.tips_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("reptile-tank-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4"><span className="text-6xl">🦎</span></div>
      <p className="text-foreground-70">{t("reptile-tank-calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("reptile-tank-calculator.title")}
      description={t("reptile-tank-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("reptile-tank-calculator.footer_note")}
      className="rtl" />
  );
}
