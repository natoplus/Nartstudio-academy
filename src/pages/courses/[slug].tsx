import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CourseArtwork } from '../../components/CourseArtwork'
import { Layout } from '../../components/Layout'
import { PremiumInterestButton } from '../../components/PremiumInterestButton'
import type { AcademyCourse, AcademyLesson } from '../../lib/courses'
import { hasSupabaseConfig, supabase } from '../../lib/supabase'
import { useSupabaseUser } from '../../lib/useSupabaseUser'

type Membership = { plan_key: string; status: string; current_period_end: string | null }

function hasActivePremiumMembership(membership: Membership | null) {
  if (!membership || !['premium_monthly', 'premium_annual'].includes(membership.plan_key)) return false
  if (!['active', 'trialing'].includes(membership.status)) return false
  return !membership.current_period_end || new Date(membership.current_period_end).getTime() > Date.now()
}

export default function CoursePage() {
  const router = useRouter()
  const slug = typeof router.query.slug === 'string' ? router.query.slug : ''
  const { user, loading: userLoading, error: authError } = useSupabaseUser()
  const [course, setCourse] = useState<AcademyCourse | null>(null)
  const [lessons, setLessons] = useState<AcademyLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [accessWarning, setAccessWarning] = useState('')
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [progressBusy, setProgressBusy] = useState(false)
  const [progressMessage, setProgressMessage] = useState('')

  useEffect(() => {
    if (!router.isReady || userLoading || !slug) return
    if (!supabase) {
      setError('Add the Academy Supabase URL and anon key, then apply the schema and course seed SQL.')
      setLoading(false)
      return
    }

    let active = true
    async function loadCourse() {
      setLoading(true)
      setError('')
      setAccessWarning('')
      setCourse(null)
      setLessons([])
      setHasPremiumAccess(false)
      setCompletedLessons([])

      const { data: courseData, error: courseError } = await supabase!
        .from('academy_courses')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle()

      if (!active) return
      if (courseError) {
        console.error('Could not load Academy course:', courseError)
        setError('This course could not be loaded. Check the Academy schema and your connection.')
        setLoading(false)
        return
      }
      if (!courseData) {
        setError('This course is not available. It may not have been published yet.')
        setLoading(false)
        return
      }

      const loadedCourse = courseData as AcademyCourse
      setCourse(loadedCourse)
      let premiumAccess = false

      if (loadedCourse.access_tier === 'premium' && user) {
        const { data: membership, error: membershipError } = await supabase!
          .from('academy_memberships')
          .select('plan_key, status, current_period_end')
          .eq('user_id', user.id)
          .maybeSingle()
        if (!active) return
        if (membershipError) {
          console.error('Could not check Academy membership:', membershipError)
          setAccessWarning('Your membership could not be checked. Only preview lessons are shown until it can be verified.')
        } else {
          premiumAccess = hasActivePremiumMembership(membership as Membership | null)
        }
      }

      setHasPremiumAccess(premiumAccess)
      const { data: lessonData, error: lessonError } = await supabase!
        .from('academy_course_lessons')
        .select('id, course_slug, lesson_number, title, body, exercise, is_preview')
        .eq('course_slug', slug)
        .order('lesson_number')

      if (!active) return
      if (lessonError) {
        console.error('Could not load Academy course lessons:', lessonError)
        setError('The lessons could not be loaded. Please try again later.')
      } else {
        setLessons((lessonData ?? []) as AcademyLesson[])
      }
      setLoading(false)
    }

    void loadCourse().catch((loadError: unknown) => {
      if (!active) return
      console.error('Could not load Academy course:', loadError)
      setError('The course could not be loaded. Please try again later.')
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [router.isReady, slug, user, userLoading])

  useEffect(() => {
    if (!supabase || !user || !course || loading || error) return
    if (course.access_tier === 'premium' && !hasPremiumAccess) return

    let active = true
    void (async () => {
      try {
        const { data, error: progressError } = await supabase
          .from('academy_course_progress')
          .select('completed_lesson_ids')
          .eq('user_id', user.id)
          .eq('course_slug', course.slug)
          .maybeSingle()
        if (!active) return
        if (progressError) {
          console.error('Could not load course progress:', progressError)
          setProgressMessage('Your saved progress could not be loaded.')
        } else {
          setCompletedLessons(data?.completed_lesson_ids ?? [])
        }
      } catch (progressError) {
        if (!active) return
        console.error('Could not load course progress:', progressError)
        setProgressMessage('Your saved progress could not be loaded.')
      }
    })()

    return () => {
      active = false
    }
  }, [course, error, hasPremiumAccess, loading, user])

  async function toggleLesson(lesson: AcademyLesson) {
    if (!supabase || !user || !course || progressBusy) return
    const nextCompleted = completedLessons.includes(lesson.id)
      ? completedLessons.filter((id) => id !== lesson.id)
      : [...completedLessons, lesson.id]
    setProgressBusy(true)
    setProgressMessage('')
    try {
      const { error: saveError } = await supabase
        .from('academy_course_progress')
        .upsert({
          user_id: user.id,
          course_slug: course.slug,
          completed_lesson_ids: nextCompleted,
          last_seen_at: new Date().toISOString(),
        }, { onConflict: 'user_id,course_slug' })
      if (saveError) {
        console.error('Could not save course progress:', saveError)
        setProgressMessage('Progress could not be saved. Please try again.')
        return
      }
      setCompletedLessons(nextCompleted)
      setProgressMessage('Progress saved to your account.')
    } catch (saveError) {
      console.error('Could not save course progress:', saveError)
      setProgressMessage('Progress could not be saved. Please try again.')
    } finally {
      setProgressBusy(false)
    }
  }

  const isLocked = Boolean(course && course.access_tier === 'premium' && !hasPremiumAccess)
  const completedCount = completedLessons.length
  const pageTitle = course ? `${course.title} — Nartstudio Academy` : 'Course — Nartstudio Academy'

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        {course && <meta name="description" content={course.summary} />}
      </Head>
      {loading || userLoading ? (
        <p className="data-message course-loading" role="status">Loading course…</p>
      ) : error ? (
        <section className="page-intro"><p className="data-message data-error" role="alert">{error}</p><Link className="back-link" href="/courses">← All courses</Link></section>
      ) : course ? (
        <>
          <section className="course-hero">
            <div className="course-hero-copy">
              <Link className="back-link" href="/courses">← All courses</Link>
              <p className="eyebrow">{course.category} / {course.course_type === 'mini' ? 'Mini-course' : 'Full course'}</p>
              <h1>{course.title}</h1>
              <p className="course-hero-summary">{course.summary}</p>
              <div className="hero-meta">
                <span>{course.level.replace('-', ' ')}</span>
                <span>{course.duration_minutes} MINUTES</span>
                <span>{course.lesson_count} LESSONS</span>
                <span>{course.access_tier === 'free' ? 'FREE' : 'PREMIUM'}</span>
              </div>
            </div>
            <CourseArtwork course={course} />
          </section>
          <section className="course-content-grid">
            <div className="course-lessons">
              <div className="section-heading">
                <div><p className="eyebrow">THE COURSE</p><h2>Learn, then try it in your own work.</h2></div>
                {!isLocked && user && <span className="progress-count">{completedCount}/{lessons.length} complete</span>}
              </div>
              {authError && <p className="data-message data-error" role="alert">{authError}</p>}
              {accessWarning && <p className="data-message data-error" role="alert">{accessWarning}</p>}
              {progressMessage && <p className="form-message" role="status">{progressMessage}</p>}
              {lessons.length ? lessons.map((lesson) => (
                <article className="lesson-card" key={lesson.id}>
                  <div className="lesson-card-heading">
                    <span className="lesson-number">{String(lesson.lesson_number).padStart(2, '0')}</span>
                    <h3>{lesson.title}</h3>
                    {isLocked && lesson.is_preview && <span className="preview-label">PREVIEW</span>}
                  </div>
                  <p>{lesson.body}</p>
                  <div className="lesson-exercise"><b>Try it</b><p>{lesson.exercise}</p></div>
                  {!isLocked && user && (
                    <label className="lesson-complete">
                      <input
                        type="checkbox"
                        checked={completedLessons.includes(lesson.id)}
                        disabled={progressBusy}
                        onChange={() => { void toggleLesson(lesson) }}
                      />
                      Mark lesson complete
                    </label>
                  )}
                </article>
              )) : (
                <p className="data-message" role="status">No lessons have been added to this course yet.</p>
              )}
              {isLocked && (
                <aside className="course-paywall">
                  <p className="eyebrow">CONTINUE WITH PREMIUM</p>
                  <h2>{Math.max(0, course.lesson_count - lessons.length)} more lessons, built around a complete project.</h2>
                  <p>Preview the first lesson, then request early access for the complete course library. There is no charge while checkout is unavailable.</p>
                  <PremiumInterestButton planKey="premium_monthly" />
                  <Link className="under-link" href="/plans">Compare free and premium plans ↗</Link>
                </aside>
              )}
              {!isLocked && !user && course.access_tier === 'free' && (
                <aside className="course-progress-signin">
                  <p>Lessons are free to read. Sign in with a free account to save your progress across devices.</p>
                  <Link className="button button-secondary" href="/sign-in">Sign in to sync progress</Link>
                </aside>
              )}
              {!isLocked && user && lessons.length > 0 && completedCount === lessons.length && (
                <p className="course-complete" role="status">Course complete — take the method into a project of your own.</p>
              )}
            </div>
            <aside className="course-aside">
              <div className="course-outcomes">
                <p className="eyebrow">WHAT YOU WILL PRACTISE</p>
                <ul>{course.learning_outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
              </div>
              <div className="course-resources">
                <p className="eyebrow">FURTHER READING</p>
                {course.resources.map((resource) => (
                  <a href={resource.url} key={resource.url} target="_blank" rel="noreferrer">
                    <b>{resource.title}</b><span>{resource.publisher} ↗</span><small>{resource.note}</small>
                  </a>
                ))}
              </div>
            </aside>
          </section>
        </>
      ) : null}
    </Layout>
  )
}
