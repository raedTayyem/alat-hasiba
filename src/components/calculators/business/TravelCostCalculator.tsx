'use client';

/**
 * Travel Cost Calculator
 *
 * Calculates business travel expenses
 * Formula: Total = Transport + (Daily Rate × Days)
 * Daily Rate = Lodging + Meals + Incidentals
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plane, Hotel, Utensils, Calendar, DollarSign, Briefcase } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  totalCost: number;
  transportCost: number;
  lodgingCost: number;
  mealsCost: number;
  incidentalsCost: number;
  dailyRate: number;
  costPerDay: number;
}

export default function TravelCostCalculator() {
  const { t, i18n } = useTranslation('calc/business');
  const [transportCost, setTransportCost] = useState<string>('');
  const [lodgingPerNight, setLodgingPerNight] = useState<string>('');
  const [mealsPerDay, setMealsPerDay] = useState<string>('');
  const [incidentalsPerDay, setIncidentalsPerDay] = useState<string>('');
  const [numberOfDays, setNumberOfDays] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const transport = parseFloat(transportCost);
    const lodging = parseFloat(lodgingPerNight);
    const meals = parseFloat(mealsPerDay);
    const days = parseFloat(numberOfDays);

    if (isNaN(transport) || isNaN(lodging) || isNaN(meals) || isNaN(days)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (transport < 0 || lodging < 0 || meals < 0 || days <= 0) {
      setError(t("errors.positive_values_required"));
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
        const transport = parseFloat(transportCost);
        const lodging = parseFloat(lodgingPerNight);
        const meals = parseFloat(mealsPerDay);
        const incidentals = parseFloat(incidentalsPerDay) || 0;
        const days = parseFloat(numberOfDays);

        // Calculate daily rate
        const dailyRate = lodging + meals + incidentals;

        // Calculate total costs
        const totalLodging = lodging * days;
        const totalMeals = meals * days;
        const totalIncidentals = incidentals * days;

        // Total = Transport + (Daily Rate × Days)
        const totalCost = transport + (dailyRate * days);
        const costPerDay = totalCost / days;

        setResult({
          totalCost: Math.round(totalCost * 100) / 100,
          transportCost: transport,
          lodgingCost: Math.round(totalLodging * 100) / 100,
          mealsCost: Math.round(totalMeals * 100) / 100,
          incidentalsCost: Math.round(totalIncidentals * 100) / 100,
          dailyRate: Math.round(dailyRate * 100) / 100,
          costPerDay: Math.round(costPerDay * 100) / 100,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setTransportCost('');
      setLodgingPerNight('');
      setMealsPerDay('');
      setIncidentalsPerDay('');
      setNumberOfDays('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("travel_cost.inputs.transport")}
          tooltip={t("travel_cost.inputs.transport_tooltip")}
        >
          <NumberInput
            value={transportCost}
            onValueChange={(val) => {
              setTransportCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("travel_cost.inputs.transport_placeholder")}
            startIcon={<Plane className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("travel_cost.inputs.lodging")}
          tooltip={t("travel_cost.inputs.lodging_tooltip")}
        >
          <NumberInput
            value={lodgingPerNight}
            onValueChange={(val) => {
              setLodgingPerNight(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("travel_cost.inputs.lodging_placeholder")}
            startIcon={<Hotel className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("travel_cost.inputs.meals")}
          tooltip={t("travel_cost.inputs.meals_tooltip")}
        >
          <NumberInput
            value={mealsPerDay}
            onValueChange={(val) => {
              setMealsPerDay(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("travel_cost.inputs.meals_placeholder")}
            startIcon={<Utensils className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("travel_cost.inputs.incidentals")}
          tooltip={t("travel_cost.inputs.incidentals_tooltip")}
        >
          <NumberInput
            value={incidentalsPerDay}
            onValueChange={(val) => {
              setIncidentalsPerDay(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("travel_cost.inputs.incidentals_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("travel_cost.inputs.days")}
          tooltip={t("travel_cost.inputs.days_tooltip")}
        >
          <NumberInput
            value={numberOfDays}
            onValueChange={(val) => {
              setNumberOfDays(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("travel_cost.inputs.days_placeholder")}
            startIcon={<Calendar className="h-4 w-4" />}
            min={1}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("travel_cost.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("travel_cost.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("travel_cost.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("travel_cost.info.use_case_1")}</li>
              <li>{t("travel_cost.info.use_case_2")}</li>
              <li>{t("travel_cost.info.use_case_3")}</li>
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
          {t("travel_cost.results.total_cost")}
        </div>
        <div className="text-4xl font-bold mb-2 text-primary">
          ${formatNumber(result.totalCost)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("travel_cost.results.daily_rate")}: ${formatNumber(result.dailyRate)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("travel_cost.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Plane className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("travel_cost.results.transport")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.transportCost)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Hotel className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("travel_cost.results.lodging")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.lodgingCost)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Utensils className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("travel_cost.results.meals")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.mealsCost)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Briefcase className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("travel_cost.results.incidentals")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.incidentalsCost)}</div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <DollarSign className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("travel_cost.results.cost_per_day")}</div>
          </div>
          <div className="text-2xl font-bold text-primary">${formatNumber(result.costPerDay)}</div>
          <div className="text-sm text-foreground-70">{t("travel_cost.results.average")}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Briefcase className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("travel_cost.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("travel_cost.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("travel_cost.title")}
      description={t("travel_cost.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
