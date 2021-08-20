import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _e487bce2 = () => interopDefault(import('..\\pages\\auth\\login.vue' /* webpackChunkName: "pages/auth/login" */))
const _d3534e26 = () => interopDefault(import('..\\pages\\auth\\register.vue' /* webpackChunkName: "pages/auth/register" */))
const _6cd6ec75 = () => interopDefault(import('..\\pages\\auth\\reset.vue' /* webpackChunkName: "pages/auth/reset" */))
const _57007c43 = () => interopDefault(import('..\\pages\\auth\\verify.vue' /* webpackChunkName: "pages/auth/verify" */))
const _c68d1dc0 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'active-link',
  scrollBehavior,

  routes: [{
    path: "/auth/login",
    component: _e487bce2,
    name: "auth-login"
  }, {
    path: "/auth/register",
    component: _d3534e26,
    name: "auth-register"
  }, {
    path: "/auth/reset",
    component: _6cd6ec75,
    name: "auth-reset"
  }, {
    path: "/auth/verify",
    component: _57007c43,
    name: "auth-verify"
  }, {
    path: "/",
    component: _c68d1dc0,
    name: "index"
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
