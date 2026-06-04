import { get } from 'lodash'
const defaultMenu = { group_id: '11', group_name: '/', group_title: 'Хянах', group_icon: 'isax isax-home-2', apis: [{ api_id: '50', api_name: '', api_title: 'Хянах', api_icon: '' }] }
export const state = () => ({
  user_position_id: null,
  user_position: null,
  user_positions: [],
  user_menus: [],
  visibleOrg: true,
  pdfUrl: null
})
export const getters = {
  user_position_id (state) { return state.user_position_id },
  user_positions (state) { return state.user_positions },
  user_position (state) { return state.user_position },
  user_menus (state) { return state.user_menus?.length ? state.user_menus : [defaultMenu] },
  visibleOrg (state) { return state.visibleOrg },
  pdfUrl (state) { return state.pdfUrl }
}
export const mutations = {
  SET_USER_POSITIONS (state, data) {
    state.user_positions = data
    if (state.user_position_id && state.user_positions.some(c => c._id === state.user_position_id)) {
      state.user_position = state.user_positions.find(c => c._id === state.user_position_id)
      state.user_position_id = get(state.user_position, '_id')
    } else {
      state.user_position = get(state.user_positions, '[0]')
      state.user_position_id = get(state.user_positions, '[0]._id')
    }
  },
  SET_USER_POSITION (state, data) {
    state.user_position = data
    state.user_position_id = data._id
  },
  SET_USER_POSITION_ID (state, _id) {
    state.user_position_id = _id
  },
  SET_USER_MENUS (state, data) {
    state.user_menus = data
  },
  SET_VISIBLE_ORG (state, data) {
    state.visibleOrg = data
  },
  SET_PDF_URL (state, data) {
    state.pdfUrl = data
  }
}
export const actions = {
  async nuxtServerInit ({ dispatch, commit }, { $cookies, query, redirect, route }) {
    try {
      await dispatch('settings/init', { $cookies, query, redirect })
    } catch (err) {
      console.error('nuxtServerInit settings', err)
    }
    if (route.name === 'video') {
      return
    }
    try {
      await dispatch('user/init', { $cookies, query, redirect })
    } catch (err) {
      console.error('nuxtServerInit user', err)
    }
    if (process.server) {
      return
    }
    try {
      await dispatch('refresh_user_menus')
    } catch (err) {
      console.error('nuxtServerInit menus', err)
    }
    try {
      const visibleOrg = this.$cookies.get('SET_VISIBLE_ORG', { path: '/' })
      commit('SET_VISIBLE_ORG', visibleOrg !== 'HIDDEN')
    } catch (_) {}
  },
  set_pdf_url ({ commit }, data) {
    commit('SET_PDF_URL', data)
  },
  set_visible_org ({ commit }, data) {
    this.$cookies.set('SET_VISIBLE_ORG', data ? 'VISIBLE' : 'HIDDEN', { path: '/' })
    commit('SET_VISIBLE_ORG', data)
  },
  async refresh_user_menus ({ commit, getters }) {
    if (!getters['user/user']) {
      return
    }
    try {
      const { data } = await this.$axios.get('config/user/menus')
      commit('SET_USER_MENUS', data)
    } catch (err) {
      console.error('refresh_user_menus', err)
    }
  }
}
