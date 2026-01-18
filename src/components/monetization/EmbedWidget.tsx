'use client';

import { useState } from 'react';
import { Code, Copy, CheckCircle } from '@/utils/icons';
import { useTranslation } from 'react-i18next';

interface EmbedWidgetProps {
  calculatorName: string;
  calculatorUrl: string;
  className?: string;
}

export default function EmbedWidget({
  calculatorName,
  calculatorUrl,
  className = ''
}: EmbedWidgetProps) {
  const { t } = useTranslation('common');
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const embedCode = `<iframe
  src="${calculatorUrl}?embed=true"
  width="100%"
  height="600"
  frameborder="0"
  title="${calculatorName}"
  style="border: 1px solid #e5e7eb; border-radius: 12px;"
></iframe>
<p style="text-align: center; margin-top: 8px; font-size: 12px; color: #6b7280;">
  ${t('embed.poweredBy', 'Powered by')} <a href="https://alathasiba.com" target="_blank" rel="noopener" style="color: #2563eb; text-decoration: none;">alathasiba.com</a>
</p>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);

      // Track embed code copy
      if (window.gtag) {
        window.gtag('event', 'embed_copy', {
          calculator: calculatorName
        });
      }

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`bg-card border border-border rounded-2xl p-6 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
          <Code className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1 w-full min-w-0">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground mb-2">
              {t('embed.title')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('embed.description')}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              <span>{showCode ? t('embed.hideCode') : t('embed.showCode')}</span>
            </button>

            {showCode && (
              <button
                onClick={handleCopy}
                className="px-5 py-2.5 bg-background border-2 border-border text-foreground rounded-xl font-bold hover:bg-muted transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">
                      {t('embed.copied')}
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{t('embed.copy')}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {showCode && (
            <div className="mt-6 bg-gray-900 rounded-xl p-4 overflow-x-auto border border-gray-800 shadow-inner">
              <code className="text-sm text-green-400 font-mono whitespace-pre-wrap break-all block">
                {embedCode}
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
