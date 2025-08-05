import Vue from 'vue'
import moment from 'moment'
import axios from 'axios'
const _ = require('lodash')

const patternHtml = /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i
class CustomError extends Error {
  constructor (message, options = {}) {
    super(message)
    this.status = options.status || 403
    this.type = options.type || 'warning'
    this.hideMessage = options.hideMessage || false
    this.isCustomError = options.isCustomError || true
    this.notCatch = options.notCatch
    this.workingUrl = options.workingUrl
  }
}
/* eslint-disable */
Number.prototype.$format = function () {
  return new Intl.NumberFormat('mn-MN', { maximumFractionDigits: 2 }).format(this)
}

String.prototype.$format = function () {
  const parsedNumber = this.replace(/,/g, '') // Remove existing commas
  if (parsedNumber && !isNaN(parsedNumber)) {
    return new Intl.NumberFormat('mn-MN', { maximumFractionDigits: 2 }).format(Number(parsedNumber))
  }
  return this
}

String.prototype.$date = function () {
  return moment(this).isValid() ? moment(this).format('YYYY/MM/DD') : '-'
}
String.prototype.$datetime = function () {
  return moment(this).isValid() ? moment(this).format('YYYY/MM/DD HH:ss') : '-'
}
String.prototype.$number = function () {
  const parsedNumber = this.replace(/,/g, '')
  if (parsedNumber && !isNaN(parsedNumber)) {
    return Number(parsedNumber)
  }
  return this
}
String.prototype.$postmanLink = function () {
  return this.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  .replace(/\[(.*?)\]/g, '')
  .replace(/[\(](\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])[\)]/ig, '<a class="underline text-blue-500" href="$1" target="_blank">$1</a>')
}
/* eslint-enable */
export default ({ store }) => {
  Vue.directive('submitPreventDefault', {
    inserted (el) {
      el.addEventListener('submit', (ev) => {
        ev.preventDefault()
      })
    }
  })
  Vue.prototype.$log = (...args) => {
    console.log(...args) // eslint-disable-line no-console
  }
  Vue.prototype.$error = (...args) => {
    console.error(...args) // eslint-disable-line no-console
  }
  Vue.prototype.$warn = (...args) => {
    console.warn(...args) // eslint-disable-line no-console
  }
  Vue.prototype.$showErrorBlob = (error, options = { hideMessage: false }) => {
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

  Vue.prototype.$showError = (err, options = { hideMessage: false }) => {
    if (axios.isCancel(err)) {
      return 'CANCELLED'
    }
    const isStoreWarning = _.has(store.getters, 'warning')
    let message = _.get(err, 'response.data.message') || err
    if (message === 'cancel') {
      return ''
    }
    let hideMessage = options.hideMessage
    const type = 'warning'
    if (err.isCustomError) {
      message = err.message
      hideMessage = hideMessage || err.hideMessage
    }
    if (!message) {
      message = err.message
      Vue.prototype.$error(err)
    }
    if (!hideMessage && !isStoreWarning && message) {
      Vue.prototype.$message({ type, message, dangerouslyUseHTMLString: true, showClose: true })
    }
    if (isStoreWarning && !hideMessage) {
      store.dispatch('set_warning', message)
    }
    return message
  }
  Vue.prototype.$showConfirm = (text, title = 'Асуулт', options) => {
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
  Vue.mixin({
    methods: {
      $push (to, { isExternal, baseExternalLink } = {}) {
        if (isExternal) {
          location.href = baseExternalLink + '/' + to.name
        } else {
          this.$router.push(to)
        }
      },
      $customError: (msg, options) => {
        throw new CustomError(msg, options)
      },
      $showSuccess: (text, options = {}) => {
        const isStoreSuccess = _.has(store.getters, 'success')
        const dangerouslyUseHTMLString = patternHtml.test(text)
        if (!isStoreSuccess) {
          Vue.prototype.$message(Object.assign({ message: text, type: 'success', showClose: true }, options, { dangerouslyUseHTMLString }))
        } else {
          store.dispatch('set_success', text)
        }
      },
      $validateForm (refForm, { hideMessage } = {}) {
        if (!refForm) {
          throw new Error('required form')
        }
        return new Promise((resolve, reject) => {
          Vue.prototype.$nextTick(() => {
            refForm.validate((valid) => { if (valid) { resolve() } else { reject(new CustomError('Шаардлагатай талбаруудыг бөглөнө үү.', { hideMessage })) } })
          })
        })
      }
    }
  })
}
