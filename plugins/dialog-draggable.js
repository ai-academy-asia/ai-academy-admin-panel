import Vue from 'vue'
import drag from 'eztech-core-components/directives/el-dragDialog/drag'
const install = function (Vue) {
  Vue.directive('el-drag-dialog', drag)
}
window['el-drag-dialog'] = drag
Vue.use(install)
drag.install = install
export default drag
