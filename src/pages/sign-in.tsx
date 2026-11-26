import { useState, type FormEvent } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '../components/Layout'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  async function sendSignInLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) {
      setMessage('Add the Academy Supabase URL and anon key before enabling sign-in.')
      return
    }
    setBusy(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/account` },
      })
      if (error) {
        console.error('Could not send the Academy sign-in link:', error)
        setMessage('The sign-in email could not be sent. Check the Supabase Auth email settings and try again.')
        return
      }
      setSent(true)
      setMessage(`A secure sign-in link has been sent to ${email.trim()}.`)
    } catch (error) {
      console.error('Could not send the Academy sign-in link:', error)
      setMessage('The sign-in email could not be sent. Check the Supabase Auth email settings and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Layout>
      <Head><title>Sign in — Nartstudio Academy</title><meta name="description" content="Sign in to save Academy course progress and manage your learning account." /></Head>
      <section className="auth-page">
        <p className="eyebrow">YOUR CREATIVE PRACTICE, IN ONE PLACE</p>
        <h1>Sign in or<br /><em>start for free.</em></h1>
        <p>We will email you a secure, one-time sign-in link. No password to remember.</p>
        {!hasSupabaseConfig && (
          <p className="data-message data-error" role="alert">
            Supabase is not configured in this Academy deployment. Add the public URL and anon key, then apply the Academy SQL files.
          </p>
        )}
        <form className="form-panel" onSubmit={(event) => { void sendSignInLink(event) }}>
          <label className="field-label">Email address
            <input type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <button className="button button-primary" type="submit" disabled={busy || !hasSupabaseConfig}>
            {busy ? 'Sending link…' : sent ? 'Send another sign-in link' : 'Email me a sign-in link'}
          </button>
          {message && <p className="form-message" role="status">{message}</p>}
        </form>
        <p className="auth-footnote">Reading the free courses does not require an account. Sign in to save course progress or request mentorship.</p>
        <Link className="under-link" href="/courses">Explore courses without signing in ↗</Link>
      </section>
    </Layout>
  )
}
