<template>
  <div v-loading="loadingForm" class="flex flex-col items-center w-full pb-4">
    <core-form
      ref="coreForm"
      :temp-id="id"
      :temp="temp"
      :columns="columns"
      :rules="rules"
      :table="table"
      :pk_field_name="project.pk_field_name"
      :project-id="project._id"
      :has-password="hasPassword"
      :full-width="true"
      no-padding
      size-button="small"
      default-size="small"
      :width="formWidth"
      :config_group_fields="config_group_fields"
      :config_form_menus="config_form_menus"
      :ref-columns="refColumns"
      :searching="formSearching"
      :level="level"
      :locales="locales"
      @temp-change="handleTempChange"
      @form-search="handleFormSearch"
    >
      <div slot="actions" class="w-full px-2 flex flex-row flex-wrap justify-end">
        <el-button
          v-if="hasHandbook"
          icon="isax isax-book-1"
          plain
          size="small"
          @click="handbookApiId = api_id"
        >
          Гарын авлага
        </el-button>
        <el-button
          v-if="hasPassword && isEdit && buttons.textRestorePassword"
          type="warning"
          icon="isax isax-key"
          :loading="restoringPassword"
          size="small"
          @click="handleRestorePassword"
        >
          {{ buttons.textRestorePassword }}
        </el-button>
        <el-button
          v-if="!readOnly && isEdit && buttons.textDelete"
          type="danger"
          :disabled="restoringPassword"
          :loading="loading"
          size="small"
          icon="el-icon-delete"
          @click="() => handleDelete(temp)"
        >
          {{ buttons.textDelete }}
        </el-button>
        <el-button
          v-if="!readOnly && isEdit && buttons.textEdit"
          type="success"
          :disabled="restoringPassword"
          :loading="saving"
          size="small"
          icon="el-icon-check"
          @click="handleSave"
        >
          {{ buttons.textEdit }}
        </el-button>
        <el-button
          v-if="!readOnly && isCreate && buttons.textCreate"
          type="primary"
          :loading="saving"
          size="small"
          icon="el-icon-check"
          @click="handleSave"
        >
          {{ buttons.textCreate }}
        </el-button>
        <el-button
          v-if="isEdit && buttons.textProfileDownload"
          icon="isax isax-document"
          :loading="downloadingProfile"
          size="small"
          @click="handleProfileDownload"
        >
          {{ buttons.textProfileDownload }}
        </el-button>
        <el-button size="small" icon="isax isax-arrow-left" @click="handleClose">
          Буцах
        </el-button>
      </div>
    </core-form>
    <el-dialog
      :visible.sync="visibleHandbook"
      :title="`${api_title} гарын авлага`"
      width="220mm"
    >
      <scl-handbook :api_id="handbookApiId" />
      <div slot="footer">
        <el-button
          icon="el-icon-close"
          size="small"
          plain
          @click="handbookApiId = null"
        >
          Буцах
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { tableData, tableMethods, tableComputed, tableWatch, getAsyncData } from '@/../core-components/utils/table-helper'
import { getButtons } from '@/../core-components/utils/role-helper'
const serviceName = (tableName) => {
  let serviceName = tableName
  if (serviceName.startsWith('service_users')) {
    serviceName = 'service_employees'
  }
  return serviceName
}
export default {
  name: 'PageDetail',
  asyncData ({ params, $axios }) {
    return getAsyncData({ $axios, projectId: 9, tableName: serviceName(params.tableDetail) })
  },
  data () {
    return {
      ...tableData,
      handbookApiId: null
    }
  },
  head () {
    return {
      title: this.table.title
    }
  },
  computed: {
    ...tableComputed,
    visibleHandbook: {
      get () {
        return !!this.handbookApiId
      },
      set (val) {
        if (!val) {
          this.handbookApiId = null
        }
      }
    },
    isEdit () {
      return !!this.id && this.id !== 'create'
    },
    isCreate () {
      return this.id === 'create'
    },
    tableName () {
      return serviceName(this.$route.params.tableDetail)
    },
    projectId () {
      return 9
    },
    id: {
      get () {
        return this.$route.params.id
      },
      set (val) {
        this.$router.push({ params: { ...this.$route.params, id: val } })
      }
    },
    buttons () {
      return getButtons(this.level)
    }
  },
  watch: {
    ...tableWatch
  },
  mounted () {
    this.resetDefaultTemp()
    this.resetTemp()
  },
  methods: {
    ...tableMethods,
    handleClose () {
      const params = { ...this.$route.params }
      this.$router.push({
        path: `/${params.systemCode}/${params.tableDetail}`,
        // name: 'systemCode-tableName',
        // params: { systemCode: params.systemCode, tableName: params.tableDetail },
        query: { ...this.$route.query }
      })
    },
    handleSaved (row) {
      if (row._id !== this.id) {
        this.id = row._id
      }
      this.$showSuccess('Амжилттай хадгаллаа.')
    },
    handleDeleted () {
      this.handleClose()
    }
  }
}
</script>
