<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Dialog from 'primevue/dialog'
import {
  siVuedotjs,
  siSpringboot,
  siRabbitmq,
  siPostgresql,
  siKeycloak,
  siVault,
  siPrometheus,
  siGit,
  siJenkins,
  siDocker,
  siSonarqubeserver,
  siGithub,
  siOpenid,
  siOpenapiinitiative,
  siRedis,
  siGrafana,
  siKubernetes,
  siNginx,
  siOpenjdk,
} from 'simple-icons'
import SectionHeading from '@/components/ui/SectionHeading.vue'

const { t } = useI18n()

const activeTab = ref('develop')
const detailOpen = ref(false)
const detailTitle = ref('')
const detailBody = ref('')

function openDetail(title: string, body: string) {
  detailTitle.value = title
  detailBody.value = body
  detailOpen.value = true
}

const VIEWBOX_W = 700
const ARCH_VIEWBOX_W = 840
const ARCH_VIEWBOX_H = 1420
const WORKFLOW_VIEWBOX_H = 2460
const CARD_W = 260
const SPINE_X = 220
const ARCH_SPINE_X = 290
const ARCH_SPINE_CX = ARCH_SPINE_X + CARD_W / 2
const SIDE_W = 196
const LEFT_X = 20
const RIGHT_X = 624
const LEFT_EDGE = LEFT_X + SIDE_W
const SPINE_RIGHT = ARCH_SPINE_X + CARD_W
const GUTTER_L = (LEFT_EDGE + ARCH_SPINE_X) / 2
const GUTTER_R = (SPINE_RIGHT + RIGHT_X) / 2

interface NodePos {
  key: string
  x: number
  y: number
  w: number
  h: number
}

const primaryNodes: NodePos[] = [
  { key: 'client', x: ARCH_SPINE_X, y: 20, w: CARD_W, h: 90 },
  { key: 'gateway', x: ARCH_SPINE_X, y: 190, w: CARD_W, h: 90 },
  { key: 'bff', x: ARCH_SPINE_X, y: 372, w: CARD_W, h: 58 },
  { key: 'queue', x: ARCH_SPINE_X, y: 740, w: CARD_W, h: 90 },
  { key: 'services', x: ARCH_SPINE_X, y: 922, w: CARD_W, h: 58 },
  { key: 'db', x: ARCH_SPINE_X, y: 1290, w: CARD_W, h: 90 },
]

const supportingNodes: NodePos[] = [
  { key: 'auth', x: LEFT_X, y: 27, w: SIDE_W, h: 76 },
  { key: 'vault', x: LEFT_X, y: 372, w: SIDE_W, h: 76 },
  { key: 'redis', x: RIGHT_X, y: 197, w: SIDE_W, h: 76 },
  { key: 'dbeaver', x: RIGHT_X, y: 1297, w: SIDE_W, h: 76 },
]

const grafanaNode: NodePos = { key: 'grafana', x: RIGHT_X + 12, y: 376, w: SIDE_W - 24, h: 76 }
const grafanaGroup = { x: RIGHT_X, y: 360, w: SIDE_W, h: 240 }

const bffGroup = { x: ARCH_SPINE_X, y: 360, w: CARD_W, h: 300 }
const bffHttpGroup = { x: ARCH_SPINE_X + 12, y: 534, w: CARD_W - 24, h: 110 }
const workerGroup = { x: ARCH_SPINE_X, y: 910, w: CARD_W, h: 300 }
const persistGroup = { x: ARCH_SPINE_X + 12, y: 1084, w: CARD_W - 24, h: 110 }

const archChipNodes: NodePos[] = [
  { key: 'oauth', x: ARCH_SPINE_X + 12, y: 440, w: CARD_W - 24, h: 42 },
  { key: 'openapi', x: ARCH_SPINE_X + 12, y: 488, w: CARD_W - 24, h: 42 },
  { key: 'rbac', x: ARCH_SPINE_X + 20, y: 556, w: CARD_W - 40, h: 36 },
  { key: 'validation', x: ARCH_SPINE_X + 20, y: 596, w: CARD_W - 40, h: 36 },
  { key: 'amqp', x: ARCH_SPINE_X + 12, y: 990, w: CARD_W - 24, h: 42 },
  { key: 'springwolf', x: ARCH_SPINE_X + 12, y: 1038, w: CARD_W - 24, h: 42 },
  { key: 'jpa', x: ARCH_SPINE_X + 20, y: 1106, w: CARD_W - 40, h: 36 },
  { key: 'cache', x: ARCH_SPINE_X + 20, y: 1146, w: CARD_W - 40, h: 36 },
  { key: 'prometheus', x: RIGHT_X + 12, y: 468, w: SIDE_W - 24, h: 50 },
  { key: 'loki', x: RIGHT_X + 12, y: 534, w: SIDE_W - 24, h: 50 },
]

const archFallbackIcons: { key: string; icon: string }[] = [
  { key: 'dbeaver', icon: 'pi-database' },
  { key: 'validation', icon: 'pi-check-square' },
  { key: 'springwolf', icon: 'pi-book' },
  { key: 'cache', icon: 'pi-bolt' },
  { key: 'loki', icon: 'pi-align-left' },
]

const archNodeMap: Record<string, NodePos> = Object.fromEntries(
  [...primaryNodes, ...supportingNodes, grafanaNode, ...archChipNodes].map((node) => [node.key, node]),
)

function archFallbackStyleFor(key: string) {
  const node = archNodeMap[key]
  if (!node) return {}
  const isChip = node.h <= 50
  const cx = node.x + (isChip ? 18 : 20)
  const cy = node.y + (isChip ? node.h / 2 : 20)
  return {
    left: `${(cx / ARCH_VIEWBOX_W) * 100}%`,
    top: `${(cy / ARCH_VIEWBOX_H) * 100}%`,
  }
}

const badgesLeft: NodePos[] = [
  supportingNodes.find((node) => node.key === 'auth')!,
  supportingNodes.find((node) => node.key === 'vault')!,
]

const badgesRight: NodePos[] = [
  ...primaryNodes,
  grafanaNode,
  ...supportingNodes.filter((node) => node.key !== 'auth' && node.key !== 'vault'),
  ...archChipNodes,
]

function badgeStyle(node: NodePos, viewBoxW: number, viewBoxH: number) {
  const left = ((node.x + node.w - 15) / viewBoxW) * 100
  const top = ((node.y + 15) / viewBoxH) * 100
  return { left: `${left}%`, top: `${top}%` }
}

function fallbackStyleFor(key: string) {
  const node = workflowNodeMap[key]
  if (!node) return {}
  const isChip = node.h <= 50
  const cx = node.x + (isChip ? 18 : 20)
  const cy = node.y + (isChip ? node.h / 2 : 20)
  return {
    left: `${(cx / VIEWBOX_W) * 100}%`,
    top: `${(cy / WORKFLOW_VIEWBOX_H) * 100}%`,
  }
}

interface NodeIcon {
  hex: string
  path: string
}

const nodeIcons: Record<string, NodeIcon | undefined> = {
  client: { hex: `#${siVuedotjs.hex}`, path: siVuedotjs.path },
  gateway: { hex: `#${siSpringboot.hex}`, path: siSpringboot.path },
  bff: { hex: `#${siSpringboot.hex}`, path: siSpringboot.path },
  oauth: { hex: `#${siOpenid.hex}`, path: siOpenid.path },
  openapi: { hex: `#${siOpenapiinitiative.hex}`, path: siOpenapiinitiative.path },
  rbac: { hex: '#8A8A99', path: siKeycloak.path },
  queue: { hex: `#${siRabbitmq.hex}`, path: siRabbitmq.path },
  services: { hex: `#${siSpringboot.hex}`, path: siSpringboot.path },
  amqp: { hex: `#${siRabbitmq.hex}`, path: siRabbitmq.path },
  jpa: { hex: `#${siPostgresql.hex}`, path: siPostgresql.path },
  db: { hex: `#${siPostgresql.hex}`, path: siPostgresql.path },
  auth: { hex: '#8A8A99', path: siKeycloak.path },
  vault: { hex: `#${siVault.hex}`, path: siVault.path },
  redis: { hex: `#${siRedis.hex}`, path: siRedis.path },
  grafana: { hex: `#${siGrafana.hex}`, path: siGrafana.path },
  prometheus: { hex: `#${siPrometheus.hex}`, path: siPrometheus.path },
  develop: { hex: `#${siGit.hex}`, path: siGit.path },
  feature: { hex: `#${siGit.hex}`, path: siGit.path },
  hotfix: { hex: `#${siGit.hex}`, path: siGit.path },
  developMerge: { hex: `#${siGit.hex}`, path: siGit.path },
  release: { hex: `#${siGit.hex}`, path: siGit.path },
  checkout: { hex: `#${siGit.hex}`, path: siGit.path },
  checkoutProd: { hex: `#${siGit.hex}`, path: siGit.path },
  sonar: { hex: `#${siSonarqubeserver.hex}`, path: siSonarqubeserver.path },
  buildStaging: { hex: `#${siDocker.hex}`, path: siDocker.path },
  deployPre: { hex: `#${siDocker.hex}`, path: siDocker.path },
  buildProd: { hex: `#${siDocker.hex}`, path: siDocker.path },
  deployProd: { hex: `#${siDocker.hex}`, path: siDocker.path },
  staging: { hex: `#${siKubernetes.hex}`, path: siKubernetes.path },
  production: { hex: `#${siKubernetes.hex}`, path: siKubernetes.path },
  ingressHomolog: { hex: `#${siNginx.hex}`, path: siNginx.path },
  ingressProd: { hex: `#${siNginx.hex}`, path: siNginx.path },
  okeHomolog: { hex: `#${siKubernetes.hex}`, path: siKubernetes.path },
  okeProd: { hex: `#${siKubernetes.hex}`, path: siKubernetes.path },
  dockerHomolog: { hex: `#${siDocker.hex}`, path: siDocker.path },
  dockerProd: { hex: `#${siDocker.hex}`, path: siDocker.path },
  jvmHomolog: { hex: `#${siOpenjdk.hex}`, path: siOpenjdk.path },
  jvmProd: { hex: `#${siOpenjdk.hex}`, path: siOpenjdk.path },
  jenkins: { hex: `#${siJenkins.hex}`, path: siJenkins.path },
  jenkinsProd: { hex: `#${siJenkins.hex}`, path: siJenkins.path },
  qaFeature: { hex: `#${siGit.hex}`, path: siGit.path },
  qaHotfix: { hex: `#${siGit.hex}`, path: siGit.path },
  review: { hex: '#8A8A99', path: siGithub.path },
}

function iconTransform(node: NodePos) {
  const cx = node.x + 20
  const cy = node.y + 20
  return `translate(${cx - 9}, ${cy - 9}) scale(0.75)`
}

function iconCircleFill(key: string) {
  const icon = nodeIcons[key]
  return icon ? `color-mix(in srgb, ${icon.hex} 18%, var(--color-surface))` : 'var(--color-border)'
}

const pipelineGroup = { x: 70, y: 530, w: 560, h: 300 }
const homologGroup = { x: 90, y: 688, w: 520, h: 140 }
const stagingEnvGroup = { x: 70, y: 910, w: 560, h: 270 }
const qaGroup = { x: 70, y: 1260, w: 560, h: 274 }
const qaChangeGroup = { x: 90, y: 1418, w: 520, h: 100 }
const prodPipelineGroup = { x: 70, y: 1784, w: 560, h: 300 }
const productionGroup = { x: 90, y: 1942, w: 520, h: 140 }
const productionEnvGroup = { x: 70, y: 2164, w: 560, h: 270 }

const workflowMainNodes: NodePos[] = [
  { key: 'develop', x: SPINE_X, y: 20, w: CARD_W, h: 90 },
  { key: 'developMerge', x: SPINE_X, y: 360, w: CARD_W, h: 90 },
  { key: 'jenkins', x: 90, y: 546, w: 520, h: 64 },
  { key: 'staging', x: 90, y: 926, w: 520, h: 58 },
  { key: 'qa', x: 90, y: 1276, w: 520, h: 64 },
  { key: 'release', x: SPINE_X, y: 1614, w: CARD_W, h: 90 },
  { key: 'jenkinsProd', x: 90, y: 1800, w: 520, h: 64 },
  { key: 'production', x: 90, y: 2180, w: 520, h: 58 },
]

const workflowForkNodes: NodePos[] = [
  { key: 'feature', x: 70, y: 190, w: 220, h: 90 },
  { key: 'hotfix', x: 410, y: 190, w: 220, h: 90 },
]

const workflowChipNodes: NodePos[] = [
  { key: 'checkout', x: 90, y: 624, w: 250, h: 50 },
  { key: 'tools', x: 360, y: 624, w: 250, h: 50 },
  { key: 'test', x: 105, y: 718, w: 240, h: 42 },
  { key: 'sonar', x: 355, y: 718, w: 240, h: 42 },
  { key: 'buildStaging', x: 105, y: 762, w: 240, h: 42 },
  { key: 'deployPre', x: 355, y: 762, w: 240, h: 42 },
  { key: 'checkoutProd', x: 90, y: 1878, w: 250, h: 50 },
  { key: 'toolsProd', x: 360, y: 1878, w: 250, h: 50 },
  { key: 'testProd', x: 105, y: 1972, w: 240, h: 42 },
  { key: 'sonarProd', x: 355, y: 1972, w: 240, h: 42 },
  { key: 'buildProd', x: 105, y: 2016, w: 240, h: 42 },
  { key: 'deployProd', x: 355, y: 2016, w: 240, h: 42 },
]

const workflowOciNodes: NodePos[] = [
  { key: 'dnsHomolog', x: 90, y: 998, w: 250, h: 50 },
  { key: 'lbHomolog', x: 360, y: 998, w: 250, h: 50 },
  { key: 'ingressHomolog', x: 90, y: 1056, w: 250, h: 50 },
  { key: 'okeHomolog', x: 360, y: 1056, w: 250, h: 50 },
  { key: 'dockerHomolog', x: 90, y: 1114, w: 250, h: 50 },
  { key: 'jvmHomolog', x: 360, y: 1114, w: 250, h: 50 },
  { key: 'dnsProd', x: 90, y: 2252, w: 250, h: 50 },
  { key: 'lbProd', x: 360, y: 2252, w: 250, h: 50 },
  { key: 'ingressProd', x: 90, y: 2310, w: 250, h: 50 },
  { key: 'okeProd', x: 360, y: 2310, w: 250, h: 50 },
  { key: 'dockerProd', x: 90, y: 2368, w: 250, h: 50 },
  { key: 'jvmProd', x: 360, y: 2368, w: 250, h: 50 },
]

const workflowQaNodes: NodePos[] = [{ key: 'qaBasic', x: 90, y: 1354, w: 520, h: 50 }]

const workflowQaForkNodes: NodePos[] = [
  { key: 'qaFeature', x: 105, y: 1448, w: 240, h: 50 },
  { key: 'qaHotfix', x: 355, y: 1448, w: 240, h: 50 },
]

const workflowCrossNodes: NodePos[] = [{ key: 'review', x: 10, y: 365, w: 190, h: 80 }]

const workflowFallbackIcons: { key: string; icon: string }[] = [
  { key: 'qa', icon: 'pi-verified' },
  { key: 'qaBasic', icon: 'pi-list-check' },
  { key: 'tools', icon: 'pi-wrench' },
  { key: 'test', icon: 'pi-list-check' },
  { key: 'toolsProd', icon: 'pi-wrench' },
  { key: 'testProd', icon: 'pi-list-check' },
  { key: 'sonarProd', icon: 'pi-lock' },
  { key: 'dnsHomolog', icon: 'pi-globe' },
  { key: 'lbHomolog', icon: 'pi-sitemap' },
  { key: 'dnsProd', icon: 'pi-globe' },
  { key: 'lbProd', icon: 'pi-sitemap' },
]

const workflowNodeMap: Record<string, NodePos> = Object.fromEntries(
  [
    ...workflowMainNodes,
    ...workflowForkNodes,
    ...workflowChipNodes,
    ...workflowOciNodes,
    ...workflowQaNodes,
    ...workflowQaForkNodes,
    ...workflowCrossNodes,
  ].map((node) => [node.key, node]),
)

const workflowBadgesLeft: NodePos[] = [
  workflowForkNodes[0],
  workflowQaForkNodes[0],
  ...workflowCrossNodes,
  ...workflowChipNodes.filter((_, index) => index % 2 === 0),
  ...workflowOciNodes.filter((_, index) => index % 2 === 0),
]

const workflowBadgesRight: NodePos[] = [
  ...workflowMainNodes,
  workflowForkNodes[1],
  ...workflowQaNodes,
  workflowQaForkNodes[1],
  ...workflowChipNodes.filter((_, index) => index % 2 === 1),
  ...workflowOciNodes.filter((_, index) => index % 2 === 1),
]
</script>

<template>
  <section id="architecture" class="section architecture">
    <div class="container">
      <SectionHeading
        centered
        :title="t('architecture.intro.title')"
        :subtitle="t('architecture.intro.subtitle')"
      />

      <Tabs v-model:value="activeTab" class="architecture__tabs">
        <TabList>
          <Tab value="develop">{{ t('architecture.workflow.title') }}</Tab>
          <Tab value="systems">{{ t('architecture.title') }}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel value="develop">
            <p class="architecture__intro">{{ t('architecture.workflow.subtitle') }}</p>

            <figure v-reveal class="architecture__figure" style="transition-delay: 100ms">
              <div class="architecture__scroll">
                <div class="architecture__stage architecture__stage--workflow">
                  <svg
                    :viewBox="`0 0 ${VIEWBOX_W} ${WORKFLOW_VIEWBOX_H}`"
                    class="architecture__svg"
                    role="img"
                    :aria-label="t('architecture.workflow.caption')"
                  >
                    <defs>
                      <marker
                        id="arrow-workflow"
                        viewBox="0 0 10 10"
                        refX="8.5"
                        refY="5"
                        markerWidth="7"
                        markerHeight="7"
                        orient="auto-start-reverse"
                      >
                        <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)" />
                      </marker>
                      <marker
                        id="arrow-workflow-muted"
                        viewBox="0 0 10 10"
                        refX="8.5"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M0,0 L10,5 L0,10 z" fill="var(--color-text-muted)" />
                      </marker>
                    </defs>

                    <!-- Develop -> feature/* -->
                    <line
                      x1="330"
                      y1="110"
                      x2="200"
                      y2="190"
                      stroke="var(--color-accent)"
                      stroke-width="2"
                      marker-end="url(#arrow-workflow)"
                    />
                    <!-- Develop -> hotfix/* -->
                    <line
                      x1="370"
                      y1="110"
                      x2="500"
                      y2="190"
                      stroke="var(--color-accent)"
                      stroke-width="2"
                      marker-end="url(#arrow-workflow)"
                    />
                    <text x="350" y="155" class="edge-label" text-anchor="middle">
                      {{ t('architecture.workflow.edges.create') }}
                    </text>

                    <!-- feature/* -> Develop (merge) -->
                    <line
                      x1="200"
                      y1="280"
                      x2="330"
                      y2="360"
                      stroke="var(--color-accent)"
                      stroke-width="2"
                      marker-end="url(#arrow-workflow)"
                    />
                    <!-- hotfix/* -> Develop (merge) -->
                    <line
                      x1="500"
                      y1="280"
                      x2="370"
                      y2="360"
                      stroke="var(--color-accent)"
                      stroke-width="2"
                      marker-end="url(#arrow-workflow)"
                    />
                    <text x="350" y="325" class="edge-label" text-anchor="middle">
                      {{ t('architecture.workflow.edges.merge') }}
                    </text>

                    <!-- Review -> Develop (approve) -->
                    <line
                      x1="200"
                      y1="405"
                      x2="216"
                      y2="405"
                      stroke="var(--color-text-muted)"
                      stroke-width="1.5"
                      stroke-dasharray="5 4"
                      marker-end="url(#arrow-workflow-muted)"
                    />
                    <text x="105" y="355" class="edge-label edge-label--muted" text-anchor="middle">
                      {{ t('architecture.workflow.edges.approve') }}
                    </text>

                    <!-- Develop -> Jenkins scan -->
                    <line
                      x1="350"
                      y1="450"
                      x2="350"
                      y2="546"
                      stroke="var(--color-accent)"
                      stroke-width="2"
                      marker-end="url(#arrow-workflow)"
                    />
                    <text x="365" y="498" class="edge-label" text-anchor="start">
                      {{ t('architecture.workflow.edges.scan') }}
                    </text>

                    <!-- Pipeline group -> Homologação OCI -->
                    <line
                      x1="350"
                      y1="830"
                      x2="350"
                      y2="910"
                      stroke="var(--color-accent)"
                      stroke-width="2"
                      marker-end="url(#arrow-workflow)"
                    />
                    <text x="365" y="870" class="edge-label" text-anchor="start">
                      {{ t('architecture.workflow.edges.ready') }}
                    </text>

                    <!-- Homologação OCI -> QA -->
                    <line
                      x1="350"
                      y1="1180"
                      x2="350"
                      y2="1260"
                      stroke="var(--color-accent)"
                      stroke-width="2"
                      marker-end="url(#arrow-workflow)"
                    />
                    <text x="365" y="1220" class="edge-label" text-anchor="start">
                      {{ t('architecture.workflow.edges.validate') }}
                    </text>

                    <!-- QA -> release/<versão> -->
                    <line
                      x1="350"
                      y1="1534"
                      x2="350"
                      y2="1614"
                      stroke="var(--color-accent)"
                      stroke-width="2"
                      marker-end="url(#arrow-workflow)"
                    />
                    <text x="365" y="1574" class="edge-label" text-anchor="start">
                      {{ t('architecture.workflow.edges.release') }}
                    </text>

                    <!-- release -> Jenkins produção -->
                    <line
                      x1="350"
                      y1="1704"
                      x2="350"
                      y2="1800"
                      stroke="var(--color-accent)"
                      stroke-width="2"
                      marker-end="url(#arrow-workflow)"
                    />
                    <text x="365" y="1752" class="edge-label" text-anchor="start">
                      {{ t('architecture.workflow.edges.scan') }}
                    </text>

                    <!-- Pipeline produção -> Produção OCI -->
                    <line
                      x1="350"
                      y1="2084"
                      x2="350"
                      y2="2164"
                      stroke="var(--color-accent)"
                      stroke-width="2"
                      marker-end="url(#arrow-workflow)"
                    />
                    <text x="365" y="2124" class="edge-label" text-anchor="start">
                      {{ t('architecture.workflow.edges.deploy') }}
                    </text>

                    <!-- Jenkins pipeline group -->
                    <rect
                      :x="pipelineGroup.x"
                      :y="pipelineGroup.y"
                      :width="pipelineGroup.w"
                      :height="pipelineGroup.h"
                      rx="16"
                      fill="var(--color-surface)"
                      stroke="var(--color-border-strong)"
                      stroke-width="1.5"
                      stroke-dasharray="5 4"
                    />

                    <!-- Homologação nested stage -->
                    <rect
                      :x="homologGroup.x"
                      :y="homologGroup.y"
                      :width="homologGroup.w"
                      :height="homologGroup.h"
                      rx="12"
                      fill="var(--color-accent-soft)"
                      stroke="var(--color-accent)"
                      stroke-width="1.5"
                    />
                    <text
                      :x="homologGroup.x + homologGroup.w / 2"
                      :y="homologGroup.y + 18"
                      class="group-label group-label--accent"
                      text-anchor="middle"
                    >
                      {{ t('architecture.workflow.groups.homologation') }}
                    </text>

                    <!-- Homologação OCI environment -->
                    <rect
                      :x="stagingEnvGroup.x"
                      :y="stagingEnvGroup.y"
                      :width="stagingEnvGroup.w"
                      :height="stagingEnvGroup.h"
                      rx="16"
                      fill="var(--color-surface)"
                      stroke="var(--color-border-strong)"
                      stroke-width="1.5"
                      stroke-dasharray="5 4"
                    />

                    <!-- QA group -->
                    <rect
                      :x="qaGroup.x"
                      :y="qaGroup.y"
                      :width="qaGroup.w"
                      :height="qaGroup.h"
                      rx="16"
                      fill="var(--color-surface)"
                      stroke="var(--color-border-strong)"
                      stroke-width="1.5"
                      stroke-dasharray="5 4"
                    />
                    <rect
                      :x="qaChangeGroup.x"
                      :y="qaChangeGroup.y"
                      :width="qaChangeGroup.w"
                      :height="qaChangeGroup.h"
                      rx="12"
                      fill="var(--color-accent-soft)"
                      stroke="var(--color-accent)"
                      stroke-width="1.5"
                    />
                    <text
                      :x="qaChangeGroup.x + qaChangeGroup.w / 2"
                      :y="qaChangeGroup.y + 18"
                      class="group-label group-label--accent"
                      text-anchor="middle"
                    >
                      {{ t('architecture.workflow.groups.qaChange') }}
                    </text>

                    <!-- Jenkins production pipeline group -->
                    <rect
                      :x="prodPipelineGroup.x"
                      :y="prodPipelineGroup.y"
                      :width="prodPipelineGroup.w"
                      :height="prodPipelineGroup.h"
                      rx="16"
                      fill="var(--color-surface)"
                      stroke="var(--color-border-strong)"
                      stroke-width="1.5"
                      stroke-dasharray="5 4"
                    />

                    <!-- Produção nested stage -->
                    <rect
                      :x="productionGroup.x"
                      :y="productionGroup.y"
                      :width="productionGroup.w"
                      :height="productionGroup.h"
                      rx="12"
                      fill="var(--color-accent-soft)"
                      stroke="var(--color-accent)"
                      stroke-width="1.5"
                    />
                    <text
                      :x="productionGroup.x + productionGroup.w / 2"
                      :y="productionGroup.y + 18"
                      class="group-label group-label--accent"
                      text-anchor="middle"
                    >
                      {{ t('architecture.workflow.groups.production') }}
                    </text>

                    <!-- Produção OCI environment -->
                    <rect
                      :x="productionEnvGroup.x"
                      :y="productionEnvGroup.y"
                      :width="productionEnvGroup.w"
                      :height="productionEnvGroup.h"
                      rx="16"
                      fill="var(--color-surface)"
                      stroke="var(--color-border-strong)"
                      stroke-width="1.5"
                      stroke-dasharray="5 4"
                    />

                    <!-- Workflow main spine nodes -->
                    <g v-for="node in workflowMainNodes" :key="node.key">
                      <rect
                        :x="node.x"
                        :y="node.y"
                        :width="node.w"
                        :height="node.h"
                        rx="14"
                        fill="var(--color-accent-soft)"
                        stroke="var(--color-accent)"
                        stroke-width="1.5"
                      />
                      <circle
                        :cx="node.x + 20"
                        :cy="node.y + 20"
                        r="13"
                        :fill="iconCircleFill(node.key)"
                      />
                      <g v-if="nodeIcons[node.key]" :transform="iconTransform(node)">
                        <path :d="nodeIcons[node.key]?.path" :fill="nodeIcons[node.key]?.hex" />
                      </g>
                      <text
                        :x="node.x + node.w / 2"
                        :y="node.y + node.h / 2 - 4"
                        text-anchor="middle"
                        class="node-title"
                      >
                        {{ t(`architecture.workflow.nodes.${node.key}.title`) }}
                      </text>
                      <text
                        :x="node.x + node.w / 2"
                        :y="node.y + node.h / 2 + 16"
                        text-anchor="middle"
                        class="node-subtitle"
                      >
                        {{ t(`architecture.workflow.nodes.${node.key}.subtitle`) }}
                      </text>
                    </g>

                    <!-- Workflow fork nodes: feature/* or hotfix/* -->
                    <g v-for="node in workflowForkNodes" :key="node.key">
                      <rect
                        :x="node.x"
                        :y="node.y"
                        :width="node.w"
                        :height="node.h"
                        rx="14"
                        fill="var(--color-surface)"
                        stroke="var(--color-border-strong)"
                        stroke-width="1.5"
                        stroke-dasharray="5 4"
                      />
                      <circle
                        :cx="node.x + 20"
                        :cy="node.y + 20"
                        r="13"
                        :fill="iconCircleFill(node.key)"
                      />
                      <g v-if="nodeIcons[node.key]" :transform="iconTransform(node)">
                        <path :d="nodeIcons[node.key]?.path" :fill="nodeIcons[node.key]?.hex" />
                      </g>
                      <text
                        :x="node.x + node.w / 2"
                        :y="node.y + node.h / 2 - 4"
                        text-anchor="middle"
                        class="node-title"
                      >
                        {{ t(`architecture.workflow.nodes.${node.key}.title`) }}
                      </text>
                      <text
                        :x="node.x + node.w / 2"
                        :y="node.y + node.h / 2 + 16"
                        text-anchor="middle"
                        class="node-subtitle"
                      >
                        {{ t(`architecture.workflow.nodes.${node.key}.subtitle`) }}
                      </text>
                    </g>

                    <!-- Workflow cross-cutting nodes: code review -->
                    <g v-for="node in workflowCrossNodes" :key="node.key">
                      <rect
                        :x="node.x"
                        :y="node.y"
                        :width="node.w"
                        :height="node.h"
                        rx="14"
                        fill="var(--color-surface)"
                        stroke="var(--color-border-strong)"
                        stroke-width="1.5"
                        stroke-dasharray="5 4"
                      />
                      <circle
                        :cx="node.x + 20"
                        :cy="node.y + 20"
                        r="13"
                        :fill="iconCircleFill(node.key)"
                      />
                      <g v-if="nodeIcons[node.key]" :transform="iconTransform(node)">
                        <path :d="nodeIcons[node.key]?.path" :fill="nodeIcons[node.key]?.hex" />
                      </g>
                      <text
                        :x="node.x + node.w / 2"
                        :y="node.y + node.h / 2 - 4"
                        text-anchor="middle"
                        class="node-title"
                      >
                        {{ t(`architecture.workflow.nodes.${node.key}.title`) }}
                      </text>
                      <text
                        :x="node.x + node.w / 2"
                        :y="node.y + node.h / 2 + 16"
                        text-anchor="middle"
                        class="node-subtitle"
                      >
                        {{ t(`architecture.workflow.nodes.${node.key}.subtitle`) }}
                      </text>
                    </g>

                    <!-- Pipeline stage chips -->
                    <g v-for="node in [...workflowChipNodes, ...workflowQaNodes, ...workflowOciNodes]" :key="node.key">
                      <rect
                        :x="node.x"
                        :y="node.y"
                        :width="node.w"
                        :height="node.h"
                        rx="10"
                        fill="var(--color-surface)"
                        stroke="var(--color-border-strong)"
                        stroke-width="1.5"
                      />
                      <circle
                        :cx="node.x + 18"
                        :cy="node.y + node.h / 2"
                        r="11"
                        :fill="iconCircleFill(node.key)"
                      />
                      <g
                        v-if="nodeIcons[node.key]"
                        :transform="`translate(${node.x + 9}, ${node.y + node.h / 2 - 9}) scale(0.75)`"
                      >
                        <path :d="nodeIcons[node.key]?.path" :fill="nodeIcons[node.key]?.hex" />
                      </g>
                      <text
                        :x="node.x + 38"
                        :y="node.y + node.h / 2 + 4"
                        text-anchor="start"
                        class="node-title node-title--sm"
                      >
                        {{ t(`architecture.workflow.nodes.${node.key}.title`) }}
                      </text>
                    </g>

                    <!-- QA change-type forks -->
                    <g v-for="node in workflowQaForkNodes" :key="node.key">
                      <rect
                        :x="node.x"
                        :y="node.y"
                        :width="node.w"
                        :height="node.h"
                        rx="10"
                        fill="var(--color-surface)"
                        stroke="var(--color-border-strong)"
                        stroke-width="1.5"
                        stroke-dasharray="5 4"
                      />
                      <circle
                        :cx="node.x + 18"
                        :cy="node.y + node.h / 2"
                        r="11"
                        :fill="iconCircleFill(node.key)"
                      />
                      <g
                        v-if="nodeIcons[node.key]"
                        :transform="`translate(${node.x + 9}, ${node.y + node.h / 2 - 9}) scale(0.75)`"
                      >
                        <path :d="nodeIcons[node.key]?.path" :fill="nodeIcons[node.key]?.hex" />
                      </g>
                      <text
                        :x="node.x + 38"
                        :y="node.y + node.h / 2 + 4"
                        text-anchor="start"
                        class="node-title node-title--sm"
                      >
                        {{ t(`architecture.workflow.nodes.${node.key}.title`) }}
                      </text>
                    </g>
                  </svg>

                  <i
                    v-for="item in workflowFallbackIcons"
                    :key="item.key"
                    class="architecture__icon-fallback"
                    :class="`pi ${item.icon}`"
                    :style="fallbackStyleFor(item.key)"
                    aria-hidden="true"
                  />

                  <button
                    v-for="node in workflowBadgesRight"
                    :key="node.key"
                    type="button"
                    class="architecture__badge"
                    :style="badgeStyle(node, VIEWBOX_W, WORKFLOW_VIEWBOX_H)"
                    :aria-label="`${t('architecture.learn_more')} ${t(`architecture.workflow.nodes.${node.key}.title`)}`"
                    @click="
                      openDetail(
                        t(`architecture.workflow.nodes.${node.key}.title`),
                        t(`architecture.workflow.details.${node.key}`),
                      )
                    "
                  >
                    <i class="pi pi-info-circle" aria-hidden="true" />
                  </button>
                  <button
                    v-for="node in workflowBadgesLeft"
                    :key="node.key"
                    type="button"
                    class="architecture__badge"
                    :style="badgeStyle(node, VIEWBOX_W, WORKFLOW_VIEWBOX_H)"
                    :aria-label="`${t('architecture.learn_more')} ${t(`architecture.workflow.nodes.${node.key}.title`)}`"
                    @click="
                      openDetail(
                        t(`architecture.workflow.nodes.${node.key}.title`),
                        t(`architecture.workflow.details.${node.key}`),
                      )
                    "
                  >
                    <i class="pi pi-info-circle" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <figcaption class="architecture__caption">
                {{ t('architecture.workflow.caption') }}
              </figcaption>
            </figure>
          </TabPanel>

          <TabPanel value="systems">
            <p class="architecture__intro">{{ t('architecture.subtitle') }}</p>

            <figure v-reveal class="architecture__figure">
              <div class="architecture__scroll">
                <div class="architecture__stage architecture__stage--systems">
                  <svg
                    :viewBox="`0 0 ${ARCH_VIEWBOX_W} ${ARCH_VIEWBOX_H}`"
                    class="architecture__svg"
                    role="img"
                    :aria-label="t('architecture.diagram.caption')"
                  >
                    <defs>
                      <marker
                        id="arrow-primary"
                        viewBox="0 0 10 10"
                        refX="8.5"
                        refY="5"
                        markerWidth="7"
                        markerHeight="7"
                        orient="auto-start-reverse"
                      >
                        <path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)" />
                      </marker>
                      <marker
                        id="arrow-muted"
                        viewBox="0 0 10 10"
                        refX="8.5"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M0,0 L10,5 L0,10 z" fill="var(--color-text-muted)" />
                      </marker>
                    </defs>

                    <line :x1="ARCH_SPINE_CX" y1="110" :x2="ARCH_SPINE_CX" y2="190" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#arrow-primary)" />
                    <text :x="ARCH_SPINE_CX + 15" y="155" class="edge-label" text-anchor="start">
                      {{ t('architecture.diagram.edges.request') }}
                    </text>

                    <line :x1="ARCH_SPINE_CX" y1="280" :x2="ARCH_SPINE_CX" y2="360" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#arrow-primary)" />
                    <text :x="ARCH_SPINE_CX + 15" y="325" class="edge-label" text-anchor="start">
                      {{ t('architecture.diagram.edges.strip') }}
                    </text>

                    <line :x1="ARCH_SPINE_CX" y1="660" :x2="ARCH_SPINE_CX" y2="740" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#arrow-primary)" />
                    <text :x="ARCH_SPINE_CX + 15" y="705" class="edge-label" text-anchor="start">
                      {{ t('architecture.diagram.edges.publish') }}
                    </text>

                    <line :x1="ARCH_SPINE_CX" y1="830" :x2="ARCH_SPINE_CX" y2="910" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#arrow-primary)" />
                    <text :x="ARCH_SPINE_CX + 15" y="875" class="edge-label" text-anchor="start">
                      {{ t('architecture.diagram.edges.consume') }}
                    </text>

                    <line :x1="ARCH_SPINE_CX" y1="1210" :x2="ARCH_SPINE_CX" y2="1290" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#arrow-primary)" />
                    <text :x="ARCH_SPINE_CX + 15" y="1255" class="edge-label" text-anchor="start">
                      {{ t('architecture.diagram.edges.persist') }}
                    </text>

                    <line :x1="LEFT_EDGE" y1="65" :x2="ARCH_SPINE_X" y2="65" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#arrow-muted)" />
                    <text :x="LEFT_X + SIDE_W / 2" y="122" class="edge-label edge-label--muted" text-anchor="middle">
                      {{ t('architecture.diagram.edges.login') }}
                    </text>

                    <polyline :points="`${LEFT_EDGE},90 ${GUTTER_L},90 ${GUTTER_L},401 ${ARCH_SPINE_X},401`" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#arrow-muted)" />
                    <text :x="LEFT_X + SIDE_W / 2" y="250" class="edge-label edge-label--muted" text-anchor="middle">
                      {{ t('architecture.diagram.edges.validate') }}
                    </text>

                    <line :x1="RIGHT_X" y1="235" :x2="SPINE_RIGHT" y2="235" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#arrow-muted)" />
                    <text :x="RIGHT_X + SIDE_W / 2" y="185" class="edge-label edge-label--muted" text-anchor="middle">
                      {{ t('architecture.diagram.edges.ratelimit') }}
                    </text>

                    <line :x1="LEFT_EDGE" y1="410" :x2="ARCH_SPINE_X" y2="410" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#arrow-muted)" />
                    <polyline :points="`${LEFT_EDGE},448 ${GUTTER_L},448 ${GUTTER_L},951 ${ARCH_SPINE_X},951`" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#arrow-muted)" />
                    <text :x="LEFT_X + SIDE_W / 2" y="700" class="edge-label edge-label--muted" text-anchor="middle">
                      {{ t('architecture.diagram.edges.secrets') }}
                    </text>

                    <line :x1="RIGHT_X" y1="493" :x2="SPINE_RIGHT" y2="493" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#arrow-muted)" />
                    <polyline :points="`${RIGHT_X},518 ${GUTTER_R},518 ${GUTTER_R},990 ${SPINE_RIGHT},990`" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#arrow-muted)" />
                    <text :x="RIGHT_X + SIDE_W / 2" y="348" class="edge-label edge-label--muted" text-anchor="middle">
                      {{ t('architecture.diagram.edges.scrape') }}
                    </text>

                    <polyline :points="`${RIGHT_X},559 ${GUTTER_R - 8},559 ${GUTTER_R - 8},960 ${SPINE_RIGHT},960`" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#arrow-muted)" />
                    <text :x="RIGHT_X + SIDE_W / 2" y="618" class="edge-label edge-label--muted" text-anchor="middle">
                      {{ t('architecture.diagram.edges.logs') }}
                    </text>

                    <line :x1="RIGHT_X" y1="1335" :x2="SPINE_RIGHT" y2="1335" stroke="var(--color-text-muted)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#arrow-muted)" />
                    <text :x="RIGHT_X + SIDE_W / 2" y="1285" class="edge-label edge-label--muted" text-anchor="middle">
                      {{ t('architecture.diagram.edges.manage') }}
                    </text>

                    <rect :x="bffGroup.x" :y="bffGroup.y" :width="bffGroup.w" :height="bffGroup.h" rx="16" fill="var(--color-surface)" stroke="var(--color-border-strong)" stroke-width="1.5" stroke-dasharray="5 4" />
                    <rect :x="bffHttpGroup.x" :y="bffHttpGroup.y" :width="bffHttpGroup.w" :height="bffHttpGroup.h" rx="12" fill="var(--color-accent-soft)" stroke="var(--color-accent)" stroke-width="1.5" />
                    <text :x="bffHttpGroup.x + bffHttpGroup.w / 2" :y="bffHttpGroup.y + 16" class="group-label group-label--accent" text-anchor="middle">
                      {{ t('architecture.diagram.groups.http') }}
                    </text>

                    <rect :x="grafanaGroup.x" :y="grafanaGroup.y" :width="grafanaGroup.w" :height="grafanaGroup.h" rx="16" fill="var(--color-surface)" stroke="var(--color-border-strong)" stroke-width="1.5" stroke-dasharray="5 4" />

                    <rect :x="workerGroup.x" :y="workerGroup.y" :width="workerGroup.w" :height="workerGroup.h" rx="16" fill="var(--color-surface)" stroke="var(--color-border-strong)" stroke-width="1.5" stroke-dasharray="5 4" />
                    <rect :x="persistGroup.x" :y="persistGroup.y" :width="persistGroup.w" :height="persistGroup.h" rx="12" fill="var(--color-accent-soft)" stroke="var(--color-accent)" stroke-width="1.5" />
                    <text :x="persistGroup.x + persistGroup.w / 2" :y="persistGroup.y + 16" class="group-label group-label--accent" text-anchor="middle">
                      {{ t('architecture.diagram.groups.persistence') }}
                    </text>

                    <g v-for="node in [...primaryNodes, grafanaNode]" :key="node.key">
                      <rect :x="node.x" :y="node.y" :width="node.w" :height="node.h" rx="14" fill="var(--color-accent-soft)" stroke="var(--color-accent)" stroke-width="1.5" />
                      <circle :cx="node.x + 20" :cy="node.y + 20" r="13" :fill="iconCircleFill(node.key)" />
                      <g v-if="nodeIcons[node.key]" :transform="iconTransform(node)">
                        <path :d="nodeIcons[node.key]?.path" :fill="nodeIcons[node.key]?.hex" />
                      </g>
                      <text :x="node.x + node.w / 2" :y="node.y + node.h / 2 - 4" text-anchor="middle" class="node-title">
                        {{ t(`architecture.diagram.nodes.${node.key}.title`) }}
                      </text>
                      <text :x="node.x + node.w / 2" :y="node.y + node.h / 2 + 16" text-anchor="middle" class="node-subtitle">
                        {{ t(`architecture.diagram.nodes.${node.key}.subtitle`) }}
                      </text>
                    </g>

                    <g v-for="node in supportingNodes" :key="node.key">
                      <rect :x="node.x" :y="node.y" :width="node.w" :height="node.h" rx="14" fill="var(--color-surface)" stroke="var(--color-border-strong)" stroke-width="1.5" stroke-dasharray="5 4" />
                      <circle :cx="node.x + 20" :cy="node.y + 20" r="13" :fill="iconCircleFill(node.key)" />
                      <g v-if="nodeIcons[node.key]" :transform="iconTransform(node)">
                        <path :d="nodeIcons[node.key]?.path" :fill="nodeIcons[node.key]?.hex" />
                      </g>
                      <text :x="node.x + node.w / 2" :y="node.y + node.h / 2 - 4" text-anchor="middle" class="node-title">
                        {{ t(`architecture.diagram.nodes.${node.key}.title`) }}
                      </text>
                      <text :x="node.x + node.w / 2" :y="node.y + node.h / 2 + 16" text-anchor="middle" class="node-subtitle">
                        {{ t(`architecture.diagram.nodes.${node.key}.subtitle`) }}
                      </text>
                    </g>

                    <g v-for="node in archChipNodes" :key="node.key">
                      <rect :x="node.x" :y="node.y" :width="node.w" :height="node.h" rx="10" fill="var(--color-surface)" stroke="var(--color-border-strong)" stroke-width="1.5" />
                      <circle :cx="node.x + 18" :cy="node.y + node.h / 2" r="11" :fill="iconCircleFill(node.key)" />
                      <g v-if="nodeIcons[node.key]" :transform="`translate(${node.x + 9}, ${node.y + node.h / 2 - 9}) scale(0.75)`">
                        <path :d="nodeIcons[node.key]?.path" :fill="nodeIcons[node.key]?.hex" />
                      </g>
                      <text :x="node.x + 38" :y="node.y + node.h / 2 + 4" text-anchor="start" class="node-title node-title--sm">
                        {{ t(`architecture.diagram.nodes.${node.key}.title`) }}
                      </text>
                    </g>
                  </svg>

                  <i
                    v-for="item in archFallbackIcons"
                    :key="item.key"
                    class="architecture__icon-fallback"
                    :class="`pi ${item.icon}`"
                    :style="archFallbackStyleFor(item.key)"
                    aria-hidden="true"
                  />

                  <button
                    v-for="node in badgesRight"
                    :key="node.key"
                    type="button"
                    class="architecture__badge"
                    :style="badgeStyle(node, ARCH_VIEWBOX_W, ARCH_VIEWBOX_H)"
                    :aria-label="`${t('architecture.learn_more')} ${t(`architecture.diagram.nodes.${node.key}.title`)}`"
                    @click="
                      openDetail(
                        t(`architecture.diagram.nodes.${node.key}.title`),
                        t(`architecture.details.${node.key}`),
                      )
                    "
                  >
                    <i class="pi pi-info-circle" aria-hidden="true" />
                  </button>
                  <button
                    v-for="node in badgesLeft"
                    :key="node.key"
                    type="button"
                    class="architecture__badge"
                    :style="badgeStyle(node, ARCH_VIEWBOX_W, ARCH_VIEWBOX_H)"
                    :aria-label="`${t('architecture.learn_more')} ${t(`architecture.diagram.nodes.${node.key}.title`)}`"
                    @click="
                      openDetail(
                        t(`architecture.diagram.nodes.${node.key}.title`),
                        t(`architecture.details.${node.key}`),
                      )
                    "
                  >
                    <i class="pi pi-info-circle" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <figcaption class="architecture__caption">
                {{ t('architecture.diagram.caption') }}
              </figcaption>
            </figure>

            <p class="architecture__footnote">{{ t('architecture.footnote') }}</p>
          </TabPanel>

        </TabPanels>
      </Tabs>
    </div>

    <Dialog
      v-model:visible="detailOpen"
      modal
      dismissable-mask
      :header="detailTitle"
      :breakpoints="{ '640px': 'calc(100vw - 16px)' }"
      class="arch-detail"
    >
      <p class="architecture__detail-body">{{ detailBody }}</p>
    </Dialog>
  </section>
</template>

<style scoped lang="scss">
.architecture {
  padding-top: 40px;
}

.architecture__tabs {
  margin-top: 48px;
}

:deep(.p-tablist-tab-list) {
  display: flex;
  width: 100%;
}

:deep(.p-tab) {
  flex: 1 1 0;
  justify-content: center;
  text-align: center;
  white-space: normal;
}

@media (max-width: 640px) {
  :deep(.p-tab) {
    font-size: 0.78rem;
    padding: 8px 8px;
  }
}

.architecture__intro {
  max-width: 560px;
  margin: 0 auto 32px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  text-align: center;
}

.architecture__figure {
  margin: 0;
}

.architecture__scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 8px 0 16px;
  overscroll-behavior-x: contain;
}

.architecture__stage {
  position: relative;
  max-width: 480px;
  margin-inline: auto;
}

.architecture__stage--workflow {
  max-width: 540px;
  min-width: 520px;
}

.architecture__stage--systems {
  max-width: 640px;
  min-width: 600px;
}

.architecture__badge {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 1px solid var(--color-border-strong);
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: 0.66rem;
  line-height: 1;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast),
    background-color var(--transition-fast);

  &:hover,
  &:focus-visible {
    color: var(--color-accent);
    border-color: var(--color-accent);
    background: var(--color-accent-soft);
  }
}

.architecture__icon-fallback {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-border);
  color: var(--color-text-muted);
  font-size: 12px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.architecture__svg {
  display: block;
  width: 100%;
  height: auto;

  .node-title {
    font-family: var(--font-sans);
    font-size: 15px;
    font-weight: 600;
    fill: var(--color-text);
  }

  .node-title--sm {
    font-size: 12.5px;
  }

  .node-subtitle {
    font-family: var(--font-mono);
    font-size: 11px;
    fill: var(--color-text-muted);
  }

  .group-label {
    font-family: var(--font-mono);
    font-size: 11px;
    fill: var(--color-text-muted);
  }

  .group-label--accent {
    fill: var(--color-accent);
    font-weight: 600;
  }

  .edge-label {
    font-family: var(--font-mono);
    font-size: 11.5px;
    fill: var(--color-text-secondary);
  }

  .edge-label--muted {
    fill: var(--color-text-muted);
  }
}

.architecture__caption {
  max-width: 640px;
  margin: 20px auto 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--color-text-muted);
  text-align: center;
}

.architecture__footnote {
  margin-top: 40px;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-align: center;
}

.architecture__detail-body {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
}
</style>
