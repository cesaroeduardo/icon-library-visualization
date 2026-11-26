import { useState } from 'react'
import {
  Sparkles,
  Tags,
  Download,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  BookOpen
} from 'lucide-react'
import {
  Shell,
  Panel,
  IconTile,
  StatusPill,
  Tag,
  ActionButton,
  ActionLink
} from '@/components/ui/tuff'
import {
  AgentCanvasShowcase,
  ClaudeMark,
  OpenAIMark,
  CursorMark,
  GeminiMark
} from '@/components/AgentCanvasShowcase'
import type { Lang } from '@/content'

interface SkillsSectionProps {
  lang: Lang
  onOpenDocs: () => void
}

export function SkillsSection({ lang, onOpenDocs }: SkillsSectionProps) {
  const [copiedCmd, setCopiedCmd] = useState(false)
  const installCmd = 'unzip create-icons.zip -d .agents/skills/'

  const isPt = lang === 'pt'

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(installCmd)
      setCopiedCmd(true)
      setTimeout(() => setCopiedCmd(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-3">
          <StatusPill tone="brand" size="md">
            <Sparkles className="w-3 h-3" />
            <span>{isPt ? 'Skills para Agentes de IA' : 'AI Coding Agent Skills'}</span>
          </StatusPill>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] leading-[1.08]">
            <span className="font-mono font-normal text-muted-foreground block sm:inline">
              {isPt ? 'Crie e catalogue.' : 'Generate & catalog.'}{' '}
            </span>
            <span>{isPt ? 'Com o seu agente de IA.' : 'With your AI agent.'}</span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          {isPt
            ? 'O repositório inclui duas skills prontas em skills/ para qualquer agente compatível com SKILL.md: uma para desenhar ícones originais alinhados ao seu design system e outra para gerar catalog.json com keywords bilíngues.'
            : 'The repository ships two ready-to-use skills inside skills/ for any SKILL.md-compatible agent: one to draw original icons matched to your design system and another to generate a searchable catalog.json.'}
        </p>
      </div>

      {/* Live Animated Claude Agent Drawing on 24x24 Canvas */}
      <AgentCanvasShowcase lang={lang} />

      {/* Works With Any Model + Copyable Command Strip (inspired by uploaded reference) */}
      <Shell className="mb-4">
        <Panel className="px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <span className="text-sm text-muted-foreground font-medium">
              {isPt ? 'Funciona com' : 'Works with'}
            </span>

            {/* Overlapping Circular Model Badges */}
            <div className="flex items-center -space-x-2.5">
              <span
                title="Claude (Anthropic)"
                className="h-10 w-10 rounded-full flex items-center justify-center text-white ring-2 ring-surface-inset z-40"
                style={{ backgroundColor: '#D97757' }}
              >
                <ClaudeMark className="w-5 h-5" />
              </span>
              <span
                title="OpenAI / Codex"
                className="h-10 w-10 rounded-full bg-[#F4F4F5] text-[#111111] flex items-center justify-center ring-2 ring-surface-inset z-30"
              >
                <OpenAIMark className="w-5 h-5" />
              </span>
              <span
                title="Cursor"
                className="h-10 w-10 rounded-full bg-[#F4F4F5] text-[#111111] flex items-center justify-center ring-2 ring-surface-inset z-20"
              >
                <CursorMark className="w-5 h-5" />
              </span>
              <span
                title="Gemini / Antigravity"
                className="h-10 w-10 rounded-full bg-[#F4F4F5] text-[#111111] flex items-center justify-center ring-2 ring-surface-inset z-10"
              >
                <GeminiMark className="w-5 h-5" />
              </span>
            </div>

            {/* Dark Pill Command Box with Copy */}
            <div className="inline-flex items-center gap-3 rounded-2xl bg-foreground/[0.05] px-4 py-2.5">
              <code className="font-mono text-xs sm:text-[0.8125rem] text-foreground">
                <span className="text-muted-foreground select-none">$ </span>
                {installCmd}
              </code>
              <button
                onClick={handleCopy}
                aria-label={isPt ? 'Copiar comando' : 'Copy command'}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {copiedCmd ? (
                  <Check className="w-4 h-4 text-positive" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <ActionLink href="./studio/#create-own" variant="secondary" size="sm" className="shrink-0">
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
              <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
                <li>
                  {isPt
                    ? '8 estilos iniciais: duotone, outline, solid, 3D gradient, app icon, flat, pixel e hand-drawn.'
                    : '8 starter styles: duotone, outline, solid, 3D gradient, app icon, flat, pixel, and hand-drawn.'}
                </li>
                <li>
                  {isPt
                    ? 'Validação automática de grid, live area e contraste antes do build.'
                    : 'Automatic grid, live area, and contrast validation before every build.'}
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ActionLink
                href="./skills/create-icons.zip"
                download="create-icons.zip"
                variant="primary"
                size="sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isPt ? 'Baixar create-icons.zip' : 'Download create-icons.zip'}</span>
              </ActionLink>
              <ActionLink
                href="./style-gallery.html"
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="sm"
              >
                <span>{isPt ? 'Preview dos 8 estilos' : 'Preview 8 styles'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </ActionLink>
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
              <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
                <li>
                  {isPt
                    ? 'Modo --merge preserva palavras-chave curadas manualmente ao adicionar novos ícones.'
                    : '--merge mode preserves hand-curated keywords when adding new icons.'}
                </li>
                <li>
                  {isPt
                    ? 'Validador integrado (--validate) garante kebab-case, unicidade e zero duplicatas.'
                    : 'Built-in --validate checker enforces kebab-case, uniqueness, and clean tags.'}
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ActionLink
                href="./skills/catalog-icons.zip"
                download="catalog-icons.zip"
                variant="primary"
                size="sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isPt ? 'Baixar catalog-icons.zip' : 'Download catalog-icons.zip'}</span>
              </ActionLink>
              <ActionButton onClick={onOpenDocs} variant="secondary" size="sm">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isPt ? 'Ler guia nas Docs' : 'Read guide in Docs'}</span>
              </ActionButton>
            </div>
          </Panel>
        </Shell>
      </div>
    </section>
  )
}
