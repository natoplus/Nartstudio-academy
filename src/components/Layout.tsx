import Link from 'next/link'
import type { ReactNode } from 'react'
import ParallaxAtmosphere from './ParallaxAtmosphere'

export function Layout({ children }: { children: ReactNode }) {
  return <>
    <ParallaxAtmosphere />
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Pylothouse Creator Academy home"><span className="brand-mark"><img src="/brand-mark.svg" alt="" /></span><span>PYLOTHOUSE <b>ACADEMY</b></span></Link>
      <nav aria-label="Main navigation"><Link href="/guides">Guides</Link><Link href="/tracks">Learning tracks</Link><Link href="/worksheet">Chapter planner</Link></nav>
      <a className="header-back" href="https://pylothouse.vercel.app">Pylothouse <span aria-hidden="true">↗</span></a>
    </header>
    <main id="main-content">{children}</main>
    <footer className="site-footer"><Link href="/" className="footer-brand">PYLOTHOUSE <b>ACADEMY</b></Link><span>Independent practice for the work in progress.</span><span>© 2026 NARTSTUDIO</span></footer>
  </>
}
