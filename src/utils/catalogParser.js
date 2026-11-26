/**
 * Parses a catalog.json or manifest.json file into a lookup map keyed by normalized icon name.
 * Supports:
 *   - Array of { name, keywords, tags, label, group, icon }
 *   - Object with { icons: [...] } (e.g. manifest.json)
 */
export function parseCatalogJson(text) {
  const map = new Map()
  try {
    const parsed = JSON.parse(text)
    const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.icons) ? parsed.icons : []
    for (const entry of list) {
      if (!entry || !entry.name) continue
      const key = String(entry.name).trim().toLowerCase()
      const kwParts = []
      if (typeof entry.keywords === 'string') kwParts.push(entry.keywords)
      else if (Array.isArray(entry.keywords)) kwParts.push(entry.keywords.join(' '))
      if (Array.isArray(entry.tags)) kwParts.push(entry.tags.join(' '))
      if (entry.label) kwParts.push(String(entry.label))
      if (entry.group) kwParts.push(String(entry.group))

      map.set(key, {
        name: String(entry.name).trim(),
        label: entry.label ? String(entry.label).trim() : '',
        group: entry.group ? String(entry.group).trim() : '',
        keywords: kwParts.join(' ').trim()
      })
    }
  } catch (e) {
    console.warn('Could not parse catalog JSON:', e)
  }
  return map
}
