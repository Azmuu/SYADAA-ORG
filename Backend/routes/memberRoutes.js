import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import requireStaff from "../middleware/requireStaff.js";
import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  resetPortalCredentials,
} from "../controllers/memberController.js";

const router = express.Router();
router.use(authMiddleware);
router.use(requireStaff);

router.get("/", getMembers);
router.post("/", createMember);
router.post("/:id/portal-credentials", resetPortalCredentials);
router.get("/:id", getMemberById);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

export default router;
