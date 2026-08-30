export type ProjectCategory = 'public' | 'private'

export interface SimChoice {
  id: string
  icon: string
}

export interface ProjectDef {
  id: string
  category: ProjectCategory
  codePrivate: boolean
  stack: string[]
  brand: string
  howKeys: string[]
  liveUrl?: string
  repoUrl?: string
  sim: 'cacador' | 'events' | 'support' | 'pwa'
  hasBff?: boolean
  choices: SimChoice[]
  fields: string[]
}

export const projectCategories: ProjectCategory[] = ['public', 'private']

export const projects: ProjectDef[] = [
  {
    id: 'cacador',
    category: 'public',
    codePrivate: true,
    stack: ['Vue 3', 'Vuetify', 'Pinia', 'pdf.js', 'pdf-lib', 'Vite'],
    brand: '#c61843',
    howKeys: ['import', 'extract', 'review', 'issue'],
    liveUrl: 'https://cacadorseguros.com.br/',
    sim: 'cacador',
    choices: [],
    fields: [],
  },
  {
    id: 'events',
    category: 'private',
    codePrivate: true,
    stack: ['Vue 3', 'Spring Boot', 'RabbitMQ', 'Keycloak', 'Vault', 'PostgreSQL'],
    brand: '#0f766e',
    howKeys: ['spa', 'bff', 'queue', 'worker'],
    sim: 'events',
    hasBff: true,
    choices: [
      { id: 'create', icon: 'pi-plus' },
      { id: 'query', icon: 'pi-search' },
      { id: 'retry', icon: 'pi-refresh' },
    ],
    fields: ['trace', 'queue', 'status', 'latency'],
  },
  {
    id: 'support',
    category: 'private',
    codePrivate: true,
    stack: ['Vue 3', 'Pinia', 'REST', 'PostgreSQL'],
    brand: '#0369a1',
    howKeys: ['intake', 'classify', 'solve', 'protocol'],
    sim: 'support',
    choices: [
      { id: 'access', icon: 'pi-lock' },
      { id: 'billing', icon: 'pi-wallet' },
      { id: 'outage', icon: 'pi-exclamation-triangle' },
    ],
    fields: ['ticket', 'priority', 'owner', 'protocol'],
  },
  {
    id: 'pwa',
    category: 'private',
    codePrivate: true,
    stack: ['Vue 3', 'PWA', 'IndexedDB', 'Vite'],
    brand: '#7c3aed',
    howKeys: ['install', 'offline', 'queue', 'sync'],
    sim: 'pwa',
    hasBff: true,
    choices: [
      { id: 'sale', icon: 'pi-shopping-cart' },
      { id: 'stock', icon: 'pi-box' },
      { id: 'close', icon: 'pi-check' },
    ],
    fields: ['device', 'mode', 'pending', 'synced'],
  },
]
