import api from './client';

export const listEvents = (params) => api.get('/events', { params }).then((r) => r.data);
export const getEvent = (id) => api.get(`/events/${id}`).then((r) => r.data);
export const createEvent = (data) => api.post('/events', data).then((r) => r.data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data).then((r) => r.data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Registration. rsvp / cancelRsvp resolve to { attendeeCount, isRegistered }.
export const rsvp = (id) => api.post(`/events/${id}/rsvp`).then((r) => r.data);
export const cancelRsvp = (id) => api.delete(`/events/${id}/rsvp`).then((r) => r.data);

// Organizer only. Resolves to an array of { _id, name, username, registeredAt }.
export const listAttendees = (id) => api.get(`/events/${id}/attendees`).then((r) => r.data.attendees);

// Dashboards. Both resolve to { events: [...] }.
export const myEvents = () => api.get("/me/events").then((r) => r.data);
export const myRegistrations = () => api.get("/me/registrations").then((r) => r.data);