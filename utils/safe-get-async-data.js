import { getAsyncData } from 'eztech-core-components/utils/table-helper'

const emptyAsyncData = {
  configProjectId: null,
  project: null,
  table: null,
  columns: [],
  configTableName: null,
  configColFields: [],
  hasPassword: null,
  refColumns: [],
  subColumn: null,
  parentRow: null,
  api_id: null,
  api_title: null,
  locales: []
}

export async function safeGetAsyncData (opts) {
  try {
    return await getAsyncData(opts)
  } catch (err) {
    const status = err?.response?.status
    console.error('safeGetAsyncData', opts?.tableName, status || err?.message || err)
    if (process.server && opts?.error) {
      if (status === 401 || status === 403) {
        opts.error({ statusCode: 401, message: 'Нэвтрэх шаардлагатай' })
      } else {
        opts.error({ statusCode: status || 500, message: 'Өгөгдөл ачаалахад алдаа гарлаа' })
      }
    }
    return emptyAsyncData
  }
}
