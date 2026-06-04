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
      :locales="locales"
      :locale.sync="locale"
      :selectable="tableName === 'service_ref_videos'"
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
      :unsaved-changes="unsavedChanges"
      @set-unsaved-changes="set_unsaved_changes"
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
        :service-name="tableName"
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
import { mapGetters } from 'vuex'
import { tableData, tableMethods, tableComputed, tableWatch } from 'eztech-core-components/utils/table-helper'
import { safeGetAsyncData } from '~/utils/safe-get-async-data'
export default {
  name: 'PageTable',
  asyncData (ctx) {
    const { params, $axios, error } = ctx
    return safeGetAsyncData({ $axios, error, projectId: '9', tableName: params.tableName })
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
        const query = { ...this.$route.query }
        if (val) {
          this.$router.push({ query: { ...query, id: val } })
        } else {
          delete query.id
          delete query.tid
          this.$router.push({ query: { ...query } })
        }
      }
    },
    tid: {
      get () {
        return this.$route.query.tid
      },
      set (val) {
        const query = { ...this.$route.query }
        if (val) {
          this.$router.push({ query: { ...query, tid: val } })
        } else {
          delete query.id
          delete query.tid
          this.$router.push({ query: { ...query } })
        }
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
  },
  methods: {
    ...tableMethods,
    handlePlayVideo () {
      this.videoId = this.currentRow?._id
    },
    handleDetail (row) {
      this.$router.push({
        name: 'systemCode-tableDetail-id',
        params: { tableDetail: this.tableName, id: row._id },
        query: { ...this.$route.query, tid: row.tid }
      })
    }
  }
}
</script>
