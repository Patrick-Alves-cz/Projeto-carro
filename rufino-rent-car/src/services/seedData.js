import { storageAdapter } from './storageAdapter'
import { vehicleService } from './vehicleService'
import { clientService } from './clientService'
import { rentalService } from './rentalService'
import { financeService } from './financeService'

const SEED_FLAG = 'seeded'

const uid = () => crypto.randomUUID()
const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}
const daysAhead = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

const FLEET = [
  { brand: 'Chevrolet', model: 'Onix', version: 'LT 1.0 Turbo', year: 2023, color: 'Branco', category: 'hatch', purchaseValue: 78900 },
  { brand: 'Hyundai', model: 'HB20', version: 'Comfort 1.0', year: 2022, color: 'Prata', category: 'hatch', purchaseValue: 72400 },
  { brand: 'Jeep', model: 'Compass', version: 'Longitude', year: 2023, color: 'Preto', category: 'suv', purchaseValue: 159900 },
  { brand: 'Toyota', model: 'Corolla', version: 'XEi 2.0', year: 2022, color: 'Prata', category: 'sedan', purchaseValue: 142000 },
  { brand: 'Fiat', model: 'Toro', version: 'Freedom 1.3', year: 2023, color: 'Cinza', category: 'pickup', purchaseValue: 138500 },
  { brand: 'Volkswagen', model: 'Polo', version: 'TSI Comfortline', year: 2023, color: 'Branco', category: 'hatch', purchaseValue: 89900 },
  { brand: 'Renault', model: 'Kwid', version: 'Zen 1.0', year: 2022, color: 'Vermelho', category: 'popular', purchaseValue: 58900 },
  { brand: 'Honda', model: 'HR-V', version: 'EXL 1.5 Turbo', year: 2023, color: 'Azul', category: 'suv', purchaseValue: 165000 },
  { brand: 'Fiat', model: 'Fiorino', version: 'Furgão 1.4', year: 2021, color: 'Branco', category: 'utilitario', purchaseValue: 82000 },
  { brand: 'Chevrolet', model: 'Tracker', version: 'Premier Turbo', year: 2023, color: 'Preto', category: 'suv', purchaseValue: 148900 },
]

const CLIENT_NAMES = [
  'Carlos Eduardo Silva', 'Ana Paula Ferreira', 'Marcos Vinícius Souza', 'Juliana Costa Lima',
  'Roberto Almeida', 'Fernanda Rodrigues', 'Pedro Henrique Santos', 'Camila Oliveira',
  'Rafael Barbosa', 'Larissa Martins',
]

export async function ensureSeedData() {
  const alreadySeeded = await storageAdapter.get(SEED_FLAG, false)
  if (alreadySeeded) return

  const vehicles = []
  for (let i = 0; i < FLEET.length; i++) {
    const spec = FLEET[i]
    const status = i < 5 ? 'alugado' : i < 8 ? 'disponivel' : i === 8 ? 'manutencao' : 'reservado'
    const v = await vehicleService.create({
      ...spec,
      photo: '',
      plate: `RRC${(1000 + i * 137).toString().slice(0, 4)}`,
      renavam: `${900000000 + i * 7654321}`.slice(0, 11),
      chassis: `9BW${(100000000 + i * 998877).toString().slice(0, 14)}`,
      purchaseDate: daysAgo(365 + i * 40),
      mileage: 8000 + i * 3200,
      status,
      insuranceExpiry: daysAhead(45 - i * 12),
      licensingExpiry: daysAhead(60 - i * 15),
      notes: '',
    })
    vehicles.push(v)
  }

  const clients = []
  for (const name of CLIENT_NAMES) {
    const c = await clientService.create({
      name,
      cpf: `${Math.floor(100 + Math.random() * 800)}.${Math.floor(100 + Math.random() * 800)}.${Math.floor(100 + Math.random() * 800)}-${Math.floor(10 + Math.random() * 89)}`,
      rg: `${Math.floor(10000000 + Math.random() * 89999999)}`,
      cnh: `${Math.floor(1000000000 + Math.random() * 8999999999)}`,
      cnhExpiry: daysAhead(Math.floor(Math.random() * 400) - 20),
      phone: `(66) 9${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}`,
      whatsapp: `(66) 9${Math.floor(1000 + Math.random() * 8999)}-${Math.floor(1000 + Math.random() * 8999)}`,
      email: `${name.split(' ')[0].toLowerCase()}@email.com`,
      address: 'Rondonópolis, MT',
      notes: '',
    })
    clients.push(c)
  }

  // Historical rentals across the last 6 months to populate charts meaningfully
  const rentalSeeds = []
  for (let m = 5; m >= 0; m--) {
    const count = 4 + Math.floor(Math.random() * 4)
    for (let i = 0; i < count; i++) {
      const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)]
      const client = clients[Math.floor(Math.random() * clients.length)]
      const days = 2 + Math.floor(Math.random() * 8)
      const dailyRate = 110 + Math.floor(Math.random() * 220)
      const pickupOffset = m * 30 + Math.floor(Math.random() * 25)
      rentalSeeds.push({
        clientId: client.id,
        vehicleId: vehicle.id,
        pickupDate: daysAgo(pickupOffset),
        returnDate: daysAgo(Math.max(pickupOffset - days, 0)),
        actualReturnDate: daysAgo(Math.max(pickupOffset - days, 0)),
        dailyRate,
        days,
        totalValue: dailyRate * days,
        paymentMethod: ['pix', 'cartao_credito', 'dinheiro', 'transferencia'][Math.floor(Math.random() * 4)],
        status: 'finalizada',
        notes: '',
        createdAt: daysAgo(pickupOffset),
      })
    }
  }

  // A few active rentals right now, matching the "alugado" vehicles above
  vehicles.slice(0, 5).forEach((vehicle, i) => {
    const days = 3 + i
    const dailyRate = 130 + i * 25
    rentalSeeds.push({
      clientId: clients[i].id,
      vehicleId: vehicle.id,
      pickupDate: daysAgo(1 + i),
      returnDate: daysAhead(days - i),
      actualReturnDate: '',
      dailyRate,
      days,
      totalValue: dailyRate * days,
      paymentMethod: 'pix',
      status: 'ativa',
      notes: '',
      createdAt: daysAgo(1 + i),
    })
  })

  for (const seed of rentalSeeds) {
    await rentalService.create(seed)
  }

  const expenseCategories = ['combustivel', 'manutencao', 'seguro', 'ipva', 'pneus', 'lavagem', 'pecas', 'multas']
  const expenseSeeds = []
  for (let m = 5; m >= 0; m--) {
    const count = 5 + Math.floor(Math.random() * 5)
    for (let i = 0; i < count; i++) {
      const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)]
      const vehicle = Math.random() > 0.2 ? vehicles[Math.floor(Math.random() * vehicles.length)] : null
      const value = category === 'seguro' ? 250 + Math.random() * 400
        : category === 'ipva' ? 180 + Math.random() * 300
        : category === 'manutencao' ? 150 + Math.random() * 900
        : 40 + Math.random() * 300
      expenseSeeds.push({
        description: `${category[0].toUpperCase()}${category.slice(1)} — ${vehicle ? vehicle.plate : 'geral'}`,
        category,
        value: Math.round(value),
        date: daysAgo(m * 30 + Math.floor(Math.random() * 25)),
        vehicleId: vehicle?.id ?? null,
        notes: '',
      })
    }
  }
  for (const seed of expenseSeeds) {
    await financeService.create(seed)
  }

  await storageAdapter.set(SEED_FLAG, true)
}
