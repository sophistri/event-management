import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../middleware/authenticate.js";
import * as ctrl from "../controllers/event.controller.js";
import * as attendance from "../controllers/attendance.controller.js";

const router = Router();

router.get("/", ctrl.listEvents);
router.get("/:id", optionalAuthenticate, ctrl.getEvent);

router.post("/", authenticate, ctrl.createEvent);
router.put("/:id", authenticate, ctrl.updateEvent);
router.delete("/:id", authenticate, ctrl.deleteEvent);

// Registration
router.post("/:id/rsvp", authenticate, attendance.rsvp);
router.delete("/:id/rsvp", authenticate, attendance.cancelRsvp);
router.get("/:id/attendees", authenticate, attendance.listAttendees);

export default router;