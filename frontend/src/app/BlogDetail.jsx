import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { blogAPI, resolveAssetUrl } from "../services/api";
import { FiCalendar, FiTag, FiArrowLeft } from "react-icons/fi";

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await blogAPI.getBySlug(slug);
        if (data.success && data.post) {
          setPost(data.post);
        } else {
          setError("Article not found.");
        }
      } catch (err) {
        setError(err.message || "Failed to load the article.");
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] text-white min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center py-36">
          <div className="text-gray-500 text-xs tracking-widest animate-pulse">
            LOADING ARTICLE...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-[#0a0a0a] text-white min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center gap-4 py-36">
          <p className="text-red-400 text-sm font-semibold">{error || "Article not found."}</p>
          <Link
            to="/blog"
            className="text-xs text-[#0BB80F] border border-[#0BB80F]/20 rounded-full px-6 py-3 hover:bg-[#0BB80F]/5 transition"
          >
            Back to Insights
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).toUpperCase()
    : new Date(post.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).toUpperCase();

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-6 pt-36 pb-24 w-full">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-[#0BB80F] mb-8 transition-colors duration-300"
        >
          <FiArrowLeft /> BACK TO INSIGHTS
        </Link>

        {/* Category & Title */}
        <div className="space-y-4">
          {post.category && (
            <span
              className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider"
              style={{ background: "#0BB80F15", color: "#0BB80F" }}
            >
              {post.category}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-black italic leading-tight text-white mt-4">
            {post.title.toUpperCase()}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-5 text-gray-500 text-xs py-4 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <FiCalendar /> {formattedDate}
            </span>
            {post.tags && post.tags.length > 0 && (
              <span className="flex items-center gap-1.5">
                <FiTag /> {post.tags.join(", ").toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="my-10 rounded-2xl overflow-hidden border border-white/5 max-h-[480px]">
            <img
              src={resolveAssetUrl(post.coverImage)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <article
          className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-sm md:text-base space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </main>

      <Footer />
    </div>
  );
}
