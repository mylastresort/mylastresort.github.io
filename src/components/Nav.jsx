const SUN_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'

const MOON_ICON =
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'

const LINKS = [
  { id: 'home', label: 'home' },
  { id: 'projects', label: 'projects' },
  { id: 'archive', label: 'archive' },
]

export default function Nav({ page, onNavigate, onToggleTheme, theme, navRef }) {
  return (
    <nav ref={navRef}>
      <div className="nav-inner">
        {LINKS.map(link => (
          <a
            key={link.id}
            href={'#' + link.id}
            className={'nav-link' + (page === link.id ? ' active' : '')}
            onClick={e => {
              e.preventDefault()
              onNavigate(link.id)
            }}
          >
            {link.label}
          </a>
        ))}
        <button
          id="theme-toggle"
          aria-label="Toggle dark mode"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={onToggleTheme}
          dangerouslySetInnerHTML={{ __html: theme === 'dark' ? SUN_ICON : MOON_ICON }}
        />
      </div>
    </nav>
  )
}