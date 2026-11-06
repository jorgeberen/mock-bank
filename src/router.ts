import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/HomePage.vue'
import AnalyzerPage from './components/AnalyzerPage.vue'
import NotFoundPage from './components/NotFoundPage.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/analyzer', name: 'analyzer', component: AnalyzerPage },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
  ],
})
