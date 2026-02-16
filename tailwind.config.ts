import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors (Groundshunt theme)
        primary: {
          50: '#f5f6fa',
          100: '#ebecf5',
          200: '#c3c9f9',
          300: '#9baaf2',
          400: '#6b7ad7',
          500: '#4a5cc7',
          600: '#3a4db8',
          700: '#2e3f99',
          800: '#1A2238', // nav, buttons, accents
          900: '#111624',
          DEFAULT: '#1A2238',
          dark: '#111624',
          light: '#232B47',
        },
        accent: {
          DEFAULT: '#9DAAF2', // secondary, highlights
          light: '#C3C9F9',
          dark: '#6B7AD7',
        },
        background: {
          DEFAULT: '#F4F6FB', // main background
          dark: '#E5E9F2',
        },
        card: {
          DEFAULT: '#FFFFFF', // cards, modals
        },
        text: {
          DEFAULT: '#22223B', // main text
          muted: '#6B7280',
        },
        cta: {
          DEFAULT: '#FF6A3D', // call-to-action, highlights
        },
        // Sport Colors (keep for context, can be themed later)
        tabletennis: { DEFAULT: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
        football: { DEFAULT: '#2563eb', light: '#3b82f6', dark: '#1d4ed8' },
        basketball: { DEFAULT: '#ea580c', light: '#f97316', dark: '#c2410c' },
        badminton: { DEFAULT: '#7c3aed', light: '#8b5cf6', dark: '#6d28d9' },
        volleyball: { DEFAULT: '#dc2626', light: '#ef4444', dark: '#b91c1c' },
        // Status Colors
        live: '#FF6A3D',
        upcoming: '#9DAAF2',
        completed: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-live': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
