import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FiTrendingUp,FiCode ,FiPenTool  } from "react-icons/fi";
import { motion } from "framer-motion";
import { contactAPI } from '../services/api';

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
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
};

const StatItem = ({ num, suffix, label }) => {
  const { count, ref } = useCountUp(num);
  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-num">{count}<span>{suffix}</span></div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

const faqs = [
  { 
    q: "What is the typical development timeline?", 
    a: "Most projects take 4–12 weeks depending on scope. We prioritize quality while ensuring swift delivery within agreed timelines." 
  },
  { 
    q: "Do you offer performance marketing consulting?", 
    a: "Yes, our performance marketing experts provide end-to-end campaign strategy, setup, optimization, and reporting across all major platforms." 
  },
  { 
    q: "How do you approach long-term marketing?", 
    a: "We build sustainable growth strategies combining organic reach, paid media, content, and brand development for compounding results over time." 
  },
];
const services = [
  {
    icon: <FiTrendingUp />,
    title: "Performance Marketing",
    desc: "Precision-targeted campaigns designed to maximize ROI through neural-driven analytics."
  },
  {
    icon: <FiCode />,
    title: "Tech Development",
    desc: "Building the architecture of tomorrow with ultra-fast modern tech stacks."
  },
  {
    icon: <FiPenTool />,
    title: "Visual Identity",
    desc: "High-end brand systems that resonate with prestige and futuristic vision."
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Performance Marketing",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactAPI.submit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.service,
        service: formData.service,
        message: formData.message,
      });

      alert("Thank you for reaching out! We'll contact you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "Performance Marketing",
        message: "",
      });
    } catch (error) {
      alert(error.message || "Unable to send inquiry right now.");
    }
  };

  return (
    <div className="vnd-root">
      <Header />

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-watermark">FREE</div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="hero-badge">A DIGITAL MEDIA DIGITAL AGENCY</div>
          <h1>
            Powering<span>Digital Growth</span>
          </h1>
          <p className="hero-sub">
            We combine high-end aesthetic with know-how tech to scale brands into the next dimension of digital success.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate("/contact")}>Start Your Project</button>
            <button
              className="btn-secondary"
              onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Work
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        {[
          { num: 150, suffix: "+", label: "CLIENTS SERVED" },
          { num: 400, suffix: "+", label: "PROJECTS DONE" },
          { num: 7,   suffix: "X", label: "AVG. GROWTH" },
          { num: 99,  suffix: "%", label: "SUCCESS RATE" },
        ].map((s, i) => (
          <StatItem key={i} {...s} />
        ))}
      </div>

      {/* SERVICES */}
      <section id="services" className="section">
        <div className="section-label">CORE SERVICES</div>
        <h2 className="section-title">Digital Engineering</h2>
                 <div className="services-grid">
  {services.map((s, i) => (
    <div className="service-card" key={i}>
      
      <div className="service-icon-wrap">
        <div className="service-icon">{s.icon}</div>
      </div>

      <h3>{s.title}</h3>
      <p>{s.desc}</p>

    </div>
  ))}
</div>
 
      </section>

      {/* FEATURE SPLIT */}
      <section className="section pt-0">
        <div className="feature-split">
          <div className="feature-img">
          <img 
            src="/images/laptop.jpeg" 
            alt="Dashboard" 
            className="w-full h-full object-cover"
          />
        </div>
          <div className="feature-content">
            <div className="section-label text-left">OUR DNA</div>
            <h2>
              Performance Meets<br /><span>Prestige</span>
            </h2>
            <div className="feature-list">
              {[
                { title: "Creativity", desc: "Ideas that break the mold and captivate every audience." },
                { title: "Tech-First", desc: "Engineering-led solutions that are built to scale." },
                { title: "Conversion", desc: "Every asset optimized for measurable business outcomes." },
                { title: "Agility", desc: "Fast execution so you rapidly respond to market shifts." },
              ].map((f, i) => (
                <div className="feature-item" key={i}>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
 {/* PROCESS */}
<section id="about" className="section">
  <div className="section-label">ROADMAP</div>
  <h2 className="section-title">Seamless Execution</h2>

  <div className="process-timeline">
    {[
      { label: "Discovery", desc: "In-depth deep-dive into brand DNA and competitor landscape.", side: "left" },
      { label: "Strategy", desc: "Mapping the digital architecture and high-conversion funnels.", side: "right" },
      { label: "Execution", desc: "Rapid prototyping, development and elite-level design crafting.", side: "left" },
      { label: "Scaling", desc: "Post-launch optimization and automated growth loops.", side: "right" },
    ].map((step, i) => (
      
      <motion.div
        key={i}
        className={`timeline-row ${step.side}`}
        
        // Cleaner animation - just fade and slide
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: i * 0.15 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="timeline-content">
          <h4>{step.label}</h4>
          <p>{step.desc}</p>
        </div>

        <div className="timeline-dot" />
        <div className="timeline-spacer" />
      </motion.div>
    ))}
  </div>
</section>d

      {/* RECENT PROJECTS */}
      <section id="work" className="section">
        <div className="projects-header">
          <h2>Recent Projects</h2>
          <span className="view-all">View All →</span>
        </div>
        <div className="projects-grid">
          {[
            { cls: "proj-1", icon: "📄" },
            { cls: "proj-2", icon: "🎨" },
            { cls: "proj-3", icon: "📱" },
          ].map((p, i) => (
            <div className={`project-card ${p.cls}`} key={i}>
              <div className="proj-thumb">{p.icon}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section ">
        <div className="section-label">VOICE OF THREE</div>
        <h2 className="section-title">Client Echoes</h2>
        <div className="testi-grid">
          {[
            { 
              stars: "★★★★★", 
              text: "VND Media transformed our digital presence completely. Their performance marketing team drove a 7x return on our ad spend within just 3 months.", 
              name: "Sarah Johnson", 
              role: "CEO, TechFlow" 
            },
            { 
              stars: "★★★★★", 
              text: "The team at VND is exceptional. They not only built our platform but helped us understand our customers on a completely new level. Highly recommend.", 
              name: "Marcus Theone", 
              role: "Founder, BrandScale" 
            },
            { 
              stars: "★★★★★", 
              text: "Exceptional work, incredible communication. They delivered our entire rebrand in 6 weeks — and it looks a million times better than anything we imagined.", 
              name: "Olivia Reed", 
              role: "CMO, NovaTech" 
            },
          ].map((t, i) => (
            <div className="testi-card" key={i}>
              <div className="stars">{t.stars}</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-author">
                <div className="testi-avatar" />
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="brands">
          {["GOOGLE", "META", "SHOPIFY", "HUBSPOT", "SEMRUSH"].map(b => (
            <div className="brand" key={b}>{b}</div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section">
        <div className="section-label">CLARITY</div>
        <h2 className="section-title">Common Inquiries</h2>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div 
              className="faq-item" 
              key={i} 
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="faq-q">
                <span>{faq.q}</span>
                <span className="faq-icon">{openFaq === i ? "−" : "+"}</span>
              </div>
              {openFaq === i && <div className="faq-a">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
     <section className="cta-section">
  <div className="cta-section-inner">
    <h2>
      Ready to Grow with
      <span>VND Media?</span>
    </h2>
    <p>
      Join the elite rank of businesses dominating their industry with futuristic digital power.
    </p>
    <button className="btn-primary text-[15px] px-9 py-4 rounded-full" onClick={() => navigate("/contact")}>
      Get Your Free Audit
    </button>
  </div>
</section>

      {/* CONTACT */}
      <section className="contact-section">
  <div className="contact-label">CONTACT</div>
  <div className="contact-grid">
    <div className="contact-left">
      <h2>Let's Interface</h2>
      <p>
        Have a vision for the future? We're ready to engineer it. Reach out for a consultation.
      </p>
      <div className="contact-info">
        <div className="contact-info-item">
          <span className="contact-icon">✉</span> hello@vndmedia.agency
        </div>
        <div className="contact-info-item">
          <span className="contact-icon">🌐</span> Global Operations HQ
        </div>
      </div>
    </div>

    <div className="contact-form-wrapper">
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-form-row">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="contact-form-row">
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <select
            name="service"
            className="contact-select"
            value={formData.service}
            onChange={handleInputChange}
          >
            <option value="Performance Marketing">Performance Marketing</option>
            <option value="Tech Development">Tech Development</option>
            <option value="Visual Identity">Visual Identity</option>
            <option value="Consulting">Consulting</option>
          </select>
        </div>
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us about your project..."
          value={formData.message}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="btn-transmit">
          Send Transmission
        </button>
      </form>
    </div>
  </div>
</section>
      <Footer />
    </div>
  );
};

export default Home;
