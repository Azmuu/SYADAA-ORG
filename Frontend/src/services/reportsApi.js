import { apiRequest } from "../lib/apiClient.js";

export const reportsApi = {
  getAll: () => apiRequest("/reports"),
  getComposePreview: () => apiRequest("/reports/compose-preview"),
  getActivityFeed: () => apiRequest("/reports/activity-feed"),
  create: (body) =>
    apiRequest("/reports", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  remove: (id) =>
    apiRequest(`/reports/${id}`, {
      method: "DELETE",
    }),
};
