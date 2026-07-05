import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Cookies() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-body flex flex-col justify-between">
      <div>
        <Header />
        
        <div className="max-w-4xl mx-auto px-6 pt-36 pb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold italic text-white tracking-tight">
            Cookie Policy
          </h1>
          <div className="w-16 h-0.5 bg-[#0BB80F] rounded-full mt-3 mb-8" />
          
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
