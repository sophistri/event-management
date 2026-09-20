import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { myEvents, myRegistrations } from "../controllers/me.controller.js";

const router = Router();

router.get("/events", authenticate, myEvents);
router.get("/registrations", authenticate, myRegistrations);

export default router;