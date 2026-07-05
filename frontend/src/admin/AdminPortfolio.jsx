import React, { useEffect, useState } from "react";
import { projectAPI, reviewAPI, resolveAssetUrl } from "../services/api";

const PROJECT_CATEGORIES = [
  "Performance Marketing",
  "Tech Development",
  "Visual Identity",
  "Consulting"
];

// ─── PROJECTS MODAL ───────────────────────────────────────────────────────────
function ProjectModal({ project, onClose, onSaved }) {
  const editing = !!project?._id;
  const [form, setForm] = useState({
    title:       project?.title       || "",
    description: project?.description || "",
    category:    project?.category    || PROJECT_CATEGORIES[0],
    link:        project?.link        || "",
    order:       project?.order       || 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    project?.image ? resolveAssetUrl(project.image) : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.category.trim()) {
      setError("Title, description and category are required.");
      return;
    }
    if (!editing && !imageFile) {
      setError("Please select a project image.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        fd.append(k, v);
      });
      if (imageFile) {
        fd.append("image", imageFile);
      }

      const data = editing
        ? await projectAPI.update(project._id, fd)
        : await projectAPI.create(fd);

      if (data.success && data.project) {
        onSaved(data.project);
      } else {
        setError("Failed to save project.");
      }
    } catch (err) {
      setError(err.message || "Failed to save project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 overflow-hidden flex flex-col bg-[#111] max-h-[90vh]">
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/10">
          <h2 className="text-white font-extrabold italic text-lg tracking-wide">
            {editing ? "EDIT PROJECT" : "NEW PROJECT"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-7 py-6 space-y-5">
          {error && (
            <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-bold tracking-widest uppercase">Title *</label>
              <input
                value={form.title}
                onChange={set("title")}
                placeholder="Project title..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-bold tracking-widest uppercase">Category *</label>
              <select
                value={form.category}
                onChange={set("category")}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
              >
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-bold tracking-widest uppercase">Description *</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={3}
              placeholder="Project description..."
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-bold tracking-widest uppercase">Live Link (Optional)</label>
              <input
                value={form.link}
                onChange={set("link")}
                placeholder="https://example.com..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-bold tracking-widest uppercase">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={set("order")}
                placeholder="0"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2 font-bold tracking-widest uppercase">Project Cover Image *</label>
            <div className="flex gap-4 items-center">
              {imagePreview && (
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] flex-shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-grow">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="project-image-upload"
                />
                <label
                  htmlFor="project-image-upload"
                  className="inline-flex cursor-pointer rounded-xl border border-white/10 bg-[#0a0a0a] px-5 py-3 text-xs font-bold tracking-wider hover:border-[#0BB80F]/40 transition-all text-white"
                >
                  SELECT FILE
                </label>
                <p className="text-[10px] text-gray-500 mt-2">JPG, PNG, WEBP or GIF. Max 5MB.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 px-6 py-3 text-xs font-bold tracking-wider hover:bg-white/5 transition"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#0BB80F] text-black px-6 py-3 text-xs font-black tracking-widest hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? "SAVING..." : "SAVE PROJECT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── REVIEWS MODAL ────────────────────────────────────────────────────────────
function ReviewModal({ review, onClose, onSaved }) {
  const editing = !!review?._id;
  const [form, setForm] = useState({
    name:  review?.name  || "",
    role:  review?.role  || "",
    text:  review?.text  || "",
    stars: review?.stars || 5,
    order: review?.order || 0,
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    review?.avatar ? resolveAssetUrl(review.avatar) : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim() || !form.text.trim()) {
      setError("Name, designation and review text are required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        fd.append(k, v);
      });
      if (avatarFile) {
        fd.append("avatar", avatarFile);
      }

      const data = editing
        ? await reviewAPI.update(review._id, fd)
        : await reviewAPI.create(fd);

      if (data.success && data.review) {
        onSaved(data.review);
      } else {
        setError("Failed to save review.");
      }
    } catch (err) {
      setError(err.message || "Failed to save review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 overflow-hidden flex flex-col bg-[#111] max-h-[90vh]">
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/10">
          <h2 className="text-white font-extrabold italic text-lg tracking-wide">
            {editing ? "EDIT REVIEW" : "NEW REVIEW"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-7 py-6 space-y-5">
          {error && (
            <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-bold tracking-widest uppercase">Client Name *</label>
              <input
                value={form.name}
                onChange={set("name")}
                placeholder="Client name..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-bold tracking-widest uppercase">Role / Company *</label>
              <input
                value={form.role}
                onChange={set("role")}
                placeholder="Role (e.g. CEO, TechFlow)..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-bold tracking-widest uppercase">Review Content *</label>
            <textarea
              value={form.text}
              onChange={set("text")}
              rows={4}
              placeholder="Enter review description..."
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-bold tracking-widest uppercase">Stars Rating</label>
              <select
                value={form.stars}
                onChange={set("stars")}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
              >
                {[5, 4, 3, 2, 1].map((s) => (
                  <option key={s} value={s}>{s} Stars</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-bold tracking-widest uppercase">Display Order</label>
              <input
                type="number"
                value={form.order}
                onChange={set("order")}
                placeholder="0"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2 font-bold tracking-widest uppercase">Client Avatar / Photo (Optional)</label>
            <div className="flex gap-4 items-center">
              {avatarPreview && (
                <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-[#0a0a0a] flex-shrink-0">
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-grow">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-image-upload"
                />
                <label
                  htmlFor="avatar-image-upload"
                  className="inline-flex cursor-pointer rounded-xl border border-white/10 bg-[#0a0a0a] px-5 py-3 text-xs font-bold tracking-wider hover:border-[#0BB80F]/40 transition-all text-white"
                >
                  SELECT PHOTO
                </label>
                <p className="text-[10px] text-gray-500 mt-2">JPG, PNG or WEBP. Max 5MB.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-5 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 px-6 py-3 text-xs font-bold tracking-wider hover:bg-white/5 transition"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#0BB80F] text-black px-6 py-3 text-xs font-black tracking-widest hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? "SAVING..." : "SAVE REVIEW"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── MAIN PORTFOLIO COMPONENT ────────────────────────────────────────────────
export default function AdminPortfolio() {
  const [activeTab, setActiveTab] = useState("projects");
  
  // Projects states
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");
  const [projectModalItem, setProjectModalItem] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Fetch functions
  const fetchProjects = async () => {
    setProjectsLoading(true);
    setProjectsError("");
    try {
      const data = await projectAPI.adminGetAll();
      if (data.success && data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      setProjectsError(err.message || "Failed to fetch projects.");
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    setReviewsError("");
    try {
      const data = await reviewAPI.adminGetAll();
      if (data.success && data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      setReviewsError(err.message || "Failed to fetch reviews.");
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchReviews();
  }, []);

  // Project handlers
  const handleAddProject = () => {
    setProjectModalItem(null);
    setShowProjectModal(true);
  };

  const handleEditProject = (p) => {
    setProjectModalItem(p);
    setShowProjectModal(true);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await projectAPI.delete(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete project.");
    }
  };

  // Review handlers
  const handleAddReview = () => {
    setReviewModalItem(null);
    setShowReviewModal(true);
  };

  const handleEditReview = (r) => {
    setReviewModalItem(r);
    setShowReviewModal(true);
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client review?")) return;
    try {
      await reviewAPI.delete(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete review.");
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0BB80F]">Portfolio Management</p>
          <h1 className="text-3xl font-black italic mt-2 text-white">PORTFOLIO &amp; REVIEWS</h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0d0d0d] p-1.5 rounded-full border border-white/5 self-start">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-wider transition-all ${
              activeTab === "projects"
                ? "bg-[#0BB80F] text-black shadow-[0_2px_15px_rgba(11,184,15,0.3)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            PROJECTS
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-wider transition-all ${
              activeTab === "reviews"
                ? "bg-[#0BB80F] text-black shadow-[0_2px_15px_rgba(11,184,15,0.3)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            REVIEWS
          </button>
        </div>
      </div>

      {/* ─── PROJECTS TAB CONTENT ──────────────────────────────────────────────── */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold italic tracking-wide text-white/90">PROJECT LIST</h2>
            <button
              onClick={handleAddProject}
              className="rounded-full bg-[#0BB80F] text-black px-5 py-2.5 text-xs font-black tracking-widest hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(11,184,15,0.2)]"
            >
              ADD PROJECT
            </button>
          </div>

          {projectsError && (
            <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {projectsError}
            </div>
          )}

          {projectsLoading ? (
            <div className="text-gray-500 text-xs tracking-widest text-center py-20 animate-pulse">
              LOADING PROJECTS...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-500 text-xs tracking-wider">NO PROJECTS POSTED YET.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#0f0f0f]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    <th className="px-6 py-4">Thumbnail</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Live Link</th>
                    <th className="px-6 py-4 text-center">Order</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {projects.map((p) => (
                    <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-16 h-12 rounded overflow-hidden border border-white/10 bg-black">
                          {p.image ? (
                            <img src={resolveAssetUrl(p.image)} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-white/20">📝</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-white italic">{p.title}</td>
                      <td className="px-6 py-4">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                          style={{ background: "#0BB80F15", color: "#0BB80F" }}
                        >
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 truncate max-w-[150px]">
                        {p.link ? (
                          <a href={p.link} target="_blank" rel="noreferrer" className="hover:text-[#0BB80F] underline">
                            {p.link}
                          </a>
                        ) : (
                          "None"
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-400">{p.order}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditProject(p)}
                          className="text-xs text-gray-400 hover:text-white border border-white/10 rounded-full px-4 py-1.5 hover:border-white transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p._id)}
                          className="text-xs text-red-400 hover:text-red-300 border border-red-500/10 rounded-full px-4 py-1.5 hover:border-red-500/30 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── REVIEWS TAB CONTENT ───────────────────────────────────────────────── */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold italic tracking-wide text-white/90">CLIENT REVIEWS</h2>
            <button
              onClick={handleAddReview}
              className="rounded-full bg-[#0BB80F] text-black px-5 py-2.5 text-xs font-black tracking-widest hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(11,184,15,0.2)]"
            >
              ADD REVIEW
            </button>
          </div>

          {reviewsError && (
            <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {reviewsError}
            </div>
          )}

          {reviewsLoading ? (
            <div className="text-gray-500 text-xs tracking-widest text-center py-20 animate-pulse">
              LOADING REVIEWS...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-500 text-xs tracking-wider">NO REVIEWS UPLOADED YET.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#0f0f0f]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    <th className="px-6 py-4">Avatar</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Role/Company</th>
                    <th className="px-6 py-4">Review Text</th>
                    <th className="px-6 py-4 text-center">Stars</th>
                    <th className="px-6 py-4 text-center">Order</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {reviews.map((r) => (
                    <tr key={r._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-black">
                          {r.avatar ? (
                            <img src={resolveAssetUrl(r.avatar)} alt={r.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-white/20">👤</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-white italic">{r.name}</td>
                      <td className="px-6 py-4 text-gray-300 font-medium">{r.role}</td>
                      <td className="px-6 py-4 text-xs text-gray-500 truncate max-w-[200px]" title={r.text}>
                        {r.text}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-[#0BB80F]">{"★".repeat(r.stars)}</td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-400">{r.order}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditReview(r)}
                          className="text-xs text-gray-400 hover:text-white border border-white/10 rounded-full px-4 py-1.5 hover:border-white transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(r._id)}
                          className="text-xs text-red-400 hover:text-red-300 border border-red-500/10 rounded-full px-4 py-1.5 hover:border-red-500/30 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showProjectModal && (
        <ProjectModal
          project={projectModalItem}
          onClose={() => setShowProjectModal(false)}
          onSaved={handleModalSave}
        />
      )}

      {showReviewModal && (
        <ReviewModal
          review={reviewModalItem}
          onClose={() => setShowReviewModal(false)}
          onSaved={handleModalSave}
        />
      )}
    </div>
  );

  function handleModalSave() {
    setShowProjectModal(false);
    setShowReviewModal(false);
    fetchProjects();
    fetchReviews();
  }
}
