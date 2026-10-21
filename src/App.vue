<template>
  <router-view v-if="isAuthPage" />
  <div v-else class="app-layout">
    <Sidebar />
    <div class="main-content">
      <Navbar />
      <main class="flex-grow-1 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import Navbar from '@/components/Navbar.vue';

const route = useRoute();
const isAuthPage = computed(() => route.meta.public === true);
</script>