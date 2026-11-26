import { useState } from 'react'
import Link from 'next/link'
import type { AcademyPlan } from '../lib/courses'
import { supabase } from '../lib/supabase'
import { useSupabaseUser } from '../lib/useSupabaseUser'

type PremiumPlanKey = Extract<AcademyPlan['plan_key'], 'premium_monthly' | 'premium_annual'>

export function PremiumInterestButton({ planKey }: { planKey: PremiumPlanKey }) {
  const { user, loading } = useSupabaseUser()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function requestAccess() {
    if (!supabase || !user) return
    setBusy(true)
    setMessage('')
    try {
      const { error } = await supabase
        .from('academy_premium_interests')
        .insert({ user_id: user.id, plan_key: planKey })
      if (error?.code === '23505') {
        setMessage('You are already on the early-access list for this plan.')
        return
      }
      if (error) {
        console.error('Could not save the Premium access request:', error)
        setMessage('Your request could not be saved. Please try again.')
        return
      }
      setMessage('You are on the early-access list. No payment has been taken.')
    } catch (error) {
      console.error('Could not save the Premium access request:', error)
      setMessage('Your request could not be saved. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (!user && !loading) {
    return <Link className="button button-primary plan-action" href="/sign-in">Sign in to request access</Link>
  }

  return (
    <div className="plan-action-wrap">
      <button className="button button-primary plan-action" type="button" disabled={loading || busy || !supabase} onClick={requestAccess}>
        {loading ? 'Checking account…' : busy ? 'Saving request…' : 'Request early access'}
      </button>
      {message && <p className="form-message" role="status">{message}</p>}
    </div>
  )
}
