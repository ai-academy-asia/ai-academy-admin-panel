/**
 * CKEditor image upload: use XHR (not form/iframe) so CSP does not block the dialog.
 * Sends cookies for auth; field name must be "upload" (backend multer).
 */
function attachCkeditorUpload () {
  const CK = window.CKEDITOR
  if (!CK) {
    return false
  }
  const uploadUrl = `${window.location.origin}/api/file/upload/ckeditor?upload=1`

  CK.on('instanceReady', (ev) => {
    const editor = ev.editor
    editor.config.filebrowserUploadMethod = 'xhr'
    editor.config.filebrowserImageUploadUrl = uploadUrl
    editor.config.filebrowserUploadUrl = uploadUrl
    editor.config.imageUploadURL = uploadUrl
    editor.config.uploadUrl = uploadUrl
    if (!editor.config.dataParser) {
      editor.config.dataParser = (data) => {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data
        return parsed.url
      }
    }
  })

  CK.on('fileUploadRequest', (ev) => {
    const loader = ev.data.fileLoader
    if (loader?.xhr) {
      loader.xhr.withCredentials = true
    }
  })

  return true
}

export default () => {
  if (!attachCkeditorUpload()) {
    const interval = setInterval(() => {
      if (attachCkeditorUpload()) {
        clearInterval(interval)
      }
    }, 300)
    setTimeout(() => clearInterval(interval), 60000)
  }
}
