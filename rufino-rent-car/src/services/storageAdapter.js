/**
 * storageAdapter.js
 *
 * Single choke point for persistence. Every read/write in the app goes
 * through here. The public API is intentionally async (even though the
 * localStorage implementation is synchronous under the hood) so that
 * swapping this file for a Supabase-backed adapter later requires no
 * changes anywhere else in the codebase — repositories, contexts and
 * pages all already await these calls.
 */

const NAMESPACE = 'rufino-rent-car'
const SCHEMA_VERSION = 1

function nsKey(key) {
  return `${NAMESPACE}:${key}`
}

function isStorageAvailable() {
  try {
    const testKey = `${NAMESPACE}:__probe__`
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export const storageAdapter = {
  available: isStorageAvailable(),

  async get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(nsKey(key))
      if (raw === null) return fallback
      return JSON.parse(raw)
    } catch (err) {
      console.error(`[storage] Falha ao ler "${key}"`, err)
      return fallback
    }
  },

  async set(key, value) {
    try {
      window.localStorage.setItem(nsKey(key), JSON.stringify(value))
      return true
    } catch (err) {
      console.error(`[storage] Falha ao gravar "${key}"`, err)
      return false
    }
  },

  async remove(key) {
    window.localStorage.removeItem(nsKey(key))
    return true
  },

  async clearAll() {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(`${NAMESPACE}:`))
      .forEach((k) => window.localStorage.removeItem(k))
    return true
  },

  /** Serializes the entire app namespace — used by the backup/export feature. */
  async exportAll() {
    const data = {}
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(`${NAMESPACE}:`))
      .forEach((k) => {
        const shortKey = k.replace(`${NAMESPACE}:`, '')
        try {
          data[shortKey] = JSON.parse(window.localStorage.getItem(k))
        } catch {
          data[shortKey] = window.localStorage.getItem(k)
        }
      })
    return { schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), data }
  },

  async importAll(payload) {
    if (!payload?.data) throw new Error('Arquivo de backup inválido')
    Object.entries(payload.data).forEach(([shortKey, value]) => {
      window.localStorage.setItem(nsKey(shortKey), JSON.stringify(value))
    })
    return true
  },

  schemaVersion: SCHEMA_VERSION,
}
