import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin';
import forms from '@tailwindcss/forms';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',     
        secondary: '#F59E0B',   
        neutral: '#1F2937',     
        light: '#F3F4F6',     
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['Fira Code', 'ui-monospace']
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    }
  },
  plugins: [
    forms,
    animate,
    plugin(({ addUtilities }) => {
      addUtilities({
        '.mask-fade-bottom': {
          maskImage: 'linear-gradient(white 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(white 80%, transparent)',
        },
      });
    }),
  ],
}
export default config