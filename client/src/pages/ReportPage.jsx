import { useMemo, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  name: '',
  email: '',
  incidentType: 'phishing',
  description: '',
  urlOrPhone: '',
};

const urgentKeywords = ['bank', 'otp', 'password', 'threat', 'blackmail', 'aadhar', 'ssn', 'ransom'];

const ReportPage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    ...initialForm,
    name: user?.name || '',
    email: user?.email || '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState([]);

  const urgency = useMemo(() => {
    const text = `${form.description} ${form.urlOrPhone}`.toLowerCase();
    const matched = urgentKeywords.filter((keyword) => text.includes(keyword)).length;

    if (matched >= 3) return 'critical';
    if (matched >= 2) return 'high';
    if (matched >= 1) return 'medium';
    return 'low';
  }, [form.description, form.urlOrPhone]);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      evidenceFiles.forEach((file) => {
        formData.append('evidenceFiles', file);
      });

      await api.post('/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Case filed successfully. Command center has received your report.');
      setForm((prev) => ({ ...initialForm, name: prev.name, email: prev.email }));
      setEvidenceFiles([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container page">
      <section className="ops-head compact">
        <div>
          <p className="hero-kicker">PUBLIC INCIDENT INTAKE</p>
          <h2>Cybercrime Reporting Form</h2>
          <p>
            Submit complete details to accelerate case classification and assign the correct
            investigation workflow.
          </p>
        </div>

        <aside className="intel-strip">
          <h3>Live Urgency Preview</h3>
          <p>
            Based on entered details, your case currently appears as{' '}
            <span className={`severity severity-${urgency}`}>{urgency}</span>
          </p>
        </aside>
      </section>

      <section className="form-layout">
        <section className="form-card tactical-card">
          <form className="form-grid" onSubmit={onSubmit}>
            <label>
              Name
              <input type="text" name="name" value={form.name} onChange={onChange} required />
            </label>

            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={onChange} required />
            </label>

            <label>
              Incident Type
              <select name="incidentType" value={form.incidentType} onChange={onChange} required>
                <option value="phishing">Phishing</option>
                <option value="fraud">Fraud</option>
                <option value="harassment">Harassment</option>
                <option value="identity_theft">Identity Theft</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              Incident Description
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                minLength={10}
                required
                placeholder="Explain what happened, when it happened, and what was requested from you."
              />
            </label>

            <label>
              Optional URL or Phone Number
              <input
                type="text"
                name="urlOrPhone"
                value={form.urlOrPhone}
                onChange={onChange}
                placeholder="malicious-domain.example or +91xxxxxxxxxx"
              />
            </label>

            <label>
              Upload Evidence Files (Optional)
              <input
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.webp,.pdf,.txt"
                onChange={(e) => setEvidenceFiles(Array.from(e.target.files || []))}
              />
            </label>

            {evidenceFiles.length > 0 && (
              <div className="selected-files">
                <strong>Selected Files:</strong>
                <ul>
                  {evidenceFiles.map((file) => (
                    <li key={`${file.name}-${file.size}`}>
                      {file.name} ({Math.ceil(file.size / 1024)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {message && <p className="success-text">{message}</p>}
            {error && <p className="error-text">{error}</p>}

            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </section>

        <aside className="card tactical-card evidence-panel">
          <h3>Evidence Checklist</h3>
          <ul>
            <li>Suspicious message screenshot</li>
            <li>Transaction reference ID (if money loss happened)</li>
            <li>Sender email, URL, or phone number</li>
            <li>Date/time of the incident</li>
            <li>Any account or device impact observed</li>
          </ul>
          <p className="page-text">
            Tip: never share OTP or passwords in the report. Mention what was asked, not the secret
            itself.
          </p>
        </aside>
      </section>
    </main>
  );
};

export default ReportPage;
