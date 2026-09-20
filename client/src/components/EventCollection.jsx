import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventRow from "./EventRow";

// A titled page that loads a set of events and splits them into Upcoming and Past.
// `load` is an API function that resolves to { events }. Used by both dashboards.
export default function EventCollection({ title, load, emptyText, emptyAction }) {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    load()
      .then((d) => !cancelled && setEvents(d.events))
      .catch((e) => !cancelled && setError(e.response?.data?.error || "Failed to load events"));
    return () => {
      cancelled = true;
    };
  }, [load]);

  // "Past" means it has finished; an event that is under way still counts as upcoming.
  const now = new Date();
  const upcoming = (events || [])
    .filter((e) => new Date(e.endsAt) >= now)
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  const past = (events || [])
    .filter((e) => new Date(e.endsAt) < now)
    .sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));

  return (
    <div>
      <h1>{title}</h1>

      {error && <p className="ev-error">{error}</p>}
      {!events && !error && <p className="ev-status">Loading...</p>}

      {events && events.length === 0 && (
        <div className="ev-empty">
          <p>{emptyText}</p>
          <Link to={emptyAction.to} className="ev-btn">
            {emptyAction.label}
          </Link>
        </div>
      )}

      {events && events.length > 0 && (
        <>
          <section className="ev-group">
            <h2>Upcoming</h2>
            {upcoming.length > 0 ? (
              <ul className="ev-list">
                {upcoming.map((ev) => (
                  <EventRow key={ev._id} event={ev} />
                ))}
              </ul>
            ) : (
              <p className="ev-note">Nothing upcoming.</p>
            )}
          </section>

          {past.length > 0 && (
            <section className="ev-group">
              <h2>Past</h2>
              <ul className="ev-list">
                {past.map((ev) => (
                  <EventRow key={ev._id} event={ev} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}