import { useEffect, useRef } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { Shell, Panel, Inset, StatusPill, Tag } from '@/components/ui/tuff'
import type { Lang } from '@/content'

/** Official Anthropic Claude logo */
export function ClaudeMark({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
    </svg>
  )
}

/** Official OpenAI logo */
export function OpenAIMark({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="1.68 1.75 16.65 16.5" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.248 18.25q-.825 0-1.568-.314a4.3 4.3 0 0 1-1.32-.874 4 4 0 0 1-1.304.214 4 4 0 0 1-2.046-.544 4.27 4.27 0 0 1-1.518-1.485 4 4 0 0 1-.56-2.095q0-.48.131-1.04A4.4 4.4 0 0 1 2.04 10.71a4.07 4.07 0 0 1 .017-3.4 4.2 4.2 0 0 1 1.056-1.418 3.8 3.8 0 0 1 1.6-.842 3.9 3.9 0 0 1 .76-1.683q.593-.759 1.451-1.188a4.04 4.04 0 0 1 1.832-.429q.825 0 1.567.313.742.314 1.32.875a4 4 0 0 1 1.304-.215q1.106 0 2.046.545a4.14 4.14 0 0 1 1.501 1.485q.578.941.578 2.095 0 .48-.132 1.04.66.61 1.023 1.419.363.792.363 1.666 0 .892-.38 1.717a4.3 4.3 0 0 1-1.072 1.435 3.8 3.8 0 0 1-1.584.825 3.8 3.8 0 0 1-.775 1.683 4.06 4.06 0 0 1-1.436 1.188 4.04 4.04 0 0 1-1.832.429m-4.076-2.062q.825 0 1.435-.347l3.103-1.782a.36.36 0 0 0 .164-.313v-1.42L7.881 14.62a.67.67 0 0 1-.726 0l-3.118-1.798a.5.5 0 0 1-.017.115v.198q0 .841.396 1.551.413.693 1.139 1.089a3.2 3.2 0 0 0 1.617.412m.165-2.69a.4.4 0 0 0 .181.05q.083 0 .165-.05l1.238-.71-3.977-2.31a.7.7 0 0 1-.363-.643v-3.58q-.825.362-1.32 1.122a2.9 2.9 0 0 0-.495 1.65q0 .809.413 1.55.412.743 1.072 1.123zm3.91 3.663q.875 0 1.585-.396a2.96 2.96 0 0 0 1.534-2.64v-3.564a.32.32 0 0 0-.165-.297l-1.254-.726v4.604a.7.7 0 0 1-.363.643l-3.119 1.799a3 3 0 0 0 1.783.577m.627-6.039V8.878L10.01 7.822 8.129 8.878v2.244l1.881 1.056zM7.057 5.859a.7.7 0 0 1 .363-.644l3.119-1.798a3 3 0 0 0-1.782-.578q-.874 0-1.584.396A2.96 2.96 0 0 0 6.05 4.324a3.07 3.07 0 0 0-.396 1.551v3.547q0 .199.165.314l1.237.726zm8.383 7.887q.825-.364 1.303-1.123.495-.758.495-1.65a3.15 3.15 0 0 0-.412-1.55q-.413-.743-1.073-1.123l-3.086-1.782q-.099-.065-.181-.049a.3.3 0 0 0-.165.05l-1.238.692 3.993 2.327a.6.6 0 0 1 .264.264.64.64 0 0 1 .1.363zm-3.317-8.382a.63.63 0 0 1 .726 0l3.135 1.831v-.297q0-.792-.396-1.501a2.86 2.86 0 0 0-1.105-1.155q-.71-.43-1.65-.43-.825 0-1.436.347L8.294 5.941a.36.36 0 0 0-.165.314v1.418z" />
    </svg>
  )
}

/** Official Cursor logo */
export function CursorMark({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23" />
    </svg>
  )
}

/** Official Grok (xAI) logo */
export function GrokMark({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"
      />
    </svg>
  )
}

const LOOP_MS = 6800

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

const ANCHOR_NODES = [
  { cx: 120, cy: 38, showAt: 0.12 },
  { cx: 190, cy: 196, showAt: 0.37 },
  { cx: 50, cy: 196, showAt: 0.50 },
  { cx: 120, cy: 144, showAt: 0.725 }
]

export function AgentCanvasShowcase({ lang }: { lang: Lang }) {
  const isPt = lang === 'pt'

  const stageRef = useRef<HTMLDivElement>(null)
  const roofRef = useRef<SVGPathElement>(null)
  const wallsRef = useRef<SVGPathElement>(null)
  const doorRef = useRef<SVGPathElement>(null)
  const fillRef = useRef<SVGPathElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const tipRingRef = useRef<SVGCircleElement>(null)
  const nodeRefs = useRef<(SVGRectElement | null)[]>([])

  useEffect(() => {
    const roof = roofRef.current
    const walls = wallsRef.current
    const door = doorRef.current
    const fill = fillRef.current
    const cursor = cursorRef.current
    const tipRing = tipRingRef.current
    const stage = stageRef.current
    if (!roof || !walls || !door || !fill || !cursor || !stage) return

    const roofLen = roof.getTotalLength()
    const wallsLen = walls.getTotalLength()
    const doorLen = door.getTotalLength()

    roof.style.strokeDasharray = `${roofLen}`
    walls.style.strokeDasharray = `${wallsLen}`
    door.style.strokeDasharray = `${doorLen}`

    const roofStart = roof.getPointAtLength(0)
    const roofEnd = roof.getPointAtLength(roofLen)
    const wallsStart = walls.getPointAtLength(0)
    const wallsEnd = walls.getPointAtLength(wallsLen)
    const doorStart = door.getPointAtLength(0)
    const doorEnd = door.getPointAtLength(doorLen)
    const restPoint = { x: 186, y: 58 }

    const applyPosition = (x: number, y: number, drawing: boolean) => {
      const scale = stage.clientWidth / 240
      cursor.style.transform = `translate3d(${(x * scale).toFixed(2)}px, ${(y * scale).toFixed(2)}px, 0)`
      if (tipRing) {
        tipRing.setAttribute('cx', x.toFixed(2))
        tipRing.setAttribute('cy', y.toFixed(2))
        tipRing.style.opacity = drawing ? '0.9' : '0'
      }
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      roof.style.strokeDashoffset = '0'
      walls.style.strokeDashoffset = '0'
      door.style.strokeDashoffset = '0'
      roof.style.opacity = '1'
      walls.style.opacity = '1'
      door.style.opacity = '1'
      fill.style.opacity = '0.16'
      nodeRefs.current.forEach((n) => {
        if (n) n.style.opacity = '1'
      })
      applyPosition(restPoint.x, restPoint.y, false)
      return
    }

    let rafId = 0
    const startTime = performance.now()

    const tick = (now: number) => {
      const t = ((now - startTime) % LOOP_MS) / LOOP_MS

      // Fade out envelope at the end of each loop (0.94 -> 1.0)
      const fadeOut = t >= 0.94 ? 1 - clamp01((t - 0.94) / 0.06) : 1

      // Segment 1: Roof (0.00 -> 0.24)
      const roofU = easeInOutCubic(clamp01(t / 0.24))
      roof.style.strokeDashoffset = `${(roofLen * (1 - roofU)).toFixed(2)}`
      roof.style.opacity = `${(t < 0.005 ? 0 : fadeOut).toFixed(3)}`

      // Segment 2: Walls (0.29 -> 0.58)
      const wallsU = easeInOutCubic(clamp01((t - 0.29) / 0.29))
      walls.style.strokeDashoffset = `${(wallsLen * (1 - wallsU)).toFixed(2)}`
      walls.style.opacity = `${(t < 0.29 ? 0 : fadeOut).toFixed(3)}`

      // Segment 3: Door (0.65 -> 0.80)
      const doorU = easeInOutCubic(clamp01((t - 0.65) / 0.15))
      door.style.strokeDashoffset = `${(doorLen * (1 - doorU)).toFixed(2)}`
      door.style.opacity = `${(t < 0.65 ? 0 : fadeOut).toFixed(3)}`

      // Soft duotone fill fades in after door finishes (0.80 -> 0.87)
      const fillIn = easeInOutCubic(clamp01((t - 0.80) / 0.07))
      fill.style.opacity = `${(0.16 * fillIn * fadeOut).toFixed(3)}`

      // Vector anchor nodes appear right as the cursor passes each vertex
      nodeRefs.current.forEach((node, idx) => {
        if (!node) return
        const showAt = ANCHOR_NODES[idx].showAt
        const pop = clamp01((t - showAt) / 0.03)
        node.style.opacity = `${(pop * fadeOut).toFixed(3)}`
      })

      // Exact cursor position synced to the active path tip
      let cx = roofStart.x
      let cy = roofStart.y
      let isDrawing = false

      if (t <= 0.24) {
        const pt = roof.getPointAtLength(roofLen * roofU)
        cx = pt.x
        cy = pt.y
        isDrawing = true
      } else if (t <= 0.29) {
        const g = easeInOutCubic((t - 0.24) / 0.05)
        cx = lerp(roofEnd.x, wallsStart.x, g)
        cy = lerp(roofEnd.y, wallsStart.y, g)
      } else if (t <= 0.58) {
        const pt = walls.getPointAtLength(wallsLen * wallsU)
        cx = pt.x
        cy = pt.y
        isDrawing = true
      } else if (t <= 0.65) {
        const g = easeInOutCubic((t - 0.58) / 0.07)
        cx = lerp(wallsEnd.x, doorStart.x, g)
        cy = lerp(wallsEnd.y, doorStart.y, g)
      } else if (t <= 0.80) {
        const pt = door.getPointAtLength(doorLen * doorU)
        cx = pt.x
        cy = pt.y
        isDrawing = true
      } else if (t <= 0.87) {
        const g = easeInOutCubic((t - 0.80) / 0.07)
        cx = lerp(doorEnd.x, restPoint.x, g)
        cy = lerp(doorEnd.y, restPoint.y, g)
      } else if (t <= 0.94) {
        cx = restPoint.x
        cy = restPoint.y
      } else {
        const g = easeInOutCubic((t - 0.94) / 0.06)
        cx = lerp(restPoint.x, roofStart.x, g)
        cy = lerp(restPoint.y, roofStart.y, g)
      }

      applyPosition(cx, cy, isDrawing)
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

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
              <div ref={stageRef} className="relative w-[240px] h-[240px]">
                <svg
                  viewBox="0 0 240 240"
                  className="w-full h-full overflow-visible"
                  fill="none"
                >
                  {/* Soft duotone body fill that fades in after outline is traced */}
                  <path
                    ref={fillRef}
                    d="M50 112 V194 A16 16 0 0 0 66 210 H174 A16 16 0 0 0 190 194 V112 L120 44 Z"
                    fill="#D97757"
                    style={{ opacity: 0 }}
                  />

                  {/* Roof stroke drawn first */}
                  <path
                    ref={roofRef}
                    d="M36 116 L112 42 A12 12 0 0 1 128 42 L204 116"
                    stroke="currentColor"
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-foreground"
                    style={{ opacity: 0 }}
                  />

                  {/* Walls stroke drawn second */}
                  <path
                    ref={wallsRef}
                    d="M190 106 V192 A18 18 0 0 1 172 210 H68 A18 18 0 0 1 50 192 V106"
                    stroke="currentColor"
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-foreground"
                    style={{ opacity: 0 }}
                  />

                  {/* Door arch drawn third */}
                  <path
                    ref={doorRef}
                    d="M96 210 V168 A24 24 0 0 1 144 168 V210"
                    stroke="#D97757"
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: 0 }}
                  />

                  {/* Vector anchor nodes in Claude terracotta */}
                  {ANCHOR_NODES.map((pt, idx) => (
                    <rect
                      key={idx}
                      ref={(el) => {
                        nodeRefs.current[idx] = el
                      }}
                      x={pt.cx - 4.5}
                      y={pt.cy - 4.5}
                      width="9"
                      height="9"
                      rx="2"
                      fill="#0c0c0c"
                      stroke="#D97757"
                      strokeWidth="2.5"
                      style={{ opacity: 0 }}
                    />
                  ))}

                  {/* Live pen-tip indicator synced exactly to path tip */}
                  <circle
                    ref={tipRingRef}
                    cx="36"
                    cy="116"
                    r="5.5"
                    fill="#D97757"
                    stroke="#ffffff"
                    strokeWidth="2"
                    style={{ opacity: 0 }}
                  />
                </svg>

                {/* Animated Claude Agent Cursor — tip aligned precisely to (x, y) */}
                <div
                  ref={cursorRef}
                  className="absolute top-0 left-0 pointer-events-none z-20 will-change-transform"
                  style={{ transform: 'translate3d(36px, 116px, 0)' }}
                >
                  {/* Cursor Pointer in Claude Terracotta (#D97757) — tip at (4,3) of 24x24 */}
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    className="drop-shadow-md"
                    style={{ transform: 'translate(-3.7px, -2.8px)' }}
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
                    className="ml-3.5 -mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-white shadow-lg"
                    style={{ backgroundColor: '#D97757' }}
                  >
                    <ClaudeMark className="w-3 h-3 text-white" />
                    <span>Claude</span>
                  </div>
                </div>
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
