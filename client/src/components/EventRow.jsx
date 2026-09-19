import { Link } from 'react-router-dom';
import { dayOfMonth, monthShort, weekdayAndTime } from '../../utils/dates';

// One row in an events list: date block, title, time and place, category tag.
// Render inside <ul className="ev-list">.
export default function EventRow({ event }) {
  const count = event.attendeeCount ?? 0;

  return (
    <li>
      <Link to={`/events/${event._id}`} className="ev-item">
        <div className="ev-date" aria-hidden="true">
          <span className="ev-date-month">{monthShort(event.startsAt)}</span>
          <span className="ev-date-day">{dayOfMonth(event.startsAt)}</span>
        </div>
        <div className="ev-item-body">
          <h2 className="ev-item-title">{event.title}</h2>
          <p className="ev-item-meta">
            <span>{weekdayAndTime(event.startsAt)}</span>
            <span>{event.location}</span>
            {event.capacity != null ? (
              <span>{count} of {event.capacity} registered</span>
            ) : (
              count > 0 && <span>{count} registered</span>
            )}
          </p>
        </div>
        {event.category && <span className="ev-tag">{event.category}</span>}
      </Link>
    </li>
  );
}