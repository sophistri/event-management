import { useEffect, useState } from 'react';
import { listEvents } from '../../api/events';
import EventRow from '../../components/EventRow';
import PixelIcon from '../../components/PixelIcon';

export default function EventsPage() {
  const [data, setData] = useState({ events: [], page: 1, pages: 0 });
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
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
      <h1>Upcoming events</h1>

      <input
        type="search"
        className="ev-input ev-search"
        placeholder="Search by title"
        aria-label="Search events by title"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setPage(1);
        }}
      />

      {error && <p className="ev-error">{error}</p>}
      {loading && <p className="ev-status">Loading...</p>}
      {!loading && !error && data.events.length === 0 && (
        <div className="ev-empty">
          <PixelIcon name="folder" size={4} />
          <p>{q ? 'No upcoming events match your search.' : 'No upcoming events yet.'}</p>
        </div>
      )}

      {data.events.length > 0 && (
        <ul className="ev-list">
          {data.events.map((ev) => (
            <EventRow key={ev._id} event={ev} />
          ))}
        </ul>
      )}

      {data.pages > 1 && (
        <div className="ev-pager">
          <button
            type="button"
            className="ev-btn ev-btn--secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {data.pages}
          </span>
          <button
            type="button"
            className="ev-btn ev-btn--secondary"
            disabled={page >= data.pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}