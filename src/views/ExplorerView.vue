<template>
  <div class="container-fluid p-4">
    <div class="row justify-content-center">
      <div class="col-12 col-xl-10">
        <header class="mb-4">
          <h2 class="fw-bold mb-1">API Explorer</h2>
          <p class="text-muted mb-0">
            Hit the real backend without leaving the app. Live contract, no mocks.
          </p>
        </header>

        <div class="row g-4">
          <div class="col-12 col-lg-4">
            <div class="card shadow-sm">
              <div class="card-header">
                <span class="fw-semibold small text-uppercase text-muted">Endpoints</span>
              </div>
              <div class="list-group list-group-flush">
                <button
                  v-for="ep in endpoints"
                  :key="ep.key"
                  class="list-group-item list-group-item-action d-flex align-items-center gap-2"
                  :class="{ active: selected.key === ep.key }"
                  @click="select(ep)"
                >
                  <span class="badge font-mono" :class="methodClass(ep.method)">{{ ep.method }}</span>
                  <span class="small">{{ ep.path }}</span>
                  <i v-if="ep.auth" class="fa-solid fa-lock ms-auto small text-muted" title="Requires auth"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-8">
            <div class="card shadow-sm">
              <div class="card-header d-flex align-items-center gap-2">
                <span class="badge font-mono" :class="methodClass(selected.method)">{{ selected.method }}</span>
                <code class="text-dark">{{ selected.path }}</code>
                <span v-if="selected.auth" class="badge bg-light text-secondary border ms-auto">
                  <i class="fa-solid fa-lock me-1"></i>Auth
                </span>
              </div>
              <div class="card-body">
                <p class="text-muted small mb-3">{{ selected.description }}</p>

                <div v-if="selected.body" class="mb-3">
                  <label class="form-label small fw-semibold">Request body (JSON)</label>
                  <textarea v-model="bodyText" class="form-control font-mono" rows="6"></textarea>
                </div>

                <button
                  class="btn btn-primary d-flex align-items-center gap-2"
                  @click="send"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                  <i v-else class="fa-solid fa-paper-plane"></i>
                  Send request
                </button>

                <div v-if="error" class="alert alert-danger mt-3 mb-0">{{ error }}</div>

                <div v-if="response" class="mt-3">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <label class="form-label small fw-semibold mb-0">Response</label>
                    <span class="badge bg-light text-dark border font-mono">{{ status }} · {{ elapsed }}ms</span>
                  </div>
                  <pre class="response-pre">{{ response }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import client from '@/api/client';

const endpoints = [
  { key: 'me', method: 'GET', path: '/api/v1/users/me', auth: true,
    description: 'Returns the currently authenticated user.' },
  { key: 'summarize', method: 'POST', path: '/api/v1/ai/summarize', auth: true,
    description: 'Send a prompt to the AI service.',
    body: { prompt: 'Summarize the concept of a REST API in one sentence.' } },
];

const selected = ref(endpoints[0]);
const bodyText = ref(JSON.stringify(endpoints[0].body || {}, null, 2));
const loading = ref(false);
const error = ref('');
const response = ref('');
const status = ref(null);
const elapsed = ref(0);

function select(ep) {
  selected.value = ep;
  bodyText.value = JSON.stringify(ep.body || {}, null, 2);
  response.value = '';
  error.value = '';
}

function methodClass(m) {
  return {
    'bg-success-subtle text-success': m === 'GET',
    'bg-primary-subtle text-primary': m === 'POST',
    'bg-warning-subtle text-warning': m === 'PUT' || m === 'PATCH',
    'bg-danger-subtle text-danger': m === 'DELETE',
  };
}

async function send() {
  loading.value = true;
  error.value = '';
  response.value = '';
  const start = performance.now();
  try {
    let data;
    if (selected.value.body) {
      const parsed = JSON.parse(bodyText.value || '{}');
      data = await client.post(selected.value.path.replace('/api', ''), parsed);
    } else {
      data = await client.get(selected.value.path.replace('/api', ''));
    }
    status.value = 200;
    response.value = JSON.stringify(data, null, 2);
  } catch (err) {
    error.value = err.message;
    status.value = err.status || 'ERR';
  } finally {
    elapsed.value = Math.round(performance.now() - start);
    loading.value = false;
  }
}
</script>

<style scoped>
.list-group-item.active {
  background: #eef2ff;
  color: #1e293b;
  border-color: #e2e8f0;
}
.response-pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  max-height: 360px;
  overflow: auto;
  margin: 0;
}
</style>