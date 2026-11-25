import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { Layout } from '../../components/Layout'
import { guides, type Guide } from '../../lib/content'

export default function GuideDetail({ guide }: { guide: Guide }) {
  return <Layout><Head><title>{guide.title} — Pylothouse Academy</title><meta name="description" content={guide.summary} /></Head>
    <article className="article-layout"><div className="article-aside"><Link href="/guides" className="back-link">← All guides</Link><p className="eyebrow">{guide.category}</p><span className="tag">{guide.readTime} read</span></div><div className="article-body"><h1>{guide.title}</h1><p className="article-lede">{guide.intro}</p>{guide.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}<div className="article-end"><p className="eyebrow">Keep the momentum</p><p>Turn the next idea into a flexible plan. Your worksheet stays in your browser and can be exported as a text file.</p><Link className="button button-primary" href="/worksheet">Open chapter planner ↗</Link></div></div></article>
  </Layout>
}

export const getStaticPaths: GetStaticPaths = async () => ({ paths: guides.map(({ slug }) => ({ params: { slug } })), fallback: false })
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const guide = guides.find(({ slug }) => slug === params?.slug)
  return guide ? { props: { guide } } : { notFound: true }
}
