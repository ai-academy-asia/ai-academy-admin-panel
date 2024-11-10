module.exports = {
  apps: [
    {
      name: 'edu',
      exec_mode: 'fork',
      instances: '1',
      script: './node_modules/nuxt/bin/nuxt.js',
      max_memory_restart: '500M',
      args: 'start',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
