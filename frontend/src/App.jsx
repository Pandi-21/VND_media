 import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./app/Home";
import Services from "./app/services";
import Aboutus from "./app/Aboutus";
import Blog from "./app/Blog";
import BlogDetail from "./app/BlogDetail";
import Contact from "./app/Contact";
import Careers from "./app/Careers";
import Privacy from "./app/Privacy";
import Terms from "./app/Terms";
import Cookies from "./app/Cookies";
import AdminCareers from "./admin/AdminCareers";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminBlog from "./admin/AdminBlog";
import AdminContact from "./admin/AdminContact";
import AdminPortfolio from "./admin/AdminPortfolio";
import AdminServices from "./admin/AdminServices";
import AdminAbout from "./admin/AdminAbout";
import "./styles/main.css";
 
import ProtectedRoute from "./Auth/ProtectedRoute";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);
  return null;
}

function App() {
  return (
  <BrowserRouter>
  <ScrollToTop />
  <Routes>
 
  {/* Public */}
  <Route path="/" element={<Home />} />
  <Route path="/services" element={<Services />} />
  <Route path="/aboutus" element={<Aboutus />} />
  <Route path="/blog" element={<Blog />} />
  <Route path="/blog/:slug" element={<BlogDetail />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/careers" element={<Careers />} />
  <Route path="/privacy-policy" element={<Privacy />} />
  <Route path="/terms-of-use" element={<Terms />} />
  <Route path="/cookie-policy" element={<Cookies />} />

  {/* ✅ Admin Login (separate) */}
 {/* Admin Login - admin/* க்கு முன்னாடி வரணும் */}
<Route path="/admin/login" element={<AdminLogin />} />

{/* Protected Admin */}
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<div>Welcome Admin</div>} />
  <Route path="careers" element={<AdminCareers />} />
  <Route path="blog" element={<AdminBlog />} />
  <Route path="contact" element={<AdminContact />} />
  <Route path="portfolio" element={<AdminPortfolio />} />
  <Route path="services" element={<AdminServices />} />
  <Route path="about" element={<AdminAbout />} />

</Route>

</Routes>
</BrowserRouter>
  );
}

export default App;
