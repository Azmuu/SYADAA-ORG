import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import requireMember from "../middleware/requireMember.js";
import { listMembersForPortal } from "../controllers/portalMemberController.js";

const router = express.Router();
router.use(authMiddleware);
router.use(requireMember);

router.get("/members", listMembersForPortal);

export default router;
