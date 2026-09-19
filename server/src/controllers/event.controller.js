import mongoose from 'mongoose';
import Event from '../models/Event.js';
import Attendance from '../models/Attendance.js';

const ALLOWED = ['title', 'description', 'location', 'category', 'startsAt', 'endsAt', 'capacity'];

// Only copy whitelisted fields so clients can't set `organizer` etc.
const pickAllowed = (body) =>
  Object.fromEntries(ALLOWED.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function handleError(err, res, next) {
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
  next(err); // falls through to the error handler in app.js
}

export async function createEvent(req, res, next) {
  try {
    const data = pickAllowed(req.body);
    if (new Date(data.endsAt) <= new Date(data.startsAt)) {
      return res.status(400).json({ error: 'endsAt must be after startsAt' });
    }
    const event = await Event.create({ ...data, organizer: req.userId });
    res.status(201).json(event);
  } catch (err) {
    handleError(err, res, next);
  }
}

export async function listEvents(req, res, next) {
  try {
    const { q, category, upcoming = 'true', page = 1, limit = 12 } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: escapeRegex(String(q)), $options: 'i' };
    if (category) filter.category = String(category);
    if (upcoming === 'true') filter.startsAt = { $gte: new Date() };

    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ startsAt: 1 })
        .skip((p - 1) * l)
        .limit(l)
        .populate('organizer', 'username'),
      Event.countDocuments(filter),
    ]);

    res.json({ events, total, page: p, pages: Math.ceil(total / l) });
  } catch (err) {
    handleError(err, res, next);
  }
}

export async function getEvent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const event = await Event.findById(req.params.id).populate('organizer', 'username');
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // req.userId is only set if the visitor is logged in (see optionalAuthenticate)
    const isRegistered = req.userId
      ? Boolean(await Attendance.exists({ event: event._id, user: req.userId }))
      : false;

    res.json({ ...event.toObject(), isRegistered });
  } catch (err) {
    handleError(err, res, next);
  }
}

export async function updateEvent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (!event.organizer.equals(req.userId)) {
      return res.status(403).json({ error: 'Not your event' });
    }

    Object.assign(event, pickAllowed(req.body));
    if (event.endsAt <= event.startsAt) {
      return res.status(400).json({ error: 'endsAt must be after startsAt' });
    }
    if (event.capacity != null && event.capacity < event.attendeeCount) {
      return res.status(400).json({
        error: `Capacity cannot be lower than the ${event.attendeeCount} people already registered`,
      });
    }
    await event.save();
    res.json(event);
  } catch (err) {
    handleError(err, res, next);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (!event.organizer.equals(req.userId)) {
      return res.status(403).json({ error: 'Not your event' });
    }
    await Attendance.deleteMany({ event: event._id });
    await event.deleteOne();
    res.status(204).end();
  } catch (err) {
    handleError(err, res, next);
  }
}