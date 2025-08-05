module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './node_modules/eztech-core-components/comps/**/*.{vue,js}'
  ],
  theme: {
    extend: {
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding'
      },
      backgroundPosition: {
        'top-4': 'left top -1rem'
      },
      colors: {
        corePrimary: '#8F5AFF',
        coreDanger: '#EC6B5E',
        coreWarning: '#E6A23C',
        corePrimaryText: '#303133',
        coreSecondaryText: '#909399',
        coreLightBorder: '#E4E7ED',
        coreBaseBorder: '#DCDFE6',
        coreBgHeader: '$F5F6FA',
        coreBgMain: '#F6F7FB',
        coreBgHover: '#F5F7FA',
        coreBgInput: '#f9fafb',
        coreInputBorder: '#d1d5db',
        coreBlue: '#409EFF',
        corePrimaryText: 'var(--foreground-primary)',
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      },
      fontFamily: {
        sans: [
          '"Helvetica Neue"',
          'Roboto',
          'sans-serif'
        ]
      }
    }
  }
}
