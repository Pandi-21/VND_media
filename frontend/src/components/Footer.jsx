import React from 'react';
import { Link } from "react-router-dom";
import logo from "../assets/vnd logo.png";

const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <div className="footer-brand">
          <div className="nav-logo" style={{ cursor: "default" }}>
            <img src={logo} alt="VND Media Logo" style={{ height: "120px", width: "auto", objectFit: "contain" }} />
          </div>
          <p>Powering digital growth for ambitious brands worldwide.</p>
        </div>
        
        <div className="footer-col">
          <h4>Services</h4>
          <Link to="/services">Performance Marketing</Link>
          <Link to="/services">Tech Development</Link>
          <Link to="/services">Visual Identity</Link>
          <Link to="/services">Consulting</Link>
        </div>
        
        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/Aboutus">About Us</Link>
          <Link to="/">Our Work</Link>
          <Link to="/Careers">Careers</Link>
          <Link to="/Blog">Blog</Link>
        </div>
        
        <div className="footer-col">
          <h4>Legal</h4>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-use">Terms of Use</Link>
          <Link to="/cookie-policy">Cookie Policy</Link>
        </div>
      </div>
      
      <div className="footer-bottom">
        <span>© 2025 VND Media. All rights reserved.</span>
        <div className="social-links">
          <span className="social-link">𝕏</span>
          <span className="social-link">in</span>
          <span className="social-link">▶</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;