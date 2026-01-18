'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

export default function TimeZoneConverter() {
  const { t, i18n } = useTranslation(['calc/date-time', 'common']);
  const isRTL = i18n.language === 'ar';

  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [fromZone, setFromZone] = useState<string>('UTC');
  const [toZone, setToZone] = useState<string>('America/New_York');
  const [result, setResult] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const timezones = [
    { value: 'UTC', label: t('timezone_converter.timezone_utc'), offset: '+00:00' },
    { value: 'America/New_York', label: t('timezone_converter.timezone_eastern'), offset: '-05:00/-04:00' },
    { value: 'America/Chicago', label: t('timezone_converter.timezone_central'), offset: '-06:00/-05:00' },
    { value: 'America/Denver', label: t('timezone_converter.timezone_mountain'), offset: '-07:00/-06:00' },
    { value: 'America/Los_Angeles', label: t('timezone_converter.timezone_pacific'), offset: '-08:00/-07:00' },
    { value: 'Europe/London', label: t('timezone_converter.timezone_london'), offset: '+00:00/+01:00' },
    { value: 'Europe/Paris', label: t('timezone_converter.timezone_paris'), offset: '+01:00/+02:00' },
    { value: 'Asia/Dubai', label: t('timezone_converter.timezone_dubai'), offset: '+04:00' },
    { value: 'Asia/Riyadh', label: t('timezone_converter.timezone_riyadh'), offset: '+03:00' },
    { value: 'Asia/Tokyo', label: t('timezone_converter.timezone_tokyo'), offset: '+09:00' },
    { value: 'Asia/Shanghai', label: t('timezone_converter.timezone_shanghai'), offset: '+08:00' },
    { value: 'Australia/Sydney', label: t('timezone_converter.timezone_sydney'), offset: '+11:00/+10:00' }
  ].map(tz => ({
    value: tz.value,
    label: `${tz.label} (${tz.offset})`
  }));

  const convert = () => {
    setError('');
    if (!selectedDate || !selectedTime) {
      setError(t('timezone_converter.error_empty'));
      return;
    }

    try {
      const dateTimeStr = `${selectedDate}T${selectedTime}`;
      const date = new Date(dateTimeStr);

      if (isNaN(date.getTime())) {
        setError(t('timezone_converter.error_invalid'));
        return;
      }

      // Format the date in the target timezone
      const converted = new Intl.DateTimeFormat('en-US', {
        timeZone: toZone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }).format(date);

      setShowResult(false);
      setTimeout(() => {
        setResult(converted);
        setShowResult(true);
      }, 300);
    } catch (err) {
      setError(t('timezone_converter.error_conversion'));
    }
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setSelectedTime('');
      setSelectedDate('');
      setFromZone('UTC');
      setToZone('America/New_York');
      setResult('');
      setError('');
    }, 300);
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('timezone_converter.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t('timezone_converter.date')}>
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

        <InputContainer label={t('timezone_converter.time')}>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => {
              setSelectedTime(e.target.value);
              if (error) setError('');
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          />
        </InputContainer>

        <InputContainer label={t('timezone_converter.from_timezone')}>
          <Combobox
            options={timezones}
            value={fromZone}
            onChange={(val) => setFromZone(val)}
            placeholder={t('timezone_converter.from_timezone')}
          />
        </InputContainer>

        <InputContainer label={t('timezone_converter.to_timezone')}>
          <Combobox
            options={timezones}
            value={toZone}
            onChange={(val) => setToZone(val)}
            placeholder={t('timezone_converter.to_timezone')}
          />
        </InputContainer>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={convert} onReset={resetCalculator} />
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
          <Globe className="w-5 h-5 text-primary" />
          {t('timezone_converter.converted_time')}
        </div>
        <div className="text-3xl font-bold text-primary">{result}</div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('timezone_converter.title')}
      description={t('timezone_converter.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
