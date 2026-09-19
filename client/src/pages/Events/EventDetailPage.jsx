import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEvent, deleteEvent } from '../../api/events';
import { useAuth } from '../../hooks/useAuth';
import { formatRange } from '../../../utils/dates';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getEvent(id)
      .then(setEvent)
      .catch((e) => setError(e.response?.data?.error || 'Failed to load event'));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
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

  const isOrganizer = user && event.organizer?._id === user.id;

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
        {event.capacity && (
          <>
            <dt>Capacity</dt>
            <dd>{event.capacity} people</dd>
          </>
        )}
      </dl>

      {event.description && <p className="ev-description">{event.description}</p>}

      {isOrganizer && (
        <div className="ev-actions">
          <Link to={`/events/${id}/edit`} className="ev-btn ev-btn--secondary">
            Edit event
          </Link>
          <button type="button" className="ev-btn ev-btn--danger" onClick={handleDelete}>
            Delete event
          </button>
        </div>
      )}
    </div>
  );
}