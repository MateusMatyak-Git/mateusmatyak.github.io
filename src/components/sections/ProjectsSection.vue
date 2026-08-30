<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ProjectCase from '@/components/projects/ProjectCase.vue'
import { projectCategories, projects, type ProjectCategory } from '@/data/projects'

const { t } = useI18n()

const active = ref<ProjectCategory>('public')

const visible = computed(() => projects.filter((project) => project.category === active.value))
</script>

<template>
  <section id="projects" class="section projects">
    <div class="container">
      <SectionHeading centered :title="t('projects.title')" :subtitle="t('projects.subtitle')" />

      <div class="projects__tabs" role="tablist" :aria-label="t('projects.title')">
        <button
          v-for="category in projectCategories"
          :key="category"
          type="button"
          class="projects__tab"
          role="tab"
          :aria-selected="active === category"
          :class="{ 'is-active': active === category }"
          @click="active = category"
        >
          {{ t(`projects.categories.${category}`) }}
        </button>
      </div>

      <p class="projects__blurb">{{ t(`projects.blurb.${active}`) }}</p>

      <div class="projects__list">
        <div v-for="(project, index) in visible" :key="project.id" v-reveal :style="{ transitionDelay: `${index * 70}ms` }">
          <ProjectCase :project="project" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.projects {
  padding-top: 40px;
}

.projects__tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 14px;
}

.projects__tab {
  padding: 8px 14px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    color var(--transition-fast),
    background var(--transition-fast);

  &:hover,
  &.is-active {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background: var(--color-accent-soft);
  }
}

.projects__blurb {
  max-width: 640px;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 36px;
  margin-inline: auto;
  text-align: center;
}

.projects__list {
  display: flex;
  flex-direction: column;
}

.projects__list > * + * {
  border-top: 1px solid var(--color-border);
  margin-top: 8px;
  padding-top: 40px;
}
</style>








