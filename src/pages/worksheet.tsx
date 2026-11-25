import Head from 'next/head'
import { Layout } from '../components/Layout'
import { ChapterPlanner } from '../components/ChapterPlanner'

export default function WorksheetPage() {
  return <Layout><Head><title>Chapter Planning Worksheet — Pylothouse Academy</title><meta name="description" content="Plan a chapter with a free local worksheet. Your notes stay in browser storage on your device." /></Head>
    <section className="page-intro worksheet-intro"><p className="eyebrow">Free tool / Your notes stay on your device</p><h1>Chapter planning<br /><em>worksheet.</em></h1><p>Take a rough idea from “something happens” to a sequence you’re ready to draw. No account, upload or deadline required.</p></section>
    <ChapterPlanner />
    <p className="privacy-note">This worksheet uses your browser’s local storage and does not send your notes to a server. Clearing browser data will remove saved notes. Export a text copy if you want a separate backup.</p>
  </Layout>
}
