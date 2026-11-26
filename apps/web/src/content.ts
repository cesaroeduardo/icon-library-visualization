export const GITHUB_URL = 'https://github.com/cesaroeduardo/icon-library-visualization'
export const CLONE_CMD = 'git clone https://github.com/cesaroeduardo/icon-library-visualization.git'
export const STUDIO_URL = '/studio/'

export const AGENT_PROMPT = {
  pt: `Clone o repositório https://github.com/cesaroeduardo/icon-library-visualization e instale as skills de ícones no meu agente com \`npx skills add cesaroeduardo/icon-library-visualization\` (create-icons + catalog-icons). Depois use a skill create-icons para analisar o design system do meu projeto (tokens, fontes e ícones atuais), gerar um set de ícones SVG originais 24×24 no mesmo estilo e criar o catalog.json com a skill catalog-icons. No final, me entregue os SVGs + catalog.json em uma pasta (ou .zip) para eu importar em https://icons.cesaroeduardo.com/studio/#create-own.`,
  en: `Clone the repository https://github.com/cesaroeduardo/icon-library-visualization and install the icon skills into my agent with \`npx skills add cesaroeduardo/icon-library-visualization\` (create-icons + catalog-icons). Then use the create-icons skill to analyze my project's design system (tokens, fonts and current icons), generate a set of original 24×24 SVG icons in the same style, and build catalog.json with the catalog-icons skill. Finally, give me the SVGs + catalog.json in a folder (or .zip) so I can import them at https://icons.cesaroeduardo.com/studio/#create-own.`
}

export type Lang = 'pt' | 'en'

export const copy = {
  pt: {
    announcement: '100% Open Source · Licença MIT — Suba webfonts, compile SVGs ou gere ícones com IA',
    announcementCta: 'Ver no GitHub',
    nav: {
      explorer: 'Explorer',
      features: 'Recursos',
      workflow: 'Fluxo',
      faq: 'FAQ',
      docs: 'Docs',
      studio: 'Abrir Studio',
      github: 'Ver no GitHub'
    },
    hero: {
      pill: 'Open Source · Licença MIT',
      titleLine1: 'Sua icon library.',
      titleLine2: 'Pronta direto no navegador.',
      subtitle:
        'Inspecione webfonts existentes, valide e compile SVGs em WOFF/TTF + CSS, ou crie um conjunto original de ícones com uma skill de IA — tudo estático, sem servidor.',
      ctaPrimary: 'Ver no GitHub',
      ctaSecondary: 'Abrir Studio',
      checks: ['100% Open Source (MIT)', 'Zero backend · Privado', 'Webfont + SVG + Skill de IA'],
      quickTitle: 'Comece agora',
      quickMeta: 'Open Source · MIT',
      copy: 'Copiar',
      copied: 'Copiado!',
      quickLinks: [
        { label: 'Abrir Icon Library', href: '/studio/' },
        { label: 'Subir Webfont', href: '/studio/#webfont' },
        { label: 'Compilar SVGs', href: '/studio/#svg' },
        { label: 'Skill: create-icons', href: `${GITHUB_URL}/tree/main/skills/create-icons`, external: true },
        { label: 'Skill: catalog-icons', href: `${GITHUB_URL}/tree/main/skills/catalog-icons`, external: true },
        { label: 'Ler Documentação', href: '#docs', docs: true }
      ]
    },
    explorer: {
      heading1: 'Três fluxos.',
      heading2: 'Um único estúdio.',
      desc: 'Teste a busca instantânea com a webfont de demonstração (332 ícones). Clique em qualquer ícone para copiar o HTML ou abra o Studio completo para subir seus próprios arquivos.',
      searchPlaceholder: 'Buscar em {count} ícones da demo...',
      openFull: 'Abrir no Studio',
      copiedToast: 'Copiado: {snippet}',
      showing: '{from}–{to} de {total} ícones',
      prev: 'Anterior',
      next: 'Próxima',
      empty: 'Nenhum ícone encontrado para essa busca.'
    },
    pillars: {
      heading1: 'Tudo o que um',
      heading2: 'design system precisa.',
      subtitle:
        'Organizado em monorepo para separar site, estúdio, engine de compilação e skill de criação de ícones.',
      items: [
        {
          id: 'webfont',
          tag: 'WOFF2 · WOFF · TTF · OTF · ZIP',
          title: 'Webfont Inspector',
          desc: 'Suba uma fonte pronta com ou sem CSS. O motor lê os glifos, extrai os caminhos vetoriais, preserva classes CSS e keywords do catalog.json e exporta em SVG ou PNG.',
          cta: 'Subir Webfont',
          href: '/studio/#webfont'
        },
        {
          id: 'svg',
          tag: 'VALIDAÇÃO + COMPILAÇÃO',
          title: 'SVG → Webfont Compiler',
          desc: 'Arraste múltiplos SVGs ou um .zip. Valide viewBox, strokes e clipPaths, separe ícones multicoloridos inline e baixe o pacote completo (.woff, .ttf, .css, catalog.json e svg/).',
          cta: 'Compilar SVGs',
          href: '/studio/#svg'
        },
        {
          id: 'skill',
          tag: '2 SKILLS · CREATE + CATALOG',
          title: 'Skills de Criação & Catalogação',
          desc: 'Duas skills prontas no repositório: create-icons (desenha SVGs originais em 8 estilos) e catalog-icons (gera e valida catalog.json com nomes, grupos e keywords bilíngues).',
          cta: 'Ver Guia das Skills',
          href: '#docs',
          docs: true
        }
      ]
    },
    highlights: {
      heading1: 'Código aberto.',
      heading2: 'Feito para times modernos.',
      stats: [
        { value: '100%', label: 'Processado no navegador (sem backend)' },
        { value: 'MIT', label: 'Licença livre para uso pessoal e comercial' },
        { value: '8 estilos', label: 'Incluídos na skill de criação de ícones' },
        { value: 'PT + EN', label: 'Interface e documentação completas' }
      ]
    },
    faq: {
      heading: 'Perguntas frequentes',
      items: [
        {
          q: 'O projeto é realmente 100% gratuito e open source?',
          a: 'Sim. Todo o código-fonte (landing page, Studio, engine de compilação e skill de IA) é distribuído sob licença MIT no GitHub. Você pode usar, modificar e hospedar onde quiser — inclusive em projetos comerciais.'
        },
        {
          q: 'Meus arquivos SVG ou webfonts são enviados para algum servidor?',
          a: 'Não. Toda a leitura de fontes, validação de SVGs, geração de .ttf/.woff/.css e empacotamento em .zip acontece localmente na memória do seu navegador.'
        },
        {
          q: 'Quais formatos o sistema aceita no upload?',
          a: 'No modo Webfont: .woff2, .woff, .ttf, .otf, .css, catalog.json e .zip. No modo SVG: múltiplos arquivos .svg, catalog.json/manifest.json e .zip. Ícones multicoloridos são detectados e preservados como SVG inline.'
        },
        {
          q: 'Como uso a fonte gerada no Figma e no meu site?',
          a: 'O pacote .zip exportado inclui .ttf (para instalar no Windows/macOS e usar no Figma ou em apps mobile), .woff + .css (para sites) e a pasta svg/ (para importar como Components no Figma). Veja o guia completo na página de Docs.'
        },
        {
          q: 'Como funciona a arquitetura em monorepo?',
          a: 'O repositório separa apps/web (site + documentação em React 19 + Tailwind v4 + TUFFUI), apps/studio (o app focado apenas na Icon Library em Vue 3), packages/core (motor compartilhado de fontes e SVGs) e skills/ (create-icons e catalog-icons).'
        }
      ]
    },
    footer: {
      ctaLine1: 'Cada ícone,',
      ctaLine2: 'sob o seu controle.',
      ctaBtn: 'Contribuir no GitHub',
      brandDesc:
        'Ferramenta open source para inspecionar webfonts, compilar SVGs em icon fonts e gerar ícones originais com agentes de IA.',
      colProject: 'Projeto',
      colStudio: 'Studio',
      colResources: 'Recursos',
      bottomLeft: 'Icon Library Studio · Open Source sob licença MIT'
    }
  },
  en: {
    announcement: '100% Open Source · MIT License — Inspect webfonts, compile SVGs, or generate icons with AI',
    announcementCta: 'View on GitHub',
    nav: {
      explorer: 'Explorer',
      features: 'Features',
      workflow: 'Workflow',
      faq: 'FAQ',
      docs: 'Docs',
      studio: 'Open Studio',
      github: 'View on GitHub'
    },
    hero: {
      pill: 'Open Source · MIT License',
      titleLine1: 'Your icon library.',
      titleLine2: 'Built right in the browser.',
      subtitle:
        'Inspect existing webfonts, validate and compile SVGs into WOFF/TTF + CSS, or generate an original icon set with an AI agent skill — 100% static, zero backend.',
      ctaPrimary: 'View on GitHub',
      ctaSecondary: 'Open Studio',
      checks: ['100% Open Source (MIT)', 'Zero backend · Private', 'Webfont + SVG + AI Skill'],
      quickTitle: 'Quick start',
      quickMeta: 'Open Source · MIT',
      copy: 'Copy',
      copied: 'Copied!',
      quickLinks: [
        { label: 'Open Icon Library', href: '/studio/' },
        { label: 'Upload Webfont', href: '/studio/#webfont' },
        { label: 'Compile SVGs', href: '/studio/#svg' },
        { label: 'Skill: create-icons', href: `${GITHUB_URL}/tree/main/skills/create-icons`, external: true },
        { label: 'Skill: catalog-icons', href: `${GITHUB_URL}/tree/main/skills/catalog-icons`, external: true },
        { label: 'Read Docs', href: '#docs', docs: true }
      ]
    },
    explorer: {
      heading1: 'Three workflows.',
      heading2: 'One focused studio.',
      desc: 'Try instant search across the built-in 332-icon demo webfont. Click any icon to copy its HTML snippet, or launch the full Studio to upload your own files.',
      searchPlaceholder: 'Search {count} demo icons...',
      openFull: 'Open in Studio',
      copiedToast: 'Copied: {snippet}',
      showing: '{from}–{to} of {total} icons',
      prev: 'Prev',
      next: 'Next',
      empty: 'No icons match that query.'
    },
    pillars: {
      heading1: 'Everything a modern',
      heading2: 'design system needs.',
      subtitle:
        'Structured as a clean monorepo separating the website, the interactive studio, the font compiler engine, and the AI icon skill.',
      items: [
        {
          id: 'webfont',
          tag: 'WOFF2 · WOFF · TTF · OTF · ZIP',
          title: 'Webfont Inspector',
          desc: 'Upload any webfont with or without CSS. The engine parses glyphs, extracts vector paths, preserves CSS class names & catalog.json keywords, and exports SVG or PNG.',
          cta: 'Upload Webfont',
          href: '/studio/#webfont'
        },
        {
          id: 'svg',
          tag: 'VALIDATE + COMPILE',
          title: 'SVG → Webfont Compiler',
          desc: 'Drop multiple SVGs or a .zip archive. Validate viewBox, strokes, and clipPaths, keep multicolor icons inline, and download the complete bundle (.woff, .ttf, .css, catalog.json, svg/).',
          cta: 'Compile SVGs',
          href: '/studio/#svg'
        },
        {
          id: 'skill',
          tag: '2 SKILLS · CREATE + CATALOG',
          title: 'Icon Creation & Cataloging Skills',
          desc: 'Two agent skills included in the repo: create-icons (draws original SVGs in 8 styles) and catalog-icons (generates and validates catalog.json with bilingual keywords and groups).',
          cta: 'Read Skills Guide',
          href: '#docs',
          docs: true
        }
      ]
    },
    highlights: {
      heading1: 'Open source.',
      heading2: 'Built for modern teams.',
      stats: [
        { value: '100%', label: 'Client-side in the browser (no server)' },
        { value: 'MIT', label: 'Free for personal and commercial projects' },
        { value: '8 styles', label: 'Starter styles bundled in the AI skill' },
        { value: 'PT + EN', label: 'Full bilingual UI and documentation' }
      ]
    },
    faq: {
      heading: 'Common questions',
      items: [
        {
          q: 'Is this project really 100% free and open source?',
          a: 'Yes. The entire codebase (landing page, Studio app, compilation engine, and AI skill) is released under the MIT license on GitHub. You can use, fork, and self-host it anywhere.'
        },
        {
          q: 'Are my SVG or webfont files uploaded to any server?',
          a: 'Never. Font parsing, SVG validation, .ttf/.woff/.css compilation, and .zip bundling all run locally inside your browser memory.'
        },
        {
          q: 'Which file formats are supported?',
          a: 'Webfont mode accepts .woff2, .woff, .ttf, .otf, .css, catalog.json, and .zip. SVG mode accepts multiple .svg files, catalog.json/manifest.json, and .zip. Multicolor SVGs are automatically preserved inline.'
        },
        {
          q: 'How do I use the generated font in Figma and on websites?',
          a: 'The exported .zip bundle includes .ttf (install on macOS/Windows for Figma or mobile apps), .woff + .css (for web apps), and standalone svg/ files (for Figma Components). Full instructions are in the Docs page.'
        },
        {
          q: 'How is the monorepo organized?',
          a: 'apps/web hosts the site & TUFFUI documentation (React 19 + Tailwind v4), apps/studio hosts the focused Icon Library app (Vue 3), packages/core shares the font/SVG engine, and skills/ holds create-icons and catalog-icons.'
        }
      ]
    },
    footer: {
      ctaLine1: 'Every icon,',
      ctaLine2: 'under your control.',
      ctaBtn: 'Contribute on GitHub',
      brandDesc:
        'Open-source toolkit to inspect webfonts, compile SVGs into icon fonts, and generate original icons with AI coding agents.',
      colProject: 'Project',
      colStudio: 'Studio',
      colResources: 'Resources',
      bottomLeft: 'Icon Library Studio · Open Source under MIT License'
    }
  }
} as const
