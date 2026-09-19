import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { listEvents } from '../../api/events';
import EventRow from '../../components/EventRow';

// Landing page. Rendered inside EventsLayout, so the nav bar is already above it.
export default function Home() {
  const { user, loading } = useAuth();
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false;
    listEvents({ limit: 3 })
      .then((d) => {
        if (cancelled) return;
        setEvents(d.events);
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="ev-status">Loading...</p>;

  return (
    <div>
      <section className="ev-hero">
        <h1>{user ? `Welcome back, ${user.name}` : 'Find events, or host your own'}</h1>
        <p>
          {user
            ? 'Create a new event or see what is coming up.'
            : 'Browse what is coming up, or sign up to create an event of your own.'}
        </p>
        <div className="ev-hero-actions">
          {user ? (
            <>
              <Link to="/events/new" className="ev-btn">Create an event</Link>
              <Link to="/events" className="ev-btn ev-btn--secondary">Browse events</Link>
            </>
          ) : (
            <>
              <Link to="/events" className="ev-btn">Browse events</Link>
              <Link to="/signup" className="ev-btn ev-btn--secondary">Sign up</Link>
            </>
          )}
        </div>
      </section>

      <section>
        <div className="ev-section-head">
          <h2>Coming up</h2>
          {events.length > 0 && <Link to="/events">See all events</Link>}
        </div>

        {status === 'loading' && <p className="ev-status">Loading...</p>}
        {status === 'error' && <p className="ev-error">Could not load events.</p>}
        {status === 'ready' && events.length === 0 && (
          <p className="ev-empty">No upcoming events yet.</p>
        )}
        {events.length > 0 && (
          <ul className="ev-list">
            {events.map((ev) => (
              <EventRow key={ev._id} event={ev} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}