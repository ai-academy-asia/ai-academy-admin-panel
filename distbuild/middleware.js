const middleware = {}

middleware['auth'] = require('../middleware/auth.js')
middleware['auth'] = middleware['auth'].default || middleware['auth']

middleware['confirm-leave'] = require('../middleware/confirm-leave.js')
middleware['confirm-leave'] = middleware['confirm-leave'].default || middleware['confirm-leave']

export default middleware
