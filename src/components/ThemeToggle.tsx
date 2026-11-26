import { useEffect, useState } from 'react'

const storageKey = 'nartstudio-academy-theme'
type Theme = 'light' | 'dark'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const currentTheme = document.documentElement.dataset.theme
    const initialTheme: Theme = currentTheme === 'dark' ? 'dark' : 'light'
    setTheme(initialTheme)
  }, [])

  function toggleTheme() {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    setTheme(nextTheme)
    try {
      window.localStorage.setItem(storageKey, nextTheme)
    } catch (error) {
      console.error('Could not save the Academy theme preference:', error)
    }
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-pressed={theme === 'dark'}
    >
      <span aria-hidden="true">{theme === 'dark' ? '☼' : '◐'}</span>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}
