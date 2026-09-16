import Sidebar from '../components/Sidebar.jsx'
import { recentPosts } from '../data/site.js'

export default function Archive({ onNavigate }) {
  return (
    <div className="page-wrap active">
      <div className="page-inner">
        <div className="content-area">
          <div className="breadcrumb"><span>~ / </span>archive</div>

          <div className="archive-year">
            <h3>2026</h3>
            <ul className="archive-list">
              {recentPosts.map(post => (
                <li key={post.id}>
                  <span className="date">{post.date}</span>
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
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  )
}