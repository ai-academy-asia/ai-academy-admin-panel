module.exports = {
  apps: [
    {
      name: 'wecode-admin',
      exec_mode: 'cluster',
      instances: '2',
      cwd: __dirname,
      script: './node_modules/nuxt/bin/nuxt.js',
      max_memory_restart: '500M',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        BUILD_DIR: 'distbuild',
        HOST: '0.0.0.0',
        PORT: '3060'
      }
    }
  ]
}
