import React, { useEffect, useState } from "react";
import { reviewAPI, resolveAssetUrl } from "../services/api";

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
                placeholder="Client name (e.g. Sarah Johnson)..."
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
              placeholder="Enter client review description..."
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

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalPost, setModalPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await reviewAPI.adminGetAll();
      if (data.success && data.reviews) {
        setReviews(data.reviews);
      } else {
        setError("Failed to fetch reviews.");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleEdit = (r) => {
    setModalPost(r);
    setShowModal(true);
  };

  const handleAdd = () => {
    setModalPost(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client review?")) return;
    try {
      await reviewAPI.delete(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete review.");
    }
  };

  const handleModalSave = (savedReview) => {
    setShowModal(false);
    fetchReviews(); // Reload list to respect sorting
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0BB80F]">Client Testimonials</p>
          <h1 className="text-3xl font-black italic mt-2 text-white">REVIEWS MANAGER</h1>
        </div>
        <button
          onClick={handleAdd}
          className="rounded-full bg-[#0BB80F] text-black px-6 py-3 text-xs font-black tracking-widest hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(11,184,15,0.2)]"
        >
          ADD NEW REVIEW
        </button>
      </div>

      {error && (
        <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500 text-xs tracking-widest text-center py-20 animate-pulse">
          LOADING REVIEWS...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
          <p className="text-gray-500 text-xs tracking-wider">NO REVIEWS UPLOADED YET.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0f0f0f]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
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
                      onClick={() => handleEdit(r)}
                      className="text-xs text-gray-400 hover:text-white border border-white/10 rounded-full px-4 py-1.5 hover:border-white transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
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

      {showModal && (
        <ReviewModal
          review={modalPost}
          onClose={() => setShowModal(false)}
          onSaved={handleModalSave}
        />
      )}
    </div>
  );
}
