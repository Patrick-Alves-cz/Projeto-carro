import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { vehicleService } from '../services/vehicleService'
import { clientService } from '../services/clientService'
import { rentalService } from '../services/rentalService'
import { financeService } from '../services/financeService'
import { settingsService } from '../services/settingsService'
import { ensureSeedData } from '../services/seedData'
import { buildAlerts } from '../utils/alerts'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [vehicles, setVehicles] = useState([])
  const [clients, setClients] = useState([])
  const [rentals, setRentals] = useState([])
  const [expenses, setExpenses] = useState([])
  const [settings, setSettings] = useState(settingsService.defaults)
  const [loading, setLoading] = useState(true)

  const reloadAll = useCallback(async () => {
    const [v, c, r, e, s] = await Promise.all([
      vehicleService.list(),
      clientService.list(),
      rentalService.list(),
      financeService.list(),
      settingsService.get(),
    ])
    setVehicles(v)
    setClients(c)
    setRentals(r)
    setExpenses(e)
    setSettings(s)
  }, [])

  useEffect(() => {
    ;(async () => {
      await ensureSeedData()
      await reloadAll()
      setLoading(false)
    })()
  }, [reloadAll])

  // ---------- Vehicles ----------
  const addVehicle = useCallback(async (data) => {
    const created = await vehicleService.create(data)
    setVehicles((prev) => [...prev, created])
    return created
  }, [])

  const editVehicle = useCallback(async (id, patch) => {
    const updated = await vehicleService.update(id, patch)
    setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)))
    return updated
  }, [])

  const deleteVehicle = useCallback(async (id) => {
    await vehicleService.remove(id)
    setVehicles((prev) => prev.filter((v) => v.id !== id))
  }, [])

  // ---------- Clients ----------
  const addClient = useCallback(async (data) => {
    const created = await clientService.create(data)
    setClients((prev) => [...prev, created])
    return created
  }, [])

  const editClient = useCallback(async (id, patch) => {
    const updated = await clientService.update(id, patch)
    setClients((prev) => prev.map((c) => (c.id === id ? updated : c)))
    return updated
  }, [])

  const deleteClient = useCallback(async (id) => {
    await clientService.remove(id)
    setClients((prev) => prev.filter((c) => c.id !== id))
  }, [])

  // ---------- Rentals (orchestrates vehicle status transitions) ----------
  const addRental = useCallback(async (data) => {
    const created = await rentalService.create(data)
    setRentals((prev) => [...prev, created])
    if (created.status === 'ativa') {
      const updatedVehicle = await vehicleService.setStatus(created.vehicleId, 'alugado')
      setVehicles((prev) => prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v)))
    }
    return created
  }, [])

  const editRental = useCallback(
    async (id, patch) => {
      const previous = rentals.find((r) => r.id === id)
      const updated = await rentalService.update(id, patch)
      setRentals((prev) => prev.map((r) => (r.id === id ? updated : r)))

      const wasActive = previous?.status === 'ativa'
      const isNowActive = updated.status === 'ativa'
      const isNowFinished = updated.status === 'finalizada' || updated.status === 'cancelada'

      if (!wasActive && isNowActive) {
        const uv = await vehicleService.setStatus(updated.vehicleId, 'alugado')
        setVehicles((prev) => prev.map((v) => (v.id === uv.id ? uv : v)))
      } else if (wasActive && isNowFinished) {
        const uv = await vehicleService.setStatus(updated.vehicleId, 'disponivel')
        setVehicles((prev) => prev.map((v) => (v.id === uv.id ? uv : v)))
      }
      return updated
    },
    [rentals]
  )

  const finalizeRental = useCallback(
    async (id, actualReturnDate = new Date().toISOString()) => {
      return editRental(id, { status: 'finalizada', actualReturnDate })
    },
    [editRental]
  )

  const deleteRental = useCallback(async (id) => {
    await rentalService.remove(id)
    setRentals((prev) => prev.filter((r) => r.id !== id))
  }, [])

  // ---------- Finance ----------
  const addExpense = useCallback(async (data) => {
    const created = await financeService.create(data)
    setExpenses((prev) => [...prev, created])
    return created
  }, [])

  const editExpense = useCallback(async (id, patch) => {
    const updated = await financeService.update(id, patch)
    setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)))
    return updated
  }, [])

  const deleteExpense = useCallback(async (id) => {
    await financeService.remove(id)
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }, [])

  // ---------- Settings ----------
  const updateSettings = useCallback(async (patch) => {
    const updated = await settingsService.update(patch)
    setSettings(updated)
    return updated
  }, [])

  const alerts = buildAlerts({ vehicles, clients, rentals })

  const value = {
    loading,
    vehicles,
    clients,
    rentals,
    expenses,
    settings,
    alerts,
    reloadAll,
    addVehicle,
    editVehicle,
    deleteVehicle,
    addClient,
    editClient,
    deleteClient,
    addRental,
    editRental,
    finalizeRental,
    deleteRental,
    addExpense,
    editExpense,
    deleteExpense,
    updateSettings,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData deve ser usado dentro de um DataProvider')
  return ctx
}
