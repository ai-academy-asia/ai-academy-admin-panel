<template>
  <div class="w-full flex flex-col">
    <div class="pb-[12px] text-xs text-coreSecondaryText">
      Үндсэн бүртгэлийн статистик тоо бүртгэлүүд:
    </div>
    <div class="flex flex-row flex-wrap gap-4 w-full">
      <div v-for="item in list" :key="item.title" class="flex-1 min-w-[180px] bg-white rounded whitespace-nowrap overflow-hidden">
        <div class="flex flex-row items-center text-xs text-coreSecondaryText px-4 pt-[12px] rounded gap-2 flex-1 overflow-hidden" :style="`border-top: 4px solid ${item.color}`">
          <div class="flex-1 font-bold">
            {{ item.title }}
          </div>
          <i :class="[item.icon, 'text-base']" />
        </div>
        <div class="text-corePrimary text-3xl px-4 font-bold pb-[12px]">
          {{ counts[item.key] || 0 }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
export default {
  props: {
    counts: { type: Object, default: () => { return {} } },
    list: {
      type: Array, default: () => {
        return [
          { title: 'ЦЭЦИЙН ГИШҮҮН', count: '9', color: '#316A9A', icon: 'isax isax-attach-circle', key: 'countMembers' },
          { title: 'БҮРТГЭЛИЙН ТОО', count: '199', color: '#F4BF4F', icon: 'isax isax-attach-circle', key: 'countRegs' },
          { title: 'АЛГАСАХ НӨХЦӨЛИЙН ТОО', count: '68', color: '#9747FF', icon: 'isax isax-attach-circle', key: 'countLeaves' },
          { title: 'ХУВААРИЛАЛТ ШИНЭЭР ЭХЛҮҮЛЭХ', count: '1', color: '#97C8EB', icon: 'isax isax-attach-circle', key: 'countSettings' }
        ]
      }
    }
  }
}
</script>
