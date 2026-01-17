'use client';

import { useEffect } from 'react';
import { Download, Check, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getRecommendedProducts, trackProductImpression, trackProductClick } from '@/data/products';
import { useToast } from '@/hooks/useToast';

interface ProductShowcaseProps {
  category: string;
  calculatorSlug?: string;
  resultValue?: number | string;
  maxProducts?: number;
  layout?: 'grid' | 'list';
  className?: string;
}

/**
 * Full-width product showcase - shows multiple products in attractive grid/list
 * Perfect for displaying after calculation results
 */
export default function ProductShowcase({
  category,
  calculatorSlug,
  resultValue,
  maxProducts = 3,
  layout = 'grid',
  className = ''
}: ProductShowcaseProps) {
  const { t, i18n } = useTranslation('common');
  const toast = useToast();
  const isArabic = i18n.language === 'ar';

  // Get all matching products
  const products = getRecommendedProducts(category, calculatorSlug, resultValue).slice(0, maxProducts);

  // Track impressions
  useEffect(() => {
    products.forEach(product => {
      trackProductImpression(product.id, 'product-showcase');
    });
  }, [products]);

  if (products.length === 0) return null;

  const handleClick = (product: typeof products[0]) => {
    const displayName = isArabic ? product.nameAr : product.name;
    trackProductClick(product.id, displayName, product.price);

    if (product.gumroadUrl.startsWith('http')) {
      window.open(product.gumroadUrl, '_blank');
    } else {
      toast.info(t('monetization.productShowcase.productLinkComingSoon'));
    }
  };

  const gridClasses = layout === 'grid'
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
    : 'space-y-4';

  return (
    <div className={`w-full ${className}`}>
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            {t('monetization.productShowcase.title')}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {t('monetization.productShowcase.description')}
        </p>
      </div>

      {/* Products Grid/List */}
      <div className={gridClasses}>
        {products.map((product) => {
          const displayName = isArabic ? product.nameAr : product.name;
          const displayDescription = isArabic ? product.descriptionAr : product.description;
          const displayFeatures = isArabic ? product.featuresAr : product.features;

          return (
            <div
              key={product.id}
              className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {/* Badge */}
              {product.badge && (
                <span className="inline-block px-2 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                  {isArabic ? product.badgeAr : product.badge}
                </span>
              )}

              {/* Product info */}
              <h4 className="text-lg font-bold text-foreground mb-2">
                {displayName}
              </h4>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                {displayDescription}
              </p>

              {/* Key features */}
              {displayFeatures && displayFeatures.length > 0 && (
                <ul className="space-y-1.5 mb-4">
                  {displayFeatures.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Price and CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-amber-200 dark:border-amber-800">
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  ${product.price}
                </div>

                <button
                  onClick={() => handleClick(product)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all text-sm font-bold shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('monetization.productShowcase.getAccess')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust indicators */}
      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Check className="w-3 h-3 text-green-500" />
          <span>{t('monetization.productShowcase.securePayment')}</span>
        </div>
        <div className="flex items-center gap-1">
          <Check className="w-3 h-3 text-green-500" />
          <span>{t('monetization.productShowcase.instantDownload')}</span>
        </div>
        <div className="flex items-center gap-1">
          <Check className="w-3 h-3 text-green-500" />
          <span>{t('monetization.productShowcase.moneyBackGuarantee')}</span>
        </div>
      </div>
    </div>
  );
}
