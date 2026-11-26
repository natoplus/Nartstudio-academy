import { useEffect, useState, type FormEvent } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Layout } from '../components/Layout'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!router.isReady || router.query.confirmed !== '1' || !supabase) return
    let active = true

    async function finishEmailConfirmation() {
      setBusy(true)
      try {
        const { error } = await supabase!.auth.signOut()
        if (!active) return
        if (error) {
          console.error('Could not finish Academy email confirmation:', error)
          setMessage('Your email is confirmed, but we could not prepare the sign-in page. Please sign out and try signing in again.')
          return
        }
        setMessage('Your email is confirmed. Sign in with your email and password.')
      } catch (error) {
        if (!active) return
        console.error('Could not finish Academy email confirmation:', error)
        setMessage('Your email is confirmed, but we could not prepare the sign-in page. Please sign out and try signing in again.')
      } finally {
        if (active) setBusy(false)
      }
    }

    void finishEmailConfirmation()
    return () => {
      active = false
    }
  }, [router.isReady, router.query.confirmed])

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) {
      setMessage('Add the Academy Supabase URL and anon key before enabling sign-in.')
      return
    }
    setBusy(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) {
        console.error('Could not sign in to the Academy:', error)
        setMessage('Sign-in failed. Check your email and password, and confirm your email address if you have not already.')
        return
      }
      await router.push('/account')
    } catch (error) {
      console.error('Could not sign in to the Academy:', error)
      setMessage('Sign-in failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Layout>
      <Head><title>Sign in — Nartstudio Academy</title><meta name="description" content="Sign in to save Academy course progress and manage your learning account." /></Head>
      <section className="auth-page">
        <p className="eyebrow">YOUR CREATIVE PRACTICE, IN ONE PLACE</p>
        <h1>Welcome<br /><em>back.</em></h1>
        <p>Sign in to continue learning, save your course progress and manage your account.</p>
        {!hasSupabaseConfig && (
          <p className="data-message data-error" role="alert">
            Supabase is not configured in this Academy deployment. Add the public URL and anon key, then apply the Academy SQL files.
          </p>
        )}
        <form className="form-panel" onSubmit={(event) => { void signIn(event) }}>
          <label className="field-label">Email address
            <input type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="field-label">Password
            <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button className="button button-primary" type="submit" disabled={busy || !hasSupabaseConfig}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          {message && <p className="form-message" role="status">{message}</p>}
        </form>
        <p className="auth-footnote">New to the Academy? Create your free account and confirm your email before signing in.</p>
        <Link className="under-link" href="/sign-up">Create an account ↗</Link>
        <p><Link className="under-link" href="/courses">Explore courses without signing in ↗</Link></p>
      </section>
    </Layout>
  )
}
