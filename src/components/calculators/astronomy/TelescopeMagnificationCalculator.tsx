'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Focus, Info, Eye } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface TelescopeResult {
  magnification: number;
  exitPupil: number;
  trueFieldOfView: number;
  minUsefulMag: number;
  maxUsefulMag: number;
  isGoodForViewing: boolean;
}

export default function TelescopeMagnificationCalculator() {
  const { t } = useTranslation(['calc/astronomy', 'common']);
  const [telescopeFL, setTelescopeFL] = useState<string>('');
  const [eyepieceFL, setEyepieceFL] = useState<string>('');
  const [aperture, setAperture] = useState<string>('');
  const [eyepieceAFOV, setEyepieceAFOV] = useState<string>('52'); // Apparent field of view
  const [result, setResult] = useState<TelescopeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (error) setError('');
  }, [telescopeFL, eyepieceFL, aperture, eyepieceAFOV]);

  const calculate = () => {
    setError('');
    const telFL = parseFloat(telescopeFL);
    const eyeFL = parseFloat(eyepieceFL);
    const apertureVal = parseFloat(aperture);
    const afov = parseFloat(eyepieceAFOV);

    if (!telescopeFL || !eyepieceFL || isNaN(telFL) || isNaN(eyeFL)) {
      setError(t('telescope-magnification.errors.enter_focal_lengths'));
      return;
    }

    if (telFL <= 0 || eyeFL <= 0) {
      setError(t('telescope-magnification.errors.positive_values'));
      return;
    }

    if (eyeFL > telFL) {
      setError(t('telescope-magnification.errors.eyepiece_smaller'));
      return;
    }

    setShowResult(false);
    setTimeout(() => {
      // Magnification formula: M = Telescope Focal Length / Eyepiece Focal Length
      const magnification = telFL / eyeFL;

      // Exit pupil (mm) = Aperture / Magnification (or Eyepiece FL / f-ratio)
      let exitPupil = 0;
      let minUsefulMag = 0;
      let maxUsefulMag = 0;

      if (!isNaN(apertureVal) && apertureVal > 0) {
        exitPupil = apertureVal / magnification;
        // Minimum useful magnification: Aperture (mm) / 7 (max exit pupil for dark-adapted eye)
        minUsefulMag = apertureVal / 7;
        // Maximum useful magnification: 2x Aperture (mm)
        maxUsefulMag = apertureVal * 2;
      }

      // True field of view (degrees) = Apparent FOV / Magnification
      const trueFieldOfView = !isNaN(afov) && afov > 0 ? afov / magnification : 0;

      // Good for viewing if exit pupil is between 0.5mm and 7mm
      const isGoodForViewing = exitPupil >= 0.5 && exitPupil <= 7;

      setResult({
        magnification,
        exitPupil,
        trueFieldOfView,
        minUsefulMag,
        maxUsefulMag,
        isGoodForViewing,
      });

      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setTelescopeFL('');
      setEyepieceFL('');
      setAperture('');
      setEyepieceAFOV('52');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  // Common eyepiece focal lengths for quick reference
  const commonEyepieces = [4, 6, 8, 10, 12, 15, 18, 20, 25, 32, 40];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('telescope-magnification.title')}
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <FormField
          label={t('telescope-magnification.inputs.telescope_focal_length')}
          tooltip={t('telescope-magnification.tooltips.telescope_focal_length')}
        >
          <NumberInput
            value={telescopeFL}
            onValueChange={(val) => setTelescopeFL(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('common.placeholders.enterValue')}
            min={0}
            step={10}
            startIcon={<Focus className="h-4 w-4" />}
            unit={t('telescope-magnification.units.mm')}
          />
        </FormField>

        <FormField
          label={t('telescope-magnification.inputs.eyepiece_focal_length')}
          tooltip={t('telescope-magnification.tooltips.eyepiece_focal_length')}
        >
          <NumberInput
            value={eyepieceFL}
            onValueChange={(val) => setEyepieceFL(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('common.placeholders.enterValue')}
            min={0}
            step={1}
            startIcon={<Eye className="h-4 w-4" />}
            unit={t('telescope-magnification.units.mm')}
          />
        </FormField>

        <FormField
          label={t('telescope-magnification.inputs.aperture')}
          tooltip={t('telescope-magnification.tooltips.aperture')}
          description={t('telescope-magnification.inputs.aperture_optional')}
        >
          <NumberInput
            value={aperture}
            onValueChange={(val) => setAperture(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('common.placeholders.enterValue')}
            min={0}
            step={10}
            unit={t('telescope-magnification.units.mm')}
          />
        </FormField>

        <FormField
          label={t('telescope-magnification.inputs.eyepiece_afov')}
          tooltip={t('telescope-magnification.tooltips.eyepiece_afov')}
          description={t('telescope-magnification.inputs.afov_optional')}
        >
          <NumberInput
            value={eyepieceAFOV}
            onValueChange={(val) => setEyepieceAFOV(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="52"
            min={30}
            max={120}
            step={1}
            unit={t('telescope-magnification.units.degrees')}
          />
        </FormField>

        <div className="text-sm text-foreground-70 p-3 bg-muted/30 rounded-lg">
          <strong>{t('telescope-magnification.info.common_eyepieces')}:</strong>
          <div className="flex flex-wrap gap-2 mt-2">
            {commonEyepieces.map((fl) => (
              <button
                key={fl}
                type="button"
                onClick={() => setEyepieceFL(fl.toString())}
                className="px-2 py-1 text-xs rounded bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                {fl}mm
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t('telescope-magnification.info.title')}</h2>
          <p className="text-foreground-70 mb-4">
            {t('telescope-magnification.info.description')}
          </p>
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="font-mono text-center" dir="ltr">
              M = F<sub>telescope</sub> / F<sub>eyepiece</sub>
            </p>
          </div>
        </div>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t('telescope-magnification.results.magnification')}</div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">
          {result.magnification.toFixed(1)}x
        </div>
      </div>

      <div className="divider my-6"></div>

      <h3 className="font-bold mb-4 text-lg">{t('telescope-magnification.results.details')}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {result.exitPupil > 0 && (
          <div className={`p-4 rounded-lg border ${result.isGoodForViewing ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-orange-200 bg-orange-50 dark:bg-orange-900/20'}`}>
            <div className="text-sm text-foreground-70 mb-1">{t('telescope-magnification.results.exit_pupil')}</div>
            <div className={`text-xl font-bold ${result.isGoodForViewing ? 'text-green-600' : 'text-orange-600'}`} dir="ltr">
              {result.exitPupil.toFixed(2)} {t('telescope-magnification.units.mm')}
            </div>
            <div className="text-xs text-foreground-50 mt-1">
              {result.isGoodForViewing
                ? t('telescope-magnification.results.good_exit_pupil')
                : t('telescope-magnification.results.bad_exit_pupil')
              }
            </div>
          </div>
        )}

        {result.trueFieldOfView > 0 && (
          <div className="p-4 rounded-lg border border-border bg-blue-50 dark:bg-blue-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t('telescope-magnification.results.true_fov')}</div>
            <div className="text-xl font-bold text-blue-600" dir="ltr">
              {result.trueFieldOfView.toFixed(2)}&deg;
            </div>
          </div>
        )}

        {result.minUsefulMag > 0 && (
          <div className="p-4 rounded-lg border border-border bg-purple-50 dark:bg-purple-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t('telescope-magnification.results.min_useful_mag')}</div>
            <div className="text-xl font-bold text-purple-600" dir="ltr">
              {result.minUsefulMag.toFixed(0)}x
            </div>
          </div>
        )}

        {result.maxUsefulMag > 0 && (
          <div className="p-4 rounded-lg border border-border bg-amber-50 dark:bg-amber-900/20">
            <div className="text-sm text-foreground-70 mb-1">{t('telescope-magnification.results.max_useful_mag')}</div>
            <div className="text-xl font-bold text-amber-600" dir="ltr">
              {result.maxUsefulMag.toFixed(0)}x
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('telescope-magnification.info.tips_title')}</h4>
            <ul className="text-sm text-foreground-70 space-y-1">
              <li>{t('telescope-magnification.info.tip_1')}</li>
              <li>{t('telescope-magnification.info.tip_2')}</li>
              <li>{t('telescope-magnification.info.tip_3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('telescope-magnification.title')}
      description={t('telescope-magnification.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
