<template>
  <div class="w-full flex flex-col items-center pb-40">
    <div class="flex flex-col gap-4 max-w-2xl w-full">
      <div class="p-2 sm:p-4 rounded bg-white items-center flex flex-row gap-2 flex-wrap">
        <div class="flex-1 min-w-52">
          Сайн байна уу?. Та <strong>Админ</strong> эрхтэй байна.
        </div>
        <div class="flex flex-row gap-2">
          <div>
            <el-button size="small" @click="() => handleCreate('create')">
              <div class="flex flex-row items-center gap-1">
                <i class="isax isax-add text-base" />
                Мэдээлэл нэмэх
              </div>
            </el-button>
          </div>
          <div>
            <el-button size="small" :disabled="loading" @click="handleRefresh">
              <div class="flex flex-row items-center gap-1">
                <i class="isax isax-refresh text-base" />
              </div>
            </el-button>
          </div>
        </div>
      </div>
      <div v-for="item in list" :key="item._id" class="rounded bg-white shadow-lg w-full gap-2 flex flex-col py-4">
        <div class="flex flex-row justify-between px-2 sm:px-4 items-center gap-2 ">
          <div class="flex-1 flex gap-2 items-center">
            <div class="size-8 rounded-full bg-coreBgMain text-sm text-coreSecondaryText flex items-center justify-center">
              <img
                v-if="item.created_by.image"
                :src="`/api/file/${item.created_by.image?._id || item.created_by.image}`"
                class="rounded-full object-cover  w-full h-full"
              >
              <span v-else>{{ item.created_by.given_name.slice(0, 1) }}</span>
            </div>
            <div>
              <div class="text-sm text-corePrimaryText">
                {{ item.created_by.full_name }}
              </div>
            </div>
          </div>
          <div v-if="item.is_all" class="text-coreRegularText font-medium text-xs flex items-center gap-1">
            <div class="bg-gray-50 border border-gray-200 rounded px-1">
              Нийт
            </div>
          </div>
          <div class="text-coreSecondaryText text-xs flex items-center gap-1">
            <i class="isax isax-calendar-1 text-lg" />
            <span>{{ item.created_at?.$datetime() }}</span>
          </div>
        </div>
        <div
          v-if="item.description" :class="['flex flex-col gap-2 px-2 sm:px-4 whitespace-pre-wrap', {
            'text-3xl': !item.image && item.description.length < 100,
            'text-2xl': !item.image && item.description.length >= 100
          }]"
        >
          <div>{{ item.description }}</div>
        </div>
        <img v-if="item.image" :src="`/api/file/${item.image?._id || item.image}`" class="flex-1 object-cover object-top rounded-t-lg  w-full h-auto max-h-96">
        <div class="px-4 flex flex-row justify-end items-start gap-1 items-center">
          <div v-if="!item.is_all" class="text-xs text-coreRegularText flex flex-row flex-wrap gap-1">
            <div v-for="r in item.students" :key="r._id" class="bg-gray-50 border border-gray-200 rounded px-1">
              {{ r.given_name }}
            </div>
          </div>
          <el-button v-if="item.created_by._id === user._id" plain size="mini" icon="el-icon-edit" circle @click="() => handleCreate(item._id)" />
        </div>
        <div class="border-t px-2 sm:px-4 flex gap-2 sm:gap-6 text-coreSecondaryText text-sm leading-3 pt-4 whitespace-nowrap">
          <div class="flex-1 flex flex-row gap-6">
            <div class="flex gap-1 items-center cursor-pointer hover:text-corePrimaryText" @click="handleLike(item)">
              <i class="isax isax-like-1 text-coreDanger text-base" />
              <span>
                <span v-if="item.likeId" class="text-coreDanger">Танилцсан</span>
                <span v-else>Танилцлаа</span>
                <span v-if="item.likeCount"> ({{ item.likeCount }})</span>
              </span>
            </div>
            <div class="flex gap-1 items-center cursor-pointer hover:text-corePrimaryText" @click="item.isShow = !item.isShow">
              <i class="isax isax-messages-1 text-coreWarning  text-base" />
              <span>Сэтгэгдэл<span v-if="item.commentCount" class="pl-1"> ({{ item.commentCount }})</span></span>
            </div>
          </div>
          <div v-if="item.viewCount" class="flex gap-1 items-center cursor-pointer hover:text-corePrimaryText">
            <i class="isax isax-eye text-coreSecondaryText text-base" />
            <span>({{ item.viewCount }})</span>
          </div>
        </div>
        <el-collapse-transition>
          <div v-if="item.isShow" class="px-2 sm:px-10 flex flex-col gap-2 pt-2 max-h-80 overflow-y-auto">
            <el-input
              v-model="item.commentText"
              size="small"
              placeholder="Сэтгэгдэл үлдээх..."
              prefix-icon="el-icon-edit"
              @keydown.native.enter="() => handleComment(item)"
            >
              <el-button slot="append" icon="el-icon-check" :loading="item.commenting" @click="() => handleComment(item)">
                Илгээх
              </el-button>
            </el-input>
            <div v-for="reaction in item.reactions" :key="reaction._id">
              <div class="flex-1 flex gap-2 items-center border rounded-lg p-2">
                <div class="size-6 rounded-full bg-coreBgMain text-sm text-coreSecondaryText flex items-center justify-center">
                  <img
                    v-if="reaction.created_by.image"
                    :src="`/api/file/${reaction.created_by.image?._id || reaction.created_by.image}`"
                    class="rounded-full object-cover w-full h-full"
                  >
                  <span v-else>{{ reaction.created_by.given_name.slice(0, 1) }}</span>
                </div>
                <div>
                  <div class="text-xs text-coreSecondaryText">
                    <span>{{ reaction.created_by.full_name || (reaction.created_by.surname?.slice(0, 1) + '.' + reaction.created_by.given_name) }} - {{ reaction.type_id.name }} - {{ item.created_at?.$datetime() }}</span>
                    <span v-if="reaction.created_by._id === user._id && reaction.type_id.code === '03'" class="underline hover:text-coreRegularText cursor-pointer" @click="() => handleDelete(item, reaction)">
                      Устгах
                    </span>
                  </div>
                  <div v-if="reaction.description" class="text-sm text-corePrimaryText">
                    {{ reaction.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <div v-if="isMore" class="text-center pb-20">
        <el-button type="text" icon="el-icon-arrow-down" :loading="loading" @click="handleMore">
          Цааш үзэх
        </el-button>
      </div>
      <div v-else-if="loading">
        <core-loader />
      </div>
    </div>
  </div>
</template>
<script>
import { has } from 'lodash'
import { mapGetters } from 'vuex'
export default {
  name: 'DashTeacher',
  data () {
    return {
      list: [],
      loading: false,
      isMore: false,
      liking: false
    }
  },
  computed: {
    ...mapGetters('user', ['user'])
  },
  mounted () {
    this.handleRefresh()
  },
  methods: {
    handleCreate (id) {
      this.$router.push({ path: `/info/service_informations/${id}` })
    },
    async handleRefresh () {
      try {
        this.loading = true
        this.list = []
        this.isMore = false
        const list = await this.getInformationAll()
        this.isMore = list.length >= 10
        this.list = list
      } catch (err) {
        this.$showError(err)
      } finally {
        this.loading = false
      }
    },
    async handleMore () {
      try {
        this.loading = true
        const list = await this.getInformationAll()
        this.isMore = list.length >= 10
        this.list = [...this.list, ...list]
      } catch (err) {
        this.$showError(err)
      } finally {
        this.loading = false
      }
    },
    async getInformationAll () {
      const { data: informations } = await this.$axios.get('list/8/informations', {
        params: {
          offset: this.list.length,
          pageSize: 10,
          extraFields: 'created_by.image,created_by.full_name'
        }
      })
      if (informations.length > 0) {
        const { data: informationReactions } = await this.$axios.get('list/8/information_reactions', {
          params: {
            extraFields: 'created_by.image,created_by.full_name',
            search: {
              information_id: { val: informations.map(c => c._id), t: 'number', op: 'in' }
            }
          }
        })
        for (const r of informations) {
          r.reactions = [...informationReactions.filter(c => c.information_id._id === r._id)]
          this.setInformationReaction(r)
        }
      }
      return [...informations]
    },
    async handleDelete (r, reaction) {
      try {
        await this.$showConfirm('Та өөрийн сэтгэгдлийг устгах уу?')
        await this.saveReaction(r, { _id: reaction._id, description: r.commentText, information_id: r._id, type_id: 3 })
        this.$showSuccess('Амжилттай.')
      } catch (err) {
        this.$showError(err)
      }
    },
    async handleComment (r) {
      try {
        if (r.commenting) {
          return
        }
        if (!r.commentText?.trim()) {
          this.$customError('Утга оруулна уу..')
        }
        r.commenting = true
        await this.saveReaction(r, { description: r.commentText, information_id: r._id, type_id: 3 })
        this.$showSuccess('Баярлалаа')
      } catch (err) {
        this.$showError(err)
      } finally {
        r.commenting = false
      }
    },
    async handleLike (r) {
      try {
        if (r.liking) {
          return
        }
        r.liking = true
        await this.saveReaction(r, { _id: r.likeId, information_id: r._id, type_id: 2 })
        this.$showSuccess('Баярлалаа')
      } catch (err) {
        this.$showError(err)
      } finally {
        r.liking = false
      }
    },
    async saveReaction (r, item) {
      if (item._id) {
        await this.$axios.delete(`8/information_reactions/${item._id}`)
        const index = r.reactions.findIndex(c => c._id === item._id)
        r.reactions.splice(index, 1)
      } else {
        const { data } = await this.$axios.post('8/information_reactions', { ...item })
        r.reactions.unshift({ ...data })
      }
      this.setInformationReaction(r)
    },
    setInformationReaction (r) {
      r.viewCount = r.reactions.filter(c => c.type_id.code === '01').length
      r.likeCount = r.reactions.filter(c => c.type_id.code === '02').length
      r.commentCount = r.reactions.filter(c => c.type_id.code === '03').length
      r.likeId = r.reactions.find(c => c.type_id.code === '02' && c.created_by._id === this.user._id)?._id
      r.liking = false
      r.commentText = ''
      r.commenting = false
      if (!has(r, 'isShow')) {
        r.isShow = false
      }
    }
  }
}
</script>
