import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NAV_LINKS = ["WORK", "SERVICES", "MEDIA", "AGENCY"];

const CATEGORIES = [
  "All",
  "Digital Marketing",
  "Meta Ads",
  "Google Ads",
  "SEO",
  "Content Creation",
  "Web Development",
];

const ARTICLES = [
  {
    id: 1,
    category: "GOOGLE ADS",
    date: "MARCH 2026",
    title: "TOP 5 GOOGLE ADS STRATEGIES",
    desc: "Master the art of bidding and keyword placement for maximum ROI in the current market cycle.",
    bg: "from-[#1a2a1a] to-[#0d1a0d]",
    accent: "#0BB80F",
  },
  {
    id: 2,
    category: "SEO",
    date: "MARCH 2026",
    title: "SEO TIPS FOR BEGINNERS",
    desc: "The essential guide to ranking higher on search engines without needing a technical degree.",
    bg: "from-[#1a1a2a] to-[#0d0d1a]",
    accent: "#0BB80F",
  },
  {
    id: 3,
    category: "CONTENT",
    date: "MARCH 2026",
    title: "CONTENT CREATION GUIDE",
    desc: "How to build a narrative that sells. Learn our agency's framework for viral content generation.",
    bg: "from-[#2a1a1a] to-[#1a0d0d]",
    accent: "#0BB80F",
  },
];

// Fake "thumbnail" backgrounds for each article card
const CARD_VISUALS = [
  // Google Ads - dark screen with code-like lines
  ({ accent }) => (
    <div className="w-full h-full bg-[#0d1a0d] relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px"
            style={{ top: `${10 + i * 11}%`, background: accent, opacity: 0.3 + i * 0.05 }}
          />
        ))}
      </div>
      <div className="relative text-center">
        <div className="text-xs font-bold tracking-widest mb-2" style={{ color: accent }}>
          GOOGLE ADS
        </div>
        <div className="w-16 h-10 border border-white/10 rounded bg-[#111] mx-auto flex items-center justify-center">
          <div className="w-8 h-1 bg-white/20 rounded" />
        </div>
      </div>
    </div>
  ),
  // SEO - magnifying glass concept
  ({ accent }) => (
    <div className="w-full h-full bg-[#111] relative overflow-hidden flex items-center justify-center">
      <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
          <span className="text-2xl">🔍</span>
        </div>
      </div>
      <div
        className="absolute text-xs font-bold tracking-widest top-4 left-4"
        style={{ color: accent }}
      >
        SEO
      </div>
    </div>
  ),
  // Content - lens/camera concept
  ({ accent }) => (
    <div className="w-full h-full bg-[#0d0d0d] relative overflow-hidden flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
        </div>
      </div>
      <div
        className="absolute text-xs font-bold tracking-widest top-4 left-4"
        style={{ color: accent }}
      >
        CONTENT
      </div>
    </div>
  ),
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  

  return (
    <div
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
      className="bg-[#0a0a0a] text-white min-h-screen"
    >
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

      {/* ── FEATURED INSIGHT ── */}
      <section className="px-6 pb-12 max-w-5xl mx-auto">
        <div className="bg-[#141414] border border-white/5 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="h-64 md:h-auto relative overflow-hidden bg-[#0d1a12]">
              {/* Simulated data/laptop visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-32">
                  {/* Laptop screen simulation */}
                  <div className="w-full h-full rounded-lg bg-[#111] border border-white/10 p-2 overflow-hidden">
                    <div className="text-xs text-[#0BB80F]/60 font-mono mb-1">Data</div>
                    <div className="text-xs text-white/30 font-mono mb-1">CONSUMING.</div>
                    {/* Animated wave lines */}
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
              {/* Green ambient glow */}
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
                HOW TO SCALE YOUR BUSINESS WITH META ADS
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Learn proven strategies to grow your business using high-converting
                ad campaigns. We dive deep into technical optimization and creative
                scaling.
              </p>
              <button
                className="self-start text-black text-xs font-bold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
                style={{ background: "#0BB80F" }}
              >
                READ MORE <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTICLE GRID ── */}
      <section className="px-6 pb-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {ARTICLES.map((article, i) => {
            const Visual = CARD_VISUALS[i];
            return (
              <div
                key={article.id}
                className="group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="rounded-2xl overflow-hidden h-44 mb-3 border border-white/5">
                  <Visual accent={article.accent} />
                </div>
                {/* Meta */}
                <p className="text-gray-500 text-xs mb-1">{article.date}</p>
                <h3 className="font-extrabold italic text-sm mb-2 group-hover:text-[#0BB80F] transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">{article.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="w-9 h-9 rounded-full border border-white/10 text-gray-400 hover:border-white/30 transition-colors text-sm"
          >
            ‹
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => setCurrentPage(n)}
              className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                currentPage === n
                  ? "text-black"
                  : "border border-white/10 text-gray-400 hover:border-white/30 bg-transparent"
              }`}
              style={currentPage === n ? { background: "#0BB80F" } : {}}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
            className="w-9 h-9 rounded-full border border-white/10 text-gray-400 hover:border-white/30 transition-colors text-sm"
          >
            ›
          </button>
        </div>
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
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-full px-6 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
            />
            <button
              className="text-black text-xs font-bold px-7 py-3 rounded-full whitespace-nowrap hover:opacity-90 transition-opacity"
              style={{ background: "#0BB80F" }}
            >
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ── */}
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

      {/* ── FOOTER ── */}
       <Footer />
    </div>
  );
}