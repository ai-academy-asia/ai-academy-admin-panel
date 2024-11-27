<template>
  <div v-if="table" class="w-full h-full overflow-hidden flex gap-2">
    <core-table
      :project-id="projectId"
      :table_id="table._id"
      :list="list"
      :count="count"
      :columns="columns"
      :loading="loading"
      :sorts="sorts"
      :current-page="currentPage"
      :list-page="listPage"
      :search="search"
      :pk_field_name="project.pk_field_name"
      :current-row-id="id"
      :loading-excel="loadingExcel"
      :default-size="defaultSize"
      :size-button="defaultSize"
      :fill_field="table.fill_field"
      :level="level"
      :api_id="api_id"
      :api_title="api_title"
      is-detail
      :is-show-org-filter="isOrg && !visibleOrg"
      :locales="locales"
      :locale.sync="locale"
      :selectable="tableName === 'service_ref_videos'"
      @show-org-filter="set_visible_org(true)"
      @load="handleRefreshList"
      @excel="handleExcel"
      @create="handleCreate"
      @update="handleUpdate"
      @detail="handleDetail"
      @search-input="handleSearchInput"
      @search="handleSearch"
      @refresh="handleRefresh"
      @sort-change="handleSortChange"
      @size-change="handleChangeSize"
      @current-change="handleCurrentChange"
      @current-row-change="handleCurrentRowChange"
      @delete="handleDelete"
    >
      <div slot="table-actions">
        <el-button v-if="tableName === 'service_ref_videos'" :size="defaultSize" icon="el-icon-video-play" @click="handlePlayVideo">
          Тоглуулах
        </el-button>
      </div>
    </core-table>
    <core-form-dialog
      :temp="temp"
      :saving="saving"
      :restoring-password="restoringPassword"
      :pk_field_name="project.pk_field_name"
      :has-password="hasPassword"
      :default-size="defaultSize"
      :size-button="defaultSize"
      :width="formWidth"
      :level="level"
      @close="handleClose"
      @save="handleSave"
      @restore-password="handleRestorePassword"
    >
      <core-form
        ref="coreForm"
        :temp-id="id"
        :temp="temp"
        :columns="columns"
        :rules="rules"
        :table="table"
        :loading-form="loadingForm"
        :pk_field_name="project.pk_field_name"
        :project-id="project._id"
        :has-password="hasPassword"
        :default-size="defaultSize"
        :searching="formSearching"
        :locales="locales"
        :level="level"
        width="100%"
        :config_group_fields="config_group_fields"
        :config_form_menus="config_form_menus"
        :ref-columns="refColumns"
        @form-search="handleFormSearch"
        @temp-change="handleTempChange"
        @locale-change="handleLocaleChange"
      />
    </core-form-dialog>
    <el-dialog title="Видео турших" :visible.sync="visibleVideo" width="600px">
      <scl-video v-if="visibleVideo" :id="videoId" />
      <div slot="footer" class="flex items-center justify-between">
        <div class="text-sm font-medium">
          {{ currentRow?.name }}
        </div>
        <el-button icon="el-icon-close" :size="defaultSize" @click="visibleVideo=false">
          Хаах
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { set, get } from 'lodash'
import { tableData, tableMethods, tableComputed, tableWatch, getAsyncData } from '@/../core-components/utils/table-helper'
export default {
  name: 'PageTable',
  asyncData ({ params, $axios }) {
    return getAsyncData({ $axios, projectId: 9, tableName: params.tableName })
  },
  data () {
    return {
      ...tableData,
      orgId: null,
      defaultSize: 'small',
      orgIds: [],
      selectedMenu: null,
      videoId: null
    }
  },
  head () {
    return {
      title: this.api_title || this.table.title
    }
  },
  computed: {
    ...tableComputed,
    ...mapGetters('user', ['user']),
    ...mapGetters(['visibleOrg']),
    currentPage: {
      get () {
        return this.$route.query.page ? Number(this.$route.query.page) : 1
      },
      set (page) {
        this.$router.push({ query: { ...this.$route.query, page } })
      }
    },
    tableName () {
      return this.$route.params.tableName
    },
    projectId () {
      return 9
    },
    id: {
      get () {
        return this.$route.query.id
      },
      set (val) {
        this.$router.push({ query: { ...this.$route.query, id: val } })
      }
    },
    sp: {
      get () {
        return this.$route.params.tableName
      },
      set (val) {
        this.$router.push({ params: { tableName: val } })
      }
    },
    isOrg () {
      return ['hrm_organizations', 'hrm_positions', 'hrm_users'].includes(this.table.name)
    },
    visibleVideo: {
      get () {
        return !!this.videoId
      },
      set () {
        this.videoId = null
      }
    }
  },
  watch: {
    ...tableWatch
  },
  mounted () {
    this.resetDefaultTemp()
    this.resetSearch()
    // this.handleRefreshList()
  },
  methods: {
    ...mapActions(['set_visible_org']),
    ...tableMethods,
    handlePlayVideo () {
      this.videoId = this.currentRow?._id
    },
    isCheckDetail () {
      const menus = ['service_users', 'service_employees']
      return menus.some(c => this.tableName.startsWith(c))
    },
    handleDetail (row) {
      if (this.tableName.startsWith('service_users')) {
        const id = get(row, 'employee_id._id')
        this.$router.push({
          name: 'systemCode-tableDetail-id',
          params: { tableDetail: this.tableName, id: row._id === 'create' ? 'create' : id },
          query: { ...this.$route.query, submenu: 'POSITION' }
        })
      } else {
        this.$router.push({
          name: 'systemCode-tableDetail-id',
          params: { tableDetail: this.tableName, id: row._id },
          query: { ...this.$route.query }
        })
      }
    },
    beforeGetList () {
      if (this.isOrg && this.visibleOrg) {
        if (this.orgIds && this.orgIds.length > 0) {
          if (this.table.name === 'hrm_organizations') {
            set(this.search, '$and.parent_id', { val: this.orgIds, t: 'number', op: 'in' })
          } else {
            set(this.search, '$and.organization_id', { val: this.orgIds, t: 'number', op: 'in' })
          }
        } else {
          set(this.search, '$and.organization_id', { val: null, t: 'number', op: 'in' })
        }
      }
    },
    handleSelectOrg (item) {
      const index = this.orgIds.indexOf(item._id)
      if (index > -1) {
        this.orgIds.splice(index, 1)
      } else {
        this.orgIds.push(item._id)
      }
      this.handleRefresh()
    }
    // async beforeFormSearch () {
    //   try {
    //   } catch (err) {
    //     this.$showError(err)
    //   }
    // }
  }
}
</script>
