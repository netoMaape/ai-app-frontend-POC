import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import aiApi from '@/api/ai';

export const useAiStore = defineStore('ai', () => {
  const isLoading = ref(false);
  const error = ref('');
  const results = ref([]);        // this session only
  const lastLatency = ref(null);

  const requestCount = computed(() => results.value.length);
  const avgLatency = computed(() => {
    if (!results.value.length) return 0;
    const total = results.value.reduce((a, r) => a + r.latency, 0);
    return Math.round(total / results.value.length);
  });

  async function summarize(prompt) {
    if (!prompt.trim()) return;
    isLoading.value = true;
    error.value = '';
    const start = performance.now();

    try {
      const data = await aiApi.summarize(prompt);
      const latency = Math.round(performance.now() - start);
      lastLatency.value = latency;
      results.value.unshift({
        id: Date.now(),
        prompt,
        summary: data.summary,
        latency,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      error.value = err.message || 'AI request failed';
    } finally {
      isLoading.value = false;
    }
  }

  function clear() {
    results.value = [];
    error.value = '';
    lastLatency.value = null;
  }

  return {
    isLoading,
    error,
    results,
    lastLatency,
    requestCount,
    avgLatency,
    summarize,
    clear
  };
});