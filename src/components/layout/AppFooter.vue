<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { socials } from '@/data/contact'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__text">Mateus Matyak © {{ year }}. {{ t('footer.rights') }}</p>
      <nav class="footer__socials" :aria-label="t('contact.title')">
        <a
          v-for="social in socials"
          :key="social.id"
          :href="social.href"
          class="footer__social"
          :target="social.external ? '_blank' : undefined"
          :rel="social.external ? 'noopener noreferrer' : undefined"
          :aria-label="social.label"
        >
          <i :class="['pi', social.icon]" aria-hidden="true" />
        </a>
      </nav>
      <p class="footer__text footer__built">{{ t('footer.built_with') }}</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  border-top: 1px solid var(--color-border);
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 20px;
  padding-block: 28px;
}

.footer__text {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin: 0;
}

.footer__built {
  font-family: var(--font-mono);
}

.footer__socials {
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer__social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  transition:
    color var(--transition-fast),
    background var(--transition-fast);

  &:hover,
  &:focus-visible {
    color: var(--color-accent);
    background: var(--color-accent-soft);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}
</style>
