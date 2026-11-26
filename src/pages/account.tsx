import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '../components/Layout'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import { useSupabaseUser } from '../lib/useSupabaseUser'

type Membership = { plan_key: string; status: string; current_period_end: string | null }
type Progress = { course_slug: string; completed_lesson_ids: string[] }

function membershipIsActive(membership: Membership | null) {
  if (!membership || !['premium_monthly', 'premium_annual'].includes(membership.plan_key)) return false
  if (!['active', 'trialing'].includes(membership.status)) return false
  return !membership.current_period_end || new Date(membership.current_period_end).getTime() > Date.now()
}

export default function AccountPage() {
  const { user, loading, error: authError } = useSupabaseUser()
  const [membership, setMembership] = useState<Membership | null>(null)
  const [progress, setProgress] = useState<Progress[]>([])
  const [accountError, setAccountError] = useState('')
  const [signingOut, setSigningOut] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!supabase || !user) return
    let active = true

    async function loadAccount() {
      setAccountError('')
      const [membershipResult, progressResult] = await Promise.all([
        supabase!.from('academy_memberships').select('plan_key, status, current_period_end').eq('user_id', user!.id).maybeSingle(),
        supabase!.from('academy_course_progress').select('course_slug, completed_lesson_ids').eq('user_id', user!.id).order('last_seen_at', { ascending: false }),
      ])
      if (!active) return
      if (membershipResult.error) {
        console.error('Could not load Academy membership:', membershipResult.error)
        setAccountError('Your plan details could not be loaded.')
      } else {
        setMembership(membershipResult.data as Membership | null)
      }
      if (progressResult.error) {
        console.error('Could not load saved course progress:', progressResult.error)
        setAccountError((current) => current ? `${current} Course progress could not be loaded.` : 'Course progress could not be loaded.')
      } else {
        setProgress((progressResult.data ?? []) as Progress[])
      }
    }

    void loadAccount().catch((loadError: unknown) => {
      if (!active) return
      console.error('Could not load Academy account:', loadError)
      setAccountError('Your account details could not be loaded. Please refresh the page.')
    })

    return () => {
      active = false
    }
  }, [user])

  async function signOut() {
    if (!supabase) return
    setSigningOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Could not sign out of the Academy:', error)
        setMessage('Sign out failed. Please try again.')
      }
    } catch (error) {
      console.error('Could not sign out of the Academy:', error)
      setMessage('Sign out failed. Please try again.')
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <Layout>
      <Head><title>My learning — Nartstudio Academy</title><meta name="description" content="View your course progress and Academy membership." /></Head>
      <section className="account-page">
        <p className="eyebrow">YOUR ACADEMY</p>
        <h1>My learning<br /><em>and progress.</em></h1>
        {!hasSupabaseConfig && <p className="data-message data-error" role="alert">Supabase is not configured. Add the Academy environment keys and apply the SQL setup files.</p>}
        {loading && <p className="data-message" role="status">Checking your sign-in…</p>}
        {authError && <p className="data-message data-error" role="alert">{authError}</p>}
        {!loading && !user && hasSupabaseConfig && (
          <div className="form-panel">
            <p>Create a free account and confirm your email before signing in to save course progress.</p>
            <Link className="button button-primary" href="/sign-up">Create a free account</Link>
            <Link className="under-link" href="/sign-in">Already have an account? Sign in ↗</Link>
          </div>
        )}
        {user && (
          <>
            <div className="account-summary">
              <article className="account-card">
                <p className="eyebrow">ACCOUNT</p>
                <h2>{user.email}</h2>
                <p>Use this email to access your saved learning and requests.</p>
                <button className="button button-secondary" type="button" disabled={signingOut} onClick={() => { void signOut() }}>
                  {signingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </article>
              <article className="account-card">
                <p className="eyebrow">YOUR PLAN</p>
                <h2>{membershipIsActive(membership) ? 'Premium' : 'Free'}</h2>
                <p>{membershipIsActive(membership) ? `Membership status: ${membership?.status}.` : 'Free courses remain available without a subscription.'}</p>
                {!membershipIsActive(membership) && <Link className="under-link" href="/plans">Compare plans and request Premium ↗</Link>}
              </article>
            </div>
            {accountError && <p className="data-message data-error" role="alert">{accountError}</p>}
            <section className="account-progress">
              <div className="section-heading"><div><p className="eyebrow">SAVED TO YOUR ACCOUNT</p><h2>Course progress</h2></div><Link href="/courses">Find another course ↗</Link></div>
              {progress.length ? (
                <ul>{progress.map((item) => (
                  <li key={item.course_slug}>
                    <Link href={`/courses/${item.course_slug}`}>{item.course_slug.replace(/-/g, ' ')}</Link>
                    <span>{item.completed_lesson_ids.length} lessons complete</span>
                  </li>
                ))}</ul>
              ) : <p>No course progress saved yet. Open a free course and mark lessons complete as you work through them.</p>}
            </section>
            <div className="account-actions">
              <Link className="button button-secondary" href="/mentorship">Request mentorship</Link>
              <span role="status">{message}</span>
            </div>
          </>
        )}
      </section>
    </Layout>
  )
}
