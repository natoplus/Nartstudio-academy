import Head from 'next/head'
import Link from 'next/link'
import { Layout } from '../../components/Layout'
import { guides } from '../../lib/content'

export default function GuidesPage() {
  return <Layout><Head><title>Free Creator Guides — Pylothouse Academy</title><meta name="description" content="Practical guides to story craft, page composition, visual language and creative practice." /></Head>
    <section className="page-intro"><p className="eyebrow">Field notes / 01—05</p><h1>Free guides for<br /><em>the work in progress.</em></h1><p>Short, practical reads for the decisions that make a story clearer and a creative process easier to return to.</p></section>
    <section className="library-list" aria-label="Creator guides">{guides.map((guide, i) => <Link key={guide.slug} href={`/guides/${guide.slug}`} className="library-row"><span className="guide-number">0{i + 1}</span><div><span className="tag">{guide.category} · {guide.readTime} read</span><h2>{guide.title}</h2><p>{guide.summary}</p></div><span className="row-arrow" aria-hidden="true">↗</span></Link>)}</section>
    <section className="callout"><div><p className="eyebrow">Want to put the ideas to work?</p><h2>Start with a chapter plan.</h2><p>Keep a rough outline on your own device with the free worksheet.</p></div><Link className="button button-primary" href="/worksheet">Open worksheet ↗</Link></section>
  </Layout>
}
