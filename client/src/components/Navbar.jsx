import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          CyberSafe
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/phishing">Phishing Check</NavLink>
          {isAuthenticated && <NavLink to="/report">Report Incident</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">Admin Dashboard</NavLink>}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
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
