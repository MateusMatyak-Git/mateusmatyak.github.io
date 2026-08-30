import {
  siVuedotjs,
  siTypescript,
  siVite,
  siPrimevue,
  siPinia,
  siSpringboot,
  siRabbitmq,
  siOpenapiinitiative,
  siPostgresql,
  siKeycloak,
  siOpenid,
  siVault,
  siRedis,
  siGrafana,
  siPrometheus,
  siJunit5,
  siNodedotjs,
  siEslint,
  siSonarqubeserver,
  siGit,
  siJenkins,
  siDocker,
  siKubernetes,
} from 'simple-icons'

export interface BrandSkill {
  key: string
  name: string
  hex: string
  path: string
  icon?: undefined
}

export interface IconSkill {
  key: string
  name: string
  hex: string
  icon: string
  path?: undefined
}

export type Skill = BrandSkill | IconSkill

function brand(
  key: string,
  name: string,
  icon: { hex: string; path: string },
  hexOverride?: string,
): BrandSkill {
  return { key, name, hex: hexOverride ?? `#${icon.hex}`, path: icon.path }
}

function iconFallback(key: string, name: string, hex: string, icon: string): IconSkill {
  return { key, name, hex, icon }
}

export interface SkillCategory {
  key: string
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    key: 'frontend',
    skills: [
      brand('vue', 'Vue.js 3', siVuedotjs),
      brand('typescript', 'TypeScript', siTypescript),
      brand('vite', 'Vite', siVite),
      brand('primevue', 'PrimeVue', siPrimevue),
      brand('pinia', 'Pinia', siPinia),
      iconFallback('vuerouter', 'Vue Router', '#4FC08D', 'pi-directions'),
    ],
  },
  {
    key: 'backend',
    skills: [
      brand('springboot', 'Spring Boot', siSpringboot),
      brand('rabbitmq', 'RabbitMQ', siRabbitmq),
      brand('openapi', 'OpenAPI', siOpenapiinitiative),
    ],
  },
  {
    key: 'data',
    skills: [brand('postgresql', 'PostgreSQL', siPostgresql)],
  },
  {
    key: 'security',
    skills: [
      brand('keycloak', 'Keycloak', siKeycloak, '#8A8A99'),
      brand('openid', 'OAuth2 / OIDC', siOpenid),
      brand('vault', 'Vault', siVault),
      brand('redis', 'Redis', siRedis),
    ],
  },
  {
    key: 'observability',
    skills: [
      brand('grafana', 'Grafana', siGrafana),
      brand('prometheus', 'Prometheus', siPrometheus),
      iconFallback('loki', 'Loki', '#F6772A', 'pi-align-left'),
    ],
  },
  {
    key: 'testing',
    skills: [
      brand('junit', 'JUnit 5', siJunit5),
      brand('nodetest', 'node:test', siNodedotjs),
      iconFallback('archunit', 'ArchUnit', '#6B7C93', 'pi-sitemap'),
      brand('eslint', 'ESLint', siEslint),
      brand('sonar', 'SonarQube', siSonarqubeserver),
    ],
  },
  {
    key: 'devops',
    skills: [
      brand('git', 'Git', siGit),
      brand('jenkins', 'Jenkins', siJenkins),
      brand('docker', 'Docker', siDocker),
      brand('kubernetes', 'Kubernetes', siKubernetes),
    ],
  },
]

export const allSkills: Skill[] = skillCategories.flatMap((category) => category.skills)
