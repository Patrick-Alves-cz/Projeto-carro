import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import {
  LayoutDashboard,
  Car,
  Users,
  FileSignature,
  Wallet,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { useState } from 'react'
import { useData } from '../../contexts/DataContext.jsx'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/frota', label: 'Frota', icon: Car },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/locacoes', label: 'Locações', icon: FileSignature },
  { to: '/financeiro', label: 'Financeiro', icon: Wallet },
  { to: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { settings } = useData()

  return (
    <aside
      className={clsx(
        'sticky top-0 flex h-screen shrink-0 flex-col border-r border-ink-700 bg-ink-900 transition-all duration-300 ease-premium',
        collapsed ? 'w-[76px]' : 'w-[248px]'
      )}
    >
      <div className={clsx('flex h-16 items-center gap-2.5 border-b border-ink-700 px-4', collapsed && 'justify-center px-0')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gold-500/30 bg-gold-500/10">
          <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
            <path d="M24 4 L42 14 V34 L24 44 L6 34 V14 Z" stroke="#C9A961" strokeWidth="2.4" fill="none" />
            <path d="M17 24 L22 29 L31 19" stroke="#C9A961" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-[13px] font-bold tracking-wide text-mist-50">
              {settings.companyName?.split(' ')[0] ?? 'Rufino'}
              <span className="text-gold-400"> {settings.companyName?.split(' ').slice(1).join(' ') || 'Rent Car'}</span>
            </p>
            <p className="truncate text-[10.5px] text-mist-400">Gestão de frota</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-gold-500/10 text-gold-400'
                  : 'text-mist-300 hover:bg-ink-800 hover:text-mist-50'
              )
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <item.icon size={17} strokeWidth={isActive ? 2.3 : 1.8} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed((v) => !v)}
        className={clsx(
          'flex h-11 items-center gap-2 border-t border-ink-700 px-4 text-[12px] font-medium text-mist-400 transition-colors hover:bg-ink-800 hover:text-mist-100',
          collapsed && 'justify-center px-0'
        )}
      >
        {collapsed ? <ChevronsRight size={15} /> : (
          <>
            <ChevronsLeft size={15} /> Recolher
          </>
        )}
      </button>
    </aside>
  )
}
