<template>
  <div v-if="table" class="w-full overflow-x-hidden">
    <core-table
      :list="list"
      :count="count"
      :columns="columns"
      :loading="loading"
      :sorts="sorts"
      :page-size="pageSize"
      :current-page="currentPage"
      :list-page="listPage"
      :search="search"
      :pk_field_name="project.pk_field_name"
      :sub-column="subColumn"
      size-button="mini"
      :current-row-id="currentRowId"
      :loading-excel="loadingExcel"
      :locales="locales"
      @excel="handleExcel"
      @create="handleCreate"
      @update="handleUpdate"
      @detail="handleUpdate"
      @search-input="handleSearchInput"
      @search="handleSearch"
      @refresh="handleRefresh"
      @sort-change="handleSortChange"
      @size-change="handleChangeSize"
      @current-change="handleCurrentChange"
      @current-row-change="handleCurrentRowChange"
      @delete="handleDelete"
    />
    <core-form-dialog
      :temp="temp"
      :saving="saving"
      :pk_field_name="project.pk_field_name"
      :has-password="hasPassword"
      :loading-form="loadingForm"
      @restore-password="handleRestorePassword"
      @close="handleClose"
      @save="handleSave"
    >
      <core-form
        ref="coreForm"
        :temp="temp"
        :columns="columns"
        :rules="rules"
        :table="table"
        :pk_field_name="project.pk_field_name"
        :has-password="hasPassword"
        :project-id="project._id"
        @temp-change="handleTempChange"
      />
    </core-form-dialog>
  </div>
</template>
<script>
import { tableData, tableMethods, tableComputed, tableWatch, getAsyncData } from 'eztech-core-components/utils/table-helper'
export default {
  name: 'PageSubTable',
  asyncData ({ params, $axios }) {
    if (!params.sub) {
      return {}
    }
    return getAsyncData({
      $axios,
      projectId: 9,
      tableName: params.tableDetail,
      id: params.id,
      sub: params.sub
    })
  },
  data () {
    return {
      ...tableData
    }
  },
  computed: {
    ...tableComputed
  },
  watch: {
    ...tableWatch
  },
  mounted () {
    this.resetSearch()
    this.resetDefaultTemp()
    this.handleRefreshList()
    this.resetTemp()
  },
  methods: {
    ...tableMethods
  }
}
</script>
