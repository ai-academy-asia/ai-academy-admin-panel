<template>
  <div class="flex flex-col-reverse items-center justify-start sm:flex-row sm:justify-center sm:items-start gap-4 overflow-hidden">
    <div>
      <scl-handbook :handbooks="selectedMenus" table-name="conscourt_handbooks" project-id="6" />
    </div>
    <div class="h-auto sm:h-full overflow-y-auto w-full md:w-52 rounded p-2 bg-white gap-2 flex flex-col">
      <div class="text-coreSecondaryText px-2 py-1 text-sm font-semibold flex items-center">
        <div class="flex-1">
          Цэс
        </div>
      </div>
      <!-- <el-input v-model="searchTitle" clearable placeholder="Хайх.." size="small" @keydown.native.enter="handleSearchDone" /> -->
      <div
        v-for="(col, index) in menus"
        :key="col.group_id?._id + index"
        replace
        :class="['flex flex-col gap-1 text-sm leading-4']"
      >
        <nuxt-link :to="{ query: { group_id: col.group_id?._id } }">
          <div
            :class="['flex gap-2 px-2 py-1 items-center cursor-pointer group hover:bg-coreBgMain hover:text-corePrimary rounded-lg', {
              'bg-coreBgMain text-corePrimary': (col.group_id || '') === group_id && !api_id,
              'text-coreRegularText': (col.group_id || '') === group_id && !api_id
            }]"
          >
            <div class="text-lg group-hover:text-corePrimary">
              <i class="isax isax-folder-2" />
            </div>
            <div class="flex-1 overflow-hidden">
              <div>{{ col.group_id?.title || 'Программын танилцуулга' }}</div>
            </div>
          </div>
        </nuxt-link>
        <nuxt-link
          v-for="(api, index1) in col.menus"
          :key="api.api_id?._id + index1"
          replace
          :to="{ query: { group_id: col.group_id?._id, api_id: api.api_id?._id } }"
          :class="['flex gap-2 px-2 py-1 cursor-pointer items-center hover:text-corePrimary group hover:bg-coreBgMain rounded-lg rounded', {
            'bg-coreBgMain text-corePrimary': (api.api_id?._id || '') === api_id,
            'text-coreRegularText': (api.api_id?._id || '') !== api_id
          }]"
        >
          <div class="text-lg group-hover:text-corePrimary">
            <i class="el-icon-check" />
          </div>
          <div class="flex-1 overflow-hidden">
            <div>{{ api.api_id?.title }}</div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  async asyncData ({ $axios }) {
    const { data: list } = await $axios.get('list/8/conscourt_handbooks')
    return { list }
  },
  data () {
    return {
      submenu: '',
      title: 'Гарын авлага',
      searchTitle: '',
      visible: true
    }
  },
  head () {
    return {
      title: this.title
    }
  },
  computed: {
    group_id () {
      return this.$route.query.group_id || ''
    },
    api_id () {
      return this.$route.query.api_id || ''
    },
    selectedMenus () {
      return this.list.filter(c => (c.group_id?._id || '') === this.group_id && (c.api_id?._id || '') === this.api_id)
    },
    menus () {
      const list = []
      for (const {
        group_id,
        api_id
      } of this.list) {
        const item = list.find(c => c.group_id?._id && c.group_id?._id === group_id?._id)
        if (item) {
          const menu = item.menus.find(c => c.api_id?._id && c.api_id?._id === api_id?._id)
          if (!menu) {
            item.menus.push({ api_id })
          }
        } else {
          const newItem = {
            group_id,
            menus: []
          }
          if (api_id?._id) {
            newItem.menus.push({ api_id })
          }
          list.push(newItem)
        }
      }
      return list
    }
  },
  mounted () {
    this.set_page_title(this.title)
  },
  destroyed () {
    this.set_page_title('')
  },
  methods: {
    ...mapActions('settings', ['set_page_title']),
    handleSearchDone () {
      // console.log('---')
    }
  }
}
</script>
