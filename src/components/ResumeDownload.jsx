const VIEW_ICON =
  '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'

export const RESUME_URL = `${import.meta.env.BASE_URL}resume.pdf`
export const DOWNLOAD_NAME = 'Samy.Tamim.Resume.pdf'
export const LABEL = 'resume (PDF, 104 KB)'

export function ResumeNavLink() {
  return (
    <span className="resume-nav">
      <a
        className="resume-nav-link"
        href={RESUME_URL}
        download={DOWNLOAD_NAME}
        aria-label="Download resume as PDF"
        title={LABEL}
      >
        resume
      </a>
      <a
        className="resume-nav-view"
        href={RESUME_URL}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex="-1"
        aria-label="View resume as PDF in a new tab"
        title="View resume as PDF"
      >
        <span className="icon" dangerouslySetInnerHTML={{ __html: VIEW_ICON }} />
      </a>
    </span>
  )
}