import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { myEvents, myRegistrations, myAnalytics } from "../controllers/me.controller.js";

const router = Router();

router.get("/events", authenticate, myEvents);
router.get("/registrations", authenticate, myRegistrations);
router.get("/analytics", authenticate, myAnalytics);

export default router;