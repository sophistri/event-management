import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, getEvent, updateEvent } from '../../api/events';

// <input type="datetime-local"> wants "YYYY-MM-DDTHH:mm" in local time
const toLocalInput = (iso) => {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const empty = { title: '', description: '', location: '', category: 'general', startsAt: '', endsAt: '', capacity: '' };

export default function EventFormPage() {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getEvent(id).then((ev) =>
      setForm({
        title: ev.title,
        description: ev.description || '',
        location: ev.location,
        category: ev.category || 'general',
        startsAt: toLocalInput(ev.startsAt),
        endsAt: toLocalInput(ev.endsAt),
        capacity: ev.capacity ?? '',
      })
    );
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
    <form onSubmit={handleSubmit}>
      <h1>{id ? 'Edit event' : 'New event'}</h1>
      <input placeholder="Title" value={form.title} onChange={set('title')} required />
      <textarea placeholder="Description" value={form.description} onChange={set('description')} />
      <input placeholder="Location" value={form.location} onChange={set('location')} required />
      <input placeholder="Category" value={form.category} onChange={set('category')} />
      <label>Starts <input type="datetime-local" value={form.startsAt} onChange={set('startsAt')} required /></label>
      <label>Ends <input type="datetime-local" value={form.endsAt} onChange={set('endsAt')} required /></label>
      <input type="number" min="1" placeholder="Capacity (blank = unlimited)" value={form.capacity} onChange={set('capacity')} />
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <button disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
    </form>
  );
}