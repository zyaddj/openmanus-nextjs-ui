'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type SettingsContextType = {
  theme: Theme
  toggleTheme: () => void
  temperature: number
  setTemperature: (value: number) => void
  maxTokens: number
  setMaxTokens: (value: number) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(4096)

  // Load settings from localStorage on component mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null
    const storedTemperature = localStorage.getItem('temperature')
    const storedMaxTokens = localStorage.getItem('maxTokens')

    if (storedTheme) setTheme(storedTheme)
    if (storedTemperature) setTemperature(parseFloat(storedTemperature))
    if (storedMaxTokens) setMaxTokens(parseInt(storedMaxTokens))

    // Apply theme to document
    document.documentElement.classList.toggle('dark', storedTheme !== 'light')
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('theme', theme)
    localStorage.setItem('temperature', temperature.toString())
    localStorage.setItem('maxTokens', maxTokens.toString())

    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme, temperature, maxTokens])

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

  const value = {
    theme,
    toggleTheme,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
