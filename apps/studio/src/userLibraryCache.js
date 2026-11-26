const DB_NAME = 'icon-library-studio'
const DB_VERSION = 1
const STORE = 'userLibrary'
const RECORD_KEY = 'current'

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'))
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
  })
}

function copyArrayBuffer(value) {
  if (!value) return null
  if (value instanceof ArrayBuffer) return value.slice(0)
  if (ArrayBuffer.isView(value)) {
    return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength)
  }
  return null
}

function copyUint8(value) {
  if (!value) return null
  if (value instanceof Uint8Array) return new Uint8Array(value)
  if (value instanceof ArrayBuffer) return new Uint8Array(value.slice(0))
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength))
  }
  return null
}

export function serializeUserLibrary(library) {
  if (!library) return null
  const artifacts = library.artifacts || {}
  return {
    sourceType: library.sourceType,
    fontName: library.fontName,
    prefix: library.prefix,
    icons: library.icons || [],
    monoCount: library.monoCount || 0,
    coloredCount: library.coloredCount || 0,
    notice: library.notice || '',
    credits: library.credits || null,
    artifacts: {
      cssContent: artifacts.cssContent || null,
      catalogJson: artifacts.catalogJson || null,
      colorCatalogJson: artifacts.colorCatalogJson || null,
      ttfBuffer: copyArrayBuffer(artifacts.ttfBuffer),
      otfBuffer: copyArrayBuffer(artifacts.otfBuffer),
      woffBytes: copyUint8(artifacts.woffBytes),
      woff2Buffer: copyArrayBuffer(artifacts.woff2Buffer)
    }
  }
}

export async function registerRuntimeFont(library) {
  if (!library) return library
  const artifacts = library.artifacts || {}
  const source =
    artifacts.ttfBuffer ||
    artifacts.otfBuffer ||
    artifacts.woffBytes ||
    artifacts.woff2Buffer

  if (!source || typeof FontFace === 'undefined' || typeof document === 'undefined') {
    library.runtimeFamily = library.runtimeFamily || ''
    return library
  }

  const family = `${library.fontName || 'custom-icons'}-${Date.now()}`
  try {
    const face = new FontFace(family, source)
    await face.load()
    document.fonts.add(face)
    library.runtimeFamily = family
  } catch (e) {
    console.warn('Failed to re-register cached webfont:', e)
    library.runtimeFamily = ''
  }
  return library
}

export async function saveUserLibraryCache({ library, rawSvgs = [] }) {
  const serialized = serializeUserLibrary(library)
  if (!serialized) return

  const db = await openDb()
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error || new Error('Failed to save user library cache'))
    tx.objectStore(STORE).put(
      {
        library: serialized,
        rawSvgs: Array.isArray(rawSvgs) ? rawSvgs : [],
        savedAt: Date.now()
      },
      RECORD_KEY
    )
  })
  db.close()
}

export async function loadUserLibraryCache() {
  try {
    const db = await openDb()
    const record = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      tx.onerror = () => reject(tx.error || new Error('Failed to read user library cache'))
      const req = tx.objectStore(STORE).get(RECORD_KEY)
      req.onsuccess = () => resolve(req.result || null)
    })
    db.close()

    if (!record?.library) return null
    const library = await registerRuntimeFont({ ...record.library })
    return {
      library,
      rawSvgs: Array.isArray(record.rawSvgs) ? record.rawSvgs : [],
      savedAt: record.savedAt || 0
    }
  } catch (e) {
    console.warn('Failed to load cached user library:', e)
    return null
  }
}

export async function clearUserLibraryCache() {
  try {
    const db = await openDb()
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error || new Error('Failed to clear user library cache'))
      tx.objectStore(STORE).delete(RECORD_KEY)
    })
    db.close()
  } catch (e) {
    console.warn('Failed to clear cached user library:', e)
  }
}
