/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Halloween theme
        halloween: {
          orange: '#FF6B35',
          purple: '#6B46C1',
          black: '#1F2937',
          gold: '#F59E0B',
        },
        // Christmas theme
        christmas: {
          red: '#DC2626',
          green: '#059669',
          gold: '#D97706',
          white: '#F9FAFB',
        },
        // Valentine's theme
        valentine: {
          pink: '#EC4899',
          red: '#DC2626',
          white: '#FFFFFF',
          purple: '#7C3AED',
        },
        // Easter theme
        easter: {
          pastelPink: '#F9A8D4',
          pastelBlue: '#93C5FD',
          pastelYellow: '#FDE68A',
          pastelGreen: '#86EFAC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
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
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};