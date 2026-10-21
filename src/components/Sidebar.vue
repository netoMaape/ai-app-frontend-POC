<template>
  <aside class="sidebar bg-white border-end d-flex flex-column" style="width: 250px;">
    <div class="px-4 py-3 border-bottom d-flex align-items-center gap-2">
      <span class="fs-4">⚡</span>
      <span class="fw-bold fs-5 text-dark">AI Studio</span>
      <span class="badge bg-light text-primary border ms-auto font-mono text-xs">v1.0</span>
    </div>

    <div class="p-3 flex-grow-1 overflow-auto">
      <ul class="nav flex-column gap-1">
        <li class="nav-section-label">Workspace</li>
        <li>
          <router-link to="/" active-class="active" exact-active-class="active"
                       class="nav-link text-secondary d-flex align-items-center gap-3">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>Playground</span>
          </router-link>
        </li>

        <li class="nav-section-label mt-3">Build with this starter</li>
        <li>
          <router-link to="/explorer" active-class="active"
                       class="nav-link text-secondary d-flex align-items-center gap-3">
            <i class="fa-solid fa-flask"></i>
            <span>API Explorer</span>
          </router-link>
        </li>
        <li>
          <router-link to="/components" active-class="active"
                       class="nav-link text-secondary d-flex align-items-center gap-3">
            <i class="fa-solid fa-layer-group"></i>
            <span>UI Components</span>
          </router-link>
        </li>
      </ul>
    </div>

    <div class="p-3 border-top text-muted small">
      <div class="d-flex align-items-center gap-2">
        <span class="badge bg-success rounded-circle p-1"></span>
        <span>Backend: Connected</span>
      </div>
      <div class="mt-1 font-mono text-truncate" style="font-size: 0.7rem;">
        {{ apiBase }}
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
const apiBase = computed(() =>
  localStorage.getItem('api_base_url') || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
);
</script>

<style scoped>
.nav-link {
  border-radius: 8px;
  font-weight: 500;
  padding: 0.65rem 1rem;
  font-size: 0.9rem;
}
.nav-link:hover {
  background-color: #f1f5f9;
  color: #0f172a !important;
}
.nav-link.active {
  background: var(--primary-gradient);
  color: #ffffff !important;
}
.nav-link.active i { color: #fff; }
.nav-section-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  font-weight: 600;
  padding: 0 1rem;
  margin-bottom: 0.25rem;
}
</style>