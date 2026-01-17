'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RotateCcw,
  Copy,
  FileText,
  HelpCircle,
  Coins,
  Users,
  Briefcase,
  DollarSign,
  Info
} from "lucide-react";
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// Define the heir types and their relationships
type Heir = {
  id: string;
  name: string;
  category: string;
  selected: boolean;
  count: number;
  share: number | null;
  shareText: string;
};

export default function InheritanceCalculator() {
  const { t } = useTranslation(['calc/finance', 'common']);

  // Define the heirs structure by category
  const initialHeirs: Heir[] = [
    // Spouse category
    { id: 'husband', name: t("inheritance-calculator.heirs.husband"), category: 'spouse', selected: false, count: 1, share: null, shareText: '' },
    { id: 'wife', name: t("inheritance-calculator.heirs.wife"), category: 'spouse', selected: false, count: 1, share: null, shareText: '' },

    // Children category
    { id: 'son', name: t("inheritance-calculator.heirs.son"), category: 'children', selected: false, count: 0, share: null, shareText: '' },
    { id: 'daughter', name: t("inheritance-calculator.heirs.daughter"), category: 'children', selected: false, count: 0, share: null, shareText: '' },
    { id: 'grandson', name: t("inheritance-calculator.heirs.grandson"), category: 'children', selected: false, count: 0, share: null, shareText: '' },
    { id: 'granddaughter', name: t("inheritance-calculator.heirs.granddaughter"), category: 'children', selected: false, count: 0, share: null, shareText: '' },

    // Parents category
    { id: 'father', name: t("inheritance-calculator.heirs.father"), category: 'parents', selected: false, count: 1, share: null, shareText: '' },
    { id: 'mother', name: t("inheritance-calculator.heirs.mother"), category: 'parents', selected: false, count: 1, share: null, shareText: '' },
    { id: 'grandfather', name: t("inheritance-calculator.heirs.grandfather"), category: 'parents', selected: false, count: 1, share: null, shareText: '' },
    { id: 'grandmother_paternal', name: t("inheritance-calculator.heirs.grandmother_paternal"), category: 'parents', selected: false, count: 1, share: null, shareText: '' },
    { id: 'grandmother_maternal', name: t("inheritance-calculator.heirs.grandmother_maternal"), category: 'parents', selected: false, count: 1, share: null, shareText: '' },

    // Siblings category
    { id: 'brother', name: t("inheritance-calculator.heirs.brother"), category: 'siblings', selected: false, count: 0, share: null, shareText: '' },
    { id: 'sister', name: t("inheritance-calculator.heirs.sister"), category: 'siblings', selected: false, count: 0, share: null, shareText: '' },
    { id: 'brother_paternal', name: t("inheritance-calculator.heirs.brother_paternal"), category: 'siblings', selected: false, count: 0, share: null, shareText: '' },
    { id: 'sister_paternal', name: t("inheritance-calculator.heirs.sister_paternal"), category: 'siblings', selected: false, count: 0, share: null, shareText: '' },
    { id: 'brother_maternal', name: t("inheritance-calculator.heirs.brother_maternal"), category: 'siblings', selected: false, count: 0, share: null, shareText: '' },
    { id: 'sister_maternal', name: t("inheritance-calculator.heirs.sister_maternal"), category: 'siblings', selected: false, count: 0, share: null, shareText: '' },
  ];

  const [estateValue, setEstateValue] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [heirs, setHeirs] = useState<Heir[]>(initialHeirs);
  const [results, setResults] = useState<Heir[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [debts, setDebts] = useState<string>('0');
  const [wasiyyah, setWasiyyah] = useState<string>('0');
  
  // Currency options
  const currencies = [
    { value: 'USD', label: t("inheritance-calculator.currencies.USD") },
    { value: 'EUR', label: t("inheritance-calculator.currencies.EUR") },
    { value: 'SAR', label: t("inheritance-calculator.currencies.SAR") },
    { value: 'AED', label: t("inheritance-calculator.currencies.AED") },
    { value: 'EGP', label: t("inheritance-calculator.currencies.EGP") },
    { value: 'KWD', label: t("inheritance-calculator.currencies.KWD") },
    { value: 'QAR', label: t("inheritance-calculator.currencies.QAR") },
    { value: 'BHD', label: t("inheritance-calculator.currencies.BHD") },
    { value: 'OMR', label: t("inheritance-calculator.currencies.OMR") },
    { value: 'JOD', label: t("inheritance-calculator.currencies.JOD") },
    { value: 'LBP', label: t("inheritance-calculator.currencies.LBP") },
    { value: 'IQD', label: t("inheritance-calculator.currencies.IQD") },
  ];

  // Currency symbols
  const currencySymbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'SAR': t("inheritance-calculator.currency_symbols.SAR"),
    'AED': t("inheritance-calculator.currency_symbols.AED"),
    'EGP': t("inheritance-calculator.currency_symbols.EGP"),
    'KWD': t("inheritance-calculator.currency_symbols.KWD"),
    'QAR': t("inheritance-calculator.currency_symbols.QAR"),
    'BHD': t("inheritance-calculator.currency_symbols.BHD"),
    'OMR': t("inheritance-calculator.currency_symbols.OMR"),
    'JOD': t("inheritance-calculator.currency_symbols.JOD"),
    'LBP': t("inheritance-calculator.currency_symbols.LBP"),
    'IQD': t("inheritance-calculator.currency_symbols.IQD"),
  };

  // Toggle heir selection
  const toggleHeirSelection = (id: string) => {
    setHeirs(heirs.map(heir => 
      heir.id === id ? { ...heir, selected: !heir.selected } : heir
    ));
    setErrorMessage(null);
  };

  // Update heir count
  const updateHeirCount = (id: string, count: string) => {
    const numericCount = parseInt(count || '0', 10);
    const validCount = isNaN(numericCount) || numericCount < 0 ? 0 : numericCount;
    
    setHeirs(heirs.map(heir => 
      heir.id === id ? { ...heir, count: validCount, selected: validCount > 0 } : heir
    ));
    setErrorMessage(null);
  };

  // Reset the calculator
  const resetCalculator = () => {
    setEstateValue('');
    setDebts('0');
    setWasiyyah('0');
    setHeirs(initialHeirs);
    setResults([]);
    setErrorMessage(null);
  };

  // Copy shares to clipboard
  const copyToClipboard = () => {
    if (results.length === 0) return;

    let sharesText = `${t("inheritance-calculator.results.distribution_title")} (${estateValue} ${currencySymbols[currency] || currency}):\n`;
    sharesText += `${t("inheritance-calculator.inputs.debts")}: ${debts} ${currencySymbols[currency] || currency}\n`;
    sharesText += `${t("inheritance-calculator.inputs.wasiyyah")}: ${wasiyyah} ${currencySymbols[currency] || currency}\n`;
    sharesText += `${t("inheritance-calculator.results.net_estate")}: ${getNetEstate()} ${currencySymbols[currency] || currency}\n\n`;
    
    results.forEach(heir => {
      if (heir.share && heir.share > 0) {
        sharesText += `${heir.name}: ${heir.shareText} (${(heir.share * getNetEstate()).toFixed(2)} ${currencySymbols[currency] || currency})\n`;
      }
    });

    navigator.clipboard.writeText(sharesText)
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Calculate net estate after debts and wasiyyah
  const getNetEstate = (): number => {
    const estate = parseFloat(estateValue || '0');
    const debtsValue = parseFloat(debts || '0');
    const wasiyyahValue = parseFloat(wasiyyah || '0');
    
    // Ensure wasiyyah doesn't exceed 1/3 of estate after debts
    const maxWasiyyah = (estate - debtsValue) / 3;
    const effectiveWasiyyah = Math.min(wasiyyahValue, maxWasiyyah);
    
    return Math.max(0, estate - debtsValue - effectiveWasiyyah);
  };

  return (
    <CalculatorLayout
      title={t("inheritance-calculator.title")}
      description={t("inheritance-calculator.description")}
      className="rtl">
      <div className="space-y-6">
      <Tabs defaultValue="heirs-selection" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="heirs-selection">{t("inheritance-calculator.tabs.heirs")}</TabsTrigger>
          <TabsTrigger value="assets-debts">{t("inheritance-calculator.tabs.assets")}</TabsTrigger>
          <TabsTrigger value="calculate-shares">{t("inheritance-calculator.tabs.results")}</TabsTrigger>
        </TabsList>
        <TabsContent value="heirs-selection" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {t("inheritance-calculator.heirs_selection_title")}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  <HelpCircle className="w-4 h-4 mr-1" />
                  <span>{showHelp ? t("common.hide_help") : t("common.show_help")}</span>
                </Button>
              </div>

              {showHelp && (
                <div className="bg-muted/50 p-4 rounded-md mb-4 text-sm">
                  <p className="mb-2">{t("inheritance-calculator.help.step1")}</p>
                  <p className="mb-2">{t("inheritance-calculator.help.step2")}</p>
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-medium mb-2 text-primary/90">{t("inheritance-calculator.categories.spouse")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {heirs.filter(heir => heir.category === 'spouse').map(heir => (
                    <div key={heir.id} className="flex items-center space-x-4 space-x-reverse bg-muted/20 p-3 rounded-md">
                      <input
                        type="checkbox"
                        id={`heir-${heir.id}`}
                        checked={heir.selected}
                        onChange={() => toggleHeirSelection(heir.id)}
                        className="rounded text-primary focus:ring-primary w-5 h-5"
                      />
                      <label htmlFor={`heir-${heir.id}`} className="flex-1 cursor-pointer">
                        {heir.name}
                      </label>
                      {heir.id === 'wife' && heir.selected && (
                        <div className="w-24">
                          <NumberInput
                            value={heir.count}
                            onValueChange={(val) => updateHeirCount(heir.id, val.toString())}
                            min={1}
                            max={4}
                            className="h-9"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Children Category */}
              <div className="mb-6">
                <h4 className="font-medium mb-2 text-primary/90">{t("inheritance-calculator.categories.children")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {heirs.filter(heir => heir.category === 'children').map(heir => (
                    <div key={heir.id} className="flex items-center space-x-4 space-x-reverse bg-muted/20 p-3 rounded-md">
                      <input
                        type="checkbox"
                        id={`heir-${heir.id}`}
                        checked={heir.selected}
                        onChange={() => toggleHeirSelection(heir.id)}
                        className="rounded text-primary focus:ring-primary w-5 h-5"
                      />
                      <label htmlFor={`heir-${heir.id}`} className="flex-1 cursor-pointer">
                        {heir.name}
                      </label>
                      {heir.selected && (
                        <div className="w-24">
                          <NumberInput
                            value={heir.count}
                            onValueChange={(val) => updateHeirCount(heir.id, val.toString())}
                            min={1}
                            className="h-9"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Parents Category */}
              <div className="mb-6">
                <h4 className="font-medium mb-2 text-primary/90">{t("inheritance-calculator.categories.parents")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {heirs.filter(heir => heir.category === 'parents').map(heir => (
                    <div key={heir.id} className="flex items-center space-x-4 space-x-reverse bg-muted/20 p-3 rounded-md">
                      <input
                        type="checkbox"
                        id={`heir-${heir.id}`}
                        checked={heir.selected}
                        onChange={() => toggleHeirSelection(heir.id)}
                        className="rounded text-primary focus:ring-primary w-5 h-5"
                      />
                      <label htmlFor={`heir-${heir.id}`} className="flex-1 cursor-pointer">
                        {heir.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Siblings Category */}
              <div className="mb-6">
                <h4 className="font-medium mb-2 text-primary/90">{t("inheritance-calculator.categories.siblings")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {heirs.filter(heir => heir.category === 'siblings').map(heir => (
                    <div key={heir.id} className="flex items-center space-x-4 space-x-reverse bg-muted/20 p-3 rounded-md">
                      <input
                        type="checkbox"
                        id={`heir-${heir.id}`}
                        checked={heir.selected}
                        onChange={() => toggleHeirSelection(heir.id)}
                        className="rounded text-primary focus:ring-primary w-5 h-5"
                      />
                      <label htmlFor={`heir-${heir.id}`} className="flex-1 cursor-pointer">
                        {heir.name}
                      </label>
                      {heir.selected && (
                        <div className="w-24">
                          <NumberInput
                            value={heir.count}
                            onValueChange={(val) => updateHeirCount(heir.id, val.toString())}
                            min={1}
                            className="h-9"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Estate Details Tab */}
        <TabsContent value="assets-debts" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                      <Briefcase className="w-5 h-5" />
                      {t("inheritance-calculator.estate_details")}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        label={t("inheritance-calculator.inputs.estate_value")}
                        tooltip={t("inheritance-calculator.placeholders.estate_value")}
                      >
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <NumberInput
                              value={estateValue}
                              onValueChange={(val) => setEstateValue(val.toString())}
                              placeholder={t("inheritance-calculator.placeholders.estate_value")}
                              min={0}
                              startIcon={<Coins className="h-4 w-4" />}
                            />
                          </div>
                          <div className="w-32">
                            <Combobox
                              options={currencies}
                              value={currency}
                              onChange={setCurrency}
                              placeholder={t("inheritance-calculator.placeholders.currency")}
                            />
                          </div>
                        </div>
                      </FormField>

                      <FormField
                        label={t("inheritance-calculator.inputs.debts")}
                        tooltip={t("inheritance-calculator.placeholders.debts")}
                      >
                        <NumberInput
                          value={debts}
                          onValueChange={(val) => setDebts(val.toString())}
                          placeholder={t("inheritance-calculator.placeholders.debts")}
                          min={0}
                          startIcon={<DollarSign className="h-4 w-4" />}
                        />
                      </FormField>

                      <FormField
                        label={t("inheritance-calculator.inputs.wasiyyah")}
                        tooltip={t("inheritance-calculator.placeholders.wasiyyah")}
                        className="md:col-span-2"
                      >
                        <NumberInput
                          value={wasiyyah}
                          onValueChange={(val) => setWasiyyah(val.toString())}
                          placeholder={t("inheritance-calculator.placeholders.wasiyyah")}
                          min={0}
                          startIcon={<FileText className="h-4 w-4" />}
                        />
                      </FormField>
                    </div>
                  </div>
                </div>

                <div className="pt-4 bg-muted/30 p-4 rounded-md border border-border">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span>{t("inheritance-calculator.results.total_estate")}</span>
                    <span className="font-mono">{parseFloat(estateValue || '0').toFixed(2)} {currencySymbols[currency] || currency}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2 text-red-600">
                    <span>{t("inheritance-calculator.results.total_debts")}</span>
                    <span className="font-mono">- {parseFloat(debts || '0').toFixed(2)} {currencySymbols[currency] || currency}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2 text-orange-600">
                    <span>{t("inheritance-calculator.results.wasiyyah_amount")}</span>
                    <span className="font-mono">- {Math.min(parseFloat(wasiyyah || '0'), (parseFloat(estateValue || '0') - parseFloat(debts || '0')) / 3).toFixed(2)} {currencySymbols[currency] || currency}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center font-bold text-lg text-primary">
                      <span>{t("inheritance-calculator.results.net_distributable")}</span>
                      <span className="font-mono">{getNetEstate().toFixed(2)} {currencySymbols[currency] || currency}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Calculate Shares Tab */}
        <TabsContent value="calculate-shares" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{t("inheritance-calculator.results_title")}</h3>
                <div className="flex space-x-2 space-x-reverse">
                  <Button variant="outline" onClick={resetCalculator} size="sm">
                    <RotateCcw className="w-4 h-4 ml-1" />
                    {t("common.reset")}
                  </Button>
                  <Button variant="outline" onClick={copyToClipboard} size="sm" disabled={results.length === 0}>
                    <Copy className="w-4 h-4 ml-1" />
                    {t("common.copy")}
                  </Button>
                </div>
              </div>

              <ErrorDisplay error={errorMessage || ''} />
              
              {results.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-md border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{t("inheritance-calculator.results.net_distributable")}</span>
                      <span className="font-bold text-primary font-mono">{getNetEstate().toFixed(2)} {currencySymbols[currency] || currency}</span>
                    </div>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-right">{t("inheritance-calculator.table.heir")}</th>
                          <th className="px-4 py-3 text-center">{t("inheritance-calculator.table.count")}</th>
                          <th className="px-4 py-3 text-center">{t("inheritance-calculator.table.share")}</th>
                          <th className="px-4 py-3 text-left">{t("inheritance-calculator.table.value")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((heir, index) => (
                          <tr key={heir.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                            <td className="px-4 py-3 text-right font-medium">{heir.name}</td>
                            <td className="px-4 py-3 text-center">{heir.count}</td>
                            <td className="px-4 py-3 text-center font-mono">{heir.shareText}</td>
                            <td className="px-4 py-3 font-bold text-primary text-left font-mono">
                              {((heir.share || 0) * getNetEstate()).toFixed(2)} {currencySymbols[currency] || currency}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t("inheritance-calculator.empty_state.title")}</h3>
                  <p className="text-muted-foreground">{t("inheritance-calculator.empty_state.desc")}</p>
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-4 mt-6 border border-border">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {t("inheritance-calculator.info.title")}
                </h3>
                <ul className="space-y-1 list-disc mr-5 text-sm text-muted-foreground">
                  <li>{t("inheritance-calculator.info.point1")}</li>
                  <li>{t("inheritance-calculator.info.point2")}</li>
                  <li>{t("inheritance-calculator.info.point3")}</li>
                  <li>{t("inheritance-calculator.info.point4")}</li>
                  <li>{t("inheritance-calculator.info.point5")}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </CalculatorLayout>
  );
}
