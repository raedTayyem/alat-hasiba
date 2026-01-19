'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Info, CheckCircle } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { ResultCard } from '@/components/ui/ResultVisualizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

export default function AbjadCalculator() {
  const { t, i18n } = useTranslation(['translation', 'calc/misc']);
  const isRTL = i18n.language === 'ar';

  // Define Abjad systems
  const abjadSystems = [
    {
      id: 'standard',
      name: t("calc/misc:abjad.standard_title"),
      description: t("calc/misc:abjad.standard_desc"),
      values: {
        'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1,
        'ب': 2,
        'ج': 3,
        'د': 4,
        'ه': 5, 'ة': 5,
        'و': 6,
        'ز': 7,
        'ح': 8,
        'ط': 9,
        'ي': 10, 'ى': 10,
        'ك': 20,
        'ل': 30,
        'م': 40,
        'ن': 50,
        'س': 60,
        'ع': 70,
        'ف': 80,
        'ص': 90,
        'ق': 100,
        'ر': 200,
        'ش': 300,
        'ت': 400,
        'ث': 500,
        'خ': 600,
        'ذ': 700,
        'ض': 800,
        'ظ': 900,
        'غ': 1000
      } as Record<string, number>
    },
    {
      id: 'maghrebi',
      name: t("calc/misc:abjad.maghrebi_title"),
      description: t("calc/misc:abjad.maghrebi_desc"),
      values: {
        'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1,
        'ب': 2,
        'ج': 3,
        'د': 4,
        'ه': 5, 'ة': 5,
        'و': 6,
        'ز': 7,
        'ح': 8,
        'ط': 9,
        'ي': 10, 'ى': 10,
        'ك': 20,
        'ل': 30,
        'م': 40,
        'ن': 50,
        'ص': 60,
        'ع': 70,
        'ف': 80,
        'ض': 90,
        'ق': 100,
        'ر': 200,
        'س': 300,
        'ت': 400,
        'ث': 500,
        'خ': 600,
        'ذ': 700,
        'ظ': 800,
        'غ': 900,
        'ش': 1000
      } as Record<string, number>
    },
    {
      id: 'small',
      name: t("calc/misc:abjad.small_title"),
      description: t("calc/misc:abjad.small_desc"),
      values: {
        'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1,
        'ب': 2,
        'ج': 3,
        'د': 4,
        'ه': 5, 'ة': 5,
        'و': 6,
        'ز': 7,
        'ح': 8,
        'ط': 9,
        'ي': 10, 'ى': 10,
        'ك': 11,
        'ل': 12,
        'م': 13,
        'ن': 14,
        'س': 15,
        'ع': 16,
        'ف': 17,
        'ص': 18,
        'ق': 19,
        'ر': 20,
        'ش': 21,
        'ت': 22,
        'ث': 23,
        'خ': 24,
        'ذ': 25,
        'ض': 26,
        'ظ': 27,
        'غ': 28
      } as Record<string, number>
    }
  ];

  const [text, setText] = useState<string>('');
  const [activeSystem, setActiveSystem] = useState<string>('standard');
  const [result, setResult] = useState<number | null>(null);
  const [detailedResult, setDetailedResult] = useState<{ char: string, value: number }[]>([]);
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (error) setError('');
  };

  const calculateAbjadValue = () => {
    setError('');

    if (!text.trim()) {
      setError(t("calc/misc:abjad.input_error"));
      return;
    }

    const selectedSystem = abjadSystems.find(system => system.id === activeSystem);
    if (!selectedSystem) {
      setError(t("calc/misc:abjad.system_error"));
      return;
    }

    try {
      setShowResult(false);

      setTimeout(() => {
        let total = 0;
        const details: { char: string, value: number }[] = [];

        for (const char of text) {
          if (/\s|[.,،؛:!؟()[\]{}«»""'']/g.test(char)) {
            continue;
          }

          const value = selectedSystem.values[char] || 0;
          total += value;
          details.push({ char, value });
        }

        setResult(total);
        setDetailedResult(details);
        setShowResult(true);
      }, 300);
    } catch (error) {
      setError(t("calc/misc:abjad.calc_error"));
    }
  };

  const resetCalculator = () => {
    setShowResult(false);

    setTimeout(() => {
      setText('');
      setResult(null);
      setDetailedResult([]);
      setError('');
    }, 300);
  };

  const handleSystemChange = (value: string) => {
    setActiveSystem(value);
    if (text) {
      setTimeout(() => calculateAbjadValue(), 0);
    }
  };

  const getUsageTips = () => {
    return (
      <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-bold mb-2 text-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-primary" />
          {t("calc/misc:abjad.usage_tips")}
        </h2>
        <ul className="list-disc list-inside space-y-1 text-foreground-70">
          <li>{t("calc/misc:abjad.tip1")}</li>
          <li>{t("calc/misc:abjad.tip2")}</li>
          <li>{t("calc/misc:abjad.tip3")}</li>
        </ul>
      </div>
    );
  };

  const getAbjadInformation = () => {
    return (
      <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-bold mb-2 text-lg flex items-center">
          <Info className="w-5 h-5 mr-2 text-info" />
          {t("calc/misc:abjad.info_title")}
        </h2>
        <p className="text-foreground-70">{t("calc/misc:abjad.info_desc")}</p>
      </div>
    );
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("calc/misc:abjad.selection_system")}</div>

      <Tabs value={activeSystem} onValueChange={handleSystemChange} className="w-full mb-4">
        <TabsList className="grid w-full grid-cols-3">
          {abjadSystems.map(system => (
            <TabsTrigger key={system.id} value={system.id}>
              {system.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {abjadSystems.map(system => (
          <TabsContent key={system.id} value={system.id} className="mt-2">
            <p className="text-sm text-foreground-70 mb-4">
              {system.description}
            </p>
          </TabsContent>
        ))}
      </Tabs>

      <div className="max-w-md mx-auto">
        <InputContainer
          label={t("calc/misc:abjad.input_label")}
          tooltip={t("calc/misc:abjad.input_tooltip")}
        >
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-muted-foreground">
              <Keyboard className="h-4 w-4" />
            </div>
            <Input
              placeholder={t("calc/misc:abjad.placeholder")}
              value={text}
              onChange={handleTextChange}
              dir={isRTL ? "rtl" : "ltr"}
              className="text-lg ps-10"
            />
          </div>
        </InputContainer>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons
          onCalculate={calculateAbjadValue}
          onReset={resetCalculator}
          calculateText={t("calc/misc:abjad.calculate")}
        />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          {getAbjadInformation()}
          {getUsageTips()}
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-5">
        <div className="text-foreground-70 mb-1">{t("calc/misc:abjad.total_result")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{result}</div>
        <div className="text-lg">
          <span className="text-foreground-70">{t("calc/misc:abjad.based_on")} {abjadSystems.find(s => s.id === activeSystem)?.name}</span>
        </div>
      </div>

      <div className="divider my-4"></div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">{t("calc/misc:abjad.details")}</h3>
        <div className="bg-card-bg rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">{t("calc/misc:abjad.char")}</TableHead>
                <TableHead className="text-center">{t("calc/misc:abjad.value")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailedResult.map((item, index) => (
                <TableRow key={index} className={index % 2 === 0 ? 'bg-foreground/5' : ''}>
                  <TableCell className="text-center font-bold text-lg">{item.char}</TableCell>
                  <TableCell className="text-center">{item.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">{t("calc/misc:abjad.summary")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResultCard
            title={t("calc/misc:abjad.system_used")}
            value={abjadSystems.find(s => s.id === activeSystem)?.name || ''}
            icon={
              <Info className="w-6 h-6" />
            }
          />
          <ResultCard
            title={t("calc/misc:abjad.char_count")}
            value={detailedResult.length.toString()}
            icon={
              <Keyboard className="w-6 h-6" />
            }
          />
        </div>
      </div>

      {getAbjadInformation()}
      {getUsageTips()}
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("calc/misc:abjad.page_title")}
      description={t("calc/misc:abjad.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
