import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TABS = {
  privacy: {
    title: "Privacy Policy",
    content: (
      <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
        <p className="text-gray-300">Last updated: July 5, 2026</p>
        <p>
          At VND Media, we respect your privacy and are committed to protecting the personal data
          you share with us. This Privacy Policy explains how we collect, use, and safeguard your
          information when you visit our website or interact with our agency services.
        </p>

        <h3 className="text-white text-base font-bold italic mt-8">1. Information We Collect</h3>
        <p>
          We collect information that you voluntarily provide to us when submitting inquiries through
          our contact forms, applying for career roles, or subscribing to our newsletters. This may include:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Name, email address, phone number, and company name.</li>
          <li>Details regarding your project scope, marketing goals, and budget.</li>
          <li>Resumes, portfolios, and employment history for career applicants.</li>
        </ul>

        <h3 className="text-white text-base font-bold italic mt-8">2. How We Use Your Information</h3>
        <p>We process your data to fulfill our services and improve user experiences, specifically to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Respond to contact inquiries and schedule growth consultations.</li>
          <li>Assess applications for open employment opportunities listed on our Careers portal.</li>
          <li>Distribute marketing updates and business strategy insights to newsletter subscribers.</li>
          <li>Analyze website performance metrics using analytics tags.</li>
        </ul>

        <h3 className="text-white text-base font-bold italic mt-8">3. Data Sharing &amp; Security</h3>
        <p>
          VND Media does not sell, lease, or trade client or user personal data. We implement secure 
          encryption measures to ensure information submitted through our forms remains confidential and protected 
          against unauthorized access.
        </p>
      </div>
    )
  },
  terms: {
    title: "Terms of Use",
    content: (
      <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
        <p className="text-gray-300">Last updated: July 5, 2026</p>
        <p>
          Welcome to VND Media. By accessing this website or engaging our services, you agree to comply with
          and be bound by the following Terms of Use. Please review these terms carefully.
        </p>

        <h3 className="text-white text-base font-bold italic mt-8">1. Intellectual Property Rights</h3>
        <p>
          Unless otherwise stated, all intellectual property rights for text, custom UI components, images,
          and branding layouts displayed on this website are owned exclusively by VND Media Group. Users may
          not copy, republish, or redistribute site media without written permission.
        </p>

        <h3 className="text-white text-base font-bold italic mt-8">2. Engagement of Services</h3>
        <p>
          Any consulting or digital implementation services offered by our teams are subject to separate,
          mutually agreed-upon Statements of Work (SOW). Material displayed on this website serves as general
          capabilities information and does not constitute a legally binding service commitment.
        </p>

        <h3 className="text-white text-base font-bold italic mt-8">3. Limitation of Liability</h3>
        <p>
          While we strive to ensure all information listed on this portal is accurate and secure, VND Media is not
          responsible for external links, third-party service latency, or interruptions in network uptime.
        </p>
      </div>
    )
  },
  cookies: {
    title: "Cookie Policy",
    content: (
      <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
        <p className="text-gray-300">Last updated: July 5, 2026</p>
        <p>
          VND Media uses cookies to optimize website performance, customize page structures, and gather 
          general user behavior analytics to deliver a seamless client experience.
        </p>

        <h3 className="text-white text-base font-bold italic mt-8">1. What are Cookies?</h3>
        <p>
          Cookies are small text files stored on your local device by your web browser when visiting pages. 
          They store temporary variables to help the site recall user choices and speed up asset loading.
        </p>

        <h3 className="text-white text-base font-bold italic mt-8">2. Types of Cookies We Use</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Essential Cookies:</strong> Critical for navigation, page rendering, and form submission security.</li>
          <li><strong>Performance &amp; Analytics:</strong> Tags (like Google Analytics) that compile anonymous traffic data to help us understand page navigation trends.</li>
          <li><strong>Marketing Pixels:</strong> Target analytics tags (like Meta Pixels) to optimize cross-channel campaigns.</li>
        </ul>

        <h3 className="text-white text-base font-bold italic mt-8">3. Managing Cookie Settings</h3>
        <p>
          Users can adjust browser settings to disable cookies entirely. However, blocking essential cookies may 
          affect the accessibility of certain form elements on our platform.
        </p>
      </div>
    )
  }
};

export default function Legal() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = TABS[tab] ? tab : "privacy";

  useEffect(() => {
    // Scroll to top when tab changes
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [tab]);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-body flex flex-col justify-between">
      <div>
        <Header />
        
        {/* Main Content Layout */}
        <div className="max-w-5xl mx-auto px-6 pt-36 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-12">
            
            {/* Sidebar Navigation */}
            <div className="flex flex-col space-y-3 border-r border-white/5 pr-6 h-fit sticky top-28">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0BB80F] mb-4">Legal Directory</h2>
              {Object.entries(TABS).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => navigate(`/legal/${key}`)}
                  className={`text-left text-sm py-2 px-3 rounded-xl font-semibold transition-all ${
                    activeTab === key
                      ? "bg-white/[0.04] text-[#0BB80F] border-l-2 border-[#0BB80F] pl-4"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>

            {/* Content Container */}
            <div className="space-y-6">
              <h1 className="text-4xl font-extrabold italic text-white tracking-tight">
                {TABS[activeTab].title}
              </h1>
              <div className="w-16 h-0.5 bg-[#0BB80F] rounded-full mb-8" />
              {TABS[activeTab].content}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
