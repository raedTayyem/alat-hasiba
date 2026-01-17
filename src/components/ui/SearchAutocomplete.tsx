import React, { useState, useEffect, useRef, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from './input';
import { getCalculators } from '../../data/calculators';
import { Calculator } from '../../data/calculators/types';
import { getCalculatorName, getCalculatorDescription } from '../../utils/calculatorTranslation';

interface SearchAutocompleteProps {
  placeholder?: string;
  maxSuggestions?: number;
  className?: string;
  mobile?: boolean;
  variant?: 'default' | 'hero';
}

export function SearchAutocomplete({
  placeholder,
  maxSuggestions = 5,
  className = "",
  mobile = false,
  variant = 'default'
}: SearchAutocompleteProps) {
  const { i18n, t } = useTranslation();
  const defaultPlaceholder = placeholder || t('common.searchPlaceholder');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Calculator[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const inputId = useId();

  // Generate unique option ID
  const getOptionId = (index: number) => `${listboxId}-option-${index}`;

  // Determine if listbox is expanded
  const isExpanded = showSuggestions && searchQuery.trim().length >= 2 && suggestions.length > 0;

  // Generate suggestions based on the current search query
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    // Show loading state
    setIsLoading(true);

    // Debounce search to reduce frequency of updates
    const timer = setTimeout(() => {
      const allCalculators = getCalculators();
      const normalizedQuery = searchQuery.toLowerCase().trim();

      // Calculate relevance score for each calculator
      const suggestionsWithScore = allCalculators
        .map(calculator => {
          const nameMatch = calculator.name.toLowerCase().includes(normalizedQuery);
          const descMatch = calculator.description.toLowerCase().includes(normalizedQuery);
          const slugMatch = calculator.slug.toLowerCase().includes(normalizedQuery);
          const nameEnMatch = calculator.nameEn ? calculator.nameEn.toLowerCase().includes(normalizedQuery) : false;
          const descEnMatch = calculator.descriptionEn ? calculator.descriptionEn.toLowerCase().includes(normalizedQuery) : false;

          let score = 0;
          if (nameMatch) score += 10; // Highest priority for name matches
          if (nameEnMatch) score += 10; // Same priority for English name matches
          if (descMatch) score += 5;  // Medium priority for description matches
          if (descEnMatch) score += 5;  // Same priority for English description matches
          if (slugMatch) score += 3;  // Lower priority for slug matches

          // Exact matches get higher score
          if (calculator.name.toLowerCase() === normalizedQuery) score += 50;
          if (calculator.nameEn && calculator.nameEn.toLowerCase() === normalizedQuery) score += 50;
          if (calculator.slug.toLowerCase() === normalizedQuery) score += 20;

          // Start-of-word matches get higher score
          if (calculator.name.toLowerCase().startsWith(normalizedQuery)) score += 15;
          if (calculator.nameEn && calculator.nameEn.toLowerCase().startsWith(normalizedQuery)) score += 15;

          return { calculator, score };
        })
        .filter(item => item.score > 0) // Only include matches
        .sort((a, b) => b.score - a.score) // Sort by score (highest first)
        .slice(0, maxSuggestions) // Take only the top suggestions
        .map(item => item.calculator); // Extract just the calculator objects

      setSuggestions(suggestionsWithScore);
      setIsLoading(false);
    }, 300); // Debounce time: 300ms

    return () => clearTimeout(timer);
  }, [searchQuery, maxSuggestions]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      if (inputRef.current) inputRef.current.blur(); // Hide keyboard on mobile
    }
  };

  // Handle selection of a suggestion
  const handleSelectSuggestion = (calculator: Calculator) => {
    navigate(`/calculator/${calculator.slug}`);
    setSearchQuery('');
    setShowSuggestions(false);
    if (inputRef.current) inputRef.current.blur(); // Hide keyboard on mobile
  };

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prevIndex =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prevIndex =>
          prevIndex > 0 ? prevIndex - 1 : -1
        );
        break;
      case 'Enter':
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          e.preventDefault();
          handleSelectSuggestion(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        if (inputRef.current) inputRef.current.blur();
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Highlight matched text in suggestion
  const highlightMatch = (text: string) => {
    if (!searchQuery.trim()) return text;

    const regex = new RegExp(`(${searchQuery.trim()})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ?
            <span key={i} className="bg-primary/20 text-primary font-bold rounded px-0.5">{part}</span> :
            <span key={i}>{part}</span>
        )}
      </>
    );
  };

  // Determine input sizing based on variant
  const inputSizeClass = variant === 'hero'
    ? 'py-3.5 text-lg'
    : mobile ? 'py-2.5' : 'py-3';

  // Box shadow and border styles based on variant  
  const boxStyles = variant === 'hero'
    ? 'shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus-within:ring-2 focus-within:ring-primary'
    : 'shadow border-border focus-within:border-primary';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div
          className={`flex items-center rounded-full transition-all overflow-hidden ${boxStyles} bg-background hover:border-primary/80 ${showSuggestions ? 'border-primary' : ''}`}
          aria-busy={isLoading}
        >
          <Input
            ref={inputRef}
            id={inputId}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className={`w-full border-0 ring-0 focus-visible:ring-0 rounded-full ${inputSizeClass} px-4 ps-12 rtl:ps-12 rtl:pe-4 shadow-none focus-visible:ring-offset-0`}
            placeholder={defaultPlaceholder}
            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
            autoComplete="off"
            role="combobox"
            aria-expanded={isExpanded}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-activedescendant={highlightedIndex >= 0 ? getOptionId(highlightedIndex) : undefined}
            aria-autocomplete="list"
          />
          <div className="absolute start-0 inset-y-0 flex items-center z-20">
            <button
              type="submit"
              className="h-full px-4 flex items-center transition-colors text-foreground-70 hover:text-primary"
              aria-label={t('common.search')}
            >
              {isLoading ? (
                <span role="status">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="sr-only">{t('search.searching')}</span>
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && searchQuery.trim().length >= 2 && (
        <div
          className="absolute z-50 mt-2 w-full bg-card shadow-xl rounded-lg border border-border overflow-hidden transition-all animate-in fade-in duration-200 slide-in-from-top-2"
          style={{ maxHeight: '80vh', overflowY: 'auto' }}
        >
          {suggestions.length > 0 ? (
            <ul
              id={listboxId}
              role="listbox"
              aria-label={t('search.suggestions')}
              className="py-1 divide-y divide-border/50"
            >
              {suggestions.map((calculator, index) => {
                const name = getCalculatorName(calculator, i18n.language);
                const description = getCalculatorDescription(calculator, i18n.language);
                const isHighlighted = index === highlightedIndex;

                return (
                  <li
                    key={calculator.id}
                    id={getOptionId(index)}
                    role="option"
                    aria-selected={isHighlighted}
                    onClick={() => handleSelectSuggestion(calculator)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-4 py-3 cursor-pointer transition-colors border-b border-border/50 last:border-0 ${isHighlighted
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-primary/5'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xl flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
                        {calculator.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium">{highlightMatch(name)}</div>
                        <div className="text-sm text-foreground-60 truncate">
                          {highlightMatch(description)}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-foreground-50" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 4.5l-7.5 7.5 7.5 7.5" />
                        </svg>
                      </div>
                    </div>
                  </li>
                );
              })}
              <li
                role="option"
                aria-selected={false}
                className="px-4 py-3 text-primary font-medium hover:bg-primary/5 cursor-pointer text-center transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleSearch(e as any);
                }}
              >
                {t('search.viewAllResults')} "{searchQuery}" <span className="inline-block ms-1" aria-hidden="true">→</span>
              </li>
            </ul>
          ) : (
            <div className="py-6 px-4 text-center text-foreground-70">
              {isLoading ? (
                <div className="flex flex-col items-center" role="status" aria-busy="true">
                  <svg className="animate-spin h-8 w-8 mb-3 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p>{t('search.searching')}</p>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-3 text-foreground-50">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <p>{t('search.noResults')}</p>
                  <p className="text-sm mt-1">{t('search.tryDifferent')}</p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchAutocomplete; 