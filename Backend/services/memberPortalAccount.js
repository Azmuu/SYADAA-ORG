import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateHumanReadablePassword } from "./generateHumanPassword.js";

/**
 * Creates or updates a `User` with role `member` for directory login.
 * @param {{ email: string; fullName: string }} param0
 * @param {import('mongoose').ClientSession | null} session
 * @returns {Promise<{ plainPassword: string; created: boolean }>}
 */
export async function provisionMemberPortalUser({ email, fullName }, session) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) {
    const e = new Error("Member email is required to create a login.");
    e.code = "EMAIL_REQUIRED";
    throw e;
  }

  const existing = await User.findOne({ email: normalized }).session(session ?? null);
  if (existing && existing.role !== "member") {
    const e = new Error("This email is already used by a staff account. Use a different email.");
    e.code = "EMAIL_STAFF_CONFLICT";
    throw e;
  }

  const plainPassword = generateHumanReadablePassword();
  const hash = await bcrypt.hash(plainPassword, 10);

  if (existing && existing.role === "member") {
    existing.password = hash;
    existing.full_name = fullName?.trim() || existing.full_name;
    await existing.save({ session: session ?? undefined });
    return { plainPassword, created: false };
  }

  await User.create([{ email: normalized, password: hash, full_name: fullName?.trim() || "", role: "member" }], {
    session: session ?? undefined,
  });
  return { plainPassword, created: true };
}
