'use client';

import { useEffect } from 'react';
import { ShoppingBag, Star, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getRecommendedProducts, trackProductImpression, trackProductClick, type DigitalProduct } from '@/data/products';
import { useToast } from '@/hooks/useToast';

interface SmartRecommendationsProps {
  category: string;
  calculatorSlug?: string;
  resultValue?: number | string;
  className?: string;
}

export default function SmartRecommendations({
  category,
  calculatorSlug,
  resultValue,
  className = ''
}: SmartRecommendationsProps) {
  const { t, i18n } = useTranslation('common');
  const toast = useToast();
  const isArabic = i18n.language === 'ar';

  // Get smart product recommendations (not premium-export type, those show in sidebar)
  const allProducts = getRecommendedProducts(category, calculatorSlug, resultValue);
  const products = allProducts.filter(p =>
    p.displayType === 'post-calculation-modal' ||
    p.displayType === 'sidebar-card' ||
    p.displayType === 'all'
  ).slice(0, 2); // Show max 2 recommendations

  // Track impressions
  useEffect(() => {
    products.forEach(product => {
      trackProductImpression(product.id, 'smart-recommendations');
    });
  }, [products]);

  if (products.length === 0) return null;

  const handleProductClick = (product: DigitalProduct) => {
    trackProductClick(product.id, isArabic ? product.nameAr : product.name, product.price);

    if (product.gumroadUrl.startsWith('http')) {
      window.open(product.gumroadUrl, '_blank');
    } else {
      console.warn(`Product ${product.id} needs Gumroad URL`);
      toast.info(t('monetization.messages.productLinkComingSoon'));
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          {t('monetization.recommendations.title', 'Recommended Resources')}
        </h3>
      </div>

      {products.map((product, index) => {
        const displayName = isArabic ? product.nameAr : product.name;
        const displayDescription = isArabic ? product.descriptionAr : product.description;
        const displayFeatures = isArabic ? product.featuresAr : product.features;

        return (
          <div
            key={product.id}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 sm:p-6 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            {/* Header with badge */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h4 className="font-bold text-foreground text-base sm:text-lg">
                    {displayName}
                  </h4>
                  {product.badge && (
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {isArabic ? product.badgeAr : product.badge}
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {displayDescription}
                </p>

                {/* Features */}
                {displayFeatures && displayFeatures.length > 0 && (
                  <ul className="space-y-1.5 mb-4">
                    {displayFeatures.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Sparkles className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-black text-primary">
                    ${product.price}
                  </div>
                  <button
                    onClick={() => handleProductClick(product)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    <span>{t('monetization.recommendations.getAccess', 'Get Access')}</span>
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
