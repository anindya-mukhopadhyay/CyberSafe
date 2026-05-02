import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const typeOptions = ['', 'phishing', 'fraud', 'harassment', 'identity_theft', 'other'];
const statusOptions = ['', 'pending', 'investigating', 'resolved'];
const severityOptions = ['', 'low', 'medium', 'high', 'critical'];

const emptyOverview = {
  total: 0,
  pending: 0,
  investigating: 0,
  resolved: 0,
  critical: 0,
  last24h: 0,
  typeDistribution: [],
};

const AdminDashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [overview, setOverview] = useState(emptyOverview);
  const [filters, setFilters] = useState({ type: '', status: '', severity: '', q: '' });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [clock, setClock] = useState(new Date());

  const topIncident = useMemo(() => {
    if (!overview.typeDistribution.length) {
      return 'No cases yet';
    }

    const [first] = overview.typeDistribution;
    return `${first._id.replace('_', ' ')} (${first.count})`;
  }, [overview.typeDistribution]);

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchReports = async (nextFilters = filters, silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setSyncing(true);
      }
      setError('');

      const params = {};
      if (nextFilters.type) params.type = nextFilters.type;
      if (nextFilters.status) params.status = nextFilters.status;
      if (nextFilters.severity) params.severity = nextFilters.severity;
      if (nextFilters.q.trim()) params.q = nextFilters.q.trim();

      const { data } = await api.get('/reports', { params });
      setReports(data.reports || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  const fetchOverview = async () => {
    try {
      const { data } = await api.get('/reports/overview');
      setOverview(data.overview || emptyOverview);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard overview');
    }
  };

  const refreshAll = async (silent = false) => {
    await Promise.all([fetchReports(filters, silent), fetchOverview()]);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
    const autoRefresh = setInterval(() => refreshAll(true), 20000);
    return () => clearInterval(autoRefresh);
  }, [filters]);

  const onFilterChange = (e) => {
    const nextFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(nextFilters);
  };

  const onApplyFilters = () => {
    fetchReports(filters);
  };

  const onClearFilters = () => {
    const nextFilters = { type: '', status: '', severity: '', q: '' };
    setFilters(nextFilters);
    fetchReports(nextFilters);
  };

  const onStatusUpdate = async (reportId, status) => {
    try {
      await api.patch(`/reports/${reportId}/status`, { status });
      refreshAll(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update report status');
    }
  };

  return (
    <main className="container page">
      <section className="ops-head">
        <div>
          <p className="hero-kicker">ADMIN // CYBERSAFE COMMAND CENTER</p>
          <h2>Investigation Control Desk</h2>
          <p>Manage incoming reports, set case status, and monitor high-risk cyber activity.</p>
        </div>

        <aside className="command-clock">
          <p>Live System Time</p>
          <h3>{clock.toLocaleTimeString()}</h3>
          <span>{clock.toLocaleDateString()}</span>
          <button className="btn btn-secondary" onClick={() => refreshAll(true)} disabled={syncing}>
            {syncing ? 'Syncing...' : 'Manual Sync'}
          </button>
        </aside>
      </section>

      <section className="kpi-grid kpi-grid-admin">
        <article className="kpi-card">
          <span>Total Reports</span>
          <h3>{overview.total}</h3>
          <p>All submitted cybercrime cases in the system.</p>
        </article>
        <article className="kpi-card">
          <span>Pending Queue</span>
          <h3>{overview.pending}</h3>
          <p>Cases awaiting first response from investigators.</p>
        </article>
        <article className="kpi-card">
          <span>Under Investigation</span>
          <h3>{overview.investigating}</h3>
          <p>Cases currently being actively reviewed.</p>
        </article>
        <article className="kpi-card">
          <span>Resolved</span>
          <h3>{overview.resolved}</h3>
          <p>Closed incidents with documented outcome.</p>
        </article>
        <article className="kpi-card">
          <span>Critical Severity</span>
          <h3>{overview.critical}</h3>
          <p>High-priority incidents requiring rapid action.</p>
        </article>
        <article className="kpi-card">
          <span>Last 24 Hours</span>
          <h3>{overview.last24h}</h3>
          <p>New incidents filed during the last rolling day.</p>
        </article>
      </section>

      <section className="intel-strip">
        <h3>Tactical Snapshot</h3>
        <p>
          Top incident type: <strong>{topIncident}</strong>
        </p>
      </section>

      <section className="filter-grid card tactical-card">
        <label>
          Search
          <input
            type="text"
            name="q"
            value={filters.q}
            onChange={onFilterChange}
            placeholder="Name, email, keyword, URL, phone"
          />
        </label>

        <label>
          Incident Type
          <select name="type" value={filters.type} onChange={onFilterChange}>
            {typeOptions.map((type) => (
              <option key={type || 'all-types'} value={type}>
                {type || 'All types'}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status
          <select name="status" value={filters.status} onChange={onFilterChange}>
            {statusOptions.map((status) => (
              <option key={status || 'all-status'} value={status}>
                {status || 'All status'}
              </option>
            ))}
          </select>
        </label>

        <label>
          Severity
          <select name="severity" value={filters.severity} onChange={onFilterChange}>
            {severityOptions.map((severity) => (
              <option key={severity || 'all-severity'} value={severity}>
                {severity || 'All severity'}
              </option>
            ))}
          </select>
        </label>

        <div className="row-actions">
          <button className="btn" onClick={onApplyFilters}>
            Apply Filters
          </button>
          <button className="btn btn-secondary" onClick={onClearFilters}>
            Clear
          </button>
        </div>
      </section>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="page-text">Loading tactical report feed...</p>
      ) : reports.length === 0 ? (
        <p className="page-text">No reports found for selected filters.</p>
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
                <strong>Reporter:</strong> {report.name} ({report.email})
              </p>
              <p>
                <strong>Description:</strong> {report.description}
              </p>
              <p>
                <strong>Evidence (URL / Phone):</strong> {report.urlOrPhone || 'Not provided'}
              </p>
              <p>
                <strong>Status Log Entries:</strong> {report.statusHistory?.length || 1}
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
