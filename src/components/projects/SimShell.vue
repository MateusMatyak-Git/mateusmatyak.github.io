<script setup lang="ts">
defineProps<{
  brand: string
  title: string
  locked?: boolean
  lockedLabel?: string
  steps: { key: string; label: string }[]
  stepIndex: number
  showRestart: boolean
  restartLabel: string
}>()

defineEmits<{
  restart: []
}>()
</script>

<template>
  <div class="sim" :style="{ '--sim-brand': brand }">
    <div class="sim__chrome">
      <div class="sim__dots" aria-hidden="true">
        <span /><span /><span />
      </div>
      <span class="sim__url">
        {{ title }}
        <template v-if="locked"> · {{ lockedLabel }}</template>
      </span>
    </div>

    <div class="sim__app">
      <header class="sim__bar">
        <span class="sim__brand">
          <slot name="brand-icon" />
          {{ title }}
        </span>
        <button v-if="showRestart" type="button" class="sim__restart" @click="$emit('restart')">
          {{ restartLabel }}
        </button>
      </header>

      <ol class="sim__steps">
        <li
          v-for="(step, index) in steps"
          :key="step.key"
          class="sim__step"
          :class="{
            'is-active': stepIndex === index,
            'is-done': stepIndex > index,
          }"
        >
          <span class="sim__step-dot" />
          <span class="sim__step-label">{{ step.label }}</span>
        </li>
      </ol>

      <div class="sim__body" aria-live="polite">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sim {
  --sim-brand: #4f46e5;
  --sim-brand-dark: color-mix(in srgb, var(--sim-brand) 80%, black);
  --sim-ink: #1b1b1b;
  --sim-muted: #6b7280;
  --sim-line: #e8e8e8;
  --sim-paper: #ffffff;
  --sim-wash: #f6f4f5;

  color-scheme: light;
  color: var(--sim-ink);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  overflow: hidden;
}

.sim__chrome {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-raised);
}

.sim__dots {
  display: flex;
  gap: 6px;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-border-strong);
  }
}

.sim__url {
  flex: 1;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--color-bg);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-text-muted);
  text-align: center;
}

.sim__app {
  background: var(--sim-wash);
  color: var(--sim-ink);
}

.sim__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 48px;
  padding: 8px 16px;
  background: var(--sim-brand);
  color: #fff;
}

.sim__brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 600;
}

.sim__restart {
  border: 1px solid rgb(255 255 255 / 35%);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 10px;
  cursor: pointer;
}

.sim__restart:hover {
  background: rgb(255 255 255 / 12%);
}

.sim__steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  list-style: none;
  margin: 0;
  padding: 10px 12px;
  background: var(--sim-paper);
  border-bottom: 1px solid var(--sim-line);
}

.sim__step {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--sim-muted);
}

.sim__step-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--sim-line);
}

.sim__step.is-active {
  color: var(--sim-brand);

  .sim__step-dot {
    background: var(--sim-brand);
  }
}

.sim__step.is-done {
  color: var(--sim-ink);

  .sim__step-dot {
    background: var(--sim-ink);
  }
}

.sim__body {
  min-height: 380px;
  padding: 20px 16px 22px;
  color: var(--sim-ink);
}

:deep(input),
:deep(textarea) {
  color: var(--sim-ink);
  color-scheme: light;
}

@media (max-width: 640px) {
  .sim__step-label {
    display: none;
  }

  .sim__body {
    min-height: 320px;
  }
}
</style>
