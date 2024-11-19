module.exports = {
  apps: [
    {
      name: 'wecode-admin',
      exec_mode: 'cluster',
      instances: '2',
      script: './node_modules/nuxt/bin/nuxt.js',
      max_memory_restart: '100M',
      args: 'start',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
