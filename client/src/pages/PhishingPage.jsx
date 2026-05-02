import { useState } from 'react';
import api from '../api/axios';

const PhishingPage = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      <section className="form-card">
        <h2>Phishing URL Detection</h2>
        <p>Enter a URL to check for suspicious patterns and cyber-risk indicators.</p>

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

          {error && <p className="error-text">{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Checking...' : 'Analyze URL'}
          </button>
        </form>

        {result && (
          <article className="analysis-card">
            <h3>Analysis Result</h3>
            <p>
              <strong>Normalized URL:</strong> {result.normalizedUrl}
            </p>
            <p>
              <strong>Risk Score:</strong> {result.score} / 100
            </p>
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
