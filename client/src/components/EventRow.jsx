import { Link } from 'react-router-dom';
import { dayOfMonth, weekdayAndTime, monthShort } from '../../utils/dates';

// One row in an events list: date block, title, time and place, category tag.
// Render inside <ul className="ev-list">.
export default function EventRow({ event }) {
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
          </p>
        </div>
        {event.category && <span className="ev-tag">{event.category}</span>}
      </Link>
    </li>
  );
}