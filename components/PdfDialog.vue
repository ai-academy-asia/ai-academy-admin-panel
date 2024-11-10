<template>
  <el-dialog :visible.sync="visible" title="Хэвлэх" width="900px" class="dialog-pdf">
    <div v-if="loading" class="bg-[#525659] px-20 h-[900px] flex items-center justify-center text-slate-200 text-lg font-medium gap-2">
      <i class="el-icon-loading" /> Түр хүлээнэ үү..
    </div>
    <iframe
      v-else-if="visible"
      :src="href"
      width="100%"
      height="900px"
      frameborder="0"
    />
  </el-dialog>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      loading: false,
      href: null
    }
  },
  computed: {
    ...mapGetters('settings', ['env']),
    ...mapGetters(['pdfUrl']),
    visible: {
      get () {
        return !!this.pdfUrl
      },
      set () {
        this.set_pdf_url(null)
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.handlePrint()
      }
    }
  },
  methods: {
    ...mapActions(['set_pdf_url']),
    async handlePrint () {
      try {
        this.loading = true
        this.href = null
        const response = (await this.$axios.get(this.pdfUrl, {
          responseType: 'blob'
        }))
        this.href = URL.createObjectURL(response.data)
      } catch (err) {
        this.$showErrorBlob(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
