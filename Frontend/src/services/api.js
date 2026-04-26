/**
 * Legacy-style API helpers (fetch). Prefer importing from `lib/apiClient.js` + specific service modules.
 * Base URL matches `membersApi`, `dashboardApi`, etc.
 */
import { apiRequest, getApiBase } from "../lib/apiClient.js";

export { getApiBase };

export const memberService = {
  getAll: () => apiRequest("/members"),
  getById: (id) => apiRequest(`/members/${id}`),
  create: (data) => apiRequest("/members", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/members/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/members/${id}`, { method: "DELETE" }),
};

export const financeService = {
  getOverview: (sector) =>
    apiRequest(`/finance/overview${sector && sector !== "all" ? `?sector=${encodeURIComponent(sector)}` : ""}`),
  getTransactions: (limit = 50, sector) => {
    const p = new URLSearchParams({ limit: String(limit) });
    if (sector && sector !== "all") p.set("sector", sector);
    return apiRequest(`/finance/transactions?${p.toString()}`);
  },
};

/** @deprecated use apiRequest — kept for compatibility */
const api = {
  get: (path) => apiRequest(path),
  post: (path, body) => apiRequest(path, { method: "POST", body: JSON.stringify(body) }),
};

export default api;
