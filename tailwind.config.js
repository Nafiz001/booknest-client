/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1754cf',
          light: '#3a73e0',
          dark: '#1448b3',
          muted: '#0f2f7a',
        },
        secondary: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          dark: '#020617',
        },
        accent: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
        'accent-green': '#10b981',
        'accent-yellow': '#f59e0b',
        'on-surface-secondary-light': '#475569',
        'on-surface-secondary-dark': '#94a3b8',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        background: {
          light: '#f6f6f8',
          dark: '#111621',
        },
        surface: {
          light: '#ffffff',
          dark: '#1a202e',
          elevated: '#232b3c',
        },
        border: {
          light: '#e2e8f0',
          dark: '#2d3748',
        },
        ink: {
          light: '#0f172a',
          dark: '#e2e8f0',
          mutedLight: '#64748b',
          mutedDark: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'card': '0 6px 20px -12px rgba(15, 23, 42, 0.25)',
        'card-hover': '0 22px 40px -24px rgba(23, 84, 207, 0.45)',
        'glass': '0 20px 60px -40px rgba(15, 23, 42, 0.6)',
        'focus': '0 0 0 4px rgba(23, 84, 207, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-right': 'slideRight 0.28s ease-out',
        'shimmer': 'shimmer 1.8s linear infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'radial-brand': 'radial-gradient(circle at 20% 20%, rgba(23,84,207,0.18), transparent 55%)',
        'mesh-dark': 'radial-gradient(circle at 10% 20%, rgba(23,84,207,0.25), transparent 45%), radial-gradient(circle at 90% 80%, rgba(56,189,248,0.12), transparent 40%)',
      },
    },
  },
  plugins: [],
}
