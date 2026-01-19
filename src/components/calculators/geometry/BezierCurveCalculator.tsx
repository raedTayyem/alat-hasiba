'use client';

/**
 * BEZIER CURVE CALCULATOR
 *
 * Calculates Bezier curve points for quadratic and cubic curves
 * - Quadratic: B(t) = (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
 * - Cubic: B(t) = (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3(1-t)t^2*P2 + t^3*P3
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

interface BezierResult {
  x: number;
  y: number;
  t: number;
  curveType: 'quadratic' | 'cubic';
}

export default function BezierCurveCalculator() {
  const { t } = useTranslation(['calc/geometry', 'common']);
  const [curveType, setCurveType] = useState<'quadratic' | 'cubic'>('quadratic');
  const [tParam, setTParam] = useState<string>('0.5');
  const [p0x, setP0x] = useState<string>('0');
  const [p0y, setP0y] = useState<string>('0');
  const [p1x, setP1x] = useState<string>('50');
  const [p1y, setP1y] = useState<string>('100');
  const [p2x, setP2x] = useState<string>('100');
  const [p2y, setP2y] = useState<string>('0');
  const [p3x, setP3x] = useState<string>('150');
  const [p3y, setP3y] = useState<string>('50');
  const [result, setResult] = useState<BezierResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');
    const tVal = parseFloat(tParam);
    if (isNaN(tVal) || tVal < 0 || tVal > 1) {
      setError(t("bezier_curve_calculator.error_t_range"));
      return false;
    }
    const points = [p0x, p0y, p1x, p1y, p2x, p2y];
    if (curveType === 'cubic') points.push(p3x, p3y);
    if (points.some(p => isNaN(parseFloat(p)))) {
      setError(t("bezier_curve_calculator.error_invalid_input"));
      return false;
    }
    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;
    setShowResult(false);
    setTimeout(() => {
      try {
        const tVal = parseFloat(tParam);
        const [x0, y0, x1, y1, x2, y2] = [p0x, p0y, p1x, p1y, p2x, p2y].map(parseFloat);

        let x, y;
        if (curveType === 'quadratic') {
          x = (1 - tVal) ** 2 * x0 + 2 * (1 - tVal) * tVal * x1 + tVal ** 2 * x2;
          y = (1 - tVal) ** 2 * y0 + 2 * (1 - tVal) * tVal * y1 + tVal ** 2 * y2;
        } else {
          const [x3, y3] = [parseFloat(p3x), parseFloat(p3y)];
          x = (1 - tVal) ** 3 * x0 + 3 * (1 - tVal) ** 2 * tVal * x1 + 3 * (1 - tVal) * tVal ** 2 * x2 + tVal ** 3 * x3;
          y = (1 - tVal) ** 3 * y0 + 3 * (1 - tVal) ** 2 * tVal * y1 + 3 * (1 - tVal) * tVal ** 2 * y2 + tVal ** 3 * y3;
        }

        setResult({ x, y, t: tVal, curveType });
        setShowResult(true);
      } catch (err) {
        setError(t("bezier_curve_calculator.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setTParam('0.5');
      setP0x('0');
      setP0y('0');
      setP1x('50');
      setP1y('100');
      setP2x('100');
      setP2y('0');
      setP3x('150');
      setP3y('50');
      setResult(null);
      setError('');
    }, 300);
  };


  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t("bezier_curve_calculator.curve_type")} tooltip={t("bezier_curve_calculator.curve_type_tooltip")}>
          <Combobox
            options={[
              { value: 'quadratic', label: t("bezier_curve_calculator.quadratic") },
              { value: 'cubic', label: t("bezier_curve_calculator.cubic") }
            ]}
            value={curveType}
            onChange={(val) => setCurveType(val as 'quadratic' | 'cubic')}
          />
        </InputContainer>
        <InputContainer label={t("bezier_curve_calculator.t_value")} tooltip={t("bezier_curve_calculator.t_value_tooltip")}>
          <NumberInput
            value={tParam}
            onValueChange={(value) => { setTParam(String(value)); if (error) setError(''); }}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("placeholders.curveType")}
            step={0.01}
            min={0}
            max={1}
          />
        </InputContainer>
        <div className="grid grid-cols-2 gap-4">
          <InputContainer label={t("bezier_curve_calculator.p0")} tooltip={t("bezier_curve_calculator.p0_tooltip")}>
            <div className="flex gap-2">
              <NumberInput
                value={p0x}
                onValueChange={(val) => setP0x(String(val))}
                className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
                placeholder={t("common:placeholders.xCoordinate")}
                step={0.01}
              />
              <NumberInput
                value={p0y}
                onValueChange={(val) => setP0y(String(val))}
                className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
                placeholder={t("common:placeholders.yCoordinate")}
                step={0.01}
              />
            </div>
          </InputContainer>
          <InputContainer label={t("bezier_curve_calculator.p1")} tooltip={t("bezier_curve_calculator.p1_tooltip")}>
            <div className="flex gap-2">
              <NumberInput
                value={p1x}
                onValueChange={(val) => setP1x(String(val))}
                className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
                placeholder={t("common:placeholders.xCoordinate")}
                step={0.01}
              />
              <NumberInput
                value={p1y}
                onValueChange={(val) => setP1y(String(val))}
                className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
                placeholder={t("common:placeholders.yCoordinate")}
                step={0.01}
              />
            </div>
          </InputContainer>
          <InputContainer label={t("bezier_curve_calculator.p2")} tooltip={t("bezier_curve_calculator.p2_tooltip")}>
            <div className="flex gap-2">
              <NumberInput
                value={p2x}
                onValueChange={(val) => setP2x(String(val))}
                className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
                placeholder={t("common:placeholders.xCoordinate")}
                step={0.01}
              />
              <NumberInput
                value={p2y}
                onValueChange={(val) => setP2y(String(val))}
                className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
                placeholder={t("common:placeholders.yCoordinate")}
                step={0.01}
              />
            </div>
          </InputContainer>
          {curveType === 'cubic' && (
            <InputContainer label={t("bezier_curve_calculator.p3")} tooltip={t("bezier_curve_calculator.p3_tooltip")}>
              <div className="flex gap-2">
                <NumberInput
                  value={p3x}
                  onValueChange={(val) => setP3x(String(val))}
                    className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
                  placeholder={t("common:placeholders.xCoordinate")}
                  step={0.01}
                />
                <NumberInput
                  value={p3y}
                  onValueChange={(val) => setP3y(String(val))}
                    className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
                  placeholder={t("common:placeholders.yCoordinate")}
                  step={0.01}
                />
              </div>
            </InputContainer>
          )}
        </div>
      </div>
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>
      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("bezier_curve_calculator.info_title")}</h2>
          <p className="text-foreground-70 mb-3">{t("bezier_curve_calculator.info_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("bezier_curve_calculator.result_point")}</div>
        <div className="text-3xl font-bold text-primary mb-2">({result.x.toFixed(2)}, {result.y.toFixed(2)})</div>
        <div className="text-lg text-foreground-70">t = {result.t}</div>
      </div>
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("bezier_curve_calculator.formula_explanation_title")}</h4>
            <p className="text-sm text-foreground-70">{t("bezier_curve_calculator.formula_explanation")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("bezier_curve_calculator.title")}
      description={t("bezier_curve_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
