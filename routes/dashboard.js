import express from "express";
import {
  getDashboardStats,
  getRevenueStats,
  getMemberGrowthStats,
} from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All dashboard routes are protected - admin only
router.use(protect);

router.get("/stats", getDashboardStats);
router.get("/revenue", getRevenueStats);
router.get("/member-growth", getMemberGrowthStats);

export default router;
