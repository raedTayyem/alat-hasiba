import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Coffee, ChevronDown } from '@/utils/icons';
import { LogoIcon } from './icons/LogoIcon';
import SearchAutocomplete from './ui/SearchAutocomplete';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t } = useTranslation(['common', 'navigation']);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm py-2' 
          : 'bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-8 shrink-0">
            <Link 
              to="/" 
              className="flex items-center gap-3 group" 
              aria-label={t('navigation.home')}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <LogoIcon className="w-9 h-9 text-foreground drop-shadow-sm" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label={t('navigation.mainMenu')}>
              <DesktopNavLink to="/categories" label={t('navigation.categories')} />
              <DesktopNavLink to="/most-used" label={t('navigation.mostUsed')} />
              <DesktopNavLink to="/about" label={t('navigation.aboutUs')} />
            </nav>
          </div>

          {/* Search Section - Centered */}
          <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-auto px-4">
            <div className="w-full">
              <SearchAutocomplete />
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Toggle - Always Visible */}
            <CompactLanguageToggle />

            <a
              href="https://buymeacoffee.com/erdasolutions"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 group"
            >
              <Coffee className="w-3.5 h-3.5 group-hover:animate-bounce" aria-hidden="true" />
              <span className="hidden xl:inline">{t('navigation.support')}</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2.5 hover:bg-muted rounded-xl transition-colors text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? t('navigation.closeMenu') : t('navigation.openMenu')}
            >
              {isMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Full Screen Menu Content */}
        <div
          className={`absolute inset-0 w-full h-full bg-background transform transition-all duration-300 ease-out flex flex-col ${
            isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogoIcon className="w-8 h-8 text-foreground" />
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-3 hover:bg-muted rounded-xl transition-colors"
              aria-label={t('navigation.closeMenu')}
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
            {/* Search Section */}
            <div className="mb-8">
              <SearchAutocomplete mobile />
            </div>

            {/* Main Navigation */}
            <nav className="flex flex-col gap-3 flex-1">
              <MobileNavLink to="/" label={t('navigation.home')} onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink to="/categories" label={t('navigation.categories')} onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink to="/most-used" label={t('navigation.mostUsed')} onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink to="/about" label={t('navigation.aboutUs')} onClick={() => setIsMenuOpen(false)} />
            </nav>

            {/* Footer Section */}
            <div className="mt-auto pt-8 border-t border-border space-y-6">
              {/* Footer Links */}
              <div className="flex justify-center gap-6">
                <Link
                  to="/privacy-policy"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navigation.privacyPolicy')}
                </Link>
                <Link
                  to="/terms-of-service"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navigation.termsOfService')}
                </Link>
              </div>

              {/* Support Button */}
              <a
                href="https://buymeacoffee.com/erdasolutions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-amber-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-transform text-base"
              >
                <Coffee className="w-5 h-5" aria-hidden="true" />
                {t('navigation.support')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const DesktopNavLink = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const isActive = (to === "/" && location.pathname === "/") || (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      {label}
    </Link>
  );
};

const MobileNavLink = ({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) => {
  const location = useLocation();
  const isActive = (to === "/" && location.pathname === "/") || (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-xl text-base font-bold transition-all ${
        isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-muted text-foreground'
      }`}
    >
      {label}
      {!isActive && <ChevronDown className="w-5 h-5 -rotate-90 rtl:rotate-90 text-muted-foreground" aria-hidden="true" />}
    </Link>
  );
};

const CompactLanguageToggle = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  return (
    <div className="flex items-center gap-1 bg-muted border border-border rounded-lg p-1">
      <button
        onClick={() => changeLanguage('ar')}
        className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
          i18n.language === 'ar'
            ? 'bg-primary text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
        }`}
        aria-label={t('language.ar')}
        aria-pressed={i18n.language === 'ar'}
      >
        <span className="sm:hidden">{t('language.arShort')}</span>
        <span className="hidden sm:inline">{t('language.arLabel')}</span>
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
          i18n.language === 'en'
            ? 'bg-primary text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
        }`}
        aria-label={t('language.en')}
        aria-pressed={i18n.language === 'en'}
      >
        <span className="sm:hidden">{t('language.enShort')}</span>
        <span className="hidden sm:inline">{t('language.enLabel')}</span>
      </button>
    </div>
  );
};

export default Header;
