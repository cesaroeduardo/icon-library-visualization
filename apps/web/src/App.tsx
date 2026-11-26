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
import { parseUploadedWebfont } from '@icon-library/core'
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
import { IconExplorer, type DemoIcon } from '@/components/IconExplorer'
import { DocsView } from '@/components/DocsView'
import { copy, GITHUB_URL, CLONE_CMD, STUDIO_URL, type Lang } from '@/content'

const POPULAR_NAMES = [
  'search',
  'heart',
  'chevron-right',
  'check',
  'x',
  'eye',
  'home',
  'settings',
  'star',
  'refresh-cw'
]

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

  const [demoIcons, setDemoIcons] = useState<DemoIcon[]>([])
  const [demoFamily, setDemoFamily] = useState('')
  const [loadingDemo, setLoadingDemo] = useState(true)
  const [copiedCmd, setCopiedCmd] = useState(false)
  const [page, setPage] = useState<'landing' | 'docs'>(() =>
    window.location.hash.replace(/^#\/?/, '').toLowerCase() === 'docs' ? 'docs' : 'landing'
  )

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace(/^#\/?/, '').toLowerCase()
      if (h === 'docs') setPage('docs')
      else if (h === '' || h === 'home') setPage('landing')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function openDocs() {
    window.location.hash = 'docs'
    setPage('docs')
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  useEffect(() => {
    let active = true
    async function loadDemo() {
      try {
        const [ttfRes, woff2Res] = await Promise.all([
          fetch('./demo/demo-icons.ttf'),
          fetch('./demo/demo-icons.woff2')
        ])
        if (!ttfRes.ok) return
        const ttfBuffer = await ttfRes.arrayBuffer()
        const fonts: Array<{ name: string; ext: string; buffer: ArrayBuffer }> = [
          { name: 'demo-icons.ttf', ext: '.ttf', buffer: ttfBuffer }
        ]
        if (woff2Res.ok) {
          fonts.push({
            name: 'demo-icons.woff2',
            ext: '.woff2',
            buffer: await woff2Res.arrayBuffer()
          })
        }
        const lib = await parseUploadedWebfont({
          fonts,
          cssFiles: [],
          customFontName: 'demo-icons',
          customPrefix: 'ic'
        })
        if (!active) return
        setDemoFamily(lib.runtimeFamily)
        setDemoIcons(
          lib.icons.map((i: DemoIcon) => ({
            name: i.name,
            icon: i.icon,
            keywords: i.keywords,
            char: i.char,
            svg: i.svg || ''
          }))
        )
      } catch (e) {
        console.error('Failed to load demo icons:', e)
      } finally {
        if (active) setLoadingDemo(false)
      }
    }
    loadDemo()
    return () => {
      active = false
    }
  }, [])

  const popularIcons = POPULAR_NAMES.map((name) =>
    demoIcons.find((i) => i.name === name)
  ).filter((x): x is DemoIcon => Boolean(x))

  const displayPopular = popularIcons.length >= 6 ? popularIcons : demoIcons.slice(0, 10)

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
                className="inline-flex items-center gap-2.5 font-semibold text-sm tracking-[-0.02em] cursor-pointer"
              >
                <IconTile className="h-8 w-8 rounded-lg bg-surface-raised">
                  <Layers className="w-4 h-4" />
                </IconTile>
                <span>Icon Library Studio</span>
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
                  onClick={openDocs}
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
              >
                <Github className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.nav.github}</span>
              </ActionLink>
            </div>
          </div>
        </header>

        {/* Main View: TUFFUI Docs OR Open Source Landing Page */}
        {page === 'docs' ? (
          <DocsView lang={lang} onBack={() => openLanding()} />
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
                <StatusPill tone="brand" size="md">
                  <Sparkles className="w-3 h-3" />
                  <span>{t.hero.pill}</span>
                </StatusPill>

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
                  >
                    <Github className="w-4 h-4" />
                    <span>{t.hero.ctaPrimary}</span>
                    <ArrowUpRight className="w-4 h-4" />
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

              {/* Right Column: Popular Icons Row + TUFFUI Quickstart Shell Card */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="lg:col-span-6 space-y-4"
              >
                {/* Popular icons preview strip */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {t.hero.popularLabel}
                    </span>
                    <Tag>WOFF2 · TTF</Tag>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                    {(displayPopular.length > 0 ? displayPopular : Array.from({ length: 10 })).map(
                      (icon, idx) => (
                        <a
                          key={typeof icon === 'object' && icon ? icon.name : idx}
                          href="#explorer"
                          title={typeof icon === 'object' && icon ? icon.name : ''}
                          className="h-11 rounded-xl bg-surface hover:bg-surface-raised flex items-center justify-center text-foreground transition-colors"
                        >
                          {typeof icon === 'object' && icon ? (
                            <span
                              style={{
                                fontFamily: demoFamily ? `'${demoFamily}'` : undefined,
                                fontSize: '20px'
                              }}
                              className="leading-none"
                            >
                              {icon.char}
                            </span>
                          ) : (
                            <span className="w-4 h-4 rounded bg-foreground/10 animate-pulse" />
                          )}
                        </a>
                      )
                    )}
                  </div>
                </div>

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

        {/* Interactive Demo Icon Explorer */}
        <IconExplorer
          lang={lang}
          icons={demoIcons}
          fontFamily={demoFamily}
          loading={loadingDemo}
        />

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
                >
                  <Github className="w-4 h-4" />
                  <span>{t.footer.ctaBtn}</span>
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
                <div className="inline-flex items-center gap-2 font-semibold text-sm">
                  <IconTile className="h-7 w-7 rounded-lg">
                    <Layers className="w-3.5 h-3.5" />
                  </IconTile>
                  <span>Icon Library Studio</span>
                </div>
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
                    <a href="./studio/" className="hover:text-foreground">
                      Icon Library
                    </a>
                  </li>
                  <li>
                    <a href="./studio/#webfont" className="hover:text-foreground">
                      Webfont Inspector
                    </a>
                  </li>
                  <li>
                    <a href="./studio/#svg" className="hover:text-foreground">
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
                    <a href="./skills/create-icons.zip" download="create-icons.zip" className="hover:text-foreground">
                      skills/create-icons.zip
                    </a>
                  </li>
                  <li>
                    <a href="./skills/catalog-icons.zip" download="catalog-icons.zip" className="hover:text-foreground">
                      skills/catalog-icons.zip
                    </a>
                  </li>
                  <li>
                    <a href="./style-gallery.html" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                      8 Starter Styles
                    </a>
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
