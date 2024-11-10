export default ({ $axios, store }) => {
  $axios.onRequest((config) => {
    if (store.getters.user_position_id) {
      $axios.defaults.headers.common.user_position_id = store.getters.user_position_id
    }
    return config
  })
}
