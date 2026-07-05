import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { blogAPI } from "../services/api";

const CATEGORIES = [
  "All",
  "Digital Marketing",
  "Meta Ads",
  "Google Ads",
  "SEO",
  "Content Creation",
  "Web Development",
];

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="rounded-2xl h-44 mb-3 bg-white/5" />
      <div className="h-3 bg-white/5 rounded w-1/3 mb-2" />
      <div className="h-4 bg-white/5 rounded w-3/4 mb-2" />
      <div className="h-3 bg-white/5 rounded w-full" />
    </div>
  );
}

// ── Article card ──────────────────────────────────────────────────────────────
function ArticleCard({ post }) {
  const accent = "#0BB80F";
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase()
    : new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();

  return (
    <div className="group cursor-pointer">
      {/* Thumbnail */}
      <div className="rounded-2xl overflow-hidden h-44 mb-3 border border-white/5 bg-[#111]">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div
              className="text-xs font-bold tracking-widest"
              style={{ color: accent }}
            >
              {post.category?.toUpperCase() || "ARTICLE"}
            </div>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 text-lg">
              📝
            </div>
          </div>
        )}
      </div>

      {/* Meta */}
      <p className="text-gray-500 text-xs mb-1">{formattedDate}</p>
      <h3 className="font-extrabold italic text-sm mb-2 group-hover:text-[#0BB80F] transition-colors leading-snug">
        {post.title.toUpperCase()}
      </h3>
      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {post.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: "#0BB80F15", color: "#0BB80F" }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Blog page ─────────────────────────────────────────────────────────────
export default function Blog() {
  const [posts, setPosts]             = useState([]);
  const [featured, setFeatured]       = useState(null);
  const [total, setTotal]             = useState(0);
  const [totalPages, setTotalPages]   = useState(1);
  const [page, setPage]               = useState(1);
  const [search, setSearch]           = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [email, setEmail]             = useState("");
  const [subscribed, setSubscribed]   = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [debouncedSearch, activeCategory]);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (activeCategory !== "All") params.set("category", activeCategory);

      const data = await blogAPI.getAll(params.toString());

      setPosts(data.posts);
      setTotal(data.total);
      setTotalPages(data.pages || 1);

      // Use the first post as featured (only on first page, no filter)
      if (page === 1 && activeCategory === "All" && !debouncedSearch && data.posts.length > 0) {
        setFeatured(data.posts[0]);
      } else {
        setFeatured(null);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, activeCategory]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Grid posts = all except featured (on page 1 default view)
  const gridPosts = featured ? posts.slice(1) : posts;

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Header />

      {/* ── HERO ── */}
      <section className="pt-36 pb-12 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold italic leading-tight tracking-tight">
          INSIGHTS <span style={{ color: "#0BB80F" }}>&amp;</span> IDEAS
        </h1>
        <p className="mt-4 text-gray-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Explore the latest trends in digital marketing, web development, and
          business growth.
        </p>

        {/* Search */}
        <div className="mt-8 max-w-md mx-auto relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search insights..."
            className="w-full bg-[#161616] border border-white/10 rounded-full pl-10 pr-5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
          />
        </div>

        {/* Category filters */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-4 py-2 rounded-full font-semibold transition-all border ${
                activeCategory === cat
                  ? "text-black border-transparent"
                  : "text-gray-300 border-white/10 bg-transparent hover:border-white/30"
              }`}
              style={activeCategory === cat ? { background: "#0BB80F" } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURED POST ── */}
      {featured && !loading && (
        <section className="px-6 pb-12 max-w-5xl mx-auto">
          <div className="bg-[#141414] border border-white/5 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Cover image / fallback visual */}
              <div className="h-64 md:h-auto relative overflow-hidden bg-[#0d1a12]">
                {featured.coverImage ? (
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-48 h-32">
                      <div className="w-full h-full rounded-lg bg-[#111] border border-white/10 p-2 overflow-hidden">
                        <div className="text-xs text-[#0BB80F]/60 font-mono mb-1">Featured</div>
                        <div className="text-xs text-white/30 font-mono mb-1">{featured.category?.toUpperCase()}</div>
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="h-px w-full mb-1 rounded"
                            style={{
                              background: `linear-gradient(90deg, transparent, ${
                                i % 2 === 0 ? "#0BB80F" : "#ff6b35"
                              }40, transparent)`,
                              transform: `scaleX(${0.6 + i * 0.08})`,
                              transformOrigin: "left",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className="absolute bottom-0 left-0 right-0 h-24 opacity-20"
                  style={{ background: "linear-gradient(to top, #0BB80F, transparent)" }}
                />
              </div>

              {/* Content */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <p
                  className="text-xs font-bold tracking-widest mb-3 italic"
                  style={{ color: "#0BB80F" }}
                >
                  FEATURED INSIGHT
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold italic leading-tight mb-4">
                  {featured.title.toUpperCase()}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {featured.excerpt}
                </p>
                <Link
                  to={`/blog/${featured.slug}`}
                  className="self-start text-black text-xs font-bold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ background: "#0BB80F" }}
                >
                  READ MORE <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ARTICLE GRID ── */}
      <section className="px-6 pb-12 max-w-5xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={fetchPosts}
              className="text-xs text-gray-500 underline hover:text-gray-300"
            >
              Try again
            </button>
          </div>
        ) : gridPosts.length === 0 && !featured ? (
          <div className="text-center py-24 text-gray-600">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">No posts found{debouncedSearch ? ` for "${debouncedSearch}"` : ""}.</p>
          </div>
        ) : (
          <>
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {gridPosts.map((post) => (
                  <Link key={post._id} to={`/blog/${post.slug}`}>
                    <ArticleCard post={post} />
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-full border border-white/10 text-gray-400 hover:border-white/30 transition-colors text-sm disabled:opacity-30"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-full text-sm font-bold transition-all`}
                    style={
                      page === n
                        ? { background: "#0BB80F", color: "#000" }
                        : { border: "1px solid rgba(255,255,255,0.1)", color: "#888" }
                    }
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-full border border-white/10 text-gray-400 hover:border-white/30 transition-colors text-sm disabled:opacity-30"
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── STAY UPDATED ── */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="bg-[#141414] border border-white/5 rounded-3xl px-8 py-14 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold italic tracking-wide mb-3">
            STAY UPDATED
          </h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            Get the latest marketing tips directly to your inbox. No spam, just
            pure strategy.
          </p>
          {subscribed ? (
            <p className="text-[#0BB80F] font-bold italic text-sm">✓ YOU'RE IN — WATCH YOUR INBOX.</p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-full px-6 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
              />
              <button
                onClick={() => { if (email.includes("@")) setSubscribed(true); }}
                className="text-black text-xs font-bold px-7 py-3 rounded-full whitespace-nowrap hover:opacity-90 transition-opacity"
                style={{ background: "#0BB80F" }}
              >
                SUBSCRIBE
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div
          className="rounded-3xl px-8 py-16 text-center"
          style={{ background: "#0BB80F" }}
        >
          <h2 className="text-2xl md:text-4xl font-extrabold italic text-black leading-tight mb-6">
            NEED HELP GROWING YOUR BUSINESS?
          </h2>
          <button className="bg-black text-white text-sm font-bold italic px-8 py-4 rounded-full hover:bg-gray-900 transition-colors tracking-wide">
            CONTACT VND MEDIA
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
