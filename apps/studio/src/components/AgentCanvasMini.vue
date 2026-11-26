<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

defineProps({
  lang: { type: String, default: 'pt' }
})

const LOOP_MS = 6800

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

const ANCHOR_NODES = [
  { cx: 120, cy: 38, showAt: 0.12 },
  { cx: 190, cy: 196, showAt: 0.37 },
  { cx: 50, cy: 196, showAt: 0.50 },
  { cx: 120, cy: 144, showAt: 0.725 }
]

const stageRef = ref(null)
const roofRef = ref(null)
const wallsRef = ref(null)
const doorRef = ref(null)
const fillRef = ref(null)
const cursorRef = ref(null)
const tipRingRef = ref(null)
const nodeRefs = ref([])

let rafId = 0

onMounted(() => {
  const roof = roofRef.value
  const walls = wallsRef.value
  const door = doorRef.value
  const fill = fillRef.value
  const cursor = cursorRef.value
  const tipRing = tipRingRef.value
  const stage = stageRef.value
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

  const applyPosition = (x, y, drawing) => {
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
    nodeRefs.value.forEach((n) => {
      if (n) n.style.opacity = '1'
    })
    applyPosition(restPoint.x, restPoint.y, false)
    return
  }

  const startTime = performance.now()

  const tick = (now) => {
    const t = ((now - startTime) % LOOP_MS) / LOOP_MS
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

    // Soft duotone fill (0.80 -> 0.87)
    const fillIn = easeInOutCubic(clamp01((t - 0.80) / 0.07))
    fill.style.opacity = `${(0.16 * fillIn * fadeOut).toFixed(3)}`

    // Anchor nodes pop in right as the cursor passes each vertex
    nodeRefs.value.forEach((node, idx) => {
      if (!node) return
      const showAt = ANCHOR_NODES[idx].showAt
      const pop = clamp01((t - showAt) / 0.03)
      node.style.opacity = `${(pop * fadeOut).toFixed(3)}`
    })

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
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div
    class="relative w-full max-w-[300px] mx-auto aspect-square rounded-2xl overflow-hidden flex items-center justify-center p-5"
    style="background-color: var(--fg-tint-3);"
  >
    <!-- 24x24 Pixel Grid Overlay -->
    <div
      class="absolute inset-0 opacity-45 pointer-events-none"
      style="
        background-image: linear-gradient(to right, var(--border) 1px, transparent 1px),
          linear-gradient(to bottom, var(--border) 1px, transparent 1px);
        background-size: 18px 18px;
      "
    ></div>

    <!-- Live Area Safe Guide (20x20) -->
    <div
      class="absolute inset-6 rounded-lg pointer-events-none"
      style="border: 1px dashed rgba(217, 119, 87, 0.38);"
    ></div>

    <span
      class="absolute top-2.5 left-3 font-mono text-[10px]"
      style="color: var(--muted-foreground); opacity: 0.75;"
    >
      viewBox="0 0 24 24"
    </span>
    <span
      class="absolute bottom-2.5 right-3 font-mono text-[10px]"
      style="color: var(--muted-foreground); opacity: 0.75;"
    >
      live: 20×20
    </span>

    <!-- Drawing SVG Canvas (240x240) -->
    <div ref="stageRef" class="relative w-[210px] h-[210px]">
      <svg viewBox="0 0 240 240" class="w-full h-full overflow-visible" fill="none">
        <!-- Soft duotone body fill -->
        <path
          ref="fillRef"
          d="M50 112 V194 A16 16 0 0 0 66 210 H174 A16 16 0 0 0 190 194 V112 L120 44 Z"
          fill="#D97757"
          style="opacity: 0;"
        />

        <!-- Roof -->
        <path
          ref="roofRef"
          d="M36 116 L112 42 A12 12 0 0 1 128 42 L204 116"
          stroke="currentColor"
          stroke-width="13"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="opacity: 0;"
        />

        <!-- Walls -->
        <path
          ref="wallsRef"
          d="M190 106 V192 A18 18 0 0 1 172 210 H68 A18 18 0 0 1 50 192 V106"
          stroke="currentColor"
          stroke-width="13"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="opacity: 0;"
        />

        <!-- Door arch -->
        <path
          ref="doorRef"
          d="M96 210 V168 A24 24 0 0 1 144 168 V210"
          stroke="#D97757"
          stroke-width="13"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="opacity: 0;"
        />

        <!-- Anchor Nodes -->
        <rect
          v-for="(pt, idx) in ANCHOR_NODES"
          :key="idx"
          :ref="(el) => { nodeRefs[idx] = el }"
          :x="pt.cx - 4.5"
          :y="pt.cy - 4.5"
          width="9"
          height="9"
          rx="2"
          fill="#0c0c0c"
          stroke="#D97757"
          stroke-width="2.5"
          style="opacity: 0;"
        />

        <!-- Live pen-tip indicator synced exactly to path tip -->
        <circle
          ref="tipRingRef"
          cx="36"
          cy="116"
          r="5.5"
          fill="#D97757"
          stroke="#ffffff"
          stroke-width="2"
          style="opacity: 0;"
        />
      </svg>

      <!-- Animated Claude Agent Cursor -->
      <div
        ref="cursorRef"
        class="absolute top-0 left-0 pointer-events-none z-20 will-change-transform"
        style="transform: translate3d(31.5px, 101.5px, 0);"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          class="drop-shadow-md"
          style="transform: translate(-3.3px, -2.5px);"
        >
          <path
            d="M4 3l15.5 7.2-6.9 2.1-2.6 6.8L4 3z"
            fill="#D97757"
            stroke="#ffffff"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
        </svg>
        <div
          class="ml-3 -mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-white shadow-lg"
          style="background-color: #D97757;"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-2.5 h-2.5 text-white" aria-hidden="true">
            <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
          </svg>
          <span>Claude</span>
        </div>
      </div>
    </div>
  </div>
</template>
