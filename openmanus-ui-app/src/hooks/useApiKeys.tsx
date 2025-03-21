'use client'

import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'

// Define types for API keys
export type ApiKey = {
  id: string
  provider: string
  api_key: string
  model: string | null
  base_url: string | null
  created_at: string
}

export type ApiKeyInput = {
  provider: string
  api_key: string
  model?: string
  base_url?: string
}

// Hook for managing API keys
export function useApiKeys() {
  const { user } = useAuth()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch API keys
  const fetchApiKeys = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setApiKeys(data || [])
    } catch (err: any) {
      console.error('Error fetching API keys:', err)
      setError(err.message || 'Failed to fetch API keys')
    } finally {
      setIsLoading(false)
    }
  }

  // Add a new API key
  const addApiKey = async (apiKeyData: ApiKeyInput) => {
    if (!user) return { error: new Error('User not authenticated') }

    try {
      const { data, error } = await supabase
        .from('api_keys')
        .insert([
          {
            user_id: user.id,
            ...apiKeyData
          }
        ])
        .select()

      if (error) {
        throw error
      }

      // Refresh the API keys list
      await fetchApiKeys()
      return { data, error: null }
    } catch (err: any) {
      console.error('Error adding API key:', err)
      return { data: null, error: err }
    }
  }

  // Update an existing API key
  const updateApiKey = async (id: string, apiKeyData: Partial<ApiKeyInput>) => {
    if (!user) return { error: new Error('User not authenticated') }

    try {
      const { data, error } = await supabase
        .from('api_keys')
        .update(apiKeyData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()

      if (error) {
        throw error
      }

      // Refresh the API keys list
      await fetchApiKeys()
      return { data, error: null }
    } catch (err: any) {
      console.error('Error updating API key:', err)
      return { data: null, error: err }
    }
  }

  // Delete an API key
  const deleteApiKey = async (id: string) => {
    if (!user) return { error: new Error('User not authenticated') }

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      // Refresh the API keys list
      await fetchApiKeys()
      return { error: null }
    } catch (err: any) {
      console.error('Error deleting API key:', err)
      return { error: err }
    }
  }

  // Load API keys on component mount or when user changes
  useEffect(() => {
    if (user) {
      fetchApiKeys()
    } else {
      setApiKeys([])
      setIsLoading(false)
    }
  }, [user])

  return {
    apiKeys,
    isLoading,
    error,
    fetchApiKeys,
    addApiKey,
    updateApiKey,
    deleteApiKey
  }
}
