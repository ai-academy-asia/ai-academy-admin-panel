import auth from 'eztech-core-components/middleware/auth'

export default (ctx) => {
  return auth(ctx)
}
