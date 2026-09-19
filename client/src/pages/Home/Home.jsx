import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Placeholder landing page — replace with your real product.
export default function Home() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div className="page-status">Loading...</div>;

  return (
    <div className="home-page">
      <h1>Your app starts here</h1>
      <p className="home-subtext">
        React + Node + MongoDB scaffold, wired up with login and logout.
      </p>

      {user ? (
        <div className="home-actions">
          <p>
            Signed in as <strong>{user.name}</strong> (@{user.username})
          </p>
          <button onClick={logout} className="auth-button">
            Log out
          </button>
        </div>
      ) : (
        <div className="home-actions">
          <Link to="/login" className="auth-button">
            Log in
          </Link>
          <Link to="/signup" className="auth-link-button">
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}
