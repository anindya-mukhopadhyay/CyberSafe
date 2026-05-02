import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          CYBERSAFE OPS
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/phishing">Phishing Check</NavLink>
          {isAuthenticated && <NavLink to="/report">Report Incident</NavLink>}
          {isAuthenticated && <NavLink to="/my-cases">My Cases</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">Command Center</NavLink>}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="live-indicator">LIVE</span>
              <span className="user-chip">{user?.name}</span>
              <button className="btn btn-secondary" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-secondary" to="/login">
                Login
              </Link>
              <Link className="btn" to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
