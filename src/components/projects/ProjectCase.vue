<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import type { ProjectDef } from '@/data/projects'
import CacadorQuoteSim from '@/components/projects/CacadorQuoteSim.vue'
import EventsPipelineSim from '@/components/projects/EventsPipelineSim.vue'
import EventsBffSim from '@/components/projects/EventsBffSim.vue'
import SupportConsoleSim from '@/components/projects/SupportConsoleSim.vue'
import OperationsPwaSim from '@/components/projects/OperationsPwaSim.vue'
import PwaBffSim from '@/components/projects/PwaBffSim.vue'

const props = defineProps<{
  project: ProjectDef
}>()

const { t, te } = useI18n()

const view = ref<'front' | 'bff'>('front')
const item = computed(() => `projects.items.${props.project.id}`)

const liveLabel = computed(() =>
  te(`${item.value}.cta`) ? t(`${item.value}.cta`) : t('projects.actions.live'),
)

const simHint = computed(() => {
  if (props.project.hasBff && view.value === 'bff' && te(`${item.value}.bff.hint`)) {
    return t(`${item.value}.bff.hint`)
  }
  return te(`${item.value}.sim_hint`) ? t(`${item.value}.sim_hint`) : t('projects.sim.subtitle')
})
</script>

<template>
  <article class="project">
    <div class="row g-5 align-items-start">
      <div class="col-12 col-lg-5">
        <p class="project__kicker">{{ t(`projects.categories.${project.category}`) }}</p>

        <div class="project__title-row">
          <h3 class="project__name">{{ t(`${item}.name`) }}</h3>
          <span
            v-if="project.codePrivate"
            v-tooltip.bottom="
              project.category === 'private'
                ? t('projects.confidential_hint')
                : t('projects.private_hint')
            "
            class="project__lock"
            :aria-label="t('projects.private')"
          >
            <i class="pi pi-lock" aria-hidden="true" />
            {{ t('projects.private') }}
          </span>
        </div>

        <p class="project__client">{{ t(`${item}.client`) }}</p>
        <p class="project__desc">{{ t(`${item}.description`) }}</p>

        <h4 class="project__how-title">{{ t('projects.how_title') }}</h4>
        <ol class="project__how">
          <li v-for="(key, index) in project.howKeys" :key="key">
            <span class="project__how-index">{{ index + 1 }}</span>
            <span>
              <strong>{{ t(`${item}.how.${key}.title`) }}</strong>
              {{ t(`${item}.how.${key}.body`) }}
            </span>
          </li>
        </ol>

        <div class="project__stack">
          <Tag v-for="tech in project.stack" :key="tech" :value="tech" />
        </div>

        <div class="project__actions">
          <Button
            v-if="project.liveUrl"
            as="a"
            :href="project.liveUrl"
            target="_blank"
            rel="noopener noreferrer"
            :label="liveLabel"
            icon="pi pi-external-link"
            icon-pos="right"
          />
          <Button
            v-if="project.repoUrl"
            as="a"
            :href="project.repoUrl"
            target="_blank"
            rel="noopener noreferrer"
            :label="t('projects.actions.repo')"
            icon="pi pi-github"
            icon-pos="right"
            severity="secondary"
            outlined
          />
        </div>
      </div>

      <div class="col-12 col-lg-7">
        <p class="project__sim-label">{{ t('projects.sim_label') }}</p>
        <div v-if="project.hasBff" class="project__views" role="tablist">
          <button
            type="button"
            class="project__view"
            :class="{ 'is-active': view === 'front' }"
            role="tab"
            :aria-selected="view === 'front'"
            @click="view = 'front'"
          >
            {{ t('projects.views.front') }}
          </button>
          <button
            type="button"
            class="project__view"
            :class="{ 'is-active': view === 'bff' }"
            role="tab"
            :aria-selected="view === 'bff'"
            @click="view = 'bff'"
          >
            {{ t('projects.views.bff') }}
          </button>
        </div>
        <p class="project__sim-hint">{{ simHint }}</p>
        <CacadorQuoteSim v-if="project.sim === 'cacador'" />
        <EventsPipelineSim v-else-if="project.sim === 'events' && view === 'front'" />
        <EventsBffSim v-else-if="project.sim === 'events' && view === 'bff'" />
        <SupportConsoleSim v-else-if="project.sim === 'support'" />
        <OperationsPwaSim v-else-if="project.sim === 'pwa' && view === 'front'" />
        <PwaBffSim v-else-if="project.sim === 'pwa' && view === 'bff'" />
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.project {
  padding: 8px 0 40px;
}

.project__kicker {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 10px;
}

.project__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
  margin-bottom: 8px;
}

.project__name {
  font-size: clamp(1.45rem, 2.4vw, 1.85rem);
  color: var(--color-text);
}

.project__lock {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: help;

  i {
    font-size: 0.7rem;
  }
}

.project__client {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 14px;
}

.project__desc {
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 28px;
}

.project__how-title {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 14px;
}

.project__how {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0 0 24px;
  padding: 0;
  list-style: none;
}

.project__how li {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 12px;
  align-items: start;
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--color-text-secondary);
}

.project__how strong {
  display: block;
  margin-bottom: 2px;
  color: var(--color-text);
  font-size: 0.9rem;
}

.project__how-index {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
}

.project__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 22px;
}

.project__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.project__sim-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

.project__views {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.project__view {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  color-scheme: light;

  &.is-active {
    border-color: var(--color-accent);
    background: var(--color-accent-soft);
    color: var(--color-accent);
  }
}

.project__sim-hint {
  font-size: 0.85rem;
  margin-bottom: 14px;
}

@media (max-width: 640px) {
  .project {
    padding: 4px 0 28px;
  }

  .project__name {
    font-size: 1.35rem;
  }

  .project__how li {
    font-size: 0.82rem;
  }

  .project__sim-hint {
    font-size: 0.8rem;
  }
}
</style>
