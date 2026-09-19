import api from './client';

export const listEvents = (params) => api.get('/events', { params }).then((r) => r.data);
export const getEvent = (id) => api.get(`/events/${id}`).then((r) => r.data);
export const createEvent = (data) => api.post('/events', data).then((r) => r.data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data).then((r) => r.data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);