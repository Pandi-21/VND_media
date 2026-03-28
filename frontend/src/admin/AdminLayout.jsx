import { Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-black text-white">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#0f0f0f] border-r border-white/10 p-6">
        <h2 className="text-lg font-bold mb-8 text-green-400">ADMIN PANEL</h2>

        <div className="space-y-4">
          <button onClick={() => navigate("/admin/careers")} className="block w-full text-left hover:text-green-400">
            Careers
          </button>

          <button onClick={() => navigate("/admin/blog")} className="block w-full text-left hover:text-green-400">
            Blog
          </button>

          <button onClick={() => navigate("/admin/contact")} className="block w-full text-left hover:text-green-400">
            Contact
          </button>

          <button onClick={() => navigate("/admin/services")} className="block w-full text-left hover:text-green-400">
            Services
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}