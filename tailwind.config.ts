import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#E8007D',
          'pink-light': '#F5A0CE',
          'pink-pale': '#FDF0F7',
          green: '#2D7A3A',
          'green-light': '#A8D5AF',
          'green-pale': '#EEF7F0',
        },
        charcoal: {
          DEFAULT: '#3D3D3D',
          muted: '#6B6B6B',
          light: '#F5F5F5',
        },
        warm: {
          white: '#FAFAFA',
          cream: '#F7F3EF',
        },
        surface: {
          dark: '#1E1E1E',
        },
      },
      fontFamily: {
        lora: ['Lora', 'serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
}

export default config
