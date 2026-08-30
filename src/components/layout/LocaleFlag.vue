<script setup lang="ts">
import type { Locale } from '@/i18n'

defineProps<{
  code: Locale
}>()
</script>

<template>
  <svg
    class="locale-flag"
    viewBox="0 0 20 14"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <template v-if="code === 'en'">
      <rect width="20" height="14" fill="#bf0a30" />
      <rect y="1.08" width="20" height="1.08" fill="#fff" />
      <rect y="3.23" width="20" height="1.08" fill="#fff" />
      <rect y="5.38" width="20" height="1.08" fill="#fff" />
      <rect y="7.54" width="20" height="1.08" fill="#fff" />
      <rect y="9.69" width="20" height="1.08" fill="#fff" />
      <rect y="11.85" width="20" height="1.08" fill="#fff" />
      <rect width="8.4" height="7.54" fill="#002868" />
    </template>

    <template v-else-if="code === 'pt'">
      <rect width="20" height="14" fill="#009b3a" />
      <polygon points="10,1.4 18.6,7 10,12.6 1.4,7" fill="#fedd00" />
      <circle cx="10" cy="7" r="2.55" fill="#002776" />
    </template>

    <template v-else-if="code === 'pt-PT'">
      <rect width="20" height="14" fill="#ff0000" />
      <rect width="8" height="14" fill="#006600" />
      <circle cx="8" cy="7" r="2.45" fill="#ffd700" />
      <circle cx="8" cy="7" r="1.15" fill="#fff" />
    </template>

    <template v-else-if="code === 'es'">
      <rect width="20" height="14" fill="#c60b1e" />
      <rect y="3.5" width="20" height="7" fill="#ffc400" />
    </template>

    <template v-else-if="code === 'de'">
      <rect width="20" height="4.67" fill="#000" />
      <rect y="4.67" width="20" height="4.66" fill="#dd0000" />
      <rect y="9.33" width="20" height="4.67" fill="#ffce00" />
    </template>

    <template v-else-if="code === 'ja'">
      <rect width="20" height="14" fill="#fff" />
      <circle cx="10" cy="7" r="4.15" fill="#bc002d" />
    </template>
  </svg>
</template>

<style scoped lang="scss">
.locale-flag {
  display: block;
  width: 20px;
  height: 14px;
  flex-shrink: 0;
  border-radius: 2px;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-border) 80%, transparent);
}
</style>
