<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SimShell from '@/components/projects/SimShell.vue'
import { projects } from '@/data/projects'

const { t } = useI18n()

type Phase = 'select' | 'triage' | 'note' | 'done'
type Priority = 'low' | 'medium' | 'high'
type QueueId = 'identity' | 'finance' | 'platform'

const item = projects.find((project) => project.id === 'support')!
const phase = ref<Phase>('select')
const choice = ref<string | null>(null)
const priority = ref<Priority | null>(null)
const queue = ref<QueueId | null>(null)
const note = ref('')

const p = 'projects.items.support.sim'
const defaultQueue: Record<string, QueueId> = {
  access: 'identity',
  billing: 'finance',
  outage: 'platform',
}

const canOpen = computed(() => Boolean(choice.value && priority.value && queue.value))

const stepIndex = computed(() => {
  if (phase.value === 'select') return 0
  if (phase.value === 'triage') return 1
  if (phase.value === 'note') return 2
  return 3
})

const steps = computed(() =>
  ['select', 'run', 'review', 'done'].map((key) => ({
    key,
    label: t(`${p}.steps.${key}`),
  })),
)

function pickTicket(id: string) {
  choice.value = id
  priority.value = id === 'outage' ? 'high' : id === 'billing' ? 'low' : 'medium'
  queue.value = defaultQueue[id]
  note.value = ''
  phase.value = 'triage'
}

function openProtocol() {
  if (!canOpen.value) return
  phase.value = 'done'
}

function restart() {
  phase.value = 'select'
  choice.value = null
  priority.value = null
  queue.value = null
  note.value = ''
}
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
      <i class="pi pi-headphones" aria-hidden="true" />
    </template>

    <div v-if="phase === 'select'">
      <p class="prompt">{{ t(`${p}.select_label`) }}</p>
      <div class="kinds">
        <button
          v-for="option in item.choices"
          :key="option.id"
          type="button"
          class="kind"
          @click="pickTicket(option.id)"
        >
          <i :class="['pi', option.icon]" aria-hidden="true" />
          {{ t(`${p}.choices.${option.id}`) }}
        </button>
      </div>
    </div>

    <div v-else>
      <article class="story">
        <span>{{ t(`${p}.field_labels.ticket`) }} {{ t(`${p}.sample.${choice}.ticket`) }}</span>
        <p>{{ t(`${p}.stories.${choice}`) }}</p>
      </article>

      <div v-if="phase === 'triage' || phase === 'note' || phase === 'done'" class="block">
        <span>{{ t(`${p}.priority_label`) }}</span>
        <div class="chips">
          <button
            v-for="id in ['low', 'medium', 'high'] as Priority[]"
            :key="id"
            type="button"
            class="chip"
            :class="{ 'is-active': priority === id, 'is-high': id === 'high' }"
            :disabled="phase === 'done'"
            @click="priority = id"
          >
            {{ t(`${p}.priorities.${id}`) }}
          </button>
        </div>
      </div>

      <div v-if="phase === 'triage' || phase === 'note' || phase === 'done'" class="block">
        <span>{{ t(`${p}.queue_label`) }}</span>
        <div class="chips">
          <button
            v-for="id in ['identity', 'finance', 'platform'] as QueueId[]"
            :key="id"
            type="button"
            class="chip"
            :class="{ 'is-active': queue === id }"
            :disabled="phase === 'done'"
            @click="queue = id"
          >
            {{ t(`${p}.queues.${id}`) }}
          </button>
        </div>
      </div>

      <div v-if="phase === 'triage'" class="actions">
        <button type="button" class="cta" @click="phase = 'note'">
          {{ t(`${p}.continue`) }}
        </button>
      </div>

      <label v-if="phase === 'note' || phase === 'done'" class="note">
        {{ t(`${p}.note_label`) }}
        <textarea
          v-model="note"
          :placeholder="t(`${p}.note_placeholder`)"
          :readonly="phase === 'done'"
          rows="3"
        />
      </label>

      <div v-if="phase === 'note'" class="actions">
        <button type="button" class="ghost" @click="phase = 'triage'">{{ t(`${p}.back`) }}</button>
        <button type="button" class="cta" :disabled="!canOpen" @click="openProtocol">
          {{ t(`${p}.confirm`) }}
        </button>
      </div>

      <div v-if="phase === 'done'" class="done">
        <strong>{{ t(`${p}.done_title`) }}</strong>
        <p>
          {{ t(`${p}.sample.${choice}.protocol`) }}
          · {{ priority ? t(`${p}.priorities.${priority}`) : '' }}
          · {{ queue ? t(`${p}.queues.${queue}`) : '' }}
        </p>
        <span>{{ t(`${p}.done_hint`) }}</span>
      </div>
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
    color: #0369a1;
  }

  &:hover {
    border-color: #0369a1;
  }
}

.story {
  margin-bottom: 14px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: #fff;
  border: 1px solid #e8e8e8;

  span {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: #0369a1;
  }

  p {
    margin-top: 6px;
    font-size: 0.86rem;
    line-height: 1.5;
  }
}

.block {
  margin-bottom: 12px;

  > span {
    display: block;
    margin-bottom: 8px;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6b7280;
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 7px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 999px;
  background: #fff;
  color: #1b1b1b;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;

  &.is-active {
    border-color: #0369a1;
    background: #e0f2fe;
    color: #0369a1;
  }

  &.is-high.is-active {
    border-color: #b91c1c;
    background: #fef2f2;
    color: #b91c1c;
  }
}

.note {
  display: grid;
  gap: 6px;
  margin: 8px 0 14px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;

  textarea {
    padding: 10px;
    border: 1px solid #e8e8e8;
    border-radius: var(--radius-sm);
    font: inherit;
    font-size: 0.86rem;
    font-weight: 500;
    text-transform: none;
    resize: vertical;
  }
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.cta,
.ghost {
  min-height: 36px;
  padding: 0 14px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.cta {
  border: none;
  background: #0369a1;
  color: #fff;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.ghost {
  border: 1px solid #e8e8e8;
  background: #fff;
  color: #1b1b1b;
}

.done {
  margin-top: 8px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: #fff;
  border: 1px solid #e8e8e8;

  p,
  span {
    display: block;
    margin-top: 4px;
    font-size: 0.82rem;
    color: #6b7280;
  }
}

@media (max-width: 640px) {
  .kinds {
    grid-template-columns: 1fr;
  }
}
</style>
