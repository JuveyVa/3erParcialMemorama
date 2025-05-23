import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../views/GameView.vue'),
    },
    {
      path: '/score',
      name: 'score',
      component: () => import('../views/ScoreView.vue'),
    },
    {
      path: '/rank',
      name: 'rank',
      component: () => import('../views/RankView.vue'),
    },
  ],
})

export default router
