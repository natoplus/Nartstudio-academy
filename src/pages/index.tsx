import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '../components/Layout'
import { guides, tracks } from '../lib/content'

export default function AcademyHome() {
  const featured = guides[0]
  return (
    <Layout>
      <Head>
        <title>Creator Academy | Pylothouse</title>
        <meta name="description" content="Practical, self-guided resources for comic creators: story planning, visual storytelling, character design and worldbuilding." />
      </Head>
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span /> PYLothouse / CREATOR DEVELOPMENT</p>
              <h1>Make the work<br /><em>more intentional.</em></h1>
              <p className="lede">A growing library of practical methods for planning, drawing and publishing sequential stories. Start with one craft question and leave with a next step you can use.</p>
              <div className="hero-actions"><Link className="button-primary" href="/guides">Explore the guides <span aria-hidden="true">↗</span></Link><Link className="button-secondary" href="/worksheet">Open chapter planner</Link></div>
              <div className="hero-meta"><span>SELF-GUIDED RESOURCES</span><span>BUILT FOR PRACTICE</span><span>NO ACCOUNT REQUIRED</span></div>
            </div>
            <aside className="hero-index"><img className="hero-art-image" src="/academy-art.svg" alt="" /><span>FIELD NOTES / 001</span><strong>STORY<br />IS A SERIES<br /><em>OF CHOICES.</em></strong><i>01 — 04 / LEARNING LIBRARY</i></aside>
          </div>
        </section>

        <section className="section guide-section">
          <div className="section-heading"><div><p className="eyebrow">START WITH A QUESTION</p><h2>Useful tools for the next page.</h2></div><Link href="/guides">All learning guides <span aria-hidden="true">↗</span></Link></div>
          <Link className="featured-guide" href={`/guides/${featured.slug}`}>
            <div><span className="number-tag">01 / {featured.category}</span><h3>{featured.title}</h3><p>{featured.summary}</p><span className="text-link">Read the guide <b aria-hidden="true">↗</b></span></div>
            <span className="feature-mark" aria-hidden="true">A<br />→<br />B</span>
          </Link>
          <div className="guide-grid">
            {guides.slice(1).map((guide, index) => <Link className="guide-card" href={`/guides/${guide.slug}`} key={guide.slug}><span>{String(index + 2).padStart(2, '0')} / {guide.category}</span><h3>{guide.title}</h3><p>{guide.summary}</p><small>{guide.readTime} READ <b aria-hidden="true">↗</b></small></Link>)}
          </div>
        </section>

        <section className="section tracks-section" id="tracks">
          <div className="section-heading"><div><p className="eyebrow">LEARNING TRACKS</p><h2>Follow the craft, at your pace.</h2></div><p>These are self-guided topic paths, not scheduled or accredited courses. Each one connects practical resources you can use independently.</p></div>
          <div className="track-list">{tracks.map(track => <Link href={`/tracks/${track.slug}`} key={track.slug}><span>{track.number}</span><div><h3>{track.title}</h3><p>{track.summary}</p></div><small>SELF-PACED MAP <b aria-hidden="true">↗</b></small></Link>)}</div>
        </section>

        <section className="tool-banner"><div><p className="eyebrow">FREE WORKSHEET / LOCAL SAVE</p><h2>Give your next chapter<br />a clear shape.</h2>        <p>Use the chapter planner to set a reader question, turning point and page-by-page beats. Your draft stays in this browser.</p></div><Link className="button-primary" href="/worksheet">Open the planner <span aria-hidden="true">↗</span></Link></section>
    </Layout>
  )
}
