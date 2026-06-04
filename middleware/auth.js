import auth from 'eztech-core-components/middleware/auth'

function hasSessionCookie (ctx) {
  const tokenName = process.env.TOKEN_NAME || 'AI_TOKEN'
  const fromStore = ctx.$cookies.get(tokenName) || ctx.$cookies.get(`${tokenName}_REFRESH`)
  if (fromStore) {
    return true
  }
  const raw = ctx.req?.headers?.cookie || ''
  return raw.includes(`${tokenName}=`) || raw.includes(`${tokenName}_REFRESH=`)
}

export default async (ctx) => {
  const { store, route } = ctx
  if (process.server && !store.getters['user/user'] && hasSessionCookie(ctx) && route.name !== 'login') {
    try {
      await store.dispatch('user/refresh_user')
    } catch (err) {
      console.error('auth middleware refresh_user', err?.response?.status || err?.message || err)
    }
  }
  return auth(ctx)
}
