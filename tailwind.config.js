/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Safelist dynamic classes that are constructed programmatically
    'animate-fadeIn',
    'animate-slideInRight',
    'animate-slideInLeft',
    'animate-scaleIn',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          5: 'rgba(var(--color-primary-rgb), 0.05)',
          10: 'rgba(var(--color-primary-rgb), 0.10)',
          20: 'rgba(var(--color-primary-rgb), 0.20)',
          30: 'rgba(var(--color-primary-rgb), 0.30)',
          40: 'rgba(var(--color-primary-rgb), 0.40)',
          50: 'rgba(var(--color-primary-rgb), 0.50)',
        },
        foreground: {
          DEFAULT: 'var(--color-foreground)',
          70: 'var(--color-foreground-70)',
          50: 'var(--color-foreground-50)',
          10: 'rgba(var(--color-foreground-rgb), 0.10)',
        },
        background: {
          DEFAULT: 'var(--color-background)',
          alternate: 'var(--color-background-alternate)',
        },
        card: 'var(--color-card)',
        border: 'var(--color-border)',
        error: {
          DEFAULT: 'var(--color-error)',
          5: 'rgba(var(--color-error-rgb), 0.05)',
          10: 'rgba(var(--color-error-rgb), 0.10)',
          20: 'rgba(var(--color-error-rgb), 0.20)',
          30: 'rgba(var(--color-error-rgb), 0.30)',
          90: 'rgba(var(--color-error-rgb), 0.90)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          5: 'rgba(var(--color-success-rgb), 0.05)',
          10: 'rgba(var(--color-success-rgb), 0.10)',
          20: 'rgba(var(--color-success-rgb), 0.20)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          5: 'rgba(var(--color-warning-rgb), 0.05)',
          10: 'rgba(var(--color-warning-rgb), 0.10)',
          20: 'rgba(var(--color-warning-rgb), 0.20)',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        accent: ['Tajawal', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: 'var(--color-foreground)',
            a: {
              color: 'var(--color-primary)',
              '&:hover': {
                color: 'var(--color-primary-hover)',
              },
            },
            h1: {
              color: 'var(--color-foreground)',
            },
            h2: {
              color: 'var(--color-foreground)',
            },
            h3: {
              color: 'var(--color-foreground)',
            },
            h4: {
              color: 'var(--color-foreground)',
            },
            strong: {
              color: 'var(--color-foreground)',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 