import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/Ingredientes'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/Ingredientes'
      },

      {
        path: 'Ingredientes',
        component: () => import('@/views/IngredientesView.vue')
      },

      {
        path: 'Recetas',
        component: () => import('@/views/RecetasView.vue')
      },

      {
        path: 'Bestiario',
        component: () => import('@/views/BestiarioView.vue')
      },

      {
        path: 'Bestiario',
        component: () => import('@/views/BestiarioView.vue')
      },

      {
        path: 'Bitacora',
        component: () => import('@/views/BitacoraView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
