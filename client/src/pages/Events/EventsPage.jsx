import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listEvents } from '../../api/events';

export default function EventsPage() {
  const [data, setData] = useState({ events: [], page: 1, pages: 0 });
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listEvents({ q: q || undefined, page })
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e.response?.data?.error || 'Failed to load events'))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [q, page]);

  return (
    <div>
      <h1>Events</h1>
      <Link to="/events/new">Create event</Link>

      <input
        placeholder="Search events..."
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setPage(1);
        }}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {!loading && data.events.length === 0 && <p>No upcoming events.</p>}

      <ul>
        {data.events.map((ev) => (
          <li key={ev._id}>
            <Link to={`/events/${ev._id}`}>{ev.title}</Link>
            {' — '}
            {new Date(ev.startsAt).toLocaleString()} @ {ev.location}
          </li>
        ))}
      </ul>

      {data.pages > 1 && (
        <div>
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
          <span> {page} / {data.pages} </span>
          <button disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}