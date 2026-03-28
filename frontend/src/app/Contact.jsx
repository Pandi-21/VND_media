// import { useState } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// const NAV_LINKS = ["Work", "Services", "About", "Contact"];

// const FAQS = [
//   {
//     q: "How fast will you respond?",
//     a: "We typically respond within 2–4 business hours. For urgent inquiries, reach us directly via WhatsApp or Instant Call.",
//   },
//   {
//     q: "Do you offer free consultation?",
//     a: "Yes! We offer a complimentary 30-minute strategy session to understand your goals and see how we can help scale your brand.",
//   },
// ];

// export default function Contact() {
  
//   const [form, setForm] = useState({ name: "", email: "", phone: "", service: "Digital Marketing", message: "" });
//   const [openFaq, setOpenFaq] = useState(null);

//   const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   return (
//     <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="bg-[#0a0a0a] text-white min-h-screen">

//     <Header />
      

//       {/* ── HERO ── */}
//       <section className="relative pt-40 pb-28 px-6 text-center overflow-hidden">
//         {/* Radial green glow */}
//         <div className="absolute inset-0 flex items-end justify-center pointer-events-none pb-0">
//           <div className="w-[500px] h-48 rounded-full blur-3xl opacity-15" style={{ background: "#0BB80F" }} />
//         </div>
//         <div className="relative z-10">
//           <h1 className="text-5xl md:text-7xl font-extrabold italic leading-tight">
//             Let's <span style={{ color: "#0BB80F" }}>Connect</span>
//           </h1>
//           <p className="mt-5 text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
//             Enter the void of digital excellence. Whether you're scaling or starting, our hyper-luminescent strategies illuminate your path to market dominance.
//           </p>
//         </div>
//       </section>

//       {/* ── CONTACT INFO CARDS ── */}
//       <section className="px-6 pb-20 max-w-5xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Email */}
//           <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 hover:border-[#0BB80F]/20 transition-all">
//             <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: "#0BB80F15", border: "1px solid #0BB80F30" }}>
//               <span className="text-sm" style={{ color: "#0BB80F" }}>✉</span>
//             </div>
//             <h3 className="font-bold italic text-base mb-3">Email</h3>
//             <p className="text-gray-400 text-xs mb-1">hello@vndmedia.com</p>
//             <p className="text-gray-400 text-xs">support@vndmedia.com</p>
//           </div>

//           {/* Phone */}
//           <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 hover:border-[#0BB80F]/20 transition-all">
//             <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: "#0BB80F15", border: "1px solid #0BB80F30" }}>
//               <span className="text-sm" style={{ color: "#0BB80F" }}>📞</span>
//             </div>
//             <h3 className="font-bold italic text-base mb-3">Phone</h3>
//             <p className="text-gray-400 text-xs mb-1">+1 (555) 0123-4567</p>
//             <p className="text-gray-400 text-xs">+1 (555) 0123-8888</p>
//           </div>

//           {/* Location */}
//           <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 hover:border-[#0BB80F]/20 transition-all">
//             <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: "#0BB80F15", border: "1px solid #0BB80F30" }}>
//               <span className="text-sm" style={{ color: "#0BB80F" }}>📍</span>
//             </div>
//             <h3 className="font-bold italic text-base mb-3">Location</h3>
//             <p className="text-gray-400 text-xs mb-1">42 Future Plaza, Neo-District</p>
//             <p className="text-gray-400 text-xs">The Hyper-Void, 10101</p>
//           </div>
//         </div>
//       </section>

//       {/* ── MANIFEST YOUR VISION + FORM ── */}
//       <section className="px-6 pb-20 max-w-5xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
//           {/* Left */}
//           <div>
//             <h2 className="text-3xl font-extrabold italic leading-snug mb-4">
//               Manifest Your<br />Vision.
//             </h2>
//             <p className="text-gray-400 text-sm leading-relaxed mb-8">
//               We don't just run ads; we engineer digital presence. Share your goals, and let's build something immortal.
//             </p>

//             {/* Map placeholder */}
//             <div className="rounded-2xl overflow-hidden h-44 bg-[#161616] border border-white/5 relative flex items-center justify-center mb-6">
//               {/* Simulated map */}
//               <div className="absolute inset-0 opacity-20">
//                 {[...Array(6)].map((_, i) => (
//                   <div key={i} className="absolute left-0 right-0 h-px bg-white/10" style={{ top: `${15 + i * 14}%` }} />
//                 ))}
//                 {[...Array(5)].map((_, i) => (
//                   <div key={i} className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: `${15 + i * 17}%` }} />
//                 ))}
//               </div>
//               {/* Map pin */}
//               <div className="relative z-10 flex flex-col items-center">
//                 <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1" style={{ borderColor: "#0BB80F", background: "#00ff7f20" }}>
//                   <span className="text-xs" style={{ color: "#0BB80F" }}>📍</span>
//                 </div>
//                 <div className="w-0 h-0" style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "10px solid #0BB80F" }} />
//               </div>
//               <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-gray-600 tracking-widest">NOMNOM</p>
//             </div>

//             {/* Avatars */}
//             <div className="flex items-center gap-3">
//               <div className="flex -space-x-2">
//                 {["MV", "EC", "DG"].map((init, i) => (
//                   <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-[#222] flex items-center justify-center text-xs font-bold text-gray-400">
//                     {init}
//                   </div>
//                 ))}
//               </div>
//               <p className="text-gray-500 text-xs leading-tight">
//                 Our digital architects are<br />ready to assist you.
//               </p>
//             </div>
//           </div>

//           {/* Right: Form */}
//           <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">NAME</label>
//                 <input name="name" value={form.name} onChange={handleInput} placeholder="John Doe" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors" />
//               </div>
//               <div>
//                 <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">EMAIL</label>
//                 <input name="email" value={form.email} onChange={handleInput} placeholder="john@example.com" type="email" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors" />
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">PHONE</label>
//                 <input name="phone" value={form.phone} onChange={handleInput} placeholder="+1..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors" />
//               </div>
//               <div>
//                 <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">SERVICE</label>
//                 <select name="service" value={form.service} onChange={handleInput} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#0BB80F]/40 transition-colors appearance-none">
//                   <option>Digital Marketing</option>
//                   <option>Meta Ads</option>
//                   <option>Google Ads</option>
//                   <option>SEO Optimization</option>
//                   <option>Content Creation</option>
//                   <option>Lead Generation</option>
//                 </select>
//               </div>
//             </div>
//             <div className="mb-4">
//               <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">MESSAGE</label>
//               <textarea name="message" value={form.message} onChange={handleInput} placeholder="Tell us about your project..." rows={4} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors resize-none" />
//             </div>
//             <button className="w-full text-black font-bold text-sm py-3.5 rounded-xl tracking-widest hover:opacity-90 transition-opacity" style={{ background: "#0BB80F" }}>
//               SEND INQUIRY
//             </button>
//           </div>
//         </div>

//         {/* WhatsApp + Instant Call */}
//         <div className="flex flex-wrap justify-center gap-4 mt-12">
//           <button className="flex items-center gap-2 border border-white/10 rounded-full px-6 py-3 text-sm font-semibold hover:border-[#0BB80F]/40 transition-colors">
//             <span style={{ color: "#0BB80F" }}>💬</span> WhatsApp Us
//           </button>
//           <button className="flex items-center gap-2 border border-white/10 rounded-full px-6 py-3 text-sm font-semibold hover:border-[#0BB80F]/40 transition-colors">
//             <span style={{ color: "#0BB80F" }}>📲</span> Instant Call
//           </button>
//         </div>
//       </section>

//       {/* ── FAQ ── */}
//       <section className="px-6 pb-24 max-w-2xl mx-auto text-center">
//         <h2 className="text-2xl font-extrabold italic mb-10">F.A.Q</h2>
//         <div className="space-y-3">
//           {FAQS.map((faq, i) => (
//             <div key={i} className="bg-[#141414] border border-white/5 rounded-xl overflow-hidden">
//               <button
//                 onClick={() => setOpenFaq(openFaq === i ? null : i)}
//                 className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/2 transition-colors"
//               >
//                 <span className="text-sm font-medium">{faq.q}</span>
//                 <span className="text-lg text-gray-400 transition-transform" style={{ transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
//               </button>
//               {openFaq === i && (
//                 <div className="px-6 pb-4">
//                   <p className="text-gray-400 text-sm leading-relaxed text-left">{faq.a}</p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── BOTTOM CTA ── */}
//       <section className="px-6 pb-24 max-w-3xl mx-auto text-center">
//         <h2 className="text-4xl md:text-5xl font-extrabold italic leading-tight mb-8">
//           Ready to Start Your<br />Project?
//         </h2>
//         <button className="text-black font-bold px-8 py-4 rounded-full text-sm tracking-widest hover:opacity-90 transition-opacity" style={{ background: "#0BB80F" }}>
//           LET'S TALK NOW
//         </button>
//       </section>

//       {/* ── FOOTER ── */}
//        <Footer />
//     </div>
//   );
// }

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const NAV_LINKS = ["Work", "Services", "About", "Contact"];

const FAQS = [
  {
    q: "How fast will you respond?",
    a: "We typically respond within 2–4 business hours. For urgent inquiries, reach us directly via WhatsApp or Instant Call.",
  },
  {
    q: "Do you offer free consultation?",
    a: "Yes! We offer a complimentary 30-minute strategy session to understand your goals and see how we can help scale your brand.",
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Digital Marketing",
    message: "",
  });

  const [openFaq, setOpenFaq]   = useState(null);
  const [status, setStatus]     = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    // Basic client-side check
    if (!form.name || !form.email || !form.message) {
      setErrorMsg("Name, Email and Message are required.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name   : form.name,
          email  : form.email,
          message: `Service: ${form.service}\nPhone: ${form.phone || "N/A"}\n\n${form.message}`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", service: "Digital Marketing", message: "" });
      } else {
        setErrorMsg(data.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg("Unable to reach the server. Please try again later.");
      setStatus("error");
    }
  };

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }} className="bg-[#0a0a0a] text-white min-h-screen">
      <Header />

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-28 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none pb-0">
          <div className="w-[500px] h-48 rounded-full blur-3xl opacity-15" style={{ background: "#0BB80F" }} />
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold italic leading-tight">
            Let's <span style={{ color: "#0BB80F" }}>Connect</span>
          </h1>
          <p className="mt-5 text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
            Enter the void of digital excellence. Whether you're scaling or starting, our hyper-luminescent strategies illuminate your path to market dominance.
          </p>
        </div>
      </section>

      {/* ── CONTACT INFO CARDS ── */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Email */}
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 hover:border-[#0BB80F]/20 transition-all">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: "#0BB80F15", border: "1px solid #0BB80F30" }}>
              <span className="text-sm" style={{ color: "#0BB80F" }}>✉</span>
            </div>
            <h3 className="font-bold italic text-base mb-3">Email</h3>
            <p className="text-gray-400 text-xs mb-1">hello@acda.tech</p>
            <p className="text-gray-400 text-xs">support@acda.tech</p>
          </div>

          {/* Phone */}
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 hover:border-[#0BB80F]/20 transition-all">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: "#0BB80F15", border: "1px solid #0BB80F30" }}>
              <span className="text-sm" style={{ color: "#0BB80F" }}>📞</span>
            </div>
            <h3 className="font-bold italic text-base mb-3">Phone</h3>
            <p className="text-gray-400 text-xs mb-1">+1 (555) 0123-4567</p>
            <p className="text-gray-400 text-xs">+1 (555) 0123-8888</p>
          </div>

          {/* Location */}
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 hover:border-[#0BB80F]/20 transition-all">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: "#0BB80F15", border: "1px solid #0BB80F30" }}>
              <span className="text-sm" style={{ color: "#0BB80F" }}>📍</span>
            </div>
            <h3 className="font-bold italic text-base mb-3">Location</h3>
            <p className="text-gray-400 text-xs mb-1">42 Future Plaza, Neo-District</p>
            <p className="text-gray-400 text-xs">The Hyper-Void, 10101</p>
          </div>
        </div>
      </section>

      {/* ── MANIFEST YOUR VISION + FORM ── */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left */}
          <div>
            <h2 className="text-3xl font-extrabold italic leading-snug mb-4">
              Manifest Your<br />Vision.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              We don't just run ads; we engineer digital presence. Share your goals, and let's build something immortal.
            </p>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden h-44 bg-[#161616] border border-white/5 relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 opacity-20">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="absolute left-0 right-0 h-px bg-white/10" style={{ top: `${15 + i * 14}%` }} />
                ))}
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: `${15 + i * 17}%` }} />
                ))}
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1" style={{ borderColor: "#0BB80F", background: "#00ff7f20" }}>
                  <span className="text-xs" style={{ color: "#0BB80F" }}>📍</span>
                </div>
                <div className="w-0 h-0" style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "10px solid #0BB80F" }} />
              </div>
              <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-gray-600 tracking-widest">ACDA HQ</p>
            </div>

            {/* Avatars */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["MV", "EC", "DG"].map((init, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-[#222] flex items-center justify-center text-xs font-bold text-gray-400">
                    {init}
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs leading-tight">
                Our digital architects are<br />ready to assist you.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">

            {/* ── SUCCESS STATE ── */}
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: "#0BB80F20", border: "1px solid #0BB80F40" }}>
                  ✅
                </div>
                <h3 className="text-lg font-bold italic">Message Sent!</h3>
                <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-2 text-xs underline text-gray-500 hover:text-white transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">NAME *</label>
                    <input
                      name="name" value={form.name} onChange={handleInput}
                      placeholder="John Doe"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">EMAIL *</label>
                    <input
                      name="email" value={form.email} onChange={handleInput}
                      placeholder="john@example.com" type="email"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">PHONE</label>
                    <input
                      name="phone" value={form.phone} onChange={handleInput}
                      placeholder="+1..."
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">SERVICE</label>
                    <select
                      name="service" value={form.service} onChange={handleInput}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#0BB80F]/40 transition-colors appearance-none"
                    >
                      <option>Digital Marketing</option>
                      <option>Meta Ads</option>
                      <option>Google Ads</option>
                      <option>SEO Optimization</option>
                      <option>Content Creation</option>
                      <option>Lead Generation</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs text-gray-500 mb-1.5 block tracking-wider">MESSAGE *</label>
                  <textarea
                    name="message" value={form.message} onChange={handleInput}
                    placeholder="Tell us about your project..." rows={4}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#0BB80F]/40 transition-colors resize-none"
                  />
                </div>

                {/* Error message */}
                {status === "error" && (
                  <p className="text-red-400 text-xs mb-3 px-1">{errorMsg}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className="w-full text-black font-bold text-sm py-3.5 rounded-xl tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: "#0BB80F" }}
                >
                  {status === "loading" ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      SENDING...
                    </>
                  ) : "SEND INQUIRY"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* WhatsApp + Instant Call */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <button className="flex items-center gap-2 border border-white/10 rounded-full px-6 py-3 text-sm font-semibold hover:border-[#0BB80F]/40 transition-colors">
            <span style={{ color: "#0BB80F" }}>💬</span> WhatsApp Us
          </button>
          <button className="flex items-center gap-2 border border-white/10 rounded-full px-6 py-3 text-sm font-semibold hover:border-[#0BB80F]/40 transition-colors">
            <span style={{ color: "#0BB80F" }}>📲</span> Instant Call
          </button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 pb-24 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-extrabold italic mb-10">F.A.Q</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-[#141414] border border-white/5 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/2 transition-colors"
              >
                <span className="text-sm font-medium">{faq.q}</span>
                <span className="text-lg text-gray-400 transition-transform" style={{ transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4">
                  <p className="text-gray-400 text-sm leading-relaxed text-left">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="px-6 pb-24 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold italic leading-tight mb-8">
          Ready to Start Your<br />Project?
        </h2>
        <button className="text-black font-bold px-8 py-4 rounded-full text-sm tracking-widest hover:opacity-90 transition-opacity" style={{ background: "#0BB80F" }}>
          LET'S TALK NOW
        </button>
      </section>

      <Footer />
    </div>
  );
}