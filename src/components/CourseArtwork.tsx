import type { AcademyCourse } from '../lib/courses'

const palettes = [
  ['#3D52A0', '#7091E6', '#ADBBDA', '#EDE8F5'],
  ['#5C477B', '#9B83C8', '#D6C8EE', '#F3ECFA'],
  ['#315F62', '#64A7A2', '#B4D8CF', '#E8F4EE'],
  ['#8B4F38', '#D28B5D', '#F0C99C', '#FFF1DB'],
  ['#4B5276', '#878FB8', '#C7CEE3', '#EFF1FA'],
]

function randomUnit(seed: number, index: number) {
  const value = Math.sin(seed * 78.233 + index * 19.19) * 43758.5453
  return value - Math.floor(value)
}

export function CourseArtwork({ course }: { course: Pick<AcademyCourse, 'title' | 'artwork_seed'> }) {
  const palette = palettes[Math.abs(course.artwork_seed) % palettes.length]
  const discs = Array.from({ length: 5 }, (_, index) => {
    const x = 25 + randomUnit(course.artwork_seed, index) * 250
    const y = 16 + randomUnit(course.artwork_seed, index + 10) * 150
    const radius = 15 + randomUnit(course.artwork_seed, index + 20) * 36
    return { x, y, radius }
  })

  return (
    <svg className="course-artwork" viewBox="0 0 300 180" aria-hidden="true" focusable="false">
      <rect width="300" height="180" rx="18" fill={palette[3]} />
      <path d="M0 142C62 101 105 170 165 125s86-34 135-70v125H0Z" fill={palette[2]} opacity=".8" />
      <path d="M0 153c67-36 106 11 163-11s94-27 137-8v46H0Z" fill={palette[1]} opacity=".62" />
      {discs.map((disc, index) => (
        <circle
          key={index}
          cx={disc.x}
          cy={disc.y}
          r={disc.radius}
          fill={palette[index % 2]}
          opacity={index === 0 ? '.72' : '.42'}
        />
      ))}
      <path
        d={`M${30 + randomUnit(course.artwork_seed, 30) * 60} 147c45-53 77-74 112-66s54 43 112 4`}
        fill="none"
        stroke={palette[0]}
        strokeLinecap="round"
        strokeWidth="4"
        opacity=".8"
      />
      <rect x="14" y="14" width="272" height="152" rx="14" fill="none" stroke={palette[0]} strokeOpacity=".22" />
    </svg>
  )
}
