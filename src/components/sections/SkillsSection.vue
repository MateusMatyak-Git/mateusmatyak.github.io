<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SkillsMarquee from '@/components/sections/SkillsMarquee.vue'
import { skillCategories, type SkillCategory } from '@/data/skills'

const { t } = useI18n()

const count = skillCategories.length

// Clones of the last/first slides so the carousel can loop with a neighbor still in view.
const slides = computed(() => [
  { ...skillCategories[count - 1], slideKey: 'clone-start', isClone: true },
  ...skillCategories.map((category: SkillCategory) => ({
    ...category,
    slideKey: category.key,
    isClone: false,
  })),
  { ...skillCategories[0], slideKey: 'clone-end', isClone: true },
])

const trackRef = ref<HTMLElement | null>(null)
const activeIndex = ref(0)

let settleTimer: ReturnType<typeof setTimeout> | undefined
let isProgrammaticScroll = false
let pendingLoopReset: (() => void) | null = null

// The track is not a positioned ancestor, so offsetLeft is unusable.
function slideOffsetInTrack(track: HTMLElement, slide: HTMLElement) {
  return slide.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft
}

function closestDomIndex(track: HTMLElement) {
  const trackCenter = track.scrollLeft + track.clientWidth / 2
  let closest = 0
  let closestDistance = Infinity
  Array.from(track.children).forEach((child, index) => {
    const el = child as HTMLElement
    const elCenter = slideOffsetInTrack(track, el) + el.offsetWidth / 2
    const distance = Math.abs(elCenter - trackCenter)
    if (distance < closestDistance) {
      closestDistance = distance
      closest = index
    }
  })
  return closest
}

function scrollToDomIndex(domIndex: number, instant: boolean) {
  const track = trackRef.value
  if (!track) return
  const slide = track.children[domIndex] as HTMLElement | undefined
  if (!slide) return
  track.scrollTo({
    left: slideOffsetInTrack(track, slide) - (track.clientWidth - slide.offsetWidth) / 2,
    behavior: instant ? 'auto' : 'smooth',
  })
}

function goTo(realIndex: number) {
  const wrapped = ((realIndex % count) + count) % count
  activeIndex.value = wrapped
  isProgrammaticScroll = true
  scrollToDomIndex(wrapped + 1, false)
}

function next() {
  if (activeIndex.value === count - 1) {
    // Animate into the clone, then snap to the real first slide.
    activeIndex.value = 0
    isProgrammaticScroll = true
    scrollToDomIndex(count + 1, false)
    pendingLoopReset = () => scrollToDomIndex(1, true)
  } else {
    activeIndex.value += 1
    isProgrammaticScroll = true
    scrollToDomIndex(activeIndex.value + 1, false)
  }
}

function prev() {
  if (activeIndex.value === 0) {
    // Animate into the clone, then snap to the real last slide.
    activeIndex.value = count - 1
    isProgrammaticScroll = true
    scrollToDomIndex(0, false)
    pendingLoopReset = () => scrollToDomIndex(count, true)
  } else {
    activeIndex.value -= 1
    isProgrammaticScroll = true
    scrollToDomIndex(activeIndex.value + 1, false)
  }
}

function onScroll() {
  const track = trackRef.value
  if (!track) return
  clearTimeout(settleTimer)
  settleTimer = setTimeout(() => {
    if (pendingLoopReset) {
      const reset = pendingLoopReset
      pendingLoopReset = null
      isProgrammaticScroll = true
      reset()
      return
    }
    // Clicks already set the index; only sync from scroll for touch/drag.
    if (isProgrammaticScroll) {
      isProgrammaticScroll = false
      return
    }
    const domIndex = closestDomIndex(track)
    activeIndex.value = (((domIndex - 1) % count) + count) % count
  }, 120)
}

onMounted(() => {
  scrollToDomIndex(1, true)
})
</script>

<template>
  <section id="skills" class="section skills">
    <div class="container">
      <SectionHeading centered :title="t('skills.title')" :subtitle="t('skills.subtitle')" />

      <div class="skills__guide-cta">
        <Button
          :as="RouterLink"
          to="/tech-guide"
          :label="t('skills.tech_guide_cta')"
          icon="pi pi-compass"
          severity="secondary"
          text
        />
      </div>

      <div v-reveal class="skills__carousel">
        <button
          type="button"
          class="skills__nav skills__nav--prev"
          :aria-label="t('skills.carousel_prev')"
          @click="prev"
        >
          <i class="pi pi-chevron-left" aria-hidden="true" />
        </button>

        <div ref="trackRef" class="skills__track" @scroll="onScroll">
          <div
            v-for="(category, domIndex) in slides"
            :key="category.slideKey"
            class="skills__slide"
            :class="{ 'is-active': domIndex === activeIndex + 1 }"
            :aria-hidden="category.isClone ? 'true' : undefined"
          >
            <div class="skills__card">
              <h3 class="skills__card-title">{{ t(`skills.categories.${category.key}.title`) }}</h3>
              <p class="skills__card-subtitle">
                {{ t(`skills.categories.${category.key}.subtitle`) }}
              </p>
              <div class="skills__icon-row">
                <span
                  v-for="skill in category.skills"
                  :key="skill.key"
            v-tooltip.bottom="{ value: skill.name, showDelay: 200 }"
                  class="skills__icon"
                  :style="{ '--brand': skill.hex }"
                >
                  <svg v-if="skill.path" viewBox="0 0 24 24" role="img" :aria-label="skill.name">
                    <path :d="skill.path" fill="var(--brand)" />
                  </svg>
                  <i v-else :class="['pi', skill.icon]" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="skills__nav skills__nav--next"
          :aria-label="t('skills.carousel_next')"
          @click="next"
        >
          <i class="pi pi-chevron-right" aria-hidden="true" />
        </button>
      </div>

      <div class="skills__dots" role="tablist">
        <button
          v-for="(category, index) in skillCategories"
          :key="category.key"
          type="button"
          class="skills__dot"
          :class="{ 'is-active': index === activeIndex }"
          role="tab"
          :aria-selected="index === activeIndex"
          :aria-label="t(`skills.categories.${category.key}.title`)"
          @click="goTo(index)"
        />
      </div>
    </div>

    <div class="skills__marquee">
      <SkillsMarquee />
    </div>
  </section>
</template>

<style scoped lang="scss">
.skills {
  padding-top: 40px;
  padding-bottom: 96px;
  overflow-x: hidden;
}

.skills__guide-cta {
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
}

.skills__carousel {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 1000px;
  margin-inline: auto;
}

.skills__track {
  --slide-width: 76%;
  flex: 1;
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  padding-block: 4px;
  padding-inline: calc((100% - var(--slide-width)) / 2);
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.skills__slide {
  flex: 0 0 var(--slide-width);
  scroll-snap-align: center;
  opacity: 0.4;
  transform: scale(0.92);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;

  &.is-active {
    opacity: 1;
    transform: scale(1);
  }
}

@media (min-width: 768px) {
  .skills__track {
    --slide-width: 260px;
  }
}

.skills__nav {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition:
    border-color var(--transition-fast),
    color var(--transition-fast);

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
}

.skills__dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.skills__dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--color-border-strong);
  cursor: pointer;
  transition: background-color var(--transition-fast);

  &.is-active {
    background: var(--color-accent);
  }
}

.skills__marquee {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  padding-block: 8px;
  border-top: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-bg) 85%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.skills__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 250px;
  width: 100%;
  padding: 26px 22px 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  text-align: center;
  transition: border-color var(--transition-fast);

  &:hover {
    border-color: var(--color-accent);
  }
}

.skills__card-title {
  font-size: 1.05rem;
  color: var(--color-text);
  margin-bottom: 10px;
}

.skills__card-subtitle {
  font-size: 0.82rem;
  line-height: 1.55;
}

.skills__icon-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 8px;
  width: 100%;
  margin-top: auto;
  padding-top: 16px;
}

.skills__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--brand) 16%, transparent);
  cursor: default;

  svg {
    width: 12px;
    height: 12px;
  }

  .pi {
    font-size: 10px;
    color: var(--brand);
  }
}

@media (max-width: 640px) {
  .skills__track {
    --slide-width: 88%;
    gap: 12px;
  }

  .skills__card {
    min-height: 0;
    padding: 20px 16px 16px;
  }

  .skills__card-subtitle {
    font-size: 0.78rem;
  }

  .skills__icon-row {
    flex-wrap: wrap;
  }

  .skills__nav {
    width: 28px;
    height: 28px;
  }
}
</style>
