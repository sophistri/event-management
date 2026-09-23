import mongoose from 'mongoose';
import Event from '../models/Event.js';
import Attendance from '../models/Attendance.js';

// GET /api/me/events: every event the logged-in user organizes (past and upcoming)
export async function myEvents(req, res, next) {
  try {
    const events = await Event.find({ organizer: req.userId })
      .sort({ startsAt: -1 })
      .populate('organizer', 'username');
    res.json({ events });
  } catch (err) {
    next(err);
  }
}

// GET /api/me/registrations: every event the logged-in user has registered for
export async function myRegistrations(req, res, next) {
  try {
    const rows = await Attendance.find({ user: req.userId }).populate({
      path: 'event',
      populate: { path: 'organizer', select: 'username' },
    });

    const events = rows
      .map((r) => r.event)
      .filter(Boolean) // skip registrations whose event no longer exists
      .sort((a, b) => a.startsAt - b.startsAt);

    res.json({ events });
  } catch (err) {
    next(err);
  }
}

// GET /api/me/analytics: participation stats across every event the user organizes
export async function myAnalytics(req, res, next) {
  try {
    const organizerId = new mongoose.Types.ObjectId(req.userId);

    const events = await Event.find({ organizer: organizerId })
      .select('title startsAt capacity attendeeCount')
      .lean();

    if (events.length === 0) {
      return res.json({
        totals: { events: 0, registrations: 0, avgFillRate: null },
        byDay: [],
        byEvent: [],
      });
    }

    const eventIds = events.map((e) => e._id);
    const totalRegistrations = events.reduce((sum, e) => sum + (e.attendeeCount || 0), 0);

    // Fill rate only makes sense for events that set a capacity.
    const capped = events.filter((e) => e.capacity != null);
    const avgFillRate = capped.length
      ? capped.reduce((sum, e) => sum + e.attendeeCount / e.capacity, 0) / capped.length
      : null;

    // Registrations per calendar day (UTC), across all events this organizer runs.
    const byDayRows = await Attendance.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const byDay = byDayRows.map((r) => ({ date: r._id, registrations: r.count }));

    // Attendance per event, most-registered first, for a bar chart.
    const byEvent = events
      .map((e) => ({
        eventId: e._id,
        title: e.title,
        registrations: e.attendeeCount || 0,
        capacity: e.capacity,
      }))
      .sort((a, b) => b.registrations - a.registrations);

    res.json({
      totals: {
        events: events.length,
        registrations: totalRegistrations,
        avgFillRate, // 0-1, or null if no event has a capacity set
      },
      byDay,
      byEvent,
    });
  } catch (err) {
    next(err);
  }
} 