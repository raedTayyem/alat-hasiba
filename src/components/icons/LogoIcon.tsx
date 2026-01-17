import { useTheme } from '../ThemeProvider';

interface LogoIconProps {
  className?: string;
  'aria-label'?: string;
}

export const LogoIcon = ({ className = "w-10 h-10", 'aria-label': ariaLabel = "Alathasiba Calculator" }: LogoIconProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // In light mode: dark background with white buttons
  // In dark mode: light background with dark buttons
  const buttonColor = isDark ? '#1f2937' : 'white';
  const buttonOpacity = isDark ? 1 : 0.3;
  const circleOpacity = isDark ? 0.9 : 1;
  const lastCircleOpacity = isDark ? 0.7 : 0.8;

  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <rect x="64" y="64" width="384" height="384" rx="64" fill="currentColor" />
      <rect
        x="112"
        y="112"
        width="288"
        height="112"
        rx="24"
        fill={buttonColor}
        fillOpacity={buttonOpacity}
      />
      <circle cx="160" cy="304" r="24" fill={buttonColor} fillOpacity={circleOpacity} />
      <circle cx="256" cy="304" r="24" fill={buttonColor} fillOpacity={circleOpacity} />
      <circle cx="352" cy="304" r="24" fill={buttonColor} fillOpacity={circleOpacity} />
      <circle cx="160" cy="384" r="24" fill={buttonColor} fillOpacity={circleOpacity} />
      <circle cx="256" cy="384" r="24" fill={buttonColor} fillOpacity={circleOpacity} />
      <circle cx="352" cy="384" r="24" fill={buttonColor} fillOpacity={lastCircleOpacity} />
    </svg>
  );
};
