<template>
  <div class="bg-white rounded-lg p-4 flex flex-col gap-4 text-sm items-start">
    <div class="flex flex-row gap-2 items-center">
      <core-date
        v-model="currentDate"
        :picker-options="pickerOptions"
        size="small"
        @change="handleRefresh"
      />
      <el-alert :type="isCreated ? 'success' : 'warning'" :closable="false">
        <span class="text-sm">{{ isCreated ? 'Ирц бүртгэсэн' : 'Ирц бүртгээгүй' }}</span>
      </el-alert>
    </div>
    <table v-loading="loading">
      <colgroup>
        <col>
        <col>
      </colgroup>
      <thead class="bg-gray-100">
        <tr>
          <th class="border border-slate-200 px-2 py-1">
            №
          </th>
          <th class="border border-slate-200 px-2 py-1">
            Сурагчийн нэр
          </th>
          <th class="border border-slate-200 px-2 py-1">
            {{ $moment(currentDate).format('MM/DD') }} {{ getDays($moment(currentDate).weekday()) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(student, index) in studentList"
          :key="student._id"
          class="hover:bg-gray-100"
        >
          <td class="border border-slate-200 px-2 py-2" :align="'right'">
            {{ index + 1 }}
          </td>
          <td class="border border-slate-200 px-2 py-2">
            {{ student.given_name }}
          </td>
          <td class="border border-slate-200 px-1 py-1" style="width: 100px;">
            <el-select
              v-if="!loading"
              :disabled="saving"
              size="small"
              value-key="_id"
              :value="getAttendanceType(currentDate, student)"
              @change="($event) => setAttendance(currentDate, student, $event)"
            >
              <el-option
                v-for="type in attendanceTypes"
                :key="type._id"
                :label="type.name"
                :value="type"
              />
            </el-select>
          </td>
        </tr>
      </tbody>
    </table>
    <el-button
      type="success"
      size="small"
      icon="el-icon-check"
      :loading="saving"
      @click="handleSaveAttendances"
    >
      Ирц хадгалах
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'DashTeacherAttendance',
  props: {
    students: { type: Array, default: () => { return [] } },
    attendanceTypes: { type: Array, default: () => { return [] } },
    selectedLesson: { type: Object, default: () => { return null } }
  },
  data () {
    return {
      saving: false,
      loading: false,
      attendances: [],
      currentDate: null,
      isCreated: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  computed: {
    studentList () {
      if (this.selectedLesson.gender_id?._id) {
        return this.students.filter(c => c.gender_id._id === this.selectedLesson.gender_id._id)
      }
      if (this.selectedLesson.students?.length > 0) {
        return this.students.filter(c => this.selectedLesson.students.some(k => k._id === c._id))
      }
      return this.students
    }
  },
  watch: {
    'selectedLesson' () {
      this.handleRefresh()
    }
  },
  mounted () {
    this.currentDate = new Date()
    this.handleRefresh()
  },
  methods: {
    async handleRefresh () {
      try {
        this.loading = true
        this.attendances = []
        const attendances = await this.getAttendances()
        this.isCreated = attendances.length > 0
        this.attendances = attendances
      } catch (err) {
        this.$showError(err)
      } finally {
        this.loading = false
      }
    },
    getDays (index) {
      const r = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба']
      return r[index]
    },
    setAttendance (currentDate, student, value) {
      const item = this.attendances.find(c => this.$moment(c.attendance_date).isSame(currentDate, 'days') && c.student_id._id === student._id)
      if (item) {
        item.type_id = value
      } else {
        this.attendances.push({ attendance_date: currentDate, student_id: student, type_id: value, lesson_id: this.selectedLesson })
      }
    },
    async handleSaveAttendances () {
      try {
        if (this.saving) {
          return
        }
        this.saving = true
        const newAttendances = this.studentList.map((r) => {
          const att = this.attendances.find(c => this.$moment(c.attendance_date).isSame(this.currentDate, 'days') && c.student_id._id === r._id)
          const type_id = att?.type_id?._id || this.attendanceTypes[0]._id
          return {
            _id: att?._id,
            attendance_date: this.currentDate,
            student_id: r._id,
            lesson_id: this.selectedLesson._id,
            type_id
          }
        })
        const { data: attendances } = await this.$axios.post('multiple/8/student_attendances', newAttendances)
        this.attendances = attendances
        this.$showSuccess('Амжилттай хадгаллаа.')
      } catch (err) {
        this.$showError(err)
      } finally {
        this.saving = false
      }
    },
    getAttendanceType (currentDate, student) {
      const type_id = this.attendances.find(c => this.$moment(c.attendance_date).isSame(currentDate, 'days') && c.student_id._id === student._id)?.type_id
      return type_id || this.attendanceTypes[0]
    },
    async getAttendances () {
      const { data: attendances } = await this.$axios.get('list/8/student_attendances', {
        params: {
          search: {
            attendance_date: { val: [this.currentDate, this.currentDate], t: 'date', op: 'between' },
            lesson_id: { val: this.selectedLesson?._id, t: 'number', op: 'eq' }
          }
        }
      })
      return attendances
    }
  }
}
</script>
