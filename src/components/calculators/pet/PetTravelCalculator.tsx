'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

export default function PetTravelCalculator() {
  const { t } = useTranslation('calc/pet');
  const [petType, setPetType] = useState<string>('dog');
  const [petWeight, setPetWeight] = useState<string>('');
  const [travelType, setTravelType] = useState<string>('domestic');
  const [transportMode, setTransportMode] = useState<string>('air');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{
    carrierCost: number;
    healthCertCost: number;
    transportCost: number;
    totalCost: number;
  } | null>(null);

  const calculate = () => {
    setError('');
    const weight = parseFloat(petWeight);
    if (!weight || weight <= 0) {
      setError(t("pet-travel-calculator.error_invalid_weight"));
      return;
    }

    // Carrier cost based on pet size
    const carrierCost = weight < 5 ? 50 : weight < 15 ? 100 : 200;

    // Health certificate
    const healthCertCost = travelType === 'international' ? 200 : 100;

    // Transport cost
    let transportCost = 0;
    if (transportMode === 'air') {
      transportCost = travelType === 'international' ? 500 : 200;
      if (weight > 20) transportCost *= 1.5;
    } else {
      transportCost = 50; // Car/ground transport
    }

    const totalCost = carrierCost + healthCertCost + transportCost;

    setResult({
      carrierCost,
      healthCertCost,
      transportCost,
      totalCost
    });
  };

  const reset = () => {
    setPetType('dog');
    setPetWeight('');
    setTravelType('domestic');
    setTransportMode('air');
    setResult(null);
    setError('');
  };

  const petTypeOptions: ComboboxOption[] = [
    { value: 'dog', label: t("pet-travel-calculator.pet_dog") },
    { value: 'cat', label: t("pet-travel-calculator.pet_cat") }
  ];

  const travelTypeOptions: ComboboxOption[] = [
    { value: 'domestic', label: t("pet-travel-calculator.travel_domestic") },
    { value: 'international', label: t("pet-travel-calculator.travel_international") }
  ];

  const transportModeOptions: ComboboxOption[] = [
    { value: 'air', label: t("pet-travel-calculator.transport_air") },
    { value: 'ground', label: t("pet-travel-calculator.transport_ground") }
  ];

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("pet-travel-calculator.input_title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("pet-travel-calculator.pet_type")}>
          <Combobox
            options={petTypeOptions}
            value={petType}
            onChange={setPetType}
            placeholder={t("pet-travel-calculator.pet_type")}
          />
        </InputContainer>

        <InputContainer label={t("pet-travel-calculator.pet_weight")}>
          <NumericInput value={petWeight} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPetWeight(e.target.value)} unit={t("pet-travel-calculator.kg")} placeholder={t("pet-travel-calculator.enter_weight")} min={0} max={50} step={0.5} />
        </InputContainer>

        <InputContainer label={t("pet-travel-calculator.travel_type")}>
          <Combobox
            options={travelTypeOptions}
            value={travelType}
            onChange={setTravelType}
            placeholder={t("pet-travel-calculator.travel_type")}
          />
        </InputContainer>

        <InputContainer label={t("pet-travel-calculator.transport_mode")}>
          <Combobox
            options={transportModeOptions}
            value={transportMode}
            onChange={setTransportMode}
            placeholder={t("pet-travel-calculator.transport_mode")}
          />
        </InputContainer>
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("pet-travel-calculator.calculate_btn")}
        resetText={t("pet-travel-calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("pet-travel-calculator.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("pet-travel-calculator.total_cost")}</div>
          <div className="text-3xl font-bold text-primary">{result.totalCost} {t("pet-travel-calculator.currency")}</div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between p-3 bg-foreground/5 rounded">
            <span>{t("pet-travel-calculator.carrier_cost")}</span>
            <span className="font-bold">{result.carrierCost} {t("pet-travel-calculator.currency")}</span>
          </div>
          <div className="flex justify-between p-3 bg-foreground/5 rounded">
            <span>{t("pet-travel-calculator.health_cert_cost")}</span>
            <span className="font-bold">{result.healthCertCost} {t("pet-travel-calculator.currency")}</span>
          </div>
          <div className="flex justify-between p-3 bg-foreground/5 rounded">
            <span>{t("pet-travel-calculator.transport_cost_label")}</span>
            <span className="font-bold">{result.transportCost} {t("pet-travel-calculator.currency")}</span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 rounded-lg">
          <h4 className="font-bold mb-2">{t("pet-travel-calculator.tips_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("pet-travel-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4"><span className="text-6xl">&#9992;&#65039;</span></div>
      <p className="text-foreground-70">{t("pet-travel-calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("pet-travel-calculator.title")}
      description={t("pet-travel-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("pet-travel-calculator.footer_note")}
      className="rtl" />
  );
}
