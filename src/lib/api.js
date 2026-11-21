"use client";

import { authClient } from "@/lib/auth-client";

const BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

let cached = { token: null, expires: 0 };

export const clearToken = () => {
  cached = { token: null, expires: 0 };
};

async function getToken(force) {
  if (!force && cached.token && Date.now() < cached.expires) return cached.token;
  const { data } = await authClient.token();
  if (!data?.token) throw new ApiError(401, "Please sign in to continue");
  cached = { token: data.token, expires: Date.now() + 10 * 60 * 1000 };
  return cached.token;
}

async function send(path, { method = "GET", body, token } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Check your connection and try again.");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json.message || "Request failed");
  return json;
}

export async function api(path, options = {}) {
  try {
    return await send(path, { ...options, token: await getToken(false) });
  } catch (err) {
    if (err.status === 401) return send(path, { ...options, token: await getToken(true) });
    throw err;
  }
}

export const publicApi = (path) => send(path);

export async function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json.message || "Image upload failed");
  return json.url;
}
