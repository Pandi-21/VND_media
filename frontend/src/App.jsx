 import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./app/Home";
import Services from "./app/services";
import Aboutus from "./app/Aboutus";
import Blog from "./app/Blog";
import Contact from "./app/Contact";
import Careers from "./app/Careers";
import AdminCareers from "./admin/AdminCareers";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminBlog from "./admin/AdminBlog";
import AdminContact from "./admin/AdminContact";
import AdminServices from "./admin/AdminServices";
 
import ProtectedRoute from "./Auth/ProtectedRoute";

function App() {
  return (
  <BrowserRouter>
  <Routes>

    {/* Public pages */}
    <Route path="/" element={<Home />} />
    <Route path="/services" element={<Services />} />
    <Route path="/aboutus" element={<Aboutus />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/careers" element={<Careers />} />

    {/* Admin login */}
    <Route path="/admin/login" element={<AdminLogin />} />

    {/* Protected admin page */}
<Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
  <Route path="careers" element={<AdminCareers />} />
  <Route path="blog" element={<AdminBlog />} />
  <Route path="contact" element={<AdminContact />} />
  <Route path="services" element={<AdminServices />} />
</Route>
  </Routes>
</BrowserRouter>
  );
}

export default App;