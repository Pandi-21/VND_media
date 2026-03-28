import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const BASE =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

const PERKS = [
  { icon: "🌐", title: "FLEXIBLE WORK",    desc: "Work from anywhere. We value results and create clarity over office situations." },
  { icon: "🚀", title: "REAL PROJECTS",    desc: "Work with global brands on meaningful projects that actually move the needle." },
  { icon: "📈", title: "GROWTH",           desc: "Dedicated budget for your learning, certifications, and high-year gains." },
  { icon: "✏️", title: "CREATIVE FREEDOM", desc: "No micromanagement. You own your craft and your creative directions." },
];

const JOURNEY = [
  { label: "APPLY",     desc: "Submit your portfolio and digital footprint through our portal.", align: "right", active: true  },
  { label: "SCREENING", desc: "Our talent scouts review your creative DNA and past impact.",      align: "left",  active: false },
  { label: "INTERVIEW", desc: "Deep dive into your process with our creative leads.",             align: "right", active: false },
  { label: "OFFER",     desc: "Welcome to the Void. Get ready to build the future.",             align: "left",  active: false },
];

export default function Careers() {
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", position: "", portfolioUrl: "", message: "",
  });
  const [dragOver,      setDragOver]      = useState(false);
  const [fileName,      setFileName]      = useState("");
  const [file,          setFile]          = useState(null);
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [submitStatus,  setSubmitStatus]  = useState({ type: "", message: "" });
  const [jobs,          setJobs]          = useState([]);
  const [jobsLoading,   setJobsLoading]   = useState(true);
  const fileInputRef = useRef();

  // ── fetch live job postings from backend ────────────────────────────────
  useEffect(() => {
    fetch(`${BASE}/api/jobs/all`)
      .then((r) => r.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch(() => setJobs([]))
      .finally(() => setJobsLoading(false));
  }, []);

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.size > 5 * 1024 * 1024) {
      setSubmitStatus({ type: "error", message: "File size should be less than 5MB" }); return;
    }
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(selectedFile.type)) {
      setSubmitStatus({ type: "error", message: "Please upload a PDF or Word document" }); return;
    }
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setSubmitStatus({ type: "", message: "" });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitStatus({ type: "", message: "" });

  if (!formData.fullName || !formData.email || !formData.phone || !formData.position) {
    setSubmitStatus({ type: "error", message: "Please fill in all required fields" });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    setSubmitStatus({ type: "error", message: "Please enter a valid email address" });
    return;
  }

  if (formData.phone.length < 10) {
    setSubmitStatus({ type: "error", message: "Please enter a valid phone number" });
    return;
  }

  setIsSubmitting(true);

  try {
    const form = new FormData();

    // ✅ IMPORTANT: exact field names match backend
    form.append("fullName", formData.fullName.trim());
    form.append("email", formData.email.trim());
    form.append("phone", formData.phone.trim());
    form.append("position", formData.position.trim());
    form.append("portfolioUrl", formData.portfolioUrl.trim());
    form.append("message", formData.message.trim());

    // ✅ resume
    if (file) {
      form.append("resume", file);
    }

    // 🔍 DEBUG (remove later if needed)
    for (let pair of form.entries()) {
      console.log(pair[0], pair[1]);
    }

    const res = await fetch(`${BASE}/api/careers/apply`, {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (res.ok) {
      setSubmitStatus({
        type: "success",
        message: "✅ Application submitted! We'll be in touch soon.",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        position: "",
        portfolioUrl: "",
        message: "",
      });

      setFile(null);
      setFileName("");

      setTimeout(() => setSubmitStatus({ type: "", message: "" }), 5000);
    } else {
      setSubmitStatus({
        type: "error",
        message: data.message || "Something went wrong. Please try again.",
      });
    }
  } catch (error) {
    setSubmitStatus({
      type: "error",
      message: "Unable to connect to server. Check your connection and try again.",
    });
  } finally {
    setIsSubmitting(false);
  }
};
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const scrollToForm = (positionTitle = null) => {
    if (positionTitle) setFormData((prev) => ({ ...prev, position: positionTitle }));
    scrollTo("application-form");
  };

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="bg-[#0a0a0a] text-white min-h-screen">
      <Header />

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "#0BB80F" }} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold italic leading-tight">
            JOIN <span style={{ color: "#0BB80F" }}>VND MEDIA</span>
          </h1>
          <p className="mt-5 text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Step into the hyper-luminescent void where boundary-pushing creativity meets next-gen technology. We are building the future of digital presence.
          </p>
          <button
            onClick={() => scrollTo("open-positions")}
            className="mt-8 text-black text-xs font-bold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
            style={{ background: "#0BB80F" }}
          >
            VIEW OPEN POSITIONS
          </button>
        </div>
      </section>

      {/* ── WHY WORK WITH US ── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl overflow-hidden h-64 bg-[#161616] border border-white/5 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]" />
            <div className="relative flex items-end justify-center gap-4 pb-6">
              {[{ w: "w-10", h: "h-28" }, { w: "w-10", h: "h-32" }, { w: "w-10", h: "h-24" }].map((fig, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-white/20" />
                  <div className={`${fig.w} ${fig.h} bg-white/15 rounded-sm`} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold italic mb-5" style={{ color: "#0BB80F" }}>
              WHY WORK WITH US?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              At VND MEDIA, we don't just execute projects; we redefine digital landscapes. Our culture is built on the intersection of radical creativity and surgical precision.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              We offer a space where your unconventional ideas aren't just heard — they are the foundation of our next big innovation. Join a team that values momentum over bureaucracy.
            </p>
          </div>
        </div>
      </section>

      {/* ── PERKS ── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-extrabold italic tracking-widest mb-12">THE PERKS OF THE VOID</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {PERKS.map((p) => (
            <div key={p.title} className="text-center">
              <div className="text-2xl mb-3" style={{ color: "#0BB80F" }}>{p.icon}</div>
              <h4 className="font-extrabold text-xs tracking-widest mb-2">{p.title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OPEN POSITIONS (dynamic) ── */}
      <section id="open-positions" className="px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-2xl font-extrabold italic tracking-wide mb-8">OPEN POSITIONS</h2>

        {jobsLoading ? (
          <div className="text-gray-700 text-xs tracking-widest text-center py-10 animate-pulse">
            LOADING POSITIONS...
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
            <p className="text-gray-600 text-xs tracking-wider">NO OPEN POSITIONS AT THE MOMENT.</p>
            <p className="text-gray-700 text-xs mt-1">Check back soon or send a general application below.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((pos) => (
              <div
                key={pos._id}
                className="bg-[#141414] border border-white/5 rounded-xl p-6 hover:border-[#0BB80F]/20 transition-all"
              >
                <h3 className="font-extrabold text-sm italic mb-1">{pos.title}</h3>
                <p className="text-gray-500 text-xs mb-1">{pos.type}</p>
                {pos.location && <p className="text-gray-600 text-xs mb-3">📍 {pos.location}</p>}
                {pos.description && (
                  <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-2">{pos.description}</p>
                )}
                <button
                  onClick={() => scrollToForm(pos.title)}
                  className="text-xs font-bold inline-flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color: "#0BB80F" }}
                >
                  APPLY NOW →
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── JOURNEY ── */}
      <section className="px-6 pb-24 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-extrabold italic tracking-widest mb-16">THE JOURNEY</h2>
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "linear-gradient(to bottom, #00ff7f30, #00ff7f10)" }} />
          <div className="space-y-14">
            {JOURNEY.map((step, i) => (
              <div key={step.label} className={`relative flex items-center gap-6 ${step.align === "right" ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`flex-1 ${step.align === "right" ? "text-right" : "text-left"}`}>
                  {step.align === "left" && (
                    <h3 className="font-extrabold text-sm italic mb-1" style={{ color: "#0BB80F" }}>{step.label}</h3>
                  )}
                  <p className="text-gray-500 text-xs leading-relaxed max-w-xs"
                    style={{ marginLeft: step.align === "left" ? 0 : "auto" }}>{step.desc}</p>
                  {step.align === "right" && (
                    <h3 className="font-extrabold text-sm italic mt-1" style={{ color: "#0BB80F" }}>{step.label}</h3>
                  )}
                </div>
                <div className="relative z-10 w-4 h-4 rounded-full border-2 flex-shrink-0"
                  style={{ borderColor: "#0BB80F", background: i === 0 ? "#0BB80F" : "#0a0a0a" }} />
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ── */}
      <section id="application-form" className="px-6 pb-24 max-w-3xl mx-auto">
        <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-extrabold italic tracking-widest text-center mb-8">DROP YOUR INTEL</h2>

          {submitStatus.message && (
            <div className={`mb-6 p-4 rounded-lg ${
              submitStatus.type === "success"
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">FULL NAME *</label>
                <input name="fullName" value={formData.fullName} onChange={handleInput}
                  placeholder="Enter your name" required
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">EMAIL ADDRESS *</label>
                <input name="email" value={formData.email} onChange={handleInput}
                  placeholder="you@email.com" type="email" required
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">PHONE *</label>
                <input name="phone" value={formData.phone} onChange={handleInput}
                  placeholder="+1 (000) 000-0000" required
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">POSITION *</label>
                <select name="position" value={formData.position} onChange={(e) =>
  setFormData({ ...formData, position: e.target.value.trim() })
} required
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-[#0BB80F]/40 transition-colors appearance-none">
                  <option value="">Select Position</option>
                  {jobs.map((p) => <option key={p._id} value={p.title}>{p.title}</option>)}
                  <option value="General Application">General Application</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">PORTFOLIO/WEBSITE URL (OPTIONAL)</label>
              <input name="portfolioUrl" value={formData.portfolioUrl} onChange={handleInput}
                placeholder="https://yourportfolio.com"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors" />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">RESUME/CV</label>
              <div
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files[0]); }}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  dragOver ? "border-[#0BB80F]/60 bg-[#0BB80F]/5" : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="text-2xl mb-2 opacity-40">📎</div>
                <p className="text-gray-500 text-xs">
                  {fileName || "Drag and drop or click to upload (PDF, DOC, DOCX · Max 5MB)"}
                </p>
                <input type="file" hidden ref={fileInputRef}
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  accept=".pdf,.doc,.docx" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">MESSAGE</label>
              <textarea name="message" value={formData.message} onChange={handleInput}
                placeholder="Tell us something in the void..." rows={4}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors resize-none" />
            </div>

            <button type="submit" disabled={isSubmitting}
              className={`w-full text-black font-bold text-sm py-4 rounded-xl tracking-widest transition-all ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
              style={{ background: "#0BB80F" }}>
              {isSubmitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
            </button>
          </form>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <div className="bg-[#141414] border border-white/5 rounded-3xl px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-3xl opacity-20" style={{ background: "#0BB80F" }} />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold italic leading-tight mb-4">
              LET'S BUILD YOUR<br />
              <span style={{ color: "#0BB80F" }}>FUTURE TOGETHER</span>
            </h2>
            <p className="text-gray-500 text-sm mb-8">The next chapter of VND MEDIA is waiting for you. Ready to make your mark?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => scrollToForm()}
                className="text-black text-xs font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                style={{ background: "#0BB80F" }}>GET STARTED</button>
              <button onClick={() => scrollTo("open-positions")}
                className="border border-white/20 text-white text-xs font-semibold px-6 py-3 rounded-full hover:border-white/40 transition-colors">
                VIEW OPENINGS</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}