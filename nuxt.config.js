import { join } from 'path'
import serveStatic from 'serve-static'
import { getDefaultConfig } from 'eztech-core-components/utils/default-nuxt-config'
const defaultConfig = getDefaultConfig()
const adminHeaders = require('./server-middleware/admin-headers')
const ckeditorStatic = serveStatic(join(__dirname, 'node_modules/eztech-core-components/ckeditor'))
const routerBase = (process.env.ROUTER_BASE || '/manage/').replace(/\/$/, '')
const ckeditorPaths = ['/ckeditor']
if (routerBase && routerBase !== '') {
  ckeditorPaths.push(`${routerBase}/ckeditor`)
}
const adminCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'"
].join('; ')
export default {
  ...defaultConfig,
  env: {
    ROUTER_BASE: process.env.ROUTER_BASE || '/manage/'
  },
  buildDir: process.env.BUILD_DIR || 'distbuild',
  serverMiddleware: [
    adminHeaders,
    ...ckeditorPaths.map(path => ({ path, handler: ckeditorStatic }))
  ],
  render: {
    ...defaultConfig.render,
    static: {
      setHeaders (res) {
        res.setHeader('X-XSS-Protection', '1; mode=block')
        res.setHeader('Referrer-Policy', 'no-referrer')
        res.setHeader('X-Frame-Options', 'DENY')
        res.setHeader('Content-Security-Policy', adminCsp)
      }
    }
  },
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
    'eztech-core-components/assets/css/index.css',
    '@/assets/css/index.css',
    '@/assets/css/stylesheet.css'
  ],
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    { path: '~/components', extensions: ['vue'], level: 1 }
  ],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/eztech-core-components',
    '@/plugins/element-ui',
    '@/plugins/global-methods',
    '@/plugins/auth-hydrate.client',
    { src: '@/plugins/dialog-draggable', mode: 'client' },
    { src: '@/plugins/ckeditor', mode: 'client' },
    'node_modules/eztech-core-components/plugins/global-prototype',
    '@/plugins/axios',
    { src: 'node_modules/eztech-core-components/plugins/chart.js' }
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
