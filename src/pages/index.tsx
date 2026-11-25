import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '../components/Layout'
import { ResourceBrowser } from '../components/ResourceBrowser'
import { tracks } from '../lib/content'

export default function AcademyHome() {
  return (
    <Layout>
      <Head>
        <title>Pylothouse Creator Academy | Learn by making</title>
        <meta name="description" content="Practical, self-guided resources for comic creators: story planning, visual storytelling, character design and worldbuilding." />
      </Head>
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span /> PYLOTHOUSE CREATOR ACADEMY</p>
              <h1>Learn the craft<br /><em>by making stories.</em></h1>
              <p className="lede">Build your storytelling practice with focused guides, flexible learning paths, and simple tools you can use on your next project.</p>
              <div className="hero-actions"><Link className="button-primary" href="#learning-resources">Explore learning resources <span aria-hidden="true">↓</span></Link><Link className="button-secondary" href="/tracks">View learning paths</Link></div>
              <div className="hero-meta"><span>LEARN AT YOUR PACE</span><span>PRACTICAL METHODS</span><span>FREE TO EXPLORE</span></div>
            </div>
            <aside className="hero-index"><img className="hero-art-image" src="/academy-art.svg" alt="" /><span>YOUR NEXT PROJECT STARTS HERE</span><strong>MAKE<br /><em>STORIES.</em></strong><i>GUIDES · PATHS · TOOLS</i></aside>
          </div>
        </section>

        <ResourceBrowser />

        <section className="section tracks-section" id="tracks">
          <div className="section-heading"><div><p className="eyebrow">LEARNING PATHS</p><h2>Choose what to practice next.</h2></div><p>Each path connects practical resources you can use independently. Move through them in order or jump to the skill you need today.</p></div>
          <div className="track-list">{tracks.map(track => <Link href={`/tracks/${track.slug}`} key={track.slug}><span>{track.number}</span><div><h3>{track.title}</h3><p>{track.summary}</p></div><small>SELF-PACED MAP <b aria-hidden="true">↗</b></small></Link>)}</div>
        </section>

        <section className="tool-banner"><div><p className="eyebrow">A TOOL FOR YOUR NEXT SESSION</p><h2>Give your next chapter<br />a clear shape.</h2><p>Use the chapter planner to set a reader question, turning point and page-by-page beats. Your draft stays in this browser.</p></div><Link className="button-primary" href="/worksheet">Open the planner <span aria-hidden="true">↗</span></Link></section>
    </Layout>
  )
}
