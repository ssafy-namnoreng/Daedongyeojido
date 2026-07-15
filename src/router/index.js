import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BoardListView from '../views/BoardListView.vue'
import CalendarView from '../views/CalendarView.vue'

const router = createRouter({
  history: createWebHistory(), // 필요하면 createWebHistory(import.meta.env.BASE_URL)
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/board',
      name: 'board',
      component: BoardListView,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
    },
  ],
})

export default router