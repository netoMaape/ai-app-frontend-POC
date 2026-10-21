<template>
  <div class="workspace">
    <div class="workspace-inner">
      <header class="mb-4">
        <h2 class="fw-bold mb-1">What are we building today{{ greetingName }}?</h2>
        <p class="text-muted mb-0">Send a prompt to your backend's AI provider.</p>
      </header>

      <div v-if="aiStore.error" class="alert alert-danger d-flex align-items-start gap-2" role="alert">
        <i class="fa-solid fa-circle-exclamation mt-1"></i>
        <div class="flex-grow-1">{{ aiStore.error }}</div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body p-4">
          <label class="form-label small fw-semibold text-secondary">Prompt</label>
          <textarea
            v-model="prompt"
            rows="6"
            class="form-control mb-3"
            placeholder="Paste text to summarize, or ask the AI to do something with it…"
            :disabled="aiStore.isLoading"
            @keydown.ctrl.enter="run"
            @keydown.meta.enter="run"
          ></textarea>

          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <small class="text-muted">
              <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to submit
              <span v-if="aiStore.lastLatency" class="ms-2 badge bg-light text-dark border font-mono">
                {{ aiStore.lastLatency }}ms
              </span>
            </small>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" @click="clearForm" :disabled="aiStore.isLoading">
                Clear
              </button>
              <button
                class="btn btn-primary d-flex align-items-center gap-2"
                @click="run"
                :disabled="aiStore.isLoading || !prompt.trim()"
              >
                <span v-if="aiStore.isLoading" class="spinner-border spinner-border-sm"></span>
                <i v-else class="fa-solid fa-wand-magic-sparkles"></i>
                <span>{{ aiStore.isLoading ? 'Thinking…' : 'Summarize' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Most recent result -->
      <Transition name="fade-slide">
        <div v-if="latest" class="card shadow-sm mt-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span class="fw-semibold"><i class="fa-solid fa-sparkles me-2 text-primary"></i>Summary</span>
            <div class="d-flex gap-2 align-items-center">
              <small class="text-muted font-mono">{{ latest.timestamp }}</small>
              <button class="btn btn-sm btn-light border" @click="copy(latest.summary)" title="Copy">
                <i class="fa-regular fa-copy"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="response-body">{{ latest.summary }}</div>
          </div>
        </div>
      </Transition>

      <!-- Session log — honest, in-memory only -->
      <div v-if="aiStore.results.length > 1" class="mt-4">
        <h6 class="text-uppercase text-muted small fw-semibold mb-2">This session</h6>
        <div class="list-group">
          <button
            v-for="r in aiStore.results.slice(1)"
            :key="r.id"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
            @click="prompt = r.prompt"
          >
            <span class="text-truncate me-3" style="max-width: 70%;">{{ r.prompt }}</span>
            <small class="text-muted font-mono text-nowrap">{{ r.latency }}ms · {{ r.timestamp }}</small>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAiStore } from '@/stores/aiStore';
import { useAuthStore } from '@/stores/authStore';

const aiStore = useAiStore();
const auth = useAuthStore();
const prompt = ref('');

const latest = computed(() => aiStore.results[0] || null);
const greetingName = computed(() => {
  const email = auth.user?.email;
  if (!email) return '';
  return `, ${email.split('@')[0]}`;
});

async function run() {
  if (!prompt.value.trim() || aiStore.isLoading) return;
  await aiStore.summarize(prompt.value);
}

function clearForm() {
  prompt.value = '';
  aiStore.error = '';
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text); } catch {}
}
</script>

<style scoped>
.workspace {
  padding: 2.5rem 1.5rem;
}
.workspace-inner {
  max-width: 760px;
  margin: 0 auto;
}
.response-body {
  white-space: pre-wrap;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #1e293b;
  line-height: 1.6;
}
.fade-slide-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-slide-enter-from { opacity: 0; transform: translateY(-8px); }
</style>