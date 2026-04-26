import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import requireStaff from "../middleware/requireStaff.js";
import {
  getSportMembers,
  getSportMemberById,
  createSportMember,
  updateSportMember,
  deleteSportMember,
} from "../controllers/sportMemberController.js";

const router = express.Router();
router.use(authMiddleware);
router.use(requireStaff);

router.get("/", getSportMembers);
router.post("/", createSportMember);
router.get("/:id", getSportMemberById);
router.put("/:id", updateSportMember);
router.delete("/:id", deleteSportMember);

export default router;
