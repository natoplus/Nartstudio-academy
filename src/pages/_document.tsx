import { Html, Head, Main, NextScript } from 'next/document'

const themeBootstrap = `
  try {
    const savedTheme = window.localStorage.getItem('nartstudio-academy-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      document.documentElement.dataset.theme = savedTheme
    }
  } catch (error) {
    console.warn('Academy theme preference is unavailable; using light mode.', error)
  }
`

export default function Document() {
  return (
    <Html lang="en" data-theme="light">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
