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
        standard: [/cm|CodeMirror|splitpanes/],
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
      fontSize: {
        'inherit': 'inherit',
      },
      height: {
        'px': '1px',
      },
      lineHeight: {
        'inherit': 'inherit',
      },
      width: {
        'px': '1px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover', 'group-focus'],
      width: ['hover', 'focus'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
