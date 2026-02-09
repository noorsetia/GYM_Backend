import express from "express";
import {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/memberController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public route - for "Join Now" button
router.post("/", createMember);

// Protected routes - admin only
router.get("/", protect, getMembers);
router.get("/:id", protect, getMember);
router.put("/:id", protect, updateMember);
router.delete("/:id", protect, deleteMember);

export default router;
