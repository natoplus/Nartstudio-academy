import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { AcademyPlan } from '../lib/courses'
import { hasSupabaseConfig, supabase } from '../lib/supabase'
import { PremiumInterestButton } from './PremiumInterestButton'

function formatPrice(plan: AcademyPlan) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: plan.currency,
    maximumFractionDigits: 0,
  }).format(plan.price_cents / 100)
}

export function PricingPlans() {
  const [plans, setPlans] = useState<AcademyPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) {
      setError('Add the Academy Supabase keys and run the schema and seed SQL to load plan details.')
      setLoading(false)
      return
    }

    let active = true
    void (async () => {
      try {
        const { data, error: queryError } = await supabase
          .from('academy_plans')
          .select('*')
          .eq('is_active', true)
          .order('sort_order')
        if (!active) return
        if (queryError) {
          console.error('Could not load Academy plan details:', queryError)
          setError('Plan details could not be loaded. Confirm that the Academy schema and seed have been applied.')
        } else {
          setPlans((data ?? []) as AcademyPlan[])
        }
        setLoading(false)
      } catch (queryError) {
        if (!active) return
        console.error('Could not load Academy plan details:', queryError)
        setError('Plan details could not be loaded. Confirm that the Academy schema and seed have been applied.')
        setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="section plans-section" aria-labelledby="plans-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">START FREE · GO FURTHER WHEN READY</p>
          <h2 id="plans-heading">A clear, creator-friendly way to learn.</h2>
        </div>
        <p>Free mini-courses stay useful on their own. Premium is for creators who want the deeper, project-based course library.</p>
      </div>
      {loading && <p className="data-message" role="status">Loading plan details…</p>}
      {!loading && error && <p className="data-message data-error" role="alert">{error}</p>}
      {!loading && !error && (
        <div className="plan-grid">
          {plans.map((plan) => (
            <article className={`plan-card${plan.plan_key === 'premium_monthly' ? ' plan-card-featured' : ''}`} key={plan.plan_key}>
              <p className="eyebrow">{plan.plan_key === 'free' ? 'OPEN ACCESS' : plan.billing_interval === 'year' ? 'ANNUAL' : 'MONTH TO MONTH'}</p>
              <h3>{plan.name.replace(' monthly', '').replace(' annual', '')}</h3>
              <p className="plan-price">
                {plan.price_cents === 0 ? 'Free' : (
                  <>
                    <strong>{formatPrice(plan)}</strong>
                    <span> / {plan.billing_interval === 'year' ? 'year' : 'month'}</span>
                  </>
                )}
              </p>
              <p className="plan-description">{plan.description}</p>
              <ul>
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              {plan.plan_key === 'free'
                ? <Link className="button button-secondary plan-action" href="/courses">Explore free courses</Link>
                : <PremiumInterestButton planKey={plan.plan_key} />}
              {plan.plan_key !== 'free' && <p className="plan-disclaimer">Indicative launch pricing. No payment is taken; checkout is not live yet.</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
