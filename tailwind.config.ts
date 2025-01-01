import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        '2xs': '160px',
      },
      keyframes: {
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        'expand': {
          '0%': { height: '0' },
          '100%': { height: '100%' },
        },
        'movedown': {
          '0&': { opacity: '0', translateY: '-30px' },
          '100%': { opacity: '1', translateY: '0px' },
        },
      },
      // animationName_easingFunction_durationInSeconds_iterationsCount_delayInSeconds_direction,
      animation: {
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'expand': 'expand 5s linear infinite forwards',
        'movedown': 'movedown 1s linear forwards',
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "animation-delay": (value) => {
            return {
              "animation-delay": value,
            };
          },
        },
        {
          values: theme("transitionDelay"),
        }
      );
    }),
  ],
  darkMode: 'class',
}
export default config
