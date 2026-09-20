import Event from "../models/Event.js";
import Attendance from "../models/Attendance.js";

// GET /api/me/events: every event the logged-in user organizes (past and upcoming)
export async function myEvents(req, res, next) {
  try {
    const events = await Event.find({ organizer: req.userId })
      .sort({ startsAt: -1 })
      .populate("organizer", "username");
    res.json({ events });
  } catch (err) {
    next(err);
  }
}

// GET /api/me/registrations: every event the logged-in user has registered for
export async function myRegistrations(req, res, next) {
  try {
    const rows = await Attendance.find({ user: req.userId }).populate({
      path: "event",
      populate: { path: "organizer", select: "username" },
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