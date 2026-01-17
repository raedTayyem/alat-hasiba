'use client';

/**
 * Recycling Impact Calculator
 * Calculates CO2 saved by recycling different materials
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  totalCO2Saved: number;
  paperCO2: number;
  plasticCO2: number;
  glassCO2: number;
  metalCO2: number;
  treesEquivalent: number;
  energySaved: number;
}

export default function RecyclingImpactCalculator() {
  const { t } = useTranslation(['calc/environmental', 'common']);
  const [paper, setPaper] = useState<string>('');
  const [plastic, setPlastic] = useState<string>('');
  const [glass, setGlass] = useState<string>('');
  const [metal, setMetal] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const paperVal = parseFloat(paper) || 0;
    const plasticVal = parseFloat(plastic) || 0;
    const glassVal = parseFloat(glass) || 0;
    const metalVal = parseFloat(metal) || 0;

    if (paperVal === 0 && plasticVal === 0 && glassVal === 0 && metalVal === 0) {
      setError(t("recycling_impact.error_at_least_one"));
      return false;
    }

    if (paperVal < 0 || plasticVal < 0 || glassVal < 0 || metalVal < 0) {
      setError(t("recycling_impact.error_negative"));
      return false;
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
        const paperVal = parseFloat(paper) || 0;
        const plasticVal = parseFloat(plastic) || 0;
        const glassVal = parseFloat(glass) || 0;
        const metalVal = parseFloat(metal) || 0;

        // CO2 savings per kg of material recycled
        const paperCO2 = paperVal * 0.9; // 0.9 kg CO2 saved per kg paper
        const plasticCO2 = plasticVal * 1.5; // 1.5 kg CO2 saved per kg plastic
        const glassCO2 = glassVal * 0.3; // 0.3 kg CO2 saved per kg glass
        const metalCO2 = metalVal * 2.5; // 2.5 kg CO2 saved per kg metal

        const totalCO2Saved = paperCO2 + plasticCO2 + glassCO2 + metalCO2;
        const treesEquivalent = totalCO2Saved / 21; // One tree absorbs ~21 kg CO2/year
        const energySaved = totalCO2Saved * 5; // Rough estimate: 5 kWh per kg CO2

        setResult({
          totalCO2Saved,
          paperCO2,
          plasticCO2,
          glassCO2,
          metalCO2,
          treesEquivalent,
          energySaved,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("recycling_impact.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setPaper('');
      setPlastic('');
      setGlass('');
      setMetal('');
      setResult(null);
      setError('');
    }, 300);
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("recycling_impact.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t("recycling_impact.paper_label")}
          tooltip={t("recycling_impact.paper_tooltip")}
        >
          <NumericInput
            value={paper}
            onChange={(e) => {
              setPaper(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("recycling_impact.paper_placeholder")}
            min={0}
            unit={t("common:units.kg")}
          />
        </InputContainer>

        <InputContainer
          label={t("recycling_impact.plastic_label")}
          tooltip={t("recycling_impact.plastic_tooltip")}
        >
          <NumericInput
            value={plastic}
            onChange={(e) => {
              setPlastic(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("recycling_impact.plastic_placeholder")}
            min={0}
            unit={t("common:units.kg")}
          />
        </InputContainer>

        <InputContainer
          label={t("recycling_impact.glass_label")}
          tooltip={t("recycling_impact.glass_tooltip")}
        >
          <NumericInput
            value={glass}
            onChange={(e) => {
              setGlass(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("recycling_impact.glass_placeholder")}
            min={0}
            unit={t("common:units.kg")}
          />
        </InputContainer>

        <InputContainer
          label={t("recycling_impact.metal_label")}
          tooltip={t("recycling_impact.metal_tooltip")}
        >
          <NumericInput
            value={metal}
            onChange={(e) => {
              setMetal(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("recycling_impact.metal_placeholder")}
            min={0}
            unit={t("common:units.kg")}
          />
        </InputContainer>
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
            <h2 className="font-bold mb-2 text-lg">
              {t("recycling_impact.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("recycling_impact.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("recycling_impact.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("recycling_impact.use_case_1")}</li>
              <li>{t("recycling_impact.use_case_2")}</li>
              <li>{t("recycling_impact.use_case_3")}</li>
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
          {t("recycling_impact.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.totalCO2Saved).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("recycling_impact.result_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("recycling_impact.breakdown_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="font-medium">{t("recycling_impact.paper_saved")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.paperCO2).toFixed(2)} {t("co2_emissions.kg_co2")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div className="font-medium">{t("recycling_impact.plastic_saved")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.plasticCO2).toFixed(2)} {t("co2_emissions.kg_co2")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <div className="font-medium">{t("recycling_impact.glass_saved")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.glassCO2).toFixed(2)} {t("co2_emissions.kg_co2")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <div className="font-medium">{t("recycling_impact.metal_saved")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.metalCO2).toFixed(2)} {t("co2_emissions.kg_co2")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <div className="font-medium">{t("recycling_impact.trees_equivalent")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.treesEquivalent).toFixed(2)} {t("recycling_impact.trees")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="font-medium">{t("recycling_impact.energy_saved")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.energySaved).toFixed(2)} {t("common:common.units.kWh")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("recycling_impact.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("recycling_impact.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("recycling_impact.title")}
      description={t("recycling_impact.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
