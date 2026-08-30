# Mateus Matyak

Portfólio pessoal de **Mateus Matyak**, desenvolvedor full-stack em Curitiba, Paraná. O site apresenta a forma como eu projeto e construo sistemas distribuídos: frontend em Vue.js, BFF em Spring Boot, identidade com Keycloak, mensageria com RabbitMQ e secrets com Vault.

**Site:** [mateusmatyak-git.github.io](https://mateusmatyak-git.github.io/)

**GitHub:** [github.com/MateusMatyak-Git](https://github.com/MateusMatyak-Git)

## O que o portfólio cobre

O site é uma SPA com uma página por assunto, pensada para quem quer entender o trabalho — não só a lista de tecnologias.

| Rota | Conteúdo |
| --- | --- |
| `/` | Apresentação, disponibilidade e um resumo sobre mim |
| `/skills` | Stack agrupada por domínio (frontend, backend, dados, segurança, observabilidade, qualidade, DevOps) |
| `/tech-guide` | Papel de cada ferramenta no desenvolvimento e o impacto para quem usa o sistema |
| `/architecture` | Dois diagramas interativos: o fluxo de runtime (SPA → gateway → BFF → RabbitMQ → workers → PostgreSQL) e o fluxo de entrega (Git Flow, Jenkins, Sonar, staging e produção em OCI/OKE) |
| `/projects` | Casos comerciais, públicos e confidenciais, cada um com uma simulação do fluxo real |
| `/experience` | Trajetória profissional e formação |
| `/contact` | E-mail, LinkedIn e GitHub |

Os projetos incluem o site da [Caçador Seguros](https://cacadorseguros.com.br/), uma plataforma orientada a eventos, um console interno de suporte e um PWA operacional com fila offline.

## Stack deste repositório

O portfólio é um produto à parte da stack que ele descreve. Aqui a aplicação é:

- **Vue 3** + **TypeScript** + **Vite**
- **Vue Router** para as rotas acima
- **vue-i18n** para os textos
- **PrimeVue** nos componentes de UI
- **Bootstrap** só no grid e nas utilidades responsivas
- **Sass** no design system (tema claro/escuro, tokens de cor e tipo)

## Idiomas e tema

A interface está em inglês, português (Brasil e Portugal), espanhol, alemão e japonês. O idioma inicial segue o do navegador e pode ser trocado no header; a escolha fica no `localStorage`.

O tema claro/escuro também respeita a preferência do sistema e pode ser alternado manualmente, sem flash no carregamento (`data-theme` é aplicado no `index.html` antes do Vue montar).

## Desenvolvimento local

Requisito: Node.js 22.

```bash
npm install
npm run dev
```

Outros scripts:

| Comando | Função |
| --- | --- |
| `npm run build` | Type-check (`vue-tsc`) e build de produção |
| `npm run preview` | Serve o `dist` localmente |
| `npm run lint` | ESLint com correção automática |
| `npm run format` | Prettier |

## Publicação

O site vai ao ar no GitHub Pages da conta `MateusMatyak-Git`. Para um user site, o repositório precisa se chamar **`MateusMatyak-Git.github.io`**.

Push em `main` dispara o workflow em `.github/workflows/deploy.yml`: `npm ci`, `npm run build` e deploy do `dist`. Em **Settings → Pages**, a origem deve ser **GitHub Actions**.

O `public/404.html` redireciona rotas profundas de volta para a SPA, o que o Pages sozinho não faz.

## Estrutura

```
src/
  components/   seções, layout, simulações dos projetos
  data/         conteúdo estruturado (projetos, skills, experiência, contato)
  i18n/         traduções
  views/        uma view por rota
  styles/       tokens do tema e grid do Bootstrap
```

Textos visíveis ao usuário ficam em `src/i18n/locales/`. Dados que não dependem de idioma (URLs, stack, datas) ficam em `src/data/`.
