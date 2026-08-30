<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { channels, EMAIL } from '@/data/contact'

const { t } = useI18n()

const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

const mailtoHref = computed(
  () => `mailto:${EMAIL}?subject=${encodeURIComponent(t('contact.mail_subject'))}`,
)

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL)
  } catch {
    const field = document.createElement('textarea')
    field.value = EMAIL
    field.setAttribute('readonly', '')
    field.style.position = 'absolute'
    field.style.left = '-9999px'
    document.body.appendChild(field)
    field.select()
    document.execCommand('copy')
    document.body.removeChild(field)
  }

  copied.value = true
  clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copied.value = false
  }, 2000)
}

onUnmounted(() => clearTimeout(copyTimer))
</script>

<template>
  <section id="contact" class="section contact">
    <div class="container">
      <SectionHeading centered :title="t('contact.title')" :subtitle="t('contact.subtitle')" />

      <ul v-reveal class="contact__meta">
        <li>
          <span class="contact__status-dot" aria-hidden="true" />
          {{ t('contact.availability') }}
        </li>
        <li>
          <i class="pi pi-map-marker" aria-hidden="true" />
          {{ t('contact.location') }}
        </li>
        <li>
          <i class="pi pi-clock" aria-hidden="true" />
          {{ t('contact.response') }}
        </li>
      </ul>

      <article v-reveal class="contact__primary" style="transition-delay: 70ms">
        <div class="contact__primary-head">
          <span class="contact__icon-well" aria-hidden="true">
            <i class="pi pi-envelope" />
          </span>
          <div class="contact__primary-copy">
            <div class="contact__label-row">
              <span class="contact__label">{{ t('contact.email') }}</span>
              <span class="contact__badge">{{ t('contact.preferred') }}</span>
            </div>
            <p class="contact__value">{{ EMAIL }}</p>
            <p class="contact__hint">{{ t('contact.email_hint') }}</p>
          </div>
        </div>

        <div class="contact__primary-actions">
          <Button as="a" :href="mailtoHref" :label="t('contact.cta_email')" icon="pi pi-envelope" />
          <Button
            type="button"
            :label="copied ? t('contact.copied') : t('contact.copy')"
            :icon="copied ? 'pi pi-check' : 'pi pi-copy'"
            :aria-label="copied ? t('contact.copied') : t('contact.copy')"
            severity="secondary"
            outlined
            @click="copyEmail"
          />
        </div>
      </article>

      <div class="row g-3">
        <div
          v-for="(channel, index) in channels"
          :key="channel.key"
          v-reveal
          class="col-12 col-md-6"
          :style="{ transitionDelay: `${140 + index * 70}ms` }"
        >
          <a
            :href="channel.href"
            class="contact__card"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t(`contact.open_${channel.key}`)"
          >
            <span class="contact__icon-well" aria-hidden="true">
              <i :class="channel.icon" />
            </span>
            <span class="contact__card-body">
              <span class="contact__label">{{ t(`contact.${channel.key}`) }}</span>
              <span class="contact__value">{{ channel.value }}</span>
              <span class="contact__hint">{{ t(`contact.${channel.key}_hint`) }}</span>
              <span class="contact__cta">
                {{ t(`contact.open_${channel.key}`) }}
                <i class="pi pi-arrow-up-right" aria-hidden="true" />
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.contact {
  padding-top: 40px;
}

.contact__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 22px;
  margin-bottom: 28px;
  font-size: 0.84rem;
  color: var(--color-text-secondary);
}

.contact__meta li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.contact__meta i {
  font-size: 0.78rem;
  color: var(--color-accent);
}

.contact__status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-success) 25%, transparent);
}

.contact__primary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 16px;
  padding: 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.contact__primary-head {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  min-width: 0;
}

.contact__primary-copy {
  min-width: 0;
}

.contact__primary-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.contact__icon-well {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 1.05rem;
}

.contact__label-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.contact__label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.contact__badge {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.contact__value {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.98rem;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact__hint {
  display: block;
  margin-top: 8px;
  font-size: 0.86rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.contact__card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  height: 100%;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  transition:
    border-color var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);

  &:hover {
    border-color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 3px;
  }
}

.contact__card-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.contact__card .contact__value {
  margin-top: 6px;
}

.contact__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-accent);
}

.contact__cta i {
  font-size: 0.7rem;
}

@media (max-width: 640px) {
  .contact__primary {
    padding: 22px;
  }

  .contact__primary-actions {
    width: 100%;
  }

  .contact__primary-actions :deep(.p-button) {
    flex: 1 1 auto;
    justify-content: center;
  }
}
</style>
