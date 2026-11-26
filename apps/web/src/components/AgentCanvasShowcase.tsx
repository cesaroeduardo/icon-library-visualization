import { motion } from 'motion/react'
import { Check, Sparkles } from 'lucide-react'
import { Shell, Panel, Inset, StatusPill, Tag } from '@/components/ui/tuff'
import type { Lang } from '@/content'

/** Official-style Anthropic/Claude sunburst glyph */
export function ClaudeMark({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.2l1.15 6.45 4.9-4.38-2.98 5.83 6.53-.62-5.6 3.4 5.6 3.4-6.53-.62 2.98 5.83-4.9-4.38L12 21.8l-1.15-6.45-4.9 4.38 2.98-5.83-6.53.62 5.6-3.4-5.6-3.4 6.53.62-2.98-5.83 4.9 4.38L12 2.2z" />
    </svg>
  )
}

export function OpenAIMark({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
      <circle cx="12" cy="7.5" r="3.5" />
      <circle cx="16" cy="10" r="3.5" />
      <circle cx="15" cy="14.8" r="3.5" />
      <circle cx="10.2" cy="16.2" r="3.5" />
      <circle cx="7.5" cy="12" r="3.5" />
      <circle cx="9" cy="8.2" r="3.5" />
    </svg>
  )
}

export function CursorMark({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5L20.5 7.25v9.5L12 21.5 3.5 16.75v-9.5L12 2.5zm0 2.3L5.6 8.4l6.4 3.6 6.4-3.6L12 4.8zm1 8.85v5.4l5.4-3.05v-5.4L13 13.65z" />
    </svg>
  )
}

export function GeminiMark({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2c.6 5.2 4.8 9.4 10 10-5.2.6-9.4 4.8-10 10-.6-5.2-4.8-9.4-10-10 5.2-.6 9.4-4.8 10-10z" />
    </svg>
  )
}

const LOOP_DURATION = 6.4

// Waypoints matching the rocket/spark icon being drawn on the 240x240 canvas (scaled 10x from 24x24)
const CURSOR_X = [42, 120, 198, 190, 190, 50, 50, 96, 120, 144, 178]
const CURSOR_Y = [115, 36, 115, 115, 200, 200, 115, 196, 152, 196, 56]
const CURSOR_TIMES = [0, 0.14, 0.28, 0.34, 0.48, 0.62, 0.72, 0.78, 0.85, 0.92, 1]

export function AgentCanvasShowcase({ lang }: { lang: Lang }) {
  const isPt = lang === 'pt'

  return (
    <Shell className="mb-4">
      {/* Top Canvas Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: '#D97757' }}
          />
          <span className="text-xs font-medium text-foreground">
            {isPt ? 'Agente desenhando em tempo real' : 'Agent drawing live on canvas'}
          </span>
          <Tag>24×24 grid</Tag>
        </div>
        <StatusPill tone="positive" size="sm">
          <Check className="w-3 h-3" />
          <span>{isPt ? 'SVG + catalog.json validados' : 'SVG + catalog.json validated'}</span>
        </StatusPill>
      </div>

      <Panel className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Animated 24x24 Vector Canvas */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <div className="relative w-full max-w-[340px] aspect-square rounded-2xl bg-foreground/[0.03] overflow-hidden flex items-center justify-center p-6">
              {/* 24x24 Pixel Grid Overlay */}
              <div
                className="absolute inset-0 opacity-45 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Live Area Safe Guide (20x20 inside 24x24) */}
              <div
                className="absolute inset-7 rounded-lg pointer-events-none"
                style={{ border: '1px dashed rgba(217, 119, 87, 0.35)' }}
              />
              <span className="absolute top-2.5 left-3 font-mono text-[10px] text-muted-foreground/70">
                viewBox=&quot;0 0 24 24&quot;
              </span>
              <span className="absolute bottom-2.5 right-3 font-mono text-[10px] text-muted-foreground/70">
                live: 20×20
              </span>

              {/* Drawing SVG Canvas (240x240 coordinate space) */}
              <div className="relative w-[240px] h-[240px]">
                <svg
                  viewBox="0 0 240 240"
                  className="w-full h-full overflow-visible"
                  fill="none"
                >
                  {/* Soft duotone body fill that fades in after outline is traced */}
                  <motion.path
                    d="M50 112 V194 A16 16 0 0 0 66 210 H174 A16 16 0 0 0 190 194 V112 L120 44 Z"
                    fill="#D97757"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0, 0.16, 0.16, 0] }}
                    transition={{
                      duration: LOOP_DURATION,
                      times: [0, 0.72, 0.88, 0.96, 1],
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />

                  {/* Roof stroke drawn first */}
                  <motion.path
                    d="M36 116 L112 42 A12 12 0 0 1 128 42 L204 116"
                    stroke="currentColor"
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-foreground"
                    initial={{ pathLength: 0, opacity: 0.2 }}
                    animate={{ pathLength: [0, 1, 1, 0], opacity: [0.3, 1, 1, 0.2] }}
                    transition={{
                      duration: LOOP_DURATION,
                      times: [0, 0.28, 0.94, 1],
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />

                  {/* Walls stroke drawn second */}
                  <motion.path
                    d="M190 106 V192 A18 18 0 0 1 172 210 H68 A18 18 0 0 1 50 192 V106"
                    stroke="currentColor"
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-foreground"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 0, 1, 1, 0], opacity: [0, 1, 1, 1, 0] }}
                    transition={{
                      duration: LOOP_DURATION,
                      times: [0, 0.32, 0.72, 0.94, 1],
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />

                  {/* Door arch drawn third */}
                  <motion.path
                    d="M96 210 V168 A24 24 0 0 1 144 168 V210"
                    stroke="#D97757"
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0] }}
                    transition={{
                      duration: LOOP_DURATION,
                      times: [0, 0.74, 0.91, 0.96, 1],
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />

                  {/* Vector anchor nodes in Claude terracotta */}
                  {[
                    { cx: 120, cy: 38, t: 0.14 },
                    { cx: 190, cy: 196, t: 0.48 },
                    { cx: 50, cy: 196, t: 0.62 },
                    { cx: 120, cy: 146, t: 0.85 }
                  ].map((pt, idx) => (
                    <motion.rect
                      key={idx}
                      x={pt.cx - 4.5}
                      y={pt.cy - 4.5}
                      width="9"
                      height="9"
                      rx="2"
                      fill="#0c0c0c"
                      stroke="#D97757"
                      strokeWidth="2.5"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 0, 1.15, 1, 0],
                        opacity: [0, 0, 1, 1, 0]
                      }}
                      transition={{
                        duration: LOOP_DURATION,
                        times: [0, Math.max(0.01, pt.t - 0.03), pt.t, 0.93, 1],
                        repeat: Infinity
                      }}
                    />
                  ))}
                </svg>

                {/* Animated Claude Agent Cursor */}
                <motion.div
                  className="absolute top-0 left-0 pointer-events-none z-20"
                  animate={{ x: CURSOR_X, y: CURSOR_Y }}
                  transition={{
                    duration: LOOP_DURATION,
                    times: CURSOR_TIMES,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  {/* Cursor Pointer in Claude Terracotta (#D97757) */}
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    className="-translate-x-[2px] -translate-y-[2px] drop-shadow-md"
                  >
                    <path
                      d="M4 3l15.5 7.2-6.9 2.1-2.6 6.8L4 3z"
                      fill="#D97757"
                      stroke="#ffffff"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {/* Claude Badge attached to cursor */}
                  <div
                    className="ml-4 -mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-white shadow-lg"
                    style={{ backgroundColor: '#D97757' }}
                  >
                    <ClaudeMark className="w-3 h-3 text-white" />
                    <span>Claude</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right: Live Output Preview (icons.json + catalog.json) */}
          <div className="lg:col-span-5 space-y-3">
            <Inset className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-foreground">home.svg</span>
                <Tag>stroke: 1.75px</Tag>
              </div>
              <pre className="font-mono text-[11px] leading-5 text-muted-foreground overflow-x-auto">
                <code>{`<svg viewBox="0 0 24 24">
  <path d="M3 11.6L12 4l9 7.6" />
  <path d="M5 10.6V19a2 2 0 0 0 2 2h10" />
  <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
</svg>`}</code>
              </pre>
            </Inset>

            <Inset className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-foreground">catalog.json</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-positive font-medium">
                  <Sparkles className="w-3 h-3" />
                  <span>{isPt ? 'Auto-catalogado' : 'Auto-cataloged'}</span>
                </span>
              </div>
              <pre className="font-mono text-[11px] leading-5 text-muted-foreground overflow-x-auto">
                <code>{`{
  "name": "home",
  "icon": "ic home",
  "group": "navigation",
  "keywords": "house start dashboard inicio casa"
}`}</code>
              </pre>
            </Inset>
          </div>
        </div>
      </Panel>
    </Shell>
  )
}
