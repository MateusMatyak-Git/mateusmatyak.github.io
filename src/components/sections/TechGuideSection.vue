<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { skillCategories } from '@/data/skills'

const { t } = useI18n()
</script>

<template>
  <section id="tech-guide" class="section tech-guide">
    <div class="container">
      <RouterLink to="/skills" class="tech-guide__back">
        <i class="pi pi-arrow-left" aria-hidden="true" />
        {{ t('techGuide.back_cta') }}
      </RouterLink>

      <SectionHeading centered :title="t('techGuide.title')" :subtitle="t('techGuide.intro')" />

      <div
        v-for="(category, catIndex) in skillCategories"
        :key="category.key"
        v-reveal
        class="tech-guide__category"
        :style="{ transitionDelay: `${catIndex * 60}ms` }"
      >
        <h3 class="tech-guide__category-title">
          {{ t(`skills.categories.${category.key}.title`) }}
        </h3>

        <div class="row g-3">
          <div v-for="skill in category.skills" :key="skill.key" class="col-12 col-md-6">
            <div class="tech-guide__card">
              <div class="tech-guide__head">
                <span class="tech-guide__icon" :style="{ '--brand': skill.hex }">
                  <svg v-if="skill.path" viewBox="0 0 24 24" role="img" :aria-label="skill.name">
                    <path :d="skill.path" fill="var(--brand)" />
                  </svg>
                  <i v-else :class="['pi', skill.icon]" aria-hidden="true" />
                </span>
                <h4 class="tech-guide__name">{{ skill.name }}</h4>
              </div>

              <div class="tech-guide__row">
                <span class="tech-guide__label">
                  <i class="pi pi-code" aria-hidden="true" />
                  {{ t('techGuide.dev_label') }}
                </span>
                <p class="tech-guide__text">{{ t(`techGuide.items.${skill.key}.dev`) }}</p>
              </div>

              <div class="tech-guide__row tech-guide__row--impact">
                <span class="tech-guide__label">
                  <i class="pi pi-heart" aria-hidden="true" />
                  {{ t('techGuide.impact_label') }}
                </span>
                <p class="tech-guide__text">{{ t(`techGuide.items.${skill.key}.impact`) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.tech-guide__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-accent);
  }
}

.tech-guide__category {
  margin-top: 48px;

  &:first-of-type {
    margin-top: 8px;
  }
}

.tech-guide__category-title {
  font-size: 1.1rem;
  color: var(--color-text);
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.tech-guide__card {
  height: 100%;
  padding: 22px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  transition: border-color var(--transition-fast);

  &:hover {
    border-color: var(--color-accent);
  }
}

.tech-guide__head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.tech-guide__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--brand) 16%, transparent);

  svg {
    width: 17px;
    height: 17px;
  }

  .pi {
    font-size: 15px;
    color: var(--brand);
  }
}

.tech-guide__name {
  font-size: 0.98rem;
  color: var(--color-text);
}

.tech-guide__row {
  padding-block: 10px;

  &:not(:last-child) {
    border-bottom: 1px dashed var(--color-border);
  }
}

.tech-guide__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 6px;
}

.tech-guide__row--impact .tech-guide__label {
  color: var(--color-accent);
}

.tech-guide__text {
  font-size: 0.85rem;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .tech-guide__card {
    padding: 16px;
  }

  .tech-guide__text {
    font-size: 0.8rem;
  }
}
</style>
