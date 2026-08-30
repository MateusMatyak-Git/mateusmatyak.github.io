<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SimShell from '@/components/projects/SimShell.vue'
import { projects } from '@/data/projects'

const { t } = useI18n()

type Phase = 'select' | 'run' | 'review' | 'fail' | 'done'
type HopStatus = 'idle' | 'active' | 'ok' | 'fail'

const item = projects.find((project) => project.id === 'events')!
const hops = ['spa', 'gateway', 'bff', 'queue', 'worker'] as const

const phase = ref<Phase>('select')
const choice = ref<string | null>(null)
const hopStatus = ref<Record<(typeof hops)[number], HopStatus>>({
  spa: 'idle',
  gateway: 'idle',
  bff: 'idle',
  queue: 'idle',
  worker: 'idle',
})
const copied = ref(false)
const timers: ReturnType<typeof setTimeout>[] = []

const p = 'projects.items.events.sim'
const trace = computed(() =>
  choice.value ? t(`${p}.sample.${choice.value}.trace`) : '',
)

const stepIndex = computed(() => {
  if (phase.value === 'select') return 0
  if (phase.value === 'run') return 1
  if (phase.value === 'review' || phase.value === 'fail') return 2
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

function clearTimers() {
  while (timers.length) {
    const id = timers.pop()
    if (id) clearTimeout(id)
  }
}

function resetHops() {
  hopStatus.value = { spa: 'idle', gateway: 'idle', bff: 'idle', queue: 'idle', worker: 'idle' }
}

function runPipeline(id: string, failAtEnd = false) {
  choice.value = id
  phase.value = 'run'
  resetHops()

  hops.forEach((hop, index) => {
    later(180 + index * 420, () => {
      hopStatus.value = { ...hopStatus.value, [hop]: 'active' }
    })
    later(180 + index * 420 + 320, () => {
      const isLast = hop === 'worker'
      hopStatus.value = {
        ...hopStatus.value,
        [hop]: isLast && failAtEnd ? 'fail' : 'ok',
      }
    })
  })

  later(180 + hops.length * 420 + 360, () => {
    phase.value = failAtEnd ? 'fail' : 'review'
  })
}

function injectFail() {
  runPipeline(choice.value!, true)
}

function retry() {
  runPipeline(choice.value!, false)
}

async function copyTrace() {
  if (!trace.value) return
  try {
    await navigator.clipboard.writeText(trace.value)
  } catch {
    /* ignore */
  }
  copied.value = true
  later(1600, () => {
    copied.value = false
  })
}

function restart() {
  clearTimers()
  phase.value = 'select'
  choice.value = null
  copied.value = false
  resetHops()
}

onUnmounted(clearTimers)
</script>

<template>
  <SimShell
    :brand="item.brand"
    :title="t(`${p}.title`)"
    locked
    :locked-label="t('projects.private')"
    :steps="steps"
    :step-index="stepIndex"
    :show-restart="phase !== 'select'"
    :restart-label="t('projects.sim.restart')"
    @restart="restart"
  >
    <template #brand-icon>
      <i class="pi pi-sitemap" aria-hidden="true" />
    </template>

    <div v-if="phase === 'select'">
      <p class="prompt">{{ t(`${p}.select_label`) }}</p>
      <div class="kinds">
        <button
          v-for="option in item.choices"
          :key="option.id"
          type="button"
          class="kind"
          @click="runPipeline(option.id)"
        >
          <i :class="['pi', option.icon]" aria-hidden="true" />
          {{ t(`${p}.choices.${option.id}`) }}
        </button>
      </div>
    </div>

    <div v-else>
      <ol class="hops">
        <li
          v-for="hop in hops"
          :key="hop"
          class="hop"
          :class="`is-${hopStatus[hop]}`"
        >
          <span class="hop__dot" />
          <strong>{{ t(`${p}.hops.${hop}`) }}</strong>
          <small>{{ t(`${p}.hop_status.${hopStatus[hop]}`) }}</small>
        </li>
      </ol>

      <div v-if="phase === 'review' || phase === 'done'" class="panel">
        <dl>
          <div v-for="field in item.fields" :key="field">
            <dt>{{ t(`${p}.field_labels.${field}`) }}</dt>
            <dd>{{ t(`${p}.sample.${choice}.${field}`) }}</dd>
          </div>
        </dl>
        <div v-if="phase === 'review'" class="actions">
          <button type="button" class="ghost" @click="copyTrace">
            {{ copied ? t(`${p}.copied`) : t(`${p}.copy_trace`) }}
          </button>
          <button type="button" class="ghost" @click="injectFail">
            {{ t(`${p}.inject_fail`) }}
          </button>
          <button type="button" class="cta" @click="phase = 'done'">
            {{ t(`${p}.confirm`) }}
          </button>
        </div>
      </div>

      <div v-else-if="phase === 'fail'" class="fail">
        <strong>{{ t(`${p}.fail_title`) }}</strong>
        <p>{{ t(`${p}.fail_hint`) }}</p>
        <button type="button" class="cta" @click="retry">{{ t(`${p}.retry`) }}</button>
      </div>

      <p v-if="phase === 'done'" class="ok">
        <i class="pi pi-check-circle" aria-hidden="true" />
        {{ t(`${p}.done_title`) }} — {{ t(`${p}.done_hint`) }}
      </p>
    </div>
  </SimShell>
</template>

<style scoped lang="scss">
.prompt {
  margin-bottom: 14px;
  text-align: center;
  font-size: 0.82rem;
  color: #6b7280;
}

.kinds {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.kind {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 22px 10px;
  border: 1px solid #e8e8e8;
  border-radius: var(--radius-md);
  background: #fff;
  color: #1b1b1b;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;

  i {
    color: #0f766e;
  }

  &:hover {
    border-color: #0f766e;
  }
}

.hops {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  margin: 0 0 16px;
  padding: 0;
  list-style: none;
}

.hop {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 8px;
  border-radius: var(--radius-sm);
  background: #fff;
  border: 1px solid #e8e8e8;
  text-align: center;

  strong {
    font-size: 0.72rem;
  }

  small {
    font-size: 0.62rem;
    color: #6b7280;
  }
}

.hop__dot {
  width: 8px;
  height: 8px;
  margin-inline: auto;
  border-radius: 50%;
  background: #e8e8e8;
}

.hop.is-active {
  border-color: #0f766e;

  .hop__dot {
    background: #0f766e;
  }
}

.hop.is-ok .hop__dot {
  background: #059669;
}

.hop.is-fail {
  border-color: #b91c1c;

  .hop__dot {
    background: #b91c1c;
  }
}

.panel dl,
.panel div {
  display: grid;
  gap: 8px;
}

.panel dl div {
  grid-template-columns: 88px 1fr;
  padding: 8px 10px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: var(--radius-sm);
}

.panel dt {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: #6b7280;
}

.panel dd {
  margin: 0;
  font-size: 0.84rem;
  font-weight: 600;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
  justify-content: flex-end;
}

.cta,
.ghost {
  min-height: 36px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.cta {
  border: none;
  background: #0f766e;
  color: #fff;
}

.ghost {
  border: 1px solid #e8e8e8;
  background: #fff;
  color: #1b1b1b;
}

.fail {
  padding: 16px;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  background: #fff1f2;

  p {
    margin: 8px 0 12px;
    font-size: 0.82rem;
    color: #6b7280;
  }
}

.ok {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  font-size: 0.82rem;
  color: #6b7280;

  i {
    color: #0f766e;
  }
}

@media (max-width: 640px) {
  .kinds,
  .hops {
    grid-template-columns: 1fr;
  }
}
</style>
