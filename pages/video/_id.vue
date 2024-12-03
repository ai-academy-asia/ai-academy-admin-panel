<template>
  <div class="w-full">
    <div v-if="errorMessage" class="aspect-video flex items-center justify-center text-lg text-coreSecondaryText font-medium bg-black gap-2">
      <i class="el-icon-warning" /> {{ errorMessage }}
    </div>
    <video v-else ref="videoJsPlayer" class="video-js vjs-defaultskin vjs-16-9" playsinline crossorigin="anonymous">
      <track
        v-for="sub in item?.SUBTITLES"
        :key="sub._id"
        :src="env.baseUrl + '/file/' + sub.file._id"
        kind="subtitles"
        :srclang="sub.locale_id.code"
        :label="sub.locale_id.name"
        :default="lang === sub.locale_id.code"
      >
    </video>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
const MenuItem = videojs.getComponent('MenuItem')
export default {
  name: 'VideoJsPlayer',
  layout: 'empty',
  async asyncData ({ $axios, query, params }) {
    try {
      if (!params.id) {
        return { errorVideo: 'Required id.' }
      }
      // if (!query.auth_token) {
      //   return { errorVideo: 'Required auth_token.' }
      // }
      if (!query.course_id) {
        return { errorVideo: 'Required course_id.' }
      }
      // if (!query.topic_id) {
      //   return { errorVideo: 'Required topic_id.' }
      // }
      // if (!query.lesson_id) {
      //   return { errorVideo: 'Required lesson_id.' }
      // }
      const options = {
        params: {
          id: params.id,
          lang: query.lang
        }
      }
      if (query.auth_token) {
        options.headers = {
          Authorization: `Bearer ${query.auth_token}`
        }
      }
      const { data } = await $axios.get(`9/ref_videos/${params.id}`, options)
      let errorVideo = null
      if (!data?._id) {
        errorVideo = query.lang === 'en' ? 'Not found video.' : 'Бичлэг олдсонгүй.'
      }
      return { item: data, errorVideo }
    } catch (err) {
      const errorVideo = err.response?.data?.message || err.response?.message || err.message
      return { errorVideo, item: null }
    }
  },
  data () {
    return {
      loading: false,
      ready: false,
      item: null,
      player: null,
      error: null,
      videoLog: null,
      logTimer: null,
      sumWatchingTime: 0,
      waiting: true,
      watchingTime: 0,
      watchingTimer: null
    }
  },
  computed: {
    ...mapGetters('settings', ['env']),
    errorMessage () {
      return this.errorVideo || this.error
    },
    id () {
      return this.$route.params.id
    },
    topic_id () {
      return this.$route.query.topic_id || null
    },
    lesson_id () {
      return this.$route.query.lesson_id || null
    },
    course_id () {
      return this.$route.query.course_id
    },
    auth_token () {
      return this.$route.query.auth_token
    },
    lang () {
      return this.$route.query.lang
    },
    token () {
      return this.$route.query.token
    },
    videoOptions () {
      const selectedQuality = window.localStorage.getItem('SELECTED_QUALITY')
      return {
        controls: true,
        autoplay: false,
        preload: 'auto',
        poster: this.item.image ? this.env.baseUrl + '/file/' + this.item.image._id : null,
        sources: this.item?.QUALITIES?.map((c) => {
          return {
            src: this.env.baseUrl + '/file/' + c.file._id,
            type: c.file.mimetype,
            label: c.quality_id.name,
            res: Number(c.quality_id.name.slice(0, -1)),
            default: selectedQuality === c.quality_id.name
          }
        })
      }
    }
  },
  mounted () {
    videojs.registerComponent('CustomMenuButton', class extends videojs.getComponent('MenuButton') {
      constructor (player, options) {
        super(player, options)
        this.controlText(options.customLabel)
        this.addClass('vjs-menu-button')
        this.addClass('vjs-control')
        this.addClass('vjs-custom-menu-button')
      }

      createItems () {
        const sources = this.player().options().sources || []
        const that = this
        return sources.map((c) => {
          const item = new MenuItem(this.player(), {
            label: c.label,
            selected: c.label === that.controlText
          })
          item.handleClick = function () {
            const currentTime = that.player().currentTime()
            window.localStorage.setItem('SELECTED_QUALITY', c.label)
            that.controlText(c.label)
            that.player().src(c)
            that.player().play()
            that.player().currentTime(currentTime)
          }
          return item
        })
      }
    })
    this.handleRefresh()
  },
  async beforeUnmount () {
    this.stopWatchingTime()
    if (this.player) {
      await this.handleSaveLog()
      this.player.dispose()
    }
  },
  methods: {
    stopWatchingTime () {
      this.waiting = true
      clearInterval(this.watchingTimer)
    },
    startWatchingTime () {
      this.waiting = false
      clearInterval(this.watchingTimer)
      this.watchingTimer = setInterval(() => {
        this.watchingTime += 10
      }, 10)
    },
    async handleSaveLog () {
      try {
        clearTimeout(this.logTimer)
        if (!this.videoLog?._id) {
          const startDate = this.$moment().startOf('days').toDate()
          const endDate = this.$moment().endOf('days').toDate()
          this.videoLog = (await this.$axios.get('one/9/service_course_logs', {
            params: {
              search: {
                video_id: { val: this.id, t: 'number', op: 'eq' },
                course_id: { val: this.course_id, t: 'number', op: 'eq' },
                topic_id: { val: String(this.topic_id), t: 'number', op: 'eq' },
                lesson_id: { val: String(this.lesson_id), t: 'number', op: 'eq' },
                video_ended: { val: false, t: 'boolean', op: 'eq' },
                created_at: { val: [startDate, endDate], t: 'date', op: 'between' }
              },
              fields: 'video_id,course_id,topic_id,lesson_id,video_current_time,video_watching_time,times,total_watching_time,video_ended'
            },
            headers: {
              Authorization: `Bearer ${this.auth_token}`
            }
          })).data
          if (this.videoLog?._id) {
            this.videoLog.times++
          }
          this.sumWatchingTime = this.videoLog?.total_watching_time || 0
        }
        this.videoLog = {
          video_id: this.id, course_id: this.course_id, topic_id: this.topic_id, lesson_id: this.lesson_id, video_current_time: 0, video_watching_time: 0, times: 1, total_watching_time: 0, video_ended: false, video_duration: 0,
          ...this.videoLog
        }
        if (this.player.duration()) {
          this.videoLog.video_duration = this.player.duration()
        }
        this.videoLog.video_ended = this.player.ended()
        this.videoLog.video_current_time = this.player.currentTime()
        this.videoLog.total_watching_time = this.sumWatchingTime + (this.watchingTime / 1000)
        this.videoLog.video_watching_time = (this.watchingTime / 1000)
        await this.$axios.post('9/service_course_logs', this.videoLog, {
          headers: {
            Authorization: `Bearer ${this.auth_token}`
          }
        })
        if (!this.player.paused() && !this.player.ended()) {
          this.logTimer = setTimeout(this.handleSaveLog, 5000)
        }
      } catch (err) {
        this.$showError(err, { hideMessage: true })
      }
    },
    handleRefresh () {
      try {
        if (!this.item?._id) {
          return
        }
        this.ready = false
        videojs.log.level('debug')
        this.player = videojs(this.$refs.videoJsPlayer, { ...this.videoOptions }, () => {
          this.ready = true
          this.player.log('video player ready')
        })
        const selectedQuality = window.localStorage.getItem('SELECTED_QUALITY')
        let quality = ''
        if (this.item?.QUALITIES?.length) {
          quality = this.item?.QUALITIES[0].quality_id.name
          if (this.item?.QUALITIES.some(c => c.quality_id.name === selectedQuality)) {
            quality = selectedQuality
          }
        }
        this.player.getChild('ControlBar').addChild('CustomMenuButton', {
          customLabel: quality
        })
        window.parent.postMessage(JSON.stringify({ type: 'dimensions', data: this.player.currentDimensions('width') }), '*')
        if (this.auth_token) {
          this.player.on('playing', () => {
            this.startWatchingTime()
            this.handleSaveLog()
          })
          this.player.on('pause', () => {
            this.stopWatchingTime()
          })
          this.player.on('ended', () => {
            this.stopWatchingTime()
            this.handleSaveLog()
          })
          this.player.on('waiting', this.stopWatchingTime)
          this.player.on('stalled', this.startWatchingTime)
          this.player.on('seeking', () => {
            // console.log('seeking')
          })
          this.player.on('seeked', () => {
            // console.log('seeked')
          })
        }
      } catch (err) {
        this.error = this.$showError(err, { hideMessage: true })
      }
    }
  }
}
</script>
<style>
.vjs-custom-menu-button .vjs-button .vjs-control-text {
  position: static !important;
}
.video-js {
  width: 100%;
}
</style>
