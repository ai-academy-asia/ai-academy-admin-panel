<template>
  <div class="w-full">
    <el-form ref="form" :model="search" label-position="top" size="mini" class="flex gap-4 items-end justify-start">
      <el-form-item label="Санамсаргүй хуваарилсан эсэх?">
        <el-select
          v-model="search.is_random"
          placeholder="Бүгд"
        >
          <el-option :value="null" label="Бүгд" />
          <el-option :value="true" label="Санамсаргүй" />
          <el-option :value="false" label="Гараар" />
        </el-select>
      </el-form-item>
      <el-form-item label="Төлөв өөрчилсөн огноо">
        <el-date-picker
          v-model="search.doc_date"
          type="daterange"
          range-separator="-"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="Эхлэх"
          end-placeholder="Дуусах"
          clearable
        />
      </el-form-item>
      <el-form-item v-if="!reg_id" label="Дугаар">
        <el-input v-model="search.reg_num" clearable />
      </el-form-item>
    </el-form>
    <div class="pb-4 w-full text-right">
      <el-button size="mini" type="primary" plain icon="el-icon-search" :loading="loading" @click="handleSearch">
        Хайх
      </el-button>
      <el-button size="mini" icon="el-icon-close" @click="handleClear">
        Цэвэрлэх
      </el-button>
    </div>
    <table v-loading="loading" class="w-full border-collapse border border-slate-200 text-sm">
      <colgroup>
        <col v-for="col in columns" :key="col.key" :width="col.width">
      </colgroup>
      <thead class=" bg-gray-100">
        <tr>
          <th colspan="4" class="border border-slate-200 px-1 py-1">
            Төлөв өөрчлөх бүртгэл
          </th>
          <th colspan="4" class="border border-slate-200 px-1 py-1">
            Бүртгэлийн мэдээлэл
          </th>
        </tr>
        <tr>
          <th v-for="col in columns.filter(c => c.title)" :key="col.key" class="border border-slate-200 px-1 py-1 text-xs">
            {{ col.short || col.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item) in list">
          <tr :key="item._id">
            <td v-for="col in columns" :key="col.key" :class="['border border-slate-200 px-2 py-1', { 'text-coreSecondaryText text-xs': col.isSecondary }]" :align="col.align" :rowspan="col.isRowspan && item.members?.length ? '2' : '1'">
              {{ get(item, col.key) }}
              <a v-if="col.isRowspan && item.file" :href="'/api/file/' + item.file" target="_blank" class="underline py-1 w-full text-center">Хавсралт файл</a>
              <div v-if="col.isRowspan && item.reg_status_id.code.startsWith('PROCESS') && item.members?.length" class="text-center">
                <boolean-label class="mt-1" :value="item.is_random" :label="item.is_random ? 'Санамсаргүй' : 'Гараар'" />
                <el-button type="text" icon="el-icon-print" :loading="printing.includes(item._id)" @click="handlePrint(item)">
                  Хэвлэх
                </el-button>
              </div>
            </td>
          </tr>
          <tr v-if="item.members?.length" :key="item._id + 'member'">
            <td colspan="6" class="px-2 py-2">
              <div class="flex flex-col gap-2">
                <div v-for="role in item.conscourt_roles" :key="role._id" class="flex flex-col gap-4 pb-2 last:pb-0 border-b last:border-none">
                  <div class="flex flex-wrap gap-y-1 gap-x-2">
                    <div class="font-medium text-green-600">
                      <i class="el-icon-circle-check" /> {{ role.name }}
                    </div>
                    <div v-for="member in item.members.filter(c => c.is_selected && c.conscourt_role_id._id === role._id)" :key="member._id + '-' + role._id" class="border rounded px-2 text-sm bg-gray-50 text-sm">
                      <span>{{ member.member_id.surname.slice(0, 1) + '.' + member.member_id.given_name }}</span>
                      <span class="text-coreSecondaryText text-xs">({{ member.description }})</span>
                    </div>
                  </div>
                  <div v-if="item.members.some(c => !c.is_selected && c.conscourt_role_id._id === role._id)" class="flex flex-wrap gap-y-1 gap-x-2">
                    <div class="font-medium text-red-400">
                      <i class="el-icon-circle-close" /> {{ role.name }}
                    </div>
                    <div v-for="member in item.members.filter(c => !c.is_selected && c.conscourt_role_id._id === role._id)" :key="member._id+ '-' + role._id" class="border rounded px-2 text-sm bg-gray-50 text-sm">
                      <span>{{ member.member_id.surname.slice(0, 1) + '.' + member.member_id.given_name }}</span>
                      <span class="text-coreSecondaryText  text-xs">({{ member.description }})</span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="w-full text-center pt-4">
      <el-button v-if="list.length >= count" icon="el-icon-check" disabled>
        Нийт: ({{ count }})
      </el-button>
      <el-button v-else icon="el-icon-arrow-down" :loading="loadingMore" @click="handleMore">
        Цааш үзэх ({{ list.length }}/{{ count }})
      </el-button>
    </div>
  </div>
</template>
<script>
import { get } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'RandomLogs',
  props: { reg_id: { type: String, default: null } },
  data () {
    return {
      search: { reg_num: '', doc_date: ['', ''], is_random: null, reg_id: null },
      list: [],
      count: 0,
      loading: false,
      loadingMore: false,
      printing: [],
      columns: [
        { title: 'Төлөв', width: 140, key: 'reg_status_id.name', align: 'center', isRowspan: true },
        { title: 'Огноо', width: 95, key: 'created_at', align: 'center' },
        { title: 'Бүртгэсэн', width: 95, key: 'created_by.full_name', align: 'left' },
        { title: 'Тайлбар', key: 'description', align: 'left' },
        { title: 'Дугаар', width: 50, key: 'reg_id.reg_num', align: 'left' },
        { title: 'Огноо', width: 95, key: 'reg_id.reg_date', align: 'center' },
        { title: 'Тайлбар', key: 'reg_id.description', align: 'left' }
      ]
    }
  },
  computed: {
    ...mapGetters('settings', ['env'])
  },
  mounted () {
    this.handleClear()
  },
  methods: {
    ...mapActions(['set_pdf_url']),
    get,
    handleSearch () {
      this.handleRefresh()
    },
    handleClear () {
      this.search = { reg_num: '', doc_date: ['', ''], is_random: null, reg_id: this.reg_id }
      this.handleRefresh()
    },
    async handleRefresh () {
      try {
        if (this.loading) {
          return
        }
        this.loading = true
        this.list = []
        this.count = 0
        await this.getList()
      } catch (err) {
        this.$showError(err)
      } finally {
        this.loading = false
      }
    },
    handlePrint (row) {
      this.set_pdf_url(`cons/log/print/${row.reg_id._id}/${row._id}`)
    },
    async handleMore () {
      try {
        if (this.loadingMore) {
          return
        }
        this.loadingMore = true
        await this.getList()
      } catch (err) {
        this.$showError(err)
      } finally {
        this.loadingMore = false
      }
    },
    async getList () {
      const { data: { list, count } } = await this.$axios.get('cons/reg/random/logs', { params: { offset: this.list.length, pageSize: '20', search: JSON.stringify(this.search) } })
      this.list = [...this.list, ...list]
      this.count = count
    }
  }
}
</script>
