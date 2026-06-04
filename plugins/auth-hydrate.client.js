export default async ({ store, app, route }) => {
  try {
    if (!store.getters['user/tokenName']) {
      await store.dispatch('user/init', {
        $cookies: app.$cookies,
        query: route?.query || {},
        redirect: () => {}
      })
    } else if (!store.getters['user/user']) {
      await store.dispatch('user/refresh_user')
    }
    if (store.getters['user/user'] && !store.state.user_menus?.length) {
      await store.dispatch('refresh_user_menus')
    }
  } catch (err) {
    console.error('auth-hydrate', err)
  }
}
