import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { signup } from '../../api/auth';
import PixelWindow from '../../components/PixelWindow';
import PixelIcon from '../../components/PixelIcon';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      // Signing up logs the user in right away for this scaffold — no email
      // verification step. Add one later if your product needs it.
      await signup(form);
      await login({ identifier: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <PixelWindow title="signup.exe">
      <h2>
        <PixelIcon name="heart" size={3} />
        Sign up
      </h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="ev-input"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="ev-input"
        />
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={24}
          className="ev-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={handleChange}
          required
          minLength={8}
          className="ev-input"
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="ev-btn" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
      <p className="auth-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
      </PixelWindow>
    </div>
  );
}
