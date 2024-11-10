<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-row gap-4">
      <div
        v-for="menu in menus" :key="menu.name"
        :class="['text-sm font-medium rounded px-2 py-2 cursor-pointer shadow-lg', {
          'bg-blue-500 text-white': selectedMenu === menu.name,
          'bg-white': selectedMenu !== menu.name
        }]"
        @click="selectedMenu = menu.name"
      >
        <i :class="menu.icon" />
        <span>{{ menu.title }}</span>
      </div>
    </div>
    <div class="bg-white px-2 rounded py-1">
      <el-radio-group v-model="selectedLessonId">
        <el-radio
          v-for="lesson in lessons"
          :key="lesson._id"
          :label="lesson._id"
        >
          {{ lesson.name }}
        </el-radio>
      </el-radio-group>
    </div>
    <dash-teacher-attendance
      v-if="selectedMenu === 'attendance' && selectedLessonId"
      :students="students"
      :attendance-types="attendanceTypes"
      :selected-lesson="selectedLession"
    />
    <dash-teacher-score
      v-if="selectedMenu === 'score' && selectedLessonId"
      :students="students"
      :selected-lesson="selectedLession"
      :current-session="currentSession"
    />
  </div>
</template>
<script>
export default {
  name: 'DashTeacher',
  props: {
    lessons: { type: Array, default: () => { return [] } },
    students: { type: Array, default: () => { return [] } },
    attendanceTypes: { type: Array, default: () => { return [] } },
    currentSession: { type: Object, default: () => { return null } }
  },
  data () {
    return {
      selectedLessonId: null,
      selectedMenu: 'attendance',
      menus: [{
        icon: 'isax isax-timer-1',
        name: 'attendance',
        title: 'Ирц бүртгэл'
      }, {
        icon: 'isax isax-discount-shape',
        name: 'score',
        title: 'Дүн бүртгэл'
      }]
    }
  },
  computed: {
    selectedLession () {
      return this.lessons.find(c => c._id === this.selectedLessonId)
    }
  },
  mounted () {
    this.selectedLessonId = this.lessons?.length ? this.lessons[0]._id : null
  },
  methods: {
  }
}
</script>
