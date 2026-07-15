import { storageAdapter } from './storageAdapter'

/**
 * createRepository
 *
 * Factory that produces a small async CRUD interface (list/get/create/
 * update/remove) backed by a single localStorage collection. Every
 * domain service (vehicles, clients, rentals, finance...) is built on
 * top of this, so the day the app migrates to Supabase, only this one
 * factory needs a new implementation — every call site stays identical.
 */
export function createRepository(collectionName) {
  async function list() {
    return storageAdapter.get(collectionName, [])
  }

  async function get(id) {
    const items = await list()
    return items.find((item) => item.id === id) ?? null
  }

  async function create(record) {
    const items = await list()
    const now = new Date().toISOString()
    const newRecord = {
      id: record.id ?? crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...record,
    }
    const next = [...items, newRecord]
    await storageAdapter.set(collectionName, next)
    return newRecord
  }

  async function update(id, patch) {
    const items = await list()
    let updated = null
    const next = items.map((item) => {
      if (item.id !== id) return item
      updated = { ...item, ...patch, id, updatedAt: new Date().toISOString() }
      return updated
    })
    await storageAdapter.set(collectionName, next)
    return updated
  }

  async function remove(id) {
    const items = await list()
    const next = items.filter((item) => item.id !== id)
    await storageAdapter.set(collectionName, next)
    return true
  }

  async function replaceAll(records) {
    await storageAdapter.set(collectionName, records)
    return records
  }

  return { list, get, create, update, remove, replaceAll }
}
