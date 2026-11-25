import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { Layout } from '../../components/Layout'
import { guides, tracks } from '../../lib/content'

type Track = (typeof tracks)[number]
export default function TrackDetail({ track }: { track: Track }) {
  const relatedGuides = track.guideSlugs.map((slug) => guides.find((guide) => guide.slug === slug)).filter((guide): guide is (typeof guides)[number] => Boolean(guide))
  return <Layout><Head><title>{track.title} — Pylothouse Academy</title><meta name="description" content={track.summary} /></Head>
    <section className="page-intro track-page-intro"><div><Link href="/tracks" className="back-link">← All learning tracks</Link><p className="eyebrow">Learning map / {track.number}</p><h1>{track.title.split(' & ')[0]}<br /><em>{track.title.includes(' & ') ? `& ${track.title.split(' & ').slice(1).join(' & ')}` : 'learning map'}</em></h1><p>{track.summary}</p><span className="availability-pill">Free, self-paced resources · Not a live course</span></div><img src={track.image} alt="" /></section>
    <section className="track-detail-grid"><div><p className="eyebrow">A route to explore</p><h2>What you’ll practise</h2><ol className="skill-list">{track.skills.map((skill, i) => <li key={skill}><span>0{i + 1}</span>{skill}</li>)}</ol></div><div><p className="eyebrow">Read and try</p><h2>Suggested guides</h2><div className="related-guides">{relatedGuides.map((guide) => <Link href={`/guides/${guide.slug}`} key={guide.slug}><img src={guide.image} alt="" loading="lazy" /><span className="tag">{guide.readTime} read</span><b>{guide.title}</b><span>Read guide ↗</span></Link>)}</div></div></section>
    <div className="callout"><div><p className="eyebrow">Make this route yours</p><p>Choose one idea and test it on a page or scene you’re already working on.</p></div><Link className="button button-primary" href="/worksheet">Plan a chapter ↗</Link></div>
  </Layout>
}
export const getStaticPaths: GetStaticPaths = async () => ({ paths: tracks.map(({ slug }) => ({ params: { slug } })), fallback: false })
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const track = tracks.find(({ slug }) => slug === params?.slug)
  return track ? { props: { track } } : { notFound: true }
}
