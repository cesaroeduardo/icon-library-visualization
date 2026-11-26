import { useEffect, useState } from 'react'
import { MotionConfig, motion } from 'motion/react'
import {
  Github,
  Layers,
  Sun,
  Moon,
  Languages,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  FileType,
  FileCode2,
  Sparkles,
  Terminal,
  BookOpen
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
import { IconExplorer } from '@/components/IconExplorer'
import { SkillsSection } from '@/components/SkillsSection'
import { DocsView } from '@/components/DocsView'
import { BrandLogo } from '@/components/BrandLogo'
import { GithubStars } from '@/components/GithubStars'
import { copy, GITHUB_URL, CLONE_CMD, STUDIO_URL, AGENT_PROMPT, type Lang } from '@/content'

export function App() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('icon-library-lang')
    if (saved === 'pt' || saved === 'en') return saved
    return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
  })

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('icon-library-theme')
    return saved ? saved === 'dark' : true // TUFFUI dark default
  })

  const [copiedCmd, setCopiedCmd] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [docsSection, setDocsSection] = useState<string | undefined>(() =>
    window.location.hash.replace(/^#\/?/, '').toLowerCase() === 'docs-skills'
      ? 'ai-skills'
      : undefined
  )
  const [page, setPage] = useState<'landing' | 'docs'>(() => {
    const h = window.location.hash.replace(/^#\/?/, '').toLowerCase()
    return h === 'docs' || h === 'docs-skills' ? 'docs' : 'landing'
  })

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace(/^#\/?/, '').toLowerCase()
      if (h === 'docs-skills') {
        setDocsSection('ai-skills')
        setPage('docs')
      } else if (h === 'docs') {
        setDocsSection(undefined)
        setPage('docs')
      } else if (h === '' || h === 'home') {
        setPage('landing')
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function openDocs(section?: string) {
    setDocsSection(section)
    window.location.hash = section === 'ai-skills' ? 'docs-skills' : 'docs'
    setPage('docs')
    if (!section) window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openLanding(sectionHash = '') {
    setPage('landing')
    if (sectionHash) {
      window.location.hash = sectionHash
      setTimeout(() => {
        document.getElementById(sectionHash)?.scrollIntoView({ behavior: 'smooth' })
      }, 40)
    } else {
      history.replaceState(null, '', window.location.pathname)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const t = copy[lang]

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('icon-library-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    localStorage.setItem('icon-library-lang', lang)
  }, [lang])

  async function copyAgentPrompt() {
    try {
      await navigator.clipboard.writeText(AGENT_PROMPT[lang])
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 1500)
    } catch {
      // ignore
    }
  }

  async function copyCloneCmd() {
    try {
      await navigator.clipboard.writeText(CLONE_CMD)
      setCopiedCmd(true)
      setTimeout(() => setCopiedCmd(false), 1500)
    } catch {
      // ignore
    }
  }

  const pillarIcons = {
    webfont: FileType,
    svg: FileCode2,
    skill: Sparkles
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-hidden="true"
        className="site-noise pointer-events-none fixed inset-0 z-40 opacity-[0.04] mix-blend-overlay motion-reduce:hidden"
        style={{ backgroundImage: "url('/noise.webp')" }}
      />
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {/* Top Open-Source Announcement Strip (pixelarticons structure, TUFFUI layered surface) */}
        <div className="w-full bg-surface border-b border-border px-4 py-2">
          <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <StatusPill tone="positive" size="sm">
              MIT
            </StatusPill>
            <span>{t.announcement}</span>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-brand hover:underline"
            >
              <span>{t.announcementCta}</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
          <div className="mx-auto max-w-6xl h-14 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <button
                onClick={() => openLanding()}
                className="inline-flex items-center cursor-pointer hover:opacity-90 transition-opacity"
                aria-label="Icon Library Studio"
              >
                <BrandLogo className="h-[19px] sm:h-[22px] w-auto" />
              </button>

              <nav className="hidden md:flex items-center gap-1 text-[0.8125rem] font-medium text-muted-foreground">
                <button
                  onClick={() => openLanding('explorer')}
                  className="px-3 py-1.5 rounded-full hover:bg-foreground/[0.06] hover:text-foreground transition-colors cursor-pointer"
                >
                  {t.nav.explorer}
                </button>
                <button
                  onClick={() => openLanding('features')}
                  className="px-3 py-1.5 rounded-full hover:bg-foreground/[0.06] hover:text-foreground transition-colors cursor-pointer"
                >
                  {t.nav.features}
                </button>
                <button
                  onClick={() => openLanding('faq')}
                  className="px-3 py-1.5 rounded-full hover:bg-foreground/[0.06] hover:text-foreground transition-colors cursor-pointer"
                >
                  {t.nav.faq}
                </button>
                <button
                  onClick={() => openDocs()}
                  className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                    page === 'docs'
                      ? 'bg-foreground/[0.08] text-foreground'
                      : 'hover:bg-foreground/[0.06] hover:text-foreground'
                  }`}
                >
                  {t.nav.docs}
                </button>
                <a href={STUDIO_URL} className="px-3 py-1.5 rounded-full hover:bg-foreground/[0.06] hover:text-foreground transition-colors">
                  {t.nav.studio}
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-1.5">
              <ActionButton
                variant="quiet"
                size="sm"
                onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
                title="Switch language"
              >
                <Languages className="w-3.5 h-3.5" />
                <span className="font-mono text-xs">{lang === 'pt' ? 'PT' : 'EN'}</span>
              </ActionButton>

              <ActionButton
                variant="quiet"
                size="sm"
                className="w-8 px-0"
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </ActionButton>

              <ActionLink
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="sm"
                className="items-stretch"
              >
                <Github className="w-3.5 h-3.5 self-center" />
                <span className="hidden sm:inline self-center">{t.nav.github}</span>
                <GithubStars />
              </ActionLink>
            </div>
          </div>
        </header>

        {/* Main View: TUFFUI Docs OR Open Source Landing Page */}
        {page === 'docs' ? (
          <DocsView lang={lang} initialSection={docsSection} onBack={() => openLanding()} />
        ) : (
          <>
        {/* Hero Section (2-Column Asymmetric Split inspired by pixelarticons.com, styled with TUFFUI) */}
        <section className="hero-dot-bg border-b border-border">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Copy & CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="lg:col-span-6 space-y-6"
              >
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.035em] leading-[1.06]">
                  <span className="block font-mono font-normal text-muted-foreground">
                    {t.hero.titleLine1}
                  </span>
                  <span className="block mt-1">{t.hero.titleLine2}</span>
                </h1>

                <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                  {t.hero.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <ActionLink
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="md"
                    className="items-stretch"
                  >
                    <Github className="w-4 h-4 self-center" />
                    <span className="self-center">{t.hero.ctaPrimary}</span>
                    <GithubStars />
                  </ActionLink>

                  <ActionLink href={STUDIO_URL} variant="secondary" size="md">
                    <span>{t.hero.ctaSecondary}</span>
                    <ArrowRight className="w-4 h-4" />
                  </ActionLink>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs text-muted-foreground">
                  {t.hero.checks.map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-positive" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Right Column: TUFFUI Quickstart Shell Card */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="lg:col-span-6 space-y-4"
              >
                {/* TUFFUI Quickstart Shell -> Panel -> Inset */}
                <Shell>
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-muted-foreground" />
                      <span className="text-[0.8125rem] font-medium">{t.hero.quickTitle}</span>
                    </div>
                    <Tag>{t.hero.quickMeta}</Tag>
                  </div>

                  <Panel className="p-4 space-y-3">
                    {/* Clone command inset */}
                    <Inset className="flex items-center justify-between gap-2 px-3 py-2.5">
                      <code className="font-mono text-xs text-foreground truncate">
                        <span className="text-muted-foreground select-none">$ </span>
                        {CLONE_CMD}
                      </code>
                      <ActionButton
                        variant="quiet"
                        size="sm"
                        className="h-7 px-2.5 shrink-0"
                        onClick={copyCloneCmd}
                      >
                        {copiedCmd ? (
                          <Check className="w-3.5 h-3.5 text-positive" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span className="text-xs">{copiedCmd ? t.hero.copied : t.hero.copy}</span>
                      </ActionButton>
                    </Inset>

                    {/* Copyable AI agent prompt */}
                    <Inset className="px-3 py-2.5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                          <Sparkles className="w-3.5 h-3.5 text-brand" />
                          {lang === 'pt' ? 'Prompt para o seu agente de IA' : 'Prompt for your AI agent'}
                        </span>
                        <ActionButton
                          variant="quiet"
                          size="sm"
                          className="h-7 px-2.5 shrink-0"
                          onClick={copyAgentPrompt}
                        >
                          {copiedPrompt ? (
                            <Check className="w-3.5 h-3.5 text-positive" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span className="text-xs">{copiedPrompt ? t.hero.copied : t.hero.copy}</span>
                        </ActionButton>
                      </div>
                      <p className="font-mono text-[11px] leading-5 text-muted-foreground line-clamp-3">
                        {AGENT_PROMPT[lang]}
                      </p>
                    </Inset>

                    {/* 2x3 Quick-links grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {t.hero.quickLinks.map((ql) =>
                        'docs' in ql && ql.docs ? (
                          <button
                            key={ql.label}
                            onClick={openDocs}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-foreground/[0.03] hover:bg-foreground/[0.07] text-[0.8125rem] font-medium text-foreground transition-colors cursor-pointer"
                          >
                            <span>{ql.label}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        ) : (
                          <a
                            key={ql.label}
                            href={ql.href}
                            target={'external' in ql && ql.external ? '_blank' : undefined}
                            rel={'external' in ql && ql.external ? 'noopener noreferrer' : undefined}
                            download={'download' in ql && ql.download ? 'create-icons.zip' : undefined}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-foreground/[0.03] hover:bg-foreground/[0.07] text-[0.8125rem] font-medium text-foreground transition-colors"
                          >
                            <span>{ql.label}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                          </a>
                        )
                      )}
                    </div>
                  </Panel>
                </Shell>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Icon Explorer (Phosphor, Feather, Pixelarticons, Hugeicons) */}
        <IconExplorer lang={lang} />

        {/* Dedicated AI Skills Section right below the Library Demo */}
        <SkillsSection lang={lang} onOpenDocs={(sec) => openDocs(sec)} />

        {/* 3-Pillar Open Source Capabilities (replaces pricing section) */}
        <section id="features" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em]">
              <span className="font-mono font-normal text-muted-foreground">
                {t.pillars.heading1}{' '}
              </span>
              <span>{t.pillars.heading2}</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.pillars.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.pillars.items.map((item) => {
              const IconComp = pillarIcons[item.id]
              return (
                <Shell key={item.id} className="flex flex-col">
                  <div className="flex items-center justify-between px-2.5 py-2">
                    <IconTile>
                      <IconComp className="w-4 h-4" />
                    </IconTile>
                    <Tag>{item.tag}</Tag>
                  </div>
                  <Panel className="flex-1 p-5 flex flex-col justify-between gap-6">
                    <div className="space-y-2">
                      <h3 className="text-base font-semibold tracking-[-0.02em]">{item.title}</h3>
                      <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div>
                      {'docs' in item && item.docs ? (
                        <ActionButton
                          onClick={openDocs}
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          <span>{item.cta}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </ActionButton>
                      ) : (
                        <ActionLink href={item.href} variant="secondary" size="sm" className="w-full">
                          <span>{item.cta}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </ActionLink>
                      )}
                    </div>
                  </Panel>
                </Shell>
              )
            })}
          </div>
        </section>

        {/* Open Source Highlights Strip */}
        <section id="workflow" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <Shell>
            <Panel className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em]">
                  <span className="font-mono font-normal text-muted-foreground">
                    {t.highlights.heading1}{' '}
                  </span>
                  <span>{t.highlights.heading2}</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {t.highlights.stats.map((st) => (
                  <Inset key={st.value} className="p-4 text-center space-y-1">
                    <div className="text-2xl font-semibold font-mono tracking-tight">
                      {st.value}
                    </div>
                    <div className="text-xs text-muted-foreground leading-snug">{st.label}</div>
                  </Inset>
                ))}
              </div>
            </Panel>
          </Shell>
        </section>

        {/* FAQ Section (2-column asymmetric split like pixelarticons.com) */}
        <section id="faq" className="border-t border-border mt-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4">
                <h2 className="text-3xl font-mono font-normal tracking-[-0.03em] leading-tight">
                  {t.faq.heading}
                </h2>
              </div>
              <div className="lg:col-span-8 divide-y divide-border">
                {t.faq.items.map((item) => (
                  <div key={item.q} className="py-5 first:pt-0 last:pb-0 space-y-2">
                    <h3 className="text-sm sm:text-base font-semibold tracking-[-0.015em]">
                      {item.q}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
          </>
        )}

        {/* Footer CTA + Links */}
        <footer className="mt-auto bg-surface border-t border-border">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
            {/* Centered Open-Source CTA */}
            <div className="text-center space-y-5 pb-14 border-b border-border">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.035em]">
                <span className="font-mono font-normal text-muted-foreground block sm:inline">
                  {t.footer.ctaLine1}{' '}
                </span>
                <span>{t.footer.ctaLine2}</span>
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <ActionLink
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="md"
                  className="items-stretch"
                >
                  <Github className="w-4 h-4 self-center" />
                  <span className="self-center">{t.footer.ctaBtn}</span>
                  <GithubStars />
                </ActionLink>
                <ActionLink href={STUDIO_URL} variant="secondary" size="md">
                  <span>{t.hero.ctaSecondary}</span>
                  <ArrowRight className="w-4 h-4" />
                </ActionLink>
              </div>
            </div>

            {/* Footer Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 text-xs">
              <div className="md:col-span-5 space-y-3">
                <BrandLogo className="h-[19px] w-auto" />
                <p className="text-muted-foreground leading-relaxed max-w-sm">
                  {t.footer.brandDesc}
                </p>
              </div>

              <div className="md:col-span-2 space-y-2.5">
                <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {t.footer.colProject}
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href="#explorer" className="hover:text-foreground">
                      {t.nav.explorer}
                    </a>
                  </li>
                  <li>
                    <a href="#features" className="hover:text-foreground">
                      {t.nav.features}
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-foreground">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              <div className="md:col-span-2 space-y-2.5">
                <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {t.footer.colStudio}
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="/studio/" className="hover:text-foreground">
                      Icon Library
                    </a>
                  </li>
                  <li>
                    <a href="/studio/#webfont" className="hover:text-foreground">
                      Webfont Inspector
                    </a>
                  </li>
                  <li>
                    <a href="/studio/#svg" className="hover:text-foreground">
                      SVG → Webfont
                    </a>
                  </li>
                </ul>
              </div>

              <div className="md:col-span-3 space-y-2.5">
                <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {t.footer.colResources}
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <button
                      onClick={openDocs}
                      className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>{t.nav.docs}</span>
                    </button>
                  </li>
                  <li>
                    <a
                      href={`${GITHUB_URL}/tree/main/skills/create-icons`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground"
                    >
                      skills/create-icons
                    </a>
                  </li>
                  <li>
                    <a
                      href={`${GITHUB_URL}/tree/main/skills/catalog-icons`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground"
                    >
                      skills/catalog-icons
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={() => openDocs('ai-skills')}
                      className="hover:text-foreground cursor-pointer"
                    >
                      8 Starter Styles
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>{t.footer.bottomLeft}</span>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground"
              >
                <Github className="w-3.5 h-3.5" />
                <span>cesaroeduardo/icon-library-visualization</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  )
}

export default App
