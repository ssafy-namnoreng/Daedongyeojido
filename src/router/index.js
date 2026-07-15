import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BoardListView from '../views/BoardListView.vue'
import BoardDetailView from '../views/BoardDetailView.vue'
import BoardWriteView from '../views/BoardWriteView.vue'
import CalendarView from '../views/CalendarView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/board', name: 'BoardList', component: BoardListView },
  { path: '/board/:id', name: 'BoardDetail', component: BoardDetailView, props: true },
  { path: '/board/write', name: 'BoardWrite', component: BoardWriteView },
  { path: '/calendar', name: 'Calendar', component: CalendarView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router