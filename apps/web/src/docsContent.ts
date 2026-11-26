import type { Lang } from './content'

export interface DocSubsection {
  title: string
  body: string
  bullets?: string[]
  code?: string
  codeLang?: string
}

export interface DocSection {
  id: string
  nav: string
  group: string
  title: string
  lead: string
  paragraphs?: string[]
  callout?: { type: 'tip' | 'info'; title: string; body: string }
  bullets?: string[]
  table?: { headers: string[]; rows: string[][] }
  codeTitle?: string
  codeLang?: string
  code?: string
  extraTitle?: string
  extraBody?: string
  extraCode?: string
  extraLang?: string
  showSkillStyles?: boolean
  subsections?: DocSubsection[]
}

export interface DocsLocale {
  badge: string
  title: string
  subtitle: string
  backSite: string
  openStudio: string
  tryDemo: string
  copy: string
  copied: string
  groups: { gettingStarted: string; guides: string; reference: string }
  sections: DocSection[]
}

export const docsContent: Record<Lang, DocsLocale> = {
  pt: {
    badge: 'Documentação',
    title: 'Guia Completo de Icon Libraries',
    subtitle:
      'Tudo o que você precisa para montar, validar, compilar e distribuir bibliotecas de ícones profissionais na web, no Figma e em apps mobile.',
    backSite: 'Voltar ao site',
    openStudio: 'Abrir Studio',
    tryDemo: 'Ver Demo',
    copy: 'Copiar',
    copied: 'Copiado',
    groups: {
      gettingStarted: 'Primeiros passos',
      guides: 'Guias práticos',
      reference: 'Referência & Padrões'
    },
    sections: [
      {
        id: 'overview',
        group: 'gettingStarted',
        nav: 'Para que serve',
        title: 'Para que serve uma Icon Library?',
        lead: 'Uma Icon Library centraliza todos os ícones de um produto ou design system em um único catálogo pesquisável, padronizado e pronto para designers e desenvolvedores.',
        paragraphs: [
          'Sem uma biblioteca centralizada, equipes duplicam SVGs espalhados pelo código, misturam espessuras de traço diferentes e perdem tempo no handoff procurando qual ícone usar em cada tela.',
          'O Icon Library Studio resolve esse fluxo 100% no navegador — sem servidor ou pipeline complexo. Você pode inspecionar webfonts existentes, compilar seus próprios SVGs em webfont + CSS + catalog.json, ou gerar um conjunto original com a skill de IA.'
        ],
        callout: {
          type: 'tip',
          title: '100% estático e privado',
          body: 'Todos os arquivos enviados (fontes, SVGs, CSS, JSON e ZIPs) são processados localmente na memória do seu navegador. Nenhum ativo da sua marca sai da sua máquina.'
        },
        bullets: [
          'Fonte única da verdade compartilhada entre Design e Engenharia.',
          'Busca instantânea por nome do ícone, código Unicode ou palavras-chave (keywords).',
          'Preview em tempo real de tamanho (8px a 320px), cor e contraste em temas Claro e Escuro.',
          'Exportação rápida em HTML, SVG, PNG ou pacote completo (.zip) pronto para produção.'
        ]
      },
      {
        id: 'how-to-use',
        group: 'gettingStarted',
        nav: 'Como usar cada função',
        title: 'Como usar cada função do sistema',
        lead: 'O Studio público oferece upload de webfont/SVG e skills de IA. Para publicar só a galeria da empresa, use também o self-host em apps/selfhost.',
        subsections: [
          {
            title: 'Subir Webfont',
            body: 'Ideal quando você já possui uma icon font pronta e quer visualizá-la, buscar glifos ou extrair SVGs/PNGs.',
            bullets: [
              'Arraste arquivos .ttf, .otf, .woff ou .woff2 — opcionalmente junto com .css e/ou catalog.json, ou envie um .zip.',
              'Com .css junto, o sistema preserva exatamente os nomes das classes e o prefixo original.',
              'Sem .css (.ttf, .otf ou .woff), os nomes dos glifos e os vetores são lidos direto das tabelas internas da fonte.'
            ]
          },
          {
            title: 'Subir SVGs e gerar Webfont',
            body: 'Transforma uma pasta de arquivos .svg (ou .zip) em uma webfont pronta para produção diretamente no navegador.',
            bullets: [
              'Validação automática de cada SVG com relatório de erros, avisos e recomendações antes de compilar.',
              'Normalização opcional dos nomes para kebab-case (ex.: "Arrow Right.svg" → "arrow-right").',
              'Detecção automática de ícones multicoloridos: monocromáticos viram glifos na webfont; multicoloridos/gradientes ficam como SVG inline.',
              'Se houver catalog.json ou manifest.json junto, as keywords e rótulos alimentam a busca automaticamente.',
              'Clique em "Baixar Pacote (.zip)" na galeria para obter .woff, .ttf, .css, catalog.json, svg/ e README.md.'
            ]
          },
          {
            title: 'Skills de IA: Criação (create-icons) & Catalogação (catalog-icons)',
            body: 'O repositório traz duas skills prontas na pasta skills/ para usar em Antigravity, Claude Code ou Cursor:',
            bullets: [
              'skills/create-icons (create-icons.zip): escaneia seus tokens CSS/Tailwind, propõe um style sheet (icon-style.json), valida uma amostra em 8 estilos e gera SVGs originais + catalog.json.',
              'skills/catalog-icons (catalog-icons.zip): escaneia qualquer pasta de SVGs ou .css de webfont, enriquece com nomes legíveis, grupos e keywords bilíngues (PT/EN), mescla com catálogos existentes (--merge) e valida o schema (--validate).',
              'Arraste os SVGs + catalog.json gerados direto para a Icon Library para buscar, visualizar e compilar em webfont.'
            ]
          },
          {
            title: 'Self-host só da sua library (apps/selfhost)',
            body: 'Quando você quer publicar a galeria da empresa — sem demos Phosphor/Lucide e sem a landing — use o pacote apps/selfhost: pasta icons/ como fonte da verdade, logo própria e build estático.',
            bullets: [
              'Coloque os SVGs em icons/ (catalog.json é opcional e melhora a busca com labels e keywords).',
              'Configure title, fontName, prefix e logo em selfhost.config.json.',
              'Rode pnpm --filter @icon-library/selfhost build e publique apps/selfhost/dist/.',
              'Upload no browser continua disponível só como sandbox local — o deploy sempre reflete a pasta icons/.'
            ]
          }
        ]
      },
      {
        id: 'selfhost',
        group: 'gettingStarted',
        nav: 'Self-host da sua library',
        title: 'Self-host facilitado: só a sua Icon Library',
        lead: 'apps/selfhost é um app estático separado do Studio público. A galeria abre apenas a biblioteca gerada a partir da pasta icons/ — sem demos de terceiros e sem landing page.',
        paragraphs: [
          'Use este fluxo quando a Icon Library for um produto interno (design system da empresa): a pasta de SVGs é a fonte da verdade, o build gera webfont + CSS + manifest, e você sobe o dist/ em qualquer host estático.',
          'O catalog.json dentro de icons/ é opcional. Sem ele a busca usa o nome do arquivo; com ele labels, grupos e keywords bilíngues enriquecem a galeria.'
        ],
        callout: {
          type: 'tip',
          title: 'Não misture com o monorepo do seu app',
          body: 'Trate apps/selfhost como um deploy separado (ou copie só essa pasta). Seu produto consome o .css/.woff gerados — não precisa embutir landing, demos ou skills no repositório da aplicação.'
        },
        bullets: [
          'Fonte da verdade: icons/*.svg (+ catalog.json opcional).',
          'Branding: brand/logo.svg + title em selfhost.config.json.',
          'Build: gera public/library/ (woff2, woff, ttf, css, catalog, manifest, svg/).',
          'Alimentar depois: adicione SVGs na pasta → rebuild → redeploy.',
          'Sandbox de upload no browser não altera icons/ e não entra no deploy.'
        ],
        codeTitle: 'Build e deploy',
        codeLang: 'bash',
        code: `# Na raiz do monorepo
pnpm install
pnpm --filter @icon-library/selfhost build

# Dev local → http://127.0.0.1:5175
pnpm --filter @icon-library/selfhost dev

# Publique apps/selfhost/dist/ (Cloudflare Pages, Vercel, Netlify, nginx)`,
        subsections: [
          {
            title: 'selfhost.config.json',
            body: 'Campos principais: title (nome na UI), fontName e prefix (CSS da webfont), base (path do deploy, ex. "/" ou "/icons/"), logo (caminho relativo, padrão brand/logo.svg) e allowUpload (true = botão de experimentar upload no browser).'
          },
          {
            title: 'Fluxo recomendado com as skills',
            body: 'Gere ou cataloge ícones com create-icons / catalog-icons, copie os SVGs (+ catalog.json) para apps/selfhost/icons/, rode o build e publique. A galeria self-host vira a vitrine permanente do set; o Studio público continua útil para experimentos pontuais.'
          }
        ]
      },
      {
        id: 'ai-skills',
        group: 'guides',
        nav: 'Skills de IA & 8 Estilos',
        title: 'Skills de IA: Criação & Catalogação',
        lead: 'Instale as duas skills oficiais direto do repositório GitHub em qualquer agente compatível com SKILL.md (Antigravity, Claude Code, Cursor, Codex).',
        codeTitle: 'Instalar via CLI',
        codeLang: 'bash',
        code: `# Instalar ambas as skills (create-icons + catalog-icons)
npx skills add cesaroeduardo/icon-library-visualization

# Ou instalar individualmente:
npx skills add cesaroeduardo/icon-library-visualization --skill create-icons
npx skills add cesaroeduardo/icon-library-visualization --skill catalog-icons`,
        subsections: [
          {
            title: 'Prompt pronto para o seu agente',
            body: 'Copie e cole no Antigravity, Claude Code, Cursor ou Codex: «Clone o repositório https://github.com/cesaroeduardo/icon-library-visualization e instale as skills de ícones no meu agente com `npx skills add cesaroeduardo/icon-library-visualization` (create-icons + catalog-icons). Depois use a skill create-icons para analisar o design system do meu projeto (tokens, fontes e ícones atuais), gerar um set de ícones SVG originais 24×24 no mesmo estilo e criar o catalog.json com a skill catalog-icons. No final, me entregue os SVGs + catalog.json em uma pasta (ou .zip) para eu importar em https://icons.cesaroeduardo.com/studio/#create-own.»'
          },
          {
            title: 'skills/create-icons — Geração de ícones originais',
            body: 'Inspirada na skill generate-icons de @banhosdev (github.com/sergiobanhos/generate-icons). Lê os tokens CSS/Tailwind, fontes e ícones atuais do seu projeto, gera um style sheet explícito (icon-style.json), prova o estilo em uma amostra de 6–8 ícones e depois desenha o set completo + catalog.json validado.'
          },
          {
            title: 'skills/catalog-icons — Catalogação e keywords bilíngues',
            body: 'Escaneia qualquer pasta de SVGs ou .css de webfont, gera catalog.json com nomes legíveis, categorias e sinônimos bilíngues (PT/EN), suporta --merge para preservar edições manuais e --validate para checar o schema.'
          }
        ],
        showSkillStyles: true
      },
      {
        id: 'svg-spec',
        group: 'guides',
        nav: 'Padrão de SVGs aceitos',
        title: 'Como o sistema aceita ícones SVG',
        lead: 'Webfonts são baseadas em contornos preenchidos (glyph outlines). Seguir um padrão limpo garante renderização nítida em qualquer tamanho.',
        table: {
          headers: ['Critério', 'Recomendado', 'O que acontece se divergir'],
          rows: [
            ['viewBox', 'Quadrado, preferencialmente 0 0 24 24', 'ViewBox não quadrado gera aviso e pode desalinhar o ícone na linha de texto.'],
            ['Construção', 'Formas preenchidas (<path> com fill)', 'Traços (stroke) geram aviso: aplique "Outline Stroke" no Figma/Illustrator antes de exportar.'],
            ['Cor (monocromático)', 'fill="currentColor" (ou sem cor fixa)', 'fill="#000" gera aviso; cores diferentes de preto/branco classificam o ícone como colorido (inline).'],
            ['Recortes e máscaras', 'Sem <clipPath>, <mask> ou <text>', 'Elementos de recorte e texto não são suportados dentro de glifos TrueType/WOFF.'],
            ['Nome do arquivo', 'kebab-case sem espaços (ex: arrow-left.svg)', 'Espaços e caracteres especiais são normalizados automaticamente quando a opção está ativa.']
          ]
        },
        codeTitle: 'arrow-home.svg',
        codeLang: 'svg',
        code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path fill="currentColor" d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
</svg>`,
        extraTitle: 'Enriquecendo a busca com catalog.json',
        extraBody:
          'Envie um arquivo catalog.json junto com seus SVGs ou Webfont para associar sinônimos e categorias a cada ícone. A skill create-icons gera este arquivo automaticamente:',
        extraLang: 'json',
        extraCode: `[
  {
    "name": "arrow-left",
    "icon": "ic arrow-left",
    "label": "Voltar",
    "group": "navigation",
    "keywords": "back previous return voltar seta esquerda"
  }
]`
      },
      {
        id: 'woff2',
        group: 'guides',
        nav: 'Por que usar WOFF2?',
        title: 'Qual a vantagem de usar WOFF2 nos sites?',
        lead: 'WOFF2 (Web Open Font Format 2.0) é o padrão moderno recomendado pela W3C para distribuição de fontes e icon fonts na web.',
        table: {
          headers: ['Formato', 'Compressão', 'Suporte', 'Quando usar'],
          rows: [
            ['WOFF2', 'Brotli (~30% menor que WOFF, até 60% menor que TTF)', '> 98% (navegadores modernos)', 'Padrão obrigatório para produção na web.'],
            ['WOFF', 'Zlib / Deflate', '> 99% (inclui legados)', 'Fallback leve para ambientes antigos.'],
            ['TTF / OTF', 'Sem compressão web', 'Desktop, Mobile e Web', 'Instalação no OS (Figma, Sketch, iOS/Android).']
          ]
        },
        bullets: [
          'Payload mínimo: uma biblioteca com 300+ ícones em WOFF2 pesa entre 20 KB e 65 KB.',
          'Uma única requisição HTTP: o navegador baixa e faz cache imutável de 1 único arquivo.',
          'Estilização nativa via CSS: font-size, color, hover, transições e alinhamento funcionam como texto.',
          'DOM mais leve: renderizar 500 ícones em tabelas usa simples tags <i class="ic ..."></i>.'
        ],
        callout: {
          type: 'info',
          title: 'WOFF2 vs. SVG Inline — quando escolher cada um?',
          body: 'Use WOFF2 para bibliotecas grandes (100+ ícones), ícones monocromáticos de UI e múltiplos projetos consumindo via CSS. Prefira SVG Inline/Sprite para ícones multicoloridos (duotone/gradientes), animações por camada ou sets pequenos (5–15 ícones).'
        },
        codeTitle: 'fonts.css',
        codeLang: 'css',
        code: `/* 1. Pré-carregue no <head> do HTML:
 * <link rel="preload" href="/fonts/my-icons.woff2" as="font" type="font/woff2" crossorigin />
 */
@font-face {
  font-family: 'my-icons';
  src: url('./my-icons.woff2') format('woff2'),
       url('./my-icons.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}`
      },
      {
        id: 'figma-and-more',
        group: 'guides',
        nav: 'Figma e outros locais',
        title: 'Como usar a fonte gerada no Figma e em outros locais',
        lead: 'O pacote .zip gerado pelo Studio traz .ttf, .woff, .css e arquivos .svg individuais para uso em qualquer ferramenta.',
        subsections: [
          {
            title: 'No Figma',
            body: 'Existem duas formas de usar sua biblioteca no Figma:',
            bullets: [
              'Como Webfont (prototipagem rápida): instale o .ttf do pacote .zip no Windows ou macOS, reinicie o Figma Desktop (ou ative o Figma Font Service no browser), selecione a fonte em uma camada de texto e cole o glifo.',
              'Como Componentes SVG (recomendado para Design Systems): importe a pasta svg/ para uma página "Icons" no Figma, transforme cada SVG em Component com constraints Scale e use instâncias com variáveis de cor.'
            ]
          },
          {
            title: 'Na Web (HTML, React, Vue, Tailwind)',
            body: 'Importe o .css gerado e use as classes diretamente:',
            codeLang: 'tsx',
            code: `import './assets/icons/custom-icons.css'

export function SaveButton() {
  return (
    <button className="inline-flex items-center gap-2">
      <i className="ic check" aria-hidden="true" />
      <span>Salvar</span>
    </button>
  )
}`
          },
          {
            title: 'Mobile (Flutter, React Native, iOS, Android) e Decks',
            body: 'Use o arquivo .ttf em apps nativos e os exports SVG/PNG da galeria em apresentações:',
            bullets: [
              'Flutter: adicione o .ttf em assets/fonts/, registre em pubspec.yaml e use IconData(0xe900, fontFamily: "custom-icons").',
              'React Native: coloque o .ttf em assets/fonts/ e execute npx react-native-asset.',
              'Slides / Keynote / Canva: escolha cor e tamanho na galeria do Studio e baixe em PNG ou SVG.'
            ]
          }
        ]
      },
      {
        id: 'best-practices',
        group: 'reference',
        nav: 'Boas práticas gerais',
        title: 'Boas práticas de Icon Libraries',
        lead: 'Acessibilidade, nomenclatura consistente e geometria óptica garantem que sua biblioteca escale sem dor de cabeça.',
        subsections: [
          {
            title: 'Acessibilidade (A11y)',
            body: 'Sempre oculte ícones decorativos de leitores de tela e dê aria-label a botões que contêm apenas ícone:',
            codeLang: 'html',
            code: `<!-- Decorativo (há texto visível ao lado) -->
<button>
  <i class="ic download" aria-hidden="true"></i>
  Baixar relatório
</button>

<!-- Botão apenas com ícone -->
<button aria-label="Fechar modal">
  <i class="ic x" aria-hidden="true"></i>
</button>`
          },
          {
            title: 'Nomenclatura, Geometria e Versionamento',
            body: 'Regras simples que evitam retrabalho no longo prazo:',
            bullets: [
              'Use kebab-case em inglês (arrow-right, user-plus, check-circle) e coloque sinônimos em português nas keywords do catalog.json.',
              'Nomeie pela metáfora visual (trash, bell) e não pelo uso específico (delete-invoice).',
              'Respeite a live area: em grid 24×24, mantenha a arte principal dentro de 20×20 e teste sempre em 16px.',
              'Use SemVer: novos ícones = minor (1.1.0), ajuste de path = patch (1.1.1), renomear/remover = major (2.0.0).'
            ]
          }
        ]
      }
    ]
  },
  en: {
    badge: 'Documentation',
    title: 'Complete Guide to Icon Libraries',
    subtitle:
      'Everything you need to build, validate, compile, and ship production-ready icon libraries across the web, Figma, and mobile apps.',
    backSite: 'Back to home',
    openStudio: 'Open Studio',
    tryDemo: 'Live Demo',
    copy: 'Copy',
    copied: 'Copied',
    groups: {
      gettingStarted: 'Getting Started',
      guides: 'Guides',
      reference: 'Reference & Standards'
    },
    sections: [
      {
        id: 'overview',
        group: 'gettingStarted',
        nav: 'What it is for',
        title: 'What is an Icon Library for?',
        lead: 'An Icon Library centralizes every icon in your product or design system into a single searchable, consistent catalog ready for both designers and engineers.',
        paragraphs: [
          'Without a centralized library, teams duplicate raw SVGs across repositories, mix stroke weights, and waste time during handoff hunting for the right icon.',
          'Icon Library Studio solves this workflow 100% in the browser — no backend or complex pipeline required. Inspect existing webfonts, compile SVGs into a webfont + CSS + catalog.json, or generate an original set with the AI skill.'
        ],
        callout: {
          type: 'tip',
          title: '100% static & private',
          body: 'All uploaded files (fonts, SVGs, CSS, JSON, and ZIP archives) are processed locally in browser memory. None of your brand assets ever leave your machine.'
        },
        bullets: [
          'Single source of truth shared between Design and Engineering.',
          'Instant search by icon name, Unicode codepoint, or rich keywords.',
          'Live preview of sizes (8px to 320px), colors, and Light/Dark contrast.',
          'One-click export as HTML snippets, SVG, PNG, or a complete production .zip bundle.'
        ]
      },
      {
        id: 'how-to-use',
        group: 'gettingStarted',
        nav: 'How to use each feature',
        title: 'How to use each feature',
        lead: 'The public Studio covers webfont/SVG upload and AI skills. To publish only your company gallery, also use self-host via apps/selfhost.',
        subsections: [
          {
            title: 'Upload Webfont',
            body: 'Best when you already have a compiled icon font and want to browse, search, or extract SVGs/PNGs.',
            bullets: [
              'Drop .ttf, .otf, .woff, or .woff2 — optionally paired with .css and/or catalog.json, or upload a .zip.',
              'With .css included, exact class names and the original prefix are preserved.',
              'Without .css (.ttf, .otf, or .woff), glyph names and vector outlines are extracted directly from the font tables.'
            ]
          },
          {
            title: 'Upload SVGs & Build Webfont',
            body: 'Compiles a folder of .svg files (or a .zip) into a production webfont directly in your browser.',
            bullets: [
              'Automatic SVG validation with a clear report of errors, warnings, and info before building.',
              'Optional filename normalization to kebab-case (e.g., "Arrow Right.svg" → "arrow-right").',
              'Automatic multicolor detection: monochrome icons become font glyphs; multicolor/gradient icons render inline.',
              'If catalog.json or manifest.json is included, labels and keywords automatically power gallery search.',
              'Click "Download Bundle (.zip)" in the gallery to export .woff, .ttf, .css, catalog.json, svg/, and README.md.'
            ]
          },
          {
            title: 'AI Skills: Creation (create-icons) & Cataloging (catalog-icons)',
            body: 'The repository ships two ready-to-use agent skills inside skills/ for Antigravity, Claude Code, or Cursor:',
            bullets: [
              'skills/create-icons (create-icons.zip): scans your CSS/Tailwind tokens, writes icon-style.json, proves a sample across 8 styles, and generates original SVGs + catalog.json.',
              'skills/catalog-icons (catalog-icons.zip): scans any SVG folder or webfont .css, enriches entries with labels, groups, and bilingual keywords, merges with existing catalogs (--merge), and validates the schema (--validate).',
              'Drop the generated SVGs + catalog.json into the Icon Library app to browse, search, and compile into a webfont.'
            ]
          },
          {
            title: 'Self-host only your library (apps/selfhost)',
            body: 'When you want to publish your company gallery — without Phosphor/Lucide demos and without the landing page — use apps/selfhost: icons/ as the source of truth, your logo, and a static build.',
            bullets: [
              'Put SVGs in icons/ (catalog.json is optional and improves search with labels and keywords).',
              'Configure title, fontName, prefix, and logo in selfhost.config.json.',
              'Run pnpm --filter @icon-library/selfhost build and publish apps/selfhost/dist/.',
              'Browser upload remains available only as a local sandbox — the deploy always mirrors the icons/ folder.'
            ]
          }
        ]
      },
      {
        id: 'selfhost',
        group: 'gettingStarted',
        nav: 'Self-host your library',
        title: 'Facilitated self-host: only your Icon Library',
        lead: 'apps/selfhost is a separate static app from the public Studio. The gallery opens only the library built from icons/ — no third-party demos and no landing page.',
        paragraphs: [
          'Use this flow when the Icon Library is an internal product (your company design system): the SVG folder is the source of truth, the build emits webfont + CSS + manifest, and you ship dist/ to any static host.',
          'catalog.json inside icons/ is optional. Without it, search uses the filename; with it, labels, groups, and bilingual keywords enrich the gallery.'
        ],
        callout: {
          type: 'tip',
          title: 'Do not mix this into your app monorepo',
          body: 'Treat apps/selfhost as a separate deploy (or copy only that folder). Your product consumes the generated .css/.woff — you do not need the landing page, demos, or skills inside the application repository.'
        },
        bullets: [
          'Source of truth: icons/*.svg (+ optional catalog.json).',
          'Branding: brand/logo.svg + title in selfhost.config.json.',
          'Build: writes public/library/ (woff2, woff, ttf, css, catalog, manifest, svg/).',
          'Feed it later: add SVGs to the folder → rebuild → redeploy.',
          'Browser upload sandbox does not change icons/ and is not part of the deploy.'
        ],
        codeTitle: 'Build & deploy',
        codeLang: 'bash',
        code: `# From the monorepo root
pnpm install
pnpm --filter @icon-library/selfhost build

# Local dev → http://127.0.0.1:5175
pnpm --filter @icon-library/selfhost dev

# Publish apps/selfhost/dist/ (Cloudflare Pages, Vercel, Netlify, nginx)`,
        subsections: [
          {
            title: 'selfhost.config.json',
            body: 'Main fields: title (UI name), fontName and prefix (webfont CSS), base (deploy path, e.g. "/" or "/icons/"), logo (relative path, default brand/logo.svg), and allowUpload (true = show the try-upload button in the browser).'
          },
          {
            title: 'Recommended flow with the skills',
            body: 'Generate or catalog icons with create-icons / catalog-icons, copy the SVGs (+ catalog.json) into apps/selfhost/icons/, run the build, and publish. The self-host gallery becomes the permanent showcase; the public Studio stays useful for one-off experiments.'
          }
        ]
      },
      {
        id: 'ai-skills',
        group: 'guides',
        nav: 'AI Skills & 8 Styles',
        title: 'AI Skills: Creation & Cataloging',
        lead: 'Install both official skills straight from our GitHub repository into any SKILL.md-compatible agent (Antigravity, Claude Code, Cursor, Codex).',
        codeTitle: 'Install via CLI',
        codeLang: 'bash',
        code: `# Install both skills (create-icons + catalog-icons)
npx skills add cesaroeduardo/icon-library-visualization

# Or install individually:
npx skills add cesaroeduardo/icon-library-visualization --skill create-icons
npx skills add cesaroeduardo/icon-library-visualization --skill catalog-icons`,
        subsections: [
          {
            title: 'Ready-to-use prompt for your agent',
            body: 'Copy and paste into Antigravity, Claude Code, Cursor or Codex: “Clone the repository https://github.com/cesaroeduardo/icon-library-visualization and install the icon skills into my agent with `npx skills add cesaroeduardo/icon-library-visualization` (create-icons + catalog-icons). Then use the create-icons skill to analyze my project\'s design system (tokens, fonts and current icons), generate a set of original 24×24 SVG icons in the same style, and build catalog.json with the catalog-icons skill. Finally, give me the SVGs + catalog.json in a folder (or .zip) so I can import them at https://icons.cesaroeduardo.com/studio/#create-own.”'
          },
          {
            title: 'skills/create-icons — Original icon generation',
            body: 'Inspired by @banhosdev’s generate-icons skill (github.com/sergiobanhos/generate-icons). Scans your project’s CSS/Tailwind tokens, fonts, and current icons, writes an explicit style sheet (icon-style.json), proves the style on a 6–8 icon sample, and outputs the full set + validated catalog.json.'
          },
          {
            title: 'skills/catalog-icons — Cataloging & bilingual keywords',
            body: 'Scans any SVG folder or webfont .css, produces catalog.json with human labels, groups, and bilingual synonyms, supports --merge to preserve manual curation, and --validate to check the schema.'
          }
        ],
        showSkillStyles: true
      },
      {
        id: 'svg-spec',
        group: 'guides',
        nav: 'Accepted SVG format',
        title: 'How the system accepts SVG icons',
        lead: 'Webfonts are built from filled vector outlines (glyph contours). Clean SVGs guarantee crisp rendering at every size.',
        table: {
          headers: ['Criteria', 'Recommended', 'What happens otherwise'],
          rows: [
            ['viewBox', 'Square, ideally 0 0 24 24', 'Non-square viewBoxes trigger a warning and may misalign with text.'],
            ['Construction', 'Filled shapes (<path> with fill)', 'Stroke-based paths trigger a warning: run "Outline Stroke" in Figma/Illustrator before exporting.'],
            ['Color (monochrome)', 'fill="currentColor" (or no hardcoded color)', 'fill="#000" triggers a warning; non-black/white colors classify the icon as colored (inline).'],
            ['Clipping & masks', 'No <clipPath>, <mask>, or <text>', 'Clipping masks and text nodes are not supported inside TrueType/WOFF glyph tables.'],
            ['Filename', 'kebab-case without spaces (e.g. arrow-left.svg)', 'Spaces and special characters are auto-normalized when normalization is enabled.']
          ]
        },
        codeTitle: 'arrow-home.svg',
        codeLang: 'svg',
        code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path fill="currentColor" d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
</svg>`,
        extraTitle: 'Enriching search with catalog.json',
        extraBody:
          'Upload a catalog.json alongside your SVGs or Webfont to attach labels, groups, and search synonyms. The create-icons skill generates this file automatically:',
        extraLang: 'json',
        extraCode: `[
  {
    "name": "arrow-left",
    "icon": "ic arrow-left",
    "label": "Back",
    "group": "navigation",
    "keywords": "back previous return left arrow navigate"
  }
]`
      },
      {
        id: 'woff2',
        group: 'guides',
        nav: 'Why use WOFF2?',
        title: 'Why use WOFF2 on websites?',
        lead: 'WOFF2 (Web Open Font Format 2.0) is the modern W3C standard for delivering fonts and icon fonts on the web.',
        table: {
          headers: ['Format', 'Compression', 'Support', 'Best use case'],
          rows: [
            ['WOFF2', 'Brotli (~30% smaller than WOFF, up to 60% smaller than TTF)', '> 98% (modern browsers)', 'Default choice for production websites.'],
            ['WOFF', 'Zlib / Deflate', '> 99% (includes legacy)', 'Lightweight fallback for older environments.'],
            ['TTF / OTF', 'Uncompressed for web', 'Desktop, Mobile & Web', 'OS installation (Figma, Sketch, iOS/Android).']
          ]
        },
        bullets: [
          'Minimal payload: a 300+ icon library in WOFF2 typically weighs 20 KB–65 KB.',
          'Single HTTP request: the browser downloads and immutably caches 1 file.',
          'Native CSS styling: font-size, color, hover states, and vertical alignment work like text.',
          'Lighter DOM: rendering 500 icons in data tables uses simple <i class="ic ..."></i> tags.'
        ],
        callout: {
          type: 'info',
          title: 'WOFF2 vs. Inline SVG — when to pick each?',
          body: 'Choose WOFF2 for large libraries (100+ icons), monochrome UI icons, and multi-framework sharing via CSS. Choose Inline SVG / Sprite for multicolor icons (duotone/gradients), per-path animations, or small sets (5–15 icons).'
        },
        codeTitle: 'fonts.css',
        codeLang: 'css',
        code: `/* 1. Preload in HTML <head>:
 * <link rel="preload" href="/fonts/my-icons.woff2" as="font" type="font/woff2" crossorigin />
 */
@font-face {
  font-family: 'my-icons';
  src: url('./my-icons.woff2') format('woff2'),
       url('./my-icons.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}`
      },
      {
        id: 'figma-and-more',
        group: 'guides',
        nav: 'Figma & other tools',
        title: 'Using your generated font in Figma & elsewhere',
        lead: 'The exported .zip bundle ships .ttf, .woff, .css, and standalone .svg files so your icons work in design tools, web apps, and native mobile apps.',
        subsections: [
          {
            title: 'In Figma',
            body: 'There are two ways to use your library in Figma:',
            bullets: [
              'As a Webfont (fast prototyping): install the .ttf file on macOS or Windows, restart Figma Desktop (or run Figma Font Service in the browser), pick the font on a text layer, and paste the glyph.',
              'As SVG Components (recommended for Design Systems): import the svg/ folder into an "Icons" page, turn each SVG into a Component with Scale constraints, and use instances with Figma color variables.'
            ]
          },
          {
            title: 'Web Apps (HTML, React, Vue, Tailwind)',
            body: 'Import the generated .css file and use the classes directly:',
            codeLang: 'tsx',
            code: `import './assets/icons/custom-icons.css'

export function SaveButton() {
  return (
    <button className="inline-flex items-center gap-2">
      <i className="ic check" aria-hidden="true" />
      <span>Save</span>
    </button>
  )
}`
          },
          {
            title: 'Mobile (Flutter, React Native, iOS, Android) & Decks',
            body: 'Use the bundled .ttf for native apps and gallery SVG/PNG exports for presentations:',
            bullets: [
              'Flutter: add .ttf to assets/fonts/, register in pubspec.yaml, and render with IconData(0xe900, fontFamily: "custom-icons").',
              'React Native: place .ttf in assets/fonts/ and run npx react-native-asset.',
              'Slides / Keynote / Canva: pick your brand color and size in the Studio gallery and download PNG or SVG.'
            ]
          }
        ]
      },
      {
        id: 'best-practices',
        group: 'reference',
        nav: 'Best practices',
        title: 'General Icon Library Best Practices',
        lead: 'Accessibility, consistent naming, and optical geometry turn a folder of vectors into a durable design system asset.',
        subsections: [
          {
            title: 'Accessibility (A11y)',
            body: 'Always hide decorative icons from screen readers and add aria-label to icon-only buttons:',
            codeLang: 'html',
            code: `<!-- Decorative (visible label next to it) -->
<button>
  <i class="ic download" aria-hidden="true"></i>
  Download report
</button>

<!-- Icon-only button -->
<button aria-label="Close dialog">
  <i class="ic x" aria-hidden="true"></i>
</button>`
          },
          {
            title: 'Naming, Geometry & Versioning',
            body: 'Simple rules that prevent breaking changes over time:',
            bullets: [
              'Use lowercase kebab-case (arrow-right, user-plus, check-circle) and add localized synonyms in catalog.json keywords.',
              'Name icons after their visual metaphor (trash, bell) rather than a narrow context (delete-invoice).',
              'Respect the live area: on a 24×24 grid, keep primary artwork within 20×20 and always verify legibility at 16px.',
              'Follow SemVer: new icons = minor (1.1.0), path tweak = patch (1.1.1), rename/remove = major (2.0.0).'
            ]
          }
        ]
      }
    ]
  }
}
