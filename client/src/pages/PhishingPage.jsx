import { useMemo, useState } from 'react';
import api from '../api/axios';

const quickUrls = [
  'secure-login-paypal.verify-account.top',
  'google.com',
  '192.168.0.1/login',
  'bank-alert-update.wallet-security.xyz',
];

const PhishingPage = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const riskLabel = useMemo(() => {
    if (!result) return null;
    if (result.score >= 70) return 'High Risk';
    if (result.score >= 40) return 'Medium Risk';
    return 'Low Risk';
  }, [result]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data } = await api.post('/phishing/check-url', { url });
      setResult(data.result);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not analyze URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container page">
      <section className="ops-head compact">
        <div>
          <p className="hero-kicker">THREAT SCREENING MODULE</p>
          <h2>Phishing URL Detection</h2>
          <p>
            Screen suspicious links before clicking. CyberSafe evaluates domain and URL patterns for
            known phishing signals.
          </p>
        </div>
      </section>

      <section className="form-layout">
        <section className="form-card tactical-card">
          <form onSubmit={onSubmit} className="form-grid">
            <label>
              URL
              <input
                type="text"
                placeholder="example.com/login"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </label>

            <div className="quick-url-row">
              {quickUrls.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  className="btn btn-secondary tiny"
                  onClick={() => setUrl(sample)}
                >
                  Test: {sample}
                </button>
              ))}
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Checking...' : 'Analyze URL'}
            </button>
          </form>
        </section>

        {result && (
          <article className="analysis-card tactical-card">
            <h3>Analysis Result</h3>
            <p>
              <strong>Normalized URL:</strong> {result.normalizedUrl}
            </p>
            <p>
              <strong>Risk Score:</strong> {result.score} / 100
            </p>

            <div className="risk-meter-wrap">
              <div className="risk-meter">
                <span style={{ width: `${Math.min(100, result.score)}%` }} />
              </div>
              <span className={`severity severity-${result.isSuspicious ? 'high' : 'low'}`}>
                {riskLabel}
              </span>
            </div>

            <p>
              <strong>Status:</strong>{' '}
              <span className={result.isSuspicious ? 'error-text' : 'success-text'}>
                {result.isSuspicious ? 'Potentially Suspicious' : 'Likely Safe'}
              </span>
            </p>

            {result.reasons.length > 0 ? (
              <ul>
                {result.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            ) : (
              <p>No suspicious patterns detected.</p>
            )}
          </article>
        )}
      </section>
    </main>
  );
};

export default PhishingPage;
