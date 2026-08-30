<script setup lang="ts">
import { computed } from 'vue'
import { allSkills } from '@/data/skills'

const marquee = computed(() => [...allSkills, ...allSkills])
</script>

<template>
  <div class="skills-marquee" aria-hidden="true">
    <div class="skills-marquee__row">
      <div class="skills-marquee__track">
        <span
          v-for="(skill, i) in marquee"
          :key="i"
          class="marquee-chip"
          :style="{ '--brand': skill.hex }"
        >
          <span class="marquee-chip__icon">
            <svg v-if="skill.path" viewBox="0 0 24 24" role="img">
              <path :d="skill.path" fill="var(--brand)" />
            </svg>
            <i v-else :class="['pi', skill.icon]" />
          </span>
          {{ skill.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skills-marquee__row {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
}

.skills-marquee__track {
  display: flex;
  width: max-content;
  gap: 12px;
  animation: marquee-left 60s linear infinite;
}

.skills-marquee__row:hover .skills-marquee__track {
  animation-play-state: paused;
}

@keyframes marquee-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .skills-marquee__track {
    animation: none;
  }
}

.marquee-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 5px 12px 5px 7px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.marquee-chip__icon {
  display: inline-flex;
  width: 14px;
  height: 14px;

  svg {
    width: 100%;
    height: 100%;
  }

  .pi {
    font-size: 12px;
    color: var(--brand);
  }
}
</style>
