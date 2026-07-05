import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Privacy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-body flex flex-col justify-between">
      <div>
        <Header />
        
        <div className="max-w-4xl mx-auto px-6 pt-36 pb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold italic text-white tracking-tight">
            Privacy Policy
          </h1>
          <div className="w-16 h-0.5 bg-[#0BB80F] rounded-full mt-3 mb-8" />
          
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
