import { join } from 'path'
import serveStatic from 'serve-static'
import { getDefaultConfig } from '../core-components/utils/default-nuxt-config'
const defaultConfig = getDefaultConfig()
export default {
  ...defaultConfig,
  serverMiddleware: [
    { path: '/ckeditor', handler: serveStatic(join(__dirname, '../core-components/ckeditor')) }
  ],
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | AI Academy',
    title: 'AI Academy',
    htmlAttrs: {
      lang: 'mn'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: 'ҮХЦ ӨМХ' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/../core-components/assets/css/index.css',
    '@/assets/css/index.css',
    '@/assets/css/stylesheet.css'
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    { path: '~/../core-components/comps', extensions: ['vue'], level: 0 },
    { path: '~/components', extensions: ['vue'], level: 1 }
  ],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/../core-components/plugins/element-ui',
    '@/../core-components/plugins/global-methods',
    '@/../core-components/plugins/axios',
    { src: '@/../core-components/plugins/dialog-draggable', mode: 'client' },
    { src: '@/../core-components/plugins/ckeditor.js', mode: 'client' }
  ],
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    ['@nuxtjs/moment', ['mn']]
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    'vue2-editor/nuxt',
    '@nuxtjs/proxy'
  ]
}
