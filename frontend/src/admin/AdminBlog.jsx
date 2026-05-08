import { useState, useEffect, useCallback } from "react";
const API_BASE = "http://localhost:5000/api/blog";

// ✅ Token header helper
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("vnd_admin_token")}`,
});

const CATEGORIES = [
  "All",
  "Digital Marketing",
  "Meta Ads",
  "Google Ads",
  "SEO",
  "Content Creation",
  "Web Development",
];

const STATUS_COLORS = {
  published: { bg: "#0BB80F22", text: "#0BB80F", label: "Published" },
  draft:     { bg: "#ffffff11", text: "#888",    label: "Draft"      },
};

function PostModal({ post, onClose, onSaved }) {
  const editing = !!post?._id;
  const [form, setForm] = useState({
    title:       post?.title       || "",
    excerpt:     post?.excerpt     || "",
    content:     post?.content     || "",
    category:    post?.category    || "General",
    author:      post?.author      || "Admin",
    tags:        post?.tags?.join(", ") || "",
    isPublished: post?.isPublished || false,
  });
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit() {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setError("Title, excerpt and content are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "tags") fd.append(k, JSON.stringify(v.split(",").map((t) => t.trim()).filter(Boolean)));
        else if (k === "isPublished") fd.append(k, String(v));
        else fd.append(k, v);
      });
      if (coverImage) fd.append("coverImage", coverImage);

      const url    = editing ? `${API_BASE}/${post._id}` : API_BASE;
      const method = editing ? "PUT" : "POST";

      // ✅ auth header — Content-Type போடாதீங்க, browser multipart auto set பண்ணும்
      const res  = await fetch(url, { method, body: fd, headers: authHeaders() });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      onSaved(data.post);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 overflow-hidden flex flex-col" style={{ background: "#111", maxHeight: "90vh" }}>
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/10">
          <h2 className="text-white font-extrabold italic text-lg tracking-wide">{editing ? "EDIT POST" : "NEW POST"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 px-7 py-6 space-y-5">
          {error && <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</div>}

          <div>
            <label className="block text-xs text-gray-500 mb-1 font-bold tracking-widest uppercase">Title *</label>
            <input value={form.title} onChange={set("title")} placeholder="Post title..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1 font-bold tracking-widest uppercase">Excerpt *</label>
            <textarea value={form.excerpt} onChange={set("excerpt")} rows={2} placeholder="Short summary..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors resize-none" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1 font-bold tracking-widest uppercase">Content *</label>
            <textarea value={form.content} onChange={set("content")} rows={8} placeholder="Full post content (HTML or Markdown)..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors resize-none font-mono" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-bold tracking-widest uppercase">Category</label>
              <select value={form.category} onChange={set("category")} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none">
                {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-bold tracking-widest uppercase">Author</label>
              <input value={form.author} onChange={set("author")} placeholder="Admin" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1 font-bold tracking-widest uppercase">Tags (comma-separated)</label>
            <input value={form.tags} onChange={set("tags")} placeholder="seo, google ads, marketing" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#0BB80F]/40 transition-colors" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1 font-bold tracking-widest uppercase">Cover Image</label>
            <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} className="w-full text-gray-400 text-sm" />
            {post?.coverImage && !coverImage && <p className="text-xs text-gray-600 mt-1">Current: {post.coverImage}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setForm((f) => ({ ...f, isPublished: !f.isPublished }))} className="w-12 h-6 rounded-full transition-colors relative" style={{ background: form.isPublished ? "#0BB80F" : "#333" }}>
              <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: form.isPublished ? "28px" : "4px" }} />
            </button>
            <span className="text-sm text-gray-400">{form.isPublished ? "Published" : "Draft"}</span>
          </div>
        </div>

        <div className="px-7 py-5 border-t border-white/10 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 text-sm text-gray-400 border border-white/10 rounded-xl hover:border-white/30 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 text-sm font-bold text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50" style={{ background: "#0BB80F" }}>
            {loading ? "Saving..." : editing ? "Update Post" : "Create Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
        <p className="text-white text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-center gap-3">
          <button onClick={onCancel} className="px-5 py-2.5 text-sm text-gray-400 border border-white/10 rounded-xl hover:border-white/30 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBlog() {
  const [posts, setPosts]                     = useState([]);
  const [total, setTotal]                     = useState(0);
  const [totalPages, setTotalPages]           = useState(1);
  const [page, setPage]                       = useState(1);
  const [search, setSearch]                   = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory]               = useState("All");
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState("");
  const [modalPost, setModalPost]             = useState(null);
  const [deleteTarget, setDeleteTarget]       = useState(null);
  const [togglingId, setTogglingId]           = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // ✅ auth header added
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (category !== "All") params.set("category", category);

      const res  = await fetch(`${API_BASE}/admin/all?${params}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setPosts(data.posts);
      setTotal(data.total || data.posts.length);
      setTotalPages(data.pages || 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);
  useEffect(() => { setPage(1); }, [debouncedSearch, category]);

  // ✅ auth header added
  async function handleToggle(id) {
    setTogglingId(id);
    try {
      const res  = await fetch(`${API_BASE}/${id}/toggle`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setPosts((prev) => prev.map((p) => p._id === id ? { ...p, isPublished: data.isPublished } : p));
    } catch (e) {
      alert("Toggle failed: " + e.message);
    } finally {
      setTogglingId(null);
    }
  }

  // ✅ auth header added
  async function handleDelete(id) {
    try {
      const res  = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      setTotal((t) => t - 1);
    } catch (e) {
      alert("Delete failed: " + e.message);
    } finally {
      setDeleteTarget(null);
    }
  }

  function handleSaved(savedPost) {
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p._id === savedPost._id);
      if (idx !== -1) { const next = [...prev]; next[idx] = savedPost; return next; }
      return [savedPost, ...prev];
    });
    setModalPost(null);
  }

  const accent = "#0BB80F";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}>
      {modalPost !== null && (
        <PostModal post={modalPost._id ? modalPost : null} onClose={() => setModalPost(null)} onSaved={handleSaved} />
      )}
      {deleteTarget && (
        <ConfirmDialog message={`Delete "${deleteTarget.title}"? This cannot be undone.`} onConfirm={() => handleDelete(deleteTarget._id)} onCancel={() => setDeleteTarget(null)} />
      )}

      {/* Header */}
      <div className="px-8 pt-10 pb-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold italic tracking-tight">BLOG <span style={{ color: accent }}>MANAGER</span></h1>
          <p className="text-gray-500 text-sm mt-1">{total} post{total !== 1 ? "s" : ""} total</p>
        </div>
        <button onClick={() => setModalPost({})} className="flex items-center gap-2 text-black text-sm font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity" style={{ background: accent }}>
          <span className="text-lg leading-none">+</span> New Post
        </button>
      </div>

      {/* Filters */}
      <div className="px-8 py-5 flex flex-col sm:flex-row gap-4 border-b border-white/5">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts..." className="w-full bg-[#161616] border border-white/10 rounded-full pl-10 pr-5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0BB80F]/40 transition-colors" />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className="text-xs px-4 py-2 rounded-full font-semibold transition-all border"
              style={category === cat ? { background: accent, color: "#000", border: "transparent" } : { color: "#999", borderColor: "rgba(255,255,255,0.1)" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: accent }} />
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={fetchPosts} className="mt-4 text-xs text-gray-500 underline">Retry</button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-gray-600">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-sm">No posts found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-gray-500 text-xs tracking-widest uppercase">
                    <th className="text-left px-5 py-4 font-bold">Post</th>
                    <th className="text-left px-5 py-4 font-bold hidden md:table-cell">Category</th>
                    <th className="text-left px-5 py-4 font-bold hidden lg:table-cell">Author</th>
                    <th className="text-center px-5 py-4 font-bold hidden sm:table-cell">Views</th>
                    <th className="text-center px-5 py-4 font-bold">Status</th>
                    <th className="text-right px-5 py-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => {
                    const status = post.isPublished ? STATUS_COLORS.published : STATUS_COLORS.draft;
                    return (
                      <tr key={post._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden" style={{ background: "#1a1a1a" }}>
                              {post.coverImage
                                ? <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-gray-700 text-xl">📄</div>}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate max-w-[200px] md:max-w-xs">{post.title}</p>
                              <p className="text-gray-600 text-xs truncate max-w-[200px] md:max-w-xs mt-0.5">/{post.slug}</p>
                              {post.tags?.length > 0 && (
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  {post.tags.slice(0, 2).map((t) => (
                                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#0BB80F15", color: "#0BB80F" }}>{t}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-400 hidden md:table-cell">{post.category || "General"}</td>
                        <td className="px-5 py-4 text-gray-400 hidden lg:table-cell">{post.author || "Admin"}</td>
                        <td className="px-5 py-4 text-center text-gray-400 hidden sm:table-cell">{post.views?.toLocaleString() || 0}</td>
                        <td className="px-5 py-4 text-center">
                          <button onClick={() => handleToggle(post._id)} disabled={togglingId === post._id}
                            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:opacity-80 disabled:opacity-50"
                            style={{ background: status.bg, color: status.text }}>
                            {togglingId === post._id
                              ? <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
                              : <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.text }} />}
                            {status.label}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setModalPost(post)} className="text-xs px-4 py-2 rounded-xl border border-white/10 text-gray-300 hover:border-white/30 hover:text-white transition-all">Edit</button>
                            <button onClick={() => setDeleteTarget(post)} className="text-xs px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all">Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-9 h-9 rounded-full border border-white/10 text-gray-400 hover:border-white/30 transition-colors text-sm disabled:opacity-30">‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => setPage(n)} className="w-9 h-9 rounded-full text-sm font-bold transition-all"
                    style={page === n ? { background: accent, color: "#000" } : { border: "1px solid rgba(255,255,255,0.1)", color: "#888" }}>{n}</button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-9 h-9 rounded-full border border-white/10 text-gray-400 hover:border-white/30 transition-colors text-sm disabled:opacity-30">›</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
