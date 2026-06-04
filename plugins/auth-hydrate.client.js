export default async ({ store }) => {
  if (store.getters['user/user']) {
    if (!store.getters.user_menus?.length) {
      try {
        await store.dispatch('refresh_user_menus')
      } catch (_) {}
    }
    return
  }
  try {
    await store.dispatch('user/refresh_user')
    await store.dispatch('refresh_user_menus')
  } catch (_) {}
}
