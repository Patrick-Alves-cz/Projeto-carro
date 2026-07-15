import { createRepository } from './repository'

const repo = createRepository('expenses')

export const financeService = {
  list: repo.list,
  get: repo.get,
  create: (data) => repo.create({ notes: '', vehicleId: null, ...data }),
  update: repo.update,
  remove: repo.remove,
  replaceAll: repo.replaceAll,
}
