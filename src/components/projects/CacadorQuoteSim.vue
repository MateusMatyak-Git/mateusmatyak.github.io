<script setup lang="ts">
import { computed, onUnmounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SimShell from '@/components/projects/SimShell.vue'

const { t, locale } = useI18n()

type QuoteKind = 'auto' | 'home' | 'business'
type Deductible = 'low' | 'mid' | 'high'
type Phase = 'select' | 'import' | 'extract' | 'review' | 'generating' | 'done'

const kinds: { id: QuoteKind; icon: string }[] = [
  { id: 'auto', icon: 'pi-car' },
  { id: 'home', icon: 'pi-home' },
  { id: 'business', icon: 'pi-briefcase' },
]

const coverageByKind: Record<QuoteKind, { id: string; premium: number }[]> = {
  auto: [
    { id: 'comprehensive', premium: 2847.9 },
    { id: 'third_party', premium: 1420 },
    { id: 'glass', premium: 1980 },
  ],
  home: [
    { id: 'fire_theft', premium: 1120 },
    { id: 'full', premium: 1680 },
    { id: 'basic', premium: 890 },
  ],
  business: [
    { id: 'full', premium: 4350 },
    { id: 'fire', premium: 2800 },
    { id: 'liability', premium: 3200 },
  ],
}

const deductibleFactor: Record<Deductible, number> = {
  low: 1,
  mid: 0.92,
  high: 0.85,
}

const confidence: Record<string, number> = {
  insurer: 98,
  insured: 91,
  asset: 87,
}

const phase = ref<Phase>('select')
const kind = ref<QuoteKind | null>(null)
const logs = ref<string[]>([])
const visibleFields = ref(0)
const dragging = ref(false)
const dirty = reactive({ insured: false, asset: false, coverage: false, deductible: false })
const draft = reactive({
  insurer: '',
  insured: '',
  asset: '',
  coverageId: '',
  deductible: 'mid' as Deductible,
})

const timers: ReturnType<typeof setTimeout>[] = []

const fileName = computed(() => (kind.value ? t(`projects.sim.file.${kind.value}`) : ''))

const coverages = computed(() => (kind.value ? coverageByKind[kind.value] : []))

const premium = computed(() => {
  const option = coverages.value.find((item) => item.id === draft.coverageId)
  if (!option) return 0
  return option.premium * deductibleFactor[draft.deductible]
})

const premiumLabel = computed(() =>
  new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'BRL',
  }).format(premium.value),
)

const canGenerate = computed(() => draft.insured.trim().length > 1 && draft.asset.trim().length > 1)

const stepIndex = computed(() => {
  if (phase.value === 'select') return 0
  if (phase.value === 'import' || phase.value === 'extract') return 1
  if (phase.value === 'review' || phase.value === 'generating') return 2
  return 3
})

const steps = computed(() =>
  ['step_type', 'step_import', 'step_review', 'step_done'].map((key) => ({
    key,
    label: t(`projects.sim.${key}`),
  })),
)

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function later(ms: number, fn: () => void) {
  const id = setTimeout(fn, prefersReducedMotion() ? 0 : ms)
  timers.push(id)
}

function clearTimers() {
  while (timers.length) {
    const id = timers.pop()
    if (id) clearTimeout(id)
  }
}

function selectKind(id: QuoteKind) {
  kind.value = id
  logs.value = []
  visibleFields.value = 0
  phase.value = 'import'
}

function fillDraftFromSample() {
  if (!kind.value) return
  draft.insurer = t(`projects.sim.sample.${kind.value}.insurer`)
  draft.insured = t(`projects.sim.sample.${kind.value}.insured`)
  draft.asset = t(`projects.sim.sample.${kind.value}.asset`)
  draft.coverageId = coverageByKind[kind.value][0].id
  draft.deductible = 'mid'
  dirty.insured = false
  dirty.asset = false
  dirty.coverage = false
  dirty.deductible = false
}

function startImport() {
  if (!kind.value) return
  phase.value = 'extract'
  logs.value = []
  visibleFields.value = 0
  fillDraftFromSample()
  const insurer = draft.insurer

  later(200, () => {
    logs.value = [t('projects.sim.log_detect')]
  })
  later(700, () => {
    logs.value = [...logs.value, t('projects.sim.log_found', { insurer })]
    visibleFields.value = 1
  })
  later(1200, () => {
    logs.value = [...logs.value, t('projects.sim.log_person')]
    visibleFields.value = 2
  })
  later(1700, () => {
    logs.value = [...logs.value, t('projects.sim.log_asset')]
    visibleFields.value = 3
  })
  later(2200, () => {
    logs.value = [...logs.value, t('projects.sim.log_done')]
    visibleFields.value = 5
  })
  later(2600, () => {
    phase.value = 'review'
    visibleFields.value = 5
  })
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  dragging.value = false
  startImport()
}

function generate() {
  if (!canGenerate.value) return
  phase.value = 'generating'
  later(900, () => {
    phase.value = 'done'
  })
}

function restore() {
  fillDraftFromSample()
}

function restart() {
  clearTimers()
  phase.value = 'select'
  kind.value = null
  logs.value = []
  visibleFields.value = 0
  dragging.value = false
}

onUnmounted(clearTimers)
</script>

<template>
  <SimShell
    brand="#c61843"
    :title="t('projects.sim.title')"
    locked
    :locked-label="t('projects.private')"
    :steps="steps"
    :step-index="stepIndex"
    :show-restart="phase !== 'select'"
    :restart-label="t('projects.sim.restart')"
    :aria-label="t('projects.sim.aria')"
    @restart="restart"
  >
    <template #brand-icon>
      <i class="pi pi-shield" aria-hidden="true" />
    </template>

    <div v-if="phase === 'select'" class="sim__select">
      <p class="sim__prompt">{{ t('projects.sim.select_label') }}</p>
      <div class="sim__kinds">
        <button
          v-for="item in kinds"
          :key="item.id"
          type="button"
          class="sim__kind"
          @click="selectKind(item.id)"
        >
          <i :class="['pi', item.icon]" aria-hidden="true" />
          {{ t(`projects.sim.types.${item.id}`) }}
        </button>
      </div>
    </div>

    <div v-else-if="phase === 'import'" class="sim__import">
      <div
        class="sim__drop"
        :class="{ 'is-dragging': dragging }"
        @dragenter.prevent="dragging = true"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop="onDrop"
      >
        <i class="pi pi-file-pdf" aria-hidden="true" />
        <strong>{{ dragging ? t('projects.sim.drop_active') : t('projects.sim.import_title') }}</strong>
        <p>{{ t('projects.sim.import_hint') }}</p>
        <button type="button" class="sim__cta" @click="startImport">
          <i class="pi pi-upload" aria-hidden="true" />
          {{ t('projects.sim.import_cta') }}
        </button>
      </div>
    </div>

    <div v-else-if="phase === 'extract'" class="sim__extract">
      <div class="sim__file">
        <i class="pi pi-file-pdf" aria-hidden="true" />
        <span>{{ fileName }}</span>
        <span class="sim__file-status">{{ t('projects.sim.processing') }}</span>
      </div>
      <ul class="sim__log">
        <li v-for="(line, index) in logs" :key="index">
          <i class="pi pi-check" aria-hidden="true" />
          {{ line }}
        </li>
      </ul>
      <dl class="sim__fields">
        <div class="sim__field" :class="{ 'is-visible': visibleFields >= 1 }">
          <dt>{{ t('projects.sim.field_insurer') }}</dt>
          <dd>{{ draft.insurer }}</dd>
        </div>
        <div class="sim__field" :class="{ 'is-visible': visibleFields >= 2 }">
          <dt>{{ t('projects.sim.field_insured') }}</dt>
          <dd>{{ draft.insured }}</dd>
        </div>
        <div class="sim__field" :class="{ 'is-visible': visibleFields >= 3 }">
          <dt>{{ t('projects.sim.field_asset') }}</dt>
          <dd>{{ draft.asset }}</dd>
        </div>
      </dl>
    </div>

    <div v-else-if="phase === 'review' || phase === 'generating'" class="sim__review">
      <div class="sim__review-head">
        <strong>{{ t('projects.sim.review_title') }}</strong>
        <p>{{ t('projects.sim.review_hint') }}</p>
      </div>

      <label class="sim__input">
        <span>
          {{ t('projects.sim.field_insured') }}
          <em>{{ dirty.insured ? t('projects.sim.edited') : t('projects.sim.confidence', { n: confidence.insured }) }}</em>
        </span>
        <input v-model="draft.insured" type="text" @input="dirty.insured = true" />
      </label>

      <label class="sim__input">
        <span>
          {{ t('projects.sim.field_asset') }}
          <em>{{ dirty.asset ? t('projects.sim.edited') : t('projects.sim.confidence', { n: confidence.asset }) }}</em>
        </span>
        <input v-model="draft.asset" type="text" @input="dirty.asset = true" />
      </label>

      <div class="sim__block">
        <span class="sim__block-label">{{ t('projects.sim.field_coverage') }}</span>
        <div class="sim__chips">
          <button
            v-for="option in coverages"
            :key="option.id"
            type="button"
            class="sim__chip"
            :class="{ 'is-active': draft.coverageId === option.id }"
            @click="draft.coverageId = option.id; dirty.coverage = true"
          >
            {{ t(`projects.sim.coverages.${kind}.${option.id}`) }}
          </button>
        </div>
      </div>

      <div class="sim__block">
        <span class="sim__block-label">{{ t('projects.sim.deductible') }}</span>
        <div class="sim__chips">
          <button
            v-for="id in ['low', 'mid', 'high'] as Deductible[]"
            :key="id"
            type="button"
            class="sim__chip"
            :class="{ 'is-active': draft.deductible === id }"
            @click="draft.deductible = id; dirty.deductible = true"
          >
            {{ t(`projects.sim.deductibles.${id}`) }}
          </button>
        </div>
      </div>

      <div class="sim__premium">
        <span>{{ t('projects.sim.field_premium') }}</span>
        <strong>{{ premiumLabel }}</strong>
      </div>

      <div class="sim__actions">
        <button type="button" class="sim__ghost" @click="restore">
          {{ t('projects.sim.restore') }}
        </button>
        <button
          type="button"
          class="sim__cta"
          :disabled="phase === 'generating' || !canGenerate"
          @click="generate"
        >
          <i class="pi pi-file-export" aria-hidden="true" />
          {{ phase === 'generating' ? t('projects.sim.generating') : t('projects.sim.generate') }}
        </button>
      </div>
      <p v-if="!canGenerate" class="sim__warn">{{ t('projects.sim.required') }}</p>
    </div>

    <div v-else class="sim__done">
      <article class="sim__pdf">
        <header class="sim__pdf-head">
          <span class="sim__pdf-mark" aria-hidden="true">C</span>
          <div>
            <strong>{{ t('projects.items.cacador.client') }}</strong>
            <span>
              {{ t('projects.sim.pdf_kicker') }}
              · {{ kind ? t(`projects.sim.types.${kind}`) : '' }}
            </span>
          </div>
        </header>
        <dl class="sim__pdf-body">
          <div>
            <dt>{{ t('projects.sim.field_insurer') }}</dt>
            <dd>{{ draft.insurer }}</dd>
          </div>
          <div>
            <dt>{{ t('projects.sim.field_insured') }}</dt>
            <dd>{{ draft.insured }}</dd>
          </div>
          <div>
            <dt>{{ t('projects.sim.field_asset') }}</dt>
            <dd>{{ draft.asset }}</dd>
          </div>
          <div>
            <dt>{{ t('projects.sim.field_coverage') }}</dt>
            <dd>{{ kind ? t(`projects.sim.coverages.${kind}.${draft.coverageId}`) : '' }}</dd>
          </div>
          <div>
            <dt>{{ t('projects.sim.deductible') }}</dt>
            <dd>{{ t(`projects.sim.deductibles.${draft.deductible}`) }}</dd>
          </div>
          <div>
            <dt>{{ t('projects.sim.field_premium') }}</dt>
            <dd>{{ premiumLabel }}</dd>
          </div>
        </dl>
        <footer class="sim__pdf-foot">{{ t('projects.sim.pdf_slogan') }}</footer>
      </article>
      <p class="sim__done-msg">
        <i class="pi pi-check-circle" aria-hidden="true" />
        {{ t('projects.sim.done_title') }} — {{ t('projects.sim.done_hint') }}
      </p>
    </div>
  </SimShell>
</template>

<style scoped lang="scss">
.sim__prompt {
  margin-bottom: 14px;
  text-align: center;
  font-size: 0.82rem;
  color: #6b7280;
}

.sim__kinds {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.sim__kind,
.sim__chip,
.sim__cta,
.sim__ghost {
  cursor: pointer;
}

.sim__kind {
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

  i {
    font-size: 1.15rem;
    color: #c61843;
  }

  &:hover {
    border-color: #c61843;
    transform: translateY(-2px);
  }
}

.sim__cta,
.sim__ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-sm);
  font-size: 0.84rem;
  font-weight: 600;
}

.sim__cta {
  border: none;
  background: #c61843;
  color: #fff;

  &:hover:not(:disabled) {
    background: #9a1234;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.sim__ghost {
  border: 1px solid #e8e8e8;
  background: #fff;
  color: #1b1b1b;
}

.sim__drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 36px 16px;
  border: 1px dashed #d7b4bd;
  border-radius: var(--radius-md);
  background: #fff;
  text-align: center;

  i {
    font-size: 1.6rem;
    color: #c61843;
  }

  p {
    max-width: 320px;
    margin-bottom: 10px;
    font-size: 0.82rem;
    color: #6b7280;
  }

  &.is-dragging {
    border-color: #c61843;
    background: #fff5f7;
  }
}

.sim__file {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 14px;
  border-radius: var(--radius-sm);
  background: #fff;
  border: 1px solid #e8e8e8;
  font-family: var(--font-mono);
  font-size: 0.75rem;

  i {
    color: #c61843;
  }
}

.sim__file-status {
  margin-left: auto;
  color: #6b7280;
}

.sim__log {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0 0 14px;
  padding: 0;
  list-style: none;
  font-size: 0.78rem;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  i {
    font-size: 0.7rem;
    color: #c61843;
  }
}

.sim__fields {
  display: grid;
  gap: 8px;
}

.sim__field {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  background: #fff;
  border: 1px solid #e8e8e8;
  opacity: 0;

  &.is-visible {
    opacity: 1;
  }

  dt {
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6b7280;
  }

  dd {
    margin: 0;
    font-size: 0.84rem;
    font-weight: 600;
  }
}

.sim__review-head {
  margin-bottom: 14px;

  strong {
    display: block;
    margin-bottom: 4px;
  }

  p {
    font-size: 0.82rem;
    color: #6b7280;
  }
}

.sim__input {
  display: grid;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;

  em {
    margin-left: 8px;
    font-style: normal;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
    color: #c61843;
  }

  input {
    min-height: 38px;
    padding: 0 10px;
    border: 1px solid #e8e8e8;
    border-radius: var(--radius-sm);
    background: #fff;
    color: #1b1b1b;
    font-size: 0.88rem;
    font-weight: 600;
    text-transform: none;
  }
}

.sim__block {
  margin-bottom: 12px;
}

.sim__block-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
}

.sim__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sim__chip {
  padding: 7px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 999px;
  background: #fff;
  color: #1b1b1b;
  font-size: 0.78rem;
  font-weight: 600;

  &.is-active {
    border-color: #c61843;
    background: #fff5f7;
    color: #c61843;
  }
}

.sim__premium {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 8px 0 16px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  background: #fff;
  border: 1px solid #e8e8e8;

  span {
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6b7280;
  }

  strong {
    font-size: 1.15rem;
    color: #c61843;
  }
}

.sim__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.sim__warn {
  margin-top: 8px;
  text-align: right;
  font-size: 0.75rem;
  color: #c61843;
}

.sim__done {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.sim__pdf {
  width: min(100%, 360px);
  padding: 16px 18px 14px;
  background: #fff;
  border: 1px solid #e8e8e8;
  box-shadow: var(--shadow-md);
}

.sim__pdf-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 2px solid #c61843;
}

.sim__pdf-mark {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #c61843;
  color: #fff;
  font-weight: 700;
}

.sim__pdf-body {
  display: grid;
  gap: 8px;

  div {
    display: grid;
    grid-template-columns: 92px 1fr;
    gap: 8px;
  }

  dt {
    font-size: 0.65rem;
    text-transform: uppercase;
    color: #6b7280;
  }

  dd {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 600;
  }
}

.sim__pdf-foot {
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid #e8e8e8;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #c61843;
  text-align: center;
}

.sim__done-msg {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: #6b7280;

  i {
    color: #c61843;
  }
}

@media (max-width: 640px) {
  .sim__kinds {
    grid-template-columns: 1fr;
  }
}
</style>
