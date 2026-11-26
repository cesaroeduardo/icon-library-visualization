import { useMemo, useState } from 'react'
import { Search, X, Check, ArrowUpRight } from 'lucide-react'
import { Shell, Panel, Inset, StatusPill, ActionButton, ActionLink } from '@/components/ui/tuff'
import { copy, type Lang } from '@/content'

export interface DemoIcon {
  name: string
  icon: string
  keywords: string
  char: string
}

interface IconExplorerProps {
  lang: Lang
  icons: DemoIcon[]
  fontFamily: string
  loading: boolean
}

const PAGE_SIZE = 60

export function IconExplorer({ lang, icons, fontFamily, loading }: IconExplorerProps) {
  const t = copy[lang].explorer
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'default' | 'az'>('default')
  const [size, setSize] = useState<16 | 24 | 48>(24)
  const [page, setPage] = useState(1)
  const [copiedName, setCopiedName] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = q
      ? icons.filter(
          (i) => i.name.toLowerCase().includes(q) || i.keywords.toLowerCase().includes(q)
        )
      : icons
    if (sort === 'az') {
      return [...base].sort((a, b) => a.name.localeCompare(b.name))
    }
    return base
  }, [icons, query, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const sliceStart = (safePage - 1) * PAGE_SIZE
  const visible = filtered.slice(sliceStart, sliceStart + PAGE_SIZE)

  async function handleCopy(item: DemoIcon) {
    const snippet = `<i class="${item.icon}"></i>`
    try {
      await navigator.clipboard.writeText(snippet)
      setCopiedName(item.name)
      setTimeout(() => {
        setCopiedName((prev) => (prev === item.name ? null : prev))
      }, 1400)
    } catch {
      // ignore clipboard errors
    }
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
        {/* Top Toolbar inside Shell bezel */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 p-2">
          {/* Borderless TUFFUI SearchField */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder={t.searchPlaceholder.replace('{count}', String(icons.length || 332))}
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

          {/* Right Controls: Sort + Size + Open Studio */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sort segmented pills */}
            <div className="inline-flex items-center rounded-full bg-foreground/[0.05] p-0.5">
              <button
                onClick={() => setSort('default')}
                className={`h-7 px-3 rounded-full text-xs font-medium transition-colors ${
                  sort === 'default'
                    ? 'bg-surface-raised text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.sortDefault}
              </button>
              <button
                onClick={() => setSort('az')}
                className={`h-7 px-3 rounded-full text-xs font-medium transition-colors ${
                  sort === 'az'
                    ? 'bg-surface-raised text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.sortAlpha}
              </button>
            </div>

            {/* Size segmented pills */}
            <div className="inline-flex items-center rounded-full bg-foreground/[0.05] p-0.5 font-mono">
              {([16, 24, 48] as const).map((px) => (
                <button
                  key={px}
                  onClick={() => setSize(px)}
                  className={`h-7 px-2.5 rounded-full text-[11px] font-medium transition-colors ${
                    size === px
                      ? 'bg-surface-raised text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {px}px
                </button>
              ))}
            </div>

            <ActionLink href="./studio/#demo" variant="secondary" size="sm">
              <span>{t.openFull}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </ActionLink>
          </div>
        </div>

        {/* Inner Panel holding the Icon Grid */}
        <Panel className="p-3 sm:p-4">
          {copiedName && (
            <div className="mb-3 flex justify-end">
              <StatusPill tone="positive" size="sm">
                <Check className="w-3 h-3" />
                <span>{t.copiedToast.replace('{snippet}', `<i class="ic ${copiedName}"></i>`)}</span>
              </StatusPill>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-10 gap-2">
              {Array.from({ length: 30 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-20 rounded-xl bg-foreground/[0.04] animate-pulse"
                />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">{t.empty}</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {visible.map((item) => {
                const isCopied = copiedName === item.name
                return (
                  <button
                    key={item.name}
                    onClick={() => handleCopy(item)}
                    title={`Click to copy <i class="${item.icon}"></i>`}
                    className="group relative flex flex-col items-center justify-center gap-2 rounded-xl bg-foreground/[0.03] hover:bg-foreground/[0.08] p-3 min-h-[84px] transition-colors cursor-pointer active:scale-[0.97]"
                  >
                    {isCopied && (
                      <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-positive/20 text-positive flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                    <span
                      className="leading-none text-foreground transition-transform group-hover:scale-110"
                      style={{
                        fontFamily: fontFamily ? `'${fontFamily}'` : undefined,
                        fontSize: `${size}px`
                      }}
                    >
                      {item.char}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground truncate w-full text-center">
                      {item.name}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </Panel>

        {/* Pagination Footer inside Shell */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 text-xs text-muted-foreground">
          <span className="font-mono">
            {filtered.length === 0
              ? '0'
              : t.showing
                  .replace('{from}', String(sliceStart + 1))
                  .replace('{to}', String(Math.min(sliceStart + PAGE_SIZE, filtered.length)))
                  .replace('{total}', String(filtered.length))}
          </span>

          <div className="flex items-center gap-1.5">
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
