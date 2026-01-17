import { useTranslation } from 'react-i18next';

const CalculatorSkeleton = () => {
  const { t } = useTranslation();

  return (
    <div
      className="w-full mx-auto space-y-8 px-4 py-6 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label={t('common.loadingCalculator')}
    >
      {/* Header Skeleton */}
      <header className="space-y-3">
        <div className="h-10 md:h-12 bg-muted rounded-2xl w-3/4 max-w-lg"></div>
        <div className="h-4 md:h-5 bg-muted rounded-lg w-full max-w-2xl"></div>
        <div className="h-4 md:h-5 bg-muted rounded-lg w-2/3 max-w-xl"></div>
      </header>

      {/* Ad Skeleton */}
      <div className="h-24 bg-muted rounded-2xl w-full"></div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Main Content Skeleton */}
        <div className="w-full xl:col-span-8 space-y-8">
          <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
            {/* Input Section Skeleton */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="h-7 bg-muted rounded-full w-32 mb-8"></div>
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 bg-muted rounded-lg w-24"></div>
                    <div className="h-12 bg-muted rounded-xl w-full"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Results Section Skeleton */}
            <div className="p-6 md:p-8 border-t border-border bg-muted/20">
              <div className="h-7 bg-muted rounded-full w-32 mb-8"></div>
              <div className="h-48 bg-card border border-border rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <aside className="w-full xl:col-span-4 space-y-6">
          <div className="h-64 bg-muted rounded-2xl w-full"></div>
          <div className="h-48 bg-muted rounded-2xl w-full"></div>
          <div className="h-64 bg-muted rounded-2xl w-full"></div>
        </aside>
      </div>
    </div>
  );
};

export default CalculatorSkeleton;