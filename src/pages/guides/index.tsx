import Head from 'next/head'
import { Layout } from '../../components/Layout'
import { ResourceBrowser } from '../../components/ResourceBrowser'

export default function GuidesPage() {
  return <Layout><Head><title>Free Creator Guides — Pylothouse Academy</title><meta name="description" content="Practical guides to story craft, page composition, visual language and creative practice." /></Head>
    <ResourceBrowser heading="Practical guides for your next project." showAllGuidesLink={false} />
  </Layout>
}
