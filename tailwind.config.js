import { borderRadius, colors, fontSize, fontWeight, spacing } from '@/styles';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ...colors,
      },
      spacing: {
        ...spacing,
      },
      fontSize: {
        ...fontSize,
      },
      fontWeight: {
        ...fontWeight,
      },
      borderRadius: {
        ...borderRadius,
      },
    },
  },
  plugins: [],
};
