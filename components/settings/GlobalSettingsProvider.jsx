'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { DEFAULT_SETTINGS } from '@/lib/global-settings'

const GlobalSettingsContext = createContext(null)

export function useGlobalSettings() {
  const context = useContext(GlobalSettingsContext)

  if (!context) {
    throw new Error(
      'useGlobalSettings must be used within GlobalSettingsProvider'
    )
  }

  return context
}

export default function GlobalSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

useEffect(() => {
  const saved = localStorage.getItem('civilcalc-settings')

  if (saved) {
    try {
      setSettings(JSON.parse(saved))
    } catch (error) {
      console.error(error)
    }
  }
}, [])

useEffect(() => {
  localStorage.setItem(
    'civilcalc-settings',
    JSON.stringify(settings)
  )
}, [settings])

  const updateSettings = (updates) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  return (
    <GlobalSettingsContext.Provider
      value={{
        settings,
        updateSettings,
      }}
    >
      {children}
    </GlobalSettingsContext.Provider>
  )
}
