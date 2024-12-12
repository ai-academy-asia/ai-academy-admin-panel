<template>
  <div class="w-full">
    <video v-if="item" id="videoJsPlayer" ref="videoJsPlayer" class="video-js vjs-defaultskin vjs-16-9" playsinline crossorigin="anonymous">
      <track
        v-for="sub in item?.SUBTITLES"
        :key="sub._id"
        :src="'/api/file/' + sub.file._id"
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
  props: {
    id: { type: String, default: '' }
  },
  // layout: 'empty',
  // async asyncData ({ $axios, query }) {
  //   const { data } = await $axios.get(`9/ref_videos/${query.id}`)
  //   return { item: data }
  // },
  data () {
    return {
      loading: false,
      ready: false,
      item: null,
      player: null
    }
  },
  computed: {
    ...mapGetters('settings', ['env']),
    lang () {
      return this.$route.query.lang
    },
    videoOptions () {
      return {
        controls: true,
        autoplay: false,
        preload: 'auto',
        poster: this.item.image?._id ? '/api/file/' + this.item.image._id : null,
        sources: this.item?.QUALITIES.map((c) => {
          return {
            src: '/api/file/' + c.file._id,
            type: c.file.mimetype,
            label: c.quality_id.name,
            res: Number(c.quality_id.name.slice(0, -1))
          }
        })
      }
    }
  },
  watch: {
    id () {
      this.handleRefresh()
    }
  },
  mounted () {
    this.handleRefresh()
  },
  beforeUnmount () {
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {
    async handleRefresh () {
      try {
        if (!this.id) {
          this.item = null
          return
        }
        const { data } = await this.$axios.get(`9/ref_videos/${this.id}`)
        this.item = data
        if (!this.item?.QUALITIES?.length) {
          this.$customError('Бичлэг оруулна уу')
        }
        // this.loading = true
        this.ready = false
        await this.$nextTick()
        videojs.registerComponent('CustomMenuButton', class extends videojs.getComponent('MenuButton') {
          constructor (player, options) {
            super(player, options)
            // console.log('player', this.player().lastSource_.player)
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
                that.controlText(c.label)
                that.player().src(c)
                that.player().play()
                that.player().currentTime(currentTime)
              }
              return item
            })
          }
        })
        videojs.log.level('debug')
        console.log(this.$refs.videoJsPlayer)
        this.player = videojs(this.$refs.videoJsPlayer, { ...this.videoOptions }, () => {
          this.ready = true
          this.player.log('video player ready')
        })
        this.player.getChild('ControlBar').addChild('CustomMenuButton', {
          customLabel: this.item?.QUALITIES[0].quality_id.name
        })
        window.parent.postMessage(JSON.stringify({ type: 'dimensions', data: this.player.currentDimensions('width') }), '*')
      } catch (err) {
        this.$showError(err)
      } finally {
        // this.loading = false
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
