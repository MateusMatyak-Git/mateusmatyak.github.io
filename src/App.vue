<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <AppHeader />
  <div class="page">
    <RouterView />
  </div>
  <AppFooter />
</template>

<style scoped lang="scss">
.page {
  flex: 1;
}
</style>
