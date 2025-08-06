import Vue from 'vue'
import axios from 'axios'
const _ = require('lodash')
// HTML код шалгах regex
const patternHtml = /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i

// Custom error class
class CustomError extends Error {
  constructor (message, options = {}) {
    super(message)
    this.status = options.status || 403
    this.type = options.type || 'warning'
    this.hideMessage = options.hideMessage || false
    this.isCustomError = options.isCustomError ?? true
    this.notCatch = options.notCatch
    this.workingUrl = options.workingUrl
  }
}
export default ({ store }, inject) => {
  if (process.server) { return } // зөвхөн client дээр ажиллуулна

  // prevent submit directive
  Vue.directive('submitPreventDefault', {
    inserted (el) {
      el.addEventListener('submit', (ev) => {
        ev.preventDefault()
      })
    }
  })

  // === Helper functions ===
  const log = (...args) => console.log(...args)
  const warn = (...args) => console.warn(...args)
  const errLog = (...args) => console.error(...args)

  const showErrorBlob = (error) => {
    if (error.response && error.response.data) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = JSON.parse(reader.result)
        Vue.prototype.$message.warning(result.message)
      }
      reader.readAsText(error.response.data)
    } else {
      Vue.prototype.$message.warning(error.message)
    }
  }

  const showError = (err, options = { hideMessage: false }) => {
    if (axios.isCancel(err)) { return 'CANCELLED' }

    const isStoreWarning = _.has(store.getters, 'warning')
    let message = _.get(err, 'response.data.message') || err
    if (message === 'cancel') { return '' }

    let hideMessage = options.hideMessage
    const type = 'warning'

    if (err.isCustomError) {
      message = err.message
      hideMessage = hideMessage || err.hideMessage
    }
    if (!message) {
      message = err.message
      errLog(err)
    }
    if (!hideMessage && !isStoreWarning && message) {
      Vue.prototype.$message({ type, message, dangerouslyUseHTMLString: true, showClose: true })
    }
    if (isStoreWarning && !hideMessage) {
      store.dispatch('set_warning', message)
    }
    return message
  }

  const showConfirm = (text, title = 'Асуулт', options) => {
    const dangerouslyUseHTMLString = patternHtml.test(text)
    return Vue.prototype.$confirm(text, title, Object.assign({
      dangerouslyUseHTMLString,
      confirmButtonText: 'Тийм',
      cancelButtonText: 'Үгүй',
      type: 'info',
      roundButton: true,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      showClose: false
    }, options))
  }

  const customError = (msg, options) => {
    throw new CustomError(msg, options)
  }

  const showSuccess = (text, options = {}) => {
    const isStoreSuccess = _.has(store.getters, 'success')
    const dangerouslyUseHTMLString = patternHtml.test(text)
    if (!isStoreSuccess) {
      Vue.prototype.$message(Object.assign({ message: text, type: 'success', showClose: true }, options, { dangerouslyUseHTMLString }))
    } else {
      store.dispatch('set_success', text)
    }
  }

  const validateForm = (refForm, { hideMessage } = {}) => {
    if (!refForm) { throw new Error('required form') }
    return new Promise((resolve, reject) => {
      Vue.prototype.$nextTick(() => {
        refForm.validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject(new CustomError('Шаардлагатай талбаруудыг бөглөнө үү.', { hideMessage }))
          }
        })
      })
    })
  }

  const push = function (to, { isExternal, baseExternalLink } = {}) {
    if (isExternal) {
      location.href = baseExternalLink + '/' + to.name
    } else {
      this.$router.push(to)
    }
  }

  // === Бүх method-ууд ===
  const methods = {
    log, warn, error: errLog,
    showErrorBlob, showError, showConfirm,
    customError, showSuccess, validateForm, push
  }

  // === Давхар define хийхээс хамгаалалттай function ===
  const defineVueProperty = (name, value) => {
    if (!Object.prototype.hasOwnProperty.call(Vue.prototype, `$${name}`)) {
      Object.defineProperty(Vue.prototype, `$${name}`, { value })
    }
  }

  // === inject + Vue.prototype ===
  for (const key in methods) {
    inject(key, methods[key]) // store/middleware дотор
    defineVueProperty(key, methods[key]) // component дотор
  }
}
