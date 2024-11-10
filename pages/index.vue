<template>
  <div class="flex flex-col gap-4">
    <div v-if="!isTeacher && !isParent" class="bg-white p-4 rounded-lg">
      <div>Та ангийн багшид хандан "Асран хамгаалагч", "Багш"-ийн эрх тохируулуулна уу!.</div>
    </div>
    <div v-if="isTeacher">
      <dash-teacher
        :lessons="lessons"
        :students="students"
        :attendance-types="attendanceTypes"
        :current-session="currentSession"
      />
    </div>
    <div v-if="isParent">
      <dash-parent
        :parent="parent"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'IndexPage',
  async asyncData ({ store, $axios }) {
    const userId = store.getters['user/user']._id
    const email = store.getters['user/user'].email
    const { data: currentSession } = await $axios.get('one/8/ref_sessions')
    const { data: lessons } = await $axios.get('list/8/ref_lessons', {
      params: {
        search: {
          teacher_id: { val: userId, t: 'number', op: 'eq' },
          year_id: { val: currentSession.year_id._id, t: 'number', op: 'eq' }
        }
      }
    })
    const { data: attendanceTypes } = await $axios.get('list/8/ref_attendance_types')
    const { data: students } = await $axios.get('list/8/students')
    // const { data: teacher } = await $axios.get('one/8/user_roles', {
    //   params: {
    //     search: {
    //       user_id: { val: userId, t: 'number', op: 'eq' },
    //       role_group_id: { val: 2, t: 'number', op: 'eq' }
    //     }
    //   }
    // })
    const { data: parent } = await $axios.get('one/8/student_parents', {
      params: {
        search: {
          parent_email: { val: email, t: 'string', op: 'eq' },
          is_active: { val: true, t: 'boolean', op: 'eq' }
        }
      }
    })
    return {
      isTeacher: lessons.length > 0,
      isParent: !!parent,
      parent,
      lessons,
      students,
      currentSession,
      attendanceTypes
    }
  }
}
</script>
