import { useEffect, useState } from 'react'
import { ArrowLeft, Copy, Check, ArrowUpRight, Eye, Lightbulb, Info } from 'lucide-react'
import { Shell, Panel, Inset, StatusPill, Tag, ActionButton, ActionLink } from '@/components/ui/tuff'
import { SkillStylesPreview } from '@/components/SkillStylesPreview'
import { docsContent } from '@/docsContent'
import type { Lang } from '@/content'

interface DocsViewProps {
  lang: Lang
  initialSection?: string
  onBack: () => void
}

function TuffCodeBlock({
  title,
  language,
  code,
  copyLabel,
  copiedLabel
}: {
  title: string
  language: string
  code: string
  copyLabel: string
  copiedLabel: string
}) {
  const [copied, setCopied] = useState(false)
  const lines = code.split('\n')

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // ignore
    }
  }

  return (
    <Shell>
      <div className="flex items-center justify-between px-3 py-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-[0.8125rem] text-foreground truncate">{title}</span>
          <Tag>{language}</Tag>
        </div>
        <ActionButton variant="quiet" size="sm" className="h-7 px-2.5" onClick={handleCopy}>
          {copied ? <Check className="w-3.5 h-3.5 text-positive" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="text-xs">{copied ? copiedLabel : copyLabel}</span>
        </ActionButton>
      </div>
      <Panel className="overflow-x-auto p-4">
        <pre className="font-mono text-[0.8125rem] leading-6 text-foreground">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="w-7 shrink-0 select-none text-right pr-4 text-muted-foreground/50">
                  {i + 1}
                </span>
                <span className="whitespace-pre">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </Panel>
    </Shell>
  )
}

export function DocsView({ lang, initialSection, onBack }: DocsViewProps) {
  const doc = docsContent[lang]
  const [activeId, setActiveId] = useState(initialSection || doc.sections[0].id)

  useEffect(() => {
    if (initialSection) {
      setActiveId(initialSection)
      setTimeout(() => {
        document.getElementById(`tuff-doc-${initialSection}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }, 60)
    }
  }, [initialSection])

  const grouped = [
    { key: 'gettingStarted' as const, label: doc.groups.gettingStarted },
    { key: 'guides' as const, label: doc.groups.guides },
    { key: 'reference' as const, label: doc.groups.reference }
  ]

  function jumpTo(id: string) {
    setActiveId(id)
    const el = document.getElementById(`tuff-doc-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
        <ActionButton variant="quiet" size="sm" onClick={onBack}>
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{doc.backSite}</span>
        </ActionButton>

        <div className="flex items-center gap-2">
          <ActionLink href="/studio/" variant="secondary" size="sm">
            <Eye className="w-3.5 h-3.5" />
            <span>{doc.tryDemo}</span>
          </ActionLink>
          <ActionLink href="/studio/#create-own" variant="primary" size="sm">
            <span>{doc.openStudio}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </ActionLink>
        </div>
      </div>

      {/* TUFFUI Docs Layout: Minimal Borderless Left Sidebar + Clean Prose Column */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-14 items-start">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 space-y-6">
          {grouped.map((grp) => {
            const items = doc.sections.filter((s) => s.group === grp.key)
            return (
              <div key={grp.key} className="space-y-1.5">
                <div className="px-3 text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">
                  {grp.label}
                </div>
                <nav className="flex flex-col gap-0.5">
                  {items.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => jumpTo(sec.id)}
                      className={`text-left px-3 py-1.5 rounded-full text-[0.8125rem] font-medium transition-colors cursor-pointer ${
                        activeId === sec.id
                          ? 'bg-foreground/[0.08] text-foreground'
                          : 'text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground'
                      }`}
                    >
                      {sec.nav}
                    </button>
                  ))}
                </nav>
              </div>
            )
          })}
        </aside>

        {/* Main Docs Content */}
        <article className="min-w-0 max-w-3xl space-y-14 pb-20">
          {/* Header */}
          <header className="space-y-4 pb-8 border-b border-border">
            <StatusPill tone="brand" size="md">
              {doc.badge}
            </StatusPill>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] leading-[1.1]">
              {doc.title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">{doc.subtitle}</p>
          </header>

          {/* Sections */}
          {doc.sections.map((sec) => (
            <section
              key={sec.id}
              id={`tuff-doc-${sec.id}`}
              className="scroll-mt-24 space-y-5 pb-12 border-b border-border last:border-b-0 last:pb-0"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-[-0.025em]">{sec.title}</h2>
                <p className="text-[0.9375rem] text-foreground/90 leading-relaxed">{sec.lead}</p>
              </div>

              {sec.paragraphs?.map((p, idx) => (
                <p key={idx} className="text-sm text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}

              {/* TUFFUI Callout (Shell -> Inset) */}
              {sec.callout && (
                <Shell>
                  <Panel className="p-4 flex items-start gap-3">
                    <StatusPill
                      tone={sec.callout.type === 'tip' ? 'positive' : 'brand'}
                      size="sm"
                      className="mt-0.5 shrink-0"
                    >
                      {sec.callout.type === 'tip' ? (
                        <Lightbulb className="w-3 h-3" />
                      ) : (
                        <Info className="w-3 h-3" />
                      )}
                      <span>{sec.callout.type === 'tip' ? 'Tip' : 'Note'}</span>
                    </StatusPill>
                    <div className="space-y-1 text-[0.8125rem] leading-relaxed">
                      <div className="font-medium text-foreground">{sec.callout.title}</div>
                      <p className="text-muted-foreground">{sec.callout.body}</p>
                    </div>
                  </Panel>
                </Shell>
              )}

              {sec.bullets && (
                <ul className="space-y-2 pl-5 list-disc text-sm text-muted-foreground">
                  {sec.bullets.map((b, i) => (
                    <li key={i} className="leading-relaxed">
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {/* TUFFUI Table (Shell -> Panel) */}
              {sec.table && (
                <Shell>
                  <Panel className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[0.8125rem]">
                      <thead>
                        <tr className="border-b border-border">
                          {sec.table.headers.map((h, i) => (
                            <th key={i} className="py-3 px-4 font-medium text-foreground">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {sec.table.rows.map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td
                                key={ci}
                                className={`py-3 px-4 align-top leading-relaxed ${
                                  ci === 0
                                    ? 'font-mono text-xs font-medium text-foreground whitespace-nowrap'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Panel>
                </Shell>
              )}

              {/* Code Block */}
              {sec.code && (
                <TuffCodeBlock
                  title={sec.codeTitle || 'example'}
                  language={sec.codeLang || 'code'}
                  code={sec.code}
                  copyLabel={doc.copy}
                  copiedLabel={doc.copied}
                />
              )}

              {/* Extra Section (catalog.json) */}
              {sec.extraTitle && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-semibold tracking-[-0.02em]">{sec.extraTitle}</h3>
                  {sec.extraBody && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{sec.extraBody}</p>
                  )}
                  {sec.extraCode && (
                    <TuffCodeBlock
                      title="catalog.json"
                      language={sec.extraLang || 'json'}
                      code={sec.extraCode}
                      copyLabel={doc.copy}
                      copiedLabel={doc.copied}
                    />
                  )}
                </div>
              )}

              {/* Subsections */}
              {sec.subsections && (
                <div className="space-y-6 pt-1">
                  {sec.subsections.map((sub, si) => (
                    <Inset key={si} className="p-5 space-y-3">
                      <h3 className="text-base font-semibold tracking-[-0.02em] text-foreground">
                        {sub.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{sub.body}</p>
                      {sub.bullets && (
                        <ul className="space-y-1.5 pl-5 list-disc text-[0.8125rem] text-muted-foreground">
                          {sub.bullets.map((b, bi) => (
                            <li key={bi} className="leading-relaxed">
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                      {sub.code && (
                        <div className="pt-1">
                          <TuffCodeBlock
                            title={sub.title}
                            language={sub.codeLang || 'code'}
                            code={sub.code}
                            copyLabel={doc.copy}
                            copiedLabel={doc.copied}
                          />
                        </div>
                      )}
                    </Inset>
                  ))}
                </div>
              )}

              {/* Embedded Native TUFFUI 8 Starter Styles Preview */}
              {sec.showSkillStyles && (
                <>
                  <Shell>
                    <Panel className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span>
                        {lang === 'pt'
                          ? 'A skill create-icons foi inspirada no trabalho open source de '
                          : 'The create-icons skill was inspired by the open-source work of '}
                        <a
                          href="https://x.com/banhosdev"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand hover:underline font-medium"
                        >
                          @banhosdev
                        </a>
                        .
                      </span>
                      <a
                        href="https://github.com/sergiobanhos/generate-icons"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-brand hover:underline"
                      >
                        <span>github.com/sergiobanhos/generate-icons</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </Panel>
                  </Shell>
                  <SkillStylesPreview lang={lang} />
                </>
              )}
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}
