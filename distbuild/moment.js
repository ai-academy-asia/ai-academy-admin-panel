import moment from 'moment'

import 'moment/locale/mn'

export default (ctx, inject) => {
  ctx.$moment = moment
  inject('moment', moment)
}
