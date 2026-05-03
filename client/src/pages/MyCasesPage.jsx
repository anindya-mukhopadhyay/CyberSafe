import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const MyCasesPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyReports = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      const { data } = await api.get('/reports/my');
      setReports(data.reports || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your reports');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      return undefined;
    }

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket'],
    });

    socket.emit('cases:join', user.id);
    socket.on('reports:updated', () => {
      fetchMyReports(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

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
                <strong>Latest Update:</strong> {new Date(report.updatedAt).toLocaleString()}
              </p>

              {report.evidenceFiles?.length > 0 && (
                <div className="evidence-links">
                  <strong>Attached Evidence Files:</strong>
                  <ul>
                    {report.evidenceFiles.map((file) => (
                      <li key={file.filename}>
                        <a href={file.url} target="_blank" rel="noreferrer">
                          {file.originalName}
                        </a>{' '}
                        ({Math.ceil(file.size / 1024)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default MyCasesPage;
