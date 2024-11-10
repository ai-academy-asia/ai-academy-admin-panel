<template>
  <div class="flex flex-col items-center w-full pb-4">
    <el-form
      v-if="item"
      ref="form"
      :model="item"
      :rules="rules"
      :label-width="`140px`"
      label-position="left"
      class="max-w-full !w-[700px] rounded bg-white p-10 label-position-left"
    >
      <el-form-item label="Одоогийн нууц үг" prop="oldPassword">
        <el-input v-model="item.oldPassword" type="password" size="small" show-password />
      </el-form-item>
      <el-form-item label="Шинэ нууц үг" type="password" prop="newPassword">
        <el-input v-model="item.newPassword" size="small" show-password />
      </el-form-item>
      <el-form-item label="Шинэ нууц үг давтах" type="password" prop="confirmPassword">
        <el-input v-model="item.confirmPassword" size="small" show-password />
      </el-form-item>
      <div class="flex justify-center">
        <el-button
          :loading="loading"
          plain
          type="success"
          size="small"
          icon="el-icon-check"
          @click="handleSave"
        >
          Нууц үг солих
        </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      title: 'Нууц үг солих',
      loading: false,
      rules: {
        newPassword: [{ required: true, message: 'Утга оруулна уу.' }],
        oldPassword: [{ required: true, message: 'Утга оруулна уу.' }],
        confirmPassword: [{ required: true, message: 'Утга оруулна уу.' }]
      },
      defaultItem: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      item: null
    }
  },
  head () {
    return {
      title: this.title
    }
  },
  created () {
    this.resetTemp()
  },
  mounted () {
    this.set_page_title(this.title)
  },
  destroyed () {
    this.set_page_title('')
  },
  methods: {
    ...mapActions('settings', ['set_page_title']),
    ...mapActions('user', ['set_required_password']),
    resetTemp () {
      this.item = Object.assign({}, this.defaultItem)
    },
    async handleSave () {
      try {
        if (this.loading) {
          return
        }
        await this.$validateForm(this.$refs.form)
        this.loading = true
        const { data } = await this.$axios.post('auth/change/password', this.item)
        this.$showSuccess(data.message)
        this.set_required_password(false)
        this.$router.push({ path: '/' })
        // this.resetTemp()
      } catch (err) {
        this.$showError(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
