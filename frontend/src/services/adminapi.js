import { request } from "./api";

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:          (body)    => request("POST", "/auth/login", body),
  me:             ()        => request("GET",  "/auth/me"),
  changePassword: (body)    => request("POST", "/auth/change-password", body),
};

// ─── Blog Admin ────────────────────────────────────────────────────────────────
export const adminBlogAPI = {
  adminGetAll:    (params = "") => request("GET",    `/blog/admin/all?${params}`),
  create:         (form)    => request("POST",   "/blog", form, true),
  update:         (id, form)=> request("PUT",    `/blog/${id}`, form, true),
  delete:         (id)      => request("DELETE", `/blog/${id}`),
  togglePublish:  (id)      => request("PATCH",  `/blog/${id}/toggle`),
};

// ─── Careers Admin ─────────────────────────────────────────────────────────────
export const adminCareersAPI = {
  adminGetJobs:   ()           => request("GET",    "/careers/admin/jobs"),
  createJob:      (body)       => request("POST",   "/careers/admin/jobs", body),
  updateJob:      (id, body)   => request("PUT",    `/careers/admin/jobs/${id}`, body),
  deleteJob:      (id)         => request("DELETE", `/careers/admin/jobs/${id}`),
  toggleJob:      (id)         => request("PATCH",  `/careers/admin/jobs/${id}/toggle`),
  getApplications:      (params = "") => request("GET",    `/careers/admin/applications?${params}`),
  getApplication:       (id)          => request("GET",    `/careers/admin/applications/${id}`),
  updateApplicationStatus: (id, body) => request("PATCH",  `/careers/admin/applications/${id}/status`, body),
  deleteApplication:    (id)          => request("DELETE", `/careers/admin/applications/${id}`),
};

// ─── Contact Admin ─────────────────────────────────────────────────────────────
export const adminContactAPI = {
  getAll:  (params = "") => request("GET",    `/contact/admin/all?${params}`),
  getOne:  (id)          => request("GET",    `/contact/admin/${id}`),
  update:  (id, body)    => request("PATCH",  `/contact/admin/${id}`, body),
  delete:  (id)          => request("DELETE", `/contact/admin/${id}`),
};

// ─── Services Admin ────────────────────────────────────────────────────────────
export const adminServicesAPI = {
  adminGetAll: ()           => request("GET",    "/services/admin/all"),
  create:      (form)       => request("POST",   "/services/admin", form, true),
  update:      (id, form)   => request("PUT",    `/services/admin/${id}`, form, true),
  delete:      (id)         => request("DELETE", `/services/admin/${id}`),
  toggle:      (id)         => request("PATCH",  `/services/admin/${id}/toggle`),
  reorder:     (body)       => request("PATCH",  "/services/admin/reorder", body),
};

// ─── About Admin ───────────────────────────────────────────────────────────────
export const adminAboutAPI = {
  addTeamMember:    (form) => request("POST",   "/about/admin/team", form, true),
  updateTeamMember: (id, form) => request("PATCH",  `/about/admin/team/${id}`, form, true),
  deleteTeamMember: (id) => request("DELETE", `/about/admin/team/${id}`),
  addTestimonial:   (form) => request("POST",   "/about/admin/testimonials", form, true),
  updateTestimonial:(id, form) => request("PATCH",  `/about/admin/testimonials/${id}`, form, true),
  deleteTestimonial:(id) => request("DELETE", `/about/admin/testimonials/${id}`),
  reorder:          (body) => request("PATCH",  "/about/admin/reorder", body),
};

// ─── Compat Admin ──────────────────────────────────────────────────────────────
export const adminCompatAPI = {
  getCareersAll:    () => request("GET", "/careers/all"),
  deleteCareer:     (id) => request("DELETE", `/careers/delete/${id}`),
  deleteJob:        (id) => request("DELETE", `/jobs/delete/${id}`),
  addJob:           (body) => request("POST", "/jobs/add", body),
  updateJob:        (id, body) => request("PUT", `/jobs/update/${id}`, body),
};
