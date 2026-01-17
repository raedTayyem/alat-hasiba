'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Ruler, Clock, Target, Info, Timer, Trophy } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function RaceTimePredictor() {
  const { t } = useTranslation('calc/fitness');

  const [raceDistance, setRaceDistance] = useState<string>('');
  const [raceTime, setRaceTime] = useState<string>('');
  const [targetDistance, setTargetDistance] = useState<string>('marathon');
  const [result, setResult] = useState<{
    predictedTime: string;
    pace: string;
    distances: { name: string; time: string; pace: string }[];
  } | null>(null);
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  const distances: Record<string, number> = {
    '5k': 5,
    '10k': 10,
    'half': 21.0975,
    'marathon': 42.195
  };

  const calculate = () => {
    const raceDistVal = parseFloat(raceDistance);
    const raceTimeVal = parseFloat(raceTime);

    if (!raceDistVal || !raceTimeVal) {
      setError(t("calculators.invalid_input"));
      return;
    }

    if (raceDistVal <= 0 || raceTimeVal <= 0) {
      setError(t("common.errors.positiveNumber"));
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      // Riegel formula: T2 = T1 * (D2/D1)^1.06
      const targetDist = distances[targetDistance];
      const predictedMinutes = raceTimeVal * Math.pow(targetDist / raceDistVal, 1.06);

      const hours = Math.floor(predictedMinutes / 60);
      const minutes = Math.floor(predictedMinutes % 60);
      const seconds = Math.round((predictedMinutes % 1) * 60);

      const paceMinPerKm = predictedMinutes / targetDist;
      const paceMin = Math.floor(paceMinPerKm);
      const paceSec = Math.round((paceMinPerKm % 1) * 60);

      const allDistances = Object.entries(distances).map(([key, dist]) => {
        const time = raceTimeVal * Math.pow(dist / raceDistVal, 1.06);
        const h = Math.floor(time / 60);
        const m = Math.floor(time % 60);
        const s = Math.round((time % 1) * 60);
        const p = time / dist;
        const pm = Math.floor(p);
        const ps = Math.round((p % 1) * 60);

        return {
          name: key === '5k' ? t("race_predictor.distances.5k") : key === '10k' ? t("race_predictor.distances.10k") : key === 'half' ? t("race_predictor.distances.half") : t("race_predictor.distances.marathon"),
          time: h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`,
          pace: `${pm}:${ps.toString().padStart(2, '0')}`
        };
      });

      setResult({
        predictedTime: hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` : `${minutes}:${seconds.toString().padStart(2, '0')}`,
        pace: `${paceMin}:${paceSec.toString().padStart(2, '0')}`,
        distances: allDistances
      });

      setShowResult(true);
    }, 300);
  };

  const reset = () => {
    setShowResult(false);
    setTimeout(() => {
      setRaceDistance('');
      setRaceTime('');
      setTargetDistance('marathon');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const targetDistanceOptions = [
    { value: '5k', label: t("race_predictor.distances.5k") },
    { value: '10k', label: t("race_predictor.distances.10k") },
    { value: 'half', label: t("race_predictor.distances.half") },
    { value: 'marathon', label: t("race_predictor.distances.marathon") },
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("race_predictor.race_distance")}
          tooltip={t("race_predictor.race_distance_tooltip")}
        >
          <NumberInput
            value={raceDistance}
            onValueChange={(val) => setRaceDistance(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("race_predictor.enter_distance")}
            min={1}
            step={0.1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("race_predictor.race_time")}
          tooltip={t("race_predictor.race_time_tooltip")}
        >
          <NumberInput
            value={raceTime}
            onValueChange={(val) => setRaceTime(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("race_predictor.enter_time")}
            min={1}
            step={0.1}
            startIcon={<Clock className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("race_predictor.target_distance")}
          tooltip={t("race_predictor.target_distance_tooltip")}
          className="md:col-span-2"
        >
          <Combobox
            options={targetDistanceOptions}
            value={targetDistance}
            onChange={(val) => setTargetDistance(val)}
            placeholder={t("race_predictor.target_distance")}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("race_predictor.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("race_predictor.reset_btn")}
        </button>
      </div>

      {error && (
        <div className="text-error mt-3 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn">
          <Info className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="mr-2">{error}</span>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("race_predictor.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("race_predictor.predicted_time")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            {result.predictedTime}
          </div>
          <div className="text-sm text-foreground-70 mt-1 flex items-center gap-1">
            <Timer className="w-4 h-4" />
            {t("race_predictor.pace")} {result.pace} {t("race_predictor.per_km")}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-bold mb-2">{t("race_predictor.all_predictions")}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {result.distances.map((d) => (
              <div key={d.name} className="bg-card p-3 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">{d.name}</div>
                  <div className="font-bold text-primary">{d.time}</div>
                </div>
                <div className="text-xs text-foreground-70 mt-1 text-right">
                  {t("race_predictor.pace")} {d.pace} {t("race_predictor.per_km")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("race_predictor.tips_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>{t("race_predictor.tip_train")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Target className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("race_predictor.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("race_predictor.title")}
      description={t("race_predictor.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("race_predictor.footer_note")}
     className="rtl" />
  );
}
