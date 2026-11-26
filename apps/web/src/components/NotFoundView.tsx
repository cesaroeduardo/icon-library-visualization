import { useCallback, useEffect, useRef, useState } from 'react'
import { Eraser, Pencil, RotateCcw, Home, ArrowRight } from 'lucide-react'
import { ActionButton } from '@/components/ui/tuff'
import type { Lang } from '@/content'
import { STUDIO_URL } from '@/content'

const GRID = 20

type Tool = 'draw' | 'erase'

function emptyCells(): boolean[] {
  return Array.from({ length: GRID * GRID }, () => false)
}

function paintRect(cells: boolean[], x0: number, y0: number, x1: number, y1: number) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (x >= 0 && x < GRID && y >= 0 && y < GRID) cells[y * GRID + x] = true
    }
  }
}

/** Blocky digit glyphs drawn inside the 20×20 live area. */
export function makeDigit4(): boolean[] {
  const cells = emptyCells()
  paintRect(cells, 4, 3, 6, 11)
  paintRect(cells, 13, 3, 15, 16)
  paintRect(cells, 4, 10, 15, 12)
  return cells
}

export function makeDigit0(): boolean[] {
  const cells = emptyCells()
  paintRect(cells, 5, 3, 14, 5)
  paintRect(cells, 5, 14, 14, 16)
  paintRect(cells, 5, 3, 7, 16)
  paintRect(cells, 12, 3, 14, 16)
  return cells
}

const COPY = {
  pt: {
    title: 'Página não encontrada',
    draw: 'Desenhar',
    erase: 'Apagar',
    reset: 'Resetar dígitos',
    clear: 'Limpar tudo',
    home: 'Voltar ao início',
    studio: 'Abrir Studio'
  },
  en: {
    title: 'Page not found',
    draw: 'Draw',
    erase: 'Erase',
    reset: 'Reset digits',
    clear: 'Clear all',
    home: 'Back home',
    studio: 'Open Studio'
  }
} as const

function cellFromPoint(
  board: HTMLDivElement,
  clientX: number,
  clientY: number
): { x: number; y: number } | null {
  const rect = board.getBoundingClientRect()
  const x = Math.floor(((clientX - rect.left) / rect.width) * GRID)
  const y = Math.floor(((clientY - rect.top) / rect.height) * GRID)
  if (x < 0 || x >= GRID || y < 0 || y >= GRID) return null
  return { x, y }
}

function paintLine(
  onPaint: (index: number, value: boolean) => void,
  value: boolean,
  x0: number,
  y0: number,
  x1: number,
  y1: number
) {
  const dx = Math.abs(x1 - x0)
  const dy = Math.abs(y1 - y0)
  const sx = x0 < x1 ? 1 : -1
  const sy = y0 < y1 ? 1 : -1
  let err = dx - dy
  let x = x0
  let y = y0
  while (true) {
    onPaint(y * GRID + x, value)
    if (x === x1 && y === y1) break
    const e2 = err * 2
    if (e2 > -dy) {
      err -= dy
      x += sx
    }
    if (e2 < dx) {
      err += dx
      y += sy
    }
  }
}

function DrawGrid({
  label,
  cells,
  tool,
  onPaint
}: {
  label: string
  cells: boolean[]
  tool: Tool
  onPaint: (index: number, value: boolean) => void
}) {
  const painting = useRef(false)
  const paintValue = useRef(true)
  const lastCell = useRef<{ x: number; y: number } | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const applyAt = useCallback(
    (clientX: number, clientY: number) => {
      const board = boardRef.current
      if (!board) return
      const cell = cellFromPoint(board, clientX, clientY)
      if (!cell) return
      const prev = lastCell.current
      if (prev) paintLine(onPaint, paintValue.current, prev.x, prev.y, cell.x, cell.y)
      else onPaint(cell.y * GRID + cell.x, paintValue.current)
      lastCell.current = cell
    },
    [onPaint]
  )

  useEffect(() => {
    const stop = () => {
      painting.current = false
      lastCell.current = null
    }
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    return () => {
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
  }, [])

  return (
    <div
      ref={boardRef}
      role="img"
      aria-label={`Drawable ${label} digit on a 20 by 20 grid`}
      className="relative h-full w-full min-h-0 min-w-0 select-none touch-none cursor-crosshair grid"
      style={{
        gridTemplateColumns: `repeat(${GRID}, 1fr)`,
        gridTemplateRows: `repeat(${GRID}, 1fr)`,
        backgroundImage:
          'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
        backgroundSize: `calc(100% / ${GRID}) calc(100% / ${GRID})`
      }}
      onPointerDown={(e) => {
        e.preventDefault()
        boardRef.current?.setPointerCapture(e.pointerId)
        painting.current = true
        paintValue.current = tool === 'draw'
        lastCell.current = null
        applyAt(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => {
        if (!painting.current) return
        applyAt(e.clientX, e.clientY)
      }}
    >
      {cells.map((on, i) => (
        <div
          key={i}
          className={on ? 'bg-foreground' : 'bg-transparent hover:bg-foreground/[0.08]'}
        />
      ))}
    </div>
  )
}

export function NotFoundView({
  lang,
  onHome
}: {
  lang: Lang
  onHome: () => void
}) {
  const t = COPY[lang]
  const [tool, setTool] = useState<Tool>('draw')
  const [grids, setGrids] = useState<boolean[][]>(() => [
    makeDigit4(),
    makeDigit0(),
    makeDigit4()
  ])

  const paintCell = useCallback((gridIndex: number, cellIndex: number, value: boolean) => {
    setGrids((prev) => {
      const current = prev[gridIndex]
      if (current[cellIndex] === value) return prev
      const next = current.slice()
      next[cellIndex] = value
      const copy = prev.slice()
      copy[gridIndex] = next
      return copy
    })
  }, [])

  function resetDigits() {
    setGrids([makeDigit4(), makeDigit0(), makeDigit4()])
  }

  function clearAll() {
    setGrids([emptyCells(), emptyCells(), emptyCells()])
  }

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background">
      <div className="absolute inset-0 grid grid-cols-3">
        {(['4', '0', '4'] as const).map((digit, i) => (
          <DrawGrid
            key={`${digit}-${i}`}
            label={digit}
            cells={grids[i]}
            tool={tool}
            onPaint={(index, value) => paintCell(i, index, value)}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between p-4 sm:p-6">
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 rounded-full bg-background/75 p-1.5 backdrop-blur-md">
          <ActionButton
            variant={tool === 'draw' ? 'secondary' : 'quiet'}
            size="sm"
            onClick={() => setTool('draw')}
            aria-pressed={tool === 'draw'}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>{t.draw}</span>
          </ActionButton>
          <ActionButton
            variant={tool === 'erase' ? 'secondary' : 'quiet'}
            size="sm"
            onClick={() => setTool('erase')}
            aria-pressed={tool === 'erase'}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>{t.erase}</span>
          </ActionButton>
          <ActionButton variant="quiet" size="sm" onClick={resetDigits}>
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.reset}</span>
          </ActionButton>
          <ActionButton variant="quiet" size="sm" onClick={clearAll}>
            <span>{t.clear}</span>
          </ActionButton>
        </div>

        <h1 className="pointer-events-none text-center text-3xl sm:text-4xl font-semibold tracking-[-0.03em] leading-tight drop-shadow-sm">
          {t.title}
        </h1>

        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2">
          <ActionButton variant="primary" size="md" onClick={onHome}>
            <Home className="w-4 h-4" />
            <span>{t.home}</span>
          </ActionButton>
          <a
            href={STUDIO_URL}
            className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-full font-medium text-sm tuff-btn-secondary"
          >
            <span>{t.studio}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </main>
  )
}
