import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createEvent, getEvent, updateEvent } from '../../api/events';

// <input type="datetime-local"> wants "YYYY-MM-DDTHH:mm" in local time
const toLocalInput = (iso) => {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const empty = {
  title: '',
  description: '',
  location: '',
  category: 'general',
  startsAt: '',
  endsAt: '',
  capacity: '',
};

export default function EventFormPage() {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEvent(id)
      .then((ev) =>
        setForm({
          title: ev.title,
          description: ev.description || '',
          location: ev.location,
          category: ev.category || 'general',
          startsAt: toLocalInput(ev.startsAt),
          endsAt: toLocalInput(ev.endsAt),
          capacity: ev.capacity ?? '',
        })
      )
      .catch((e) => setError(e.response?.data?.error || 'Could not load this event'));
  }, [id]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      ...form,
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: new Date(form.endsAt).toISOString(),
      capacity: form.capacity === '' ? null : Number(form.capacity),
    };
    try {
      const saved = id ? await updateEvent(id, payload) : await createEvent(payload);
      navigate(`/events/${saved._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1>{id ? 'Edit event' : 'New event'}</h1>

      <form className="ev-form" onSubmit={handleSubmit}>
        <div className="ev-field">
          <label htmlFor="title">Title</label>
          <input id="title" className="ev-input" value={form.title} onChange={set('title')} required maxLength={120} />
        </div>

        <div className="ev-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" className="ev-input" value={form.description} onChange={set('description')} />
        </div>

        <div className="ev-field">
          <label htmlFor="location">Location</label>
          <input id="location" className="ev-input" value={form.location} onChange={set('location')} required />
        </div>

        <div className="ev-row">
          <div className="ev-field">
            <label htmlFor="startsAt">Starts</label>
            <input id="startsAt" type="datetime-local" className="ev-input" value={form.startsAt} onChange={set('startsAt')} required />
          </div>
          <div className="ev-field">
            <label htmlFor="endsAt">Ends</label>
            <input id="endsAt" type="datetime-local" className="ev-input" value={form.endsAt} onChange={set('endsAt')} required />
          </div>
        </div>

        <div className="ev-row">
          <div className="ev-field">
            <label htmlFor="category">Category</label>
            <input id="category" className="ev-input" value={form.category} onChange={set('category')} />
          </div>
          <div className="ev-field">
            <label htmlFor="capacity">
              Capacity <span className="ev-hint">(blank for no limit)</span>
            </label>
            <input id="capacity" type="number" min="1" className="ev-input" value={form.capacity} onChange={set('capacity')} />
          </div>
        </div>

        {error && <p className="ev-error">{error}</p>}

        <div className="ev-form-actions">
          <button type="submit" className="ev-btn" disabled={saving}>
            {saving ? 'Saving...' : id ? 'Save changes' : 'Create event'}
          </button>
          <Link to={id ? `/events/${id}` : '/events'} className="ev-btn ev-btn--secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}