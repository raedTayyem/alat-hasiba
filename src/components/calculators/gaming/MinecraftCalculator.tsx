'use client';

/**
 * Minecraft Calculator
 * Resource calculations, ore distribution, and crafting recipes
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Layers, Hammer, Clock, Database, ArrowRight } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  totalBlocks: number;
  stacks: number;
  remainder: number;
  buildTime: number;
  oreChance: number;
  resourceType: string;
}

const CRAFTING_RECIPES = {
  blocks: { perCraft: 1, materials: 1 },
  slabs: { perCraft: 6, materials: 3 },
  stairs: { perCraft: 4, materials: 6 },
  walls: { perCraft: 6, materials: 6 },
  fence: { perCraft: 3, materials: 4 },
};

const ORE_DISTRIBUTION = {
  coal: { yMin: 0, yMax: 320, peakY: 96, chance: 1.5 },
  iron: { yMin: -64, yMax: 320, peakY: 16, chance: 0.9 },
  gold: { yMin: -64, yMax: 32, peakY: -16, chance: 0.3 },
  diamond: { yMin: -64, yMax: 16, peakY: -59, chance: 0.08 },
  redstone: { yMin: -64, yMax: 16, peakY: -59, chance: 0.6 },
  lapis: { yMin: -64, yMax: 64, peakY: 0, chance: 0.4 },
  emerald: { yMin: -16, yMax: 320, peakY: 232, chance: 0.05 },
};

export default function MinecraftCalculator() {
  const { t } = useTranslation('calc/gaming');
  const [calculationType, setCalculationType] = useState<string>('building');
  const [blocksNeeded, setBlocksNeeded] = useState<string>('');
  const [recipeType, setRecipeType] = useState<string>('blocks');
  const [oreType, setOreType] = useState<string>('diamond');
  const [yLevel, setYLevel] = useState<string>('-59');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    if (calculationType === 'building' || calculationType === 'crafting') {
      const blocks = parseFloat(blocksNeeded);
      if (isNaN(blocks)) {
        setError(t("minecraft_calculator.error_invalid"));
        return false;
      }
      if (blocks <= 0) {
        setError(t("minecraft_calculator.error_positive"));
        return false;
      }
    }

    if (calculationType === 'ore') {
      const y = parseFloat(yLevel);
      if (isNaN(y)) {
        setError(t("minecraft_calculator.error_invalid"));
        return false;
      }
      if (y < -64 || y > 320) {
        setError(t("minecraft_calculator.error_y_range"));
        return false;
      }
    }

    return true;
  };

  const calculateOreChance = (ore: string, y: number): number => {
    const oreData = ORE_DISTRIBUTION[ore as keyof typeof ORE_DISTRIBUTION];
    if (y < oreData.yMin || y > oreData.yMax) return 0;

    const distanceFromPeak = Math.abs(y - oreData.peakY);
    const maxDistance = Math.max(oreData.peakY - oreData.yMin, oreData.yMax - oreData.peakY);
    const efficiency = 1 - (distanceFromPeak / maxDistance) * 0.7;

    return oreData.chance * efficiency;
  };

  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        let resultData: CalculatorResult;

        if (calculationType === 'building') {
          const blocks = parseFloat(blocksNeeded);
          const stacks = Math.floor(blocks / 64);
          const remainder = blocks % 64;
          const buildTime = Math.ceil(blocks * 1.5); // seconds

          resultData = {
            totalBlocks: blocks,
            stacks,
            remainder,
            buildTime,
            oreChance: 0,
            resourceType: 'building',
          };
        } else if (calculationType === 'crafting') {
          const blocks = parseFloat(blocksNeeded);
          const recipe = CRAFTING_RECIPES[recipeType as keyof typeof CRAFTING_RECIPES];
          const craftsNeeded = Math.ceil(blocks / recipe.perCraft);
          const materialsNeeded = craftsNeeded * recipe.materials;
          const stacks = Math.floor(materialsNeeded / 64);
          const remainder = materialsNeeded % 64;

          resultData = {
            totalBlocks: materialsNeeded,
            stacks,
            remainder,
            buildTime: craftsNeeded * 2,
            oreChance: 0,
            resourceType: recipeType,
          };
        } else {
          // ore distribution
          const y = parseFloat(yLevel);
          const oreChance = calculateOreChance(oreType, y);
          const blocksPerOre = oreChance > 0 ? Math.round(100 / oreChance) : 0;

          resultData = {
            totalBlocks: blocksPerOre,
            stacks: 0,
            remainder: 0,
            buildTime: 0,
            oreChance,
            resourceType: oreType,
          };
        }

        setResult(resultData);
        setShowResult(true);
      } catch (err) {
        setError(t("minecraft_calculator.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setCalculationType('building');
      setBlocksNeeded('');
      setRecipeType('blocks');
      setOreType('diamond');
      setYLevel('-59');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const calculationTypeOptions = [
    { value: 'building', label: t("minecraft_calculator.type_building") },
    { value: 'crafting', label: t("minecraft_calculator.type_crafting") },
    { value: 'ore', label: t("minecraft_calculator.type_ore") },
  ];

  const recipeTypeOptions = [
    { value: 'blocks', label: t("minecraft_calculator.recipe_blocks") },
    { value: 'slabs', label: t("minecraft_calculator.recipe_slabs") },
    { value: 'stairs', label: t("minecraft_calculator.recipe_stairs") },
    { value: 'walls', label: t("minecraft_calculator.recipe_walls") },
    { value: 'fence', label: t("minecraft_calculator.recipe_fence") },
  ];

  const oreTypeOptions = [
    { value: 'coal', label: t("minecraft_calculator.ore_coal") },
    { value: 'iron', label: t("minecraft_calculator.ore_iron") },
    { value: 'gold', label: t("minecraft_calculator.ore_gold") },
    { value: 'diamond', label: t("minecraft_calculator.ore_diamond") },
    { value: 'redstone', label: t("minecraft_calculator.ore_redstone") },
    { value: 'lapis', label: t("minecraft_calculator.ore_lapis") },
    { value: 'emerald', label: t("minecraft_calculator.ore_emerald") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("minecraft_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("minecraft_calculator.calculation_type_label")}
          tooltip={t("minecraft_calculator.calculation_type_tooltip")}
        >
          <Combobox
            options={calculationTypeOptions}
            value={calculationType}
            onChange={(val) => setCalculationType(val)}
            placeholder={t("minecraft_calculator.calculation_type_label")}
          />
        </FormField>

        {(calculationType === 'building' || calculationType === 'crafting') && (
          <FormField
            label={t("minecraft_calculator.blocks_label")}
            tooltip={t("minecraft_calculator.blocks_tooltip")}
          >
            <NumberInput
              value={blocksNeeded}
              onValueChange={(val) => {
                setBlocksNeeded(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t("minecraft_calculator.blocks_placeholder")}
              startIcon={<Box className="h-4 w-4" />}
              min={1}
            />
          </FormField>
        )}

        {calculationType === 'crafting' && (
          <FormField
            label={t("minecraft_calculator.recipe_label")}
            tooltip={t("minecraft_calculator.recipe_tooltip")}
          >
            <Combobox
              options={recipeTypeOptions}
              value={recipeType}
              onChange={(val) => setRecipeType(val)}
              placeholder={t("minecraft_calculator.recipe_label")}
            />
          </FormField>
        )}

        {calculationType === 'ore' && (
          <>
            <FormField
              label={t("minecraft_calculator.ore_type_label")}
              tooltip={t("minecraft_calculator.ore_type_tooltip")}
            >
              <Combobox
                options={oreTypeOptions}
                value={oreType}
                onChange={(val) => setOreType(val)}
                placeholder={t("minecraft_calculator.ore_type_label")}
              />
            </FormField>

            <FormField
              label={t("minecraft_calculator.y_level_label")}
              tooltip={t("minecraft_calculator.y_level_tooltip")}
            >
              <NumberInput
                value={yLevel}
                onValueChange={(val) => {
                  setYLevel(val.toString());
                  if (error) setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="-59"
                startIcon={<Layers className="h-4 w-4" />}
                min={-64}
                max={320}
              />
            </FormField>
          </>
        )}
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("minecraft_calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("minecraft_calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("minecraft_calculator.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("minecraft_calculator.use_case_1")}</li>
              <li>{t("minecraft_calculator.use_case_2")}</li>
              <li>{t("minecraft_calculator.use_case_3")}</li>
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
          {t("minecraft_calculator.result_label")}
        </div>
        {calculationType === 'ore' ? (
          <>
            <div className="text-4xl font-bold text-primary mb-2">
              {result.oreChance.toFixed(2)}%
            </div>
            <div className="text-lg text-foreground-70">
              {t("minecraft_calculator.ore_chance")}
            </div>
          </>
        ) : (
          <>
            <div className="text-4xl font-bold text-primary mb-2">
              {(result.totalBlocks).toFixed(2)}
            </div>
            <div className="text-lg text-foreground-70">
              {t("minecraft_calculator.blocks_unit")}
            </div>
          </>
        )}
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("minecraft_calculator.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {calculationType !== 'ore' && (
            <>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center mb-2">
                  <Database className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("minecraft_calculator.stacks_label")}</div>
                </div>
                <div className="text-2xl font-bold text-primary">{(result.stacks).toFixed(2)}</div>
                <div className="text-sm text-foreground-70">{t("minecraft_calculator.stacks_unit")}</div>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center mb-2">
                  <ArrowRight className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("minecraft_calculator.remainder_label")}</div>
                </div>
                <div className="text-2xl font-bold text-primary">{(result.remainder).toFixed(2)}</div>
                <div className="text-sm text-foreground-70">{t("minecraft_calculator.blocks_unit")}</div>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("minecraft_calculator.time_label")}</div>
                </div>
                <div className="text-2xl font-bold text-primary">{(result.buildTime).toFixed(2)}</div>
                <div className="text-sm text-foreground-70">{t("minecraft_calculator.time_unit")}</div>
              </div>
            </>
          )}

          {calculationType === 'ore' && (
            <div className="bg-card p-4 rounded-lg border border-border col-span-full">
              <div className="flex items-center mb-2">
                <Hammer className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("minecraft_calculator.blocks_per_ore_label")}</div>
              </div>
              <div className="text-2xl font-bold text-primary">
                {result.totalBlocks > 0 ? (result.totalBlocks).toFixed(2) : t("minecraft_calculator.no_ore")}
              </div>
              <div className="text-sm text-foreground-70">{t("minecraft_calculator.blocks_per_ore_unit")}</div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Hammer className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("minecraft_calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("minecraft_calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("minecraft_calculator.title")}
      description={t("minecraft_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
