import { apiRequest } from "../lib/apiClient.js";

export const financeApi = {
  getOverview: () => apiRequest("/finance/overview"),
  getTransactions: (limit = 50) => apiRequest(`/finance/transactions?limit=${limit}`),
  createTransaction: (body) =>
    apiRequest("/finance/transactions", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
