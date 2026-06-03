import { Topbar } from '@/components/layout/Topbar'
import { Outlet } from 'react-router-dom'

export function KitchenLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Topbar />
      <main className="flex flex-1 flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
        <Outlet />
      </main>
    </div>
  )
}
