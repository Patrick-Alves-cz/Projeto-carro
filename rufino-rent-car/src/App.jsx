import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import FleetListPage from './pages/fleet/FleetListPage.jsx'
import VehicleDetailPage from './pages/fleet/VehicleDetailPage.jsx'
import ClientsPage from './pages/clients/ClientsPage.jsx'
import RentalsPage from './pages/rentals/RentalsPage.jsx'
import FinancePage from './pages/finance/FinancePage.jsx'
import ReportsPage from './pages/reports/ReportsPage.jsx'
import SettingsPage from './pages/settings/SettingsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ErrorBoundary from './components/shared/ErrorBoundary.jsx'
import LoadingScreen from './components/ui/LoadingScreen.jsx'
import { useData } from './contexts/DataContext.jsx'

export default function App() {
  const { loading } = useData()

  if (loading) return <LoadingScreen label="Carregando dados da locadora..." />

  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/frota" element={<FleetListPage />} />
          <Route path="/frota/:id" element={<VehicleDetailPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/locacoes" element={<RentalsPage />} />
          <Route path="/financeiro" element={<FinancePage />} />
          <Route path="/relatorios" element={<ReportsPage />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
