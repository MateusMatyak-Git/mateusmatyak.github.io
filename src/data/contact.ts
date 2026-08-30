export const EMAIL = 'mateus.matyak@hotmail.com'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/mateus-matyak-78b097429/'
export const GITHUB_URL = 'https://github.com/MateusMatyak-Git'

export const LINKEDIN_HANDLE = 'linkedin.com/in/mateus-matyak'
export const GITHUB_HANDLE = 'github.com/MateusMatyak-Git'

export const socials = [
  { id: 'github', href: GITHUB_URL, icon: 'pi-github', label: 'GitHub', external: true },
  { id: 'linkedin', href: LINKEDIN_URL, icon: 'pi-linkedin', label: 'LinkedIn', external: true },
  { id: 'email', href: `mailto:${EMAIL}`, icon: 'pi-envelope', label: 'Email', external: false },
] as const

export const channels = [
  {
    key: 'linkedin',
    value: LINKEDIN_HANDLE,
    href: LINKEDIN_URL,
    icon: 'pi pi-linkedin',
    preferred: false,
  },
  {
    key: 'github',
    value: GITHUB_HANDLE,
    href: GITHUB_URL,
    icon: 'pi pi-github',
    preferred: false,
  },
] as const
