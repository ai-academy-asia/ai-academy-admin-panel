<template>
  <div
    :class="['select-none flex flex-row items-center justify-center gap-[12px] px-[12px] py-2 text-coreRegularText w-full rounded hover:bg-corePrimary/[.3] hover:text-corePrimaryText cursor-pointer', {
      'bg-corePrimary/[.3] !text-corePrimaryText': isCollapse && isExpanded,
      '!bg-corePrimary !text-white': isActive
    }]"
    @click="isExpand ? $emit('expand') : null"
  >
    <div class="w-5 flex justify-end items-center ">
      <i
        :class="[icon, {
          'text-xl': isGroup
        }]"
      />
    </div>
    <div v-if="showText" :class="['flex-1 text-sm font-medium flex items-center leading-4 break-normal whitespace-normal text-left']">
      <slot />
    </div>
    <div v-if="isExpand && showText">
      <i
        :class="['el-icon-arrow-down duration-200', {
          '-rotate-180': isExpanded
        }]"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: ['icon', 'isExpand', 'isGroup', 'isActive', 'isExpanded', 'hideText', 'isCollapse'],
  data () {
    return {
      showText: false
    }
  },
  watch: {
    hideText (val) {
      if (val) {
        this.showText = false
      } else {
        setTimeout(() => {
          this.showText = true
        }, 300)
      }
    }
  },
  created () {
    this.showText = !this.hideText
  }
}
</script>
