export const data = {
  loading: true
}
export const methods = {
  async getOneData ({ $axios, name, search }) {
    const { data } = await $axios.get(`one/5/${name}`, { params: { search } })
    return data
  },
  async getItemData ({ $axios, name, id }) {
    const { data } = await $axios.get(`5/${name}/${id}`)
    return data
  },
  async getItem () {
    const { data } = await this.$axios.get(`5/${this.name}/${this.id}`)
    this.item = data
  },
  resetItem () {
    this.item = null
  },
  async handleRefresh () {
    try {
      this.resetItem()
      this.loading = true
      await this.getItem()
    } catch (err) {
      this.$showError(err)
    } finally {
      this.loading = false
    }
  }
}
