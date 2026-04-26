import { apiRequest } from "../lib/apiClient.js";

export const sportMembersApi = {
  getAll: () => apiRequest("/sports-members"),
  getById: (id) => apiRequest(`/sports-members/${id}`),
  create: (body) =>
    apiRequest("/sports-members", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id, body) =>
    apiRequest(`/sports-members/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  /** Quick update fee payment (backend accepts body with only finance_payment_status). */
  updatePayment: (id, finance_payment_status) =>
    apiRequest(`/sports-members/${id}`, {
      method: "PUT",
      body: JSON.stringify({ finance_payment_status }),
    }),
  remove: (id) =>
    apiRequest(`/sports-members/${id}`, {
      method: "DELETE",
    }),
};
