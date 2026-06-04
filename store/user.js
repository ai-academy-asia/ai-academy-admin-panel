import {
  getters,
  mutations,
  state,
  actions as coreActions
} from 'eztech-core-components/store/user'

export { getters, mutations, state }

function applyInitState ({ commit, $cookies, query }) {
  const tokenName = process.env.TOKEN_NAME || null
  const projectId = process.env.PROJECT_ID
  const loginProps = process.env.LOGIN_PROPS
  const authType = process.env.AUTH_TYPE || 'cookie'
  if (authType === 'header') {
    commit('SET_AUTH_TYPE', 'header')
    const token = query[tokenName] || $cookies.get(tokenName)
    if (token) {
      commit('SET_TOKEN', token)
    }
  }
  commit('SET_LOGIN_PROPS', loginProps)
  commit('SET_TOKEN_NAME', tokenName)
  commit('SET_PROJECT_ID', projectId)
  const hideProfile = $cookies.get('HIDE_PROFILE')
  if (hideProfile) {
    commit('SET_HIDE_PROFILE', true)
  }
}

export const actions = {
  ...coreActions,
  async init (ctx, payload) {
    applyInitState({ ...ctx, ...payload })
    await coreActions.refresh_user.call(this, ctx)
  },
  async refresh_user (ctx) {
    try {
      await coreActions.refresh_user.call(this, ctx)
    } catch (err) {
      console.error('refresh_user', err)
      throw err
    }
  }
}
