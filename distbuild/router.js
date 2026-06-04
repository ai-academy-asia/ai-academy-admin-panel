import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _28d839f2 = () => interopDefault(import('../pages/changePassword.vue' /* webpackChunkName: "pages/changePassword" */))
const _043c82a2 = () => interopDefault(import('../pages/handbooks.vue' /* webpackChunkName: "pages/handbooks" */))
const _2e95257d = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _4de2de86 = () => interopDefault(import('../pages/profile.vue' /* webpackChunkName: "pages/profile" */))
const _64ed8266 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _b2fd408c = () => interopDefault(import('../pages/video/_id.vue' /* webpackChunkName: "pages/video/_id" */))
const _c1445250 = () => interopDefault(import('../pages/_systemCode/references.vue' /* webpackChunkName: "pages/_systemCode/references" */))
const _44b49d6c = () => interopDefault(import('../pages/_systemCode/_tableName.vue' /* webpackChunkName: "pages/_systemCode/_tableName" */))
const _2722d3fb = () => interopDefault(import('../pages/_systemCode/_tableDetail/_id.vue' /* webpackChunkName: "pages/_systemCode/_tableDetail/_id" */))
const _a200c576 = () => interopDefault(import('../pages/_systemCode/_tableDetail/_id/_sub.vue' /* webpackChunkName: "pages/_systemCode/_tableDetail/_id/_sub" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/manage/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/changePassword",
    component: _28d839f2,
    name: "changePassword"
  }, {
    path: "/handbooks",
    component: _043c82a2,
    name: "handbooks"
  }, {
    path: "/login",
    component: _2e95257d,
    name: "login"
  }, {
    path: "/profile",
    component: _4de2de86,
    name: "profile"
  }, {
    path: "/",
    component: _64ed8266,
    name: "index"
  }, {
    path: "/video/:id?",
    component: _b2fd408c,
    name: "video-id"
  }, {
    path: "/:systemCode/references",
    component: _c1445250,
    name: "systemCode-references"
  }, {
    path: "/:systemCode/:tableName?",
    component: _44b49d6c,
    name: "systemCode-tableName"
  }, {
    path: "/:systemCode/:tableDetail?/:id?",
    component: _2722d3fb,
    name: "systemCode-tableDetail-id",
    children: [{
      path: ":sub?",
      component: _a200c576,
      name: "systemCode-tableDetail-id-sub"
    }]
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
