'use client'

import { createContext, useContext, useState } from 'react'
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
