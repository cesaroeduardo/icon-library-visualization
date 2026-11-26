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
        lead: 'O Studio oferece três fluxos independentes na tela inicial (além da Demo interativa com 332 ícones).',
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
          }
        ]
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
        lead: 'The Studio provides three independent workflows from the home screen (plus a built-in 332-icon interactive Demo).',
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
          }
        ]
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
