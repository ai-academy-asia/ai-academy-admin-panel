<template>
  <div class="h-full block md:flex md:flex-row md:flex-row overflow-y-auto md:overflow-hidden pb-20 md:pb-0">
    <div class="w-full md:w-[420px] xl:w-[496px]  overflow-hidden md:overflow-y-auto pt-20 md:pt-36 pb-20">
      <div class="flex flex-row md:flex-col items-center justify-center text-left md:text-center gap-4 pb-8 md:pb-12">
        <!-- <img src="~assets/images/logo.svg" class="h-16" lazy> -->
        <p class="uppercase font-bold leading-6 text-lg">
          <!-- <system-name /> -->
          ESHOP Manage
        </p>
      </div>
      <iframe
        id="iframeLogin"
        :style="`height: ${height}px`"
        class="overflow-hidden h-full w-full"
        :src="`${env.authUrl}/login?p=${env.projectId}&type=employees&requestId=${requestId}&props=google,linkedin`"
        frameborder="0"
      />
    </div>
    <div class="flex-1 px-4 h-52 md:h-full md:px-0 flex">
      <el-carousel class="flex-1 login-carousel rounded-lg md:rounded-none" height="100%" :autoplay="false" trigger="click">
        <el-carousel-item class="size-full bg-[url('~assets/images/loginbg3.jpg')] bg-cover bg-center bg-corePrimary bg-no-repeat">
          <div class="bg-corePrimary bg-opacity-40 h-full flex items-center justify-center px-16">
            <div class="text-white text-center">
              <p class="text-sm leading-4 md:text-lg md:leading-5">
                Системтэй холбоотой асуудлаар<br><a class="font-semibold underline" :href="`mailto: ${contactMail}`">{{ contactMail }}</a> и-мэйл хаягаар хандан зөвлөгөө авна уу.
              </p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
// import { io } from 'socket.io-client'
import { has } from 'lodash'
import { uuidv4 } from '@/../core-components/utils/helpers'
import middleware from '@/../core-components/middleware/login'
export default {
  name: 'PageLogin',
  layout: 'empty',
  middleware: [middleware, 'check-login'],
  data () {
    return {
      contactMail: 'info@get-api.com',
      carouselIndex: 1,
      carouselLength: 2,
      requestId: '',
      callbackUrl: '',
      connected: false,
      token: '',
      height: 260,
      isLogged: false
    }
  },
  head () {
    return {
      title: 'Нэвтрэх'
    }
  },
  computed: {
    ...mapGetters('settings', ['env'])
  },
  mounted () {
    // const socket = io(this.env.baseUrl, { path: '/api' })
    this.requestId = uuidv4()
    this.callbackUrl = location.origin + '/login'
    // socket.on(this.requestId, this.handleLogin)
    // socket.on('connect', () => {
    //   this.connected = true
    // })
    // socket.on('disconnected', () => {
    //   this.connected = false
    // })
    window.addEventListener('message', this.handlePostMessage, false)
  },
  methods: {
    ...mapActions(['refresh_user_menus']),
    ...mapActions('user', ['refresh_user', 'set_token', 'set_user']),
    handlePostMessage (event) {
      try {
        // if (!this.env.authUrl.includes(event.origin) && event.data !== 'string') { return }
        const { type, data } = JSON.parse(event.data)
        if (type === 'setHeight') {
          this.height = data.height
        } else if (type === 'login') {
          this.handleLogin(data.token)
        }
      } catch (_) {}
    },
    handleChangeCarousel (index) {
      this.carouselIndex = index
    },
    async handleLogin (token) {
      try {
        if (this.isLogged) {
          return
        }
        this.isLogged = true
        this.token = token
        if (has(token, 'token') && has(token, 'user')) {
          this.set_token(token.token)
          this.set_user(token.user)
        } else {
          this.set_token(token)
          await this.refresh_user()
        }
        await this.refresh_user_menus()
        this.$router.replace({ name: 'index' })
      } catch (err) {
        this.$showError(err)
      } finally {
        this.isLogged = false
      }
    }
  }
}
</script>
