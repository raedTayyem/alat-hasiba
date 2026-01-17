'use client';

import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Info, Heart } from 'lucide-react';

export default function HolyWeekTraditions() {
  const { t } = useTranslation('common');

  const inputSection = (
    <div className="space-y-4">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          {t("holy_week.traditions.title")}
        </h4>
        <p className="text-foreground/80 text-sm md:text-base">
          {t("holy_week.traditions.intro")}
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="palm-sunday">
          <AccordionTrigger>{t("holy_week.traditions.palm_sunday.title")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-foreground/80 text-sm md:text-base">
              <p>{t("holy_week.traditions.palm_sunday.desc")}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="holy-monday-wednesday">
          <AccordionTrigger>{t("holy_week.traditions.holy_monday_wednesday.title")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-foreground/80 text-sm md:text-base">
              <p>{t("holy_week.traditions.holy_monday_wednesday.desc")}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="maundy-thursday">
          <AccordionTrigger>{t("holy_week.traditions.maundy_thursday.title")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-foreground/80 text-sm md:text-base">
              <p>{t("holy_week.traditions.maundy_thursday.desc_1")}</p>
              <p>{t("holy_week.traditions.maundy_thursday.desc_2")}</p>
              <p>{t("holy_week.traditions.maundy_thursday.desc_3")}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="good-friday">
          <AccordionTrigger>{t("holy_week.traditions.good_friday.title")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-foreground/80 text-sm md:text-base">
              <p>{t("holy_week.traditions.good_friday.desc_1")}</p>
              <p>{t("holy_week.traditions.good_friday.desc_2")}</p>
              <p>{t("holy_week.traditions.good_friday.desc_3")}</p>
              <p>{t("holy_week.traditions.good_friday.desc_4")}</p>
              <p>{t("holy_week.traditions.good_friday.desc_5")}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="holy-saturday">
          <AccordionTrigger>{t("holy_week.traditions.holy_saturday.title")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-foreground/80 text-sm md:text-base">
              <p>{t("holy_week.traditions.holy_saturday.desc_1")}</p>
              <p>{t("holy_week.traditions.holy_saturday.desc_2")}</p>
              <p>{t("holy_week.traditions.holy_saturday.desc_3")}</p>
              <p>{t("holy_week.traditions.holy_saturday.desc_4")}</p>
              <p>{t("holy_week.traditions.holy_saturday.desc_5")}</p>
              <p>{t("holy_week.traditions.holy_saturday.desc_6")}</p>
              <p>{t("holy_week.traditions.holy_saturday.desc_7")}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="easter-sunday">
          <AccordionTrigger>{t("holy_week.traditions.easter_sunday.title")}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-foreground/80 text-sm md:text-base">
              <p>{t("holy_week.traditions.easter_sunday.desc_1")}</p>
              <p>{t("holy_week.traditions.easter_sunday.desc_2")}</p>
              <p>{t("holy_week.traditions.easter_sunday.desc_3")}</p>
              <p>{t("holy_week.traditions.easter_sunday.desc_4")}</p>
              <p>{t("holy_week.traditions.easter_sunday.desc_5")}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold">{t("holy_week.traditions.symbols_title")}</h3>
      </div>

      <div className="bg-foreground/5 rounded-lg p-4">
        <p className="text-foreground/80 text-sm md:text-base mb-3">
          {t("holy_week.traditions.symbols_intro")}
        </p>
        <ul className="list-disc list-inside space-y-2 text-foreground/80 text-sm md:text-base">
          <li>{t("holy_week.traditions.symbol_1")}</li>
          <li>{t("holy_week.traditions.symbol_2")}</li>
        </ul>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("holy_week.traditions.title")}
      description={t("holy_week.traditions.intro")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
