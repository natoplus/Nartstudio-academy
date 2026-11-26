import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { AcademyCourse } from '../lib/courses'
import { supabase } from '../lib/supabase'
import { CourseArtwork } from './CourseArtwork'

type CourseFilter = 'all' | 'mini' | 'full' | 'free' | 'premium'

const filters: { id: CourseFilter; label: string }[] = [
  { id: 'all', label: 'All courses' },
  { id: 'mini', label: 'Mini-courses' },
  { id: 'full', label: 'Full courses' },
  { id: 'free', label: 'Free' },
  { id: 'premium', label: 'Premium' },
]

export function CourseCatalog({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const [courses, setCourses] = useState<AcademyCourse[]>([])
  const [filter, setFilter] = useState<CourseFilter>('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (router.isReady) {
      setQuery(typeof router.query.q === 'string' ? router.query.q : '')
    }
  }, [router.isReady, router.query.q])

  useEffect(() => {
    if (!supabase) {
      setError('Add the Academy Supabase URL and anon key, then apply the schema and course seed SQL.')
      setLoading(false)
      return
    }

    let active = true
    void (async () => {
      try {
        const { data, error: queryError } = await supabase
          .from('academy_courses')
          .select('*')
          .eq('is_published', true)
          .order('sort_order')
        if (!active) return
        if (queryError) {
          console.error('Could not load Academy courses:', queryError)
          setError('Courses could not be loaded. Confirm the Academy schema and seed have been applied.')
        } else {
          setCourses((data ?? []) as AcademyCourse[])
        }
        setLoading(false)
      } catch (queryError) {
        if (!active) return
        console.error('Could not load Academy courses:', queryError)
        setError('Courses could not be loaded. Confirm the Academy schema and seed have been applied.')
        setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [])

  const visibleCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const matchingCourses = courses.filter((course) => {
      const matchesFilter = filter === 'all'
        || (filter === 'mini' && course.course_type === 'mini')
        || (filter === 'full' && course.course_type === 'full')
        || (filter === 'free' && course.access_tier === 'free')
        || (filter === 'premium' && course.access_tier === 'premium')
      const searchable = `${course.title} ${course.summary} ${course.category}`.toLowerCase()
      return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
    return compact ? matchingCourses.slice(0, 6) : matchingCourses
  }, [compact, courses, filter, query])

  return (
    <section className={`section course-catalog${compact ? ' course-catalog-compact' : ''}`} aria-labelledby="course-catalog-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">LEARN THROUGH MAKING</p>
          <h2 id="course-catalog-heading">{compact ? 'Start with a useful next step.' : 'A practical course for your next idea.'}</h2>
        </div>
        {compact && <Link href="/courses">Browse all 20 courses <span aria-hidden="true">↗</span></Link>}
      </div>
      {!compact && (
        <>
          <label className="course-search">
            <span>Search courses</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try illustration, storytelling or portfolio"
            />
          </label>
          <div className="course-filters" role="group" aria-label="Filter courses">
            {filters.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
      {loading && <p className="data-message" role="status">Loading the course library…</p>}
      {!loading && error && (
        <p className="data-message data-error" role="alert">
          {error} See the Academy setup notes in the repository README.
        </p>
      )}
      {!loading && !error && (
        <>
          <p className="resource-count" role="status" aria-live="polite">
            {visibleCourses.length} {visibleCourses.length === 1 ? 'course' : 'courses'} shown
          </p>
          {visibleCourses.length ? (
            <div className="course-grid">
              {visibleCourses.map((course) => (
                <Link className="course-card" href={`/courses/${course.slug}`} key={course.slug}>
                  <CourseArtwork course={course} />
                  <div className="course-card-content">
                    <div className="course-card-meta">
                      <span>{course.course_type === 'mini' ? 'Mini-course' : 'Full course'}</span>
                      <span>{course.access_tier === 'free' ? 'Free' : 'Premium'}</span>
                    </div>
                    <p className="course-category">{course.category} · {course.duration_minutes} min</p>
                    <h3>{course.title}</h3>
                    <p className="course-summary">{course.summary}</p>
                    <span className="course-card-link">
                      {course.access_tier === 'premium' ? 'Preview course' : 'Start learning'}
                      <b aria-hidden="true">↗</b>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="resource-empty">
              <p>No courses match those filters yet.</p>
              <button type="button" onClick={() => { setQuery(''); setFilter('all') }}>Clear filters</button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
