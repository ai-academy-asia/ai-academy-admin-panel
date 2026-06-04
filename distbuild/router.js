import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _3c093f42 = () => interopDefault(import('../pages/changePassword.vue' /* webpackChunkName: "pages/changePassword" */))
const _9a316b52 = () => interopDefault(import('../pages/handbooks.vue' /* webpackChunkName: "pages/handbooks" */))
const _8f7a75b6 = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _a45a3336 = () => interopDefault(import('../pages/profile.vue' /* webpackChunkName: "pages/profile" */))
const _22c9bbe4 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _5b86eb62 = () => interopDefault(import('../pages/video/_id.vue' /* webpackChunkName: "pages/video/_id" */))
const _bf0307a0 = () => interopDefault(import('../pages/_systemCode/references.vue' /* webpackChunkName: "pages/_systemCode/references" */))
const _427352bc = () => interopDefault(import('../pages/_systemCode/_tableName.vue' /* webpackChunkName: "pages/_systemCode/_tableName" */))
const _63981753 = () => interopDefault(import('../pages/_systemCode/_tableDetail/_id.vue' /* webpackChunkName: "pages/_systemCode/_tableDetail/_id" */))
const _42f29e26 = () => interopDefault(import('../pages/_systemCode/_tableDetail/_id/_sub.vue' /* webpackChunkName: "pages/_systemCode/_tableDetail/_id/_sub" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/changePassword",
    component: _3c093f42,
    name: "changePassword"
  }, {
    path: "/handbooks",
    component: _9a316b52,
    name: "handbooks"
  }, {
    path: "/login",
    component: _8f7a75b6,
    name: "login"
  }, {
    path: "/profile",
    component: _a45a3336,
    name: "profile"
  }, {
    path: "/",
    component: _22c9bbe4,
    name: "index"
  }, {
    path: "/video/:id?",
    component: _5b86eb62,
    name: "video-id"
  }, {
    path: "/:systemCode/references",
    component: _bf0307a0,
    name: "systemCode-references"
  }, {
    path: "/:systemCode/:tableName?",
    component: _427352bc,
    name: "systemCode-tableName"
  }, {
    path: "/:systemCode/:tableDetail?/:id?",
    component: _63981753,
    name: "systemCode-tableDetail-id",
    children: [{
      path: ":sub?",
      component: _42f29e26,
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
