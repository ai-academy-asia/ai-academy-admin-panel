<template>
  <div class="w-full flex flex-col gap-y-4">
    <div>Мэдээлэл</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
      <div
        v-for="item in list"
        :key="item._id"
        class="flex flex-col gap-[12px] bg-white rounded pt-4"
      >
        <div class="flex flex-row justify-between px-4 items-center">
          <div class="flex gap-2 items-center">
            <div class="size-8 rounded-full bg-coreBgMain text-sm text-coreSecondaryText flex items-center justify-center">
              <img v-if="item.created_by?.image" class="size-8 rounded-full object-cover" :src="`${env.baseUrl}/file/${(item.created_by?.image?._id || item.created_by?.image)}`">
              <span v-else>{{ item.created_by?.full_name?.slice(0, 1) }}</span>
            </div>
            <div>
              <div class="text-sm text-corePrimaryText">
                {{ item.created_by?.full_name }}
              </div>
            </div>
          </div>
          <div class="text-coreSecondaryText text-xs">
            <i class="isax isax-calendar-1" />
            <span v-if="item.created_at">{{ item.created_at?.$datetime() }}</span>
          </div>
        </div>
        <div class="text-sm px-4 min-h-10 line-clamp-2">
          {{ item.title }}
        </div>
        <div class="px-4">
          <!-- <nuxt-link :to="{ name: 'news-id', params: { id: item._id } }"> -->
            <img class="w-full aspect-video object-cover" :src="`${env.baseUrl}/file/${(item.image?._id || item.image)}`">
          <!-- </nuxt-link> -->
        </div>
        <!-- <div class="border-t px-4 py-[12px] flex justify-center gap-6 text-coreSecondaryText text-sm leading-3">
          <div class="flex gap-2 items-center cursor-pointer hover:text-corePrimaryText" @click="handleLike(item)">
            <i class="isax isax-like-1 text-coreDanger text-base" />
            <span>Таалагдлаа</span>
          </div>
          <nuxt-link :to="{ name: 'news-id', params: { id: item._id }, hash: '#comment' }">
            <div class="flex gap-2 items-center cursor-pointer hover:text-corePrimaryText">
              <i class="isax isax-messages-1 text-coreWarning  text-base" />
              <span>Сэтгэгдэл</span>
            </div>
          </nuxt-link>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    list: { type: Array, default: () => { return [] } }
  },
  computed: {
    ...mapGetters('settings', ['env'])
  },
  methods: {
    handleLike (item) {
      try {
        if (this.loadingLike) {
          return
        }
        this.loadingLike = true
        // const { data } = await this.$axios.get(`increment/5/scl_news/count_like/${item._id}`, { progress: false })
        // if (data) {
        //   item.count_like++
        // }
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
