import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <div className="footer-brand">
          <div className="nav-logo">
            VND<span>Media</span>
          </div>
          <p>Powering digital growth for ambitious brands worldwide.</p>
        </div>
        
        <div className="footer-col">
          <h4>Services</h4>
          <a href="#">Performance Marketing</a>
          <a href="#">Tech Development</a>
          <a href="#">Visual Identity</a>
          <a href="#">Consulting</a>
        </div>
        
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Our Work</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
        </div>
        
        <div className="footer-col">
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Cookie Policy</a>
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