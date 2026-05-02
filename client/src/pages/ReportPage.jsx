import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  name: '',
  email: '',
  incidentType: 'phishing',
  description: '',
  urlOrPhone: '',
};

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

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await api.post('/reports', form);
      setMessage('Report submitted successfully. Our team will review it soon.');
      setForm((prev) => ({ ...initialForm, name: prev.name, email: prev.email }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container page">
      <section className="form-card">
        <h2>Cybercrime Report Form</h2>
        <p>Provide accurate details to help investigation teams respond effectively.</p>

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
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              minLength={10}
              required
            />
          </label>

          <label>
            Optional URL or Phone Number
            <input type="text" name="urlOrPhone" value={form.urlOrPhone} onChange={onChange} />
          </label>

          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ReportPage;
