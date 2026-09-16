import Sidebar from '../components/Sidebar.jsx'

export default function Projects() {
  return (
    <div className="page-wrap active">
      <div className="page-inner">
        <div className="content-area">
          <div className="breadcrumb"><span>~ / </span>projects</div>
          <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: '17px', marginTop: '8px' }}>more coming
            soon.</p>
        </div>
        <Sidebar />
      </div>
    </div>
  )
}