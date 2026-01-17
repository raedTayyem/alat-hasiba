import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import type { Calculator } from '../data/calculators';
import { getCategoryBySlug } from '../data/calculators';
import { getCalculatorName, getCalculatorDescription } from '../utils/calculatorTranslation';

interface CalculatorCardProps {
  calculator: Calculator;
  className?: string;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ calculator, className = '' }) => {
  const { t, i18n } = useTranslation();

  // Get the category name from the slug
  const category = getCategoryBySlug(calculator.category);
  const categoryName = category ? t(`categoryNames.${category.slug}`, { defaultValue: category.name }) : calculator.category;

  // Get localized calculator name and description
  const name = getCalculatorName(calculator, i18n.language);
  const description = getCalculatorDescription(calculator, i18n.language);

  return (
    <Link
      to={`/calculator/${calculator.slug}`}
      className={`group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${className}`}
    >
      {/* Icon with background gradient */}
      <div className="mb-5 relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl text-primary transform group-hover:scale-110 transition-transform duration-300">
          {calculator.icon}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          {name}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="inline-flex items-center text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            {categoryName}
          </span>
          
          <div className="flex items-center text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
            <span className="mr-1">{t('common.useNow')}</span>
            <ChevronRight className={`w-4 h-4 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CalculatorCard;