<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Tag from 'primevue/tag'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { monthsInclusive, timeline, type Role, type TimelineItem } from '@/data/experience'

const { t, locale } = useI18n()

function monthYear(ym: string) {
  const [year, month] = ym.split('-')
  return t('experience.month_year', {
    month: t(`experience.months.${Number(month) - 1}`),
    year,
  })
}

function dateRange(start: string, end: string | null) {
  const startLabel = monthYear(start)
  if (!end) return t('experience.range_present', { start: startLabel })
  return t('experience.range', { start: startLabel, end: monthYear(end) })
}

function duration(start: string, end: string | null) {
  const total = monthsInclusive(start, end)
  const years = Math.floor(total / 12)
  const months = total % 12
  if (years === 0) return t('experience.n_months', months)
  if (months === 0) return t('experience.n_years', years)
  return `${t('experience.n_years', years)} ${t('experience.n_months', months)}`
}

function metaLine(start: string, end: string | null) {
  return `${dateRange(start, end)} · ${duration(start, end)}`
}

function isGrouped(item: TimelineItem) {
  return item.roles.length > 1
}

function roleTitle(role: Role) {
  return t(`experience.roles.${role.id}.title`)
}

function roleSummary(role: Role) {
  return t(`experience.roles.${role.id}.summary`)
}
</script>

<template>
  <section id="experience" class="section experience">
    <div class="container">
      <SectionHeading centered :title="t('experience.title')" :subtitle="t('experience.subtitle')" />

      <ol class="timeline" :lang="locale">
        <li
          v-for="(item, index) in timeline"
          :key="item.id"
          v-reveal
          class="timeline__item"
          :class="{ 'is-current': item.current }"
          :style="{ transitionDelay: `${index * 70}ms` }"
        >
          <div class="timeline__rail" aria-hidden="true">
            <span v-if="item.logo" class="timeline__logo">
              <img :src="item.logo" :alt="t(`experience.companies.${item.company}`)" />
            </span>
            <span v-else class="timeline__logo timeline__logo--icon">
              <i class="pi pi-graduation-cap" aria-hidden="true" />
            </span>
          </div>

          <article class="timeline__card">
            <template v-if="isGrouped(item)">
              <div class="timeline__head">
                <h3 class="timeline__company">{{ t(`experience.companies.${item.company}`) }}</h3>
                <p class="timeline__muted">{{ duration(item.start, item.end) }}</p>
                <p class="timeline__muted">
                  {{ t('experience.location') }}
                  <span v-if="item.workMode"> · {{ t(`experience.modes.${item.workMode}`) }}</span>
                </p>
              </div>

              <ol class="timeline__nested">
                <li v-for="role in item.roles" :key="role.id" class="timeline__role">
                  <h4 class="timeline__title">{{ roleTitle(role) }}</h4>
                  <p class="timeline__muted">
                    {{ t(`experience.types.${role.employmentType}`) }}
                  </p>
                  <p class="timeline__muted">{{ metaLine(role.start, role.end) }}</p>
                  <p class="timeline__summary">{{ roleSummary(role) }}</p>
                  <div v-if="role.skills.length" class="timeline__skills">
                    <Tag
                      v-for="skill in role.skills"
                      :key="skill"
                      :value="t(`experience.skill.${skill}`)"
                    />
                  </div>
                </li>
              </ol>
            </template>

            <template v-else-if="item.company === 'education'">
              <div class="timeline__head">
                <h3 class="timeline__title">{{ t('experience.companies.education') }}</h3>
                <p class="timeline__muted">{{ metaLine(item.start, item.end) }}</p>
              </div>
              <p class="timeline__summary">{{ roleSummary(item.roles[0]) }}</p>
            </template>

            <template v-else>
              <div class="timeline__head">
                <div class="timeline__title-row">
                  <h3 class="timeline__title">{{ roleTitle(item.roles[0]) }}</h3>
                  <span v-if="item.current" class="timeline__now">{{ t('experience.now') }}</span>
                </div>
                <p class="timeline__company-line">
                  {{ t(`experience.companies.${item.company}`) }}
                  · {{ t(`experience.types.${item.roles[0].employmentType}`) }}
                </p>
                <p class="timeline__muted">{{ metaLine(item.start, item.end) }}</p>
                <p class="timeline__muted">
                  {{ t('experience.location') }}
                  <span v-if="item.workMode"> · {{ t(`experience.modes.${item.workMode}`) }}</span>
                </p>
              </div>
              <p class="timeline__summary">{{ roleSummary(item.roles[0]) }}</p>
              <div v-if="item.roles[0].skills.length" class="timeline__skills">
                <Tag
                  v-for="skill in item.roles[0].skills"
                  :key="skill"
                  :value="t(`experience.skill.${skill}`)"
                />
              </div>
            </template>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
.experience {
  padding-top: 40px;
}

.timeline {
  --rail-size: 52px;
  --rail-gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.timeline__item {
  display: grid;
  grid-template-columns: var(--rail-size) minmax(0, 1fr);
  column-gap: var(--rail-gap);
  position: relative;
  padding-bottom: 32px;

  &:last-child {
    padding-bottom: 0;
  }

  &:last-child .timeline__rail::after {
    display: none;
  }
}

.timeline__rail {
  position: relative;
  display: flex;
  justify-content: center;

  &::after {
    content: '';
    position: absolute;
    top: var(--rail-size);
    bottom: -32px;
    left: 50%;
    width: 1px;
    background: var(--color-border-strong);
    transform: translateX(-50%);
  }
}

.timeline__logo {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: var(--rail-size);
  height: var(--rail-size);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-surface);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.timeline__logo--icon {
  color: var(--color-accent);
  background: var(--color-accent-soft);

  i {
    font-size: 1.15rem;
  }
}

.timeline__item.is-current .timeline__logo {
  border-color: var(--color-accent);
}

.timeline__card {
  min-width: 0;
  padding-top: 2px;
}

.timeline__head {
  margin-bottom: 12px;
}

.timeline__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 10px;
  margin-bottom: 6px;
}

.timeline__title {
  font-size: 1.12rem;
  color: var(--color-text);
}

.timeline__company {
  font-size: 1.12rem;
  color: var(--color-text);
  margin-bottom: 6px;
}

.timeline__company-line {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.timeline__now {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.timeline__muted {
  font-size: 0.84rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.timeline__summary {
  font-size: 0.92rem;
  line-height: 1.65;
  margin-top: 10px;
}

.timeline__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
}

.timeline__nested {
  list-style: none;
  margin: 4px 0 0;
  padding: 0 0 0 16px;
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.timeline__role {
  position: relative;
  padding-left: 14px;

  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: -4px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--color-border-strong);
  }
}

.timeline__role .timeline__title {
  font-size: 1rem;
  margin-bottom: 4px;
}

@media (max-width: 640px) {
  .timeline {
    --rail-size: 40px;
    --rail-gap: 14px;
  }

  .timeline__logo {
    border-radius: 10px;
  }

  .timeline__nested {
    padding-left: 12px;
  }
}
</style>
