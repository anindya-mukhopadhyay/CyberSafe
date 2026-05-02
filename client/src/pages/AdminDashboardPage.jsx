import { useEffect, useState } from 'react';
import api from '../api/axios';

const typeOptions = ['', 'phishing', 'fraud', 'harassment', 'identity_theft', 'other'];
const statusOptions = ['', 'pending', 'investigating', 'resolved'];

const AdminDashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ type: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async (nextFilters = filters) => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (nextFilters.type) {
        params.type = nextFilters.type;
      }
      if (nextFilters.status) {
        params.status = nextFilters.status;
      }

      const { data } = await api.get('/reports', { params });
      setReports(data.reports || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const onFilterChange = (e) => {
    const nextFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(nextFilters);
    fetchReports(nextFilters);
  };

  const onStatusUpdate = async (reportId, status) => {
    try {
      await api.patch(`/reports/${reportId}/status`, { status });
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update report status');
    }
  };

  return (
    <main className="container page">
      <section className="dashboard-head">
        <h2>Admin Dashboard</h2>
        <p>Manage cybercrime reports and track investigation progress.</p>
      </section>

      <section className="filter-row card">
        <label>
          Filter by Incident Type
          <select name="type" value={filters.type} onChange={onFilterChange}>
            {typeOptions.map((type) => (
              <option key={type || 'all-types'} value={type}>
                {type || 'All types'}
              </option>
            ))}
          </select>
        </label>

        <label>
          Filter by Status
          <select name="status" value={filters.status} onChange={onFilterChange}>
            {statusOptions.map((status) => (
              <option key={status || 'all-status'} value={status}>
                {status || 'All status'}
              </option>
            ))}
          </select>
        </label>
      </section>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="page-text">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="page-text">No reports found for selected filters.</p>
      ) : (
        <section className="report-list">
          {reports.map((report) => (
            <article key={report._id} className="report-card">
              <div className="report-meta">
                <span className={`badge badge-${report.status}`}>{report.status}</span>
                <span>{new Date(report.createdAt).toLocaleString()}</span>
              </div>

              <h3>{report.incidentType.replace('_', ' ')}</h3>
              <p>
                <strong>Reporter:</strong> {report.name} ({report.email})
              </p>
              <p>
                <strong>Description:</strong> {report.description}
              </p>
              <p>
                <strong>URL / Phone:</strong> {report.urlOrPhone || 'Not provided'}
              </p>

              <div className="row-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => onStatusUpdate(report._id, 'investigating')}
                >
                  Mark Investigating
                </button>
                <button className="btn" onClick={() => onStatusUpdate(report._id, 'resolved')}>
                  Mark Resolved
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default AdminDashboardPage;
