/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#112847',
          dark: '#0a1a2e',
          deep: '#070f1c',
          light: '#1a3a5c',
        },
        gold: {
          DEFAULT: '#dfab70',
          dark: '#906130',
          light: '#f0c990',
          bright: '#e8c080',
        },
        blue: {
          soft: '#5e779a',
        },
      },
      fontFamily: {
        arabic: ['Alilato', 'Cairo', 'Amiri', 'serif'],
        latin: ['Cinzel', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #906130 0%, #dfab70 50%, #906130 100%)',
        'navy-gradient': 'linear-gradient(135deg, #070f1c 0%, #112847 100%)',
        'cinematic': 'radial-gradient(ellipse at top, #1a3a5c 0%, #112847 40%, #070f1c 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'particle': 'particle 8s linear infinite',
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(223,171,112,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(223,171,112,0.6)' },
        },
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'gold': '0 0 30px rgba(223,171,112,0.3)',
        'gold-lg': '0 0 60px rgba(223,171,112,0.4)',
        'navy': '0 20px 60px rgba(7,15,28,0.8)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
