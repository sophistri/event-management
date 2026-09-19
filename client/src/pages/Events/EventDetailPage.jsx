import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEvent, deleteEvent, rsvp, cancelRsvp, listAttendees } from '../../api/events';
import { useAuth } from '../../hooks/useAuth';
import { formatRange } from '../../../utils/dates';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState(null); // only loaded for the organizer
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getEvent(id)
      .then(setEvent)
      .catch((e) => setError(e.response?.data?.error || 'Failed to load event'));
  }, [id]);

  const isOrganizer = Boolean(user && event && event.organizer?._id === user.id);

  // The organizer also sees who has registered. Reload whenever the count changes.
  useEffect(() => {
    if (!isOrganizer) return;
    listAttendees(id)
      .then(setAttendees)
      .catch(() => setAttendees(null));
  }, [isOrganizer, id, event?.attendeeCount]);

  // Register or cancel, then update the page from the server's answer.
  async function changeRegistration(action) {
    setBusy(true);
    setError('');
    try {
      const result = await action(id); // { attendeeCount, isRegistered }
      setEvent((ev) => ({ ...ev, ...result }));
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong');
      // The event may have filled up or started in the meantime, so re-sync.
      getEvent(id).then(setEvent).catch(() => {});
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this event? This also removes everyone\'s registration.')) return;
    try {
      await deleteEvent(id);
      navigate('/events');
    } catch (e) {
      setError(e.response?.data?.error || 'Delete failed');
    }
  }

  if (error && !event) {
    return (
      <div>
        <Link to="/events" className="ev-back">Back to events</Link>
        <p className="ev-error">{error}</p>
      </div>
    );
  }
  if (!event) return <p className="ev-status">Loading...</p>;

  const started = new Date(event.startsAt) <= new Date();
  const full = event.capacity != null && event.attendeeCount >= event.capacity;

  return (
    <div>
      <Link to="/events" className="ev-back">Back to events</Link>

      <div className="ev-detail-head">
        <h1>{event.title}</h1>
        {event.category && <span className="ev-tag">{event.category}</span>}
      </div>

      {error && <p className="ev-error">{error}</p>}

      <dl className="ev-facts">
        <dt>When</dt>
        <dd>{formatRange(event.startsAt, event.endsAt)}</dd>
        <dt>Where</dt>
        <dd>{event.location}</dd>
        <dt>Organizer</dt>
        <dd>@{event.organizer?.username}</dd>
        <dt>Registered</dt>
        <dd>
          {event.capacity != null
            ? `${event.attendeeCount} of ${event.capacity}`
            : event.attendeeCount}
        </dd>
      </dl>

      {event.description && <p className="ev-description">{event.description}</p>}

      <div className="ev-register">
        {event.isRegistered ? (
          <>
            <p className="ev-note">You are registered for this event.</p>
            <button
              type="button"
              className="ev-btn ev-btn--secondary"
              disabled={busy}
              onClick={() => changeRegistration(cancelRsvp)}
            >
              Cancel registration
            </button>
          </>
        ) : started ? (
          <p className="ev-note">Registration is closed because this event has started.</p>
        ) : full ? (
          <p className="ev-note">This event is full.</p>
        ) : user ? (
          <button
            type="button"
            className="ev-btn"
            disabled={busy}
            onClick={() => changeRegistration(rsvp)}
          >
            {busy ? 'Registering...' : 'Register'}
          </button>
        ) : (
          <p className="ev-note">
            <Link to="/login">Log in</Link> to register for this event.
          </p>
        )}
      </div>

      {isOrganizer && (
        <>
          <div className="ev-actions">
            <Link to={`/events/${id}/edit`} className="ev-btn ev-btn--secondary">
              Edit event
            </Link>
            <button type="button" className="ev-btn ev-btn--danger" onClick={handleDelete}>
              Delete event
            </button>
          </div>

          {attendees && (
            <section className="ev-attendees">
              <h2>Registered attendees</h2>
              {attendees.length === 0 ? (
                <p className="ev-note">No one has registered yet.</p>
              ) : (
                <ul className="ev-attendee-list">
                  {attendees.map((a) => (
                    <li key={a._id}>
                      <span>{a.name}</span>
                      <span className="ev-attendee-username">@{a.username}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}