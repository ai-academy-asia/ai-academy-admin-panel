<template>
  <div class="w-full flex flex-col items-center">
    <div class="max-w-5xl w-full pb-2 flex justify-end">
      <el-button
        :loading="loadingLike"
        type="danger"
        plain size="small" icon="isax isax-like-1" @click="handleLike"
      >
        Таалагдлаа
      </el-button>
      <el-button size="small" icon="isax isax-arrow-left" @click="handleClose">
        Буцах
      </el-button>
    </div>
    <skeleton-news-detail v-if="!item" />
    <div v-else class="flex flex-col rounded bg-white w-full p-6 gap-6 max-w-5xl">
      <div class="flex items-start">
        <div class="flex-1 flex flex-col gap-2">
          <div class="line-clamp-1">
            {{ item.title }}
          </div>
          <div class="flex items-center gap-4 text-sm text-coreSecondaryText text-semibold">
            <div class="flex items-center gap-2">
              <i class="isax isax-calendar-1" />
              {{ item.created_at.$datetime() }}
            </div>
            <div class="flex items-center gap-2">
              <i class="isax isax-like-1 text-coreDanger" />
              {{ item.count_like || 0 }}
            </div>
            <div class="flex items-center gap-2">
              <i class="isax isax-messages-1 text-coreWarning" />
              {{ item.count_comment || 0 }}
            </div>
            <div class="flex items-center gap-2">
              <i class="isax isax-eye" />
              {{ item.count_view || 0 }}
            </div>
          </div>
        </div>
        <!-- <div class="flex gap-2 items-center">
          <span class="text-bellTextSecond font-bold">Хуваалцах:</span>
          <img class="w-6 h-6 cursor-pointer hover:shadow rounded-full" src="@/assets/svg/share-fb-link.svg" @click="handleShare('fb')">
          <img class="w-6 h-6 cursor-pointer hover:shadow rounded-full" src="@/assets/svg/share-twitter-link.svg" @click="handleShare('twitter')">
          <img class="w-6 h-6 cursor-pointer hover:shadow rounded-full" src="@/assets/svg/share-copy-link.svg" @click="handleShare('link')">
        </div> -->
      </div>
      <core-image class="w-full rounded-lg  shadow" :src="item.image" />
      <div
        class="whitespace-pre-wrap text-sm text-corePrimaryText core-content"
        v-html="item.html_content"
      />
    </div>
    <div class="py-8 flex justify-center">
      <input ref="textComment" v-model="textComment" type="text" placeholder="Та сэтгэгдэлээ үлдээнэ үү..">
      <!-- <el-input ref="textComment" v-model="textComment" v-scroll-focus placeholder="Та сэтгэгдэлээ үлдээнэ үү.." /> -->
      <!-- <el-input ref="textComment" v-model="textComment" v-scroll-focus placeholder="Та сэтгэгдэлээ үлдээнэ үү.." /> -->
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
// import { share } from '../../../core-components/utils/social-helper'
import { data, methods } from '@/utils/DetailHelper'
export default {
  async asyncData ({ $axios, params, store }) {
    try {
      const item = await methods.getItemData({ $axios, id: params.id, name: 'service_dashboard_news' })
      return { item, baseUrl: store.getters['settings/env'].baseUrl }
    } catch (err) {
      return { item: {} }
    }
  },
  data () {
    return {
      ...data,
      name: 'service_dashboard_news',
      loadingLike: false,
      textComment: ''
    }
  },
  head () {
    return {
      title: this.item.title,
      meta: [
        { hid: 'description', name: 'description', content: this.item.title },
        { name: 'og:title', property: 'og:title', content: this.item.title },
        { name: 'og:description', property: 'og:description', content: this.strippedHtml },
        { name: 'og:site_name', property: 'og:site_name', content: 'forensics.govs.mn' },
        { name: 'og:url', property: 'og:url', content: 'https://forensics.govs.mn/news/' + this.id },
        { name: 'og:image', property: 'og:image', content: this.baseUrl + '/file/' + this.item.image }
      ]
    }
  },
  computed: {
    ...mapGetters('settings', ['env']),
    id () {
      return this.$route.params.id
    },
    strippedHtml () {
      const regex = /(<([^>]+)>)/ig
      return this.item.html_content.replace(regex, '')
    }
  },
  mounted () {
    this.set_page_title(this.item.title)
    this.handleView()
    if (this.$route.hash) {
      this.$nextTick(() => {
        const mainElement = window.document.getElementById('main')
        if (mainElement) {
          mainElement.scrollTo({
            top: this.$refs.textComment.offsetTop - mainElement.offsetTop,
            behavior: 'smooth'
          })
        }
        setTimeout(() => this.$refs.textComment.focus(), 500)
      })
    }
  },
  destroyed () {
    this.set_page_title('')
  },
  methods: {
    ...mapActions('settings', ['set_page_title']),
    ...methods,
    htmlContent (html_content) {
      return html_content.replace(/<img\s+([^>]*?)src\s*=\s*["']?([^"'\s>]+)["']?([^>]*?)>/g, (match, p1, p2, p3) => {
        const url = new URL(p2)
        const newSrc = this.env.baseUrl + url.pathname
        return `<img ${p1}src="${newSrc}"${p3}>`
      })
    },
    handleView () {
      if (this.item) {
        this.$axios.get(`increment/5/scl_news/count_view/${this.id}`, { progress: false })
      }
    },
    // async handleShare (t) {
    //   const result = await share(t, `news/${this.item._id}`, this.item.title)
    //   if (result === 'success') {
    //     this.$axios.get(`increment/4/scl_news/count_share/${this.id}`, { progress: false })
    //   }
    // },
    handleClose () {
      this.$router.go(-1)
    },
    async handleLike () {
      try {
        if (this.loadingLike) {
          return
        }
        this.loadingLike = true
        if (this.item) {
          const { data } = await this.$axios.get(`increment/5/scl_news/count_like/${this.id}`, { progress: false })
          if (data) {
            this.item.count_like++
          }
        }
        this.$message.success('Баярлалаа')
      } catch (err) {
        this.$showError(err)
      } finally {
        this.loadingLike = false
      }
    }
  }
}
</script>
