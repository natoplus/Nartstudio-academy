import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '../components/Layout'
import { HeroSection } from '../components/HeroSection'
import { ResourceBrowser } from '../components/ResourceBrowser'
import { CourseCatalog } from '../components/CourseCatalog'
import { PricingPlans } from '../components/PricingPlans'
import { tracks } from '../lib/content'

export default function AcademyHome() {
  return (
    <Layout>
      <Head>
        <title>Nartstudio Academy | Learn by making</title>
        <meta name="description" content="Practical courses for aspiring artists, illustrators, storytellers and independent creatives—whether you make comics, design, games or something new." />
      </Head>
        <HeroSection />

        <ResourceBrowser />

        <CourseCatalog compact />

        <section className="section tracks-section" id="tracks">
          <div className="section-heading"><div><p className="eyebrow">LEARNING PATHS</p><h2>Choose what to practice next.</h2></div><p>Each path connects practical resources you can use independently. Move through them in order or jump to the skill you need today.</p></div>
          <div className="track-list">{tracks.map(track => <Link href={`/tracks/${track.slug}`} key={track.slug}><img className="track-list-image" src={track.image} alt="" loading="lazy" /><span>{track.number}</span><div><h3>{track.title}</h3><p>{track.summary}</p></div><small>SELF-PACED MAP <b aria-hidden="true">↗</b></small></Link>)}</div>
        </section>

        <PricingPlans />

        <section className="tool-banner mentorship-banner"><div><p className="eyebrow">PERSONAL GUIDANCE</p><h2>Bring your next question<br />to a creative mentor.</h2><p>Share what you are working on and request a mentorship conversation. A request is reviewed by the team; it does not book an appointment or start a paid service.</p></div><Link className="button-primary" href="/mentorship">Request mentorship <span aria-hidden="true">↗</span></Link></section>

        <section className="tool-banner"><div><p className="eyebrow">A TOOL FOR YOUR NEXT SESSION</p><h2>Give your next chapter<br />a clear shape.</h2><p>Use the chapter planner to set a reader question, turning point and page-by-page beats. Your draft stays in this browser.</p></div><Link className="button-primary" href="/worksheet">Open the planner <span aria-hidden="true">↗</span></Link></section>
    </Layout>
  )
}
