'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Coins, Users, FileText, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '@/utils/dateInputRTL';
import { initialHeirs, Heir } from './types';
import { applyInheritanceRules, calculateFinalShares, formatInheritanceResults } from './calculations';
import { useToast } from '@/hooks/useToast';

export default function InheritanceCalculator() {
  const { t } = useTranslation('calc/finance');
  const toast = useToast();

  const [heirs, setHeirs] = useState<Heir[]>(initialHeirs);
  const [estateValue, setEstateValue] = useState<number>(1000000);
  const [debtValue, setDebtValue] = useState<number>(0);
  const [willValue, setWillValue] = useState<number>(0);
  const [calculatedHeirs, setCalculatedHeirs] = useState<Heir[]>(initialHeirs);
  const [isCalculated, setIsCalculated] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Handle checkbox changes
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setHeirs(prevHeirs =>
      prevHeirs.map(heir =>
        heir.id === id ? { ...heir, selected: checked } : heir
      )
    );
    setIsCalculated(false);
  };

  // Handlers for values
  const handleEstateValueChange = (value: string | number) => {
    setEstateValue(typeof value === 'string' ? (parseInt(value) || 0) : value);
    setIsCalculated(false);
  };

  const handleDebtValueChange = (value: string | number) => {
    setDebtValue(typeof value === 'string' ? (parseInt(value) || 0) : value);
    setIsCalculated(false);
  };

  const handleWillValueChange = (value: string | number) => {
    setWillValue(typeof value === 'string' ? (parseInt(value) || 0) : value);
    setIsCalculated(false);
  };

  // Update heir count
  const updateHeirCount = (id: string, count: number) => {
    setHeirs(prevHeirs =>
      prevHeirs.map(heir =>
        heir.id === id ? { ...heir, count: Math.max(1, count) } : heir
      )
    );
  };

  // Reset calculator
  const resetCalculator = () => {
    setHeirs(initialHeirs);
    setEstateValue(1000000);
    setDebtValue(0);
    setWillValue(0);
    setCalculatedHeirs(initialHeirs);
    setIsCalculated(false);
    setError('');
  };

  // Copy results to clipboard
  const copyToClipboard = () => {
    const results = formatInheritanceResults(calculatedHeirs, getNetEstate(), t);
    navigator.clipboard.writeText(results);
    toast.success(t("common:common.copied"));
  };

  // Calculate net estate value
  const getNetEstate = (): number => {
    // Calculate net estate after deducting debts and will (up to 1/3)
    const remainingEstate = Math.max(0, estateValue - debtValue);

    // Will is limited to 1/3 of remaining estate (Islamic law)
    const maxWill = remainingEstate / 3;
    const actualWill = Math.min(willValue, maxWill);

    return Math.max(0, remainingEstate - actualWill);
  };

  // Function to calculate shares with error handling
  const calculateShares = () => {
    if (!heirs.some(h => h.selected)) {
      setError(t("common:errors.no_heirs_selected"));
      return;
    }

    if (estateValue <= 0) {
      setError(t("common:errors.positive_number"));
      return;
    }

    setError('');
    // Apply Islamic inheritance rules
    const updatedHeirs = applyInheritanceRules([...heirs]);

    // Calculate final shares with monetary values
    const finalHeirs = calculateFinalShares(updatedHeirs, getNetEstate());

    setCalculatedHeirs(finalHeirs);
    setIsCalculated(true);
  };

  // Input section with improved layout and SEO
  const inputSection = (
    <>
      <Tabs defaultValue="heirs" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="heirs">{t("inheritance-calculator.tabs.heirs")}</TabsTrigger>
          <TabsTrigger value="estate">{t("inheritance-calculator.tabs.assets")}</TabsTrigger>
          <TabsTrigger value="debts">{t("inheritance-calculator.tabs.results")}</TabsTrigger>
        </TabsList>
        <TabsContent value="heirs" className="animate-fadeIn">
          <div className="grid gap-6 mb-6">
            <div className="bg-card-bg rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                {t("inheritance-calculator.heirs_selection_title")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {heirs.map((heir) => (
                  <label key={heir.id} className="flex items-center cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors">
                    <input
                      type="checkbox"
                      id={heir.id}
                      checked={heir.selected}
                      onChange={(e) => handleCheckboxChange(heir.id, e.target.checked)}
                      className="ml-2 h-4 w-4 accent-primary rounded border-input"
                    />
                    <span>{t(heir.nameKey)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-card-bg rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                {t("inheritance-calculator.table.count")}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {heirs
                  .filter((heir) => heir.selected && heir.count > 1)
                  .map((heir) => (
                    <div key={heir.id} className="flex items-center">
                      <span className="ml-2 w-24">{t(heir.nameKey)}:</span>
                      <div className="flex-1">
                        <NumberInput
                          value={heir.count.toString()}
                          onValueChange={(val) => updateHeirCount(heir.id, parseInt(val.toString(), 10) || 1)}
                          min={1}
                          max={20}
                          step={1}
                          placeholder={t("placeholders.heirCount")}
                        />
                      </div>
                    </div>
                  ))}
              </div>

              {!heirs.some(h => h.selected && h.count > 1) && (
                <p className="text-muted-foreground text-sm mt-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  {t("inheritance-calculator.help.step1")}
                </p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="estate" className="animate-fadeIn">
          <div className="bg-card-bg rounded-lg p-4 border border-border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              {t("inheritance-calculator.inputs.estate_value")}
            </h3>
            <FormField label={t("inheritance-calculator.inputs.estate_value")}>
              <NumberInput
                value={estateValue.toString()}
                onValueChange={(val) => handleEstateValueChange(val)}
                min={0}
                placeholder={t("inheritance-calculator.placeholders.estate_value")}
                startIcon={<Coins className="h-4 w-4" />}
              />
            </FormField>
          </div>
        </TabsContent>
        
        <TabsContent value="debts" className="animate-fadeIn">
          <div className="grid gap-4">
            <div className="bg-card-bg rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-3">{t("inheritance-calculator.inputs.debts")}</h3>
              <FormField label={t("inheritance-calculator.inputs.debts")}>
                <NumberInput
                  value={debtValue.toString()}
                  onValueChange={(val) => handleDebtValueChange(val)}
                  min={0}
                  placeholder={t("inheritance-calculator.placeholders.debts")}
                  startIcon={<Coins className="h-4 w-4" />}
                />
              </FormField>
            </div>

            <div className="bg-card-bg rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-3">{t("inheritance-calculator.inputs.wasiyyah")}</h3>
              <FormField label={t("inheritance-calculator.inputs.wasiyyah")}>
                <NumberInput
                  value={willValue.toString()}
                  onValueChange={(val) => handleWillValueChange(val)}
                  min={0}
                  placeholder={t("inheritance-calculator.placeholders.wasiyyah")}
                  startIcon={<FileText className="h-4 w-4" />}
                />
              </FormField>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Info className="h-3 w-3" />
                {t("inheritance-calculator.help.step2")}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CalculatorButtons
        onCalculate={calculateShares}
        onReset={resetCalculator}
      />

      <ErrorDisplay error={error} />
    </>
  );

  // Results section
  const resultsSection = (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-bold mb-4 text-center">{t("inheritance-calculator.results_title")}</h2>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="bg-card-bg rounded-lg p-4 border border-border">
          <h3 className="font-semibold mb-2">{t("inheritance-calculator.results.distribution_title")}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span>{t("inheritance-calculator.results.total_estate")}</span>
            <span className="font-medium text-left ltr:text-right">{estateValue.toLocaleString()}</span>
            <span>{t("inheritance-calculator.results.total_debts")}</span>
            <span className="font-medium text-left ltr:text-right">{debtValue.toLocaleString()}</span>
            <span>{t("inheritance-calculator.results.wasiyyah_amount")}</span>
            <span className="font-medium text-left ltr:text-right">{willValue.toLocaleString()}</span>
            <span className="col-span-2 border-t pt-2 mt-2"></span>
            <span className="font-bold">{t("inheritance-calculator.results.net_distributable")}</span>
            <span className="font-bold text-primary text-left ltr:text-right">{getNetEstate().toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-card-bg rounded-lg p-4 border border-border mb-6">
        <h3 className="font-semibold mb-3">{t("inheritance-calculator.results.distribution_title")}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-3 text-right">{t("inheritance-calculator.table.heir")}</th>
                <th className="p-3 text-right">{t("inheritance-calculator.table.share")}</th>
                <th className="p-3 text-right">{t("inheritance-calculator.table.count")}</th>
                <th className="p-3 text-right">{t("inheritance-calculator.table.amount")}</th>
              </tr>
            </thead>
            <tbody>
              {calculatedHeirs
                .filter(heir => heir.selected && heir.shareTextKey)
                .map((heir) => (
                  <tr key={heir.id} className="border-b border-border hover:bg-muted/20">
                    <td className="p-3 font-medium">
                      {t(heir.nameKey)}
                      {heir.count > 1 ? ` (${heir.count})` : ''}
                    </td>
                    <td className="p-3 font-mono" dir="ltr">{t(heir.shareTextKey)}</td>
                    <td className="p-3 text-xs text-muted-foreground">{heir.count}</td>
                    <td className="p-3 font-bold text-primary">{heir.share ? (heir.share * getNetEstate()).toLocaleString() : '0'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={copyToClipboard}
          className="secondary-button px-6 flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          {t("common:common.copy")}
        </button>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("inheritance-calculator.title")}
      description={t("inheritance-calculator.description")}
      inputSection={inputSection}
      resultSection={isCalculated ? resultsSection : <div className="text-center text-muted-foreground p-8">{t("inheritance-calculator.empty_state.desc")}</div>}
      className="rtl"
    />
  );
}
