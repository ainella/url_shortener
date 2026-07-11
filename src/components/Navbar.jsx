import './Navbar.css'
import { FaLink, FaGitlab } from 'react-icons/fa'
// 1. Import Link from react-router-dom
import { Link } from 'react-router-dom' 

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FaLink className="navbar-icon" />
        <span className="navbar-title">ShortyURL</span>
      </div>

      <ul className="navbar-links">
        {/* 2. Change <a> tags to <Link to="..."> */}
        <li><Link to="/">Home</Link></li>
        <li><Link to="/links">Links</Link></li>
        <li>
          <a href="http://gitlab.com/ainella" target="_blank" rel="noopener noreferrer" className="github-btn">
            <FaGitlab /> GitLab
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar