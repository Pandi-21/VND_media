/**
 * api.js — Drop this into your React frontend src/services/api.js
 * 
 * Usage:
 *   import api, { setAuthToken } from "./services/api";
 *   const res = await api.get("/blog");
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Token helpers ─────────────────────────────────────────────────────────────
export const setAuthToken = (token) => {
  if (token) localStorage.setItem("adminToken", token);
  else localStorage.removeItem("adminToken");
};

export const getAuthToken = () => localStorage.getItem("adminToken");

// ─── Core fetch wrapper ────────────────────────────────────────────────────────
const request = async (method, path, body = null, isFormData = false) => {
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

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:          (body)    => request("POST", "/auth/login", body),
  me:             ()        => request("GET",  "/auth/me"),
  changePassword: (body)    => request("POST", "/auth/change-password", body),
};

// ─── Blog ──────────────────────────────────────────────────────────────────────
export const blogAPI = {
  // Public
  getAll:    (params = "") => request("GET", `/blog?${params}`),
  getBySlug: (slug)        => request("GET", `/blog/${slug}`),
  // Admin
  adminGetAll:    ()        => request("GET",    "/blog/admin/all"),
  create:         (form)    => request("POST",   "/blog", form, true),
  update:         (id, form)=> request("PUT",    `/blog/${id}`, form, true),
  delete:         (id)      => request("DELETE", `/blog/${id}`),
  togglePublish:  (id)      => request("PATCH",  `/blog/${id}/toggle`),
};

// ─── Careers ──────────────────────────────────────────────────────────────────
export const careersAPI = {
  // Public
  getJobs:   (params = "") => request("GET", `/careers/jobs?${params}`),
  getJob:    (id)          => request("GET", `/careers/jobs/${id}`),
  apply:     (form)        => request("POST", "/careers/apply", form, true),
  // Admin — Jobs
  adminGetJobs:   ()           => request("GET",    "/careers/admin/jobs"),
  createJob:      (body)       => request("POST",   "/careers/admin/jobs", body),
  updateJob:      (id, body)   => request("PUT",    `/careers/admin/jobs/${id}`, body),
  deleteJob:      (id)         => request("DELETE", `/careers/admin/jobs/${id}`),
  toggleJob:      (id)         => request("PATCH",  `/careers/admin/jobs/${id}/toggle`),
  // Admin — Applications
  getApplications:      (params = "") => request("GET",    `/careers/admin/applications?${params}`),
  getApplication:       (id)          => request("GET",    `/careers/admin/applications/${id}`),
  updateApplicationStatus: (id, body) => request("PATCH",  `/careers/admin/applications/${id}/status`, body),
  deleteApplication:    (id)          => request("DELETE", `/careers/admin/applications/${id}`),
};

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contactAPI = {
  // Public
  submit: (body) => request("POST", "/contact", body),
  // Admin
  getAll:  (params = "") => request("GET",    `/contact/admin/all?${params}`),
  getOne:  (id)          => request("GET",    `/contact/admin/${id}`),
  update:  (id, body)    => request("PATCH",  `/contact/admin/${id}`, body),
  delete:  (id)          => request("DELETE", `/contact/admin/${id}`),
};

// ─── Services ─────────────────────────────────────────────────────────────────
export const servicesAPI = {
  // Public
  getAll:    (params = "") => request("GET", `/services?${params}`),
  getBySlug: (slug)        => request("GET", `/services/${slug}`),
  // Admin
  adminGetAll: ()           => request("GET",    "/services/admin/all"),
  create:      (form)       => request("POST",   "/services/admin", form, true),
  update:      (id, form)   => request("PUT",    `/services/admin/${id}`, form, true),
  delete:      (id)         => request("DELETE", `/services/admin/${id}`),
  toggle:      (id)         => request("PATCH",  `/services/admin/${id}/toggle`),
  reorder:     (body)       => request("PATCH",  "/services/admin/reorder", body),
};