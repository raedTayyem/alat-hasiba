'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Atom, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// Atomic weights (g/mol) - Standard atomic weights from IUPAC 2021
const ATOMIC_WEIGHTS: { [key: string]: number } = {
  H: 1.008,
  He: 4.0026,
  Li: 6.94,
  Be: 9.0122,
  B: 10.81,
  C: 12.011,
  N: 14.007,
  O: 15.999,
  F: 18.998,
  Ne: 20.180,
  Na: 22.990,
  Mg: 24.305,
  Al: 26.982,
  Si: 28.085,
  P: 30.974,
  S: 32.06,
  Cl: 35.45,
  Ar: 39.948,
  K: 39.098,
  Ca: 40.078,
  Sc: 44.956,
  Ti: 47.867,
  V: 50.942,
  Cr: 51.996,
  Mn: 54.938,
  Fe: 55.845,
  Co: 58.933,
  Ni: 58.693,
  Cu: 63.546,
  Zn: 65.38,
  Ga: 69.723,
  Ge: 72.630,
  As: 74.922,
  Se: 78.971,
  Br: 79.904,
  Kr: 83.798,
  Rb: 85.468,
  Sr: 87.62,
  Y: 88.906,
  Zr: 91.224,
  Nb: 92.906,
  Mo: 95.95,
  Ru: 101.07,
  Rh: 102.91,
  Pd: 106.42,
  Ag: 107.87,
  Cd: 112.41,
  In: 114.82,
  Sn: 118.71,
  Sb: 121.76,
  Te: 127.60,
  I: 126.90,
  Xe: 131.29,
  Cs: 132.91,
  Ba: 137.33,
  La: 138.91,
  Ce: 140.12,
  Pr: 140.91,
  Nd: 144.24,
  Sm: 150.36,
  Eu: 151.96,
  Gd: 157.25,
  Tb: 158.93,
  Dy: 162.50,
  Ho: 164.93,
  Er: 167.26,
  Tm: 168.93,
  Yb: 173.05,
  Lu: 174.97,
  Hf: 178.49,
  Ta: 180.95,
  W: 183.84,
  Re: 186.21,
  Os: 190.23,
  Ir: 192.22,
  Pt: 195.08,
  Au: 196.97,
  Hg: 200.59,
  Tl: 204.38,
  Pb: 207.2,
  Bi: 208.98,
  U: 238.03,
};

interface ElementCount {
  element: string;
  count: number;
  mass: number;
}

interface MolarMassResult {
  formula: string;
  totalMass: number;
  elements: ElementCount[];
}

export default function MolarMassCalculator() {
  const { t } = useTranslation(['calc/science', 'common']);

  const [formula, setFormula] = useState('');
  const [result, setResult] = useState<MolarMassResult | null>(null);
  const [error, setError] = useState<string>('');

  // Parse chemical formula and calculate molar mass
  const parseFormula = (formula: string): ElementCount[] | null => {
    const elements: ElementCount[] = [];
    const elementMap: { [key: string]: number } = {};

    // Remove spaces
    const cleanFormula = formula.replace(/\s/g, '');

    // Match pattern: Element symbol (1-2 letters, first uppercase) followed by optional number
    const regex = /([A-Z][a-z]?)(\d*)/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(cleanFormula)) !== null) {
      // Check for gaps (invalid characters)
      if (match.index !== lastIndex) {
        return null;
      }
      lastIndex = regex.lastIndex;

      const element = match[1];
      const count = match[2] ? parseInt(match[2]) : 1;

      if (!ATOMIC_WEIGHTS[element]) {
        return null;
      }

      if (elementMap[element]) {
        elementMap[element] += count;
      } else {
        elementMap[element] = count;
      }
    }

    // Check if we parsed the entire formula
    if (lastIndex !== cleanFormula.length) {
      return null;
    }

    // Convert map to array with mass calculations
    for (const element in elementMap) {
      const count = elementMap[element];
      const mass = ATOMIC_WEIGHTS[element] * count;
      elements.push({ element, count, mass });
    }

    return elements.length > 0 ? elements : null;
  };

  const calculate = () => {
    setError('');
    setResult(null);

    if (!formula.trim()) {
      setError(t('molar_mass.errors.enter_formula'));
      return;
    }

    const elements = parseFormula(formula.trim());

    if (!elements) {
      setError(t('molar_mass.errors.invalid_formula'));
      return;
    }

    const totalMass = elements.reduce((sum, el) => sum + el.mass, 0);

    setResult({
      formula: formula.trim(),
      totalMass,
      elements,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const resetCalculator = () => {
    setFormula('');
    setResult(null);
    setError('');
  };

  const commonFormulas = [
    { formula: 'H2O', name: t('molar_mass.common.water') },
    { formula: 'NaCl', name: t('molar_mass.common.salt') },
    { formula: 'CO2', name: t('molar_mass.common.carbon_dioxide') },
    { formula: 'C6H12O6', name: t('molar_mass.common.glucose') },
    { formula: 'H2SO4', name: t('molar_mass.common.sulfuric_acid') },
    { formula: 'NaOH', name: t('molar_mass.common.sodium_hydroxide') },
  ];

  const inputSection = (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-4">{t('molar_mass.title')}</h2>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <FormField label={t('molar_mass.inputs.formula')} tooltip={t('molar_mass.tooltips.formula')}>
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="relative">
                <Atom className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-3 py-3 rounded-md border border-input bg-background text-base"
                  placeholder={t('molar_mass.placeholders.formula')}
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </FormField>

        <div className="flex flex-wrap gap-2 justify-center">
          {commonFormulas.map((item) => (
            <button
              key={item.formula}
              onClick={() => setFormula(item.formula)}
              className="px-3 py-1 text-sm rounded-full border border-primary/30 hover:bg-primary/10 transition-colors"
              title={item.name}
            >
              {item.formula}
            </button>
          ))}
        </div>

        <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <strong>{t('common.info')}:</strong> {t('molar_mass.formulas.info')}<br />
            {t('molar_mass.formulas.example')}
          </div>
        </div>

        <ErrorDisplay error={error} />
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
    </>
  );

  const resultSection = result !== null ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t('molar_mass.results.molar_mass_of')} <span className="font-mono font-bold" dir="ltr">{result.formula}</span>
        </div>
        <div className="text-4xl font-bold text-primary flex flex-col items-center justify-center">
          <Atom className="w-8 h-8 mb-2 text-purple-500" />
          {result.totalMass.toFixed(4)} {t('molar_mass.units.g_mol')}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-3 text-center">{t('molar_mass.results.breakdown')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-3 text-right">{t('molar_mass.results.element')}</th>
                <th className="py-2 px-3 text-center">{t('molar_mass.results.count')}</th>
                <th className="py-2 px-3 text-center">{t('molar_mass.results.atomic_weight')}</th>
                <th className="py-2 px-3 text-left">{t('molar_mass.results.contribution')}</th>
              </tr>
            </thead>
            <tbody>
              {result.elements.map((el) => (
                <tr key={el.element} className="border-b border-border/50">
                  <td className="py-2 px-3 text-right font-mono font-bold">{el.element}</td>
                  <td className="py-2 px-3 text-center">{el.count}</td>
                  <td className="py-2 px-3 text-center">{ATOMIC_WEIGHTS[el.element].toFixed(4)}</td>
                  <td className="py-2 px-3 text-left font-bold text-primary">{el.mass.toFixed(4)} g/mol</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-muted dark:bg-muted">
                <td colSpan={3} className="py-2 px-3 text-right font-bold">{t('molar_mass.results.total')}</td>
                <td className="py-2 px-3 text-left font-bold text-primary">{result.totalMass.toFixed(4)} g/mol</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('molar_mass.title')}
      description={t('molar_mass.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
