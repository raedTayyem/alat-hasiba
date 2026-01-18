'use client';

/**
 * Startup Cost Calculator
 *
 * Calculates startup expenses for new businesses
 * Formula: Total = Equipment + Legal + Marketing + Inventory + Operating Reserve
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Scale, Megaphone, Package, Wallet, PieChart } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  totalCost: number;
  equipment: number;
  legal: number;
  marketing: number;
  inventory: number;
  operatingReserve: number;
  percentages: {
    equipment: number;
    legal: number;
    marketing: number;
    inventory: number;
    operatingReserve: number;
  };
}

export default function StartupCostCalculator() {
  const { t } = useTranslation('calc/business');
  const [equipment, setEquipment] = useState<string>('');
  const [legal, setLegal] = useState<string>('');
  const [marketing, setMarketing] = useState<string>('');
  const [inventory, setInventory] = useState<string>('');
  const [operatingReserve, setOperatingReserve] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const equipmentVal = parseFloat(equipment) || 0;
    const legalVal = parseFloat(legal) || 0;
    const marketingVal = parseFloat(marketing) || 0;
    const inventoryVal = parseFloat(inventory) || 0;
    const reserveVal = parseFloat(operatingReserve) || 0;

    const total = equipmentVal + legalVal + marketingVal + inventoryVal + reserveVal;

    if (total <= 0) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (equipmentVal < 0 || legalVal < 0 || marketingVal < 0 || inventoryVal < 0 || reserveVal < 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const equipmentVal = parseFloat(equipment) || 0;
        const legalVal = parseFloat(legal) || 0;
        const marketingVal = parseFloat(marketing) || 0;
        const inventoryVal = parseFloat(inventory) || 0;
        const reserveVal = parseFloat(operatingReserve) || 0;

        // Calculate total
        const totalCost = equipmentVal + legalVal + marketingVal + inventoryVal + reserveVal;

        // Calculate percentages
        const percentages = {
          equipment: (equipmentVal / totalCost) * 100,
          legal: (legalVal / totalCost) * 100,
          marketing: (marketingVal / totalCost) * 100,
          inventory: (inventoryVal / totalCost) * 100,
          operatingReserve: (reserveVal / totalCost) * 100,
        };

        setResult({
          totalCost: Math.round(totalCost * 100) / 100,
          equipment: equipmentVal,
          legal: legalVal,
          marketing: marketingVal,
          inventory: inventoryVal,
          operatingReserve: reserveVal,
          percentages: {
            equipment: Math.round(percentages.equipment * 10) / 10,
            legal: Math.round(percentages.legal * 10) / 10,
            marketing: Math.round(percentages.marketing * 10) / 10,
            inventory: Math.round(percentages.inventory * 10) / 10,
            operatingReserve: Math.round(percentages.operatingReserve * 10) / 10,
          },
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setEquipment('');
      setLegal('');
      setMarketing('');
      setInventory('');
      setOperatingReserve('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("startup_cost.inputs.equipment")}
          tooltip={t("startup_cost.inputs.equipment_tooltip")}
        >
          <NumberInput
            value={equipment}
            onValueChange={(val) => {
              setEquipment(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("startup_cost.inputs.equipment_placeholder")}
            startIcon={<Building2 className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("startup_cost.inputs.legal")}
          tooltip={t("startup_cost.inputs.legal_tooltip")}
        >
          <NumberInput
            value={legal}
            onValueChange={(val) => {
              setLegal(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("startup_cost.inputs.legal_placeholder")}
            startIcon={<Scale className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("startup_cost.inputs.marketing")}
          tooltip={t("startup_cost.inputs.marketing_tooltip")}
        >
          <NumberInput
            value={marketing}
            onValueChange={(val) => {
              setMarketing(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("startup_cost.inputs.marketing_placeholder")}
            startIcon={<Megaphone className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("startup_cost.inputs.inventory")}
          tooltip={t("startup_cost.inputs.inventory_tooltip")}
        >
          <NumberInput
            value={inventory}
            onValueChange={(val) => {
              setInventory(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("startup_cost.inputs.inventory_placeholder")}
            startIcon={<Package className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("startup_cost.inputs.operating_reserve")}
          tooltip={t("startup_cost.inputs.operating_reserve_tooltip")}
        >
          <NumberInput
            value={operatingReserve}
            onValueChange={(val) => {
              setOperatingReserve(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("startup_cost.inputs.operating_reserve_placeholder")}
            startIcon={<Wallet className="h-4 w-4" />}
            min={0}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("startup_cost.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("startup_cost.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("startup_cost.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("startup_cost.info.use_case_1")}</li>
              <li>{t("startup_cost.info.use_case_2")}</li>
              <li>{t("startup_cost.info.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("startup_cost.results.total_cost")}
        </div>
        <div className="text-4xl font-bold mb-2 text-primary">
          ${formatNumber(result.totalCost)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("startup_cost.results.estimated_startup")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("startup_cost.results.breakdown")}
        </h3>

        <div className="space-y-3">
          {result.equipment > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("startup_cost.results.equipment")}</div>
                </div>
                <div className="text-sm text-foreground-70">{result.percentages.equipment}%</div>
              </div>
              <div className="text-xl font-bold text-primary">${formatNumber(result.equipment)}</div>
              <div className="w-full bg-border rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${result.percentages.equipment}%` }}
                ></div>
              </div>
            </div>
          )}

          {result.legal > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Scale className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("startup_cost.results.legal")}</div>
                </div>
                <div className="text-sm text-foreground-70">{result.percentages.legal}%</div>
              </div>
              <div className="text-xl font-bold text-primary">${formatNumber(result.legal)}</div>
              <div className="w-full bg-border rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${result.percentages.legal}%` }}
                ></div>
              </div>
            </div>
          )}

          {result.marketing > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Megaphone className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("startup_cost.results.marketing")}</div>
                </div>
                <div className="text-sm text-foreground-70">{result.percentages.marketing}%</div>
              </div>
              <div className="text-xl font-bold text-primary">${formatNumber(result.marketing)}</div>
              <div className="w-full bg-border rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${result.percentages.marketing}%` }}
                ></div>
              </div>
            </div>
          )}

          {result.inventory > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("startup_cost.results.inventory")}</div>
                </div>
                <div className="text-sm text-foreground-70">{result.percentages.inventory}%</div>
              </div>
              <div className="text-xl font-bold text-primary">${formatNumber(result.inventory)}</div>
              <div className="w-full bg-border rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${result.percentages.inventory}%` }}
                ></div>
              </div>
            </div>
          )}

          {result.operatingReserve > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Wallet className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("startup_cost.results.operating_reserve")}</div>
                </div>
                <div className="text-sm text-foreground-70">{result.percentages.operatingReserve}%</div>
              </div>
              <div className="text-xl font-bold text-primary">${formatNumber(result.operatingReserve)}</div>
              <div className="w-full bg-border rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${result.percentages.operatingReserve}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <PieChart className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("startup_cost.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("startup_cost.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("startup_cost.title")}
      description={t("startup_cost.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
