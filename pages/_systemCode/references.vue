<template>
  <div class="h-full flex gap-4 overflow-hidden">
    <div class="h-full overflow-y-auto w-full md:w-52 rounded p-2 bg-white gap-2 flex flex-col">
      <div class="text-coreSecondaryText px-2 py-1 text-sm font-semibold flex items-center">
        <div class="flex-1">
          Цэс {{ tables.length }}
        </div>
        <el-switch v-model="isShowTableName" title="Хүснэгтийн нэр харах эсэх?" />
      </div>
      <el-input v-model="searchTitle" clearable placeholder="Хайх.." size="small" @keydown.native.enter="handleSearchDone" />
      <nuxt-link
        v-for="col in tables.filter((c) => !searchTitle || c.name.includes(searchTitle.toLowerCase()) || c.title.toLowerCase().includes(searchTitle.toLowerCase()))"
        :key="col.name"
        replace
        :to="{ query: { ...$route.query, submenu: col.name } }"
        :class="['flex gap-2 px-2 py-1 cursor-pointer items-center text-sm hover:text-corePrimary group hover:bg-coreBgMain rounded-lg leading-4', {
          'bg-coreBgMain text-corePrimary': col.name === submenu,
          'text-coreRegularText': col.name !== submenu
        }]"
      >
        <div class="text-lg group-hover:text-corePrimary">
          <i class="isax isax-folder-2" />
        </div>
        <div class="flex-1 overflow-hidden">
          <div>{{ col.title }}</div>
          <div v-if="isShowTableName" class="break-words text-xs font-bold">
            {{ col.name }}
          </div>
        </div>
      </nuxt-link>
    </div>
    <div class="flex-1 overflow-hidden">
      <transition name="el-fade-in-linear">
        <div v-if="visible" class="flex flex-col overflow-hidden h-full">
          <el-alert v-if="selectedTable?.description" :title="selectedTable?.description" type="info" show-icon :closable="false" />
          <core-form-table class="flex-1 overflow-hidden" :table_name="selectedTable?.name" :project-id="selectedTable?.project_id" api-name="references" />
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { get } from 'lodash'
export default {
  name: 'PageReferences',
  async asyncData ({ $axios, params }) {
    const { data } = await $axios.get('config/tables/refs/9', { params: { ...params } })
    return { tables: data.map(({ name, title, project_id, description }) => { return { name, title, project_id, description } }) }
  },
  data () {
    return {
      title: 'Лавлах сан',
      searchTitle: '',
      isShowTableName: false,
      visible: true
    }
  },
  head () {
    return {
      title: this.title,
    }
  },
  computed: {
    submenu () {
      return this.$route.query.submenu || get(this.tables, '[0].name')
    },
    selectedTable () {
      return this.tables.find(c => c.name === this.submenu)
    }
  },
  watch: {
    selectedTable (val) {
      this.set_page_title(val?.title)
      this.visible = false
      this.$nextTick(() => {
        this.visible = true
      })
    }
  },
  mounted () {
    this.set_page_title(this.selectedTable?.title)
  },
  destroyed () {
    this.set_page_title('')
  },
  methods: {
    ...mapActions('settings', ['set_page_title']),
    handleSearchDone () {
      const col = this.tables.find(c => !this.searchTitle || c.name.includes(this.searchTitle.toLowerCase()) || c.title.toLowerCase().includes(this.searchTitle.toLowerCase()))
      if (col) {
        this.$router.push({ query: { ...this.$route.query, submenu: col.name } })
      }
    }
  }
}
</script>
