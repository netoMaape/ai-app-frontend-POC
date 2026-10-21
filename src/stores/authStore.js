import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import authApi from '@/api/auth';

const TOKEN_KEY = 'auth_token';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '');
  const user = ref(null);
  const isLoading = ref(false);
  const error = ref('');

  const isAuthenticated = computed(() => Boolean(token.value));

  function persistToken(newToken) {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  async function login(email, password) {
    isLoading.value = true;
    error.value = '';
    try {
      // OAuth2 password flow: form-encoded, NOT JSON.
      const data = await authApi.login(email, password);
      persistToken(data.access_token);
      await fetchMe();          // hydrate user immediately
      return true;
    } catch (err) {
      error.value = err.message || 'Login failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(email, password) {
    isLoading.value = true;
    error.value = '';
    try {
      await authApi.register(email, password);
      return await login(email, password);   // auto-login on success
    } catch (err) {
      error.value = err.message || 'Registration failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMe() {
    if (!token.value) return null;
    try {
      const me = await authApi.me();
      user.value = me;
      return me;
    } catch (err) {
      // Token likely expired or invalid — clear it
      if (err.status === 401 || err.status === 403) {
        logout();
      }
      throw err;
    }
  }

  function logout() {
    persistToken('');
    user.value = null;
  }

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    fetchMe,
    logout
  };
});