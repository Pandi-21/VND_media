import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE = API_ROOT.endsWith("/api") ? API_ROOT : `${API_ROOT}/api`;
const accent = "#0BB80F";

const FAQS = [
  {
    q: "How quickly will you respond?",
    a: "Most inquiries get a response within one business day. If the project is urgent, use WhatsApp or call directly for a faster first touch.",
  },
  {
    q: "Can I contact you without a full brief?",
    a: "Yes. Even if you only have an idea, we can help shape the scope, priorities, and next best steps during the first discussion.",
  },
  {
    q: "What kind of projects do you take?",
    a: "We support branding, marketing, websites, creative campaigns, and performance-focused digital growth work for brands that want clear execution.",
  },
];

const CONTACT_CARDS = [
  {
    title: "Email",
    lines: ["hello@vndmedia.agency", "support@vndmedia.agency"],
  },
  {
    title: "Phone",
    lines: ["+91 93630 06565", "+91 93630 06566"],
  },
  {
    title: "Location",
    lines: ["Palani, Tamil Nadu", "VND Media Group"],
  },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  service: "Digital Marketing",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [openFaq, setOpenFaq] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleInput = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setErrorMsg("Name, email, and message are required.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.service,
          service: form.service,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to send your inquiry right now.");
      }

      setStatus("success");
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setErrorMsg(error.message || "Unable to reach the server right now.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Header />

      <section className="relative overflow-hidden px-6 pt-32 pb-16">
        <div
          className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-64 w-[70vw] max-w-5xl rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, rgba(11,184,15,0.32) 0%, rgba(11,184,15,0.05) 45%, transparent 72%)" }}
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#8fb495]">
            Contact VND Media
          </p>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-5xl font-black italic leading-tight md:text-7xl">
                Build the next bold move for your brand.
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-gray-400 md:text-base">
                Reach out with your campaign, website, or growth goal. We&apos;ll turn the first message
                into a clear conversation, practical next steps, and a team that actually follows through.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {CONTACT_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm"
                >
                  <div
                    className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border"
                    style={{ borderColor: "rgba(11,184,15,0.18)", background: "rgba(11,184,15,0.12)", color: accent }}
                  >
                    {card.title.slice(0, 1)}
                  </div>
                  <h2 className="text-lg font-bold italic">{card.title}</h2>
                  <div className="mt-3 space-y-1 text-sm text-gray-400">
                    {card.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6 rounded-[30px] border border-white/8 bg-[#101010] p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8fb495]">
                Direct Access
              </p>
              <h2 className="mt-3 text-3xl font-black italic leading-tight">
                Manifest your vision.
              </h2>
              <p className="mt-4 text-sm leading-7 text-gray-400">
                Tell us what you&apos;re building, where the bottleneck is, or what kind of growth you
                want next. We&apos;ll help structure the path from idea to action.
              </p>
            </div>

            <div className="overflow-hidden rounded-[26px] border border-white/8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.599606217287!2d77.51627097765886!3d10.453312663058037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9df001a413735%3A0x61a1512da60dfa66!2sVND%20MEDIA%20Group!5e0!3m2!1sen!2sin!4v1774680338012!5m2!1sen!2sin"
                className="h-64 w-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="VND Media location"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/919363006565"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:border-[#0BB80F]/40"
              >
                WhatsApp Us
              </a>
              <a
                href="tel:+919363006565"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:border-[#0BB80F]/40"
              >
                Instant Call
              </a>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/8 bg-[#121212] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            {status === "success" ? (
              <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                <div
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border text-2xl"
                  style={{ borderColor: "rgba(11,184,15,0.2)", background: "rgba(11,184,15,0.12)", color: accent }}
                >
                  ✓
                </div>
                <h3 className="text-2xl font-black italic">Inquiry sent successfully</h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-gray-400">
                  Your message has been saved in our contact inbox. We&apos;ll get back to you soon with
                  the next steps.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:border-[#0BB80F]/40"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8fb495]">
                    Project Inquiry
                  </p>
                  <h2 className="mt-3 text-3xl font-black italic">Start the conversation</h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">
                    Share the basics and we&apos;ll take it from there. The more context you give, the
                    sharper our first response can be.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Name *">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleInput}
                      placeholder="John Doe"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Email *">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInput}
                      placeholder="john@example.com"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleInput}
                      placeholder="+91..."
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Service">
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleInput}
                      className={inputClass}
                    >
                      <option>Digital Marketing</option>
                      <option>Meta Ads</option>
                      <option>Google Ads</option>
                      <option>SEO Optimization</option>
                      <option>Website Development</option>
                      <option>Branding & Creative</option>
                    </select>
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="Message *">
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleInput}
                      rows={7}
                      placeholder="Tell us about your project, target audience, budget range, timeline, or current challenge..."
                      className={`${inputClass} resize-none`}
                    />
                  </Field>
                </div>

                {status === "error" && (
                  <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {errorMsg}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <p className="max-w-md text-xs leading-6 text-gray-500">
                    By sending this form, you&apos;re asking our team to contact you back about this
                    inquiry.
                  </p>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-black tracking-[0.2em] text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: accent }}
                  >
                    {status === "loading" ? "SENDING..." : "SEND INQUIRY"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[30px] border border-white/8 bg-white/[0.02] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8fb495]">Why reach us</p>
            <h2 className="mt-3 text-3xl font-black italic">Clarity before complexity.</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-gray-400">
              <p>We keep the first step simple: understand your goal, assess the current gap, and recommend the right execution path.</p>
              <p>That could mean campaigns, design, website work, positioning, or a sharper funnel. The contact form is the entry point to that process.</p>
            </div>
            <Link
              to="/services"
              className="mt-8 inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:border-[#0BB80F]/40"
            >
              Explore Services
            </Link>
          </div>

          <div className="rounded-[30px] border border-white/8 bg-[#101010] p-7">
            <h2 className="text-3xl font-black italic">F.A.Q</h2>
            <div className="mt-6 space-y-3">
              {FAQS.map((faq, index) => (
                <div key={faq.q} className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="pr-4 text-sm font-semibold">{faq.q}</span>
                    <span className="text-xl text-gray-500">{openFaq === index ? "−" : "+"}</span>
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 text-sm leading-7 text-gray-400">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-[36px] border border-white/8 bg-gradient-to-r from-[#111111] via-[#151515] to-[#0d0d0d] px-8 py-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8fb495]">Ready When You Are</p>
          <h2 className="mt-4 text-4xl font-black italic leading-tight md:text-5xl">
            Let&apos;s turn the next inquiry into measurable momentum.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:hello@vndmedia.agency"
              className="rounded-full px-7 py-4 text-sm font-black tracking-[0.18em] text-black"
              style={{ background: accent }}
            >
              EMAIL US
            </a>
            <Link
              to="/"
              className="rounded-full border border-white/10 px-7 py-4 text-sm font-bold transition hover:border-[#0BB80F]/40"
            >
              BACK TO HOME
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#090909] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#0BB80F]/40";
