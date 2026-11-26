import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  X,
  Check,
  ArrowUpRight,
  Code2,
  Copy,
  Download,
  Plus,
  ExternalLink
} from 'lucide-react'
import { Shell, Panel, StatusPill, Tag, ActionButton, ActionLink } from '@/components/ui/tuff'
import { copy, type Lang } from '@/content'

export interface DemoIcon {
  name: string
  icon: string
  keywords: string
  char?: string
  svg?: string
}

export interface LibraryPreset {
  id: 'phosphor' | 'feather' | 'pixelarticons' | 'hugeicons' | 'demo'
  label: string
  name: string
  url: string
  license: string
  jsonPath?: string
}

export const DEMO_LIBRARIES: LibraryPreset[] = [
  {
    id: 'phosphor',
    label: 'Phosphor',
    name: 'Phosphor Icons',
    url: 'https://phosphoricons.com/',
    license: 'MIT',
    jsonPath: './demo/libraries/phosphor.json'
  },
  {
    id: 'feather',
    label: 'Feather',
    name: 'Feather Icons',
    url: 'https://feathericons.com/',
    license: 'MIT',
    jsonPath: './demo/libraries/feather.json'
  },
  {
    id: 'pixelarticons',
    label: 'Pixelarticons (Free)',
    name: 'Pixelarticons (Free)',
    url: 'https://pixelarticons.com/',
    license: 'MIT',
    jsonPath: './demo/libraries/pixelarticons.json'
  },
  {
    id: 'hugeicons',
    label: 'Hugeicons (Free)',
    name: 'Hugeicons (Free)',
    url: 'https://hugeicons.com/',
    license: 'MIT (Free)',
    jsonPath: './demo/libraries/hugeicons.json'
  },
  {
    id: 'demo',
    label: 'Demo Webfont',
    name: 'Demo Webfont (WOFF2/TTF)',
    url: 'https://github.com/cesaroeduardo/icon-library-visualization',
    license: 'MIT'
  }
]

interface IconExplorerProps {
  lang: Lang
  demoFontIcons: DemoIcon[]
  demoFontFamily: string
  loadingDemoFont: boolean
}

const PAGE_SIZE = 60
const libraryCache = new Map<string, DemoIcon[]>()

function prepareSvg(raw: string, dimension: number) {
  let svg = raw
  if (!svg.includes('viewBox')) {
    svg = svg.replace('<svg', '<svg viewBox="0 0 24 24"')
  }
  svg = svg.replace(/\s*(width|height)="[^"]*"/g, '')
  svg = svg.replace('<svg', `<svg width="${dimension}" height="${dimension}"`)
  if (!svg.includes('xmlns=')) {
    svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
  }
  return svg
}

export function IconExplorer({
  lang,
  demoFontIcons,
  demoFontFamily,
  loadingDemoFont
}: IconExplorerProps) {
  const t = copy[lang].explorer
  const [selectedLibId, setSelectedLibId] = useState<LibraryPreset['id']>('phosphor')
  const [loadedIcons, setLoadedIcons] = useState<DemoIcon[]>([])
  const [loadingLib, setLoadingLib] = useState(true)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'default' | 'az'>('default')
  const [size, setSize] = useState<16 | 24 | 48>(24)
  const [page, setPage] = useState(1)
  const [feedback, setFeedback] = useState<{ key: string; label: string } | null>(null)

  const currentLib = DEMO_LIBRARIES.find((l) => l.id === selectedLibId) || DEMO_LIBRARIES[0]

  useEffect(() => {
    let active = true
    if (selectedLibId === 'demo') {
      setLoadedIcons(demoFontIcons)
      setLoadingLib(loadingDemoFont)
      return
    }

    const cached = libraryCache.get(selectedLibId)
    if (cached) {
      setLoadedIcons(cached)
      setLoadingLib(false)
      return
    }

    const preset = DEMO_LIBRARIES.find((l) => l.id === selectedLibId)
    if (!preset?.jsonPath) return

    setLoadingLib(true)
    fetch(preset.jsonPath)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return
        const list: DemoIcon[] = data.icons || []
        libraryCache.set(selectedLibId, list)
        setLoadedIcons(list)
      })
      .catch((e) => {
        console.error('Failed to load library:', selectedLibId, e)
      })
      .finally(() => {
        if (active) setLoadingLib(false)
      })

    return () => {
      active = false
    }
  }, [selectedLibId, demoFontIcons, loadingDemoFont])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = q
      ? loadedIcons.filter(
          (i) => i.name.toLowerCase().includes(q) || i.keywords.toLowerCase().includes(q)
        )
      : loadedIcons
    if (sort === 'az') {
      return [...base].sort((a, b) => a.name.localeCompare(b.name))
    }
    return base
  }, [loadedIcons, query, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const sliceStart = (safePage - 1) * PAGE_SIZE
  const visible = filtered.slice(sliceStart, sliceStart + PAGE_SIZE)

  function showFeedback(key: string, label: string) {
    setFeedback({ key, label })
    setTimeout(() => {
      setFeedback((prev) => (prev?.key === key ? null : prev))
    }, 1400)
  }

  async function handleCopyCode(item: DemoIcon) {
    const snippet = `<i class="${item.icon}"></i>`
    try {
      await navigator.clipboard.writeText(snippet)
      showFeedback(`code:${item.name}`, t.copiedToast.replace('{snippet}', snippet))
    } catch {
      // ignore
    }
  }

  async function handleCopySvg(item: DemoIcon) {
    if (!item.svg) return
    try {
      const svg = prepareSvg(item.svg, size)
      await navigator.clipboard.writeText(svg)
      showFeedback(
        `svg:${item.name}`,
        lang === 'pt' ? `SVG copiado: ${item.name}.svg` : `Copied SVG: ${item.name}.svg`
      )
    } catch {
      // ignore
    }
  }

  function handleDownloadSvg(item: DemoIcon) {
    if (!item.svg) return
    const svg = prepareSvg(item.svg, size)
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${item.name.toLowerCase()}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showFeedback(
      `dl:${item.name}`,
      lang === 'pt' ? `Baixado: ${item.name}.svg` : `Downloaded: ${item.name}.svg`
    )
  }

  return (
    <section id="explorer" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] leading-[1.08]">
            <span className="font-mono font-normal text-muted-foreground block sm:inline">
              {t.heading1}{' '}
            </span>
            <span>{t.heading2}</span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">{t.desc}</p>
      </div>

      {/* TUFFUI Layered Shell -> Panel Explorer */}
      <Shell>
        {/* Library Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-2 pb-1">
          <div className="flex flex-wrap items-center gap-1">
            {DEMO_LIBRARIES.map((lib) => {
              const active = lib.id === selectedLibId
              return (
                <button
                  key={lib.id}
                  onClick={() => {
                    setSelectedLibId(lib.id)
                    setPage(1)
                    setQuery('')
                  }}
                  className={`h-8 px-3.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-foreground text-background'
                      : 'bg-foreground/[0.05] text-muted-foreground hover:bg-foreground/[0.09] hover:text-foreground'
                  }`}
                >
                  {lib.label}
                </button>
              )
            })}
          </div>

          <ActionLink href="./studio/#create-own" variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'pt' ? 'Criar minha própria' : 'Create my own'}</span>
          </ActionLink>
        </div>

        {/* Search & Controls Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 p-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder={
                lang === 'pt'
                  ? `Buscar em ${loadedIcons.length} ícones de ${currentLib.name}...`
                  : `Search ${loadedIcons.length} icons in ${currentLib.name}...`
              }
              className="w-full h-9 rounded-full pl-9 pr-9 text-sm bg-foreground/[0.06] hover:bg-foreground/[0.08] focus-visible:bg-foreground/[0.1] text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand/55 transition-colors"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('')
                  setPage(1)
                }}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full inline-flex items-center justify-center text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full bg-foreground/[0.05] p-0.5">
              <button
                onClick={() => setSort('default')}
                className={`h-7 px-3 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  sort === 'default'
                    ? 'bg-surface-raised text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.sortDefault}
              </button>
              <button
                onClick={() => setSort('az')}
                className={`h-7 px-3 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  sort === 'az'
                    ? 'bg-surface-raised text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.sortAlpha}
              </button>
            </div>

            <div className="inline-flex items-center rounded-full bg-foreground/[0.05] p-0.5 font-mono">
              {([16, 24, 48] as const).map((px) => (
                <button
                  key={px}
                  onClick={() => setSize(px)}
                  className={`h-7 px-2.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                    size === px
                      ? 'bg-surface-raised text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {px}px
                </button>
              ))}
            </div>

            <ActionLink href={`./studio/#lib-${selectedLibId}`} variant="secondary" size="sm">
              <span>{t.openFull}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </ActionLink>
          </div>
        </div>

        {/* Inner Panel holding the Icon Grid */}
        <Panel className="p-3 sm:p-4">
          {feedback && (
            <div className="mb-3 flex justify-end">
              <StatusPill tone="positive" size="sm">
                <Check className="w-3 h-3" />
                <span>{feedback.label}</span>
              </StatusPill>
            </div>
          )}

          {loadingLib ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {Array.from({ length: 24 }).map((_, idx) => (
                <div key={idx} className="h-28 rounded-2xl bg-foreground/[0.04] animate-pulse" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">{t.empty}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
              {visible.map((item) => {
                const copiedCode = feedback?.key === `code:${item.name}`
                const copiedSvg = feedback?.key === `svg:${item.name}`
                return (
                  <div
                    key={item.name}
                    className="group relative flex flex-col items-center justify-center rounded-2xl bg-foreground/[0.03] hover:bg-foreground/[0.07] p-3 min-h-[116px] transition-colors"
                  >
                    <span
                      className="absolute top-2.5 left-3 right-3 text-[10px] font-mono text-muted-foreground truncate"
                      title={item.name}
                    >
                      {item.name}
                    </span>

                    {selectedLibId === 'demo' && item.char ? (
                      <span
                        className="leading-none text-foreground pt-3 transition-transform group-hover:scale-105"
                        style={{
                          fontFamily: demoFontFamily ? `'${demoFontFamily}'` : undefined,
                          fontSize: `${size}px`
                        }}
                      >
                        {item.char}
                      </span>
                    ) : item.svg ? (
                      <span
                        className="inline-flex items-center justify-center text-foreground pt-3 transition-transform group-hover:scale-105"
                        style={{ width: `${size}px`, height: `${size}px` }}
                        dangerouslySetInnerHTML={{ __html: prepareSvg(item.svg, size) }}
                      />
                    ) : null}

                    {/* Hover Action Pill Bar: Copy Code, Copy SVG, Download SVG */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-0.5 p-1 rounded-full bg-surface-raised opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={() => handleCopyCode(item)}
                        title={lang === 'pt' ? 'Copiar código HTML' : 'Copy HTML code'}
                        className="h-6 w-6 rounded-full inline-flex items-center justify-center text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground cursor-pointer transition-colors"
                      >
                        {copiedCode ? (
                          <Check className="w-3.5 h-3.5 text-positive" />
                        ) : (
                          <Code2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopySvg(item)}
                        title={lang === 'pt' ? 'Copiar imagem SVG' : 'Copy SVG image'}
                        className="h-6 w-6 rounded-full inline-flex items-center justify-center text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground cursor-pointer transition-colors"
                      >
                        {copiedSvg ? (
                          <Check className="w-3.5 h-3.5 text-positive" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDownloadSvg(item)}
                        title={lang === 'pt' ? 'Baixar SVG' : 'Download SVG'}
                        className="h-6 w-6 rounded-full inline-flex items-center justify-center text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground cursor-pointer transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Panel>

        {/* Credits + Pagination Footer inside Shell */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 py-2.5 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              {lang === 'pt' ? 'Créditos:' : 'Credits:'}{' '}
              <strong className="text-foreground font-medium">{currentLib.name}</strong>
            </span>
            <Tag>{currentLib.license}</Tag>
            <a
              href={currentLib.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brand hover:underline font-medium"
            >
              <span>{lang === 'pt' ? 'Visitar site oficial' : 'Visit official site'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono mr-2">
              {filtered.length === 0
                ? '0'
                : t.showing
                    .replace('{from}', String(sliceStart + 1))
                    .replace('{to}', String(Math.min(sliceStart + PAGE_SIZE, filtered.length)))
                    .replace('{total}', String(filtered.length))}
            </span>
            <ActionButton
              variant="quiet"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              {t.prev}
            </ActionButton>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pNum = idx + 1
              return (
                <button
                  key={pNum}
                  onClick={() => setPage(pNum)}
                  className={`h-7 w-7 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                    pNum === safePage
                      ? 'bg-foreground text-background font-semibold'
                      : 'text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground'
                  }`}
                >
                  {pNum}
                </button>
              )
            })}
            <ActionButton
              variant="quiet"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              {t.next}
            </ActionButton>
          </div>
        </div>
      </Shell>
    </section>
  )
}
