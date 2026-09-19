import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEvent, deleteEvent } from '../../api/events';
import { useAuth } from '../../hooks/useAuth';

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
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      navigate('/events');
    } catch (e) {
      setError(e.response?.data?.error || 'Delete failed');
    }
  }

  if (error) return <p style={{ color: 'crimson' }}>{error}</p>;
  if (!event) return <p>Loading...</p>;

  const isOrganizer = user && event.organizer?._id === user.id;

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{new Date(event.startsAt).toLocaleString()} – {new Date(event.endsAt).toLocaleString()}</p>
      <p>{event.location} · {event.category}</p>
      <p>Organized by {event.organizer?.username}</p>
      {event.capacity && <p>Capacity: {event.capacity}</p>}
      <p>{event.description}</p>

      {isOrganizer && (
        <>
          <Link to={`/events/${id}/edit`}>Edit</Link>{' '}
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
      <p><Link to="/events">← All events</Link></p>
    </div>
  );
}