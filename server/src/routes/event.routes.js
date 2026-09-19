import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import * as ctrl from "../controllers/event.controller.js";

const router = Router();

router.get("/", ctrl.listEvents);
router.get("/:id", ctrl.getEvent);

router.post("/", authenticate, ctrl.createEvent);
router.put("/:id", authenticate, ctrl.updateEvent);
router.delete("/:id", authenticate, ctrl.deleteEvent);

export default router;