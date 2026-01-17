import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { ChevronRight, Coffee, Heart } from 'lucide-react';
import { LogoIcon } from './icons/LogoIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation(['translation', 'common']);

  // Popular categories to display in footer
  const popularCategories = [
    { slug: 'math', key: 'math' },
    { slug: 'finance', key: 'finance' },
    { slug: 'health', key: 'health' },
    { slug: 'converter', key: 'converter' }
  ];

  return (
    <footer className="bg-card border-t border-border pt-20 pb-10 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Logo and brief description */}
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl" aria-label={t('navigation.home')}>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <LogoIcon className="w-8 h-8 text-primary" aria-hidden="true" />
              </div>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary rounded-full"></span>
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/">{t('navigation.home')}</FooterLink>
              <FooterLink to="/categories">{t('navigation.categories')}</FooterLink>
              <FooterLink to="/most-used">{t('navigation.mostUsed')}</FooterLink>
              <FooterLink to="/about">{t('navigation.aboutUs')}</FooterLink>
              <li>
                <a
                  href="https://buymeacoffee.com/erdasolutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-all flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  <Coffee className="w-4 h-4 group-hover:animate-bounce" aria-hidden="true" />
                  <span>{t('navigation.support')}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Popular categories */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary rounded-full"></span>
              {t('footer.popularCategories')}
            </h3>
            <ul className="space-y-3">
              {popularCategories.map(category => (
                <FooterLink key={category.slug} to={`/category/${category.slug}`}>
                  {t(`categoryNames.${category.key}`)}
                </FooterLink>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground order-2 md:order-1">
            {t('footer.copyright', { year: currentYear })}
          </p>
          
          <div className="flex items-center gap-6 order-1 md:order-2">
            <Link to="/privacy-policy" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
              {t('navigation.privacyPolicy')}
            </Link>
            <Link to="/terms-of-service" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
              {t('navigation.termsOfService')}
            </Link>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground order-3">
            <Trans
              i18nKey="footer.madeWithLove"
              components={[<Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" aria-hidden="true" />]}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  return (
    <li>
      <Link to={to} className={`text-muted-foreground hover:text-primary transition-all flex items-center gap-1 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded ${isRtl ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>
        <ChevronRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-all ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
        {children}
      </Link>
    </li>
  );
};

export default Footer;