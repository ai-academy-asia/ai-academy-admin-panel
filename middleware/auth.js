import auth from 'eztech-core-components/middleware/auth'

export default (ctx) => {
  const { store, $cookies, route } = ctx
  if (process.server && !store.getters['user/user']) {
    const tokenName = process.env.TOKEN_NAME || 'AI_TOKEN'
    const hasSession = $cookies.get(tokenName) || $cookies.get(`${tokenName}_REFRESH`)
    if (hasSession && route.name !== 'login') {
      return
    }
  }
  return auth(ctx)
}
