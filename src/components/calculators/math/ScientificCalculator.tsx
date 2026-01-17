'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Hash, History, Trash2, Delete, Save } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

export default function ScientificCalculator() {
  const { t } = useTranslation(['calc/math', 'common']);
  // State management
  const [display, setDisplay] = useState<string>('0');
  const [memory, setMemory] = useState<number>(0);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Convert degrees to radians
  const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

  // Scientific operations
  const handleOperation = (operation: string) => {
    try {
      setError('');
      const value = parseFloat(display);

      if (isNaN(value)) {
        setError(t("scientific.invalid_input"));
        return;
      }

      let result: number;

      switch (operation) {
        case 'sin':
          result = angleMode === 'deg' ? Math.sin(toRadians(value)) : Math.sin(value);
          break;
        case 'cos':
          result = angleMode === 'deg' ? Math.cos(toRadians(value)) : Math.cos(value);
          break;
        case 'tan':
          result = angleMode === 'deg' ? Math.tan(toRadians(value)) : Math.tan(value);
          break;
        case 'log':
          if (value <= 0) {
            setError(t("scientific.log_positive_required"));
            return;
          }
          result = Math.log10(value);
          break;
        case 'ln':
          if (value <= 0) {
            setError(t("scientific.ln_positive_required"));
            return;
          }
          result = Math.log(value);
          break;
        case 'exp':
          result = Math.exp(value);
          break;
        case 'sqrt':
          if (value < 0) {
            setError(t("scientific.sqrt_non_negative_required"));
            return;
          }
          result = Math.sqrt(value);
          break;
        case 'square':
          result = value * value;
          break;
        case 'cube':
          result = value * value * value;
          break;
        case 'inverse':
          if (value === 0) {
            setError(t("scientific.division_by_zero"));
            return;
          }
          result = 1 / value;
          break;
        case 'factorial':
          if (value < 0 || !Number.isInteger(value) || value > 170) {
            setError(t("scientific.factorial_error"));
            return;
          }
          result = factorial(value);
          break;
        case 'abs':
          result = Math.abs(value);
          break;
        default:
          return;
      }

      setDisplay(formatResult(result));
      addToHistory(`${operation}(${value}) = ${formatResult(result)}`);
    } catch (err) {
      setError(t("scientific.calculation_error"));
    }
  };

  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  // Memory functions
  const memoryAdd = () => {
    const value = parseFloat(display);
    if (!isNaN(value)) {
      setMemory(memory + value);
    }
  };

  const memorySubtract = () => {
    const value = parseFloat(display);
    if (!isNaN(value)) {
      setMemory(memory - value);
    }
  };

  const memoryRecall = () => {
    setDisplay(memory.toString());
  };

  const memoryClear = () => {
    setMemory(0);
  };

  // Format result
  const formatResult = (num: number): string => {
    if (!isFinite(num)) return t('common.error');
    if (Math.abs(num) < 1e-10 && num !== 0) return num.toExponential(4);
    if (Math.abs(num) > 1e10) return num.toExponential(4);
    if (Math.abs(num) < 0.0001) return num.toFixed(10).replace(/\.?0+$/, '');
    return num.toString();
  };

  const addToHistory = (entry: string) => {
    setHistory([entry, ...history.slice(0, 9)]);
  };

  const clearDisplay = () => {
    setDisplay('0');
    setError('');
  };

  const clearAll = () => {
    setDisplay('0');
    setMemory(0);
    setHistory([]);
    setError('');
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("scientific.title")}
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Display */}
        <div className="bg-card-bg border-2 border-primary rounded-lg p-6">
          <div className="text-right text-4xl font-bold font-mono mb-2 overflow-hidden" dir="ltr">
            {display}
          </div>
          {memory !== 0 && (
            <div className="text-sm text-foreground-60" dir="ltr">
              M: {memory}
            </div>
          )}
        </div>

        {/* Angle Mode */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setAngleMode('deg')}
            className={`px-4 py-2 rounded ${angleMode === 'deg' ? 'bg-primary text-white' : 'bg-card border border-border'}`}
          >
            {t("scientific.degrees")}
          </button>
          <button
            onClick={() => setAngleMode('rad')}
            className={`px-4 py-2 rounded ${angleMode === 'rad' ? 'bg-primary text-white' : 'bg-card border border-border'}`}
          >
            {t("scientific.radians")}
          </button>
        </div>

        {/* Number Input */}
        <FormField
          label={t("scientific.input_value")}
          tooltip={t("scientific.input_tooltip")}
        >
          <NumberInput
            value={display === '0' ? '' : display}
            onValueChange={(val) => setDisplay(val.toString() || '0')}
            placeholder="0"
            startIcon={<Hash className="h-4 w-4" />}
            className="font-mono"
          />
        </FormField>

        {/* Scientific Functions */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => handleOperation('sin')} className="outline-button py-3">sin</button>
          <button onClick={() => handleOperation('cos')} className="outline-button py-3">cos</button>
          <button onClick={() => handleOperation('tan')} className="outline-button py-3">tan</button>
          <button onClick={() => handleOperation('log')} className="outline-button py-3">log</button>

          <button onClick={() => handleOperation('ln')} className="outline-button py-3">ln</button>
          <button onClick={() => handleOperation('exp')} className="outline-button py-3">e<sup>x</sup></button>
          <button onClick={() => handleOperation('sqrt')} className="outline-button py-3">√</button>
          <button onClick={() => handleOperation('square')} className="outline-button py-3">x²</button>

          <button onClick={() => handleOperation('cube')} className="outline-button py-3">x³</button>
          <button onClick={() => handleOperation('inverse')} className="outline-button py-3">1/x</button>
          <button onClick={() => handleOperation('factorial')} className="outline-button py-3">n!</button>
          <button onClick={() => handleOperation('abs')} className="outline-button py-3">|x|</button>
        </div>

        {/* Memory Functions */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={memoryAdd} className="outline-button py-2 flex items-center justify-center"><Save className="w-3 h-3 mr-1" />+</button>
          <button onClick={memorySubtract} className="outline-button py-2 flex items-center justify-center"><Save className="w-3 h-3 mr-1" />-</button>
          <button onClick={memoryRecall} className="outline-button py-2">{t("scientific.memory_recall")}</button>
          <button onClick={memoryClear} className="outline-button py-2">{t("scientific.memory_clear")}</button>
        </div>

        {/* Clear Buttons */}
        <div className="flex gap-2">
          <button onClick={clearDisplay} className="outline-button flex-1 py-3 flex items-center justify-center">
            <Delete className="w-4 h-4 mr-2" />
            {t("scientific.clear")}
          </button>
          <button onClick={clearAll} className="primary-button flex-1 py-3 flex items-center justify-center">
            <Trash2 className="w-4 h-4 mr-2" />
            {t("scientific.clear_all")}
          </button>
        </div>

        <ErrorDisplay error={error} />

        {!history.length && (
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm">
            <h2 className="font-bold mb-2 text-lg">
              {t("scientific.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("scientific.description")}
            </p>
          </div>
        )}
      </div>
    </>
  );

  const resultSection = history.length > 0 ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <h3 className="font-medium mb-4 flex items-center">
        <History className="w-4 h-4 mr-2" />
        {t("scientific.history")}
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.map((entry, index) => (
          <div key={index} className="bg-card p-3 rounded-lg border border-border font-mono text-sm" dir="ltr">
            {entry}
          </div>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("scientific.page_title")}
      description={t("scientific.page_description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
