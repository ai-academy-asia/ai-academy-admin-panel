/**
 * Relaxed CSP for wecode-admin: CKEditor dialogs use inline scripts;
 * embedded images need https: URLs. Stricter policy in eztech default-nuxt-config
 * breaks Image dialog and external image previews.
 */
module.exports = function adminHeaders (req, res, next) {
  const apiOrigin = (process.env.BASE_URL || '').replace(/\/$/, '')
  const connectSrc = ["'self'", apiOrigin].filter(Boolean).join(' ')
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      `connect-src ${connectSrc}`,
      "frame-ancestors 'none'"
    ].join('; ')
  )
  next()
}
