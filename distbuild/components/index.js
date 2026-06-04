export const MenuItem = () => import('../../components/MenuItem.vue' /* webpackChunkName: "components/menu-item" */).then(c => wrapFunctional(c.default || c))
export const PdfDialog = () => import('../../components/PdfDialog.vue' /* webpackChunkName: "components/pdf-dialog" */).then(c => wrapFunctional(c.default || c))
export const RandomLogs = () => import('../../components/RandomLogs.vue' /* webpackChunkName: "components/random-logs" */).then(c => wrapFunctional(c.default || c))
export const SclCount = () => import('../../components/SclCount.vue' /* webpackChunkName: "components/scl-count" */).then(c => wrapFunctional(c.default || c))
export const SclNews = () => import('../../components/SclNews.vue' /* webpackChunkName: "components/scl-news" */).then(c => wrapFunctional(c.default || c))
export const SclVideo = () => import('../../components/SclVideo.vue' /* webpackChunkName: "components/scl-video" */).then(c => wrapFunctional(c.default || c))
export const SystemName = () => import('../../components/SystemName.vue' /* webpackChunkName: "components/system-name" */).then(c => wrapFunctional(c.default || c))

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
