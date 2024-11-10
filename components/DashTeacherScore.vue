<template>
  <div class="bg-white rounded-lg p-4 flex flex-col gap-4">
    <div class="text-sm flex flex-col gap-4 items-start">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="() => handleVisibleScore()"
      >
        Шинээр дүн үүсгэх
      </el-button>
      <!-- {{ scores }} -->
      <table v-loading="loading">
        <colgroup>
          <col>
          <col v-for="r in scores" :key="r._id">
        </colgroup>
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-slate-200 px-2 py-1">
              №
            </th>
            <th class="border border-slate-200 px-2 py-1">
              Сурагчийн нэр
            </th>
            <th
              v-for="r in scores"
              :key="r._id"
              class="border border-slate-200 px-0 py-1 text-xs leading-3 cursor-pointer hover:underline"
              style="width: 100px;"
              @dblclick="() => handleVisibleScore(r)"
            >
              <div class="font-normal">
                {{ $moment(r.score_date).format('MM/DD') }} - {{ getDays($moment(r.score_date).weekday()) }}
              </div>
              {{ r.name }}
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
            <td v-for="r in scores" :key="r._id" class="border border-slate-200 px-1 py-1">
              <el-input
                type="number"
                :disabled="saving"
                :value="getStudentScore(r, student)"
                size="small"
                @input="($event) => setStudentScore(r, student, $event)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <el-button
        type="success"
        size="small"
        icon="el-icon-check"
        :loading="saving"
        @click="handleSaveStudentScores"
      >
        Дүн хадгалах
      </el-button>
    </div>
    <el-dialog
      :visible.sync="visibleScore"
      title="Шинээр дүн үүсгэх"
      width="500px"
    >
      <div class="p-4 rounded bg-white">
        <el-form v-if="score">
          <el-alert :closable="false" show-icon>
            <span class="text-lg">{{ currentSession.year_id.name }} "{{ currentSession.name }}"</span>
          </el-alert>
          <el-form-item label="Дүнгийн нэр">
            <el-input v-model="score.name" size="small" />
          </el-form-item>
          <el-form-item label="Дүнгийн төрөл">
            <core-select
              v-model="score.type_id"
              :temp="score"
              table_name="ref_score_types"
              project-id="8"
              :col_multiple="false"
              ref_column="name"
              size="small"
            />
          </el-form-item>
          <el-form-item label="Дүнгийн огноо">
            <core-date v-model="score.score_date" size="small" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="flex flex-row">
        <div class="flex-1 flex justify-start">
          <el-button v-if="score?._id" icon="el-icon-delete" type="danger" size="small" :loading="loadingScore" @click="handleDeleteScore">
            Устгах
          </el-button>
        </div>
        <div>
          <el-button icon="el-icon-check" type="success" size="small" :loading="loadingScore" @click="handleSaveScore">
            Хадгалах
          </el-button>
          <el-button icon="el-icon-close" size="small" @click="visibleScore = false">
            Хаах
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'DashTeacherScore',
  props: {
    students: { type: Array, default: () => { return [] } },
    selectedLesson: { type: Object, default: () => { return null } },
    currentSession: { type: Object, default: () => { return null } }
  },
  data () {
    return {
      score: null,
      scores: [],
      studentScores: [],
      attendances: [],
      visibleScore: false,
      loadingScore: false,
      loading: false,
      saving: false
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
    this.handleRefresh()
  },
  methods: {
    getDays (index) {
      const r = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба']
      return r[index]
    },
    async handleRefresh () {
      try {
        this.loading = true
        this.studentScores = []
        this.scores = []
        const studentScores = await this.getStudentScores()
        const scores = await this.getScores()
        this.studentScores = studentScores
        this.scores = scores
      } catch (err) {
        this.$showError(err)
      } finally {
        this.loading = false
      }
    },
    async handleScores () {
      try {
        this.loading = true
        const scores = await this.getScores()
        this.scores = scores
      } catch (err) {
        this.$showError(err)
      } finally {
        this.loading = false
      }
    },
    handleVisibleScore (score) {
      this.score = {
        type_id: null,
        lesson_id: this.selectedLesson,
        name: '',
        year_id: this.currentSession.year_id,
        session_id: this.currentSession,
        score_date: new Date(),
        ...score
      }
      this.visibleScore = true
    },
    async handleDeleteScore () {
      try {
        if (this.loadingScore) {
          return
        }
        await this.$showConfirm(`Та ${this.score.name} оноог устгахдаа итгэлтэй байна уу?`)
        this.loadingScore = true
        await this.$axios.delete(`8/lesson_scores/${this.score._id}`)
        this.visibleScore = false
        this.score = null
        this.handleScores()
        this.$showSuccess('Амжилттай утгалаа.')
      } catch (err) {
        this.$showError(err)
      } finally {
        this.loadingScore = false
      }
    },
    async handleSaveScore () {
      try {
        if (this.loadingScore) {
          return
        }
        this.loadingScore = true
        await this.$axios.post('8/lesson_scores', {
          ...this.score
        })
        this.visibleScore = false
        this.$showSuccess('Амжилттай хадгаллаа.')
        this.handleScores()
      } catch (err) {
        this.$showError(err)
      } finally {
        this.loadingScore = false
      }
    },
    async handleSaveStudentScores () {
      try {
        if (this.saving) {
          return
        }
        this.saving = true
        const newStudentScores = this.studentScores.map((c) => {
          return {
            _id: c._id,
            lesson_id: c.lesson_id._id,
            lesson_score_id: c.lesson_score_id._id,
            score: c.score,
            student_id: c.student_id._id
          }
        })
        const { data } = await this.$axios.post('multiple/8/student_scores', newStudentScores)
        this.studentScores = [...data]
        this.$showSuccess('Амжилттай хадгаллаа.')
      } catch (err) {
        this.$showError(err)
      } finally {
        this.saving = false
      }
    },
    setStudentScore (score, student, value) {
      const item = this.studentScores.find(c => c.lesson_id?._id === this.selectedLesson?._id && c.lesson_score_id?._id === score._id && c.student_id._id === student._id)
      if (item) {
        item.score = value
      } else {
        const tempItem = { lesson_id: this.selectedLesson, lesson_score_id: score, student_id: student, score: value }
        this.studentScores.push({ ...tempItem })
      }
    },
    getStudentScore (score, student) {
      return this.studentScores.find(c => c.lesson_id?._id === this.selectedLesson?._id && c.lesson_score_id?._id === score._id && c.student_id._id === student._id)?.score
    },
    async getStudentScores () {
      const { data: studentScores } = await this.$axios.get('list/8/student_scores', {
        params: {
          search: {
            lesson_id: { val: this.selectedLesson?._id, t: 'number', op: 'eq' }
          }
        }
      })
      return studentScores
    },
    async getScores () {
      const { data: scores } = await this.$axios.get('list/8/lesson_scores', {
        params: {
          search: {
            lesson_id: { val: this.selectedLesson?._id, t: 'number', op: 'eq' }
          }
        }
      })
      return scores
    }
  }
}
</script>
