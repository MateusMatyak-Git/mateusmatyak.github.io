<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import { useTheme } from '@/composables/useTheme'

const { t } = useI18n()
const { theme, toggleTheme } = useTheme()

const icon = computed(() => (theme.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon'))
</script>

<template>
  <Button
    :icon="icon"
    :aria-label="t('actions.toggle_theme')"
    :title="t('actions.toggle_theme')"
    severity="secondary"
    text
    rounded
    @click="toggleTheme"
  />
</template>
