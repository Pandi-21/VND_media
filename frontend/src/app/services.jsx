import { useState, useEffect, useRef } from "react";
import { Rocket, Facebook, Search, Video, TrendingUp, BarChart2 } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { servicesAPI, packageAPI } from "../services/api";

const getIconComponent = (iconName) => {
  switch (iconName?.toLowerCase()) {
    case "rocket":
      return <Rocket size={32} />;
    case "facebook":
    case "meta":
      return <Facebook size={32} />;
    case "search":
    case "google":
      return <Search size={32} />;
    case "video":
    case "content":
      return <Video size={32} />;
    case "trendingup":
    case "trending-up":
    case "web":
    case "dev":
      return <TrendingUp size={32} />;
    case "barchart2":
    case "bar-chart-2":
    case "seo":
      return <BarChart2 size={32} />;
    default:
      return <Rocket size={32} />;
  }
};

const NAV_LINKS = ["Services", "Work", "About", "FAQ"];

const SERVICES = [
  {
    num: "01",
    icon: <Rocket size={32} />,
    title: "Digital Marketing",
    desc: "Unified cross-channel strategies designed to dominate market share and create an unstoppable digital footprint.",
    points: ["Multi-channel ecosystem design", "Data-driven audience profiling", "Brand positioning & authority"],
    side: "left",
  },
  {
    num: "02",
    icon: <Facebook size={32} />,
    title: "Meta Ads",
    desc: "Leverage high-volume scaling across Facebook and Instagram to convert casual scrollers into lifelong customers.",
    points: ["Custom lookalike audience scaling", "Dynamic creative optimisation", "Conversion API Integration"],
    side: "right",
  },
  {
    num: "03",
    icon: <Search size={32} />,
    title: "Google Ads",
    desc: "Capture high-intent searches. Our SEM strategies place your brand directly in front of active buyers at the exact moment of need.",
    points: ["Search, Display & Max campaigns", "ROAS-focused bid management", "Competitive conquesting strategies"],
    side: "left",
  },
  {
    num: "04",
    icon: <Video size={32} />,
    title: "Content Creation",
    desc: "Hyper-behavioural visuals that cut through the noise. We produce content that doesn't just stop, it sells.",
    points: ["Cinematic content from video", "Editorial photo/graphic & 3D art", "Viral-driven copy & messaging"],
    side: "right",
  },
  {
    num: "05",
    icon: <TrendingUp size={32} />,
    title: "Web Dev",
    desc: "Custom digital experiences built for performance. We merge high-end aesthetics with lightning-fast architecture.",
    points: ["React-driven Jamstack/Next.js", "Headless CMS & E-commerce", "Conversion rate optimised funnels"],
    side: "left",
  },
  {
    num: "06",
    icon: <BarChart2 size={32} />,
    title: "SEO",
    desc: "Authority building for the long game. We ensure you own the search landscape through technical and creative excellence.",
    points: ["AI-anchored keyword research", "Technical audit & Core web vitals", "High-authority link acquisition"],
    side: "right",
  },
];

const FRAMEWORK = [
  { title: "Research", desc: "Deep dive into your business model, competitors, and customer acquisition personas.", icon: "🔎", side: "left" },
  { title: "Strategy", desc: "Developing high-converting campaign roadmaps and creative conversion blueprints.", icon: "♟", side: "right" },
  { title: "Execution", desc: "Rapid deployment of campaigns, funnels, and state-of-the-art precision.", icon: "⚡", side: "left" },
  { title: "Optimisation", desc: "Continuous refinement based on real-time data to reach your primary missions.", icon: "📊", side: "right" },
];

const PILLARS = [
  { icon: "🎯", title: "Result Oriented", desc: "Every metric we track is mapped to your bottom-line revenue goals." },
  { icon: "👥", title: "Expert Team", desc: "Our specialists work directly with industry veterans who have managed millions in ad spend." },
  { icon: "🚀", title: "Modern Strategy", desc: "Algorithm-driven Ads-Ops applies methodologies that adapt instantly to keep your edge sharp." },
];

// Scroll animation hook
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function RevealBlock({ children, from = "left", delay = 0 }) {
  const [ref, visible] = useScrollReveal();
  const tx = from === "left" ? "-60px" : "60px";
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0) translateY(0)" : `translateX(${tx}) translateY(20px)`,
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function ServiceRow({ s }) {
  const isLeft = s.side === "left";
  const navigate = useNavigate();
  return (
    <div style={{
      display: "flex",
      flexDirection: isLeft ? "row" : "row-reverse",
      alignItems: "center",
      gap: "60px",
      marginBottom: "90px",
      flexWrap: "wrap",
    }}>
      {/* Text */}
      <RevealBlock from={isLeft ? "left" : "right"} delay={0}>
        <div style={{ flex: "1", minWidth: "260px", maxWidth: "420px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ color: "#0BB80F" }}>{s.icon}</div>
            <span style={{ color: "#0BB80F", fontSize: "11px", opacity: 0.45 }}>{s.num}</span>
          </div>
          <h3 style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.2px", lineHeight: 1.2, marginBottom: "12px" }}>
            {s.title}
          </h3>
          <p style={{ color: "#9ca3af", fontSize: "15px", lineHeight: "1.75", marginBottom: "20px" }}>{s.desc}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {s.points.map((p) => (
              <li key={p} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#d1d5db", lineHeight: 1.5 }}>
                <span style={{ color: "#0BB80F", fontSize: "9px" }}>●</span> {p}
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate("/contact", { state: { selectedService: s.title } })}
            style={{
              background: "transparent",
              border: "1px solid rgba(11,184,15,0.3)",
              color: "#0BB80F",
              padding: "8px 22px",
              borderRadius: "999px",
              fontSize: "13px",
              cursor: "pointer",
              fontWeight: "700",
              letterSpacing: "0.1px",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => { e.target.style.background = "#0BB80F"; e.target.style.color = "#000"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#0BB80F"; }}
          >
            Learn More →
          </button>
        </div>
      </RevealBlock>

      {/* Visual card */}
      <RevealBlock from={isLeft ? "right" : "left"} delay={160}>
        <div style={{
          flex: "1",
          minWidth: "240px",
          maxWidth: "380px",
          aspectRatio: "4/3",
          background: "linear-gradient(135deg,#141414,#0d0d0d)",
          border: "1px solid rgba(11,184,15,0.1)",
          borderRadius: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            width: "220px", height: "220px",
            background: "radial-gradient(circle,rgba(11,184,15,0.07) 0%,transparent 70%)",
            borderRadius: "50%",
          }} />
          <div style={{ color: "rgba(11,184,15,0.12)", transform: "scale(4.5)", position: "relative", zIndex: 1 }}>{s.icon}</div>
          <div style={{
            position: "absolute", top: "14px", right: "14px",
            background: "rgba(11,184,15,0.08)",
            border: "1px solid rgba(11,184,15,0.18)",
            borderRadius: "8px", padding: "4px 10px",
            fontSize: "10px", color: "#0BB80F",
          }}>{s.num}</div>
          <div style={{
            position: "absolute", bottom: "16px", left: "16px",
            display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "5px",
          }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(11,184,15,0.18)" }} />
            ))}
          </div>
        </div>
      </RevealBlock>
    </div>
  );
}

function FrameworkStep({ f, i }) {
  const isLeft = f.side === "left";
  return (
    <RevealBlock from={isLeft ? "left" : "right"} delay={i * 120}>
      <div className={`timeline-row ${f.side}`} style={{ marginBottom: "60px" }}>
        <div className="timeline-content">
          <h4>{f.title}</h4>
          <p style={{ color: "#9ca3af", fontSize: "13.5px", lineHeight: "1.7" }}>{f.desc}</p>
        </div>

        <div className="timeline-dot" />
        <div className="timeline-spacer" />
      </div>
    </RevealBlock>
  );
}

const DEFAULT_PACKAGES = [
  {
    _id: "p1",
    name: "Silver Package",
    price: "₹24,999/mo",
    description: "Perfect for growing brands looking to establish search and social presence.",
    features: ["2 Meta Ad Campaigns", "Weekly Performance Reports", "Basic Competitor Tracking", "Dedicated Account Manager"],
    badge: "",
  },
  {
    _id: "p2",
    name: "Gold Package",
    price: "₹49,999/mo",
    description: "Designed for scaling brands requiring multi-funnel digital dominance.",
    features: ["5 Meta Ad Campaigns", "Google Ads Setup & Search SEM", "Bi-weekly consulting calls", "Custom Conversion tracking integrations", "Creative asset optimization advisory"],
    badge: "Most Popular",
  },
  {
    _id: "p3",
    name: "Platinum Combo",
    price: "₹89,999/mo",
    description: "Ultimate enterprise growth engine with complete visual & performance tech takeover.",
    features: ["Unlimited Meta & Google ad campaigns", "Priority creative team & copy assets", "Full-stack website conversion tuning", "Direct CEO Slack channel support", "Competitor takeover target strategies"],
    badge: "Best Value",
  }
];

export default function Services() {
  const navigate = useNavigate();
  const [heroVisible, setHeroVisible] = useState(false);
  const [dbServices, setDbServices] = useState([]);
  const [dbPackages, setDbPackages] = useState([]);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 80);

    servicesAPI.getAll()
      .then((data) => {
        if (data && data.success && data.services && data.services.length > 0) {
          const mapped = data.services.map((s, index) => ({
            num: String(index + 1).padStart(2, "0"),
            icon: getIconComponent(s.icon),
            title: s.title,
            desc: s.description,
            points: s.features || [],
            side: index % 2 === 0 ? "left" : "right",
          }));
          setDbServices(mapped);
        }
      })
      .catch((err) => console.error("Failed to load services:", err));

    packageAPI.getAll()
      .then((data) => {
        if (data && data.success && data.packages && data.packages.length > 0) {
          setDbPackages(data.packages);
        }
      })
      .catch((err) => console.error("Failed to load packages:", err));
  }, []);

  return (
    <div className="font-body" style={{ background: "#0d0d0d", color: "#fff", minHeight: "100vh" }}>

      {/* NAV */}
       <Header/>

      {/* HERO */}
      <section style={{ paddingTop: "150px", paddingBottom: "90px", textAlign: "center", padding: "165px 24px 90px" }}>
        <div style={{
          fontSize: "10px", letterSpacing: "3px", color: "#0BB80F", marginBottom: "16px",
          opacity: heroVisible ? 1 : 0, transition: "opacity 0.6s 0.1s",
        }}>OUR CAPABILITIES</div>
        <h1 style={{
          fontSize: "clamp(44px,8vw,84px)", fontWeight: "800",
          letterSpacing: "-0.8px", lineHeight: 1.05, marginBottom: "24px",
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(36px)",
          transition: "opacity 0.9s 0.2s, transform 0.9s 0.2s",
        }}>
          Our <span style={{ color: "#0BB80F" }}>Services</span>
        </h1>
        <p style={{
          color: "#9ca3af", fontSize: "16px", maxWidth: "520px", margin: "0 auto 40px", lineHeight: 1.75,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.9s 0.35s, transform 0.9s 0.35s",
        }}>
          We navigate the hyper-luminescent void of digital attention, crafting high-energy strategies that propel your brand into the future.
        </p>
       <div style={{ opacity: heroVisible ? 1 : 0, transition: "opacity 0.9s 0.5s" }}>
  <Link to="/Contact">
    <button
      style={{
        background: "#0BB80F",
        color: "#000",
        fontWeight: "800",
        fontSize: "14px",
        padding: "14px 34px",
        borderRadius: "999px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Get Free Consultation
    </button>
  </Link>
</div>
      </section>

      {/* SERVICES */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "0 32px 60px" }}>
        {(dbServices.length > 0 ? dbServices : SERVICES).map((s) => <ServiceRow key={s.num} s={s} />)}
      </section>

      {/* PRICING & PACKAGES */}
      <section style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 32px 100px", textAlign: "center" }}>
        <RevealBlock from="left">
          <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#0BB80F", marginBottom: "16px" }}>
            SELECT A PLAN
          </div>
          <h2 style={{ fontSize: "38px", fontWeight: "800", letterSpacing: "-0.3px", lineHeight: 1.2, marginBottom: "20px" }}>
            Pricing <span style={{ color: "#0BB80F" }}>Packages</span>
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "14px", maxWidth: "520px", margin: "0 auto 50px", lineHeight: 1.7 }}>
            Choose a plan that fits your growth targets. From single-channel setups to complete digital takeovers.
          </p>
        </RevealBlock>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "32px",
          marginTop: "20px"
        }}>
          {(dbPackages.length > 0 ? dbPackages : DEFAULT_PACKAGES).map((pkg, i) => {
            const isPopular = pkg.badge?.toLowerCase() === "most popular" || i === 1;
            return (
              <RevealBlock key={pkg._id || i} from={i % 2 === 0 ? "left" : "right"} delay={i * 120}>
                <div style={{
                  background: "#111",
                  border: isPopular ? "1px solid #0BB80F" : "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "24px",
                  padding: "36px 28px",
                  textAlign: "left",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  transition: "all 0.3s ease",
                  boxShadow: isPopular ? "0 10px 30px -10px rgba(11, 184, 15, 0.15)" : "none",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    if (isPopular) {
                      e.currentTarget.style.boxShadow = "0 15px 40px -10px rgba(11, 184, 15, 0.3)";
                    } else {
                      e.currentTarget.style.borderColor = "rgba(11,184,15,0.25)";
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    if (isPopular) {
                      e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(11, 184, 15, 0.15)";
                    } else {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    }
                  }}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <span style={{
                      position: "absolute",
                      top: "20px",
                      right: "20px",
                      background: "#0BB80F",
                      color: "#000",
                      fontSize: "9px",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      letterSpacing: "0.5px"
                    }}>
                      {pkg.badge}
                    </span>
                  )}

                  {/* Header info */}
                  <div>
                    <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#fff", marginBottom: "8px" }}>
                      {pkg.name}
                    </h3>
                    <p style={{ color: "#888", fontSize: "12.5px", lineHeight: "1.5", marginBottom: "24px", minHeight: "38px" }}>
                      {pkg.description}
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", marginBottom: "28px" }}>
                      <span style={{ fontSize: "36px", fontWeight: "900", color: "#0BB80F" }}>{pkg.price}</span>
                    </div>

                    {/* Features checklist */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px", marginBottom: "32px" }}>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                        {(pkg.features || []).map((feat, idx) => (
                          <li key={idx} style={{ display: "flex", alignItems: "start", gap: "10px", fontSize: "13.5px", color: "#ccc", lineHeight: "1.4" }}>
                            <span style={{ color: "#0BB80F", fontWeight: "bold" }}>✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA button */}
                  <div style={{ marginTop: "auto" }}>
                    <button
                      onClick={() => navigate("/contact", { state: { selectedPackage: pkg.name } })}
                      style={{
                        width: "100%",
                        background: isPopular ? "#0BB80F" : "transparent",
                        border: "1px solid #0BB80F",
                        color: isPopular ? "#000" : "#0BB80F",
                        padding: "12px 24px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: "800",
                        cursor: "pointer",
                        letterSpacing: "0.2px",
                        transition: "all 0.25s",
                      }}
                      onMouseEnter={e => {
                        e.target.style.background = "#0BB80F";
                        e.target.style.color = "#000";
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = isPopular ? "#0BB80F" : "transparent";
                        e.target.style.color = isPopular ? "#000" : "#0BB80F";
                      }}
                    >
                      Select Plan
                    </button>
                  </div>
                </div>
              </RevealBlock>
            );
          })}
        </div>
      </section>

      {/* WHY WE WIN */}
      <section style={{ maxWidth: "880px", margin: "0 auto", padding: "0 32px 100px", textAlign: "center" }}>
        <RevealBlock from="left">
          <h2 style={{ fontSize: "38px", fontWeight: "800", letterSpacing: "-0.3px", lineHeight: 1.2, marginBottom: "52px" }}>
            Why We <span style={{ color: "#0BB80F" }}>Win</span>
          </h2>
        </RevealBlock>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: "28px" }}>
          {PILLARS.map((p, i) => (
            <RevealBlock key={p.title} from={i % 2 === 0 ? "left" : "right"} delay={i * 120}>
              <div style={{
                background: "#111", border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "20px", padding: "32px 22px", transition: "border-color 0.3s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(11,184,15,0.22)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}
              >
                <div style={{ fontSize: "28px", marginBottom: "14px" }}>{p.icon}</div>
                <h4 style={{ fontWeight: "800", fontSize: "16px", lineHeight: 1.3, marginBottom: "8px" }}>{p.title}</h4>
                <p style={{ color: "#9ca3af", fontSize: "13.5px", lineHeight: "1.7" }}>{p.desc}</p>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* THE PROCESS */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "0 32px 100px" }}>
        <RevealBlock from="left">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "38px", fontWeight: "800", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
              The <span style={{ color: "#0BB80F" }}>Process</span>
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.7, marginTop: "10px" }}>
              Stop guessing. Start scaling with the agency that treats your growth as our primary mission.
            </p>
          </div>
        </RevealBlock>
        <div className="process-timeline">
          {FRAMEWORK.map((f, i) => <FrameworkStep key={f.title} f={f} i={i} />)}
        </div>
      </section>

      
       

      {/* FOOTER */}
     <Footer/>
    </div>
  );
}
