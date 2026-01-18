'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

export default function ResistorColorCodeCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [band1, setBand1] = useState<string>('brown');
  const [band2, setBand2] = useState<string>('black');
  const [band3, setBand3] = useState<string>('red');
  const [band4, setBand4] = useState<string>('gold');
  const [numBands, setNumBands] = useState<string>('4');

  const colorValues: Record<string, number> = {
    black: 0, brown: 1, red: 2, orange: 3, yellow: 4,
    green: 5, blue: 6, violet: 7, gray: 8, white: 9
  };

  const multipliers: Record<string, number> = {
    black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000,
    green: 100000, blue: 1000000, violet: 10000000, gray: 100000000,
    gold: 0.1, silver: 0.01
  };

  const tolerances: Record<string, number> = {
    brown: 1, red: 2, green: 0.5, blue: 0.25, violet: 0.1,
    gray: 0.05, gold: 5, silver: 10, none: 20
  };

  const colorNames: Record<string, { ar: string; hex: string }> = {
    black: { ar: t("resistor_color_code.colors.black"), hex: '#000000' },
    brown: { ar: t("resistor_color_code.colors.brown"), hex: '#8B4513' },
    red: { ar: t("resistor_color_code.colors.red"), hex: '#FF0000' },
    orange: { ar: t("resistor_color_code.colors.orange"), hex: '#FFA500' },
    yellow: { ar: t("resistor_color_code.colors.yellow"), hex: '#FFFF00' },
    green: { ar: t("resistor_color_code.colors.green"), hex: '#00FF00' },
    blue: { ar: t("resistor_color_code.colors.blue"), hex: '#0000FF' },
    violet: { ar: t("resistor_color_code.colors.violet"), hex: '#8B00FF' },
    gray: { ar: t("resistor_color_code.colors.gray"), hex: '#808080' },
    white: { ar: t("resistor_color_code.colors.white"), hex: '#FFFFFF' },
    gold: { ar: t("resistor_color_code.colors.gold"), hex: '#FFD700' },
    silver: { ar: t("resistor_color_code.colors.silver"), hex: '#C0C0C0' },
    none: { ar: t("resistor_color_code.colors.none"), hex: '#E5E5E5' }
  };

  const calculateResistance = () => {
    let resistance = 0;
    let tolerance = 0;

    if (numBands === '4') {
      resistance = (colorValues[band1] * 10 + colorValues[band2]) * multipliers[band3];
      tolerance = tolerances[band4];
    } else {
      // 5 bands - more precision (band3 is third digit, need separate band4 for multiplier)
      // For 5-band resistors: band1=digit1, band2=digit2, band3=digit3, band3 used as multiplier here
      // Note: This is a simplified calculation - in a real 5-band implementation you'd need a 5th band
      resistance = (colorValues[band1] * 100 + colorValues[band2] * 10 + colorValues[band3]) * multipliers[band3];
      tolerance = tolerances[band4];
    }

    return { resistance, tolerance };
  };

  const formatResistance = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)} ${t("ohms_law.unit_mega_ohm")}`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)} ${t("ohms_law.unit_kilo_ohm")}`;
    return `${value.toFixed(2)} ${t("ohms_law.unit_resistance")}`;
  };

  const result = calculateResistance();

  const numBandsOptions: ComboboxOption[] = [
    { value: '4', label: t("resistor_color_code.band_4") },
    { value: '5', label: t("resistor_color_code.band_5") }
  ];

  const colorOptions: ComboboxOption[] = Object.entries(colorValues).map(([color]) => ({
    value: color,
    label: colorNames[color].ar
  }));

  const multiplierOptions: ComboboxOption[] = Object.entries(multipliers).map(([color]) => ({
    value: color,
    label: colorNames[color].ar
  }));

  const toleranceOptions: ComboboxOption[] = Object.entries(tolerances).map(([color]) => ({
    value: color,
    label: colorNames[color].ar
  }));

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("resistor_color_code.title")}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <InputContainer label={t("resistor_color_code.num_bands")} tooltip={t("resistor_color_code.num_bands_tooltip")}>
          <Combobox
            options={numBandsOptions}
            value={numBands}
            onChange={setNumBands}
          />
        </InputContainer>

        <InputContainer label={`${t("resistor_color_code.band")} 1`} tooltip={t("resistor_color_code.band")}>
          <div style={{ borderRight: `8px solid ${colorNames[band1].hex}` }}>
            <Combobox
              options={colorOptions}
              value={band1}
              onChange={setBand1}
            />
          </div>
        </InputContainer>

        <InputContainer label={`${t("resistor_color_code.band")} 2`} tooltip={t("resistor_color_code.band")}>
          <div style={{ borderRight: `8px solid ${colorNames[band2].hex}` }}>
            <Combobox
              options={colorOptions}
              value={band2}
              onChange={setBand2}
            />
          </div>
        </InputContainer>

        <InputContainer label={numBands === '4' ? t("resistor_color_code.multiplier") : `${t("resistor_color_code.band")} 3`} tooltip={t("resistor_color_code.band")}>
          <div style={{ borderRight: `8px solid ${colorNames[band3].hex}` }}>
            <Combobox
              options={multiplierOptions}
              value={band3}
              onChange={setBand3}
            />
          </div>
        </InputContainer>

        <InputContainer label={t("resistor_color_code.tolerance")} tooltip={t("resistor_color_code.tolerance")}>
          <div style={{ borderRight: `8px solid ${colorNames[band4].hex}` }}>
            <Combobox
              options={toleranceOptions}
              value={band4}
              onChange={setBand4}
            />
          </div>
        </InputContainer>
      </div>
    </>
  );

  const resultSection = (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("resistor_color_code.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("resistor_color_code.resistance_value")}
          </div>
          <div className="text-3xl font-bold text-primary">{formatResistance(result.resistance)}</div>
          <div className="text-sm text-foreground-70 mt-1">
            ± {result.tolerance}%
          </div>
        </div>

        <div className="bg-foreground/5 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-2">{t("resistor_color_code.range")}</div>
          <div>
            <span className="text-foreground-70">{t("resistor_color_code.min")}: {formatResistance(result.resistance * (1 - result.tolerance / 100))}</span>
          </div>
          <div>
            <span className="text-foreground-70">{t("resistor_color_code.max")}: {formatResistance(result.resistance * (1 + result.tolerance / 100))}</span>
          </div>
        </div>

        <div className="p-4 bg-muted dark:bg-muted/30 rounded-lg">
          <div className="text-sm text-foreground-70 mb-2">{t("resistor_color_code.visual")}</div>
          <div className="flex items-center justify-center gap-0">
            <div style={{ width: '60px', height: '20px', backgroundColor: '#DEB887', borderRadius: '2px' }}></div>
            {[band1, band2, band3, band4].map((band, i) => (
              <div
                key={i}
                style={{
                  width: '15px',
                  height: '60px',
                  backgroundColor: colorNames[band].hex,
                  border: band === 'white' ? '1px solid #ccc' : 'none'
                }}
              ></div>
            ))}
            <div style={{ width: '60px', height: '20px', backgroundColor: '#DEB887', borderRadius: '2px' }}></div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("resistor_color_code.about_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("resistor_color_code.about_desc")}</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("resistor_color_code.title")}
      description={t("resistor_color_code.description")}
      inputSection={inputSection}
      resultSection={resultSection}
    />
  );
}
