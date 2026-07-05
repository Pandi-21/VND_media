const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const resolveAssetUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const siteBase = BASE_URL.endsWith("/api") ? BASE_URL.slice(0, -4) : BASE_URL;
  return `${siteBase}${url}`;
};

import {
  authAPI,
  adminBlogAPI,
  adminCareersAPI,
  adminContactAPI,
  adminServicesAPI,
  adminAboutAPI,
  adminCompatAPI
} from "./adminapi";

// Re-export authAPI directly since it is fully admin-specific
export { authAPI };

// ─── Token helpers ─────────────────────────────────────────────────────────────
export const setAuthToken = (token) => {
  if (token) localStorage.setItem("vnd_admin_token", token);
  else localStorage.removeItem("vnd_admin_token");
};

export const getAuthToken = () => localStorage.getItem("vnd_admin_token");

// ─── Core fetch wrapper ────────────────────────────────────────────────────────
export const request = async (method, path, body = null, isFormData = false) => {
  const token = getAuthToken();

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const options = { method, headers };
  if (body) options.body = isFormData ? body : JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ─── Blog ──────────────────────────────────────────────────────────────────────
export const blogAPI = {
  // Public
  getAll:    (params = "") => request("GET", `/blog?${params}`),
  getBySlug: (slug)        => request("GET", `/blog/${slug}`),
  // Admin
  ...adminBlogAPI,
};

// ─── Careers ──────────────────────────────────────────────────────────────────
export const careersAPI = {
  // Public
  getJobs:   (params = "") => request("GET", `/careers/jobs?${params}`),
  getJob:    (id)          => request("GET", `/careers/jobs/${id}`),
  apply:     (form)        => request("POST", "/careers/apply", form, true),
  // Admin
  ...adminCareersAPI,
};

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contactAPI = {
  // Public
  submit: (body) => request("POST", "/contact", body),
  // Admin
  ...adminContactAPI,
};

// ─── Services ─────────────────────────────────────────────────────────────────
export const servicesAPI = {
  // Public
  getAll:    (params = "") => request("GET", `/services?${params}`),
  getBySlug: (slug)        => request("GET", `/services/${slug}`),
  // Admin
  ...adminServicesAPI,
};

// ─── About ────────────────────────────────────────────────────────────────────
export const aboutAPI = {
  // Public
  get: () => request("GET", "/about"),
  // Admin
  ...adminAboutAPI,
};

// ─── Compat Legacy Endpoints ──────────────────────────────────────────────────
export const compatAPI = {
  getJobsAll:       () => request("GET", "/jobs/all"),
  careersApply:     (form) => request("POST", "/careers/apply", form, true),
  sendEmail:        (body) => request("POST", "/send-email", body),
  // Admin
  ...adminCompatAPI,
};
