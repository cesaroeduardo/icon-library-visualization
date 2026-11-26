export const docsContent = {
  pt: {
    badge: 'Documentação',
    title: 'Guia Completo de Icon Libraries',
    subtitle:
      'Tudo o que você precisa para montar, validar, compilar e distribuir bibliotecas de ícones profissionais na web, no Figma e em apps mobile.',
    onThisPage: 'Nesta página',
    copy: 'Copiar',
    copied: 'Copiado!',
    tryDemo: 'Explorar Demo',
    goUploadSvg: 'Compilar SVGs',
    sections: [
      {
        id: 'overview',
        nav: 'Para que serve',
        title: '1. Para que serve uma Icon Library?',
        lead: 'Uma Icon Library centraliza todos os ícones de um produto ou design system em um único catálogo pesquisável, padronizado e pronto para uso por designers e desenvolvedores.',
        paragraphs: [
          'Sem uma biblioteca centralizada, equipes acabam duplicando arquivos SVG espalhados pelo código, misturando espessuras de traço diferentes e perdendo tempo procurando qual ícone usar em cada tela.',
          'O Icon Library Studio resolve esse fluxo 100% no navegador — sem precisar configurar servidor ou pipeline complexo. Você pode inspecionar webfonts existentes, compilar seus próprios SVGs em webfont + CSS + catálogo JSON, ou gerar um conjunto original com ajuda de uma skill de IA.'
        ],
        callout: {
          type: 'tip',
          title: '100% estático e privado',
          body: 'Todos os arquivos enviados (fontes, SVGs, CSS e ZIPs) são processados localmente na memória do seu navegador. Nenhum ativo da sua marca é enviado para servidores externos.'
        },
        bullets: [
          'Fonte única da verdade para Design e Engenharia.',
          'Busca instantânea por nome do ícone, código Unicode ou palavras-chave (keywords).',
          'Preview em tempo real de tamanho (8px a 320px), cor e contraste em temas Claro e Escuro.',
          'Exportação rápida em HTML, SVG, PNG ou pacote completo (.zip) pronto para produção.'
        ]
      },
      {
        id: 'how-to-use',
        nav: 'Como usar cada função',
        title: '2. Como usar cada função do sistema',
        lead: 'Na tela inicial você encontra três fluxos independentes (além da Demo interativa com 332 ícones).',
        subsections: [
          {
            title: '2.1 Subir Webfont',
            body: 'Ideal quando você já possui uma icon font pronta (gerada por ferramentas de build, IcoMoon, Fontello ou pelo próprio Studio) e quer visualizá-la ou extrair ícones.',
            bullets: [
              'Arraste arquivos .ttf, .otf, .woff ou .woff2 — opcionalmente junto com o .css e/ou catalog.json, ou envie tudo dentro de um .zip.',
              'Quando o .css é enviado junto, o sistema preserva exatamente os nomes das classes e o prefixo original.',
              'Quando apenas a fonte (.ttf, .otf ou .woff) é enviada, os nomes dos glifos e seus caminhos vetoriais são lidos diretamente da tabela interna da fonte, permitindo até baixar SVG e PNG de cada ícone.'
            ]
          },
          {
            title: '2.2 Subir SVGs e gerar Webfont',
            body: 'Transforma uma pasta de arquivos .svg (ou .zip) em uma webfont pronta para produção diretamente no navegador.',
            bullets: [
              'Validação automática de cada SVG com relatório de erros, avisos e recomendações antes de compilar.',
              'Normalização opcional dos nomes para kebab-case (ex.: "Arrow Right.svg" → "arrow-right").',
              'Detecção automática de ícones multicoloridos: ícones monocromáticos viram glifos na webfont; ícones com múltiplas cores ou gradientes são preservados como SVG inline.',
              'Se você enviar um catalog.json ou manifest.json junto, as keywords e rótulos são incorporados automaticamente à busca.',
              'Ao final, clique em "Baixar Pacote (.zip)" na galeria para obter .woff, .ttf, .css, catalog.json, pasta svg/ e README.md.'
            ]
          },
          {
            title: '2.3 Criar meus próprios ícones (Skill de IA)',
            body: 'Para quem ainda não tem ícones ou quer criar um conjunto 100% original alinhado ao design system do projeto.',
            bullets: [
              'Baixe o arquivo create-icons.zip e extraia na pasta de skills do seu agente (Antigravity, Claude Code ou Cursor).',
              'A skill escaneia os tokens CSS/Tailwind do seu projeto, propõe um style sheet (icon-style.json), desenha uma amostra para sua aprovação e gera todos os SVGs + catalog.json com keywords.',
              'Arraste os arquivos gerados de volta para a área de importação do Studio para visualizar na galeria e compilar em webfont.'
            ]
          },
          {
            title: '2.4 Usando a Galeria',
            body: 'Dentro da galeria você pode filtrar ícones por nome ou keyword, ajustar o tamanho no slider (8px a 320px), testar qualquer cor no color picker e passar o mouse em cada card para:',
            bullets: [
              'Copiar o snippet HTML (<i class="ic nome-do-icone"></i>).',
              'Copiar a imagem renderizada (SVG ou PNG) direto para a área de transferência.',
              'Baixar o ícone individual no formato e tamanho escolhidos.'
            ]
          }
        ]
      },
      {
        id: 'svg-spec',
        nav: 'Padrão de SVGs aceitos',
        title: '3. Como o sistema aceita ícones SVG',
        lead: 'Webfonts são baseadas em contornos preenchidos (glyph outlines). Seguir um padrão limpo nos seus SVGs garante renderização nítida em qualquer tamanho.',
        table: {
          headers: ['Critério', 'Recomendado', 'O que acontece se divergir'],
          rows: [
            ['viewBox', 'Quadrado, preferencialmente 0 0 24 24', 'ViewBox não quadrado gera aviso e pode desalinhar o ícone na linha de texto.'],
            ['Construção', 'Formas preenchidas (<path> com fill)', 'Traços (stroke) geram aviso: em icon fonts, converta "Outline Stroke" no Figma/Illustrator antes de exportar.'],
            ['Cor (monocromático)', 'fill="currentColor" (ou sem cor fixa)', 'fill="#000" gera aviso; cores diferentes de preto/branco classificam o ícone como colorido (inline).'],
            ['Recortes e máscaras', 'Sem <clipPath>, <mask> ou <text>', 'Elementos de recorte e texto não são suportados dentro de glifos TrueType/WOFF.'],
            ['Nome do arquivo', 'kebab-case sem espaços (ex: arrow-left.svg)', 'Espaços e caracteres especiais são normalizados automaticamente quando a opção está ativa.']
          ]
        },
        codeTitle: 'Exemplo de SVG ideal para Webfont',
        code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path fill="currentColor" d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
</svg>`,
        extraTitle: 'Enriquecendo a busca com catalog.json',
        extraBody:
          'Você pode subir um arquivo catalog.json junto com seus SVGs (ou junto com a Webfont) para associar sinônimos e categorias a cada ícone. A skill create-icons já gera este arquivo automaticamente:',
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
        nav: 'Por que usar WOFF2?',
        title: '4. Qual a vantagem de usar WOFF2 nos sites?',
        lead: 'WOFF2 (Web Open Font Format 2.0) é o padrão moderno recomendado pela W3C para distribuição de fontes e icon fonts na web.',
        table: {
          headers: ['Formato', 'Compressão', 'Suporte em navegadores', 'Quando usar'],
          rows: [
            ['WOFF2', 'Brotli (~30% menor que WOFF, até 60% menor que TTF)', '> 98% (todos os navegadores modernos)', 'Padrão obrigatório para produção na web.'],
            ['WOFF', 'Zlib / Deflate', '> 99% (inclui navegadores antigos)', 'Fallback leve caso precise suportar ambientes legados.'],
            ['TTF / OTF', 'Sem compressão web', 'Desktop, Mobile e navegadores', 'Instalação no sistema operacional (Figma, Sketch, iOS/Android).']
          ]
        },
        bullets: [
          'Payload mínimo: uma biblioteca com 300+ ícones em WOFF2 costuma pesar entre 20 KB e 65 KB — menos que uma única imagem hero.',
          'Uma única requisição HTTP: em vez de dezenas de requests ou megabytes de SVG duplicados no HTML, o navegador baixa e faz cache imutável de 1 arquivo.',
          'Estilização nativa via CSS: tamanho (font-size), cor (color), hover, transições e alinhamento vertical funcionam como texto comum.',
          'DOM mais leve: renderizar 500 ícones em uma tabela ou dashboard usa apenas tags <i class="ic ..."></i>, reduzindo o número de nós vetoriais no DOM.'
        ],
        callout: {
          type: 'info',
          title: 'Webfont WOFF2 vs. SVG Inline — quando escolher cada um?',
          body: 'Use WOFF2 quando você tem bibliotecas grandes (100+ ícones), ícones monocromáticos de UI e múltiplos projetos consumindo via CSS. Prefira SVG Inline/Sprite quando precisar de ícones multicoloridos (duotone/gradientes), animações por camada ou usar apenas 5–15 ícones em uma landing page.'
        },
        codeTitle: 'Carregamento otimizado em produção (HTML + CSS)',
        code: `<!-- 1. Pré-carregue a fonte no <head> para evitar flash de ícones -->
<link rel="preload" href="/fonts/my-icons.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="/fonts/my-icons.css" />

<!-- 2. @font-face com fallback e font-display adequado -->
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
        nav: 'Figma e outros locais',
        title: '5. Como usar a fonte gerada no Figma e em outros locais',
        lead: 'O pacote .zip gerado pelo Studio traz a fonte em .ttf/.woff, o CSS e os arquivos .svg individuais para que você use os mesmos ícones em qualquer ferramenta.',
        subsections: [
          {
            title: '5.1 Usando no Figma',
            body: 'Você tem duas formas principais de usar sua icon library no Figma:',
            bullets: [
              'Como Webfont (ideal para prototipagem rápida): extraia o pacote .zip, dê duplo clique no arquivo .ttf para instalar no Windows ou macOS e reinicie o Figma Desktop (ou garanta que o Figma Font Service esteja ativo no navegador). Crie uma camada de texto, selecione o nome da fonte (ex: custom-icons) e cole o caractere/glifo desejado.',
              'Como Componentes SVG (recomendado para Design Systems): importe a pasta svg/ do pacote .zip direto para uma página "Icons" no Figma, transforme cada SVG em Component com constraints Scale e use como instâncias. Isso preserva overrides de cor por variável do Figma e facilita o handoff.'
            ]
          },
          {
            title: '5.2 Em projetos Web (HTML, React, Vue, Tailwind)',
            body: 'Importe o arquivo .css gerado no entrypoint da sua aplicação e use as classes diretamente:',
            code: `<!-- HTML / Vue / Angular -->
<i class="ic home" style="font-size: 20px; color: #2563eb;" aria-hidden="true"></i>

<!-- React / Next.js -->
import './assets/icons/custom-icons.css'
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
            title: '5.3 Em Apps Mobile (Flutter, React Native, iOS, Android)',
            body: 'Use o arquivo .ttf gerado pelo pacote:',
            bullets: [
              'Flutter: adicione o .ttf em assets/fonts/, registre em pubspec.yaml na seção fonts e referencie cada ícone com IconData(0xe900, fontFamily: "custom-icons").',
              'React Native: coloque o .ttf em assets/fonts/ e rode npx react-native-asset para linkar automaticamente em iOS e Android.',
              'Android nativo: copie para res/font/ e use com Typeface ou Jetpack Compose FontFamily.'
            ]
          },
          {
            title: '5.4 Apresentações, Documentos e Marketing',
            body: 'Para Google Slides, PowerPoint, Keynote, Notion ou Canva, use a própria galeria do Studio: escolha a cor exata da sua marca no color picker, ajuste o tamanho (ex: 128px ou 256px) e clique em Copiar ou Baixar em PNG ou SVG.'
          }
        ]
      },
      {
        id: 'best-practices',
        nav: 'Boas práticas gerais',
        title: '6. Boas práticas de Icon Libraries',
        lead: 'Pequenos cuidados de acessibilidade, nomenclatura e geometria fazem a diferença entre uma coleção amadora e um sistema escalável.',
        subsections: [
          {
            title: '6.1 Acessibilidade (A11y)',
            body: 'Leitores de tela podem tentar ler os codepoints Unicode de uma icon font como caracteres estranhos se não forem marcados corretamente.',
            code: `<!-- Ícone decorativo (já existe texto visível ao lado) -->
<button>
  <i class="ic download" aria-hidden="true"></i>
  Baixar relatório
</button>

<!-- Botão apenas com ícone (precisa de nome acessível) -->
<button aria-label="Fechar modal">
  <i class="ic x" aria-hidden="true"></i>
</button>`
          },
          {
            title: '6.2 Nomenclatura e Organização',
            body: 'Padronize os nomes desde o início para evitar quebrar código em atualizações futuras:',
            bullets: [
              'Use sempre kebab-case em inglês (ex: arrow-right, user-plus, check-circle) e coloque termos em português nas keywords do catalog.json.',
              'Prefira descrever a metáfora visual (trash, pencil, bell) em vez de um uso muito específico (delete-invoice), pois o mesmo ícone será reaproveitado em vários contextos.',
              'Mantenha sufixos previsíveis para variantes: -solid, -outline, -circle, -square.'
            ]
          },
          {
            title: '6.3 Geometria e Consistência Visual',
            body: 'Mesmo com ícones diferentes, o conjunto precisa parecer desenhado pela mesma mão:',
            bullets: [
              'Respeite uma área segura (live area): em um grid 24×24, mantenha a arte principal dentro de 20×20 (2px de respiro em cada lado) para compensação óptica.',
              'Padronize espessura de traço (ex: 1.5px ou 2px), arredondamento de cantos (border-radius) e pontas (linecap/linejoin).',
              'Teste sempre em 16px: se um ícone perde a leitura em 16px, simplifique os detalhes internos.'
            ]
          },
          {
            title: '6.4 Versionamento e Distribuição',
            body: 'Ao publicar sua icon library em npm ou CDN interno, use Versionamento Semântico (SemVer): adicionar ícones novos é minor (1.1.0), corrigir o path de um ícone é patch (1.1.1), e renomear ou remover ícones existentes é major (2.0.0).'
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
    onThisPage: 'On this page',
    copy: 'Copy',
    copied: 'Copied!',
    tryDemo: 'Explore Demo',
    goUploadSvg: 'Compile SVGs',
    sections: [
      {
        id: 'overview',
        nav: 'What it is for',
        title: '1. What is an Icon Library for?',
        lead: 'An Icon Library centralizes every icon in your product or design system into a single searchable, consistent catalog ready for both designers and engineers.',
        paragraphs: [
          'Without a centralized library, teams end up duplicating raw SVGs across repositories, mixing stroke weights, and wasting time hunting for the right icon during design handoff.',
          'Icon Library Studio solves this workflow 100% in the browser — no backend or complex build setup required. You can inspect existing webfonts, compile your own SVGs into a webfont + CSS + JSON catalog, or generate an original icon set using the built-in AI skill.'
        ],
        callout: {
          type: 'tip',
          title: '100% static & private',
          body: 'All uploaded files (fonts, SVGs, CSS, and ZIP archives) are processed locally in your browser memory. None of your brand assets are sent to external servers.'
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
        nav: 'How to use each feature',
        title: '2. How to use each feature',
        lead: 'From the home screen you have three workflows (plus a built-in interactive Demo with 332 icons).',
        subsections: [
          {
            title: '2.1 Upload Webfont',
            body: 'Best when you already have a compiled icon font (from a build pipeline, IcoMoon, Fontello, or this Studio) and want to browse or extract icons.',
            bullets: [
              'Drop .ttf, .otf, .woff, or .woff2 files — optionally paired with .css and/or catalog.json, or upload a .zip containing them.',
              'When a .css file is included, exact class names and the original prefix are preserved.',
              'When only the font file (.ttf, .otf, or .woff) is uploaded, glyph names and vector outlines are parsed directly from the font tables, enabling SVG and PNG downloads.'
            ]
          },
          {
            title: '2.2 Upload SVGs & Build Webfont',
            body: 'Turns a folder of .svg files (or a .zip archive) into a production webfont right in your browser.',
            bullets: [
              'Automatic SVG validation with a clear report of errors, warnings, and info before building.',
              'Optional filename normalization to kebab-case (e.g., "Arrow Right.svg" → "arrow-right").',
              'Automatic multicolor detection: monochrome icons are compiled into font glyphs, while multicolor/gradient icons stay as inline SVGs.',
              'If you include a catalog.json or manifest.json, icon labels and keywords are automatically wired into gallery search.',
              'Click "Download Bundle (.zip)" in the gallery to export .woff, .ttf, .css, catalog.json, svg/, and README.md.'
            ]
          },
          {
            title: '2.3 Create My Own Icons (AI Skill)',
            body: 'For teams starting from scratch or wanting an original icon set tailored to their design system.',
            bullets: [
              'Download create-icons.zip and extract it into your coding agent’s skills folder (Antigravity, Claude Code, or Cursor).',
              'The skill scans your CSS/Tailwind tokens, writes an explicit style sheet (icon-style.json), proves the style on a small sample, and generates standalone SVGs + catalog.json with keywords.',
              'Drop the generated files back into the Studio to preview them in the gallery and compile a webfont.'
            ]
          },
          {
            title: '2.4 Using the Gallery',
            body: 'Inside the gallery, filter icons by name or keyword, drag the size slider (8px–320px), pick any color, and hover any card to:',
            bullets: [
              'Copy the HTML snippet (<i class="ic icon-name"></i>).',
              'Copy the rendered icon (SVG or PNG) straight to your clipboard.',
              'Download the individual icon at the selected size and color.'
            ]
          }
        ]
      },
      {
        id: 'svg-spec',
        nav: 'Accepted SVG format',
        title: '3. How the system accepts SVG icons',
        lead: 'Webfonts are built from filled vector outlines (glyph contours). Clean, standardized SVGs ensure razor-sharp rendering at every size.',
        table: {
          headers: ['Criteria', 'Recommended', 'What happens otherwise'],
          rows: [
            ['viewBox', 'Square, ideally 0 0 24 24', 'Non-square viewBoxes trigger a warning and may misalign vertically with text.'],
            ['Construction', 'Filled shapes (<path> with fill)', 'Stroke-based paths trigger a warning: run "Outline Stroke" in Figma/Illustrator before exporting for icon fonts.'],
            ['Color (monochrome)', 'fill="currentColor" (or no hardcoded color)', 'fill="#000" triggers a warning; non-black/white colors classify the icon as colored (inline SVG).'],
            ['Clipping & masks', 'No <clipPath>, <mask>, or <text>', 'Clipping masks and text nodes are not supported inside TrueType/WOFF glyph tables.'],
            ['Filename', 'kebab-case without spaces (e.g. arrow-left.svg)', 'Spaces and special characters are auto-normalized when normalization is enabled.']
          ]
        },
        codeTitle: 'Ideal SVG for Webfont compilation',
        code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path fill="currentColor" d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
</svg>`,
        extraTitle: 'Enriching search with catalog.json',
        extraBody:
          'Upload a catalog.json alongside your SVGs (or webfont) to attach human labels, groups, and search synonyms. The create-icons skill generates this file automatically:',
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
        nav: 'Why use WOFF2?',
        title: '4. Why use WOFF2 on websites?',
        lead: 'WOFF2 (Web Open Font Format 2.0) is the modern W3C standard for delivering fonts and icon fonts on the web.',
        table: {
          headers: ['Format', 'Compression', 'Browser support', 'Best use case'],
          rows: [
            ['WOFF2', 'Brotli (~30% smaller than WOFF, up to 60% smaller than TTF)', '> 98% (all modern browsers)', 'Default choice for production websites.'],
            ['WOFF', 'Zlib / Deflate', '> 99% (including older browsers)', 'Lightweight fallback for legacy environments.'],
            ['TTF / OTF', 'Uncompressed for web', 'Desktop, Mobile & browsers', 'OS installation (Figma, Sketch, iOS/Android apps).']
          ]
        },
        bullets: [
          'Minimal payload: a 300+ icon library in WOFF2 typically weighs 20 KB–65 KB — smaller than a single hero image.',
          'Single HTTP request: instead of dozens of requests or repeated inline SVG markup, the browser downloads and immutably caches 1 file.',
          'Native CSS styling: size (font-size), color (color), hover states, and vertical alignment behave just like text.',
          'Lighter DOM: rendering 500 icons in a data table uses simple <i class="ic ..."></i> tags instead of thousands of SVG path nodes.'
        ],
        callout: {
          type: 'info',
          title: 'WOFF2 Webfont vs. Inline SVG — when to pick each?',
          body: 'Choose WOFF2 for large libraries (100+ icons), monochrome UI icons, and multi-framework sharing via CSS. Choose Inline SVG / Sprite when you need multicolor icons (duotone/gradients), per-path animations, or only 5–15 icons on a landing page.'
        },
        codeTitle: 'Production-ready loading (HTML + CSS)',
        code: `<!-- 1. Preload the font in <head> to prevent icon flash -->
<link rel="preload" href="/fonts/my-icons.woff2" as="font" type="font/woff2" crossorigin />
<link rel="stylesheet" href="/fonts/my-icons.css" />

<!-- 2. @font-face with fallback and proper font-display -->
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
        nav: 'Figma & other tools',
        title: '5. Using your generated font in Figma & elsewhere',
        lead: 'The exported .zip bundle includes .ttf/.woff fonts, CSS, and standalone .svg files so your icons work seamlessly in design tools, web apps, and native mobile apps.',
        subsections: [
          {
            title: '5.1 Using in Figma',
            body: 'There are two ways to use your icon library in Figma:',
            bullets: [
              'As a Webfont (great for fast prototyping): unzip the bundle, double-click the .ttf file to install it on Windows or macOS, and restart Figma Desktop (or keep Figma Font Service running in the browser). Create a text layer, choose your font family (e.g., custom-icons), and paste the glyph character.',
              'As SVG Components (recommended for Design Systems): drag the svg/ folder from the .zip bundle into an "Icons" page in Figma, convert each SVG into a Component with Scale constraints, and use instances. This supports Figma color variables and clean developer handoff.'
            ]
          },
          {
            title: '5.2 Web Apps (HTML, React, Vue, Tailwind)',
            body: 'Import the generated .css file in your app entry point and use the classes directly:',
            code: `<!-- HTML / Vue / Angular -->
<i class="ic home" style="font-size: 20px; color: #2563eb;" aria-hidden="true"></i>

<!-- React / Next.js -->
import './assets/icons/custom-icons.css'
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
            title: '5.3 Mobile Apps (Flutter, React Native, iOS, Android)',
            body: 'Use the .ttf file included in the bundle:',
            bullets: [
              'Flutter: place the .ttf in assets/fonts/, declare it under fonts in pubspec.yaml, and render via IconData(0xe900, fontFamily: "custom-icons").',
              'React Native: place the .ttf in assets/fonts/ and run npx react-native-asset to link both iOS and Android.',
              'Native Android: copy to res/font/ and load via Typeface or Jetpack Compose FontFamily.'
            ]
          },
          {
            title: '5.4 Decks, Docs & Marketing',
            body: 'For Google Slides, PowerPoint, Keynote, Notion, or Canva, use the Studio gallery directly: pick your exact brand color, set the size (e.g., 128px or 256px), and copy or download as PNG or SVG.'
          }
        ]
      },
      {
        id: 'best-practices',
        nav: 'Best practices',
        title: '6. General Icon Library Best Practices',
        lead: 'Thoughtful accessibility, naming, and geometry turn a folder of vectors into a durable design system asset.',
        subsections: [
          {
            title: '6.1 Accessibility (A11y)',
            body: 'Screen readers may announce private-use Unicode codepoints as gibberish unless icons are marked properly:',
            code: `<!-- Decorative icon (visible label next to it) -->
<button>
  <i class="ic download" aria-hidden="true"></i>
  Download report
</button>

<!-- Icon-only button (requires an accessible name) -->
<button aria-label="Close dialog">
  <i class="ic x" aria-hidden="true"></i>
</button>`
          },
          {
            title: '6.2 Naming & Organization',
            body: 'Consistent naming prevents breaking changes as your library grows:',
            bullets: [
              'Use lowercase kebab-case (arrow-right, user-plus, check-circle) and put localized synonyms inside catalog.json keywords.',
              'Name icons after their visual metaphor (trash, pencil, bell) rather than a narrow UI context (delete-invoice) so they stay reusable.',
              'Keep variant suffixes predictable: -solid, -outline, -circle, -square.'
            ]
          },
          {
            title: '6.3 Optical Geometry & Consistency',
            body: 'Every icon in the set should look like it was drawn by the same hand:',
            bullets: [
              'Respect a live area: on a 24×24 grid, keep the main artwork inside 20×20 (2px optical padding on every side).',
              'Standardize stroke weight (e.g., 1.5px or 2px), corner radius, and cap/join styles.',
              'Always test at 16px: if an icon turns muddy at 16px, simplify its inner details.'
            ]
          },
          {
            title: '6.4 Versioning & Distribution',
            body: 'When publishing your icon library to npm or an internal CDN, follow Semantic Versioning (SemVer): adding new icons is a minor release (1.1.0), tweaking a path is a patch (1.1.1), and renaming or removing icons is a major release (2.0.0).'
          }
        ]
      }
    ]
  }
}
