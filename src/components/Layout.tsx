import Link from 'next/link'
import type { ReactNode } from 'react'
import ParallaxAtmosphere from './ParallaxAtmosphere'
import ScrollReveal from './ScrollReveal'
import { ThemeToggle } from './ThemeToggle'

export function Layout({ children }: { children: ReactNode }) {
  return <>
    <ParallaxAtmosphere />
    <ScrollReveal />
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Nartstudio Academy home"><span className="brand-mark"><img src="/brand-mark.svg" alt="" /></span><span>NARTSTUDIO <b>ACADEMY</b></span></Link>
      <form className="site-search" action="/courses" method="get" role="search">
        <label className="visually-hidden" htmlFor="academy-search">Search Academy courses</label>
        <input id="academy-search" name="q" type="search" placeholder="What do you want to learn?" />
        <button type="submit" aria-label="Search learning resources">Search</button>
      </form>
      <nav aria-label="Main navigation"><Link href="/courses">Courses</Link><Link href="/tracks">Learning paths</Link><Link href="/mentorship">Mentorship</Link><Link href="/worksheet">Planner</Link></nav>
      <div className="header-actions"><Link className="account-link" href="/account">My account</Link><ThemeToggle /><a className="header-back" href="https://pylothouse.vercel.app">Pylothouse <span aria-hidden="true">↗</span></a></div>
    </header>
    <main id="main-content">{children}</main>
    <footer className="site-footer">
      <Link href="/" className="footer-brand">NARTSTUDIO <b>ACADEMY</b></Link>
      <span>Independent practice for artists, storytellers and creatives.</span>
      <nav aria-label="Footer navigation"><Link href="/courses">Courses</Link><Link href="/plans">Plans</Link><Link href="/mentorship">Mentorship</Link><Link href="/account">Account</Link></nav>
      <span>© 2026 NARTSTUDIO</span>
    </footer>
  </>
}
