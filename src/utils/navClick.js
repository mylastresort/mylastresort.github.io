export function handleNavClick(e, onNavigate, page) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  onNavigate(page)
}
