'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Sparkles, Download, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getProductByDisplayType, trackProductImpression, trackProductClick } from '@/data/products';
import { useToast } from '@/hooks/useToast';

interface ExitIntentModalProps {
  category: string;
  calculatorSlug?: string;
  resultValue?: number | string;
}

// Mobile detection helper
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check for touch capability and screen size
  const hasTouchScreen = 'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - msMaxTouchPoints for older IE/Edge
    navigator.msMaxTouchPoints > 0;

  // Also check user agent for mobile devices
  const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // Consider it mobile if it has touch AND (small screen OR mobile user agent)
  const isSmallScreen = window.innerWidth <= 768;

  return hasTouchScreen && (isSmallScreen || mobileUserAgent);
};

// Scroll reversal detection configuration
const SCROLL_REVERSAL_CONFIG = {
  minScrollDown: 300, // Minimum pixels scrolled down before tracking reversal
  reversalThreshold: 150, // Pixels scrolled up quickly to trigger
  reversalTimeWindow: 1000, // Time window in ms for quick scroll detection
};

// Inactivity configuration
const INACTIVITY_CONFIG = {
  inactivityThreshold: 30000, // 30 seconds of inactivity
  interactionEvents: ['touchstart', 'touchmove', 'scroll', 'click', 'keydown'],
};

export default function ExitIntentModal({
  category,
  calculatorSlug,
  resultValue
}: ExitIntentModalProps) {
  const { t, i18n } = useTranslation('common');
  const toast = useToast();
  const isArabic = i18n.language === 'ar';
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Refs for mobile exit intent tracking
  const maxScrollPosition = useRef(0);
  const scrollHistory = useRef<{ position: number; timestamp: number }[]>([]);
  const lastActivityTime = useRef(Date.now());
  const wasInactive = useRef(false);
  const isMobile = useRef(false);

  const product = getProductByDisplayType('exit-intent', category, calculatorSlug, resultValue);

  // Trigger exit intent modal
  const triggerExitIntent = useCallback(() => {
    if (hasShown || !product) return;
    setIsVisible(true);
    setHasShown(true);
    trackProductImpression(product.id, 'exit-intent-modal');
  }, [hasShown, product]);

  // Desktop exit intent (mouse leave from top)
  useEffect(() => {
    if (!product || hasShown) return;

    // Skip desktop behavior on mobile
    if (typeof window !== 'undefined' && isMobileDevice()) {
      isMobile.current = true;
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top of viewport
      if (e.clientY <= 0 && !hasShown) {
        triggerExitIntent();
      }
    };

    // Wait 5 seconds before enabling exit intent
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [product, hasShown, triggerExitIntent]);

  // Mobile exit intent: Scroll reversal detection
  useEffect(() => {
    if (!product || hasShown) return;
    if (typeof window === 'undefined' || !isMobileDevice()) return;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const now = Date.now();

      // Track maximum scroll position
      if (currentScroll > maxScrollPosition.current) {
        maxScrollPosition.current = currentScroll;
      }

      // Add to scroll history
      scrollHistory.current.push({ position: currentScroll, timestamp: now });

      // Keep only recent scroll history within the time window
      scrollHistory.current = scrollHistory.current.filter(
        entry => now - entry.timestamp <= SCROLL_REVERSAL_CONFIG.reversalTimeWindow
      );

      // Check for quick scroll reversal (user scrolled up quickly)
      if (
        maxScrollPosition.current >= SCROLL_REVERSAL_CONFIG.minScrollDown &&
        scrollHistory.current.length >= 2
      ) {
        const oldestEntry = scrollHistory.current[0];
        const newestEntry = scrollHistory.current[scrollHistory.current.length - 1];

        // Calculate scroll velocity (pixels per second, negative = scrolling up)
        const scrollDelta = newestEntry.position - oldestEntry.position;
        const timeDelta = newestEntry.timestamp - oldestEntry.timestamp;

        // Check if scrolled up quickly enough
        if (
          scrollDelta < -SCROLL_REVERSAL_CONFIG.reversalThreshold &&
          timeDelta > 0 &&
          timeDelta <= SCROLL_REVERSAL_CONFIG.reversalTimeWindow
        ) {
          triggerExitIntent();
        }
      }
    };

    // Throttle scroll handler for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Wait 5 seconds before enabling
    const timer = setTimeout(() => {
      window.addEventListener('scroll', throttledScroll, { passive: true });
    }, 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [product, hasShown, triggerExitIntent]);

  // Mobile exit intent: Inactivity + visibility change
  useEffect(() => {
    if (!product || hasShown) return;
    if (typeof window === 'undefined' || !isMobileDevice()) return;

    // Track user activity
    const updateActivity = () => {
      lastActivityTime.current = Date.now();
      wasInactive.current = false;
    };

    // Check for inactivity
    const checkInactivity = () => {
      const inactiveTime = Date.now() - lastActivityTime.current;
      if (inactiveTime >= INACTIVITY_CONFIG.inactivityThreshold) {
        wasInactive.current = true;
      }
    };

    // Handle visibility change (user switching tabs/apps)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        checkInactivity();
        // If user was inactive and is now leaving, trigger exit intent
        if (wasInactive.current) {
          triggerExitIntent();
        }
      }
    };

    // Handle page hide event (more reliable on mobile for detecting actual exit)
    const handlePageHide = () => {
      checkInactivity();
      if (wasInactive.current) {
        triggerExitIntent();
      }
    };

    // Set up activity listeners
    const activityEvents = INACTIVITY_CONFIG.interactionEvents;

    // Wait 5 seconds before enabling
    const timer = setTimeout(() => {
      activityEvents.forEach(event => {
        document.addEventListener(event, updateActivity, { passive: true });
      });
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('pagehide', handlePageHide);
    }, 5000);

    // Periodic inactivity check
    const inactivityInterval = setInterval(checkInactivity, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(inactivityInterval);
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [product, hasShown, triggerExitIntent]);

  // Mobile exit intent: Back button / navigation gesture detection
  useEffect(() => {
    if (!product || hasShown) return;
    if (typeof window === 'undefined' || !isMobileDevice()) return;

    // Use the beforeunload event as a fallback
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // On mobile, this often triggers when user navigates away
      triggerExitIntent();
    };

    // Wait 5 seconds before enabling
    const timer = setTimeout(() => {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }, 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [product, hasShown, triggerExitIntent]);

  if (!product || !isVisible) return null;

  const displayName = isArabic ? product.nameAr : product.name;
  const displayDescription = isArabic ? product.descriptionAr : product.description;
  const displayFeatures = isArabic ? product.featuresAr : product.features;

  const handleClose = () => {
    setIsVisible(false);
  };

  const handlePurchase = () => {
    trackProductClick(product.id, displayName, product.price);

    if (product.gumroadUrl.startsWith('http')) {
      window.open(product.gumroadUrl, '_blank');
      setIsVisible(false);
    } else {
      toast.info(t('monetization.exitIntent.productLinkComingSoon'));
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-card border border-border rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              {product.badge && (
                <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                  {isArabic ? product.badgeAr : product.badge}
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-2 text-foreground">
              {t('monetization.exitIntent.beforeYouGo')}
            </h2>

            <h3 className="text-xl font-bold mb-3 text-primary">
              {displayName}
            </h3>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {displayDescription}
            </p>

            {/* Features */}
            <ul className="space-y-2 mb-6">
              {displayFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Price */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t('monetization.exitIntent.specialPrice')}
                </p>
                <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
                  ${product.price}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {t('monetization.exitIntent.instantDownload')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('monetization.exitIntent.securePayment')}
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handlePurchase}
              className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>{t('monetization.exitIntent.getInstantAccess')}</span>
            </button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              {t('monetization.exitIntent.moneyBackGuarantee')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
