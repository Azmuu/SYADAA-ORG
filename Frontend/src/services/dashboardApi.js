import { apiRequest } from "../lib/apiClient.js";

export const dashboardApi = {
  getSummary: () => apiRequest("/dashboard/summary"),
};
