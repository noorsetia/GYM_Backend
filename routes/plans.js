import express from "express";
import {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/planController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes - to display plans on website
router.get("/", getPlans);
router.get("/:id", getPlan);

// Protected routes - admin only
router.post("/", protect, createPlan);
router.put("/:id", protect, updatePlan);
router.delete("/:id", protect, deletePlan);

export default router;
