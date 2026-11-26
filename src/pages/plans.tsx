import Head from 'next/head'
import { Layout } from '../components/Layout'
import { PricingPlans } from '../components/PricingPlans'

export default function PlansPage() {
  return (
    <Layout>
      <Head>
        <title>Plans — Nartstudio Academy</title>
        <meta name="description" content="Start with free creative mini-courses or request early access to the full Academy course library." />
      </Head>
      <section className="page-intro">
        <p className="eyebrow">NO PRESSURE TO UPGRADE</p>
        <h1>Start where you are.<br /><em>Keep growing.</em></h1>
        <p>Free mini-courses are complete, practical lessons. Premium is a proposed, lower-cost way to unlock deeper project courses. We are collecting early-access interest before turning on checkout.</p>
      </section>
      <PricingPlans />
      <section className="billing-note">
        <p className="eyebrow">TRANSPARENT BY DESIGN</p>
        <p>Prices shown are the recommended launch pricing in USD, not an active offer. No payment is collected and no subscription starts from this page. Premium access will only be enabled after billing and account controls are configured.</p>
      </section>
    </Layout>
  )
}
