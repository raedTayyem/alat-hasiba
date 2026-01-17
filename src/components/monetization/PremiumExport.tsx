'use client';

import { useState, useEffect } from 'react';
import { Download, Lock, Sparkles, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getProductByDisplayType, trackProductImpression, trackProductClick } from '@/data/products';
import { useToast } from '@/hooks/useToast';

interface PremiumExportProps {
  calculatorName: string;
  results: any;
  category?: string;
  calculatorSlug?: string;
  resultValue?: number | string;
  price?: number;
  className?: string;
}

export default function PremiumExport({
  category = 'general',
  calculatorSlug,
  resultValue,
  price,
  className = ''
}: PremiumExportProps) {
  const { t, i18n } = useTranslation(['common', 'translation']);
  const toast = useToast();
  const isArabic = i18n.language === 'ar';
  const [isProcessing, setIsProcessing] = useState(false);

  // Get smart product recommendation
  const product = getProductByDisplayType('premium-export', category, calculatorSlug, resultValue);

  // Track impression when component mounts
  useEffect(() => {
    if (product) {
      trackProductImpression(product.id, 'premium-export-sidebar');
    }
  }, [product]);

  // If no product matches, don't show anything
  if (!product) return null;

  const displayPrice = price || product.price;
  const displayFeatures = isArabic ? product.featuresAr : product.features;
  const displayName = isArabic ? product.nameAr : product.name;
  const displayDescription = isArabic ? product.descriptionAr : product.description;

  const handlePurchase = () => {
    setIsProcessing(true);

    // Track analytics
    trackProductClick(product.id, displayName, displayPrice);

    // Open Gumroad (with fallback to placeholder message)
    if (product.gumroadUrl.startsWith('http')) {
      window.open(product.gumroadUrl, '_blank');
    } else {
      // Product URL not configured yet
      console.warn(`Product ${product.id} needs Gumroad URL configured`);
      toast.info(t('monetization.messages.productLinkComing'));
    }

    setTimeout(() => setIsProcessing(false), 1000);
  };

  return (
    <div className={`bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-800 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden relative group ${className}`}>
      {/* Decorative element */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

      <div className="relative z-10">
        {/* Header with badge and price */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            {product.badge && (
              <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                {isArabic ? product.badgeAr : product.badge}
              </span>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400 mb-1">
              {t('monetization.premium.title', 'Premium')}
            </span>
            <div className="text-2xl font-black text-foreground">${displayPrice}</div>
          </div>
        </div>

        {/* Product name and description */}
        <h3 className="text-lg sm:text-xl font-bold mb-2 leading-tight">
          {displayName}
        </h3>

        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {displayDescription}
        </p>

        {/* Features list */}
        <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          {displayFeatures.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground group/item">
              <div className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 group-hover/item:bg-amber-500/20 transition-colors">
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Purchase button */}
        <button
          onClick={handlePurchase}
          disabled={isProcessing}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 text-sm sm:text-base"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t('monetization.premium.button', 'Get Instant Access')}</span>
            </>
          )}
        </button>

        {/* Security badge */}
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          <Lock className="w-3 h-3" />
          <span>{t('monetization.premium.secure', 'Secure Payment via Gumroad')}</span>
        </div>
      </div>
    </div>
  );
}

