import { createRepository } from './repository'

const repo = createRepository('clients')

export const clientService = {
  list: repo.list,
  get: repo.get,
  create: (data) => repo.create({ notes: '', ...data }),
  update: repo.update,
  remove: repo.remove,
  replaceAll: repo.replaceAll,
}
