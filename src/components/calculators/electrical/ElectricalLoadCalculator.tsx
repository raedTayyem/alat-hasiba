'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Plus, Trash2, Info, Plug, Activity } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function ElectricalLoadCalculator() {
  const { t } = useTranslation('calc/electrical');
  const [loads, setLoads] = useState<{ name: string; power: string; quantity: string }[]>([
    { name: '', power: '', quantity: '' },
    { name: '', power: '', quantity: '' }
  ]);
  const [voltage, setVoltage] = useState<string>('');
  const [powerFactor, setPowerFactor] = useState<string>('');
  const [result, setResult] = useState<{
    totalLoad: number;
    totalCurrent: number;
    requiredPanelSize: number;
    requiredCableSize: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const addLoad = () => {
    setLoads([...loads, { name: '', power: '', quantity: '' }]);
  };

  const removeLoad = (index: number) => {
    if (loads.length > 1) {
      setLoads(loads.filter((_, i) => i !== index));
    }
  };

  const updateLoad = (index: number, field: string, value: string) => {
    const newLoads = [...loads];
    // @ts-ignore
    newLoads[index] = { ...newLoads[index], [field]: value };
    setLoads(newLoads);
  };

  const calculate = () => {
    setError('');
    const v = parseFloat(voltage);
    const pf = parseFloat(powerFactor);

    if (!v || !pf) {
        setError(t('common.error.invalid_input'));
        return;
    }

    let totalLoad = 0;
    for (const load of loads) {
      const power = parseFloat(load.power) || 0;
      const qty = parseFloat(load.quantity) || 0;
      totalLoad += power * qty;
    }

    // Add 25% safety factor
    const totalLoadWithSafety = totalLoad * 1.25;

    // Calculate current (three-phase assumed)
    const totalCurrent = totalLoadWithSafety / (Math.sqrt(3) * v * pf);

    // Recommended panel size (next standard size up)
    const standardPanelSizes = [100, 150, 200, 300, 400, 600, 800, 1000];
    const requiredPanelSize = standardPanelSizes.find(size => size >= totalCurrent) || standardPanelSizes[standardPanelSizes.length - 1];

    // Recommended cable size based on current
    let requiredCableSize = 2.5;
    if (totalCurrent > 16) requiredCableSize = 4;
    if (totalCurrent > 25) requiredCableSize = 6;
    if (totalCurrent > 32) requiredCableSize = 10;
    if (totalCurrent > 40) requiredCableSize = 16;
    if (totalCurrent > 50) requiredCableSize = 25;
    if (totalCurrent > 63) requiredCableSize = 35;
    if (totalCurrent > 80) requiredCableSize = 50;

    setResult({
      totalLoad: parseFloat(totalLoadWithSafety.toFixed(2)),
      totalCurrent: parseFloat(totalCurrent.toFixed(2)),
      requiredPanelSize,
      requiredCableSize
    });
  };

  const reset = () => {
    setLoads([
      { name: '', power: '', quantity: '' },
      { name: '', power: '', quantity: '' }
    ]);
    setVoltage('220');
    setPowerFactor('0.9');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label={t("electrical_load.voltage")} tooltip={t("electrical_load.voltage_tooltip")}>
            <NumberInput
              value={voltage}
              onValueChange={(val) => setVoltage(val.toString())}
              placeholder={t("placeholders.voltage")}
              min={0}
              step={1}
              unit={t("ohms_law.unit_voltage")}
              startIcon={<Zap className="h-4 w-4" />}
            />
          </FormField>

          <FormField label={t("electrical_load.power_factor")} tooltip={t("electrical_load.power_factor_tooltip")}>
            <NumberInput
              value={powerFactor}
              onValueChange={(val) => setPowerFactor(val.toString())}
              placeholder={t("placeholders.powerFactor")}
              min={0}
              max={1}
              step={0.01}
              startIcon={<Activity className="h-4 w-4" />}
            />
          </FormField>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-sm text-foreground-70">{t("electrical_load.loads_title")}</h3>
          {loads.map((load, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end bg-card p-3 rounded-lg border border-border">
              <div className="col-span-5">
                <label className="text-xs text-foreground-50 mb-1 block">{t("electrical_load.load_name")}</label>
                <input
                  type="text"
                  value={load.name}
                  onChange={(e) => updateLoad(index, 'name', e.target.value)}
                  placeholder={t("electrical_load.default_load_1")}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                />
              </div>
              <div className="col-span-3">
                <label className="text-xs text-foreground-50 mb-1 block">{t("electrical_load.load_power")}</label>
                <NumberInput
                  value={load.power}
                  onValueChange={(val) => updateLoad(index, 'power', val.toString())}
                  placeholder={t("placeholders.power")}
                  min={0}
                  className="h-10"
                />
              </div>
              <div className="col-span-3">
                <label className="text-xs text-foreground-50 mb-1 block">{t("electrical_load.load_quantity")}</label>
                <NumberInput
                  value={load.quantity}
                  onValueChange={(val) => updateLoad(index, 'quantity', val.toString())}
                  placeholder={t("placeholders.quantity")}
                  min={1}
                  step={1}
                  className="h-10"
                />
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => removeLoad(index)}
                  className="w-full h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  disabled={loads.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addLoad}
            className="w-full py-2 border-2 border-dashed border-primary/20 text-primary hover:bg-primary/5 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t("electrical_load.add_load")}
          </button>
        </div>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("electrical_load.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("electrical_load.total_power")}</div>
          <div className="text-3xl font-bold text-primary">{result.totalLoad} {t("ohms_law.unit_power")}</div>
          <div className="text-xs text-foreground-70 mt-1">{(result.totalLoad / 1000).toFixed(2)} {t("ohms_law.unit_kilo_watt")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("electrical_load.total_current")}</div>
            <div className="text-2xl font-bold text-blue-600">{result.totalCurrent} {t("ohms_law.unit_current")}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("electrical_load.panel_size")}</div>
            <div className="text-2xl font-bold text-green-600">{result.requiredPanelSize} {t("ohms_law.unit_current")}</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("electrical_load.cable_size")}</div>
            <div className="text-2xl font-bold text-purple-600">{result.requiredCableSize} {t("voltage_drop.options.wire_mm2", { size: "" }).replace(/\s*$/, "")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            {t("electrical_load.notes_title")}
          </h4>
          <p className="text-sm">{t("electrical_load.notes")}</p>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Plug className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("electrical_load.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("electrical_load.title")}
      description={t("electrical_load.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("electrical_load.footer_note")}
     className="rtl" />
  );
}
