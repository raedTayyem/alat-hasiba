'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

export default function PetMedicationDosageCalculator() {
  const { t } = useTranslation('calc/pet');
  const [petWeight, setPetWeight] = useState<string>('');
  const [dosagePerKg, setDosagePerKg] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('12');
  const [medicationForm, setMedicationForm] = useState<string>('liquid');
  const [concentration, setConcentration] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{
    totalDosePerDay: number;
    dosePerAdministration: number;
    administrationPerDay: number;
    volumePerDose: number;
  } | null>(null);

  const calculate = () => {
    setError('');
    const weight = parseFloat(petWeight);
    const dose = parseFloat(dosagePerKg);
    const freq = parseFloat(frequency);
    const conc = parseFloat(concentration) || 1;

    if (!weight || weight <= 0) {
      setError(t("pet-medication-dosage-calculator.error_invalid_weight"));
      return;
    }
    if (!dose || dose <= 0) {
      setError(t("pet-medication-dosage-calculator.error_invalid_dosage"));
      return;
    }
    if (!freq) {
      setError(t("pet-medication-dosage-calculator.error_invalid_frequency"));
      return;
    }

    const totalDosePerDay = weight * dose;
    const administrationPerDay = 24 / freq;
    const dosePerAdministration = totalDosePerDay / administrationPerDay;

    // For liquid: volume = dose / concentration
    // For tablets: number of tablets
    const volumePerDose = medicationForm === 'liquid' ? dosePerAdministration / conc : dosePerAdministration;

    setResult({
      totalDosePerDay: parseFloat(totalDosePerDay.toFixed(2)),
      dosePerAdministration: parseFloat(dosePerAdministration.toFixed(2)),
      administrationPerDay: Math.round(administrationPerDay),
      volumePerDose: parseFloat(volumePerDose.toFixed(2))
    });
  };

  const reset = () => {
    setPetWeight('');
    setDosagePerKg('');
    setFrequency('12');
    setMedicationForm('liquid');
    setConcentration('');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("pet-medication-dosage-calculator.input_title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer
          label={t("pet-medication-dosage-calculator.pet_weight")}
          tooltip={t("pet-medication-dosage-calculator.pet_weight_tooltip")}
        >
          <NumberInput
            value={petWeight}
            onValueChange={(val) => setPetWeight(String(val))}
            unit={t("pet-medication-dosage-calculator.weight_unit")}
            placeholder={t("pet-medication-dosage-calculator.enter_weight")}
            min={0}
            max={100}
            step={0.1}
          />
        </InputContainer>

        <InputContainer
          label={t("pet-medication-dosage-calculator.dosage_per_kg")}
          tooltip={t("pet-medication-dosage-calculator.dosage_per_kg_tooltip")}
        >
          <NumberInput
            value={dosagePerKg}
            onValueChange={(val) => setDosagePerKg(String(val))}
            unit={t("pet-medication-dosage-calculator.dosage_unit")}
            placeholder={t("pet-medication-dosage-calculator.enter_dosage")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer
          label={t("pet-medication-dosage-calculator.administration_frequency")}
          tooltip={t("pet-medication-dosage-calculator.frequency_tooltip")}
        >
          <Combobox
            options={[
              { value: "6", label: t("pet-medication-dosage-calculator.frequency_6h") },
              { value: "8", label: t("pet-medication-dosage-calculator.frequency_8h") },
              { value: "12", label: t("pet-medication-dosage-calculator.frequency_12h") },
              { value: "24", label: t("pet-medication-dosage-calculator.frequency_24h") }
            ]}
            value={frequency}
            onChange={setFrequency}
          />
        </InputContainer>

        <InputContainer
          label={t("pet-medication-dosage-calculator.medication_form")}
          tooltip={t("pet-medication-dosage-calculator.form_tooltip")}
        >
          <Combobox
            options={[
              { value: "liquid", label: t("pet-medication-dosage-calculator.form_liquid") },
              { value: "tablet", label: t("pet-medication-dosage-calculator.form_tablet") }
            ]}
            value={medicationForm}
            onChange={setMedicationForm}
          />
        </InputContainer>

        {medicationForm === 'liquid' && (
          <InputContainer
            label={t("pet-medication-dosage-calculator.concentration")}
            tooltip={t("pet-medication-dosage-calculator.concentration_tooltip")}
          >
            <NumberInput
              value={concentration}
              onValueChange={(val) => setConcentration(String(val))}
              unit={t("pet-medication-dosage-calculator.concentration_unit")}
              placeholder={t("pet-medication-dosage-calculator.enter_concentration")}
              min={0}
              step={0.1}
            />
          </InputContainer>
        )}
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("pet-medication-dosage-calculator.calculate_btn")}
        resetText={t("pet-medication-dosage-calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("pet-medication-dosage-calculator.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("pet-medication-dosage-calculator.total_daily_dose")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {medicationForm === 'liquid'
              ? `${result.volumePerDose} ${t("pet-medication-dosage-calculator.volume_unit")}`
              : `${result.volumePerDose} ${t("pet-medication-dosage-calculator.tablet_unit")}`
            }
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("pet-medication-dosage-calculator.administration_per_day")}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {result.administrationPerDay} {t("pet-medication-dosage-calculator.administration_per_day_unit")}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("pet-medication-dosage-calculator.total_dose_per_day")}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {result.totalDosePerDay} {t("pet-medication-dosage-calculator.dosage_unit")}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/20 rounded-lg">
          <h4 className="font-bold mb-2 text-red-600">
            {t("pet-medication-dosage-calculator.tips_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("pet-medication-dosage-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <span className="text-6xl">💊</span>
      </div>
      <p className="text-foreground-70">
        {t("pet-medication-dosage-calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("pet-medication-dosage-calculator.title")}
      description={t("pet-medication-dosage-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("pet-medication-dosage-calculator.footer_note")}
      className="rtl" />
  );
}
