import { createRepository } from './repository'

const repo = createRepository('vehicles')

export const vehicleService = {
  list: repo.list,
  get: repo.get,
  create: (data) =>
    repo.create({
      photo: '',
      mileage: 0,
      status: 'disponivel',
      notes: '',
      ...data,
    }),
  update: repo.update,
  remove: repo.remove,
  replaceAll: repo.replaceAll,
  setStatus: (id, status) => repo.update(id, { status }),
}
