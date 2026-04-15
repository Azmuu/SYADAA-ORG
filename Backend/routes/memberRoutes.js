import express from "express";
import { getMembers, createMember } from "../controllers/memberController.js";

const router = express.Router();

// Get all members
router.get("/", getMembers);

// Add new member
router.post("/", createMember);

export default router;