import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const SITE_ORIGIN = 'https://mateusmatyak-git.github.io'
const projectRoot = fileURLToPath(new URL('.', import.meta.url))
const distDir = path.join(projectRoot, 'dist')

function pagesBase(): string {
  const repo = process.env.GITHUB_REPOSITORY
  if (!repo) return '/'
  const [owner, name] = repo.split('/')
  if (!owner || !name) return '/'
  if (name.toLowerCase() === `${owner}.github.io`.toLowerCase()) return '/'
  return `/${name}/`
}

const base = pagesBase()

function githubPagesPlugin(basePath: string): Plugin {
  const segmentCount = basePath === '/' ? 0 : basePath.replace(/^\/|\/$/g, '').split('/').filter(Boolean).length

  return {
    name: 'github-pages',
    transformIndexHtml(html) {
      if (basePath === '/') return html
      return html.replaceAll(`${SITE_ORIGIN}/`, `${SITE_ORIGIN}${basePath}`)
    },
    closeBundle() {
      const file = path.join(distDir, '404.html')
      if (!fs.existsSync(file)) return
      const html = fs.readFileSync(file, 'utf8')
      fs.writeFileSync(
        file,
        html.replace(/var segmentCount = \d+/, `var segmentCount = ${segmentCount}`),
      )
    },
  }
}

export default defineConfig({
  root: path.join(projectRoot, 'src'),
  publicDir: path.join(projectRoot, 'public'),
  envDir: projectRoot,
  base,
  plugins: [vue(), githubPagesPlugin(base)],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: distDir,
    emptyOutDir: true,
  },
})
