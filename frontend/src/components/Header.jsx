import React from 'react';
import { Link } from "react-router-dom";
import "../App.css";
import logo from "../assets/vnd logo.png";

const handleHomeClick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
const Header = () => {
 

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={handleHomeClick}>
  <img src={logo} alt="VND Media Logo" className="logo-img" />
</div>
      <div className="nav-links">
        
         <Link to="/services">Services</Link>
        
        <Link to="/Aboutus">About us</Link>
        <Link to="/Blog">Blog</Link>
        <Link to="/Contact">Contact</Link>
        <Link to="/Careers">Careers</Link>
         
      </div>
      <button className="nav-cta">Start Your Project</button>
    </nav>
  );
};

export default Header;