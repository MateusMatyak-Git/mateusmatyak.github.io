import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import './style.scss'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import { PortfolioPreset } from './plugins/primevue-preset'
import { vReveal } from './directives/reveal'

createApp(App)
  .use(router)
  .use(i18n)
  .use(PrimeVue, {
    theme: {
      preset: PortfolioPreset,
      options: {
        darkModeSelector: '[data-theme="dark"]',
        cssLayer: true,
      },
    },
  })
  .directive('reveal', vReveal)
  .directive('tooltip', Tooltip)
  .mount('#app')
