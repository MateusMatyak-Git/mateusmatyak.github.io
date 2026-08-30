<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    centered?: boolean
  }>(),
  { subtitle: undefined, centered: false },
)
</script>

<template>
  <div class="section-heading" :class="{ 'is-centered': centered }">
    <h2 class="section-heading__title">{{ title }}</h2>
    <p v-if="subtitle" class="section-heading__subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped lang="scss">
.section-heading {
  margin-bottom: 48px;
  max-width: 640px;

  &.is-centered {
    max-width: 780px;
    margin-inline: auto;

    .section-heading__title,
    .section-heading__subtitle {
      text-align: center;
    }

    .section-heading__subtitle {
      font-size: 0.9rem;
    }
  }
}

.section-heading__title {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  color: var(--color-text);
  margin-bottom: 12px;
}

.section-heading__subtitle {
  font-size: 1rem;
  color: var(--color-text-secondary);
  text-align: left;
}
</style>
