import { useState, type FormEvent } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '../components/Layout'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import { useSupabaseUser } from '../lib/useSupabaseUser'

const topics = [
  ['portfolio-feedback', 'Portfolio feedback'],
  ['story-development', 'Story development'],
  ['visual-art', 'Visual art and illustration'],
  ['creative-practice', 'Creative practice'],
  ['creative-career', 'Creative career direction'],
  ['other', 'Something else'],
]

export default function MentorshipPage() {
  const { user, loading, error: authError } = useSupabaseUser()
  const [name, setName] = useState('')
  const [topic, setTopic] = useState(topics[0][0])
  const [goals, setGoals] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [availability, setAvailability] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || !user?.email || !consent) return
    setBusy(true)
    setMessage('')
    try {
      const { error } = await supabase.from('academy_mentorship_requests').insert({
        user_id: user.id,
        name: name.trim(),
        contact_email: user.email,
        topic,
        goals: goals.trim(),
        portfolio_url: portfolioUrl.trim() || null,
        availability: availability.trim(),
        consent_given: consent,
      })
      if (error) {
        console.error('Could not save the Academy mentorship request:', error)
        setMessage('Your request could not be saved. Check the form and try again.')
        return
      }
      setSubmitted(true)
      setMessage('Your request has been received. The team will review it; this form does not book an appointment.')
    } catch (error) {
      console.error('Could not save the Academy mentorship request:', error)
      setMessage('Your request could not be saved. Check the form and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Mentorship request — Nartstudio Academy</title>
        <meta name="description" content="Tell the Academy team what kind of creative guidance would help you move forward." />
      </Head>
      <section className="mentorship-page">
        <div className="mentorship-intro">
          <p className="eyebrow">A HUMAN NEXT STEP</p>
          <h1>Make room for<br /><em>better questions.</em></h1>
          <p>Request a conversation about your work, portfolio or creative direction. A real person reviews each request; availability and any fees are confirmed before anything is booked.</p>
          <div className="mentorship-promise">
            <b>What happens next</b>
            <ol>
              <li>Share your goals and a little context.</li>
              <li>The team reviews the request and follows up by email.</li>
              <li>You decide whether the proposed next step works for you.</li>
            </ol>
          </div>
        </div>
        <div className="mentorship-form-wrap">
          <h2>Request mentorship</h2>
          {!hasSupabaseConfig && <p className="data-message data-error" role="alert">Supabase is not configured. Add the Academy environment keys and apply the SQL setup files.</p>}
          {authError && <p className="data-message data-error" role="alert">{authError}</p>}
          {loading && <p className="data-message" role="status">Checking your sign-in…</p>}
          {!loading && !user && hasSupabaseConfig && (
            <div className="form-panel">
              <p>Sign in with a free account before sending a request. This lets the team follow up securely.</p>
              <Link className="button button-primary" href="/sign-in">Sign in to continue</Link>
            </div>
          )}
          {user && !user.email && <p className="data-message data-error" role="alert">Your account has no email address for a follow-up. Update your Supabase Auth account before submitting.</p>}
          {user?.email && (
            <form className="form-panel mentorship-form" onSubmit={(event) => { void submitRequest(event) }}>
              <label className="field-label">Your name
                <input required minLength={2} maxLength={100} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label className="field-label">Contact email
                <input type="email" value={user.email} readOnly aria-describedby="mentorship-email-note" />
                <small id="mentorship-email-note">We use the email on your signed-in account.</small>
              </label>
              <label className="field-label">What would you like guidance with?
                <select required value={topic} onChange={(event) => setTopic(event.target.value)}>
                  {topics.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                </select>
              </label>
              <label className="field-label">What are you working toward?
                <textarea required minLength={20} maxLength={2000} rows={5} value={goals} onChange={(event) => setGoals(event.target.value)} placeholder="Tell us what you are making, where you feel stuck and what a helpful conversation would achieve." />
              </label>
              <label className="field-label">Portfolio or project link <span>(optional)</span>
                <input type="url" maxLength={2048} value={portfolioUrl} onChange={(event) => setPortfolioUrl(event.target.value)} placeholder="https://" />
              </label>
              <label className="field-label">Availability or time zone <span>(optional)</span>
                <input maxLength={500} value={availability} onChange={(event) => setAvailability(event.target.value)} placeholder="For example: UTC+1, weekday evenings" />
              </label>
              <label className="consent-check">
                <input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} />
                <span>I agree that Nartstudio may use these details to review and respond to this mentorship request.</span>
              </label>
              <button className="button button-primary" type="submit" disabled={busy || submitted || !hasSupabaseConfig}>
                {busy ? 'Sending request…' : submitted ? 'Request received' : 'Send mentorship request'}
              </button>
              {message && <p className="form-message" role="status">{message}</p>}
              <p className="form-footnote">Submitting is free and does not guarantee availability, create an appointment or start a paid service.</p>
            </form>
          )}
        </div>
      </section>
    </Layout>
  )
}
