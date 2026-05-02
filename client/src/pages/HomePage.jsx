import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="container page">
      <section className="hero">
        <h1>CyberSafe: Report Cybercrime. Detect Phishing. Stay Protected.</h1>
        <p>
          CyberSafe helps citizens quickly report online incidents and verify suspicious URLs before
          they can cause harm.
        </p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <Link className="btn" to="/report">
              Submit a Cybercrime Report
            </Link>
          ) : (
            <Link className="btn" to="/signup">
              Create Free Account
            </Link>
          )}
          <Link className="btn btn-secondary" to="/phishing">
            Check a Suspicious URL
          </Link>
        </div>
      </section>

      <section className="feature-grid">
        <article className="card">
          <h3>Secure Reporting</h3>
          <p>Capture incident details with structured evidence to support quicker investigations.</p>
        </article>
        <article className="card">
          <h3>Phishing Detection</h3>
          <p>Analyze URLs for suspicious domains, keywords, and risky patterns instantly.</p>
        </article>
        <article className="card">
          <h3>Admin Workflow</h3>
          <p>Track case status from pending to investigating and resolved with clear filters.</p>
        </article>
      </section>
    </main>
  );
};

export default HomePage;
