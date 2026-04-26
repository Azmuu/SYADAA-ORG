import mongoose from "mongoose";
import Member from "../models/Member.js";
import User from "../models/User.js";
import { provisionMemberPortalUser } from "../services/memberPortalAccount.js";
import { sendMemberCredentialsEmail, isMailConfigured } from "../services/mailService.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];
const STATUSES = ["active", "pending", "inactive"];
const FINANCE_SECTIONS = ["none", "members", "sports"];
const PAYMENT_STATUSES = ["unpaid", "partial", "paid"];

function loginPageUrl() {
  const direct = (process.env.FRONTEND_LOGIN_URL || "").trim();
  if (direct) return direct;
  const base = (process.env.PUBLIC_APP_URL || "").trim().replace(/\/$/, "");
  if (base) return `${base}/login`;
  return "http://localhost:5173/login";
}

/** Prints password in the Node.js terminal when there is no real SMTP (or when LOG_PORTAL_PASSWORD=1). Set LOG_PORTAL_PASSWORD=0 to disable. */
function logPortalPasswordToConsole(context, email, plainPassword, loginUrl, { emailSent, mailError } = {}) {
  if (process.env.LOG_PORTAL_PASSWORD === "0") return;
  const mailOn = isMailConfigured();
  if (mailOn && emailSent && process.env.LOG_PORTAL_PASSWORD !== "1") return;

  const lines = [
    `[SYADA portal] ${context}`,
    `  Email: ${email}`,
    `  Password: ${plainPassword}`,
    `  Login: ${loginUrl}`,
  ];
  if (!mailOn) {
    lines.push("  (No MAIL_HOST — not sending email; use this password from the terminal.)");
  } else if (!emailSent && mailError) {
    lines.push(`  (Email failed: ${mailError})`);
  } else if (mailOn && process.env.LOG_PORTAL_PASSWORD === "1") {
    lines.push("  (LOG_PORTAL_PASSWORD=1 — logging even though email was sent.)");
  }
  console.info(`\n${lines.join("\n")}\n`);
}

function parseFinanceFlag(v) {
  if (v === true || v === 1) return true;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true" || s === "1" || s === "yes" || s === "on") return true;
    return false;
  }
  return false;
}

function sanitizeMemberForCreate(raw) {
  const b = raw && typeof raw === "object" ? raw : {};
  const isFinance = parseFinanceFlag(b.is_finance_member);

  const blood =
    typeof b.blood_type === "string" && BLOOD.includes(b.blood_type) ? b.blood_type : "Unknown";
  const status =
    typeof b.status === "string" && STATUSES.includes(b.status) ? b.status : "active";

  let joined = b.joined_date ? new Date(b.joined_date) : new Date();
  if (Number.isNaN(joined.getTime())) joined = new Date();

  const out = {
    name: String(b.name ?? "").trim(),
    email: String(b.email ?? "")
      .trim()
      .toLowerCase(),
    phone: String(b.phone ?? "").trim(),
    address: String(b.address ?? "").trim(),
    picture: typeof b.picture === "string" ? b.picture.trim() : "",
    blood_type: blood,
    title: String(b.title ?? "").trim(),
    is_finance_member: isFinance,
    program: String(b.program ?? "").trim(),
    joined_date: joined,
    status,
  };

  if (isFinance) {
    let fee = null;
    const fr = b.finance_monthly_fee;
    if (fr != null && fr !== "") {
      const n = Number(fr);
      if (Number.isFinite(n)) fee = n;
    }
    out.finance_monthly_fee = fee;
    out.finance_payment_method = String(b.finance_payment_method ?? "").trim();
    out.finance_account_ref = String(b.finance_account_ref ?? "").trim();
    out.finance_notes = String(b.finance_notes ?? "").trim();
    const sec =
      typeof b.finance_section === "string" && ["members", "sports"].includes(b.finance_section)
        ? b.finance_section
        : "members";
    out.finance_section = sec;
    const ps =
      typeof b.finance_payment_status === "string" && PAYMENT_STATUSES.includes(b.finance_payment_status)
        ? b.finance_payment_status
        : "unpaid";
    out.finance_payment_status = ps;
  } else {
    out.finance_monthly_fee = null;
    out.finance_payment_method = "";
    out.finance_account_ref = "";
    out.finance_notes = "";
    out.finance_section = "none";
    out.finance_payment_status = "unpaid";
  }

  return out;
}

function formatMongooseError(e) {
  if (e.name === "ValidationError" && e.errors) {
    const first = Object.values(e.errors)[0];
    if (first?.message) return first.message;
  }
  if (e.code === 11000) {
    return "That email is already used by another login. Use a different email or remove the old account.";
  }
  return e.message || "Could not save member.";
}

export const getMembers = async (req, res) => {
  try {
    const data = await Member.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid id" });
    const doc = await Member.findById(id);
    if (!doc) return res.status(404).json({ message: "Member not found" });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const createMember = async (req, res) => {
  try {
    const body = sanitizeMemberForCreate(req.body);
    const emailTrim = body.email;

    if (!emailTrim) {
      return res.status(400).json({
        message:
          "Email is required. A member portal account is created automatically and login details are sent to this email.",
      });
    }
    if (!body.name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const savedMember = await Member.create(body);
    let portalResult;
    try {
      portalResult = await provisionMemberPortalUser(
        { email: emailTrim, fullName: body.name },
        null
      );
    } catch (e) {
      await Member.findByIdAndDelete(savedMember._id);
      throw e;
    }

    const loginUrl = loginPageUrl();
    let emailSent = false;
    let mailError = null;
    let etherealPreviewUrl;
    try {
      const sent = await sendMemberCredentialsEmail({
        to: emailTrim,
        name: body.name || "",
        password: portalResult.plainPassword,
        loginUrl,
      });
      emailSent = true;
      etherealPreviewUrl = sent?.previewUrl;
    } catch (err) {
      mailError = err.message || String(err);
    }

    logPortalPasswordToConsole("New member registered", emailTrim, portalResult.plainPassword, loginUrl, {
      emailSent,
      mailError,
    });

    const obj = savedMember.toObject();
    res.status(201).json({
      ...obj,
      portal: {
        loginCreated: true,
        emailSent,
        mailError: emailSent ? undefined : mailError,
        temporaryPassword: emailSent ? undefined : portalResult.plainPassword,
        loginUrl,
        etherealPreviewUrl,
      },
    });
  } catch (e) {
    if (e.code === "EMAIL_STAFF_CONFLICT" || e.code === "EMAIL_REQUIRED") {
      return res.status(400).json({ message: e.message });
    }
    return res.status(400).json({ message: formatMongooseError(e) });
  }
};

export const resetPortalCredentials = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid id" });
    const member = await Member.findById(id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    const emailTrim = member.email?.trim();
    if (!emailTrim) {
      return res.status(400).json({
        message: "Member has no email. Add one on Edit member, then generate credentials.",
      });
    }

    const portalResult = await provisionMemberPortalUser(
      { email: emailTrim, fullName: member.name },
      null
    );

    const loginUrl = loginPageUrl();
    let emailSent = false;
    let mailError = null;
    let etherealPreviewUrl;
    try {
      const sent = await sendMemberCredentialsEmail({
        to: emailTrim.toLowerCase(),
        name: member.name || "",
        password: portalResult.plainPassword,
        loginUrl,
      });
      emailSent = true;
      etherealPreviewUrl = sent?.previewUrl;
    } catch (err) {
      mailError = err.message || String(err);
    }

    logPortalPasswordToConsole(
      "Portal credentials reset (member detail)",
      emailTrim.toLowerCase(),
      portalResult.plainPassword,
      loginUrl,
      { emailSent, mailError }
    );

    res.json({
      emailSent,
      mailError: emailSent ? undefined : mailError,
      temporaryPassword: portalResult.plainPassword,
      loginUrl,
      etherealPreviewUrl,
    });
  } catch (e) {
    if (e.code === "EMAIL_STAFF_CONFLICT" || e.code === "EMAIL_REQUIRED") {
      return res.status(400).json({ message: e.message });
    }
    return res.status(400).json({ message: formatMongooseError(e) });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid id" });
    const existing = await Member.findById(id);
    if (!existing) return res.status(404).json({ message: "Member not found" });

    const body = { ...req.body };
    const hasFinanceFlag = Object.prototype.hasOwnProperty.call(body, "is_finance_member");
    if (hasFinanceFlag) {
      body.is_finance_member = parseFinanceFlag(body.is_finance_member);
    } else {
      delete body.is_finance_member;
    }

    const isFin = hasFinanceFlag ? Boolean(body.is_finance_member) : Boolean(existing.is_finance_member);

    if (hasFinanceFlag && !body.is_finance_member) {
      body.finance_monthly_fee = null;
      body.finance_payment_method = "";
      body.finance_account_ref = "";
      body.finance_notes = "";
      body.finance_section = "none";
      body.finance_payment_status = "unpaid";
    } else if (isFin) {
      if (Object.prototype.hasOwnProperty.call(body, "finance_monthly_fee")) {
        const fr = body.finance_monthly_fee;
        if (fr == null || fr === "") {
          body.finance_monthly_fee = null;
        } else {
          const n = Number(fr);
          body.finance_monthly_fee = Number.isFinite(n) ? n : null;
        }
      }
      if (Object.prototype.hasOwnProperty.call(body, "finance_section")) {
        const sec =
          typeof body.finance_section === "string" && FINANCE_SECTIONS.includes(body.finance_section)
            ? body.finance_section
            : "members";
        body.finance_section = sec === "none" ? "members" : sec;
      }
      if (Object.prototype.hasOwnProperty.call(body, "finance_payment_status")) {
        const ps =
          typeof body.finance_payment_status === "string" && PAYMENT_STATUSES.includes(body.finance_payment_status)
            ? body.finance_payment_status
            : existing.finance_payment_status || "unpaid";
        body.finance_payment_status = ps;
      }
    }

    if (body.email === "") body.email = "";

    if (!isFin && !hasFinanceFlag) {
      delete body.finance_monthly_fee;
      delete body.finance_payment_status;
      delete body.finance_section;
      delete body.finance_payment_method;
      delete body.finance_account_ref;
      delete body.finance_notes;
    }

    const data = await Member.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!data) return res.status(404).json({ message: "Member not found" });
    res.json(data);
  } catch (e) {
    res.status(400).json({ message: formatMongooseError(e) });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "Invalid id" });
    const doc = await Member.findById(id);
    if (!doc) return res.status(404).json({ message: "Member not found" });
    const email = doc.email?.trim().toLowerCase();
    await Member.findByIdAndDelete(id);
    if (email) {
      await User.deleteOne({ email, role: "member" });
    }
    res.json({ message: "Deleted", id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
