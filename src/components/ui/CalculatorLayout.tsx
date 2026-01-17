import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { initDateInputRTLOnContainer } from '@/utils/dateInputRTL';
import { generateHowToStructuredData } from '@/utils/seoUtils';
import PremiumExport from '../monetization/PremiumExport';
import SmartRecommendations from '../monetization/SmartRecommendations';
import ExitIntentModal from '../monetization/ExitIntentModal';
import ProductShowcase from '../monetization/ProductShowcase';
import EmbedWidget from '../monetization/EmbedWidget';
import ProductBanner from '../monetization/ProductBanner';
import { Info, HelpCircle } from 'lucide-react';

// Interface for HowTo structured data from translations
interface HowToData {
  name: string;
  description?: string;
  steps: { name: string; text: string }[];
}

interface CalculatorLayoutProps {
  title?: string;
  titleTooltip?: string;
  description?: string;
  inputSection?: React.ReactNode;
  resultSection?: React.ReactNode;
  children?: React.ReactNode;
  footerNote?: string;
  category?: string; // e.g., 'finance', 'fitness', 'health', 'real-estate', 'pet'
  calculatorSlug?: string; // e.g., 'mortgage-calculator-advanced', 'bmi-calculator'
  results?: any; // Calculator results for smart recommendations
  resultValue?: number | string; // Main result value
  className?: string; // Additional CSS classes
  showExitIntent?: boolean; // Show exit-intent modal (default: true)
  showProductShowcase?: boolean; // Show product showcase below results (default: false)
  howto?: HowToData; // HowTo structured data for SEO
}

const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({
  title,
  titleTooltip,
  description,
  inputSection,
  resultSection,
  children,
  footerNote,
  category,
  calculatorSlug,
  results,
  resultValue,
  className,
  showExitIntent = true,
  showProductShowcase = false,
  howto
}) => {
  const { t, i18n } = useTranslation('common');
  const calculatorRef = useRef<HTMLDivElement>(null);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Generate HowTo structured data if howto prop is provided
  const howToStructuredData = howto
    ? generateHowToStructuredData(
        howto.name,
        howto.steps,
        'PT2M',
        howto.description,
        i18n.language
      )
    : null;

  useEffect(() => {
    if (calculatorRef.current) {
      initDateInputRTLOnContainer(calculatorRef.current);
    }
  }, []);
  
  return (
    <div ref={calculatorRef} className={`w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 px-3 sm:px-4 py-4 sm:py-6 lg:py-8 ${className || ''}`}>
      {/* HowTo Structured Data for SEO */}
      {howToStructuredData && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(howToStructuredData)}
          </script>
        </Helmet>
      )}

      {/* Calculator Header - Modern & Clean */}
      <header className="space-y-2 sm:space-y-3 text-center lg:text-start">
        <div className="flex items-center justify-center lg:justify-start gap-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
          {titleTooltip && (
            <div className="group relative">
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground cursor-help transition-colors hover:text-primary" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity w-48 sm:w-64 pointer-events-none border border-border z-50">
                {titleTooltip}
              </div>
            </div>
          )}
        </div>

        {description && (
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto lg:mx-0">
            {description}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
        {/* Main Content Area */}
        <div className="w-full max-w-2xl mx-auto xl:max-w-none xl:mx-0 xl:col-span-8 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Main Card with Split Layout */}
          <div className="bg-card border border-border rounded-xl sm:rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Input Section */}
            <div className="p-4 sm:p-6 md:p-8 bg-card/50">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-1 sm:w-1.5 h-5 sm:h-6 bg-primary rounded-full"></div>
                <h2 className="text-lg sm:text-xl font-bold">{t('layout.inputs', 'Inputs')}</h2>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {inputSection}
              </div>
            </div>

            {/* Results Section - More prominent */}
            <div className="p-4 sm:p-6 md:p-8 border-t border-border bg-primary/5 dark:bg-primary/10">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="w-1 sm:w-1.5 h-5 sm:h-6 bg-primary rounded-full"></div>
                <h2 className="text-lg sm:text-xl font-bold">{t('layout.results', 'Results')}</h2>
              </div>
              <div className="bg-card border border-border rounded-lg sm:rounded-xl shadow-inner p-4 sm:p-6">
                {children || resultSection}
              </div>
            </div>
          </div>

          {/* Product Showcase (optional, shows multiple products in grid) */}
          {showProductShowcase && category && (
            <ProductShowcase
              category={category}
              calculatorSlug={calculatorSlug}
              resultValue={resultValue}
              maxProducts={3}
              layout="grid"
            />
          )}

          {/* Smart Recommendations (shows 1-2 products as cards) */}
          {category && resultValue && (
            <SmartRecommendations
              category={category}
              calculatorSlug={calculatorSlug}
              resultValue={resultValue}
            />
          )}

          {/* Info Section / Footer Note */}
          {footerNote && (
            <div className="bg-muted/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border">
              <div className="flex gap-2 sm:gap-3">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                  {footerNote}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Monetization & Tools */}
        <aside className="w-full xl:col-span-4 space-y-4 sm:space-y-6">
          {/* Premium Product Display */}
          {results && category && (
            <PremiumExport
              calculatorName={title}
              results={results}
              category={category}
              calculatorSlug={calculatorSlug}
              resultValue={resultValue}
            />
          )}
        </aside>
      </div>

      {/* Embed Tool - Full Width */}
      <EmbedWidget
        calculatorName={title || ''}
        calculatorUrl={currentUrl}
        className="mt-8"
      />

      {/* Exit Intent Modal (shows when user tries to leave) */}
      {showExitIntent && category && (
        <ExitIntentModal
          category={category}
          calculatorSlug={calculatorSlug}
          resultValue={resultValue}
        />
      )}

      {/* Floating Product Banner (shows after scroll or delay) */}
      {category && (
        <ProductBanner
          category={category}
          calculatorSlug={calculatorSlug}
          resultValue={resultValue}
          position="bottom"
        />
      )}
    </div>
  );
};

export default CalculatorLayout;