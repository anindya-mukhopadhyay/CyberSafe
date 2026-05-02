import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const liveSignals = [
  'National phishing alert feed: active',
  'Fraud complaint ingestion channel: online',
  'Public cyber tip-line: stable',
  'Threat signature scan: synchronized',
];

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <main className="container page">
      <section className="hero ops-hero">
        <div>
          <p className="hero-kicker">CYBER OPERATIONS COMMAND GRID</p>
          <h1>Coordinate reports, track investigations, and detect phishing threats faster.</h1>
          <p>
            CyberSafe gives investigators and citizens one secure channel to report incidents,
            analyze malicious URLs, and move every case from intake to resolution.
          </p>

          <div className="hero-actions">
            {isAuthenticated ? (
              <>
                <Link className="btn" to="/report">
                  File New Incident
                </Link>
                <Link className="btn btn-secondary" to="/my-cases">
                  View My Cases
                </Link>
              </>
            ) : (
              <>
                <Link className="btn" to="/signup">
                  Create Secure Account
                </Link>
                <Link className="btn btn-secondary" to="/login">
                  Officer Login
                </Link>
              </>
            )}
          </div>
        </div>

        <aside className="intel-strip">
          <h3>Live Signals</h3>
          <ul>
            {liveSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
          <p>
            Active operator:{' '}
            <strong>{isAuthenticated ? user?.name || 'Authenticated user' : 'Guest session'}</strong>
          </p>
        </aside>
      </section>

      <section className="kpi-grid">
        <article className="kpi-card">
          <span>Response Pipeline</span>
          <h3>24x7</h3>
          <p>Case queue and report triage remain available at all times.</p>
        </article>
        <article className="kpi-card">
          <span>Threat Screening</span>
          <h3>URL Scan</h3>
          <p>Instant phishing checks with keyword, pattern, and domain heuristics.</p>
        </article>
        <article className="kpi-card">
          <span>Admin Control</span>
          <h3>Role-Gated</h3>
          <p>Only authorized admins can update report statuses and case outcomes.</p>
        </article>
        <article className="kpi-card">
          <span>Case Visibility</span>
          <h3>My Cases</h3>
          <p>Every user can track submitted incidents and latest investigation updates.</p>
        </article>
      </section>

      <section className="feature-grid">
        <article className="card tactical-card">
          <h3>Secure Reporting Intake</h3>
          <p>
            Structured fields capture victim details, incident category, detailed context, and
            supporting URL or phone evidence.
          </p>
        </article>
        <article className="card tactical-card">
          <h3>Phishing Risk Engine</h3>
          <p>
            URLs are scored using suspicious TLD checks, malicious keyword patterns, and obfuscation
            indicators to highlight risky links.
          </p>
        </article>
        <article className="card tactical-card">
          <h3>Command Center Workflow</h3>
          <p>
            Admin operators can filter and search reports, monitor severity, and move cases from
            pending to investigating or resolved.
          </p>
        </article>
      </section>
    </main>
  );
};

export default HomePage;
