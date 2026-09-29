import Sidebar from '../components/Sidebar.jsx'
import { projects } from '../data/projects.js'

function Preview({ project }) {
  return (
    <div className="project-preview">
      <img
        src={project.preview}
        alt={`${project.title} preview`}
        loading="lazy"
        width="16"
        height="10"
      />
      {project.status !== 'live' && (
        <span className="project-flag">coming soon</span>
      )}
    </div>
  )
}

function ProjectCard({ project }) {
  const teaser = project.status !== 'live'

  return (
    <article className={'project-card' + (teaser ? ' is-teaser' : '')}>
      <Preview project={project} />

      <div className="project-body">
        <h3 className="project-title">
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            {project.title}
          </a>
          <span className="project-arrow" aria-hidden="true">&rarr;</span>
        </h3>
        <p className="project-desc">{project.description}</p>
      </div>
    </article>
  )
}

export default function Projects() {
  return (
    <div className="page-wrap active">
      <div className="page-inner">
        <div className="content-area">
          <div className="breadcrumb"><span>~ / </span>projects</div>

          <div className="project-grid">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  )
}
