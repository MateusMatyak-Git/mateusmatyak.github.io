<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SimShell from '@/components/projects/SimShell.vue'
import { projects } from '@/data/projects'

const { t } = useI18n()

type ActionId = 'sale' | 'stock' | 'close'
type QueueItem = { id: number; action: ActionId; status: 'queued' | 'syncing' | 'synced' | 'conflict' }

const item = projects.find((project) => project.id === 'pwa')!
const p = 'projects.items.pwa.sim'

const online = ref(false)
const queue = ref<QueueItem[]>([])
const nextId = ref(1)
const phase = ref<'operate' | 'done'>('operate')
const timers: ReturnType<typeof setTimeout>[] = []

const pending = computed(() => queue.value.filter((entry) => entry.status !== 'synced').length)
const synced = computed(() => queue.value.filter((entry) => entry.status === 'synced').length)
const canSync = computed(() => online.value && pending.value > 0 && !queue.value.some((entry) => entry.status === 'syncing'))

const stepIndex = computed(() => {
  if (!queue.value.length) return 0
  if (!online.value) return 1
  if (pending.value > 0) return 2
  return 3
})

const steps = computed(() =>
  ['select', 'run', 'review', 'done'].map((key) => ({
    key,
    label: t(`${p}.steps.${key}`),
  })),
)

function later(ms: number, fn: () => void) {
  const id = setTimeout(fn, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ms)
  timers.push(id)
}

function addAction(action: ActionId) {
  const status: QueueItem['status'] = !online.value && action === 'close' && queue.value.length >= 2 ? 'conflict' : 'queued'
  queue.value = [...queue.value, { id: nextId.value++, action, status }]
  phase.value = 'operate'
}

function sync() {
  if (!canSync.value) return
  const pendingItems = queue.value.filter((entry) => entry.status === 'queued' || entry.status === 'conflict')
  pendingItems.forEach((entry, index) => {
    later(index * 700, () => {
      queue.value = queue.value.map((item) =>
        item.id === entry.id ? { ...item, status: 'syncing' } : item,
      )
    })
    later(index * 700 + 520, () => {
      queue.value = queue.value.map((item) =>
        item.id === entry.id ? { ...item, status: 'synced' } : item,
      )
      if (index === pendingItems.length - 1) phase.value = 'done'
    })
  })
}

function resolveConflict(id: number) {
  queue.value = queue.value.map((entry) =>
    entry.id === id ? { ...entry, status: 'queued' } : entry,
  )
}

function restart() {
  while (timers.length) {
    const id = timers.pop()
    if (id) clearTimeout(id)
  }
  online.value = false
  queue.value = []
  nextId.value = 1
  phase.value = 'operate'
}

onUnmounted(() => {
  while (timers.length) {
    const id = timers.pop()
    if (id) clearTimeout(id)
  }
})
</script>

<template>
  <SimShell
    :brand="item.brand"
    :title="t(`${p}.title`)"
    locked
    :locked-label="t('projects.private')"
    :steps="steps"
    :step-index="stepIndex"
    :show-restart="queue.length > 0"
    :restart-label="t('projects.sim.restart')"
    @restart="restart"
  >
    <template #brand-icon>
      <i class="pi pi-mobile" aria-hidden="true" />
    </template>

    <div class="status">
      <button
        type="button"
        class="toggle"
        :class="{ 'is-on': online }"
        @click="online = !online"
      >
        <span class="toggle__dot" />
        {{ online ? t(`${p}.online`) : t(`${p}.offline`) }}
      </button>
      <span>{{ t(`${p}.device`) }} Tablet-04</span>
      <span>{{ pending }} {{ t(`${p}.pending_count`) }}</span>
    </div>

    <p class="prompt">{{ t(`${p}.select_label`) }}</p>
    <div class="kinds">
      <button
        v-for="option in item.choices"
        :key="option.id"
        type="button"
        class="kind"
        @click="addAction(option.id as ActionId)"
      >
        <i :class="['pi', option.icon]" aria-hidden="true" />
        {{ t(`${p}.choices.${option.id}`) }}
      </button>
    </div>

    <div class="queue">
      <strong>{{ t(`${p}.queue_title`) }}</strong>
      <p v-if="!queue.length" class="empty">{{ t(`${p}.queue_empty`) }}</p>
      <ul v-else>
        <li v-for="entry in queue" :key="entry.id">
          <i :class="['pi', item.choices.find((choice) => choice.id === entry.action)?.icon]" aria-hidden="true" />
          <span>{{ t(`${p}.choices.${entry.action}`) }}</span>
          <em :class="`is-${entry.status}`">{{ t(`${p}.item_status.${entry.status}`) }}</em>
          <button
            v-if="entry.status === 'conflict'"
            type="button"
            class="ghost"
            @click="resolveConflict(entry.id)"
          >
            {{ t(`${p}.resolve`) }}
          </button>
        </li>
      </ul>
    </div>

    <div class="actions">
      <button type="button" class="cta" :disabled="!canSync" @click="sync">
        {{ t(`${p}.sync`) }}
      </button>
    </div>
    <p v-if="!online && queue.length" class="hint">{{ t(`${p}.offline_hint`) }}</p>
    <p v-if="phase === 'done'" class="ok">
      <i class="pi pi-check-circle" aria-hidden="true" />
      {{ t(`${p}.done_title`) }} — {{ t(`${p}.done_hint`, { n: synced }) }}
    </p>
  </SimShell>
</template>

<style scoped lang="scss">
.status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  margin-bottom: 14px;
  font-size: 0.75rem;
  color: #6b7280;
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 999px;
  background: #fff;
  color: #1b1b1b;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;

  &.is-on {
    border-color: #7c3aed;
    color: #7c3aed;
  }
}

.toggle__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b91c1c;
}

.toggle.is-on .toggle__dot {
  background: #059669;
}

.prompt {
  margin-bottom: 10px;
  font-size: 0.82rem;
  color: #6b7280;
}

.kinds {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.kind {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  border: 1px solid #e8e8e8;
  border-radius: var(--radius-md);
  background: #fff;
  color: #1b1b1b;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;

  i {
    color: #7c3aed;
  }

  &:hover {
    border-color: #7c3aed;
  }
}

.queue {
  padding: 12px;
  border-radius: var(--radius-md);
  background: #fff;
  border: 1px solid #e8e8e8;

  strong {
    display: block;
    margin-bottom: 8px;
    font-size: 0.82rem;
  }

  ul {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: grid;
    grid-template-columns: 18px 1fr auto auto;
    gap: 8px;
    align-items: center;
    font-size: 0.82rem;
  }

  em {
    font-style: normal;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
  }
}

.empty {
  margin: 0;
  font-size: 0.82rem;
  color: #6b7280;
}

.is-queued {
  color: #6b7280;
}
.is-syncing {
  color: #7c3aed;
}
.is-synced {
  color: #059669;
}
.is-conflict {
  color: #b91c1c;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.cta,
.ghost {
  min-height: 34px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

.cta {
  border: none;
  background: #7c3aed;
  color: #fff;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

.ghost {
  border: 1px solid #e8e8e8;
  background: #fff;
  color: #1b1b1b;
}

.hint,
.ok {
  margin-top: 10px;
  font-size: 0.78rem;
  color: #6b7280;
}

.ok {
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    color: #7c3aed;
  }
}

@media (max-width: 640px) {
  .kinds {
    grid-template-columns: 1fr;
  }
}
</style>
