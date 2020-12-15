const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    mode: 'all',
    content: [
      './public/*.html',
      './src/*.js',
      './src/**/*.js',
      './src/**/*.vue',
      './src/css/codemirror/*',
    ],
    options: {
      safelist: {
        standard: [/cm|CodeMirror/],
      },
    },
  },
  darkMode: false,
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        orange: colors.orange,
      },
      cursor: {
        'col-resize': 'col-resize',
        'row-resize': 'row-resize',
      },
      fontFamily: {
        mono: ['Fira Code', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      height: {
        'px': '1px',
      },
      width: {
        'px': '1px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
