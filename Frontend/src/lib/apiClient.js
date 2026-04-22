/**
 * Base URL for SYADA API (must end without trailing slash; paths start with `/auth`, `/members`, …).
 *
 * - **Dev (recommended):** leave `VITE_API_URL` unset → uses `/api` so Vite proxies to Express (no CORS issues).
 * - **Cross-origin dev:** set `VITE_API_URL=http://localhost:5001/api` and ensure backend CORS allows your Vite origin.
 * - **Production:** set `VITE_API_URL` to your public API base (e.g. `https://api.example.com/api`).
 */
export const getApiBase = () => {
  const raw = import.meta.env.VITE_API_URL;
  if (raw != null && String(raw).trim() !== "") {
    return String(raw).replace(/\/$/, "");
  }
  if (import.meta.env.DEV) {
    return "/api";
  }
  return `${typeof window !== "undefined" ? window.location.origin : ""}/api`;
};

/**
 * @param {string} path - e.g. "/members" (appended to base, base should include /api)
 * @param {RequestInit & { skipAuth?: boolean }} options
 */
export async function apiRequest(path, options = {}) {
  const { skipAuth, headers: optHeaders, ...rest } = options;
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

  const body = rest.body;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const isUrlEncoded = typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams;

  const headers = { ...(optHeaders || {}) };
  if (!headers["Content-Type"] && !isFormData && !isUrlEncoded) {
    headers["Content-Type"] = "application/json";
  }
  if (token && !skipAuth) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${getApiBase()}${path}`, {
    ...rest,
    headers,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text || "Invalid response" };
  }

  if (res.status === 401 && !skipAuth) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.assign("/login");
    }
  }

  if (!res.ok) {
    const msg = data?.message || res.statusText || "Request failed";
    const hint = data?.hint ? ` ${data.hint}` : "";
    throw new Error(typeof msg === "string" ? `${msg}${hint}` : JSON.stringify(msg));
  }
  return data;
}
