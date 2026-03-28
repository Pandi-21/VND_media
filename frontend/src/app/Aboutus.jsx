// import { useEffect, useRef, useState } from 'react';
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { Rocket, Eye, HeadphonesIcon, BarChart2, Lightbulb, Users, Sparkles } from "lucide-react";

// const NAV_LINKS = ["Home", "Services", "About", "Contact"];

// // Custom hook for count-up animation
// const useCountUp = (end, duration = 2500) => {
//   const [count, setCount] = useState(0);
//   const ref = useRef(null);
//   const observed = useRef(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting && !observed.current) {
//         observed.current = true;
//         let start = 0;
//         const step = end / (duration / 16);
//         const timer = setInterval(() => {
//           start += step;
//           if (start >= end) { 
//             setCount(end); 
//             clearInterval(timer); 
//           } else {
//             setCount(Math.floor(start));
//           }
//         }, 16);
//         return () => clearInterval(timer);
//       }
//     }, { threshold: 0.1 });
    
//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [end, duration]);

//   return { count, ref };
// };

// // Stat Item Component
// const StatItem = ({ num, suffix, label }) => {
//   const { count, ref } = useCountUp(num);
//   return (
//     <div ref={ref} className="text-center">
//       <div className="text-3xl md:text-4xl font-extrabold text-[#0BB80F]">
//         {count}{suffix}
//       </div>
//       <div className="text-gray-400 text-xs font-bold mt-1 tracking-widest">
//         {label}
//       </div>
//     </div>
//   );
// };

// // Core Values Data with Icons
// const VALUES = [
//   {
//     icon: <BarChart2 size={22} />,
//     title: "Performance Focus",
//     desc: "Data drives our decisions, ensuring your brand achieves tangible growth objectives.",
//   },
//   {
//     icon: <Lightbulb size={22} />,
//     title: "Creative Thinking",
//     desc: "We challenge traditional norms to build unique visual identities that stand out.",
//   },
//   {
//     icon: <Users size={22} />,
//     title: "Client First",
//     desc: "Your success is our priority. We maintain radical transparency in every project phase.",
//   },
//   {
//     icon: <Sparkles size={22} />,
//     title: "Continuous Innovation",
//     desc: "Stagnation is failure. We constantly integrate the latest tech into our workflow.",
//   },
// ];

// const TEAM = [
//   {
//     name: "Marcus Vane",
//     role: "FOUNDER & LEAD DEVELOPER",
//     bg: "bg-[#1a1a1a]",
//     img: null,
//     initials: "MV",
//   },
//   {
//     name: "Elena Costa",
//     role: "MARKETING SPECIALIST",
//     bg: "bg-[#2a2a2a]",
//     img: null,
//     initials: "EC",
//     silhouette: true,
//   },
//   {
//     name: "Dorian Gray",
//     role: "CREATIVE DIRECTOR",
//     bg: "bg-[#1a1a1a]",
//     img: null,
//     initials: "DG",
//   },
// ];

// const WHY_ITEMS = [
//   {
//     icon: "🎯",
//     title: "Result-Oriented Approach",
//     desc: "Every campaign is meticulously tracked and optimized for maximum ROI.",
//   },
//   {
//     icon: "✓",
//     title: "Modern UI/UX Excellence",
//     desc: "We don't just build websites; we craft immersive digital narratives.",
//   },
//   {
//     icon: "🔧",
//     title: "Bleeding-Edge Tech Stack",
//     desc: "Using the latest frameworks to ensure speed, security, and scalability.",
//   },
// ];

// const CARDS = [
//   {
//     icon: <Rocket size={26} />,
//     title: "Our Mission",
//     desc: "To empower brands through hyper-efficient digital solutions that bridge the gap between complex technology and human connection, ensuring every pixel drives measurable impact.",
//     accent: "#0BB80F",
//     glow: "rgba(11,184,15,0.12)",
//   },
//   {
//     icon: <Eye size={26} />,
//     title: "Our Vision",
//     desc: "To define the new standard of the digital agency model, where transparency, innovation, and aesthetic precision converge to build the future of the decentralised web.",
//     accent: "#0BB80F",
//     glow: "rgba(11,184,15,0.12)",
//   },
//   {
//     icon: <HeadphonesIcon size={26} />,
//     title: "Our Support",
//     desc: "Round-the-clock dedicated support that ensures your campaigns never sleep. We are your always-on growth partner, ready to adapt, respond, and deliver.",
//     accent: "#0BB80F",
//     glow: "rgba(11,184,15,0.12)",
//   },
// ];

// // Scroll Reveal Hook
// function useScrollReveal(threshold = 0.15) {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);
  
//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const observer = new IntersectionObserver(
//       ([entry]) => { 
//         if (entry.isIntersecting) { 
//           setVisible(true); 
//           observer.disconnect(); 
//         } 
//       },
//       { threshold }
//     );
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, [threshold]);
  
//   return [ref, visible];
// }

// // Mission Vision Support Card Component
// function Card({ card, delay }) {
//   const [hovered, setHovered] = useState(false);
//   const [ref, visible] = useScrollReveal(0.1);

//   return (
//     <div
//       ref={ref}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         position: "relative",
//         background: hovered ? "#161616" : "#131313",
//         border: `1px solid ${hovered ? "rgba(11,184,15,0.35)" : "rgba(255,255,255,0.05)"}`,
//         borderRadius: "20px",
//         padding: "36px 32px",
//         cursor: "default",
//         overflow: "hidden",
//         transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
//         boxShadow: hovered
//           ? "0 0 40px rgba(11,184,15,0.08), 0 24px 48px rgba(0,0,0,0.4)"
//           : "0 4px 24px rgba(0,0,0,0.2)",
//         opacity: visible ? 1 : 0,
//         transform: visible
//           ? "translateY(0) scale(1)"
//           : "translateY(32px) scale(0.97)",
//         transitionDelay: `${delay}ms`,
//       }}
//     >
//       {/* Glow blob top-right */}
//       <div style={{
//         position: "absolute",
//         top: "-40px", 
//         right: "-40px",
//         width: "160px", 
//         height: "160px",
//         background: `radial-gradient(circle, ${card.glow} 0%, transparent 70%)`,
//         borderRadius: "50%",
//         opacity: hovered ? 1 : 0,
//         transition: "opacity 0.5s ease",
//         pointerEvents: "none",
//       }} />

//       {/* Subtle top border glow line */}
//       <div style={{
//         position: "absolute",
//         top: 0, 
//         left: "20%", 
//         right: "20%",
//         height: "1px",
//         background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`,
//         opacity: hovered ? 0.7 : 0,
//         transition: "opacity 0.45s ease",
//       }} />

//       {/* Icon */}
//       <div style={{
//         display: "inline-flex",
//         alignItems: "center",
//         justifyContent: "center",
//         width: "48px", 
//         height: "48px",
//         background: hovered ? "rgba(11,184,15,0.12)" : "rgba(11,184,15,0.06)",
//         border: `1px solid ${hovered ? "rgba(11,184,15,0.3)" : "rgba(11,184,15,0.1)"}`,
//         borderRadius: "12px",
//         color: card.accent,
//         marginBottom: "24px",
//         transition: "all 0.4s ease",
//         transform: hovered ? "scale(1.08) rotate(-4deg)" : "scale(1) rotate(0deg)",
//       }}>
//         {card.icon}
//       </div>

//       {/* Title */}
//       <h3 style={{
//         fontSize: "18px",
//         fontWeight: "800",
//         fontStyle: "italic",
//         letterSpacing: "-0.3px",
//         marginBottom: "14px",
//         color: hovered ? "#fff" : "#e8e8e8",
//         transition: "color 0.3s",
//       }}>
//         {card.title}
//       </h3>

//       {/* Desc */}
//       <p style={{
//         fontSize: "13.5px",
//         lineHeight: "1.8",
//         color: hovered ? "#999" : "#666",
//         transition: "color 0.4s ease",
//       }}>
//         {card.desc}
//       </p>

//       {/* Bottom accent bar */}
//       <div style={{
//         position: "absolute",
//         bottom: 0, 
//         left: 0,
//         height: "2px",
//         width: hovered ? "100%" : "0%",
//         background: `linear-gradient(90deg, ${card.accent}, transparent)`,
//         borderRadius: "0 0 0 20px",
//         transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
//       }} />
//     </div>
//   );
// }

// // Core Values Card Component
// function ValueCard({ v, delay }) {
//   const [hovered, setHovered] = useState(false);
//   const [ref, visible] = useScrollReveal(0.12);

//   return (
//     <div
//       ref={ref}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       style={{
//         position: "relative",
//         background: hovered ? "#181818" : "#141414",
//         border: `1px solid ${hovered ? "rgba(11,184,15,0.3)" : "rgba(255,255,255,0.06)"}`,
//         borderRadius: "18px",
//         padding: "28px 24px",
//         textAlign: "left",
//         overflow: "hidden",
//         cursor: "default",
//         opacity: visible ? 1 : 0,
//         transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.96)",
//         transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
//                      transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
//                      background 0.35s ease,
//                      border-color 0.35s ease,
//                      box-shadow 0.35s ease`,
//         boxShadow: hovered
//           ? "0 0 32px rgba(11,184,15,0.07), 0 16px 40px rgba(0,0,0,0.35)"
//           : "0 2px 16px rgba(0,0,0,0.18)",
//       }}
//     >
//       {/* Corner glow */}
//       <div style={{
//         position: "absolute",
//         top: "-30px", 
//         right: "-30px",
//         width: "120px", 
//         height: "120px",
//         background: "radial-gradient(circle, rgba(11,184,15,0.1) 0%, transparent 70%)",
//         borderRadius: "50%",
//         opacity: hovered ? 1 : 0,
//         transition: "opacity 0.4s ease",
//         pointerEvents: "none",
//       }} />

//       {/* Top shimmer line */}
//       <div style={{
//         position: "absolute",
//         top: 0, 
//         left: "15%", 
//         right: "15%",
//         height: "1px",
//         background: "linear-gradient(90deg, transparent, rgba(11,184,15,0.6), transparent)",
//         opacity: hovered ? 1 : 0,
//         transition: "opacity 0.4s ease",
//       }} />

//       {/* Icon box */}
//       <div style={{
//         display: "inline-flex",
//         alignItems: "center",
//         justifyContent: "center",
//         width: "44px", 
//         height: "44px",
//         borderRadius: "12px",
//         background: hovered ? "rgba(11,184,15,0.13)" : "rgba(255,255,255,0.04)",
//         border: `1px solid ${hovered ? "rgba(11,184,15,0.28)" : "rgba(255,255,255,0.07)"}`,
//         color: hovered ? "#0BB80F" : "#888",
//         marginBottom: "20px",
//         transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
//         transform: hovered ? "scale(1.1) rotate(-5deg)" : "scale(1) rotate(0deg)",
//       }}>
//         {v.icon}
//       </div>

//       {/* Title */}
//       <h4 style={{
//         fontSize: "14px",
//         fontWeight: "800",
//         fontStyle: "italic",
//         letterSpacing: "-0.2px",
//         marginBottom: "10px",
//         color: hovered ? "#fff" : "#ddd",
//         transition: "color 0.3s ease",
//       }}>
//         {v.title}
//       </h4>

//       {/* Desc */}
//       <p style={{
//         fontSize: "12.5px",
//         lineHeight: "1.75",
//         color: hovered ? "#888" : "#555",
//         transition: "color 0.4s ease",
//       }}>
//         {v.desc}
//       </p>

//       {/* Bottom slide bar */}
//       <div style={{
//         position: "absolute",
//         bottom: 0, 
//         left: 0,
//         height: "2px",
//         width: hovered ? "100%" : "0%",
//         background: "linear-gradient(90deg, #0BB80F, transparent)",
//         borderRadius: "0 0 0 18px",
//         transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
//       }} />
//     </div>
//   );
// }

// // MissionVisionSupport Component
// function MissionVisionSupport() {
//   return (
//     <section style={{ padding: "0 24px 96px", maxWidth: "1100px", margin: "0 auto" }}>
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//         gap: "20px",
//       }}>
//         {CARDS.map((card, i) => (
//           <Card key={card.title} card={card} delay={i * 110} />
//         ))}
//       </div>
//     </section>
//   );
// }

// // CoreValues Component
// function CoreValues() {
//   const [titleRef, titleVisible] = useScrollReveal(0.1);

//   return (
//     <section style={{ padding: "0 24px 96px", maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
//       {/* Title */}
//       <div
//         ref={titleRef}
//         style={{
//           marginBottom: "48px",
//           opacity: titleVisible ? 1 : 0,
//           transform: titleVisible ? "translateY(0)" : "translateY(20px)",
//           transition: "opacity 0.7s ease, transform 0.7s ease",
//         }}
//       >
//         <h2 style={{
//           fontSize: "32px",
//           fontWeight: "900",
//           fontStyle: "italic",
//           letterSpacing: "-0.8px",
//           color: "#fff",
//         }}>
//           Core Values
//         </h2>
//         <div style={{
//           width: "32px", 
//           height: "2px",
//           background: "#0BB80F",
//           margin: "12px auto 0",
//           borderRadius: "2px",
//         }} />
//       </div>

//       {/* Cards grid */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
//         gap: "16px",
//       }}>
//         {VALUES.map((v, i) => (
//           <ValueCard key={v.title} v={v} delay={i * 100} />
//         ))}
//       </div>
//     </section>
//   );
// }

// export default function Aboutus() {
//   // Stats data for count-up animation
//   const statsData = [
//     { num: 100, suffix: "+", label: "CLIENTS SERVED" },
//     { num: 300, suffix: "+", label: "PROJECTS COMPLETED" },
//     { num: 5, suffix: "+", label: "YEARS EXPERIENCE" },
//     { num: 95, suffix: "%", label: "CLIENT SATISFACTION" },
//   ];

//   return (
//     <div
//       style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
//       className="bg-[#0d0d0d] text-white min-h-screen"
//     >
//       <Header />

//       {/* ── HERO ── */}
//       <section className="pt-40 pb-20 px-6 text-center">
//         <h1 className="text-4xl md:text-6xl font-extrabold italic leading-tight">
//           About{" "}
//           <span className="text-[#0BB80F]">VND Media</span>
//         </h1>
//         <p className="mt-5 text-gray-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
//           We are a results-driven digital agency focused on scaling brands with
//           modern technology and marketing.
//         </p>
//       </section>

//       {/* ── WHO WE ARE ── */}
//       <section className="px-6 pb-24 max-w-5xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//           <div>
//             <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
//             <p className="text-gray-400 text-sm leading-relaxed mb-4">
//               VND Media is more than just a service provider; we are your
//               strategic growth partners. Based at the intersection of creativity
//               and data, we build digital experiences that resonate.
//             </p>
//             <p className="text-gray-400 text-sm leading-relaxed">
//               Our philosophy is simple: we prioritize results over aesthetics.
//               While we pride ourselves on modern design, everything we create is
//               engineered to convert, scale, and endure.
//             </p>
//           </div>
//           {/* Image placeholder */}
//           <div className="relative rounded-2xl overflow-hidden h-64 md:h-72 bg-[#1a1a1a]">
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#333] flex items-center justify-center">
//                 <div className="text-center opacity-40">
//                   <div className="text-6xl mb-2">🏢</div>
//                   <p className="text-xs text-gray-500">Team at Work</p>
//                 </div>
//               </div>
//             </div>
//             <div className="absolute inset-0 bg-[#0BB80F]/5 rounded-2xl" />
//           </div>
//         </div>
//       </section>

//       {/* ── MISSION, VISION & SUPPORT CARDS ── */}
//       <MissionVisionSupport />

//       {/* ── STATS BANNER ── */}
//       <section className="px-6 py-12 mb-24">
//         <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//           {statsData.map((stat, index) => (
//             <StatItem 
//               key={index}
//               num={stat.num}
//               suffix={stat.suffix}
//               label={stat.label}
//             />
//           ))}
//         </div>
//       </section>

//       {/* ── CORE VALUES ── */}
//       <CoreValues />

//       {/* ── TEAM ── */}
//       <section className="px-6 pb-24 max-w-5xl mx-auto">
//         <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-10 gap-4">
//           <h2 className="text-2xl font-bold max-w-xs">
//             The Architects of Growth
//           </h2>
//           <p className="text-gray-400 text-sm max-w-xs md:text-right">
//             Our diverse team of experts brings a unique blend of technical
//             mastery and creative vision.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//           {TEAM.map((member) => (
//             <div key={member.name} className="group">
//               <div
//                 className={`${member.bg} rounded-2xl h-64 flex flex-col items-center justify-center mb-3 relative overflow-hidden border border-white/5`}
//               >
//                 {member.silhouette ? (
//                   <div className="flex flex-col items-center">
//                     <div className="w-16 h-16 rounded-full bg-white/80 mb-1" />
//                     <div className="w-10 h-24 bg-white/80 rounded-sm" />
//                     <p className="text-white/40 text-xs mt-4 tracking-widest uppercase">
//                       Marketing
//                     </p>
//                     <p className="text-white/40 text-xs tracking-widest uppercase">
//                       Specialist
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="w-24 h-24 rounded-full bg-[#2a2a2a] flex items-center justify-center text-2xl font-bold text-gray-400 border border-white/10">
//                     {member.initials}
//                   </div>
//                 )}
//               </div>
//               <h4 className="font-bold text-sm">{member.name}</h4>
//               <p className="text-[#0BB80F] text-xs tracking-widest mt-0.5">
//                 {member.role}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── WHY BRANDS SCALE ── */}
//       <section className="px-6 pb-24 max-w-5xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
//           <div className="space-y-4">
//             {WHY_ITEMS.map((item) => (
//               <div
//                 key={item.title}
//                 className="bg-[#161616] border border-white/5 rounded-2xl p-5 flex gap-4 items-start hover:border-[#0BB80F]/20 transition-all"
//               >
//                 <span className="text-[#0BB80F] text-lg mt-0.5">{item.icon}</span>
//                 <div>
//                   <h4 className="font-bold text-sm mb-1">{item.title}</h4>
//                   <p className="text-gray-400 text-xs leading-relaxed">
//                     {item.desc}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div>
//             <h2 className="text-2xl md:text-3xl font-extrabold leading-snug mb-5">
//               Why Brands Scale with{" "}
//               <span className="text-white">VND Media.</span>
//             </h2>
//             <p className="text-gray-400 text-sm leading-relaxed mb-6">
//               In a digital landscape filled with noise, we provide the signal.
//               Our methodology combines analytical rigor with artistic intuition
//               to deliver growth that traditional agencies can't match.
//             </p>
//             <blockquote className="border-l-2 border-[#0BB80F] pl-4">
//               <p className="text-gray-300 text-sm italic leading-relaxed mb-2">
//                 "Their approach to data-driven design revolutionised our
//                 conversion rates in just 90 days."
//               </p>
//               <cite className="text-gray-400 text-xs not-italic">
//                 — CTO, Nexus Global
//               </cite>
//             </blockquote>
//           </div>
//         </div>
//       </section>

//       {/* ── FOOTER ── */}
//       <Footer />
//     </div>
//   );
// }
import { useEffect, useRef, useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Rocket, Eye, HeadphonesIcon, BarChart2, Lightbulb, Users, Sparkles, Target, CheckCheck, Wrench } from "lucide-react";

// ==================== CUSTOM HOOKS ====================

// Count-up animation hook
const useCountUp = (end, duration = 2500) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const observed = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !observed.current) {
        observed.current = true;
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { 
            setCount(end); 
            clearInterval(timer); 
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
        return () => clearInterval(timer);
      }
    }, { threshold: 0.1 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
};

// Scroll reveal hook
const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) { 
          setVisible(true); 
          observer.disconnect(); 
        } 
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  
  return [ref, visible];
};

// ==================== DATA ====================

const STATS_DATA = [
  { num: 100, suffix: "+", label: "CLIENTS SERVED" },
  { num: 300, suffix: "+", label: "PROJECTS COMPLETED" },
  { num: 5, suffix: "+", label: "YEARS EXPERIENCE" },
  { num: 95, suffix: "%", label: "CLIENT SATISFACTION" },
];

const CORE_VALUES = [
  {
    icon: <BarChart2 size={22} />,
    title: "Performance Focus",
    desc: "Data drives our decisions, ensuring your brand achieves tangible growth objectives.",
  },
  {
    icon: <Lightbulb size={22} />,
    title: "Creative Thinking",
    desc: "We challenge traditional norms to build unique visual identities that stand out.",
  },
  {
    icon: <Users size={22} />,
    title: "Client First",
    desc: "Your success is our priority. We maintain radical transparency in every project phase.",
  },
  {
    icon: <Sparkles size={22} />,
    title: "Continuous Innovation",
    desc: "Stagnation is failure. We constantly integrate the latest tech into our workflow.",
  },
];

const MISSION_VISION_CARDS = [
  {
    icon: <Rocket size={26} />,
    title: "Our Mission",
    desc: "To empower brands through hyper-efficient digital solutions that bridge the gap between complex technology and human connection, ensuring every pixel drives measurable impact.",
    accent: "#0BB80F",
    glow: "rgba(11,184,15,0.12)",
  },
  {
    icon: <Eye size={26} />,
    title: "Our Vision",
    desc: "To define the new standard of the digital agency model, where transparency, innovation, and aesthetic precision converge to build the future of the decentralised web.",
    accent: "#0BB80F",
    glow: "rgba(11,184,15,0.12)",
  },
  {
    icon: <HeadphonesIcon size={26} />,
    title: "Our Support",
    desc: "Round-the-clock dedicated support that ensures your campaigns never sleep. We are your always-on growth partner, ready to adapt, respond, and deliver.",
    accent: "#0BB80F",
    glow: "rgba(11,184,15,0.12)",
  },
];

const WHY_ITEMS = [
  {
    icon: <Target size={20} />,
    title: "Result-Oriented Approach",
    desc: "Every campaign is meticulously tracked and optimized for maximum ROI.",
  },
  {
    icon: <CheckCheck size={20} />,
    title: "Modern UI/UX Excellence",
    desc: "We don't just build websites; we craft immersive digital narratives.",
  },
  {
    icon: <Wrench size={20} />,
    title: "Bleeding-Edge Tech Stack",
    desc: "Using the latest frameworks to ensure speed, security, and scalability.",
  },
];

const TEAM = [
  {
    name: "Marcus Vane",
    role: "FOUNDER & LEAD DEVELOPER",
    bg: "bg-[#1a1a1a]",
    initials: "MV",
  },
  {
    name: "Elena Costa",
    role: "MARKETING SPECIALIST",
    bg: "bg-[#2a2a2a]",
    initials: "EC",
    silhouette: true,
  },
  {
    name: "Dorian Gray",
    role: "CREATIVE DIRECTOR",
    bg: "bg-[#1a1a1a]",
    initials: "DG",
  },
];

// ==================== COMPONENTS ====================

// Stat Item Component
const StatItem = ({ num, suffix, label }) => {
  const { count, ref } = useCountUp(num);
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-extrabold text-[#0BB80F]">
        {count}{suffix}
      </div>
      <div className="text-gray-400 text-xs font-bold mt-1 tracking-widest">
        {label}
      </div>
    </div>
  );
};

// Mission Vision Support Card
const MissionCard = ({ card, delay }) => {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered ? "#161616" : "#131313",
        border: `1px solid ${hovered ? "rgba(11,184,15,0.35)" : "rgba(255,255,255,0.05)"}`,
        borderRadius: "20px",
        padding: "36px 32px",
        cursor: "default",
        overflow: "hidden",
        transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: hovered
          ? "0 0 40px rgba(11,184,15,0.08), 0 24px 48px rgba(0,0,0,0.4)"
          : "0 4px 24px rgba(0,0,0,0.2)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div style={{
        position: "absolute",
        top: "-40px", right: "-40px",
        width: "160px", height: "160px",
        background: `radial-gradient(circle, ${card.glow} 0%, transparent 70%)`,
        borderRadius: "50%",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.5s ease",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute",
        top: 0, left: "20%", right: "20%",
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`,
        opacity: hovered ? 0.7 : 0,
        transition: "opacity 0.45s ease",
      }} />

      <div style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "48px", height: "48px",
        background: hovered ? "rgba(11,184,15,0.12)" : "rgba(11,184,15,0.06)",
        border: `1px solid ${hovered ? "rgba(11,184,15,0.3)" : "rgba(11,184,15,0.1)"}`,
        borderRadius: "12px",
        color: card.accent,
        marginBottom: "24px",
        transition: "all 0.4s ease",
        transform: hovered ? "scale(1.08) rotate(-4deg)" : "scale(1) rotate(0deg)",
      }}>
        {card.icon}
      </div>

      <h3 style={{
        fontSize: "18px",
        fontWeight: "800",
        fontStyle: "italic",
        letterSpacing: "-0.3px",
        marginBottom: "14px",
        color: hovered ? "#fff" : "#e8e8e8",
        transition: "color 0.3s",
      }}>
        {card.title}
      </h3>

      <p style={{
        fontSize: "13.5px",
        lineHeight: "1.8",
        color: hovered ? "#999" : "#666",
        transition: "color 0.4s ease",
      }}>
        {card.desc}
      </p>

      <div style={{
        position: "absolute",
        bottom: 0, left: 0,
        height: "2px",
        width: hovered ? "100%" : "0%",
        background: `linear-gradient(90deg, ${card.accent}, transparent)`,
        borderRadius: "0 0 0 20px",
        transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
      }} />
    </div>
  );
};

// Core Value Card
const ValueCard = ({ value, delay }) => {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useScrollReveal(0.12);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered ? "#181818" : "#141414",
        border: `1px solid ${hovered ? "rgba(11,184,15,0.3)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "18px",
        padding: "28px 24px",
        textAlign: "left",
        overflow: "hidden",
        cursor: "default",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.96)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                     transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        boxShadow: hovered
          ? "0 0 32px rgba(11,184,15,0.07), 0 16px 40px rgba(0,0,0,0.35)"
          : "0 2px 16px rgba(0,0,0,0.18)",
      }}
    >
      <div style={{
        position: "absolute",
        top: "-30px", right: "-30px",
        width: "120px", height: "120px",
        background: "radial-gradient(circle, rgba(11,184,15,0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute",
        top: 0, left: "15%", right: "15%",
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(11,184,15,0.6), transparent)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.4s ease",
      }} />

      <div style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "44px", height: "44px",
        borderRadius: "12px",
        background: hovered ? "rgba(11,184,15,0.13)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? "rgba(11,184,15,0.28)" : "rgba(255,255,255,0.07)"}`,
        color: hovered ? "#0BB80F" : "#888",
        marginBottom: "20px",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "scale(1.1) rotate(-5deg)" : "scale(1) rotate(0deg)",
      }}>
        {value.icon}
      </div>

      <h4 style={{
        fontSize: "14px",
        fontWeight: "800",
        fontStyle: "italic",
        letterSpacing: "-0.2px",
        marginBottom: "10px",
        color: hovered ? "#fff" : "#ddd",
      }}>
        {value.title}
      </h4>

      <p style={{
        fontSize: "12.5px",
        lineHeight: "1.75",
        color: hovered ? "#888" : "#555",
      }}>
        {value.desc}
      </p>

      <div style={{
        position: "absolute",
        bottom: 0, left: 0,
        height: "2px",
        width: hovered ? "100%" : "0%",
        background: "linear-gradient(90deg, #0BB80F, transparent)",
        borderRadius: "0 0 0 18px",
        transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
      }} />
    </div>
  );
};

// Why Card Component
const WhyCard = ({ item, delay }) => {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useScrollReveal(0.12);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        gap: "16px",
        alignItems: "flex-start",
        background: hovered ? "#181818" : "#131313",
        border: `1px solid ${hovered ? "rgba(11,184,15,0.32)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "16px",
        padding: "20px 22px",
        overflow: "hidden",
        cursor: "default",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-40px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                     transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        boxShadow: hovered
          ? "0 0 28px rgba(11,184,15,0.07), 0 12px 32px rgba(0,0,0,0.3)"
          : "0 2px 12px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{
        position: "absolute",
        left: 0, top: 0, bottom: 0,
        width: "3px",
        background: "#0BB80F",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.35s ease",
        borderRadius: "16px 0 0 16px",
      }} />

      <div style={{
        position: "absolute",
        top: "-20px", left: "-20px",
        width: "100px", height: "100px",
        background: "radial-gradient(circle, rgba(11,184,15,0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }} />

      <div style={{
        flexShrink: 0,
        width: "38px", height: "38px",
        borderRadius: "10px",
        background: hovered ? "rgba(11,184,15,0.14)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? "rgba(11,184,15,0.3)" : "rgba(255,255,255,0.07)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: hovered ? "#0BB80F" : "#666",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "scale(1.1) rotate(-6deg)" : "scale(1) rotate(0deg)",
        marginTop: "2px",
        position: "relative", zIndex: 1,
      }}>
        {item.icon}
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <h4 style={{
          fontSize: "14px", fontWeight: "800", fontStyle: "italic",
          letterSpacing: "-0.2px", marginBottom: "6px",
          color: hovered ? "#fff" : "#ccc",
        }}>
          {item.title}
        </h4>
        <p style={{
          fontSize: "12.5px", lineHeight: "1.7",
          color: hovered ? "#888" : "#555",
        }}>
          {item.desc}
        </p>
      </div>

      <div style={{
        position: "absolute",
        bottom: 0, left: 0,
        height: "2px",
        width: hovered ? "100%" : "0%",
        background: "linear-gradient(90deg, #0BB80F, transparent)",
        transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
        borderRadius: "0 0 0 16px",
      }} />
    </div>
  );
};

// ==================== SECTIONS ====================

const Hero = () => (
  <section className="pt-40 pb-20 px-6 text-center">
    <h1 className="text-4xl md:text-6xl font-extrabold italic leading-tight">
      About{" "}
      <span className="text-[#0BB80F]">VND Media</span>
    </h1>
    <p className="mt-5 text-gray-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
      We are a results-driven digital agency focused on scaling brands with
      modern technology and marketing.
    </p>
  </section>
);

const WhoWeAre = () => (
  <section className="px-6 pb-24 max-w-5xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          VND Media is more than just a service provider; we are your
          strategic growth partners. Based at the intersection of creativity
          and data, we build digital experiences that resonate.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Our philosophy is simple: we prioritize results over aesthetics.
          While we pride ourselves on modern design, everything we create is
          engineered to convert, scale, and endure.
        </p>
      </div>
      <div className="relative rounded-2xl overflow-hidden h-64 md:h-72 bg-[#1a1a1a]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#333] flex items-center justify-center">
            <div className="text-center opacity-40">
              <div className="text-6xl mb-2">🏢</div>
              <p className="text-xs text-gray-500">Team at Work</p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[#0BB80F]/5 rounded-2xl" />
      </div>
    </div>
  </section>
);

const MissionVisionSection = () => (
  <section style={{ padding: "0 24px 96px", maxWidth: "1100px", margin: "0 auto" }}>
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
    }}>
      {MISSION_VISION_CARDS.map((card, i) => (
        <MissionCard key={card.title} card={card} delay={i * 110} />
      ))}
    </div>
  </section>
);

const StatsSection = () => (
  <section className="px-6 py-12 mb-24">
    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {STATS_DATA.map((stat, index) => (
        <StatItem 
          key={index}
          num={stat.num}
          suffix={stat.suffix}
          label={stat.label}
        />
      ))}
    </div>
  </section>
);

const CoreValuesSection = () => {
  const [titleRef, titleVisible] = useScrollReveal(0.1);

  return (
    <section style={{ padding: "0 24px 96px", maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
      <div
        ref={titleRef}
        style={{
          marginBottom: "48px",
          opacity: titleVisible ? 1 : 0,
          transform: titleVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <h2 style={{
          fontSize: "32px",
          fontWeight: "900",
          fontStyle: "italic",
          letterSpacing: "-0.8px",
          color: "#fff",
        }}>
          Core Values
        </h2>
        <div style={{
          width: "32px", height: "2px",
          background: "#0BB80F",
          margin: "12px auto 0",
          borderRadius: "2px",
        }} />
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: "16px",
      }}>
        {CORE_VALUES.map((v, i) => (
          <ValueCard key={v.title} value={v} delay={i * 100} />
        ))}
      </div>
    </section>
  );
};

const TeamSection = () => (
  <section className="px-6 pb-24 max-w-5xl mx-auto">
    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-10 gap-4">
      <h2 className="text-2xl font-bold max-w-xs">
        The Architects of Growth
      </h2>
      <p className="text-gray-400 text-sm max-w-xs md:text-right">
        Our diverse team of experts brings a unique blend of technical
        mastery and creative vision.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {TEAM.map((member) => (
        <div key={member.name} className="group">
          <div
            className={`${member.bg} rounded-2xl h-64 flex flex-col items-center justify-center mb-3 relative overflow-hidden border border-white/5`}
          >
            {member.silhouette ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/80 mb-1" />
                <div className="w-10 h-24 bg-white/80 rounded-sm" />
                <p className="text-white/40 text-xs mt-4 tracking-widest uppercase">
                  Marketing
                </p>
                <p className="text-white/40 text-xs tracking-widest uppercase">
                  Specialist
                </p>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#2a2a2a] flex items-center justify-center text-2xl font-bold text-gray-400 border border-white/10">
                {member.initials}
              </div>
            )}
          </div>
          <h4 className="font-bold text-sm">{member.name}</h4>
          <p className="text-[#0BB80F] text-xs tracking-widest mt-0.5">
            {member.role}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const WhyBrandsScale = () => {
  const [rightRef, rightVisible] = useScrollReveal(0.1);

  return (
    <section style={{ padding: "0 32px 96px", maxWidth: "1040px", margin: "0 auto" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "64px",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {WHY_ITEMS.map((item, i) => (
            <WhyCard key={item.title} item={item} delay={i * 120} />
          ))}
        </div>

        <div
          ref={rightRef}
          style={{
            opacity: rightVisible ? 1 : 0,
            transform: rightVisible ? "translateX(0)" : "translateX(40px)",
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
          }}
        >
          <h2 style={{
            fontSize: "clamp(26px,3.5vw,40px)",
            fontWeight: "900",
            fontStyle: "italic",
            lineHeight: 1.15,
            letterSpacing: "-1px",
            marginBottom: "20px",
            color: "#fff",
          }}>
            Why Brands Scale with{" "}
            <span style={{ color: "#0BB80F" }}>VND Media.</span>
          </h2>

          <p style={{
            fontSize: "14px", lineHeight: "1.8",
            color: "#666", marginBottom: "32px",
          }}>
            In a digital landscape filled with noise, we provide the signal.
            Our methodology combines analytical rigor with artistic intuition
            to deliver growth that traditional agencies can't match.
          </p>

          <blockquote style={{
            borderLeft: "2px solid #0BB80F",
            paddingLeft: "20px",
            margin: 0,
          }}>
            <p style={{
              fontSize: "13.5px", fontStyle: "italic",
              color: "#bbb", lineHeight: "1.75",
              marginBottom: "12px",
            }}>
              "Their approach to data-driven design revolutionised our
              conversion rates in just 90 days."
            </p>
            <cite style={{
              fontSize: "12px", color: "#555",
              fontStyle: "normal", fontWeight: "600",
            }}>
              — CTO, Nexus Global
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

// ==================== MAIN COMPONENT ====================

export default function Aboutus() {
  return (
    <div
      style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
      className="bg-[#0d0d0d] text-white min-h-screen"
    >
      <Header />
      <Hero />
      <WhoWeAre />
      <MissionVisionSection />
      <StatsSection />
      <CoreValuesSection />
      <TeamSection />
      <WhyBrandsScale />
      <Footer />
    </div>
  );
}