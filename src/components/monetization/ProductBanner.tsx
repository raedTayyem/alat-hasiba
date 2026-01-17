'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getRecommendedProducts, trackProductImpression, trackProductClick } from '@/data/products';
import { useToast } from '@/hooks/useToast';

interface ProductBannerProps {
  category: string;
  calculatorSlug?: string;
  resultValue?: number | string;
  position?: 'top' | 'bottom';
}

/**
 * Floating banner that shows products contextually
 * Can be positioned at top or bottom of viewport
 */
export default function ProductBanner({
  category,
  calculatorSlug,
  resultValue,
  position = 'bottom'
}: ProductBannerProps) {
  const { t, i18n } = useTranslation('common');
  const toast = useToast();
  const isArabic = i18n.language === 'ar';
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Get highest priority product
  const products = getRecommendedProducts(category, calculatorSlug, resultValue);
  const product = products.length > 0 ? products[0] : null;

  useEffect(() => {
    if (!product || isDismissed) return;

    // Check if user has dismissed this product before
    const dismissedKey = `banner_dismissed_${product.id}`;
    const wasDismissed = localStorage.getItem(dismissedKey);

    if (wasDismissed) {
      setIsDismissed(true);
      return;
    }

    // Show banner after user scrolls or after 10 seconds
    let scrollTimer: NodeJS.Timeout | undefined;
    let timeTimer: NodeJS.Timeout | undefined = undefined;

    const handleScroll = () => {
      if (window.scrollY > 300 && !isVisible) {
        setIsVisible(true);
        trackProductImpression(product.id, 'floating-banner');
        clearTimeout(timeTimer);
      }
    };

    // Show after 10 seconds if no scroll
    timeTimer = setTimeout(() => {
      if (!isVisible) {
        setIsVisible(true);
        trackProductImpression(product.id, 'floating-banner');
      }
    }, 10000);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
      clearTimeout(timeTimer);
    };
  }, [product, isDismissed, isVisible]);

  if (!product || !isVisible || isDismissed) return null;

  const displayName = isArabic ? product.nameAr : product.name;
  const displayDescription = isArabic ? product.descriptionAr : product.description;

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    // Remember dismissal for 7 days
    localStorage.setItem(`banner_dismissed_${product.id}`, Date.now().toString());
  };

  const handleClick = () => {
    trackProductClick(product.id, displayName, product.price);

    if (product.gumroadUrl.startsWith('http')) {
      window.open(product.gumroadUrl, '_blank');
    } else {
      toast.info(t('monetization.messages.productLinkComingSoon'));
    }
  };

  const positionClasses = position === 'top'
    ? 'top-4'
    : 'bottom-4';

  return (
    <div
      className={`fixed ${positionClasses} left-4 right-4 sm:left-auto sm:right-8 sm:max-w-md z-40 animate-in slide-in-from-bottom-8 duration-500`}
    >
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-2xl p-4 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          aria-label={t('aria.close')}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="relative z-10 pr-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <h4 className="font-bold text-base mb-1 line-clamp-1">
                {displayName}
              </h4>
              <p className="text-sm text-white/90 mb-3 line-clamp-2 leading-relaxed">
                {displayDescription}
              </p>

              <div className="flex items-center justify-between gap-3">
                <div className="text-2xl font-black">
                  ${product.price}
                </div>

                <button
                  onClick={handleClick}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-amber-600 rounded-lg hover:bg-white/90 transition-colors text-sm font-bold shadow-lg"
                >
                  <span>{t('monetization.buttons.getIt')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
