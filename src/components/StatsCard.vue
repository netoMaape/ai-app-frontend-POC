<template>
  <div class="card h-100">
    <div class="card-body">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span class="text-uppercase text-muted fw-semibold small tracking-wide">{{ title }}</span>
        <div class="rounded-3 p-2 d-flex align-items-center justify-content-center" :class="iconBg">
          <i :class="[icon, iconColor]"></i>
        </div>
      </div>
      <div class="fs-3 fw-bold mb-1">{{ value }}</div>
      <small class="text-muted">{{ subtitle }}</small>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  subtitle: String,
  icon: String,
  iconBg: {
    type: String,
    default: 'bg-light'
  },
  iconColor: {
    type: String,
    default: 'text-primary'
  }
});
</script>