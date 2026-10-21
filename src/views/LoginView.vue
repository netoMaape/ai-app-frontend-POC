<template>
  <div class="auth-page">
    <!-- Left: brand panel -->
    <aside class="auth-brand">
      <div class="auth-brand-inner">
        <div class="brand-logo">⚡</div>
        <h1>AI Studio</h1>
        <p class="tagline">
          A production-ready Vue 3 + FastAPI starter for shipping AI-powered apps in an afternoon.
        </p>
        <ul class="feature-list">
          <li><i class="fa-solid fa-check"></i> JWT auth wired end-to-end</li>
          <li><i class="fa-solid fa-check"></i> Real backend calls, no mocks</li>
          <li><i class="fa-solid fa-check"></i> Beautiful, extensible UI kit</li>
        </ul>
      </div>
    </aside>

    <!-- Right: form -->
    <main class="auth-form-wrap">
      <div class="auth-form-card">
        <h2 class="fw-bold mb-1">Welcome back</h2>
        <p class="text-muted mb-4">Sign in to access your workspace.</p>

        <div v-if="authStore.error" class="alert alert-danger py-2" role="alert">
          <i class="fa-solid fa-circle-exclamation me-2"></i>{{ authStore.error }}
        </div>

        <form @submit.prevent="handleSubmit" novalidate>
          <div class="mb-3">
            <label class="form-label small fw-semibold">Email</label>
            <input
              v-model.trim="email"
              type="email"
              class="form-control"
              placeholder="you@example.com"
              autocomplete="email"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold">Password</label>
            <div class="input-group">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="••••••••"
                autocomplete="current-password"
                required
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
            :disabled="authStore.isLoading"
          >
            <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm"></span>
            <span>{{ authStore.isLoading ? 'Signing in…' : 'Sign in' }}</span>
          </button>
        </form>

        <div class="demo-hint">
          <div class="small text-muted mb-1"><strong>Try it out</strong> with a seeded account:</div>
          <code>test@example.com / password123</code>
        </div>

        <p class="text-center text-muted small mt-4 mb-0">
          Don't have an account?
          <router-link to="/register" class="fw-semibold">Create one</router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);

async function handleSubmit() {
  const ok = await authStore.login(email.value, password.value);
  if (ok) router.push('/');
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #fff;
}
.auth-brand {
  background: var(--primary-gradient);
  color: white;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-brand-inner {
  max-width: 380px;
}
.brand-logo {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.auth-brand h1 {
  font-weight: 700;
  font-size: 2.25rem;
  margin-bottom: 1rem;
}
.tagline {
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}
.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.feature-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  opacity: 0.95;
}
.feature-list i {
  color: #a5b4fc;
}
.auth-form-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.auth-form-card {
  width: 100%;
  max-width: 400px;
}
.demo-hint {
  margin-top: 1.5rem;
  padding: 0.85rem 1rem;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
}
.demo-hint code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #4f46e5;
}
@media (max-width: 992px) {
  .auth-page { grid-template-columns: 1fr; }
  .auth-brand { display: none; }
}
</style>