<template>
  <div class="w-full flex flex-col items-center pb-8 ">
    <div class="flex flex-row flex-wrap gap-6 max-w-7xl w-full items-start justify-start ">
      <div class="flex flex-col gap-6 flex-1 w-full sm:min-w-[580px]">
        <scl-count :counts="counts" />
        <scl-news :list="news" />
      </div>
      <div class="w-full lg:w-[300px] flex flex-col gap-4 ">
        <transition name="el-fade-in-linear">
          <div v-if="!hideProfile" class="bg-white rounded p-4 flex flex-col gap-2 relative w-full ">
            <div class="text-left text-corePrimary font-medium text-sm">
              Системд нэвтэрсэн: {{ $moment().format('YYYY-MM-DD') }}
            </div>
            <div v-if="user" class="flex-row flex gap-2">
              <div class="h-[100px] w-[90px] items-center flex justify-center  rounded-lg bg-coreBgInput text-coreBaseBorder">
                <img
                  v-if="user.image?._id || user.image"
                  :src="'/api/file/' + (user.image?._id || user.image)"
                  class="h-full w-full rounded-lg object-cover object-center"
                >
                <i v-else class="isax isax-user text-5xl" />
              </div>
              <div class="whitespace-normal text-coreRegularText break-words flex-1 gap-2 flex-col flex">
                <div class="font-medium">
                  {{ user?.surname }}
                  <span class="font-medium uppercase">{{ user?.given_name }}</span>
                </div>
                <div class="text-sm leading-4 flex flex-row gap-1 items-start">
                  <div class="w-5 flex items-center justify-center">
                    <i class="isax isax-building-3 text-lg text-coreSecondaryText" />
                  </div>
                  <div class="flex-1">
                    {{ user?.position_name || 'Байгууллага бүртгэлгүй байна.' }}
                  </div>
                </div>
                <!-- <div class="text-sm leading-4 flex flex-row gap-1 items-start">
                  <i class="isax isax-award text-xl text-coreSecondaryText" />
                  <div class="flex-1">
                    {{ user_position?.position_id.name || 'Албан тушаал бүртгэлгүй байна.' }}
                  </div>
                </div> -->
              </div>
            </div>
            <div class="flex flex-col items-center gap-2">
              <!-- <div class="w-full">
                <el-progress :percentage="50" :show-text="false" />
              </div> -->
              <nuxt-link
                :to="{ name: 'profile' }"
                class="text-xs underline text-coreBlue underline-offset-2 font-medium"
              >
                Хувийн мэдээлэл баяжуулах
              </nuxt-link>
            </div>
            <div
              class="absolute top-1 right-1 w-6 h-6 rounded-full text-coreSecondaryText cursor-pointer hover:bg-black/[0.1] flex items-center justify-center"
              @click="set_hide_profile(true)"
            >
              <i class="el-icon-close" />
            </div>
          </div>
        </transition>
        <!-- <div class="bg-white rounded p-4 flex flex-col gap-1">
          <div class="pb-4 border-b flex items-center">
            <div class="text-sm flex-1 font-bold text-coreRegularText">
              Хэргийн жагсаалт
            </div>
            <i class="isax isax-search-normal-1" />
          </div>
          <div v-for="i in 12" :key="i" class="flex items-center gap-1 text-coreRegularText text-sm leading-4 cursor-pointer hover:bg-coreBgMain p-2 rounded">
            <i :class="mockItem.icon" />
            <div>{{ mockItem.itemId }}</div>
            <div class="flex-1">
              {{ mockItem.text }}
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
const emptyCounts = () => ({
  countCourses: 0,
  countStudents: 0,
  countVideos: 0,
  countViews: 0
})

export default {
  name: 'PageIndex',
  data () {
    return {
      news: [],
      counts: emptyCounts(),
      dashboardLoading: false,
      mockItem: {
        icon: 'isax isax-menu-1',
        itemId: '1221',
        text: '784932122 Туршилт туршилт 784932122 Туршилт туршилт..'
      }
    }
  },
  head () {
    return {
      title: 'Хянах самбар'
    }
  },
  computed: {
    ...mapGetters('user', ['user', 'hideProfile']),
    ...mapGetters('settings', ['env'])
  },
  mounted () {
    this.loadDashboard()
  },
  methods: {
    ...mapActions('user', ['set_hide_profile']),
    async loadDashboard () {
      if (this.dashboardLoading) {
        return
      }
      this.dashboardLoading = true
      try {
        const { data: news } = await this.$axios.get('list/9/service_news', {
          params: {
            extraFields: 'created_by.full_name,created_by.position_name,created_at,created_by.image'
          }
        })
        const [countCourses, countStudents, countVideos, countViews] = await Promise.all([
          this.$axios.get('count/9/service_acourses').then(r => r.data.count).catch(() => 0),
          this.$axios.get('count/9/service_astudents').then(r => r.data.count).catch(() => 0),
          this.$axios.get('count/9/service_ref_videos').then(r => r.data.count).catch(() => 0),
          this.$axios.get('count/9/service_student_course_logs').then(r => r.data.count).catch(() => 0)
        ])
        this.news = Array.isArray(news) ? news : []
        this.counts = { countCourses, countStudents, countVideos, countViews }
      } catch (err) {
        console.error('index loadDashboard error:', err)
      } finally {
        this.dashboardLoading = false
      }
    }
  }
}
</script>
