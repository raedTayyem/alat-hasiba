'use client';

/**
 * Reading Speed Calculator - Education Category
 * 
 * Features:
 * - Calculate words per minute (WPM)
 * - Estimate time to read a book or article
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Book, Timer, Play, Square, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function ReadingSpeedCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/education', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [totalWords, setTotalWords] = useState<string>('500');
  const [minutes, setMinutes] = useState<string>('2');
  const [seconds, setSeconds] = useState<string>('30');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Timer states
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    initDateInputRTL();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const words = parseInt(totalWords);
    const totalSec = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);

    if (isNaN(words) || words <= 0) {
      setError(t('reading_speed.errors.invalid_words'));
      return false;
    }
    if (totalSec <= 0) {
      setError(t('reading_speed.errors.invalid_time'));
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------------------------
  // CALCULATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const calculate = () => {
    if (!validateInputs()) return;
    setShowResult(true);
  };

  const totalSeconds = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
  const wpm = totalSeconds > 0 ? (parseInt(totalWords) / totalSeconds) * 60 : 0;

  const startTimer = () => {
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setShowResult(false);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    setMinutes(m.toString());
    setSeconds(s.toString());
    setShowResult(true);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setTotalWords('500');
    setMinutes('2');
    setSeconds('30');
    setError('');
  };

  // ---------------------------------------------------------------------------
  // JSX SECTIONS
  // ---------------------------------------------------------------------------
  const inputSection = (
    <div className="space-y-6">
      <div className="bg-muted/30 p-6 rounded-2xl text-center space-y-4">
        <h4 className="font-semibold flex items-center justify-center gap-2">
          <Timer className="w-4 h-4" />
          {t('reading_speed.timer_title')}
        </h4>
        <div className="text-4xl font-mono font-bold text-primary">
          {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:
          {(timerSeconds % 60).toString().padStart(2, '0')}
        </div>
        <div className="flex gap-2">
          {!isTimerRunning ? (
            <button
              onClick={startTimer}
              className="flex-1 bg-success text-success-foreground h-12 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              {t('reading_speed.start_timer')}
            </button>
          ) : (
            <button
              onClick={stopTimer}
              className="flex-1 bg-error text-error-foreground h-12 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 animate-pulse"
            >
              <Square className="w-4 h-4" />
              {t('reading_speed.stop_timer')}
            </button>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
          {t('reading_speed.timer_hint')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <FormField label={t('reading_speed.total_words')}>
          <NumberInput
            value={totalWords}
            onValueChange={(val) => setTotalWords(val.toString())}
            min={1}
            startIcon={<Book className="w-4 h-4" />}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label={t('reading_speed.minutes')}>
            <NumberInput
              value={minutes}
              onValueChange={(val) => setMinutes(val.toString())}
              min={0}
            />
          </FormField>
          <FormField label={t('reading_speed.seconds')}>
            <NumberInput
              value={seconds}
              onValueChange={(val) => setSeconds(val.toString())}
              min={0}
              max={59}
            />
          </FormField>
        </div>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />

      <ErrorDisplay error={error} />
    </div>
  );

  const resultSection = showResult ? (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
          <Timer className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{t('reading_speed.result_title')}</h3>
        
        <div className="py-6 border-y border-border/50 space-y-2">
          <div className="text-6xl font-black tracking-tighter text-primary">
            {Math.round(wpm)}
          </div>
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            {t('reading_speed.wpm_label')}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          <div className="p-6 bg-muted/50 rounded-2xl text-left">
            <h5 className="font-semibold text-sm mb-2">{t('reading_speed.estimations')}</h5>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{t('reading_speed.short_article')} (1000 words)</span>
                <span className="text-sm font-bold">{(1000 / (wpm || 1)).toFixed(1)} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{t('reading_speed.long_book')} (50k words)</span>
                <span className="text-sm font-bold">{(50000 / (wpm || 1) / 60).toFixed(1)} {t('common:hours')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 mt-6">
        <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
          <Info className="w-4 h-4" />
          {t('reading_speed.info_title')}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {wpm < 200 ? t('reading_speed.level_slow') : 
           wpm < 400 ? t('reading_speed.level_average') : 
           t('reading_speed.level_fast')}
        </p>
      </div>
    </div>
  ) : (
    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
        <Book className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">{t('common.results_ready')}</h3>
        <p className="text-sm text-muted-foreground max-w-[250px]">
          {t('reading_speed.result_placeholder')}
        </p>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t('reading_speed.title')}
      description={t('reading_speed.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      category="education"
    />
  );
}
