'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

export default function WasteCalculator() {
  const { t } = useTranslation('calc/environmental');

  const [foodWaste, setFoodWaste] = useState<string>('');
  const [plasticWaste, setPlasticWaste] = useState<string>('');
  const [paperWaste, setPaperWaste] = useState<string>('');
  const [otherWaste, setOtherWaste] = useState<string>('');
  const [householdSize, setHouseholdSize] = useState<string>('1');
  const [result, setResult] = useState<{
    dailyTotal: number;
    weeklyTotal: number;
    annualTotal: number;
    perPerson: number;
    landfillImpact: number;
    methaneEmissions: number;
  } | null>(null);

  const calculate = () => {
    const foodVal = parseFloat(foodWaste) || 0;
    const plasticVal = parseFloat(plasticWaste) || 0;
    const paperVal = parseFloat(paperWaste) || 0;
    const otherVal = parseFloat(otherWaste) || 0;
    const householdVal = parseFloat(householdSize) || 1;

    const dailyTotal = foodVal + plasticVal + paperVal + otherVal;
    const weeklyTotal = dailyTotal * 7;
    const annualTotal = dailyTotal * 365;

    const perPerson = dailyTotal / householdVal;

    // Landfill impact (kg CO2 equivalent per kg waste)
    const landfillImpact = annualTotal * 0.8; // 0.8 kg CO2e per kg waste

    // Methane emissions from organic waste (food waste primarily)
    const methaneEmissions = (foodVal * 365) * 0.5; // 0.5 kg CH4 per kg food waste

    setResult({
      dailyTotal: parseFloat(dailyTotal.toFixed(2)),
      weeklyTotal: parseFloat(weeklyTotal.toFixed(2)),
      annualTotal: parseFloat(annualTotal.toFixed(2)),
      perPerson: parseFloat(perPerson.toFixed(2)),
      landfillImpact: parseFloat(landfillImpact.toFixed(2)),
      methaneEmissions: parseFloat(methaneEmissions.toFixed(2))
    });
  };

  const reset = () => {
    setFoodWaste('');
    setPlasticWaste('');
    setPaperWaste('');
    setOtherWaste('');
    setHouseholdSize('1');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("waste.section_title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer
          label={t("waste.food_waste")}
          tooltip={t("waste.food_waste_tooltip")}
        >
          <NumberInput
            value={foodWaste}
            onValueChange={(val) => setFoodWaste(String(val))}
            unit={t("co2_emissions.kg_co2").split(' ')[0]}
            placeholder={t("waste.enter_amount")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer
          label={t("waste.plastic_waste")}
          tooltip={t("waste.plastic_waste_tooltip")}
        >
          <NumberInput
            value={plasticWaste}
            onValueChange={(val) => setPlasticWaste(String(val))}
            unit={t("co2_emissions.kg_co2").split(' ')[0]}
            placeholder={t("waste.enter_amount")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer
          label={t("waste.paper_waste")}
          tooltip={t("waste.paper_waste_tooltip")}
        >
          <NumberInput
            value={paperWaste}
            onValueChange={(val) => setPaperWaste(String(val))}
            unit={t("co2_emissions.kg_co2").split(' ')[0]}
            placeholder={t("waste.enter_amount")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer
          label={t("waste.other_waste")}
          tooltip={t("waste.other_waste_tooltip")}
        >
          <NumberInput
            value={otherWaste}
            onValueChange={(val) => setOtherWaste(String(val))}
            unit={t("co2_emissions.kg_co2").split(' ')[0]}
            placeholder={t("waste.enter_amount")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer
          label={t("waste.household_size")}
          tooltip={t("waste.household_size_tooltip")}
        >
          <NumberInput
            value={householdSize}
            onValueChange={(val) => setHouseholdSize(String(val))}
            unit={t("flight_emissions.persons")}
            placeholder={t("waste.enter_number")}
            min={1}
          />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("waste.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("waste.total_annual")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.annualTotal.toLocaleString()} {t("co2_emissions.kg_co2").split(' ')[0]}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("waste.daily")}</div>
            <div className="text-xl font-bold">{result.dailyTotal.toLocaleString()} {t("co2_emissions.kg_co2").split(' ')[0]}</div>
          </div>

          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("waste.weekly")}</div>
            <div className="text-xl font-bold">{result.weeklyTotal.toLocaleString()} {t("co2_emissions.kg_co2").split(' ')[0]}</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("waste.per_person")}</div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
              {result.perPerson.toLocaleString()} {t("co2_emissions.kg_co2").split(' ')[0]}
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t("waste.landfill_emissions")}</div>
            <div className="text-xl font-bold text-orange-700 dark:text-orange-400">
              {result.landfillImpact.toLocaleString()} {t("co2_emissions.kg_co2")}e
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("waste.tips_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("waste.tip_meal")}</li>
            <li>{t("waste.tip_recycle")}</li>
            <li>{t("waste.tip_reusable")}</li>
            <li>{t("waste.tip_compost")}</li>
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
        {t("waste.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("waste.title")}
      description={t("waste.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("waste.footer_note")}
     className="rtl" />
  );
}
