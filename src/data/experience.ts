import saastecLogo from '@/assets/img/companies/saastec.png'
import korpLogo from '@/assets/img/companies/korp.png'

export type CompanyId = 'saastec' | 'korp' | 'education'
export type EmploymentType = 'contract' | 'fulltime' | 'internship' | 'education'
export type WorkMode = 'hybrid' | 'remote'

export interface Role {
  id: string
  start: string
  end: string | null
  employmentType: EmploymentType
  skills: string[]
}

export interface TimelineItem {
  id: string
  company: CompanyId
  logo?: string
  start: string
  end: string | null
  workMode?: WorkMode
  current?: boolean
  roles: Role[]
}

export const timeline: TimelineItem[] = [
  {
    id: 'saastec-dev',
    company: 'saastec',
    logo: saastecLogo,
    start: '2025-09',
    end: null,
    workMode: 'hybrid',
    current: true,
    roles: [
      {
        id: 'fullstack',
        start: '2025-09',
        end: null,
        employmentType: 'contract',
        skills: [
          'vue',
          'spring',
          'rabbitmq',
          'keycloak',
          'vault',
          'postgres',
          'prometheus',
          'grafana',
          'git',
          'jenkins',
        ],
      },
    ],
  },
  {
    id: 'korp',
    company: 'korp',
    logo: korpLogo,
    start: '2025-03',
    end: '2025-09',
    workMode: 'remote',
    roles: [
      {
        id: 'korpSenior',
        start: '2025-03',
        end: '2025-09',
        employmentType: 'fulltime',
        skills: ['data', 'systems', 'customer', 'incidents', 'chat', 'phone'],
      },
    ],
  },
  {
    id: 'saastec-support',
    company: 'saastec',
    logo: saastecLogo,
    start: '2022-03',
    end: '2025-03',
    workMode: 'hybrid',
    roles: [
      {
        id: 'saastecSenior',
        start: '2023-06',
        end: '2025-03',
        employmentType: 'fulltime',
        skills: ['data', 'systems', 'customer', 'dev'],
      },
      {
        id: 'saastecJunior',
        start: '2022-03',
        end: '2023-06',
        employmentType: 'internship',
        skills: ['data', 'systems', 'customer', 'dev', 'internal'],
      },
    ],
  },
  {
    id: 'education',
    company: 'education',
    start: '2021-04',
    end: '2023-06',
    roles: [
      {
        id: 'degree',
        start: '2021-04',
        end: '2023-06',
        employmentType: 'education',
        skills: [],
      },
    ],
  },
]

export function monthsInclusive(start: string, end: string | null, now = new Date()): number {
  const [startYear, startMonth] = start.split('-').map(Number)
  const endYear = end ? Number(end.slice(0, 4)) : now.getFullYear()
  const endMonth = end ? Number(end.slice(5, 7)) : now.getMonth() + 1
  return (endYear - startYear) * 12 + (endMonth - startMonth) + 1
}
