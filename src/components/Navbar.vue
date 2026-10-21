<template>
  <nav class="navbar navbar-expand bg-white border-bottom px-4 py-2 justify-content-between">
    <div class="d-flex align-items-center gap-2">
      <h6 class="mb-0 fw-semibold text-secondary">{{ routeName }}</h6>
    </div>

    <div class="d-flex align-items-center gap-3">
      <span class="badge bg-light text-secondary border font-mono d-none d-md-inline">
        {{ auth.user?.email || 'signed in' }}
      </span>

      <div class="dropdown" ref="dropdownRef">
        <button
          class="btn btn-sm btn-light border rounded-circle d-flex align-items-center justify-content-center"
          style="width: 36px; height: 36px;"
          @click="menuOpen = !menuOpen"
          aria-haspopup="true"
          :aria-expanded="menuOpen"
        >
          <i class="fa-solid fa-user-astronaut text-primary"></i>
        </button>

        <ul v-if="menuOpen" class="dropdown-menu dropdown-menu-end show profile-menu">
          <li class="px-3 py-2 border-bottom">
            <div class="small text-muted">Signed in as</div>
            <div class="fw-semibold text-truncate" style="max-width: 220px;">{{ auth.user?.email || '—' }}</div>
          </li>
          <li>
            <button class="dropdown-item d-flex align-items-center gap-2" @click="open('profile')">
              <i class="fa-solid fa-id-badge"></i> Profile
            </button>
          </li>
          <li>
            <button class="dropdown-item d-flex align-items-center gap-2" @click="open('settings')">
              <i class="fa-solid fa-sliders"></i> Settings
            </button>
          </li>
          <li>
            <button class="dropdown-item d-flex align-items-center gap-2" @click="open('logs')">
              <i class="fa-solid fa-clock-rotate-left"></i> Inference Logs
            </button>
          </li>
          <li><hr class="dropdown-divider"></li>
          <li>
            <button class="dropdown-item text-danger d-flex align-items-center gap-2" @click="handleLogout">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign out
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- === Modals === -->
    <AppModal v-model="modals.profile" title="Profile">
      <div class="mb-3">
        <label class="form-label small fw-semibold text-secondary">Email</label>
        <input class="form-control font-mono" :value="auth.user?.email || '—'" readonly />
      </div>
      <div class="mb-3">
        <label class="form-label small fw-semibold text-secondary">Status</label>
        <div>
          <span class="badge" :class="auth.user?.is_active ? 'badge-soft-success' : 'badge-soft-danger'">
            {{ auth.user?.is_active ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>
      <div class="mb-0">
        <label class="form-label small fw-semibold text-secondary">User ID</label>
        <input class="form-control font-mono" :value="auth.user?.id ?? '—'" readonly />
      </div>
      <template #footer>
        <span class="text-muted small">Account management is out of scope for this starter kit.</span>
      </template>
    </AppModal>

    <AppModal v-model="modals.settings" title="API Settings">
      <div class="mb-3">
        <label class="form-label small fw-semibold text-secondary">Backend base URL</label>
        <input class="form-control font-mono" :value="apiBase" readonly />
        <div class="form-text">Configured via <code>VITE_API_BASE_URL</code> in <code>.env</code>.</div>
      </div>
      <div class="mb-0">
        <label class="form-label small fw-semibold text-secondary">Auth</label>
        <div class="text-muted small">
          Bearer token is sent automatically on every request to a protected endpoint.
        </div>
      </div>
    </AppModal>

    <AppModal v-model="modals.logs" title="Inference Logs">
      <p class="text-muted small mb-3">
        These results exist only in this browser tab — a real product would persist them to a backend table.
      </p>
      <div v-if="!ai.results.length" class="text-center py-4 text-muted">
        <i class="fa-solid fa-inbox fa-2x mb-2 d-block opacity-50"></i>
        No inferences yet.
      </div>
      <div v-else class="list-group list-group-flush">
        <div v-for="r in ai.results" :key="r.id" class="list-group-item px-0">
          <div class="d-flex justify-content-between align-items-start mb-1">
            <span class="fw-semibold small text-truncate" style="max-width: 60%;">{{ r.prompt }}</span>
            <small class="text-muted font-mono">{{ r.latency }}ms · {{ r.timestamp }}</small>
          </div>
          <div class="text-muted small text-truncate">{{ r.summary }}</div>
        </div>
      </div>
    </AppModal>
  </nav>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useAiStore } from '@/stores/aiStore';
import AppModal from '@/components/AppModal.vue';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const ai = useAiStore();

const routeName = computed(() => route.name || 'Workspace');
const apiBase = computed(() => localStorage.getItem('api_base_url') || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000');

const menuOpen = ref(false);
const dropdownRef = ref(null);

const modals = reactive({ profile: false, settings: false, logs: false });

function open(which) {
  menuOpen.value = false;
  modals[which] = true;
}

function handleLogout() {
  menuOpen.value = false;
  auth.logout();
  router.push('/login');
}

// Close dropdown on outside click
function onDocClick(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    menuOpen.value = false;
  }
}
onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));
</script>

<style scoped>
.profile-menu {
  position: absolute;
  right: 0;
  left: auto;
  margin-top: 0.5rem;
  min-width: 240px;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.15);
  border: 1px solid #e2e8f0;
}
.dropdown-item {
  padding: 0.55rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}
.dropdown-item:hover { background-color: #f1f5f9; }
</style>