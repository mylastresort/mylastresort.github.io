import Sidebar from '../components/Sidebar.jsx'
import { recentPosts } from '../data/site.js'

export default function Home({ onNavigate }) {
  return (
    <div className="page-wrap active">
      <div className="page-inner">
        <div className="content-area">
          <div className="breadcrumb"><span>~ / </span>home</div>
          <div className="badges">
            <span className="badge"><span className="badge-label">stack</span><span className="badge-value accent">Python · TypeScript
                · Rust</span></span>
          </div>
          <p className="tagline">🛠 Systems programming, applied ML, and things that run fast. Based in Rabat, Morocco.</p>

          <h2 className="section-title">Overview</h2>
          <p className="bio">I'm a <strong>Software Engineer</strong> working on <strong>full-stack development</strong>, <strong>microservices</strong>, and <strong>IoT systems</strong>. I build scalable backends with <strong>FastAPI</strong>, <strong>Spring Boot</strong>, and <strong>Go</strong>, and craft frontends with <strong>Angular</strong> and <strong>React.js</strong>. Right now I'm learning <strong>Data &amp; AI</strong> on top of a solid base in <strong>cloud</strong>, <strong>DevOps</strong>, and <strong>agile</strong> practices.</p>

          <h2 className="section-title">Recent posts</h2>
          <ul className="post-list">
            {recentPosts.map(post => (
              <li key={post.id}>
                <a
                  className="nav-link"
                  href={'#' + post.id}
                  onClick={e => {
                    e.preventDefault()
                    onNavigate(post.id)
                  }}
                >
                  {post.title}
                </a>
                <div className="post-meta">
                  <span>📅</span> {post.date}
                  <span>—</span>
                  <span>👤</span> {post.author}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Sidebar />
      </div>
    </div>
  )
}