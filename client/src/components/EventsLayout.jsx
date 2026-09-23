import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../pages/Events/Events.css';

// Shared frame for every /events page: a nav bar on top, the page below.
// Used as a layout route in AppRoutes.jsx, so pages render into <Outlet />.
export default function EventsLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/events');
  }

  return (
    <div className="events-shell">
      <header className="events-nav">
        <div className="events-nav-inner">
          <Link to="/" className="events-brand">
            Event Management
          </Link>
          <nav className="events-nav-links">
            <NavLink to="/events" end className="events-nav-link">
              Events
            </NavLink>
            {user && (
              <>
                <NavLink to="/my/events" className="events-nav-link">
                  My events
                </NavLink>
                <NavLink to="/my/registrations" className="events-nav-link">
                  My registrations
                </NavLink>
                <NavLink to="/my/analytics" className="events-nav-link">
                  Analytics
                </NavLink>
              </>
            )}
          </nav>

          {!loading &&
            (user ? (
              <>
                <span className="events-nav-user">@{user.username}</span>
                <Link to="/events/new" className="ev-btn">
                  New event
                </Link>
                <button type="button" className="ev-btn ev-btn--secondary" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="ev-btn ev-btn--secondary">
                  Log in
                </Link>
                <Link to="/signup" className="ev-btn">
                  Sign up
                </Link>
              </>
            ))}
        </div>
      </header>

      <main className="events-main">
        <Outlet />
      </main>
    </div>
  );
}