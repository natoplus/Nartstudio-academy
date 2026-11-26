import { useState, type FormEvent } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '../components/Layout'
import { hasSupabaseConfig, supabase } from '../lib/supabase'

export default function SignUpPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [confirmationSent, setConfirmationSent] = useState(false)

  async function signUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) {
      setMessage('Add the Academy Supabase URL and anon key before enabling sign-up.')
      return
    }
    setBusy(true)
    setMessage('')
    setConfirmationSent(false)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { username: username.trim() },
          emailRedirectTo: `${window.location.origin}/sign-in?confirmed=1`,
        },
      })
      if (error) {
        console.error('Could not create an Academy account:', error)
        setMessage('Your account could not be created. Check your details and try again.')
        return
      }
      if (!data.user) {
        setMessage('Your account could not be created. Please try again.')
        return
      }
      if (data.session) {
        const { error: signOutError } = await supabase.auth.signOut()
        if (signOutError) {
          console.error('Could not end the unconfirmed Academy session:', signOutError)
          setMessage('Your account was created, but the sign-in session could not be ended. Please sign out and enable email confirmation in Supabase Auth.')
          return
        }
        setMessage('Email confirmation is not enabled for this Academy project. Enable it in Supabase Auth so new accounts can verify their email before signing in.')
        return
      }
      setConfirmationSent(true)
      setMessage(`We sent a confirmation link to ${email.trim()}. Confirm your email, then sign in.`)
    } catch (error) {
      console.error('Could not create an Academy account:', error)
      setMessage('Your account could not be created. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Layout>
      <Head><title>Create an account — Nartstudio Academy</title><meta name="description" content="Create a free Academy account with your email, password and username." /></Head>
      <section className="auth-page">
        <p className="eyebrow">START YOUR CREATIVE PRACTICE</p>
        <h1>Make room<br /><em>to grow.</em></h1>
        <p>Create a free account to save your course progress and request mentorship. You will confirm your email before signing in.</p>
        {!hasSupabaseConfig && (
          <p className="data-message data-error" role="alert">
            Supabase is not configured in this Academy deployment. Add the public URL and anon key, then apply the Academy SQL files.
          </p>
        )}
        <form className="form-panel" onSubmit={(event) => { void signUp(event) }}>
          <label className="field-label">Username
            <input type="text" autoComplete="username" required minLength={3} maxLength={32} value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>
          <label className="field-label">Email address
            <input type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="field-label">Password
            <input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} />
            <small>Use at least 8 characters.</small>
          </label>
          <button className="button button-primary" type="submit" disabled={busy || !hasSupabaseConfig}>
            {busy ? 'Creating account…' : 'Create account'}
          </button>
          {message && <p className="form-message" role={confirmationSent ? 'status' : 'alert'}>{message}</p>}
        </form>
        <p className="auth-footnote">Already have an account? <Link href="/sign-in">Sign in</Link>.</p>
        {confirmationSent && <Link className="button button-secondary auth-confirmation-link" href="/sign-in">Go to sign in ↗</Link>}
      </section>
    </Layout>
  )
}
