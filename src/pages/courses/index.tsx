import Head from 'next/head'
import { Layout } from '../../components/Layout'
import { CourseCatalog } from '../../components/CourseCatalog'

export default function CoursesPage() {
  return (
    <Layout>
      <Head>
        <title>Creative courses — Nartstudio Academy</title>
        <meta name="description" content="Practical mini and full courses for illustrators, storytellers, designers and independent creatives." />
      </Head>
      <section className="page-intro">
        <p className="eyebrow">FOR ASPIRING ARTISTS AND WORKING CREATIVES</p>
        <h1>Make the next idea<br /><em>more possible.</em></h1>
        <p>Explore practical lessons in illustration, storytelling, design, creative practice and the business of making. Start with a free mini-course or preview a full course.</p>
      </section>
      <CourseCatalog />
    </Layout>
  )
}
