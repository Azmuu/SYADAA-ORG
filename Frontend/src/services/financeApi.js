import { apiRequest } from "../lib/apiClient.js";

/** @param {"members"|"sports"|"all"} sector */
function overviewQuery(sector) {
  if (!sector || sector === "all") return "";
  return `?sector=${encodeURIComponent(sector)}`;
}

/** @param {number} limit @param {"members"|"sports"|"all"} sector */
function transactionsQuery(limit, sector) {
  const p = new URLSearchParams();
  p.set("limit", String(limit));
  if (sector && sector !== "all") p.set("sector", sector);
  return `?${p.toString()}`;
}

export const financeApi = {
  getOverview: (sector = "all") => apiRequest(`/finance/overview${overviewQuery(sector)}`),
  getTransactions: (limit = 50, sector = "all") => apiRequest(`/finance/transactions${transactionsQuery(limit, sector)}`),
  createTransaction: (body) =>
    apiRequest("/finance/transactions", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
