import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'
import {loadBundled} from './mod/api'
import coreMod from './content/core'

import './styles/main.css'

async function boot() {
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')

  await loadBundled([coreMod])

  const {useModsStore} = await import('./stores/mods')
  await useModsStore().loadAllEnabled()
}

boot().catch((err) => {
  console.error('[BanGLife] 启动失败：', err)
})
