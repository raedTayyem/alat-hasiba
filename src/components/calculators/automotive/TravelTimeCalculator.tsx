'use client';

/**
 * Travel Time Calculator
 * Calculates travel time for road trips including stops
 * Formula: Total Time = Distance / Speed + (Stops × Stop Duration)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Gauge, Coffee, Timer, Info, Navigation, Calendar } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface TravelTimeResult {
  drivingTimeHours: number;
  drivingTimeMinutes: number;
  totalStopTime: number;
  totalTimeHours: number;
  totalTimeMinutes: number;
  arrivalTime: string;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function TravelTimeCalculator() {
  const { t } = useTranslation('calc/automotive');

  // State for inputs
  const [distance, setDistance] = useState<string>('');
  const [averageSpeed, setAverageSpeed] = useState<string>('');
  const [numberOfStops, setNumberOfStops] = useState<string>('0');
  const [stopDuration, setStopDuration] = useState<string>('15');
  const [departureTime, setDepartureTime] = useState<string>('');
  const [unitSystem, setUnitSystem] = useState<string>('metric');

  // Result and UI state
  const [result, setResult] = useState<TravelTimeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
    // Set default departure time to current time
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setDepartureTime(`${hours}:${minutes}`);
  }, []);

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const distanceVal = parseFloat(distance);
    const speedVal = parseFloat(averageSpeed);
    const stopsVal = parseInt(numberOfStops);
    const stopDurVal = parseFloat(stopDuration);

    if (isNaN(distanceVal) || isNaN(speedVal)) {
      setError(t("travel_time.error_missing_inputs"));
      return false;
    }

    if (distanceVal <= 0) {
      setError(t("travel_time.error_positive_distance"));
      return false;
    }

    if (speedVal <= 0) {
      setError(t("travel_time.error_positive_speed"));
      return false;
    }

    if (stopsVal < 0) {
      setError(t("travel_time.error_negative_stops"));
      return false;
    }

    if (stopDurVal < 0) {
      setError(t("travel_time.error_negative_duration"));
      return false;
    }

    return true;
  };

  // Format time from total minutes to hours and minutes
  const formatTime = (totalMinutes: number): { hours: number; minutes: number } => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return { hours, minutes };
  };

  // Calculate arrival time
  const calculateArrivalTime = (departureStr: string, totalMinutes: number): string => {
    if (!departureStr) return '';

    const [hours, minutes] = departureStr.split(':').map(Number);
    const departure = new Date();
    departure.setHours(hours, minutes, 0, 0);

    const arrival = new Date(departure.getTime() + totalMinutes * 60000);
    const arrivalHours = String(arrival.getHours()).padStart(2, '0');
    const arrivalMinutes = String(arrival.getMinutes()).padStart(2, '0');

    // Check if arrival is next day
    if (arrival.getDate() !== departure.getDate()) {
      return `${arrivalHours}:${arrivalMinutes} ${t("travel_time.next_day", { count: 1 })}`;
    }

    return `${arrivalHours}:${arrivalMinutes}`;
  };

  // Calculation
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        let distanceVal = parseFloat(distance);
        let speedVal = parseFloat(averageSpeed);
        const stopsVal = parseInt(numberOfStops) || 0;
        const stopDurVal = parseFloat(stopDuration) || 0;

        // Convert to metric if imperial
        if (unitSystem === 'imperial') {
          distanceVal = distanceVal * 1.60934; // miles to km
          speedVal = speedVal * 1.60934; // mph to km/h
        }

        // Calculate driving time in minutes
        const drivingTimeMinutesTotal = (distanceVal / speedVal) * 60;
        const drivingTime = formatTime(drivingTimeMinutesTotal);

        // Calculate total stop time in minutes
        const totalStopTime = stopsVal * stopDurVal;

        // Calculate total time in minutes
        const totalTimeMinutesTotal = drivingTimeMinutesTotal + totalStopTime;
        const totalTime = formatTime(totalTimeMinutesTotal);

        // Calculate arrival time
        const arrivalTime = calculateArrivalTime(departureTime, totalTimeMinutesTotal);

        setResult({
          drivingTimeHours: drivingTime.hours,
          drivingTimeMinutes: drivingTime.minutes,
          totalStopTime,
          totalTimeHours: totalTime.hours,
          totalTimeMinutes: totalTime.minutes,
          arrivalTime,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("travel_time.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setDistance('');
      setAverageSpeed('');
      setNumberOfStops('0');
      setStopDuration('15');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const unitOptions = [
    { value: 'metric', label: t("travel_time.metric") },
    { value: 'imperial', label: t("travel_time.imperial") },
  ];

  // INPUT SECTION
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("travel_time.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Unit System */}
        <FormField
          label={t("travel_time.unit_system")}
          tooltip={t("travel_time.unit_system_tooltip")}
        >
          <Combobox
            options={unitOptions}
            value={unitSystem}
            onChange={(val) => setUnitSystem(val)}
            placeholder={t("travel_time.unit_system")}
          />
        </FormField>

        {/* Distance */}
        <FormField
          label={unitSystem === 'imperial'
            ? t("travel_time.inputs.distance_miles")
            : t("travel_time.inputs.distance_km")}
          tooltip={t("travel_time.distance_tooltip")}
        >
          <NumberInput
            value={distance}
            onValueChange={(val) => { setDistance(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("travel_time.placeholders.distance_miles") : t("travel_time.placeholders.distance_km")}
            min={0}
            step={10}
            startIcon={<MapPin className="h-4 w-4" />}
          />
        </FormField>

        {/* Average Speed */}
        <FormField
          label={unitSystem === 'imperial'
            ? t("travel_time.inputs.speed_mph")
            : t("travel_time.inputs.speed_kmh")}
          tooltip={t("travel_time.speed_tooltip")}
        >
          <NumberInput
            value={averageSpeed}
            onValueChange={(val) => { setAverageSpeed(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("travel_time.placeholders.speed_mph") : t("travel_time.placeholders.speed_kmh")}
            min={0}
            step={5}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        {/* Number of Stops */}
        <FormField
          label={t("travel_time.inputs.stops")}
          tooltip={t("travel_time.stops_tooltip")}
        >
          <NumberInput
            value={numberOfStops}
            onValueChange={(val) => { setNumberOfStops(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("travel_time.placeholders.stops")}
            min={0}
            step={1}
            startIcon={<Coffee className="h-4 w-4" />}
          />
        </FormField>

        {/* Stop Duration */}
        <FormField
          label={t("travel_time.inputs.stop_duration")}
          tooltip={t("travel_time.stop_duration_tooltip")}
        >
          <NumberInput
            value={stopDuration}
            onValueChange={(val) => { setStopDuration(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("travel_time.placeholders.stop_duration")}
            min={0}
            step={5}
            startIcon={<Timer className="h-4 w-4" />}
          />
        </FormField>

        {/* Departure Time */}
        <FormField
          label={t("travel_time.inputs.departure_time")}
          tooltip={t("travel_time.departure_tooltip")}
        >
          <input
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </FormField>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      {/* Error Message */}
      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {/* Information Section */}
      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("travel_time.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("travel_time.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("travel_time.tips_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("travel_time.tip_1")}</li>
              <li>{t("travel_time.tip_2")}</li>
              <li>{t("travel_time.tip_3")}</li>
              <li>{t("travel_time.tip_4")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  // RESULT SECTION
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("travel_time.result_title")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.totalTimeHours}{t("travel_time.hours_short")} {result.totalTimeMinutes}{t("travel_time.minutes_short")}
        </div>
        <div className="text-lg text-foreground-70">
          {t("travel_time.total_travel_time")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("travel_time.detailed_results")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Navigation className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("travel_time.driving_time")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.drivingTimeHours}{t("travel_time.hours_short")} {result.drivingTimeMinutes}{t("travel_time.minutes_short")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Coffee className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("travel_time.total_stop_time")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.totalStopTime} {t("travel_time.minutes")}
            </div>
          </div>

          {result.arrivalTime && (
            <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("travel_time.estimated_arrival")}</div>
              </div>
              <div className="text-sm text-foreground-70">
                {result.arrivalTime}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("travel_time.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("travel_time.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("travel_time.title")}
      description={t("travel_time.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
