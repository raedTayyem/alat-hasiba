'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

export default function DateFormatConverter() {
  const { t, i18n } = useTranslation(['calc/date_time', 'common']);
  const isRTL = i18n.language === 'ar';
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [formats, setFormats] = useState<{[key: string]: string}>({});
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const formatDate = (date: Date) => {
    const formats: {[key: string]: string} = {};

    // ISO 8601
    formats[t('date_format_converter.format_iso_8601')] = date.toISOString();

    // RFC 2822
    formats[t('date_format_converter.format_rfc_2822')] = date.toUTCString();

    // US Format (MM/DD/YYYY)
    formats[t('date_format_converter.format_us')] = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

    // European Format (DD/MM/YYYY)
    formats[t('date_format_converter.format_european')] = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

    // ISO Short (YYYY-MM-DD)
    formats[t('date_format_converter.format_iso_short')] = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    // Long Format
    formats[t('date_format_converter.format_long')] = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Medium Format
    formats[t('date_format_converter.format_medium')] = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Unix Timestamp
    formats[t('date_format_converter.format_unix_timestamp')] = Math.floor(date.getTime() / 1000).toString();

    // Milliseconds
    formats[t('date_format_converter.format_milliseconds')] = date.getTime().toString();

    return formats;
  };

  const calculate = () => {
    setError('');
    if (!selectedDate) {
      setError(t('date_format_converter.error_empty'));
      return;
    }

    const date = new Date(selectedDate);
    if (isNaN(date.getTime())) {
      setError(t('date_format_converter.error_invalid'));
      return;
    }

    setShowResult(false);
    setTimeout(() => {
      setFormats(formatDate(date));
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setSelectedDate('');
      setFormats({});
      setError('');
    }, 300);
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('date_format_converter.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t('date_format_converter.date')}>
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
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>
    </>
  );

  const resultSection = Object.keys(formats).length > 0 && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        {t('date_format_converter.formats')}
      </h3>
      <div className="space-y-3">
        {Object.entries(formats).map(([name, value]) => (
          <div key={name} className="bg-card p-4 rounded-lg border border-border transition-colors hover:bg-muted/50">
            <div className="text-sm text-foreground-70 mb-1">{name}</div>
            <div className="font-mono text-primary break-all text-lg">{value}</div>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('date_format_converter.title')}
      description={t('date_format_converter.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
