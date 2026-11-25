import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { guides } from '../lib/content'

const categories = ['All topics', ...Array.from(new Set(guides.map((guide) => guide.category)))]

type ResourceBrowserProps = {
  heading?: string
  showAllGuidesLink?: boolean
}

export function ResourceBrowser({ heading = 'Find your next useful lesson.', showAllGuidesLink = true }: ResourceBrowserProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All topics')
  useEffect(() => {
    if (router.isReady) setQuery(typeof router.query.q === 'string' ? router.query.q : '')
  }, [router.isReady, router.query.q])
  const normalizedQuery = query.trim().toLowerCase()
  const filteredGuides = guides.filter((guide) => {
    const matchesCategory = selectedCategory === 'All topics' || guide.category === selectedCategory
    const searchableText = `${guide.title} ${guide.summary} ${guide.category}`.toLowerCase()
    return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery))
  })

  return (
    <section className="section guide-section resource-library" id="learning-resources" aria-labelledby="resource-heading">
      <div className="section-heading">
        <div><p className="eyebrow">THE LEARNING LIBRARY</p><h2 id="resource-heading">{heading}</h2></div>
        {showAllGuidesLink && <Link href="/guides">View all guides <span aria-hidden="true">↗</span></Link>}
      </div>
      <label className="resource-search">
        <span>Search learning resources</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try story planning or page composition"
        />
      </label>
      <div className="topic-filters" role="group" aria-label="Filter resources by topic">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            aria-pressed={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <p className="resource-count" role="status" aria-live="polite">
        {filteredGuides.length} {filteredGuides.length === 1 ? 'resource' : 'resources'}
      </p>
      {filteredGuides.length ? (
        <div className="guide-grid">
          {filteredGuides.map((guide) => (
            <Link className="guide-card" href={`/guides/${guide.slug}`} key={guide.slug}>
              <span className="resource-card-meta">{guide.category} <span aria-hidden="true">·</span> {guide.readTime} read</span>
              <h3>{guide.title}</h3>
              <p>{guide.summary}</p>
              <span className="resource-card-link">Open guide <b aria-hidden="true">↗</b></span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="resource-empty">
          <p>No guides match that search yet.</p>
          <button type="button" onClick={() => { setQuery(''); setSelectedCategory('All topics') }}>Clear filters</button>
        </div>
      )}
    </section>
  )
}
