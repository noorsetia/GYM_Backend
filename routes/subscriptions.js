import express from "express";
import {
  getSubscriptions,
  getSubscription,
  getSubscriptionsByMember,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getActiveSubscriptions,
  getExpiredSubscriptions,
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All subscription routes are protected - admin only
router.use(protect);

router.get("/", getSubscriptions);
router.get("/active", getActiveSubscriptions);
router.get("/expired", getExpiredSubscriptions);
router.get("/member/:memberId", getSubscriptionsByMember);
router.get("/:id", getSubscription);
router.post("/", createSubscription);
router.put("/:id", updateSubscription);
router.delete("/:id", deleteSubscription);

export default router;
