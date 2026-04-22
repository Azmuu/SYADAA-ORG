import { apiRequest } from "../lib/apiClient.js";

/**
 * Login uses form encoding so Express `urlencoded` always fills `req.body`
 * (avoids empty JSON body issues with proxies / strict JSON parsers).
 */
export async function login(email, password) {
  const body = new URLSearchParams();
  body.set("email", email ?? "");
  body.set("password", password ?? "");
  return apiRequest("/auth/login", {
    method: "POST",
    body,
    skipAuth: true,
  });
}
