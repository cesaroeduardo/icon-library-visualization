import { useState } from 'react'
import {
  Sparkles,
  Tags,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  BookOpen,
  Github,
  Server
} from 'lucide-react'
import {
  Shell,
  Panel,
  Inset,
  IconTile,
  StatusPill,
  Tag,
  ActionButton,
  ActionLink
} from '@/components/ui/tuff'
import {
  AgentCanvasShowcase,
  AGENT_MODELS,
  AGENT_MODEL_ORDER,
  type AgentId
} from '@/components/AgentCanvasShowcase'
import { GITHUB_URL, type Lang } from '@/content'

interface SkillsSectionProps {
  lang: Lang
  onOpenDocs: (section?: string) => void
}

const CMD_ALL = 'npx skills add cesaroeduardo/icon-library-visualization'
const CMD_CREATE = 'npx skills add cesaroeduardo/icon-library-visualization --skill create-icons'
const CMD_CATALOG = 'npx skills add cesaroeduardo/icon-library-visualization --skill catalog-icons'

export function SkillsSection({ lang, onOpenDocs }: SkillsSectionProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [hoveredAgent, setHoveredAgent] = useState<AgentId | null>(null)
  const isPt = lang === 'pt'
  const activeAgent = hoveredAgent ?? 'claude'

  async function handleCopy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev))
      }, 1500)
    } catch {
      // ignore
    }
  }

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] leading-[1.08]">
            <span className="font-mono font-normal text-muted-foreground block sm:inline">
              {isPt ? 'Crie e catalogue.' : 'Generate & catalog.'}{' '}
            </span>
            <span>{isPt ? 'Com o seu agente de IA.' : 'With your AI agent.'}</span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          {isPt
            ? 'Instale direto do nosso repositório GitHub em qualquer agente compatível com SKILL.md: uma skill para desenhar ícones originais alinhados ao seu design system e outra para gerar catalog.json com keywords bilíngues.'
            : 'Install straight from our GitHub repository into any SKILL.md-compatible agent: one skill to draw original icons matched to your design system and another to generate a searchable catalog.json.'}
        </p>
      </div>

      {/* Live Animated Agent Drawing on 24x24 Canvas */}
      <AgentCanvasShowcase lang={lang} activeAgent={activeAgent} />

      {/* Works With Any Model + Copyable npx skills add Command Strip */}
      <Shell className="mb-4">
        <Panel className="px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <span className="text-sm text-muted-foreground font-medium">
              {isPt ? 'Funciona com' : 'Works with'}
            </span>

            {/* Overlapping Circular Model Badges */}
            <div
              className="flex items-center -space-x-2.5"
              onMouseLeave={() => setHoveredAgent(null)}
            >
              {AGENT_MODEL_ORDER.map((id, index) => {
                const model = AGENT_MODELS[id]
                const Mark = model.Mark
                const isHovered = hoveredAgent === id
                const isClaude = id === 'claude'
                return (
                  <button
                    key={id}
                    type="button"
                    title={model.title}
                    aria-label={model.title}
                    onMouseEnter={() => setHoveredAgent(id)}
                    onFocus={() => setHoveredAgent(id)}
                    onBlur={() => setHoveredAgent(null)}
                    className={[
                      'h-10 w-10 rounded-full flex items-center justify-center ring-2 ring-surface-inset',
                      'transition-transform duration-300 ease-out will-change-transform cursor-pointer',
                      isHovered ? '-translate-y-1.5 scale-110 shadow-md' : 'translate-y-0 scale-100',
                      isClaude ? 'text-white' : 'bg-[#F4F4F5] text-[#111111]'
                    ].join(' ')}
                    style={{
                      backgroundColor: isClaude ? model.color : undefined,
                      zIndex: isHovered ? 50 : 40 - index
                    }}
                  >
                    <Mark className="w-5 h-5" />
                  </button>
                )
              })}
            </div>

            {/* Dark Pill Command Box with Copy */}
            <div className="inline-flex items-center gap-3 rounded-2xl bg-foreground/[0.05] px-4 py-2.5 max-w-full">
              <code className="font-mono text-xs sm:text-[0.8125rem] text-foreground truncate">
                <span className="text-muted-foreground select-none">$ </span>
                {CMD_ALL}
              </code>
              <button
                onClick={() => handleCopy('all', CMD_ALL)}
                aria-label={isPt ? 'Copiar comando' : 'Copy command'}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
              >
                {copiedKey === 'all' ? (
                  <Check className="w-4 h-4 text-positive" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <ActionLink href="/studio/#create-own" variant="secondary" size="sm" className="shrink-0">
            <span>{isPt ? 'Criar minha própria Library' : 'Create my own Library'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </ActionLink>
        </Panel>
      </Shell>

      {/* Two Skill Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Skill 1: create-icons */}
        <Shell className="flex flex-col">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2.5">
              <IconTile>
                <Sparkles className="w-4 h-4" />
              </IconTile>
              <div>
                <div className="text-sm font-semibold tracking-[-0.015em]">create-icons</div>
                <div className="text-[11px] font-mono text-muted-foreground">skills/create-icons</div>
              </div>
            </div>
            <Tag>8 STYLES · SVG + JSON</Tag>
          </div>
          <Panel className="flex-1 p-5 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isPt
                  ? 'Escaneia os tokens CSS/Tailwind do seu projeto, gera um style sheet explícito (icon-style.json), prova o estilo em uma amostra e desenha SVGs originais + componentes + catalog.json.'
                  : 'Scans your project’s CSS/Tailwind tokens, writes an explicit style sheet (icon-style.json), proves the style on a sample, and draws original SVGs + framework components + catalog.json.'}
              </p>

              <p className="text-xs text-muted-foreground">
                {isPt ? 'Inspirada na skill de ' : 'Inspired by '}
                <a
                  href="https://x.com/banhosdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline font-medium"
                >
                  @banhosdev
                </a>{' '}
                (
                <a
                  href="https://github.com/sergiobanhos/generate-icons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline font-mono text-[11px]"
                >
                  sergiobanhos/generate-icons
                </a>
                ).
              </p>

              <Inset className="px-3 py-2.5 flex items-center justify-between gap-2">
                <code className="font-mono text-[11px] text-foreground truncate">
                  <span className="text-muted-foreground select-none">$ </span>
                  {CMD_CREATE}
                </code>
                <button
                  onClick={() => handleCopy('create', CMD_CREATE)}
                  aria-label={isPt ? 'Copiar comando create-icons' : 'Copy create-icons command'}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                >
                  {copiedKey === 'create' ? (
                    <Check className="w-3.5 h-3.5 text-positive" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </Inset>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ActionLink
                href={`${GITHUB_URL}/tree/main/skills/create-icons`}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="sm"
              >
                <Github className="w-3.5 h-3.5" />
                <span>{isPt ? 'Ver no GitHub' : 'View on GitHub'}</span>
              </ActionLink>
              <ActionButton
                onClick={() => onOpenDocs('ai-skills')}
                variant="quiet"
                size="sm"
              >
                <span>{isPt ? 'Preview dos 8 estilos' : 'Preview 8 styles'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </ActionButton>
            </div>
          </Panel>
        </Shell>

        {/* Skill 2: catalog-icons */}
        <Shell className="flex flex-col">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2.5">
              <IconTile>
                <Tags className="w-4 h-4" />
              </IconTile>
              <div>
                <div className="text-sm font-semibold tracking-[-0.015em]">catalog-icons</div>
                <div className="text-[11px] font-mono text-muted-foreground">skills/catalog-icons</div>
              </div>
            </div>
            <Tag>CATALOG.JSON · KEYWORDS</Tag>
          </div>
          <Panel className="flex-1 p-5 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isPt
                  ? 'Escaneia qualquer pasta de SVGs ou arquivo .css de webfont e gera um catalog.json enriquecido com nomes legíveis, categorias e sinônimos bilíngues para busca instantânea na library.'
                  : 'Scans any SVG folder or webfont .css file and builds a validated catalog.json enriched with human labels, category groups, and bilingual search keywords.'}
              </p>

              <Inset className="px-3 py-2.5 flex items-center justify-between gap-2">
                <code className="font-mono text-[11px] text-foreground truncate">
                  <span className="text-muted-foreground select-none">$ </span>
                  {CMD_CATALOG}
                </code>
                <button
                  onClick={() => handleCopy('catalog', CMD_CATALOG)}
                  aria-label={isPt ? 'Copiar comando catalog-icons' : 'Copy catalog-icons command'}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                >
                  {copiedKey === 'catalog' ? (
                    <Check className="w-3.5 h-3.5 text-positive" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </Inset>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ActionLink
                href={`${GITHUB_URL}/tree/main/skills/catalog-icons`}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="sm"
              >
                <Github className="w-3.5 h-3.5" />
                <span>{isPt ? 'Ver no GitHub' : 'View on GitHub'}</span>
              </ActionLink>
              <ActionButton onClick={() => onOpenDocs('ai-skills')} variant="quiet" size="sm">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isPt ? 'Ler guia nas Docs' : 'Read guide in Docs'}</span>
              </ActionButton>
            </div>
          </Panel>
        </Shell>
      </div>

      {/* Self-host callout under Create / Catalog */}
      <Shell className="mt-4">
        <Panel className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <IconTile>
              <Server className="w-4 h-4" />
            </IconTile>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold tracking-[-0.015em]">
                  {isPt ? 'Hospede a galeria só com os seus ícones' : 'Host a gallery with only your icons'}
                </p>
                <Tag>apps/selfhost</Tag>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                {isPt
                  ? 'Quer um site só da sua library, sem demos de terceiros? Coloque os SVGs na pasta icons/, troque a logo, rode o build e publique. O arquivo catalog.json é opcional: melhora a busca, mas não é obrigatório.'
                  : 'Want a site with only your library, with no third-party demos? Drop SVGs in the icons/ folder, swap the logo, run the build, and publish. catalog.json is optional: it improves search, but you can skip it.'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <ActionLink
              href={`${GITHUB_URL}/tree/main/apps/selfhost`}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
            >
              <Github className="w-3.5 h-3.5" />
              <span>apps/selfhost</span>
            </ActionLink>
            <ActionButton onClick={() => onOpenDocs('selfhost')} variant="quiet" size="sm">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isPt ? 'Guia de self-host' : 'Self-host guide'}</span>
            </ActionButton>
          </div>
        </Panel>
      </Shell>
    </section>
  )
}
