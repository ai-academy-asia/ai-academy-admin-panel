<template>
  <div class="flex flex-row h-screen overflow-hidden">
    <div
      :class="['fixed z-40 bg-black/40 h-screen w-screen top-0 left-0 duration-300', {
        'block': visibleMobileMenu,
        'hidden': !visibleMobileMenu
      }]" @click="set_visible_mobile_menu(false)"
    />
    <div
      :class="['size-[28px] cursor-pointer rounded-full border flex items-center justify-center fixed bottom-[50%] z-50 bg-white hover:bg-coreBgMain duration-300', {
        '-left-[28px] sm:left-[248px]': !isCollapse && !visibleMobileMenu,
        '-left-[28px] sm:left-[66px]': isCollapse && !visibleMobileMenu,
        '-left-[28px]': visibleMobileMenu
      }]"
      @click="set_collapse(!isCollapse)"
    >
      <div class="size-5 flex items-center justify-center border-[1.5px] border-corePrimaryText text-corePrimaryText rounded-full">
        <i v-if="isCollapse" class="el-icon-right" />
        <i v-else class="el-icon-back" />
      </div>
    </div>
    <div
      :class="['border-r border-r-coreLightBorder h-full bg-white flex overflow-hidden flex-col duration-300 fixed sm:static z-40', {
        'w-0 sm:w-[262px]': !isCollapse && !visibleMobileMenu,
        'w-0 sm:w-[80px]': isCollapse && !visibleMobileMenu,
        'w-[262px] rounded-r-3xl': visibleMobileMenu
      }]"
    >
      <div :class="['pl-5 pt-4 pb-8']">
        <div class="h-12 flex flex-row items-center justify-center'">
          <img
            src="~assets/images/logo.jpg" :class="['duration-300 cursor-pointer rounded-full border', {
              'h-12': !isCollapse && !visibleMobileMenu,
              'h-10': isCollapse && !visibleMobileMenu,
              '!h-12': visibleMobileMenu
            }]" lazy @dblclick="handleClickLogo"
          >
          <p
            :class="['uppercase font-medium pl-1 normal whitespace-nowrap duration-300 text-[9px]', {
              'hidden': isCollapse && !visibleMobileMenu,
            }]"
          >
            <system-name />
          </p>
        </div>
      </div>
      <div class="px-4 flex flex-col gap-1">
        <template v-for="item in user_menus">
          <div v-if="item.apis && item.apis.length > 1" :key="item.group_id" class="flex flex-col gap-1">
            <el-popover
              placement="right-start"
              width="200"
              trigger="manual"
              :disabled="!isCollapse"
              :value="expandedGroups.includes(item.group_id) && !visibleMobileMenu"
            >
              <div
                v-if="isCollapse && !visibleMobileMenu"
                :class="['flex flex-col gap-1 overflow-hidden transition-[height] duration-200']"
              >
                <nuxt-link
                  v-for="api in item.apis"
                  :key="api.api_name"
                  :to="`${item.group_name}/${api.api_name}`"
                  class="overflow-hidden flex"
                >
                  <menu-item icon="el-icon-check" :is-active="activeMenu === `${item.group_name}/${api.api_name}`">
                    {{ api.api_title }}
                  </menu-item>
                </nuxt-link>
              </div>
              <menu-item
                slot="reference"
                :icon="item.group_icon"
                :is-expand="true"
                :is-expanded="expandedGroups.includes(item.group_id)"
                :is-group="true"
                :is-collapse="isCollapse"
                :hide-text="isCollapse && !visibleMobileMenu"
                @expand="handleExpandGroup(item.group_id)"
              >
                {{ item.group_title }}
              </menu-item>
            </el-popover>
            <div
              v-if="(!isCollapse || visibleMobileMenu) && expandedGroups.includes(item.group_id)"
              :class="['flex flex-col gap-1 overflow-hidden transition-[height] duration-200']"
            >
              <nuxt-link
                v-for="api in item.apis"
                :key="api.api_name"
                :to="`${item.group_name}/${api.api_name}`"
                class="overflow-hidden flex"
              >
                <menu-item icon="el-icon-check" :is-active="activeMenu === `${item.group_name}/${api.api_name}`">
                  {{ api.api_title }}
                </menu-item>
              </nuxt-link>
            </div>
          </div>
          <nuxt-link
            v-else
            :key="item.group_name"
            :to="`${item.group_name}${item.apis[0].api_name ? '/' + item.apis[0].api_name : ''}`"
          >
            <menu-item
              :icon="item.group_icon"
              :is-group="true"
              :is-active="activeMenu === `${item.group_name}${item.apis[0].api_name ? '/' + item.apis[0].api_name : ''}`"
              :hide-text="isCollapse && !visibleMobileMenu"
            >
              {{ item.group_title }}
            </menu-item>
          </nuxt-link>
        </template>
      </div>
    </div>
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="h-[72px] bg-coreBgHeader border-b border-b-coreLightBorder flex flex-row items-center px-4">
        <div class="flex sm:hidden items-center p-2 cursor-pointer" @click="set_visible_mobile_menu(true)">
          <i class="isax isax-menu-1 text-2xl" />
        </div>
        <div class="flex-1 px-2 items-center">
          <el-breadcrumb class="hidden sm:block" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">
              {{ currentMenu.group_title }}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentMenu.api_name" :to="{ path: `${currentMenu.group_name}/${currentMenu.api_name}` }">
              {{ currentMenu.api_title }}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentMenu.detail_name">
              {{ currentMenu.detail_name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="flex flex-row px-4 items-center gap-4">
          <!-- <nuxt-link :to="{ name: 'handbooks' }">
            <el-button type="text" title="Гарын авлага үзэх">
              <i class="isax isax-book-1 text-xl text-coreRegularText hover:text-corePrimaryText" />
            </el-button>
          </nuxt-link> -->
          <!-- <el-popover
            placement="bottom"
            width="325"
            trigger="click"
            popper-class="popper-notification"
          >
            <div class="flex flex-col font-medium text-coreRegularText">
              <div class="p-[12px] border-b">
                Мэдэгдэл
              </div>
              <nuxt-link v-for="i in 1" :key="i" to="/profile" :class="['p-[12px] border-b', {'bg-coreBgMain': i < 4}]">
                <div class="flex gap-2">
                  <div :class="['flex-1 break-normal']">
                    Санамсаргүй хуваарилах программд тавтай морилно уу.
                  </div>
                  <div v-if="i < 4" class="py-1">
                    <div class="size-2 rounded-full bg-coreDanger" />
                  </div>
                </div>
                <div class="text-end">
                  {{ $moment().format('YYYY-MM-DD') }}
                </div>
              </nuxt-link>
            </div>
            <el-button slot="reference" type="text" class="relative">
              <div class="bg-coreDanger absolute text-white px-[4px] py-[2px] rounded-lg top-0 -right-2 text-xs min-w-5">
                1
              </div>
              <i class="isax isax-notification4 text-xl text-coreRegularText hover:text-corePrimary" />
            </el-button>
          </el-popover> -->
          <!-- <div class="w-[1px] h-4 bg-coreBaseBorder" /> -->
          <el-popover
            v-model="visibleUserMenu"
            placement="bottom"
            width="250"
            trigger="click"
          >
            <div class="flex flex-col gap-1">
              <!-- <div
                class="h-[36px] cursor-pointer rounded flex flex-row items-center gap-2 px-4 hover:bg-corePrimary/[.3] text-coreRegularText hover:text-corePrimaryText leading-4"
                @click="handleHideProfile"
              >
                <i v-if="!hideProfile" class="isax isax-tick-circle text-lg break-normal" />
                <div v-else class="px-[1px]">
                  <div class="size-[16px] rounded-full border border-coreRegularText" />
                </div>
                <span class="break-normal text-left">Нүүр хуудсанд профайл харах</span>
              </div> -->
              <!-- <div v-if="user_positions.length > 1">
                <div
                  v-for="item in user_positions"
                  :key="item._id"
                  class="h-[36px] cursor-pointer rounded flex flex-row items-center gap-2 px-4 hover:bg-corePrimary/[.3] text-coreRegularText hover:text-corePrimaryText leading-4"
                  @click="set_user_position(item)"
                >
                  <i v-if="user_position._id === item._id" class="isax isax-tick-circle text-lg break-normal" />
                  <div v-else class="px-[1px]">
                    <div class="size-[16px] rounded-full border border-coreRegularText" />
                  </div>
                  <span class="break-normal text-left">{{ item.position_id.name }}</span>
                </div>
              </div> -->
              <nuxt-link :to="{ name: 'profile' }">
                <div class="h-[36px] cursor-pointer rounded flex flex-row items-center px-4 gap-2 hover:bg-corePrimary/[.3] text-coreRegularText hover:text-corePrimaryText">
                  <i class="isax isax-user-octagon text-lg" />
                  <span>Хэрэглэгчийн мэдээлэл</span>
                </div>
              </nuxt-link>
              <nuxt-link :to="{ name: 'changePassword' }">
                <div class="h-[36px] cursor-pointer rounded flex flex-row items-center gap-2 px-4 hover:bg-corePrimary/[.3] text-coreRegularText hover:text-corePrimaryText">
                  <i class="isax isax-key text-lg" />
                  <span>Нууц үг солих</span>
                </div>
              </nuxt-link>
              <div
                class="h-[36px] cursor-pointer rounded flex flex-row items-center gap-2 px-4 hover:bg-corePrimary/[.3] text-coreRegularText hover:text-corePrimaryText"
                @click="logout"
              >
                <i class="isax isax-logout text-lg" />
                <span>Программаас гарах</span>
              </div>
            </div>
            <el-button v-if="user" slot="reference" size="small" class="text-coreRegularText">
              {{ user.surname ? user.surname.slice(0, 1) + '.' : '' }}{{ user.given_name }}
              <i :class="['el-icon-arrow-down duration-200', { '-rotate-180': visibleUserMenu }]" />
            </el-button>
          </el-popover>
        </div>
      </header>
      <!-- <div class="px-4 pt-4 block sm:hidden">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">
            {{ currentMenu.group_title }}
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentMenu.api_name" :to="{ path: `${currentMenu.group_name}/${currentMenu.api_name}` }">
            {{ currentMenu.api_title }}
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentMenu.detail_name">
            {{ currentMenu.detail_name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div> -->
      <main id="main" class="bg-coreBgMain flex-1 overflow-auto">
        <div class="bg-top-4 bg-left bg-no-repeat h-full">
          <div class="min-h-full h-full bg-coreBgMain bg-opacity-90 py-4 px-1 sm:px-4">
            <nuxt />
          </div>
        </div>
      </main>
    </div>
    <pdf-dialog />
  </div>
</template>
<script>
import { get } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import middleware from '@/../core-components/middleware/auth'
export default {
  name: 'LayoutDefault',
  middleware,
  data () {
    return {
      resizeTimeout: 0,
      visibleUserMenu: false,
      expandedGroups: []
    }
  },
  computed: {
    ...mapGetters(['user_positions', 'user_position', 'user_menus']),
    ...mapGetters('settings', ['isCollapse', 'pageTitle', 'visibleMobileMenu']),
    ...mapGetters('user', ['token', 'hideProfile', 'user']),
    currentMenu () {
      const paths = this.$route.path.split('/')
      const groupName = get(paths, '[1]')
      const apiName = get(paths, '[2]')
      const detailName = get(paths, '[3]') ? 'Дэлгэрэнгүй' : ''
      const group = this.user_menus.find(c => c.group_name === '/' + groupName) || {}
      const api = group && apiName && group.apis ? group.apis.find(c => c.api_name === apiName) || {} : {}
      return {
        index: apiName ? `/${groupName}/${apiName}` : `/${groupName}`,
        group_id: group.group_id,
        group_title: group.group_title,
        group_name: group.group_name,
        api_title: api.api_title,
        api_name: api.api_name,
        detail_name: this.pageTitle || detailName
      }
    },
    activeMenu () {
      return this.currentMenu.index
    },
    group () {
      return get(this.currentMenu, 'group')
    }
  },
  watch: {
    token (val) {
      if (!val) {
        this.$alert('Та дахин нэвтэрнэ үү.', 'Холболт саллаа.', { type: 'warning' })
      }
    },
    $route () {
      this.visibleUserMenu = false
      this.handleHideMenu()
      this.set_visible_mobile_menu(false)
    },
    isCollapse () {
      this.handleHideMenu()
    }
  },
  mounted () {
    // const notify = this.$notify({
    //   type: 'info',
    //   title: 'Танд шинэ хэрэг хуваарилагдлаа',
    //   message: 'өбыйхөбыйро',
    //   position: 'bottom-right',
    //   onClick: () => {
    //     notify.close()
    //     this.$message({ message: 'clicked', type: 'success' })
    //   }
    // })
    if (!this.isCollapse) {
      this.expandedGroups.push(this.currentMenu.group_id)
    }
    this.set_window_size({ height: window.innerHeight, width: window.innerWidth })
    window.addEventListener('resize', this.handleResize)
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    ...mapActions('settings', ['set_collapse', 'set_window_size', 'set_visible_mobile_menu']),
    ...mapActions('user', ['logout', 'set_hide_profile']),
    handleHideProfile () {
      this.visibleUserMenu = false
      this.$router.push({ name: 'index' })
      this.set_hide_profile(!this.hideProfile)
    },
    handleExpandGroup (groupId) {
      const index = this.expandedGroups.indexOf(groupId)
      if (index > -1) {
        this.expandedGroups.splice(index, 1)
      } else {
        this.expandedGroups.push(groupId)
      }
    },
    handleResize () {
      this.handleHideMenu()
      clearTimeout(this.resizeTimeout)
      if (this.visibleMobileMenu) {
        this.set_visible_mobile_menu(window.innerWidth <= 640)
      }
      this.resizeTimeout = setTimeout(() => this.set_window_size({ height: window.innerHeight, width: window.innerWidth }), 1000)
    },
    handleHideMenu () {
      if (this.isCollapse) {
        this.expandedGroups = []
      }
    },
    handleClickLogo () {
      this.set_collapse(!this.isCollapse)
    }
  }
}
</script>
