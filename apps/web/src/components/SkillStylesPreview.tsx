import { useState, type CSSProperties } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Shell, Panel, Tag } from '@/components/ui/tuff'
import rawStyles from '@/data/skillStylesData.json'
import type { Lang } from '@/content'

interface StyleIcon {
  name: string
  vb: string
  body: string
}

interface StyleDef {
  id: string
  key: string
  name: string
  descPt: string
  descEn: string
  lightVars: string
  darkVars: string
  icons: StyleIcon[]
}

const STYLES = rawStyles as StyleDef[]

function parseCssVars(raw: string): CSSProperties {
  const out: Record<string, string> = {}
  for (const part of raw.split(';')) {
    const idx = part.indexOf(':')
    if (idx > 0) {
      const k = part.slice(0, idx).trim()
      const v = part.slice(idx + 1).trim()
      if (k.startsWith('--') && v) out[k] = v
    }
  }
  return out as CSSProperties
}

export function SkillStylesPreview({ lang }: { lang: Lang }) {
  const isPt = lang === 'pt'
  const [surfaceMode, setSurfaceMode] = useState<'both' | 'dark' | 'light'>('both')
  const [iconSize, setIconSize] = useState<24 | 32>(28 as 24 | 32)

  return (
    <div className="space-y-3 pt-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold tracking-[-0.02em] text-foreground">
            {isPt ? 'Os 8 estilos iniciais da skill create-icons' : 'The 8 starter styles in create-icons'}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isPt
              ? 'Projetos sem design system ainda podem partir de qualquer um destes 8 estilos em claro e escuro.'
              : 'Projects without an existing design system can start from any of these 8 styles in light and dark.'}
          </p>
        </div>

        <div className="inline-flex items-center rounded-full bg-foreground/[0.06] p-0.5 text-xs">
          {(['both', 'dark', 'light'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setSurfaceMode(mode)}
              className={`h-7 px-3 rounded-full font-medium transition-colors cursor-pointer inline-flex items-center gap-1 ${
                surfaceMode === mode
                  ? 'bg-surface-raised text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {mode === 'dark' && <Moon className="w-3 h-3" />}
              {mode === 'light' && <Sun className="w-3 h-3" />}
              <span>
                {mode === 'both'
                  ? isPt
                    ? 'Ambos'
                    : 'Both'
                  : mode === 'dark'
                    ? isPt
                      ? 'Escuro'
                      : 'Dark'
                    : isPt
                      ? 'Claro'
                      : 'Light'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Shell>
        <Panel className="divide-y divide-border overflow-hidden">
          {STYLES.map((st) => {
            const darkStyle = parseCssVars(st.darkVars)
            const lightStyle = parseCssVars(st.lightVars)
            const pixelCrisp = st.key === 'pixel' ? 'crispEdges' : undefined

            return (
              <div
                key={st.key}
                className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                <div className="md:col-span-4 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{st.name}</span>
                    <Tag>{st.key}</Tag>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isPt ? st.descPt : st.descEn}
                  </p>
                </div>

                <div
                  className={`md:col-span-8 grid gap-2.5 ${
                    surfaceMode === 'both' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {(surfaceMode === 'both' || surfaceMode === 'dark') && (
                    <div
                      className="rounded-xl px-4 py-3 flex items-center justify-around gap-3"
                      style={{ backgroundColor: '#14171E', ...darkStyle }}
                    >
                      {st.icons.map((ic) => (
                        <div key={ic.name} className="flex flex-col items-center gap-1">
                          <svg
                            viewBox={ic.vb}
                            width={iconSize}
                            height={iconSize}
                            shapeRendering={pixelCrisp}
                            className="block"
                            dangerouslySetInnerHTML={{ __html: ic.body }}
                          />
                          <span className="text-[9px] font-mono text-[#8A92A3]">{ic.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {(surfaceMode === 'both' || surfaceMode === 'light') && (
                    <div
                      className="rounded-xl px-4 py-3 flex items-center justify-around gap-3 border border-black/5"
                      style={{ backgroundColor: '#FFFFFF', ...lightStyle }}
                    >
                      {st.icons.map((ic) => (
                        <div key={ic.name} className="flex flex-col items-center gap-1">
                          <svg
                            viewBox={ic.vb}
                            width={iconSize}
                            height={iconSize}
                            shapeRendering={pixelCrisp}
                            className="block"
                            dangerouslySetInnerHTML={{ __html: ic.body }}
                          />
                          <span className="text-[9px] font-mono text-[#6B7385]">{ic.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </Panel>
      </Shell>
    </div>
  )
}
