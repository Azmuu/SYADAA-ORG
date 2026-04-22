/**
 * After `authMiddleware`. Only `role: "member"` may access portal member directory routes.
 */
export default function requireMember(req, res, next) {
  if (req.user?.role !== "member") {
    return res.status(403).json({ message: "Member portal only." });
  }
  next();
}
