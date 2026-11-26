import { ref, computed } from 'vue'

const savedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('icon-library-lang') : null
const browserLang =
  typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'

export const lang = ref(savedLang || browserLang)

export function setLang(newLang) {
  lang.value = newLang
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('icon-library-lang', newLang)
  }
}

export function toggleLang() {
  setLang(lang.value === 'pt' ? 'en' : 'pt')
}

export const messages = {
  pt: {
    appName: 'Icon Library Studio',
    tagline: 'Monte, compile e crie bibliotecas de ícones direto no navegador — 100% estático.',
    backHome: 'Início',
    docsNav: 'Docs',
    switchMode: 'Trocar modo',
    homeTitle: 'Como você quer montar sua Icon Library?',
    homeSubtitle:
      'Escolha uma das 3 opções abaixo para visualizar uma webfont existente, compilar seus SVGs em webfont ou criar um conjunto original de ícones com IA.',
    badgeStatic: '100% no navegador · Sem servidor',
    demo: {
      navBtn: 'Ver Demo',
      bannerBadge: 'Demo interativa pronta',
      bannerTitle: 'Quer ver a Icon Library em ação antes de subir seus arquivos?',
      bannerDesc:
        'Explore uma webfont de demonstração com 332 ícones: teste a busca instantânea, troca de cor, redimensionamento, cópia de HTML e download em SVG/PNG.',
      cta: 'Abrir Demo da Galeria',
      loading: 'Carregando demo...'
    },
    cards: {
      webfont: {
        title: 'Subir Webfont',
        badge: 'WOFF2 · WOFF · TTF · OTF · ZIP',
        description:
          'Envie uma webfont pronta (com ou sem CSS) para inspecionar todos os glifos, buscar, recolorir, redimensionar e baixar em SVG ou PNG.',
        cta: 'Abrir Webfont'
      },
      svg: {
        title: 'Subir SVGs e gerar Webfont',
        badge: 'Validação + Compilação TTF/WOFF + CSS',
        description:
          'Envie seus arquivos .svg (ou .zip), valide problemas de fonte automaticamente, compile em webfont + CSS + catalog.json e visualize na galeria.',
        cta: 'Compilar SVGs'
      },
      create: {
        title: 'Criar meus próprios ícones',
        badge: 'Skill para Agentes de IA · 8 Estilos',
        description:
          'Baixe a skill de criação de ícones originais, siga o passo a passo no seu agente (Antigravity, Claude Code, Cursor) e importe os SVGs aqui.',
        cta: 'Ver Skill e Instruções'
      }
    },
    webfontUpload: {
      title: 'Subir Webfont',
      subtitle:
        'Envie um arquivo de fonte (.woff2, .woff, .ttf, .otf), opcionalmente acompanhado de um .css, ou um .zip contendo ambos.',
      dropTitle: 'Arraste sua webfont aqui ou clique para selecionar',
      dropHint: 'Suporta .ttf, .otf, .woff, .woff2, .css e .zip (ex: pacotes do Fantasticon, IcoMoon ou Fontello)',
      fontNameLabel: 'Nome da biblioteca',
      prefixLabel: 'Prefixo CSS (usado no Copy Code)',
      cssDetected: 'CSS detectado: nomes de classes serão preservados.',
      noCssNote: 'Sem arquivo CSS: os nomes dos glifos serão lidos diretamente da fonte.',
      loadBtn: 'Montar Icon Library',
      loading: 'Lendo glifos da fonte...',
      errorNoFont: 'Nenhum arquivo de fonte (.ttf, .otf, .woff, .woff2) foi encontrado.',
      errorWoff2Notice:
        'Arquivo .woff2 carregado via FontFace API. Para extrair nomes e paths vetoriais de .woff2 sem CSS, envie também o .css ou a versão .ttf/.woff.',
      filesSelected: 'Arquivos selecionados',
      clearFiles: 'Limpar'
    },
    svgUpload: {
      title: 'Subir SVGs e Montar Webfont',
      subtitle:
        'Envie múltiplos arquivos .svg ou um .zip. Validamos cada SVG automaticamente para icon fonts e compilamos sua webfont direto no navegador.',
      dropTitle: 'Arraste seus SVGs (ou .zip) aqui ou clique para selecionar',
      dropHint: 'Aceita múltiplos .svg (monocromáticos ou coloridos) e arquivos .zip',
      fontNameLabel: 'Nome da Webfont',
      prefixLabel: 'Prefixo CSS (ex: ic, ai, pi)',
      normalizeNames: 'Normalizar nomes para kebab-case automaticamente',
      coloredMode: 'Detectar ícones multicoloridos automaticamente (renderizar inline)',
      validationTitle: 'Relatório de Validação SVG',
      errors: 'Erros',
      warnings: 'Avisos',
      info: 'Info',
      readyCount: 'SVGs prontos',
      coloredCount: 'Coloridos',
      monoCount: 'Para webfont',
      buildBtn: 'Compilar Webfont e Abrir Library',
      building: 'Compilando webfont e gerando CSS...',
      addMore: 'Adicionar mais SVGs',
      clearAll: 'Limpar lista',
      noSvgs: 'Nenhum arquivo .svg encontrado.'
    },
    createSkill: {
      title: 'Criar meus próprios ícones com IA',
      subtitle:
        'Use a skill create-icons no seu agente de código para desenhar uma biblioteca de ícones original alinhada ao seu design system e depois traga os SVGs para cá.',
      downloadZip: 'Baixar Skill (.zip)',
      importGenerated: 'Importar SVGs gerados para a Library',
      importHint: 'Já gerou os SVGs com a skill? Arraste a pasta svg/ ou o .zip aqui para abrir direto na galeria.',
      installTitle: 'Como instalar a skill',
      step1Title: '1. Baixe e extraia a skill',
      step1Desc: 'Extraia o arquivo create-icons.zip na pasta de skills do seu agente favorito:',
      step2Title: '2. Peça ao seu agente para gerar os ícones',
      step2Desc: 'Abra seu projeto no Antigravity, Claude Code ou Cursor e envie um prompt como:',
      promptExample:
        'Use a skill create-icons para analisar meu design system e criar uma biblioteca de ícones para o meu menu lateral, estados vazios e ações principais.',
      step3Title: '3. O que a skill faz por você',
      step3Items: [
        'Escaneia seus tokens CSS, Tailwind, fontes e ícones atuais (scripts/scan_design_system.py).',
        'Propõe um style sheet explícito (icon-style.json) com justificativa de cada decisão.',
        'Desenha uma amostra de 6 a 8 ícones originais para você aprovar antes do set completo.',
        'Valida cada SVG (scripts/validate.py) e gera componentes + pasta svg/ + sprite + catalog.html.'
      ],
      step4Title: '4. Visualize e compile em Webfont aqui',
      step4Desc:
        'Depois que a skill gerar a pasta svg/ (ou o pacote), clique no botão abaixo ou arraste os SVGs para montar sua Icon Library pesquisável e exportar a webfont (.ttf, .woff, .css).',
      galleryTitle: 'Preview dos 8 estilos iniciais incluídos na skill',
      gallerySubtitle:
        'Projetos sem design system ainda podem começar por qualquer um destes 8 estilos (em claro e escuro):',
      openFullGallery: 'Abrir galeria completa em nova aba',
      copied: 'Copiado!',
      copy: 'Copiar'
    },
    gallery: {
      searchPlaceholder: 'Buscar por nome ou palavra-chave em {count} ícones...',
      notFound: 'Não encontrou seu ícone? Tente outra palavra-chave.',
      size: 'Tamanho',
      color: 'Cor',
      format: 'Formato',
      downloadBundle: 'Baixar Pacote (.zip)',
      downloadBundleHint: 'Inclui fontes disponíveis (.woff2, .woff, .ttf, .otf), CSS, catalog.json e README',
      copyCode: 'Copiar código HTML',
      copyImage: 'Copiar imagem',
      downloadIcon: 'Baixar ícone',
      iconsCount: '{shown} de {total} ícones',
      filterAll: 'Todos',
      filterMono: 'Webfont',
      filterColor: 'Coloridos',
      sourceWebfont: 'Fonte carregada',
      sourceSvgBuild: 'Webfont compilada de SVGs',
      addMoreSvgs: 'Editar / Adicionar SVGs',
      newProject: 'Nova biblioteca'
    }
  },
  en: {
    appName: 'Icon Library Studio',
    tagline: 'Inspect, compile, and create icon libraries right in the browser — 100% static.',
    backHome: 'Home',
    docsNav: 'Docs',
    switchMode: 'Switch mode',
    homeTitle: 'How do you want to build your Icon Library?',
    homeSubtitle:
      'Choose one of the 3 options below to inspect an existing webfont, compile SVGs into a webfont, or create an original icon set with AI.',
    badgeStatic: '100% browser-based · No backend',
    demo: {
      navBtn: 'Live Demo',
      bannerBadge: 'Interactive demo ready',
      bannerTitle: 'Want to see the Icon Library in action before uploading?',
      bannerDesc:
        'Explore a built-in demo webfont with 332 icons: test instant search, live recoloring, resizing, HTML copy, and SVG/PNG downloads.',
      cta: 'Open Gallery Demo',
      loading: 'Loading demo...'
    },
    cards: {
      webfont: {
        title: 'Upload Webfont',
        badge: 'WOFF2 · WOFF · TTF · OTF · ZIP',
        description:
          'Upload a ready-made webfont (with or without CSS) to browse all glyphs, search, recolor, resize, and export as SVG or PNG.',
        cta: 'Open Webfont'
      },
      svg: {
        title: 'Upload SVGs & Build Webfont',
        badge: 'Validation + TTF/WOFF + CSS Compiler',
        description:
          'Upload .svg files (or a .zip), automatically validate font readiness, compile into webfont + CSS + catalog.json, and browse the gallery.',
        cta: 'Compile SVGs'
      },
      create: {
        title: 'Create My Own Icons',
        badge: 'AI Agent Skill · 8 Starter Styles',
        description:
          'Download the original icon-generation skill, follow the step-by-step guide in your agent (Antigravity, Claude Code, Cursor), and import SVGs here.',
        cta: 'View Skill & Guide'
      }
    },
    webfontUpload: {
      title: 'Upload Webfont',
      subtitle:
        'Upload a font file (.woff2, .woff, .ttf, .otf), optionally paired with a .css file, or a .zip containing both.',
      dropTitle: 'Drop your webfont here or click to browse',
      dropHint: 'Supports .ttf, .otf, .woff, .woff2, .css, and .zip (e.g. Fantasticon, IcoMoon, or Fontello bundles)',
      fontNameLabel: 'Library name',
      prefixLabel: 'CSS prefix (used in Copy Code)',
      cssDetected: 'CSS detected: exact class names will be preserved.',
      noCssNote: 'No CSS file: glyph names will be extracted directly from the font.',
      loadBtn: 'Build Icon Library',
      loading: 'Reading font glyphs...',
      errorNoFont: 'No font file (.ttf, .otf, .woff, .woff2) was found.',
      errorWoff2Notice:
        '.woff2 loaded via FontFace API. To inspect glyph names and vector paths from .woff2 without CSS, also include the .css or a .ttf/.woff file.',
      filesSelected: 'Selected files',
      clearFiles: 'Clear'
    },
    svgUpload: {
      title: 'Upload SVGs & Build Webfont',
      subtitle:
        'Upload multiple .svg files or a .zip archive. We automatically validate every SVG for icon font readiness and compile your webfont in the browser.',
      dropTitle: 'Drop your SVGs (or .zip) here or click to browse',
      dropHint: 'Accepts multiple .svg files (monochrome or multicolor) and .zip archives',
      fontNameLabel: 'Webfont Name',
      prefixLabel: 'CSS Prefix (e.g. ic, ai, pi)',
      normalizeNames: 'Automatically normalize filenames to kebab-case',
      coloredMode: 'Auto-detect multicolor icons (render inline SVG)',
      validationTitle: 'SVG Validation Report',
      errors: 'Errors',
      warnings: 'Warnings',
      info: 'Info',
      readyCount: 'SVGs ready',
      coloredCount: 'Colored',
      monoCount: 'For webfont',
      buildBtn: 'Compile Webfont & Open Library',
      building: 'Compiling webfont & generating CSS...',
      addMore: 'Add more SVGs',
      clearAll: 'Clear list',
      noSvgs: 'No .svg files found.'
    },
    createSkill: {
      title: 'Create Your Own Icons with AI',
      subtitle:
        'Use the create-icons skill in your coding agent to draw an original icon library matched to your design system, then import the SVGs here.',
      downloadZip: 'Download Skill (.zip)',
      importGenerated: 'Import Generated SVGs into Library',
      importHint: 'Already generated SVGs with the skill? Drop the svg/ folder or .zip here to open directly in the gallery.',
      installTitle: 'How to install the skill',
      step1Title: '1. Download & extract the skill',
      step1Desc: 'Extract create-icons.zip into your favorite agent’s skills folder:',
      step2Title: '2. Ask your agent to generate icons',
      step2Desc: 'Open your project in Antigravity, Claude Code, or Cursor and send a prompt like:',
      promptExample:
        'Use the create-icons skill to scan my design system and generate an original icon library for my sidebar, empty states, and primary actions.',
      step3Title: '3. What the skill does for you',
      step3Items: [
        'Scans your CSS tokens, Tailwind config, fonts, and existing icons (scripts/scan_design_system.py).',
        'Writes an explicit style sheet (icon-style.json) documenting every design decision.',
        'Draws a 6–8 icon sample for your approval before drawing the full set.',
        'Validates every SVG (scripts/validate.py) and outputs framework components + svg/ + sprite + catalog.html.'
      ],
      step4Title: '4. Preview & compile to Webfont here',
      step4Desc:
        'Once the skill generates the svg/ folder (or bundle), click below or drop the SVGs to open your searchable Icon Library and export a webfont (.ttf, .woff, .css).',
      galleryTitle: 'Preview of the 8 starter styles included in the skill',
      gallerySubtitle:
        'Projects without a design system yet can start from any of these 8 styles (light & dark):',
      openFullGallery: 'Open full gallery in new tab',
      copied: 'Copied!',
      copy: 'Copy'
    },
    gallery: {
      searchPlaceholder: 'Search by name or keyword across {count} icons...',
      notFound: 'Didn’t find your icon? Try another keyword.',
      size: 'Size',
      color: 'Color',
      format: 'Format',
      downloadBundle: 'Download Bundle (.zip)',
      downloadBundleHint: 'Includes available fonts (.woff2, .woff, .ttf, .otf), CSS, catalog.json & README',
      copyCode: 'Copy HTML code',
      copyImage: 'Copy image',
      downloadIcon: 'Download icon',
      iconsCount: '{shown} of {total} icons',
      filterAll: 'All',
      filterMono: 'Webfont',
      filterColor: 'Colored',
      sourceWebfont: 'Uploaded webfont',
      sourceSvgBuild: 'Webfont compiled from SVGs',
      addMoreSvgs: 'Edit / Add SVGs',
      newProject: 'New library'
    }
  }
}

export function useI18n() {
  const t = computed(() => messages[lang.value] || messages.pt)
  return { lang, t, setLang, toggleLang }
}
