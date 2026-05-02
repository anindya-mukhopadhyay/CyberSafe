import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await signup(form);
      navigate('/report');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container page">
      <section className="form-card">
        <h2>Create Account</h2>
        <p>Register to submit and track cybercrime reports.</p>

        <form onSubmit={onSubmit} className="form-grid">
          <label>
            Name
            <input type="text" name="name" value={form.name} onChange={onChange} required />
          </label>

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
              minLength={6}
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default SignupPage;
