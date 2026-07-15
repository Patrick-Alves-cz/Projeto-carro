import { storageAdapter } from './storageAdapter'

const KEY = 'settings'

const DEFAULT_SETTINGS = {
  companyName: 'Rufino Rent Car',
  ownerName: 'Magno Rufino',
  cnpj: '',
  phone: '',
  email: '',
  address: '',
  logo: '',
  alertThresholdDays: 30,
}

export const settingsService = {
  async get() {
    const saved = await storageAdapter.get(KEY, null)
    return { ...DEFAULT_SETTINGS, ...(saved || {}) }
  },
  async update(patch) {
    const current = await this.get()
    const next = { ...current, ...patch }
    await storageAdapter.set(KEY, next)
    return next
  },
  defaults: DEFAULT_SETTINGS,
}
