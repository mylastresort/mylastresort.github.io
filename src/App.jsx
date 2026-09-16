import { useEffect, useRef, useState } from 'react'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import Archive from './pages/Archive.jsx'
import ArticleEeg from './pages/ArticleEeg.jsx'

const PAGES = ['home', 'projects', 'archive', 'article-eeg']

function pageFromHash() {
  const hash = window.location.hash.slice(1)
  return PAGES.includes(hash) ? hash : 'home'
}

function initialTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [theme, setTheme] = useState(initialTheme)
  const [page, setPage] = useState(pageFromHash)
  const navRef = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = e => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const onHashChange = () => setPage(pageFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  useEffect(() => {
    const navEl = navRef.current
    if (!navEl) return
    const syncNavHeight = () => {
      document.documentElement.style.setProperty('--nav-h', navEl.offsetHeight + 'px')
    }
    syncNavHeight()
    window.addEventListener('resize', syncNavHeight)
    let observer = null
    if (window.ResizeObserver) {
      observer = new ResizeObserver(syncNavHeight)
      observer.observe(navEl)
    }
    return () => {
      window.removeEventListener('resize', syncNavHeight)
      if (observer) observer.disconnect()
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
  }

  const navigate = newPage => {
    window.location.hash = newPage
    setPage(newPage)
  }

  return (
    <>
      <Nav navRef={navRef} page={page} onNavigate={navigate} onToggleTheme={toggleTheme} theme={theme} />
      {page === 'home' && <Home onNavigate={navigate} />}
      {page === 'projects' && <Projects />}
      {page === 'archive' && <Archive onNavigate={navigate} />}
      {page === 'article-eeg' && <ArticleEeg onNavigate={navigate} />}
    </>
  )
}