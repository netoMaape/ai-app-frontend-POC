import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue'), meta: { public: true } },
    { path: '/register', name: 'Register', component: () => import('@/views/RegisterView.vue'), meta: { public: true } },
    { path: '/', name: 'Workspace', component: () => import('@/views/DashboardView.vue') },
    { path: '/explorer', name: 'API Explorer', component: () => import('@/views/ExplorerView.vue') },
    { path: '/components', name: 'Components', component: () => import('@/views/ComponentsView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // Public routes are always allowed
  if (to.meta.public) {
    if (auth.isAuthenticated) return '/';
    return true;
  }

  // Protected route — must have a token
  if (!auth.isAuthenticated) return '/login';

  // Hydrate user once per session (also validates the token)
  if (!auth.user) {
    try {
      await auth.fetchMe();
    } catch {
      return '/login';
    }
  }

  return true;
});

export default router;