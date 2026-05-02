import { useEffect, useState } from 'react';
import api from '../api/axios';

const MyCasesPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/reports/my');
        setReports(data.reports || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your reports');
      } finally {
        setLoading(false);
      }
    };

    fetchMyReports();
  }, []);

  return (
    <main className="container page">
      <section className="panel-head">
        <h2>My Cases</h2>
        <p>Track every report you submitted and monitor investigation progress in real time.</p>
      </section>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="page-text">Syncing your case records...</p>
      ) : reports.length === 0 ? (
        <section className="intel-strip">
          <h3>No cases submitted yet</h3>
          <p>Once you file a cybercrime report, it will appear here with status and severity tags.</p>
        </section>
      ) : (
        <section className="report-list">
          {reports.map((report) => (
            <article key={report._id} className="report-card tactical-card">
              <div className="report-meta">
                <span className={`badge badge-${report.status}`}>{report.status}</span>
                <span className={`severity severity-${report.severity}`}>{report.severity}</span>
                <span>{new Date(report.createdAt).toLocaleString()}</span>
              </div>

              <h3>{report.incidentType.replace('_', ' ')}</h3>

              <p>
                <strong>Details:</strong> {report.description}
              </p>
              <p>
                <strong>Evidence:</strong> {report.urlOrPhone || 'Not provided'}
              </p>
              <p>
                <strong>Latest Update:</strong>{' '}
                {new Date(report.updatedAt).toLocaleString()}
              </p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default MyCasesPage;
