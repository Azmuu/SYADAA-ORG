import { apiRequest } from "../lib/apiClient.js";

/**
 * Member portal (role `member` only). Directory excludes finance fields.
 * @param {{ search?: string; blood?: string }} params
 */
export function getPortalMembers(params = {}) {
  const qs = new URLSearchParams();
  if (params.search?.trim()) qs.set("search", params.search.trim());
  if (params.blood?.trim()) qs.set("blood", params.blood.trim());
  const q = qs.toString();
  return apiRequest(`/portal/members${q ? `?${q}` : ""}`);
}
