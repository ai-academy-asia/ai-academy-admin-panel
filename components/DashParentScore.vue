<template>
  <el-dialog
    title="Дүн үзэх"
    width="500px"
    :visible.sync="visible"
  >
    <div class="bg-white rounded border">
      <div class="py-2 px-2 font-medium text-base text-center">
        {{ value?.given_name }}
      </div>
      <div v-for="(item, index) in list" :key="item._id" class="flex flex-col group">
        <div
          v-if="index === 0 || list[index - 1].lesson_id._id !== item.lesson_id._id"
          class="px-2 py-2 font-medium bg-gray-100 w-full group-first:rounded-t border-b"
        >
          {{ item.lesson_id.name }}
        </div>
        <div class="px-2 py-1 flex flex-row border-b group-last:border-none items-center">
          <div class="flex-1 flex gap-2">
            <span class="text-coreRegularText font-medium rounded-lg px-2 py-0 border text-green-700 bg-green-100 border-green-200">Оноо: {{ item.score }}</span><span>{{ item.lesson_score_id.name }} - {{ item.lesson_score_id.score_date }}</span>
          </div>
          <div class="flex gap-2 items-center">
            <div class="size-8 rounded-full bg-coreBgMain text-sm text-coreSecondaryText flex items-center justify-center">
              <img
                v-if="item.created_by.image"
                :src="`/api/file/${item.created_by.image?._id || item.created_by.image}`"
                class="rounded-full object-cover  w-full h-full"
              >
              <span v-else>{{ item.created_by.given_name.slice(0, 1) }}</span>
            </div>
            <div>
              <div class="text-sm text-coreSecondaryText">
                {{ item.created_by.surname?.slice(0, 1) }}.{{ item.created_by.given_name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isMore" class="text-center pb-20">
        <el-button type="text" icon="el-icon-arrow-down" :loading="loading" @click="handleRefresh">
          Цааш үзэх
        </el-button>
      </div>
      <div v-else-if="loading">
        <core-loader />
      </div>
      <div v-else-if="list.length === 0" class="text-center py-10 text-coreSecondaryText font-medium">
        Бүртгэл үүсээгүй байна..
      </div>
    </div>
    <div slot="footer">
      <el-button size="small" icon="el-icon-close" @click="visible = false">
        Хаах
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'DashParentAttendance',
  props: {
    value: {
      type: Object, default: () => { return null }
    }
  },
  data () {
    return {
      loading: false,
      list: [],
      isMore: false
    }
  },
  computed: {
    visible: {
      get () {
        return !!this.value
      },
      set () {
        this.$emit('input', null)
      }
    }
  },
  watch: {
    value () {
      this.list = []
      this.handleRefresh()
    }
  },
  methods: {
    getDays (index) {
      const r = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба']
      return r[index]
    },
    async handleRefresh () {
      try {
        if (this.loading || !this.value) {
          return
        }
        this.loading = true
        const { data: list } = await this.$axios.get('list/8/student_scores', {
          params: {
            offset: this.list.length,
            pageSize: 20,
            search: {
              student_id: { val: this.value._id, t: 'number', op: 'eq' }
            },
            sorts: [{
              prop: 'lesson_id.sort_order',
              order: 'ascending'
            }, {
              prop: 'lesson_score_id.score_date',
              order: 'ascending'
            }],
            extraFields: 'lesson_score_id.score_date'
          }
        })
        this.isMore = list.length === 20
        this.list = [...this.list, ...list]
      } catch (err) {
        this.$showError(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
