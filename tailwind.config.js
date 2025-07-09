/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          bg: '#ffffff',
          'bg-secondary': '#f8fafc',
          'bg-tertiary': '#f1f5f9',
          text: '#1e293b',
          'text-secondary': '#475569',
          'text-muted': '#64748b',
          border: '#e2e8f0',
          'border-secondary': '#cbd5e1',
        },
        // Dark mode colors
        dark: {
          bg: '#0d1117',
          'bg-secondary': '#161b22',
          'bg-tertiary': '#21262d',
          text: '#f0f6fc',
          'text-secondary': '#e6edf3',
          'text-muted': '#7d8590',
          border: '#30363d',
          'border-secondary': '#21262d',
        },
        // Brand colors that work in both themes
        brand: {
          primary: '#3b82f6',
          'primary-hover': '#2563eb',
          secondary: '#8b5cf6',
          'secondary-hover': '#7c3aed',
          accent: '#06b6d4',
          'accent-hover': '#0891b2',
          success: '#10b981',
          'success-hover': '#059669',
          warning: '#f59e0b',
          'warning-hover': '#d97706',
          error: '#ef4444',
          'error-hover': '#dc2626',
        }
      }
    },
  },
  plugins: [],
};
