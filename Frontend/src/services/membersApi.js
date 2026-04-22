import { apiRequest } from "../lib/apiClient.js";

export const membersApi = {
  getAll: () => apiRequest("/members"),
  getById: (id) => apiRequest(`/members/${id}`),
  create: (body) =>
    apiRequest("/members", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id, body) =>
    apiRequest(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  remove: (id) =>
    apiRequest(`/members/${id}`, {
      method: "DELETE",
    }),
  /** Regenerates portal password, emails member, returns new password once (staff). */
  resetPortalCredentials: (id) =>
    apiRequest(`/members/${id}/portal-credentials`, {
      method: "POST",
    }),
};
