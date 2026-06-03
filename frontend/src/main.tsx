import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './i18n/config'
import './index.css'
import { router } from '@/router'
import { useThemeStore } from '@/store/themeStore'

const { theme } = useThemeStore.getState()
document.documentElement.classList.toggle('dark', theme === 'dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
