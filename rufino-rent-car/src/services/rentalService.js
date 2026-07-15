import { createRepository } from './repository'

const repo = createRepository('rentals')

export const rentalService = {
  list: repo.list,
  get: repo.get,
  create: (data) => repo.create({ status: 'pendente', notes: '', actualReturnDate: '', ...data }),
  update: repo.update,
  remove: repo.remove,
  replaceAll: repo.replaceAll,
}
