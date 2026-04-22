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
  getOverview: () => apiRequest("/finance/overview"),
  getTransactions: (limit = 50) => apiRequest(`/finance/transactions?limit=${limit}`),
};

/** @deprecated use apiRequest — kept for compatibility */
const api = {
  get: (path) => apiRequest(path),
  post: (path, body) => apiRequest(path, { method: "POST", body: JSON.stringify(body) }),
};

export default api;
