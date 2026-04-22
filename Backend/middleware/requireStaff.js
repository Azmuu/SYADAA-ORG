const STAFF_ROLES = new Set(["super_admin", "manager", "editor"]);

/**
 * After `authMiddleware`, allows only staff (not `member` portal accounts).
 */
export default function requireStaff(req, res, next) {
  const role = req.user?.role;
  if (!role || !STAFF_ROLES.has(role)) {
    return res.status(403).json({ message: "Staff access required." });
  }
  next();
}
