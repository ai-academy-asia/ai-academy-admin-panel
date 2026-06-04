/**
 * Google Photos / album share URLs are HTML pages, not image files.
 * CKEditor cannot show them in <img src="..."> — guide editors to Upload.
 */
const BLOCKED_URL = /photos\.google\.com|photos\.app\.goo\.gl|goo\.gl\/[a-zA-Z]/i

const MESSAGE =
  'Энэ холбоос зураг биш, вэб хуудас юм (Google Photos). ' +
  'Зураг оруулахын тулд: (1) дээрх "Зураг" талбарт файл upload хийнэ, эсвэл ' +
  '(2) энэ цонхны "Upload" табаас компьютерээсээ сонгоно. ' +
  'Шууд .jpg / .png URL л ажиллана.'

function attachGuard () {
  const CK = window.CKEDITOR
  if (!CK) {
    return false
  }
  CK.on('dialogDefinition', (ev) => {
    if (ev.data.name !== 'image') {
      return
    }
    const definition = ev.data.definition
    const previousOnOk = definition.onOk
    definition.onOk = function onOkWithUrlCheck () {
      const url = (
        this.getValueOf('info', 'txtUrl') ||
        this.getValueOf('Link', 'txtUrl') ||
        ''
      ).trim()
      if (url && BLOCKED_URL.test(url)) {
        window.alert(MESSAGE)
        return false
      }
      if (previousOnOk) {
        return previousOnOk.call(this)
      }
    }
  })
  return true
}

export default () => {
  if (!attachGuard()) {
    const interval = setInterval(() => {
      if (attachGuard()) {
        clearInterval(interval)
      }
    }, 300)
    setTimeout(() => clearInterval(interval), 60000)
  }
}
