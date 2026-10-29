import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PixelIcon from './PixelIcon';
import PixelWindow from './PixelWindow';
import '../pages/Events/Events.css';

// The title bar of the content window reads like a filename on a retro desktop.
function windowTitle(pathname) {
  if (pathname === '/') return 'home.exe';
  if (pathname === '/events') return 'events.exe';
  if (pathname === '/events/new') return 'new_event.exe';
  if (/^\/events\/[^/]+\/edit$/.test(pathname)) return 'edit_event.exe';
  if (pathname.startsWith('/events/')) return 'event.exe';
  if (pathname === '/my/events') return 'my_events.exe';
  if (pathname === '/my/registrations') return 'my_registrations.exe';
  if (pathname === '/my/analytics') return 'analytics.exe';
  return 'event_management.exe';
}

// Menu-bar clock, e.g. "tue 11:11 pm". Decorative, so hidden from screen readers.
function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const text = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
    .format(now)
    .toLowerCase();

  return (
    <span className="events-clock" aria-hidden="true">
      {text}
    </span>
  );
}

// Shared frame for every page except login/signup: a menu bar on top, the page
// inside a window below. Used as a layout route in AppRoutes.jsx, so pages
// render into <Outlet />.
export default function EventsLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  async function handleLogout() {
    await logout();
    navigate('/events');
  }

  return (
    <div className="events-shell">
      <header className="events-nav">
        <div className="events-nav-inner">
          <Link to="/" className="events-brand">
            <PixelIcon name="star" size={2} />
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

          <Clock />

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
        <PixelWindow title={windowTitle(pathname)}>
          <Outlet />
        </PixelWindow>
      </main>
    </div>
  );
}
