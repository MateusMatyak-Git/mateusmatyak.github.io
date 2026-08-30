<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SimShell from '@/components/projects/SimShell.vue'

const { t } = useI18n()

type Command = 'create' | 'query' | 'retry'
type JwtMode = 'valid' | 'expired'
type RoleMode = 'write' | 'read' | 'none'
type WorkerMode = 'ok' | 'timeout'
type Phase = 'setup' | 'run' | 'done'
type StageId = 'http' | 'jwt' | 'rbac' | 'rpc' | 'reply'
type StageStatus = 'idle' | 'active' | 'ok' | 'fail'

const p = 'projects.items.events.bff'
const commands: Command[] = ['create', 'query', 'retry']
const stages: StageId[] = ['http', 'jwt', 'rbac', 'rpc', 'reply']

const routes: Record<Command, string> = {
  create: 'POST /v1/orders\nAuthorization: Bearer eyJhbGci…\nX-Correlation-Id: trc-9f2a',
  query: 'GET /v1/orders/1842\nAuthorization: Bearer eyJhbGci…\nX-Correlation-Id: trc-1c88',
  retry: 'POST /v1/orders/1842/retry\nAuthorization: Bearer eyJhbGci…\nX-Correlation-Id: trc-77b0',
}

const paths: Record<Command, string> = {
  create: 'POST /v1/orders',
  query: 'GET /v1/orders/1842',
  retry: 'POST /v1/orders/1842/retry',
}

const envelopes: Record<string, string> = {
  accepted: `{
  "status": "accepted",
  "correlationId": "trc-9f2a",
  "queue": "orders.created"
}`,
  unauthorized: `{
  "error": "invalid_token",
  "status": 401
}`,
  forbidden: `{
  "error": "access_denied",
  "status": 403
}`,
  timeout: `{
  "error": "rpc_timeout",
  "dlq": "orders.created.dlq"
}`,
}

const command = ref<Command>('create')
const jwt = ref<JwtMode>('valid')
const role = ref<RoleMode>('write')
const worker = ref<WorkerMode>('ok')
const phase = ref<Phase>('setup')
const statusCode = ref(202)
const stageStatus = ref<Record<StageId, StageStatus>>({
  http: 'idle',
  jwt: 'idle',
  rbac: 'idle',
  rpc: 'idle',
  reply: 'idle',
})
const logs = ref<string[]>([])
const timers: ReturnType<typeof setTimeout>[] = []

const route = computed(() => routes[command.value])
const neededRole = computed(() => (command.value === 'query' ? 'read' : 'write'))

const stepIndex = computed(() => {
  if (phase.value === 'setup') return 0
  if (phase.value === 'done') return 3
  if (stageStatus.value.rpc !== 'idle' || stageStatus.value.reply !== 'idle') return 2
  if (stageStatus.value.jwt !== 'idle' || stageStatus.value.rbac !== 'idle') return 1
  return 0
})

const steps = computed(() =>
  ['request', 'auth', 'rpc', 'envelope'].map((key) => ({
    key,
    label: t(`${p}.steps.${key}`),
  })),
)

const outcome = computed(() => {
  if (jwt.value === 'expired') return 'unauthorized'
  if (role.value === 'none' || (neededRole.value === 'write' && role.value !== 'write')) {
    return 'forbidden'
  }
  if (worker.value === 'timeout') return 'timeout'
  return 'accepted'
})

const responseJson = computed(() => envelopes[outcome.value])

function later(ms: number, fn: () => void) {
  const id = setTimeout(fn, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : ms)
  timers.push(id)
}

function clearTimers() {
  while (timers.length) {
    const id = timers.pop()
    if (id) clearTimeout(id)
  }
}

function resetStages() {
  stageStatus.value = { http: 'idle', jwt: 'idle', rbac: 'idle', rpc: 'idle', reply: 'idle' }
  logs.value = []
}

function mark(id: StageId, status: StageStatus) {
  stageStatus.value = { ...stageStatus.value, [id]: status }
}

function dispatch() {
  clearTimers()
  resetStages()
  phase.value = 'run'
  const result = outcome.value
  statusCode.value = result === 'unauthorized' ? 401 : result === 'forbidden' ? 403 : result === 'timeout' ? 504 : 202

  later(120, () => {
    mark('http', 'active')
    logs.value = [t(`${p}.logs.http`, { route: paths[command.value] })]
  })
  later(520, () => {
    mark('http', 'ok')
    mark('jwt', 'active')
    logs.value = [...logs.value, t(`${p}.logs.jwt_${jwt.value}`)]
  })
  later(920, () => {
    if (result === 'unauthorized') {
      mark('jwt', 'fail')
      phase.value = 'done'
      return
    }
    mark('jwt', 'ok')
    mark('rbac', 'active')
    logs.value = [...logs.value, t(`${p}.logs.rbac_${role.value}`)]
  })
  later(1320, () => {
    if (result === 'unauthorized') return
    if (result === 'forbidden') {
      mark('rbac', 'fail')
      phase.value = 'done'
      return
    }
    mark('rbac', 'ok')
    mark('rpc', 'active')
    logs.value = [...logs.value, t(`${p}.logs.rpc`, { queue: t(`projects.items.events.sim.sample.${command.value}.queue`) })]
  })
  later(1880, () => {
    if (result === 'unauthorized' || result === 'forbidden') return
    mark('rpc', result === 'timeout' ? 'fail' : 'ok')
    mark('reply', 'active')
    logs.value = [...logs.value, t(`${p}.logs.reply_${result}`)]
  })
  later(2280, () => {
    if (result === 'unauthorized' || result === 'forbidden') return
    mark('reply', result === 'timeout' ? 'fail' : 'ok')
    phase.value = 'done'
  })
}

function restart() {
  clearTimers()
  phase.value = 'setup'
  statusCode.value = 202
  resetStages()
}

onUnmounted(clearTimers)
</script>

<template>
  <SimShell
    brand="#0f766e"
    :title="t(`${p}.title`)"
    locked
    :locked-label="t('projects.private')"
    :steps="steps"
    :step-index="stepIndex"
    :show-restart="phase !== 'setup'"
    :restart-label="t('projects.sim.restart')"
    @restart="restart"
  >
    <template #brand-icon>
      <i class="pi pi-server" aria-hidden="true" />
    </template>

    <div class="grid">
      <section>
        <p class="label">{{ t(`${p}.incoming`) }}</p>
        <div class="kinds">
          <button
            v-for="id in commands"
            :key="id"
            type="button"
            class="chip"
            :class="{ 'is-active': command === id }"
            :disabled="phase !== 'setup'"
            @click="command = id"
          >
            {{ t(`projects.items.events.sim.choices.${id}`) }}
          </button>
        </div>
        <pre class="http">{{ route }}</pre>

        <p class="label">JWT</p>
        <div class="kinds">
          <button
            v-for="id in ['valid', 'expired'] as JwtMode[]"
            :key="id"
            type="button"
            class="chip"
            :class="{ 'is-active': jwt === id, 'is-warn': id === 'expired' }"
            :disabled="phase !== 'setup'"
            @click="jwt = id"
          >
            {{ t(`${p}.jwt.${id}`) }}
          </button>
        </div>

        <p class="label">RBAC</p>
        <div class="kinds">
          <button
            v-for="id in ['write', 'read', 'none'] as RoleMode[]"
            :key="id"
            type="button"
            class="chip"
            :class="{ 'is-active': role === id }"
            :disabled="phase !== 'setup'"
            @click="role = id"
          >
            {{ t(`${p}.roles.${id}`) }}
          </button>
        </div>

        <p class="label">{{ t(`${p}.worker_label`) }}</p>
        <div class="kinds">
          <button
            v-for="id in ['ok', 'timeout'] as WorkerMode[]"
            :key="id"
            type="button"
            class="chip"
            :class="{ 'is-active': worker === id, 'is-warn': id === 'timeout' }"
            :disabled="phase !== 'setup'"
            @click="worker = id"
          >
            {{ t(`${p}.worker.${id}`) }}
          </button>
        </div>

        <button v-if="phase === 'setup'" type="button" class="cta" @click="dispatch">
          {{ t(`${p}.dispatch`) }}
        </button>
      </section>

      <section>
        <ol class="stages">
          <li v-for="id in stages" :key="id" class="stage" :class="`is-${stageStatus[id]}`">
            <span class="dot" />
            <div>
              <strong>{{ t(`${p}.stages.${id}`) }}</strong>
              <small>{{ t(`${p}.stage_status.${stageStatus[id]}`) }}</small>
            </div>
          </li>
        </ol>

        <ul class="log">
          <li v-for="(line, index) in logs" :key="index">{{ line }}</li>
        </ul>

        <div v-if="phase === 'done'" class="envelope">
          <span :class="['code', `is-${outcome}`]">HTTP {{ statusCode }}</span>
          <pre>{{ responseJson }}</pre>
        </div>
      </section>
    </div>
  </SimShell>
</template>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.label {
  margin: 10px 0 6px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #6b7280;

  &:first-child {
    margin-top: 0;
  }
}

.kinds {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip,
.cta {
  cursor: pointer;
}

.chip {
  padding: 6px 10px;
  border: 1px solid #e8e8e8;
  border-radius: 999px;
  background: #fff;
  color: #1b1b1b;
  font-size: 0.74rem;
  font-weight: 600;

  &.is-active {
    border-color: #0f766e;
    background: #ecfdf5;
    color: #0f766e;
  }

  &.is-warn.is-active {
    border-color: #b91c1c;
    background: #fef2f2;
    color: #b91c1c;
  }
}

.http,
.envelope pre {
  margin: 8px 0 0;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: #111827;
  color: #e5e7eb;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 1.45;
  white-space: pre-wrap;
}

.cta {
  margin-top: 14px;
  min-height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: var(--radius-sm);
  background: #0f766e;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
}

.stages {
  margin: 0 0 12px;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}

.stage {
  display: grid;
  grid-template-columns: 10px 1fr;
  gap: 8px;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid #e8e8e8;
  border-radius: var(--radius-sm);
  background: #fff;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e8e8e8;
}

.stage strong {
  display: block;
  font-size: 0.78rem;
}

.stage small {
  font-size: 0.66rem;
  color: #6b7280;
}

.stage.is-active {
  border-color: #0f766e;
}
.stage.is-active .dot,
.stage.is-ok .dot {
  background: #0f766e;
}
.stage.is-ok .dot {
  background: #059669;
}
.stage.is-fail {
  border-color: #b91c1c;
}
.stage.is-fail .dot {
  background: #b91c1c;
}

.log {
  margin: 0 0 12px;
  padding: 0;
  list-style: none;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: #374151;
}

.envelope {
  display: grid;
  gap: 8px;
}

.code {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
}

.code.is-accepted {
  color: #059669;
}
.code.is-unauthorized,
.code.is-forbidden,
.code.is-timeout {
  color: #b91c1c;
}

@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
