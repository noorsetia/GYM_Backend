import express from "express";
import {
  getContacts,
  getContact,
  createContact,
  markContactAsRead,
  markContactAsReplied,
  deleteContact,
  getUnreadContacts,
} from "../controllers/contactController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public route - for contact form submission
router.post("/", createContact);

// Protected routes - admin only
router.get("/", protect, getContacts);
router.get("/unread", protect, getUnreadContacts);
router.get("/:id", protect, getContact);
router.put("/:id/read", protect, markContactAsRead);
router.put("/:id/replied", protect, markContactAsReplied);
router.delete("/:id", protect, deleteContact);

export default router;
