import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'
import ShortcutsHelpModal from '../components/ui/ShortcutsHelpModal.jsx'
import { useHotkey } from '../hooks/useHotkey.js'

export default function MainLayout() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  useHotkey('?', () => setShortcutsOpen(true), { enabled: !shortcutsOpen })

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenShortcuts={() => setShortcutsOpen(true)} />
        <main className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-[1400px] animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      <ShortcutsHelpModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  )
}
