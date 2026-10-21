<template>
  <div class="auth-page">
    <aside class="auth-brand">
      <div class="auth-brand-inner">
        <div class="brand-logo">⚡</div>
        <h1>Join AI Studio</h1>
        <p class="tagline">
          Create an account and start prototyping AI-powered apps on a solid, reusable foundation.
        </p>
      </div>
    </aside>

    <main class="auth-form-wrap">
      <div class="auth-form-card">
        <h2 class="fw-bold mb-1">Create your account</h2>
        <p class="text-muted mb-4">It takes ten seconds.</p>

        <div v-if="authStore.error" class="alert alert-danger py-2" role="alert">
          <i class="fa-solid fa-circle-exclamation me-2"></i>{{ authStore.error }}
        </div>

        <form @submit.prevent="handleSubmit" novalidate>
          <div class="mb-3">
            <label class="form-label small fw-semibold">Email</label>
            <input v-model.trim="email" type="email" class="form-control" placeholder="you@example.com" required />
            <div v-if="emailError" class="text-danger small mt-1">{{ emailError }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold">Password</label>
            <div class="input-group">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="At least 8 characters"
                minlength="8"
                required
              />
              <button type="button" class="btn btn-outline-secondary" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
            <div v-if="passwordError" class="text-danger small mt-1">{{ passwordError }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-semibold">Confirm password</label>
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Repeat your password"
              required
            />
            <div v-if="confirmError" class="text-danger small mt-1">{{ confirmError }}</div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
            :disabled="authStore.isLoading"
          >
            <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm"></span>
            <span>{{ authStore.isLoading ? 'Creating account…' : 'Create account' }}</span>
          </button>
        </form>

        <p class="text-center text-muted small mt-4 mb-0">
          Already have an account?
          <router-link to="/login" class="fw-semibold">Sign in</router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const touched = ref(false);

const emailError = computed(() => {
  if (!touched.value) return '';
  if (!email.value) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return 'Enter a valid email';
  return '';
});
const passwordError = computed(() => {
  if (!touched.value) return '';
  if (!password.value) return 'Password is required';
  if (password.value.length < 8) return 'Password must be at least 8 characters';
  return '';
});
const confirmError = computed(() => {
  if (!touched.value) return '';
  if (confirmPassword.value !== password.value) return 'Passwords do not match';
  return '';
});

async function handleSubmit() {
  touched.value = true;
  if (emailError.value || passwordError.value || confirmError.value) return;
  const ok = await authStore.register(email.value, password.value);
  if (ok) router.push('/');
}
</script>

<style scoped>
/* Same as LoginView — see file for full styles */
.auth-page { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; background: #fff; }
.auth-brand { background: var(--primary-gradient); color: white; padding: 3rem; display: flex; align-items: center; justify-content: center; }
.auth-brand-inner { max-width: 380px; }
.brand-logo { font-size: 2.5rem; margin-bottom: 1rem; }
.auth-brand h1 { font-weight: 700; font-size: 2.25rem; margin-bottom: 1rem; }
.tagline { opacity: 0.9; line-height: 1.6; }
.auth-form-wrap { display: flex; align-items: center; justify-content: center; padding: 2rem; }
.auth-form-card { width: 100%; max-width: 400px; }
@media (max-width: 992px) { .auth-page { grid-template-columns: 1fr; } .auth-brand { display: none; } }
</style>