import { useEffect } from 'react'

export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return

    const targets = document.querySelectorAll<HTMLElement>(
      'main > section:not(.hero), main .guide-card, main .track-list > a, main .track-card, main .related-guides > a, main .article-body > section, main .callout, main .planner-help'
    )
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' })

    targets.forEach((target) => {
      target.classList.add('scroll-reveal')
      observer.observe(target)
    })

    return () => observer.disconnect()
  }, [])

  return null
}
