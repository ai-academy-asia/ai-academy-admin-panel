<template>
  <div class="w-full">
    <video ref="videoJsPlayer" class="video-js vjs-defaultskin vjs-16-9" playsinline crossorigin="anonymous">
      <track
        v-for="sub in this.item?.SUBTITLES"
        :key="sub._id"
        :src="env.baseUrl + '/file/' + sub.file._id"
        kind="subtitles"
        :srclang="sub.locale_id.code"
        :label="sub.locale_id.name"
        :default="lang === sub.locale_id.code"
      />
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
  async asyncData ({ $axios, query }) {
    const { data } = await $axios.get(`9/ref_videos/${query.id}`)
    return { item: data }
  },
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
    id () {
      return this.$route.query.id
    },
    lang () {
      return this.$route.query.lang
    },
    videoOptions () {
      return {
        controls: true,
        autoplay: false,
        preload: 'auto',
        poster: this.item.image ? this.env.baseUrl + '/file/' + this.item.image._id : null,
        sources: this.item?.QUALITIES.map((c) => {
          return {
            src: this.env.baseUrl + '/file/' + c.file._id,
            type: c.file.mimetype,
            label: c.quality_id.name,
            res: Number(c.quality_id.name.slice(0, -1))
          }
        }) // ,
        // tracks: this.item?.SUBTITLES.map((c) => {
        //   return {
        //     src: this.env.baseUrl + '/file/' + c.file._id,
        //     kind: 'subtitles',
        //     srclang: c.locale_id.code,
        //     label: c.locale_id.name,
        //     default: c.locale_id.code === this.lang
        //   }
        // })
      }
    }
  },
  mounted () {
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
    this.handleRefresh()
  },
  beforeUnmount () {
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {
    handleRefresh () {
      try {
        // this.loading = true
        this.ready = false
        // const { data } = await this.$axios.get(`9/ref_videos/${this.id}`)
        // this.item = data
        videojs.log.level('debug')
        this.player = videojs(this.$refs.videoJsPlayer, { ...this.videoOptions }, () => {
          this.ready = true
          this.player.log('video player ready')
          // const tracks = this.player.textTracks()
          // if (tracks.length > 0) {
          //   tracks[0].mode = 'showing'
          // }
        })
        this.player.getChild('ControlBar').addChild('CustomMenuButton', {
          customLabel: '1080p'
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
