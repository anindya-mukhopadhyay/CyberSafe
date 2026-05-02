import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(form);
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/report');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container page">
      <section className="form-card">
        <h2>Login</h2>
        <p>Access your CyberSafe account.</p>

        <form onSubmit={onSubmit} className="form-grid">
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={onChange} required />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p>
          New user? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;
