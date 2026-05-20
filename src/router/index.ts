import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/ui/views/HomeView.vue'),
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/ui/views/GameView.vue'),
    },
  ],
})

export default router
