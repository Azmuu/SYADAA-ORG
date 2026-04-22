import nodemailer from "nodemailer";

let cachedTransporter = null;
let etherealInitPromise = null;

function usesEthereal() {
  return String(process.env.MAIL_USE_ETHEREAL || "").toLowerCase() === "true";
}

function hasRealSMTP() {
  return Boolean(process.env.MAIL_HOST?.trim());
}

/** True if we can attempt to send (real SMTP or free Ethereal test inbox). */
export function isMailConfigured() {
  return hasRealSMTP() || usesEthereal();
}

async function resolveTransporter() {
  if (cachedTransporter) return cachedTransporter;

  if (hasRealSMTP()) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST.trim(),
      port: Number(process.env.MAIL_PORT || 587),
      secure: String(process.env.MAIL_SECURE || "").toLowerCase() === "true",
      auth:
        process.env.MAIL_USER && process.env.MAIL_PASS
          ? { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
          : undefined,
    });
    return cachedTransporter;
  }

  if (usesEthereal()) {
    if (!etherealInitPromise) {
      etherealInitPromise = (async () => {
        const account = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: { user: account.user, pass: account.pass },
        });
      })();
    }
    cachedTransporter = await etherealInitPromise;
    return cachedTransporter;
  }

  return null;
}

/**
 * Sends member login email. Costs $0 if:
 * - `MAIL_USE_ETHEREAL=true` (fake inbox + preview URL in server console), or
 * - your own SMTP (e.g. Gmail free tier for low volume).
 * If nothing is configured, throws MAIL_NOT_CONFIGURED (password still in admin UI + console).
 *
 * @param {{ to: string; name: string; password: string; loginUrl: string }} opts
 */
export async function sendMemberCredentialsEmail({ to, name, password, loginUrl }) {
  const tx = await resolveTransporter();
  if (!tx) {
    const err = new Error(
      "Email not configured. $0 options: set MAIL_USE_ETHEREAL=true (free test inbox), or use your own SMTP, or leave unset to use server console + admin UI only."
    );
    err.code = "MAIL_NOT_CONFIGURED";
    throw err;
  }

  const from = process.env.MAIL_FROM || process.env.MAIL_USER || "noreply@example.com";
  const displayName = name?.trim() || "Member";
  const text = `Hello ${displayName},

Your SYADA member account is ready.

Sign in here: ${loginUrl}
Email: ${to}
Password: ${password}

Keep this password private. You can use the same login page as staff; your account opens the member area.

— SYADA`;

  const info = await tx.sendMail({
    from,
    to,
    subject: "Your SYADA member login",
    text,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
  if (previewUrl) {
    console.info(`[SYADA mail] Free Ethereal preview (open in browser — no payment): ${previewUrl}`);
  }

  return { info, previewUrl };
}
