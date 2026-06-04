import { get } from 'lodash'

const setRedirect = ({ redirect, app, path, isReload }) => {
  if (process.client) {
    app.router.push(path)
    if (isReload) {
      localStorage.setItem('forensic_checkLogin', Date.now())
      location.reload()
    }
  } else {
    redirect(path)
  }
}

export default ({ $axios, query, store, $cookies, redirect, i18n, route, params, app }) => {
  const layout = route.matched[0]?.components.default.options.layout || 'default'
  $axios.onRequest((config) => {
    const tokenName = store.getters['user/tokenName']
    const authType = store.getters['user/authType']
    if (tokenName) {
      $axios.defaults.headers.common['x-pid'] = tokenName
    }
    if (authType === 'header') {
      $axios.defaults.headers.common['x-at'] = authType
      const userToken = store.getters['user/token']
      if (userToken) {
        $axios.defaults.headers.common.Autherization = `Bearer ${userToken}`
      }
    }
    $axios.defaults.headers.common['Accept-Language'] = query.lang || i18n?.locale || 'mn'
    return config
  })
  $axios.onError((error) => {
    if (process.server) {
      return
    }
    const noAuthPages = ['reg-checkObject', 'police-login', 'login']
    const status = get(error, 'response.status')
    if (status === 401 && layout?.startsWith('p')) {
      if (noAuthPages.includes(route.name)) {
        return
      }
      setRedirect({ redirect, app, path: '/police/login', isReload: true })
    } else if (status === 401 && route.name !== 'video-id') {
      store.dispatch('user/set_user', null)
      if (noAuthPages.includes(route.name)) {
        return
      }
      if (params.tableDetail === 'service_reg_forensics') {
        setRedirect({ redirect, app, path: { name: 'reg-checkObject', query: { id: params.id } } })
      } else {
        setRedirect({ redirect, app, path: '/login', isReload: true })
      }
    }
  })
}
