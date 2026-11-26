import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

const REPO = 'cesaroeduardo/icon-library-visualization'
const CACHE_KEY = 'icon-library-gh-stars'
const CACHE_TTL = 1000 * 60 * 30

let inflight: Promise<number | null> | null = null

function fetchStars(): Promise<number | null> {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null')
    if (cached && Date.now() - cached.t < CACHE_TTL) return Promise.resolve(cached.n)
  } catch {
    // ignore
  }
  if (!inflight) {
    inflight = fetch(`https://api.github.com/repos/${REPO}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const n = typeof d?.stargazers_count === 'number' ? d.stargazers_count : null
        if (n !== null) sessionStorage.setItem(CACHE_KEY, JSON.stringify({ n, t: Date.now() }))
        return n
      })
      .catch(() => null)
  }
  return inflight
}

function format(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n)
}

export function GithubStars({ className = '' }: { className?: string }) {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    fetchStars().then((n) => active && setStars(n))
    return () => {
      active = false
    }
  }, [])

  if (stars === null) return null

  return (
    <span
      className={`inline-flex items-center self-stretch gap-1.5 border-l border-current/30 pl-2.5 ${className}`}
    >
      <Star className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth={2} />
      <span className="tabular-nums">{format(stars)}</span>
    </span>
  )
}
