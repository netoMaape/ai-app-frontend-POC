<template>
  <div class="container-fluid p-4">
    <div class="row justify-content-center">
      <div class="col-12 col-xl-10">
        <header class="mb-4">
          <h2 class="fw-bold mb-1">UI Components</h2>
          <p class="text-muted mb-0">
            Every piece is small, standalone, and reusable in your own pages.
          </p>
        </header>

        <div class="row g-4">
          <div class="col-12 col-md-6">
            <div class="card shadow-sm h-100">
              <div class="card-header"><span class="fw-semibold small text-uppercase text-muted">Buttons</span></div>
              <div class="card-body d-flex flex-wrap gap-2">
                <button class="btn btn-primary">Primary</button>
                <button class="btn btn-outline-secondary">Secondary</button>
                <button class="btn btn-outline-danger">Danger</button>
                <button class="btn btn-light border">Light</button>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="card shadow-sm h-100">
              <div class="card-header"><span class="fw-semibold small text-uppercase text-muted">Badges</span></div>
              <div class="card-body d-flex flex-wrap gap-2 align-items-center">
                <span class="badge badge-soft-success">Success</span>
                <span class="badge badge-soft-warning">Warning</span>
                <span class="badge badge-soft-danger">Danger</span>
                <span class="badge bg-light text-dark border font-mono">gpt-4o-mini</span>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="card shadow-sm h-100">
              <div class="card-header"><span class="fw-semibold small text-uppercase text-muted">Cards</span></div>
              <div class="card-body">
                <p class="text-muted mb-0">Cards have soft shadows and rounded corners by default.</p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="card shadow-sm h-100">
              <div class="card-header"><span class="fw-semibold small text-uppercase text-muted">Modal</span></div>
              <div class="card-body">
                <button class="btn btn-outline-primary" @click="showDemo = true">
                  <i class="fa-solid fa-expand me-2"></i>Open demo modal
                </button>
                <AppModal v-model="showDemo" title="Hello from a modal">
                  <p class="mb-0">Modals are teleported to <code>&lt;body&gt;</code> and animate in smoothly.</p>
                  <template #footer>
                    <button class="btn btn-primary" @click="showDemo = false">Got it</button>
                  </template>
                </AppModal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppModal from '@/components/AppModal.vue';
const showDemo = ref(false);
</script>