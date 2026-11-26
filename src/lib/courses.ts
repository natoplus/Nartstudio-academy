export type CourseType = 'mini' | 'full'
export type CourseTier = 'free' | 'premium'

export type AcademyCourse = {
  slug: string
  title: string
  summary: string
  category: string
  level: 'beginner' | 'intermediate' | 'all-levels'
  course_type: CourseType
  access_tier: CourseTier
  duration_minutes: number
  lesson_count: number
  artwork_seed: number
  learning_outcomes: string[]
  resources: { title: string; publisher: string; url: string; note: string }[]
  sort_order: number
  is_published: boolean
}

export type AcademyLesson = {
  id: string
  course_slug: string
  lesson_number: number
  title: string
  body: string
  exercise: string
  is_preview: boolean
}

export type AcademyPlan = {
  plan_key: 'free' | 'premium_monthly' | 'premium_annual'
  name: string
  description: string
  price_cents: number
  currency: string
  billing_interval: 'month' | 'year' | null
  features: string[]
  sort_order: number
  is_active: boolean
}
