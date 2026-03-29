/**
 * API Client Helper - DashUMKM
 * Centralized API calls with auto-attached auth headers.
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || `Request failed (${res.status})`);
  return data;
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || `Request failed (${res.status})`);
  return data;
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || `Request failed (${res.status})`);
  return data;
}

export async function apiDelete(path) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || `Request failed (${res.status})`);
  return data;
}

export { API_URL };
