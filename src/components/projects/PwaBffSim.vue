<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SimShell from '@/components/projects/SimShell.vue'

const { t } = useI18n()

type Intent = 'sale' | 'stock' | 'close'
type JwtMode = 'valid' | 'expired'
type Phase = 'setup' | 'run' | 'done'
type ItemStatus = 'idle' | 'active' | 'ok' | 'conflict' | 'rejected'

const p = 'projects.items.pwa.bff'
const intents: Intent[] = ['sale', 'stock', 'close']

const jwt = ref<JwtMode>('valid')
const selected = ref<Intent[]>(['sale', 'stock'])
const phase = ref<Phase>('setup')
const statusCode = ref(200)
const itemStatus = ref<Record<Intent, ItemStatus>>({
  sale: 'idle',
  stock: 'idle',
  close: 'idle',
})
const logs = ref<string[]>([])
const timers: ReturnType<typeof setTimeout>[] = []

const stepIndex = computed(() => {
  if (phase.value === 'setup') return 0
  if (phase.value === 'run') return 1
  return 3
})

const steps = computed(() =>
  ['request', 'auth', 'apply', 'envelope'].map((key) => ({
    key,
    label: t(`${p}.steps.${key}`),
  })),
)

const canDispatch = computed(() => selected.value.length > 0)
const batch = computed(() => intents.filter((id) => selected.value.includes(id)))

function later(ms: number, fn: () => void) {
  const id = setTimeout(fn, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ms)
  timers.push(id)
}

function clearTimers() {
  while (timers.length) {
    const id = timers.pop()
    if (id) clearTimeout(id)
  }
}

function toggle(id: Intent) {
  if (phase.value !== 'setup') return
  selected.value = selected.value.includes(id)
    ? selected.value.filter((item) => item !== id)
    : [...selected.value, id]
}

function dispatch() {
  if (!canDispatch.value) return
  clearTimers()
  phase.value = 'run'
  logs.value = [t(`${p}.logs.receive`, { n: selected.value.length })]
  itemStatus.value = { sale: 'idle', stock: 'idle', close: 'idle' }

  later(400, () => {
    logs.value = [...logs.value, t(`${p}.logs.jwt_${jwt.value}`)]
    if (jwt.value === 'expired') {
      statusCode.value = 401
      selected.value.forEach((id) => {
        itemStatus.value = { ...itemStatus.value, [id]: 'rejected' }
      })
      phase.value = 'done'
    }
  })

  if (jwt.value === 'expired') return

  const batch = intents.filter((id) => selected.value.includes(id))
  statusCode.value = 200

  batch.forEach((id, index) => {
    later(800 + index * 700, () => {
      itemStatus.value = { ...itemStatus.value, [id]: 'active' }
      logs.value = [...logs.value, t(`${p}.logs.apply_${id}`)]
    })
    later(800 + index * 700 + 480, () => {
      const conflict = id === 'close' && selected.value.includes('stock')
      itemStatus.value = { ...itemStatus.value, [id]: conflict ? 'conflict' : 'ok' }
      logs.value = [...logs.value, t(`${p}.logs.result_${conflict ? 'conflict' : 'ok'}`, { intent: t(`projects.items.pwa.sim.choices.${id}`) })]
      if (conflict) statusCode.value = 409
      if (index === batch.length - 1) phase.value = 'done'
    })
  })
}

function restart() {
  clearTimers()
  phase.value = 'setup'
  statusCode.value = 200
  logs.value = []
  itemStatus.value = { sale: 'idle', stock: 'idle', close: 'idle' }
}

onUnmounted(clearTimers)
</script>

<template>
  <SimShell
    brand="#7c3aed"
    :title="t(`${p}.title`)"
    locked
    :locked-label="t('projects.private')"
    :steps="steps"
    :step-index="stepIndex"
    :show-restart="phase !== 'setup'"
    :restart-label="t('projects.sim.restart')"
    @restart="restart"
  >
    <template #brand-icon>
      <i class="pi pi-server" aria-hidden="true" />
    </template>

    <p class="http">POST /v1/ops/replay</p>

    <p class="label">{{ t(`${p}.batch`) }}</p>
    <div class="kinds">
      <button
        v-for="id in intents"
        :key="id"
        type="button"
        class="chip"
        :class="{ 'is-active': selected.includes(id) }"
        :disabled="phase !== 'setup'"
        @click="toggle(id)"
      >
        {{ t(`projects.items.pwa.sim.choices.${id}`) }}
      </button>
    </div>

    <p class="label">JWT</p>
    <div class="kinds">
      <button
        v-for="id in ['valid', 'expired'] as JwtMode[]"
        :key="id"
        type="button"
        class="chip"
        :class="{ 'is-active': jwt === id, 'is-warn': id === 'expired' }"
        :disabled="phase !== 'setup'"
        @click="jwt = id"
      >
        {{ t(`${p}.jwt.${id}`) }}
      </button>
    </div>

    <button v-if="phase === 'setup'" type="button" class="cta" :disabled="!canDispatch" @click="dispatch">
      {{ t(`${p}.dispatch`) }}
    </button>

    <ul class="items">
      <li v-for="id in batch" :key="id" class="item" :class="`is-${itemStatus[id]}`">
        <strong>{{ t(`projects.items.pwa.sim.choices.${id}`) }}</strong>
        <em>{{ t(`${p}.item_status.${itemStatus[id]}`) }}</em>
      </li>
    </ul>

    <ul class="log">
      <li v-for="(line, index) in logs" :key="index">{{ line }}</li>
    </ul>

    <p v-if="phase === 'done'" class="code" :class="{ 'is-bad': statusCode >= 400 }">
      HTTP {{ statusCode }} · {{ t(`${p}.status.${statusCode}`) }}
    </p>
  </SimShell>
</template>

<style scoped lang="scss">
.http {
  margin: 0 0 12px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: #111827;
  color: #e5e7eb;
  font-family: var(--font-mono);
  font-size: 0.74rem;
}

.label {
  margin: 10px 0 6px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6b7280;
}

.kinds {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip,
.cta {
  cursor: pointer;
}

.chip {
  padding: 6px 10px;
  border: 1px solid #e8e8e8;
  border-radius: 999px;
  background: #fff;
  color: #1b1b1b;
  font-size: 0.74rem;
  font-weight: 600;

  &.is-active {
    border-color: #7c3aed;
    background: #f5f3ff;
    color: #7c3aed;
  }

  &.is-warn.is-active {
    border-color: #b91c1c;
    background: #fef2f2;
    color: #b91c1c;
  }
}

.cta {
  margin: 14px 0 12px;
  min-height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: var(--radius-sm);
  background: #7c3aed;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.items {
  display: grid;
  gap: 6px;
  margin: 8px 0;
  padding: 0;
  list-style: none;
}

.item {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #e8e8e8;
  border-radius: var(--radius-sm);
  background: #fff;
  font-size: 0.8rem;

  em {
    font-style: normal;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #6b7280;
  }
}

.item.is-ok em {
  color: #059669;
}
.item.is-conflict em,
.item.is-rejected em {
  color: #b91c1c;
}
.item.is-active {
  border-color: #7c3aed;
}

.log {
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: #374151;
}

.code {
  margin-top: 12px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  color: #059669;
}

.code.is-bad {
  color: #b91c1c;
}
</style>
