<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import { LOCALES, localeMeta, setLocale, type Locale } from '@/i18n'
import LocaleFlag from '@/components/layout/LocaleFlag.vue'

const { t, locale } = useI18n()

const selected = computed<Locale>({
  get: () => locale.value as Locale,
  set: (value) => setLocale(value),
})

const selectedOption = computed(() => localeMeta(selected.value))

function asLocale(option: unknown): Locale {
  if (typeof option === 'string') return option as Locale
  if (option && typeof option === 'object' && 'code' in option) {
    return (option as { code: Locale }).code
  }
  return selected.value
}

function optionLabel(option: unknown) {
  return localeMeta(asLocale(option)).nativeLabel
}
</script>

<template>
  <Select
    v-model="selected"
    :options="[...LOCALES]"
    option-label="nativeLabel"
    option-value="code"
    :aria-label="t('actions.change_language')"
    :title="t('actions.change_language')"
    size="small"
    class="locale-switcher"
    overlay-class="locale-switcher-overlay"
  >
    <template #value>
      <span class="locale-switcher__item">
        <LocaleFlag :code="selectedOption.code" />
        <span class="locale-switcher__name">{{ selectedOption.nativeLabel }}</span>
      </span>
    </template>
    <template #option="{ option }">
      <span class="locale-switcher__item">
        <LocaleFlag :code="asLocale(option)" />
        <span>{{ optionLabel(option) }}</span>
      </span>
    </template>
  </Select>
</template>

<style scoped lang="scss">
.locale-switcher {
  min-width: 13.5rem;
}

.locale-switcher__name {
  display: none;
}

@media (min-width: 768px) {
  .locale-switcher__name {
    display: inline;
  }
}

@media (max-width: 767.98px) {
  .locale-switcher {
    min-width: 3.4rem;
  }
}

.locale-switcher__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: inherit;
}

:deep(.p-select) {
  background: var(--color-surface);
  border-color: var(--color-border);
  color: var(--color-text);
  font-size: 0.8rem;
  font-weight: 500;
}

:deep(.p-select:not(.p-disabled):hover) {
  border-color: var(--color-accent);
}

:deep(.p-select-label) {
  display: flex;
  align-items: center;
  padding-block: 6px;
  color: var(--color-text);
}
</style>

<style lang="scss">
.locale-switcher-overlay {
  .p-select-option {
    color: var(--color-text);
  }

  .locale-switcher__item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--color-text);
  }
}
</style>
