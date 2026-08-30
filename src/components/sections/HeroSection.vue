<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import profilePicture from '@/assets/img/perfil-picture.jpeg'
import { socials } from '@/data/contact'

const { t } = useI18n()

const isAboutOpen = ref(false)
</script>

<template>
  <section class="hero">
    <div class="hero__glow" aria-hidden="true" />
    <div class="container hero__inner">
      <div class="row align-items-center g-5">
        <div v-reveal class="col-12 col-lg-7 order-2 order-lg-1">
          <span class="hero__availability">
            <span class="hero__availability-dot" aria-hidden="true" />
            {{ t('hero.availability') }}
          </span>
          <p class="hero__greeting">{{ t('hero.greeting') }}</p>
          <h1 class="hero__name">{{ t('hero.name') }}</h1>
          <p class="hero__role">{{ t('hero.role') }}</p>
          <p class="hero__tagline">{{ t('hero.tagline') }}</p>

          <div class="hero__actions">
            <Button :as="RouterLink" to="/projects" :label="t('hero.cta_projects')" />
            <Button
              :as="RouterLink"
              to="/contact"
              :label="t('hero.cta_contact')"
              severity="secondary"
              outlined
            />
          </div>

          <div class="hero__socials">
            <a
              v-for="social in socials"
              :key="social.id"
              :href="social.href"
              class="hero__social-link"
              :target="social.external ? '_blank' : undefined"
              :rel="social.external ? 'noopener noreferrer' : undefined"
            >
              <i :class="['pi', social.icon]" aria-hidden="true" />
              {{ social.label }}
            </a>
          </div>
        </div>

        <div v-reveal class="col-12 col-lg-5 order-1 order-lg-2" style="transition-delay: 120ms">
          <div class="hero__portrait">
            <div class="hero__portrait-frame">
              <img :src="profilePicture" :alt="t('hero.name')" class="hero__portrait-img" />

              <button
                type="button"
                class="hero__about-flap"
                :class="{ 'is-open': isAboutOpen }"
                :aria-expanded="isAboutOpen"
                :aria-label="t('hero.about_cta')"
                @click="isAboutOpen = !isAboutOpen"
              >
                <span class="hero__about-flap-icon">
                  <i :class="['pi', isAboutOpen ? 'pi-times' : 'pi-book']" aria-hidden="true" />
                </span>
                <span class="hero__about-flap-text">
                  <strong class="hero__about-flap-title">{{ t('hero.about_title') }}</strong>
                  <span class="hero__about-flap-body">{{ t('about.body') }}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  padding-block: 64px 96px;
  overflow: hidden;
}

@media (max-width: 640px) {
  .hero {
    padding-block: 32px 56px;
  }

  .hero__about-flap-text {
    padding: 14px 16px 24px;
  }

  .hero__about-flap-body {
    font-size: 0.64rem;
  }
}

.hero__glow {
  position: absolute;
  inset: -20% -10% auto -10%;
  height: 480px;
  background: radial-gradient(
    ellipse at top,
    color-mix(in srgb, var(--color-accent) 22%, transparent),
    transparent 70%
  );
  pointer-events: none;
}

.hero__inner {
  position: relative;
}

.hero__availability {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 10px;
  margin-bottom: 20px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.hero__availability-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-success) 25%, transparent);
}

.hero__greeting {
  font-family: var(--font-mono);
  color: var(--color-accent);
  font-size: 0.95rem;
  margin-bottom: 12px;
}

.hero__name {
  font-size: clamp(2.5rem, 6vw, 3.75rem);
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.hero__role {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-top: 8px;
}

.hero__tagline {
  margin-top: 20px;
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 560px;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 36px;
}

.hero__socials {
  display: flex;
  gap: 20px;
  margin-top: 44px;
}

.hero__social-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-muted);
  border-bottom: 1px solid transparent;
  transition: color var(--transition-fast);
}

.hero__social-link:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.hero__portrait {
  position: relative;
  width: 100%;
  max-width: 320px;
  aspect-ratio: 4 / 5;
  margin-inline: auto;

  &::before {
    content: '';
    position: absolute;
    inset: -14px auto auto -14px;
    width: 100%;
    height: 100%;
    border: 1px solid var(--color-accent);
    border-radius: var(--radius-lg);
    opacity: 0.5;
  }
}

.hero__portrait-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--shadow-lg);
}

.hero__portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__about-flap {
  position: absolute;
  inset: 0;
  padding: 0;
  border: none;
  cursor: pointer;
  text-align: left;
  transform-origin: 100% 100%;
  background: linear-gradient(
    315deg,
    var(--color-surface) 0%,
    var(--color-surface) 60%,
    var(--color-accent-soft) 100%
  );
  box-shadow: 10px -10px 20px -10px rgba(0, 0, 0, 0.4);
  clip-path: polygon(100% 100%, 82% 100%, 100% 82%, 100% 82%);
  transition:
    clip-path 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.6s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      315deg,
      transparent 55%,
      color-mix(in srgb, black 12%, transparent) 68%,
      transparent 78%
    );
    pointer-events: none;
  }
}

.hero__about-flap:hover,
.hero__about-flap:focus-visible,
.hero__about-flap.is-open {
  clip-path: polygon(100% 100%, 0% 100%, 0% 0%, 100% 0%);
  transform: rotate(-1.5deg);
  box-shadow: 16px -16px 30px -12px rgba(0, 0, 0, 0.45);
}

.hero__about-flap-icon {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-accent-text);
  font-size: 0.55rem;
  pointer-events: none;
  z-index: 1;
}

.hero__about-flap-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 26px 30px;
  opacity: 0;
  overflow-y: auto;
  transition: opacity 0.3s ease;
  transition-delay: 0s;
}

.hero__about-flap-title {
  flex-shrink: 0;
  margin-bottom: 10px;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
}

.hero__about-flap-body {
  font-size: 0.685rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
  white-space: pre-line;
}

.hero__about-flap:hover .hero__about-flap-text,
.hero__about-flap:focus-visible .hero__about-flap-text,
.hero__about-flap.is-open .hero__about-flap-text {
  opacity: 1;
  transition-delay: 0.32s;
}

@media (prefers-reduced-motion: reduce) {
  .hero__about-flap {
    transition: none;
  }

  .hero__about-flap:hover,
  .hero__about-flap:focus-visible,
  .hero__about-flap.is-open {
    transform: none;
  }

  .hero__about-flap-text {
    transition: none;
  }
}
</style>
