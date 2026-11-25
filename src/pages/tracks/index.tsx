import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '../../components/Layout'
import { tracks } from '../../lib/content'

export default function TracksPage() {
  return <Layout><Head><title>Learning Tracks — Pylothouse Academy</title><meta name="description" content="Self-paced maps for developing story, page and publishing skills." /></Head>
    <section className="page-intro"><p className="eyebrow">Self-paced / No enrollment required</p><h1>Follow the craft.<br /><em>Make it your own.</em></h1><p>These are suggested learning paths through the free library, not live classes or paid programs. Move in any order, skip what you know, and use the work you’re already making as practice.</p></section>
    <section className="track-list">{tracks.map((track) => <Link href={`/tracks/${track.slug}`} className="track-card" key={track.slug}><span className="guide-number">{track.number}</span><div><span className="tag">SELF-PACED MAP</span><h2>{track.title}</h2><p>{track.summary}</p><span className="card-foot">VIEW THE ROUTE <b>→</b></span></div><span className="row-arrow" aria-hidden="true">↗</span></Link>)}</section>
    <p className="availability-note">Courses, mentoring and portfolio reviews are not currently offered for enrollment.</p>
  </Layout>
}
