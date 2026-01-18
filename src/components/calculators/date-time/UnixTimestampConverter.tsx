'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Hash } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

export default function UnixTimestampConverter() {
  const { t, i18n } = useTranslation(['calc/date-time', 'common']);
  const isRTL = i18n.language === 'ar';
  const [mode, setMode] = useState<string>('toDate');
  const [timestamp, setTimestamp] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const calculate = () => {
    setError('');

    if (mode === 'toDate') {
      const ts = parseInt(timestamp);
      if (isNaN(ts)) {
        setError(t('unix_timestamp_converter.error_invalid_timestamp'));
        return;
      }
      const date = new Date(ts * 1000);
      setResult(date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    } else {
      if (!selectedDate) {
        setError(t('unix_timestamp_converter.error_empty_date'));
        return;
      }
      const dateStr = `${selectedDate}${selectedTime ? `T${selectedTime}` : ''}`;
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        setError(t('unix_timestamp_converter.error_invalid_date'));
        return;
      }
      setResult(Math.floor(date.getTime() / 1000).toString());
    }

    setShowResult(false);
    setTimeout(() => setShowResult(true), 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setTimestamp('');
      setSelectedDate('');
      setSelectedTime('');
      setResult('');
      setError('');
    }, 300);
  };

  const modeOptions = [
    { value: 'toDate', label: t('unix_timestamp_converter.timestamp_to_date') },
    { value: 'toTimestamp', label: t('unix_timestamp_converter.date_to_timestamp') },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('unix_timestamp_converter.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t('unix_timestamp_converter.mode')}>
          <Combobox
            options={modeOptions}
            value={mode}
            onChange={(val) => {
              setMode(val);
              setResult('');
              setError('');
            }}
            placeholder={t('unix_timestamp_converter.mode')}
          />
        </InputContainer>

        {mode === 'toDate' ? (
          <InputContainer label={t('unix_timestamp_converter.timestamp')}>
            <NumericInput
              value={timestamp}
              onChange={(e) => {
                setTimestamp(e.target.value);
                if (error) setError('');
              }}
              placeholder="1234567890"
              min={0}
              startIcon={<Hash className="h-4 w-4" />}
            />
          </InputContainer>
        ) : (
          <>
            <InputContainer label={t('unix_timestamp_converter.date')}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  if (error) setError('');
                }}
                className="date-input-rtl w-full rounded-md border border-input bg-background px-3 py-3 text-base"
                dir={isRTL ? "rtl" : "ltr"}
              />
            </InputContainer>

            <InputContainer label={t('unix_timestamp_converter.time')}>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
              />
            </InputContainer>
          </>
        )}
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center">
        <div className="text-foreground-70 mb-2 flex items-center justify-center gap-2">
          {mode === 'toDate' ? <Calendar className="w-5 h-5" /> : <Hash className="w-5 h-5" />}
          {mode === 'toDate' ? t('unix_timestamp_converter.converted_date') : t('unix_timestamp_converter.unix_timestamp_result')}
        </div>
        <div className="text-3xl font-bold text-primary break-all" dir="ltr">{result}</div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('unix_timestamp_converter.title')}
      description={t('unix_timestamp_converter.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
