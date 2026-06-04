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
      size-button="small"
      default-size="small"
      :width="formWidth"
      :config_group_fields="config_group_fields.filter(c => c.name !== 'ROLES')"
      :config_form_menus="config_form_menus"
      :ref-columns="refColumns"
      :searching="formSearching"
      :level="level"
      @temp-change="handleTempChange"
      @form-search="handleFormSearch"
    >
      <div slot="actions" class="w-full px-2 flex flex-row flex-wrap justify-end">
        <!-- <el-button
          v-if="hasPassword && isEdit && buttons.textRestorePassword"
          type="warning"
          icon="isax isax-key"
          :loading="restoringPassword"
          size="small"
          @click="handleRestorePassword"
        >
          {{ buttons.textRestorePassword }}
        </el-button> -->
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
          v-if="isEdit && buttons.textProfileDownload"
          icon="isax isax-document"
          :loading="downloadingProfile"
          size="small"
          @click="handleProfileDownload"
        >
          {{ buttons.textProfileDownload }}
        </el-button>
        <!-- <el-button
          v-if="!readOnly && isCreate && buttons.textCreate"
          type="primary"
          :loading="saving"
          size="small"
          icon="el-icon-check"
          @click="handleSave"
        >
          {{ buttons.textCreate }}
        </el-button>
        <el-button size="small" icon="isax isax-arrow-left" @click="handleClose">
          Буцах
        </el-button> -->
      </div>
    </core-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { tableData, tableMethods, tableComputed, tableWatch } from 'eztech-core-components/utils/table-helper'
import { safeGetAsyncData } from '~/utils/safe-get-async-data'
import { getButtons } from 'eztech-core-components/utils/role-helper'
export default {
  name: 'PageProfile',
  asyncData ({ $axios, error }) {
    return safeGetAsyncData({ $axios, error, projectId: '9', tableName: 'users' })
  },
  data () {
    return {
      title: 'Хэрэглэгчийн мэдээлэл',
      ...tableData
    }
  },
  head () {
    return {
      title: 'Хэрэглэгчийн мэдээлэл'
    }
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...tableComputed,
    id: {
      get () {
        return this.user?._id
      },
      set (val) {
        this.$log('profile set id', val)
      }
    },
    isEdit () {
      return !!this.id && this.id !== 'create'
    },
    isCreate () {
      return false
    },
    tableName () {
      return this.table.name
    },
    projectId () {
      return '9'
    },
    buttons () {
      return getButtons(this.level)
    }
  },
  watch: {
    ...tableWatch
  },
  mounted () {
    this.set_page_title(this.title)
    this.resetDefaultTemp()
    this.resetTemp()
  },
  destroyed () {
    this.set_page_title('')
  },
  methods: {
    ...mapActions('settings', ['set_page_title']),
    ...tableMethods
  }
}
</script>
