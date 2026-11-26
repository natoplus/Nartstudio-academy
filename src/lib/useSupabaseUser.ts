import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return
      if (sessionError) {
        console.error('Could not restore the Academy sign-in session:', sessionError)
        setError('Your sign-in session could not be restored. Refresh the page or sign in again.')
      } else {
        setUser(data.session?.user ?? null)
      }
      setLoading(false)
    }).catch((sessionError: unknown) => {
      if (!active) return
      console.error('Could not restore the Academy sign-in session:', sessionError)
      setError('Your sign-in session could not be restored. Refresh the page or sign in again.')
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading, error }
}
