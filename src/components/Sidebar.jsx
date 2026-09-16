import { useEffect, useRef, useState } from 'react'
import { contactLinks } from '../data/site.js'
import photoUrl from '../assets/IMG_20241003_205041_669_w.jpg'

function holderFromHref(href) {
  if (href.startsWith('mailto:')) return href.slice(7)
  const m = href.match(
    /(?:linkedin\.com\/in\/|github\.com\/|leetcode\.com\/u\/|codeforces\.com\/profile\/|codechef\.com\/users\/|kaggle\.com\/)([^/?#]+)/,
  )
  return m ? m[1] : null
}

function ContactLink({ link }) {
  const [display, setDisplay] = useState(link.label)
  const [opacity, setOpacity] = useState(1)
  const timer = useRef(null)
  const holder = holderFromHref(link.href)

  useEffect(() => () => clearTimeout(timer.current), [])

  const fadeSwap = text => {
    clearTimeout(timer.current)
    setOpacity(0)
    timer.current = setTimeout(() => {
      setDisplay(text)
      requestAnimationFrame(() => setOpacity(1))
    }, 100)
  }

  return (
    <li>
      <a
        href={link.href}
        {...(link.href.startsWith('mailto:') ? {} : { target: '_blank' })}
        onMouseEnter={() => holder && fadeSwap(holder)}
        onMouseLeave={() => holder && fadeSwap(link.label)}
      >
        <span className="icon" dangerouslySetInnerHTML={{ __html: link.icon }} />
        <span className="link-label" style={{ opacity }}>{display}</span>
      </a>
    </li>
  )
}

function Photo() {
  const frameRef = useRef(null)
  const hovering = useRef(false)
  const pending = useRef(false)

  const detach = () => {
    hovering.current = false
    pending.current = false
    const frame = frameRef.current
    frame.classList.remove('photo-fixed')
    frame.style.left = ''
    frame.style.top = ''
    frame.style.transition = 'transform 250ms ease-out'
    frame.style.setProperty('--rx', '0deg')
    frame.style.setProperty('--ry', '0deg')
    window.removeEventListener('scroll', detach, true)
  }

  useEffect(() => () => window.removeEventListener('scroll', detach, true), [])

  const onMouseEnter = () => {
    const frame = frameRef.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    hovering.current = true
    const rect = frame.getBoundingClientRect()
    frame.style.left = rect.left + 'px'
    frame.style.top = rect.top + 'px'
    frame.classList.add('photo-fixed')
    window.addEventListener('scroll', detach, true)
  }

  const onMouseMove = e => {
    const frame = frameRef.current
    if (!hovering.current || pending.current) return
    pending.current = true

    requestAnimationFrame(() => {
      if (!hovering.current) {
        pending.current = false
        return
      }
      const rect = frame.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      frame.style.transition = 'transform 60ms linear'
      frame.style.setProperty('--rx', (py - 0.5) * 18 + 'deg')
      frame.style.setProperty('--ry', (0.5 - px) * 20 + 'deg')
      pending.current = false
    })
  }

  const onMouseLeave = () => detach()

  return (
    <div className="photo-slot">
      <div
        className="photo-frame"
        ref={frameRef}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <img className="sidebar-photo" src={photoUrl} alt="profile photo" />
      </div>
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Photo />
      <ul className="sidebar-links">
        {contactLinks.map(link => (
          <ContactLink key={link.href} link={link} />
        ))}
      </ul>
    </aside>
  )
}