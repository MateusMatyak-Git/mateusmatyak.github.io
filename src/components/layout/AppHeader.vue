<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
import LocaleSwitcher from '@/components/layout/LocaleSwitcher.vue'
import BrandLogo from '@/components/layout/BrandLogo.vue'

const { t } = useI18n()
const route = useRoute()
const menuOpen = ref(false)

const links = [
  { to: '/', key: 'nav.about' },
  { to: '/skills', key: 'nav.skills' },
  { to: '/architecture', key: 'nav.architecture' },
  { to: '/projects', key: 'nav.projects' },
  { to: '/experience', key: 'nav.experience' },
  { to: '/contact', key: 'nav.contact' },
] as const

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <router-link to="/" class="header__brand" :aria-label="t('hero.name')">
        <BrandLogo />
      </router-link>

      <nav class="d-none d-md-flex header__nav" :aria-label="t('nav.primary')">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="header__link"
          active-class="header__link--active"
        >
          {{ t(link.key) }}
        </router-link>
      </nav>

      <div class="header__actions">
        <LocaleSwitcher />
        <ThemeToggle />
        <Button
          class="header__menu-btn"
          icon="pi pi-bars"
          severity="secondary"
          text
          rounded
          :aria-label="t('nav.menu')"
          :aria-expanded="menuOpen"
          @click="menuOpen = true"
        />
      </div>
    </div>

    <Drawer
      v-model:visible="menuOpen"
      position="right"
      class="header-drawer"
      :header="t('hero.name')"
      :aria-label="t('nav.menu')"
    >
      <nav class="header__drawer-nav" :aria-label="t('nav.primary')">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="header__drawer-link"
          active-class="header__drawer-link--active"
        >
          {{ t(link.key) }}
        </router-link>
      </nav>
    </Drawer>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid var(--color-border);
  background-color: color-mix(in srgb, var(--color-bg) 80%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 68px;
}

.header__brand {
  display: flex;
  flex-shrink: 0;
  color: inherit;
  transition: opacity var(--transition-fast);

  &:hover,
  &:focus-visible {
    opacity: 0.82;
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 4px;
    border-radius: 4px;
  }
}

.header__nav {
  align-items: center;
  gap: 20px;
  margin-inline: auto;
}

.header__link {
  font-size: 0.86rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
  white-space: nowrap;
}

@media (min-width: 1100px) {
  .header__nav {
    gap: 26px;
  }

  .header__link {
    font-size: 0.9rem;
  }
}

.header__link:hover {
  color: var(--color-accent);
}

.header__link--active {
  color: var(--color-accent);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header__menu-btn {
  display: inline-flex;
}

@media (min-width: 768px) {
  .header__menu-btn {
    display: none !important;
  }
}

.header__drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header__drawer-link {
  display: block;
  padding: 12px 4px;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border);

  &:hover,
  &:focus-visible {
    color: var(--color-accent);
  }
}

.header__drawer-link--active {
  color: var(--color-accent);
}
</style>

<style lang="scss">
.header-drawer.p-drawer {
  background: var(--color-bg);
  color: var(--color-text);
  border-left: 1px solid var(--color-border);
  width: min(320px, 86vw);
}

.header-drawer .p-drawer-header {
  color: var(--color-text);
}

.header-drawer .p-drawer-title {
  font-size: 1rem;
  font-weight: 700;
}
</style>
