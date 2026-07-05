import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Terms() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-body flex flex-col justify-between">
      <div>
        <Header />
        
        <div className="max-w-4xl mx-auto px-6 pt-36 pb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold italic text-white tracking-tight">
            Terms of Use
          </h1>
          <div className="w-16 h-0.5 bg-[#0BB80F] rounded-full mt-3 mb-8" />
          
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
