'use client';

/**
 * Social Media Engagement Calculator
 *
 * Calculates Engagement Rate
 * Formula: Rate = Total Engagement / Followers × 100%
 * Total Engagement = Likes + Comments + Shares
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, MessageCircle, Share2, Users, TrendingUp, Percent } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  engagementRate: number;
  totalEngagement: number;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
}

export default function SocialMediaEngagementCalculator() {
  const { t } = useTranslation('calc/business');
  const [likes, setLikes] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [shares, setShares] = useState<string>('');
  const [followers, setFollowers] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const likesNum = parseFloat(likes) || 0;
    const commentsNum = parseFloat(comments) || 0;
    const sharesNum = parseFloat(shares) || 0;
    const followersNum = parseFloat(followers);

    if (isNaN(followersNum)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (likesNum < 0 || commentsNum < 0 || sharesNum < 0 || followersNum <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const likesNum = parseFloat(likes) || 0;
        const commentsNum = parseFloat(comments) || 0;
        const sharesNum = parseFloat(shares) || 0;
        const followersNum = parseFloat(followers);

        const totalEngagement = likesNum + commentsNum + sharesNum;
        const engagementRate = (totalEngagement / followersNum) * 100;

        setResult({
          engagementRate,
          totalEngagement,
          likes: likesNum,
          comments: commentsNum,
          shares: sharesNum,
          followers: followersNum,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setLikes('');
      setComments('');
      setShares('');
      setFollowers('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const getEngagementRating = (rate: number): { text: string; color: string } => {
    if (rate >= 6) return { text: t("social_media_engagement.ratings.excellent"), color: 'text-success' };
    if (rate >= 3) return { text: t("social_media_engagement.ratings.good"), color: 'text-success' };
    if (rate >= 1) return { text: t("social_media_engagement.ratings.average"), color: 'text-warning' };
    return { text: t("social_media_engagement.ratings.low"), color: 'text-error' };
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("social_media_engagement.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("social_media_engagement.inputs.likes")}
          tooltip={t("social_media_engagement.inputs.likes_tooltip")}
        >
          <NumberInput
            value={likes}
            onValueChange={(val) => {
              setLikes(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("social_media_engagement.inputs.likes_placeholder")}
            startIcon={<Heart className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("social_media_engagement.inputs.comments")}
          tooltip={t("social_media_engagement.inputs.comments_tooltip")}
        >
          <NumberInput
            value={comments}
            onValueChange={(val) => {
              setComments(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("social_media_engagement.inputs.comments_placeholder")}
            startIcon={<MessageCircle className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("social_media_engagement.inputs.shares")}
          tooltip={t("social_media_engagement.inputs.shares_tooltip")}
        >
          <NumberInput
            value={shares}
            onValueChange={(val) => {
              setShares(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("social_media_engagement.inputs.shares_placeholder")}
            startIcon={<Share2 className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("social_media_engagement.inputs.followers")}
          tooltip={t("social_media_engagement.inputs.followers_tooltip")}
        >
          <NumberInput
            value={followers}
            onValueChange={(val) => {
              setFollowers(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("social_media_engagement.inputs.followers_placeholder")}
            startIcon={<Users className="h-4 w-4" />}
            min={0}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("social_media_engagement.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("social_media_engagement.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("social_media_engagement.info.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("social_media_engagement.info.use_case_1")}</li>
              <li>{t("social_media_engagement.info.use_case_2")}</li>
              <li>{t("social_media_engagement.info.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const rating = result ? getEngagementRating(result.engagementRate) : null;

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("social_media_engagement.results.engagement_rate")}
        </div>
        <div className={`text-4xl font-bold mb-2 ${rating?.color}`}>
          {formatNumber(result.engagementRate)}%
        </div>
        <div className={`text-lg ${rating?.color}`}>
          {rating?.text}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("social_media_engagement.results.breakdown")}
        </h3>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <Percent className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("social_media_engagement.results.total_engagement")}</div>
          </div>
          <div className="text-2xl font-bold text-primary">{formatNumber(result.totalEngagement, 0)}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Heart className="w-5 h-5 text-red-500 ml-2" />
              <div className="font-medium">{t("social_media_engagement.results.likes")}</div>
            </div>
            <div className="text-xl font-bold">{formatNumber(result.likes, 0)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <MessageCircle className="w-5 h-5 text-blue-500 ml-2" />
              <div className="font-medium">{t("social_media_engagement.results.comments")}</div>
            </div>
            <div className="text-xl font-bold">{formatNumber(result.comments, 0)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Share2 className="w-5 h-5 text-green-500 ml-2" />
              <div className="font-medium">{t("social_media_engagement.results.shares")}</div>
            </div>
            <div className="text-xl font-bold">{formatNumber(result.shares, 0)}</div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <Users className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("social_media_engagement.results.followers")}</div>
          </div>
          <div className="text-2xl font-bold text-primary">{formatNumber(result.followers, 0)}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <TrendingUp className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("calculators.formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("social_media_engagement.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("social_media_engagement.title")}
      description={t("social_media_engagement.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}
