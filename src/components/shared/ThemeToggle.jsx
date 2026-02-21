import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '', iconClassName = 'h-5 w-5', label = true }) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 ${className}`}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
    >
      {isLight ? <Moon className={iconClassName} /> : <Sun className={iconClassName} />}
      {label && <span className="hidden sm:inline">{isLight ? 'Dark' : 'Light'}</span>}
    </button>
  );
};

export default ThemeToggle;
