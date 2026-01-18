'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

export default function CompostingCalculator() {
  const { t } = useTranslation('calc/environmental');

  const [foodWaste, setFoodWaste] = useState<string>('');
  const [yardWaste, setYardWaste] = useState<string>('');
  const [compostMethod, setCompostMethod] = useState<string>('pile');
  const [result, setResult] = useState<{
    weeklyCompost: number;
    annualCompost: number;
    readyCompost: number;
    landfillDiverted: number;
    methanePrevented: number;
    gardenBenefit: number;
  } | null>(null);

  const methodOptions: ComboboxOption[] = [
    { value: 'pile', label: t("composting.options.pile") },
    { value: 'bin', label: t("composting.options.bin") },
    { value: 'tumbler', label: t("composting.options.tumbler") },
    { value: 'worm', label: t("composting.options.worm") }
  ];

  const calculate = () => {
    const foodVal = parseFloat(foodWaste) || 0;
    const yardVal = parseFloat(yardWaste) || 0;

    const weeklyWaste = foodVal + yardVal;
    const annualWaste = weeklyWaste * 52;

    // Compost yield (40-50% of input becomes finished compost)
    const yieldRates: { [key: string]: number } = {
      'pile': 0.40,
      'bin': 0.45,
      'tumbler': 0.50,
      'worm': 0.35
    };

    const readyCompost = annualWaste * yieldRates[compostMethod];

    // Landfill diverted
    const landfillDiverted = annualWaste;

    // Methane prevented (0.5 kg CH4 per kg organic waste)
    const methanePrevented = annualWaste * 0.5;

    // Garden area that can benefit (1 kg compost per m² annually)
    const gardenBenefit = readyCompost;

    setResult({
      weeklyCompost: parseFloat(weeklyWaste.toFixed(2)),
      annualCompost: parseFloat(annualWaste.toFixed(2)),
      readyCompost: parseFloat(readyCompost.toFixed(2)),
      landfillDiverted: parseFloat(landfillDiverted.toFixed(2)),
      methanePrevented: parseFloat(methanePrevented.toFixed(2)),
      gardenBenefit: parseFloat(gardenBenefit.toFixed(2))
    });
  };

  const reset = () => {
    setFoodWaste('');
    setYardWaste('');
    setCompostMethod('pile');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("composting.section_title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("composting.food_waste")} tooltip={t("composting.food_waste_tooltip")}>
          <NumberInput
            value={foodWaste}
            onValueChange={(val) => setFoodWaste(String(val))}
            endIcon={<span className="text-xs text-muted-foreground">{t("co2_emissions.kg_co2").split(' ')[0]}</span>}
            placeholder={t("composting.enter_amount")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("composting.yard_waste")} tooltip={t("composting.yard_waste_tooltip")}>
          <NumberInput
            value={yardWaste}
            onValueChange={(val) => setYardWaste(String(val))}
            endIcon={<span className="text-xs text-muted-foreground">{t("co2_emissions.kg_co2").split(' ')[0]}</span>}
            placeholder={t("composting.enter_amount")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("composting.compost_method")} tooltip={t("composting.compost_method_tooltip")}>
          <Combobox options={methodOptions} value={compostMethod} onChange={setCompostMethod} />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("composting.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("composting.annual_compost")}</div>
          <div className="text-3xl font-bold text-primary">{result.readyCompost.toLocaleString()} {t("composting.kg_year").split('/')[0]}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("composting.landfill_diverted")}</div>
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {result.landfillDiverted.toLocaleString()} {t("composting.kg_year")}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("composting.methane_prevented")}</div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
              {result.methanePrevented.toLocaleString()} {t("composting.kg_ch4")}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("composting.garden_benefit")}</div>
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {result.gardenBenefit.toLocaleString()} {t("composting.sq_m")}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("composting.tips_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("composting.tip_balance")}</li>
            <li>{t("composting.tip_turn")}</li>
            <li>{t("composting.tip_moist")}</li>
            <li>{t("composting.tip_ready")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <p className="text-foreground-70">
        {t("composting.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("composting.title")}
      description={t("composting.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("composting.footer_note")}
     className="rtl" />
  );
}
