# wecode-admin production deploy

## Required `.env` (server: `/var/www/wecode-admin/.env`)

```bash
BUILD_DIR=distbuild
ROUTER_BASE=/manage/
HOST=0.0.0.0
PORT=3060
BASE_URL=https://ai-academy.asia/api
BASE_URL_SERVER=http://127.0.0.1:8000
AUTH_URL=https://ai-academy.asia/auth
TOKEN_NAME=AI_TOKEN
PROJECT_ID=9
NODE_ENV=production
```

**Important:** Do not set `BUILD_DIR=dist`. That makes Nuxt look for `dist/dist/server` and PM2 will crash with "No build files found".

## Deploy steps

`postinstall` applies `patches/eztech-core-components+*.patch` (CKEditor CSS path + form edit permissions).

**CKEditor images:** Do not paste Google Photos share links (`photos.app.goo.gl`) in the Image URL box — they are web pages, not image files. Use the editor **Upload** tab (`/api/file/upload/ckeditor`) or the form **Зураг** field. If CSP errors persist after deploy, check nginx is not overriding `Content-Security-Policy` on `/manage/*`.

```bash
cd /var/www/wecode-admin
git pull
npm install
npm run build
pm2 delete wecode-admin 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
```

Verify build exists:

```bash
ls -la distbuild/dist/server
```

You should see `index.spa.html` / server bundle files, not an empty directory.
