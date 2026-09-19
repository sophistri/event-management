import mongoose from "mongoose";
import Event from "../models/Event.js";
import Attendance from "../models/Attendance.js";

const notFound = (res) => res.status(404).json({ error: "Event not found" });

// POST /api/events/:id/rsvp  (login required)
export async function rsvp(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return notFound(res);

    // 1. Record the registration. The unique (event, user) index rejects duplicates.
    try {
      await Attendance.create({ event: id, user: req.userId });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "You are already registered for this event" });
      }
      throw err;
    }

    // 2. Claim a spot. This single atomic update only succeeds if the event exists,
    //    has not started, and still has room, so two people cannot both take the last spot.
    const event = await Event.findOneAndUpdate(
      {
        _id: id,
        startsAt: { $gt: new Date() },
        $or: [
          { capacity: null },
          { $expr: { $lt: [{ $ifNull: ["$attendeeCount", 0] }, "$capacity"] } },
        ],
      },
      { $inc: { attendeeCount: 1 } },
      { new: true }
    );

    if (!event) {
      // No spot claimed: undo step 1, then report why.
      await Attendance.deleteOne({ event: id, user: req.userId });
      const existing = await Event.findById(id).select("startsAt");
      if (!existing) return notFound(res);
      if (existing.startsAt <= new Date()) {
        return res.status(400).json({ error: "Registration is closed because this event has started" });
      }
      return res.status(409).json({ error: "This event is full" });
    }

    res.status(201).json({ attendeeCount: event.attendeeCount, isRegistered: true });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/events/:id/rsvp  (login required)
export async function cancelRsvp(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return notFound(res);

    const removed = await Attendance.findOneAndDelete({ event: id, user: req.userId });
    if (!removed) {
      return res.status(404).json({ error: "You are not registered for this event" });
    }

    const event = await Event.findOneAndUpdate(
      { _id: id, attendeeCount: { $gt: 0 } },
      { $inc: { attendeeCount: -1 } },
      { new: true }
    );

    res.json({ attendeeCount: event ? event.attendeeCount : 0, isRegistered: false });
  } catch (err) {
    next(err);
  }
}

// GET /api/events/:id/attendees  (organizer only)
export async function listAttendees(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return notFound(res);

    const event = await Event.findById(id).select("organizer");
    if (!event) return notFound(res);
    if (!event.organizer.equals(req.userId)) {
      return res.status(403).json({ error: "Only the organizer can see who registered" });
    }

    const rows = await Attendance.find({ event: id })
      .sort({ createdAt: 1 })
      .populate("user", "name username");

    const attendees = rows
      .filter((r) => r.user) // skip anyone whose account no longer exists
      .map((r) => ({
        _id: r.user._id,
        name: r.user.name,
        username: r.user.username,
        registeredAt: r.createdAt,
      }));

    res.json({ attendees });
  } catch (err) {
    next(err);
  }
}