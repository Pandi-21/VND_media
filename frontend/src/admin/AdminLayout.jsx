import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { name: "Careers", path: "/admin/careers" },
    { name: "Blog", path: "/admin/blog" },
    { name: "Contact", path: "/admin/contact" },
    { name: "Portfolio", path: "/admin/portfolio" },
    { name: "Services", path: "/admin/services" },
    { name: "About", path: "/admin/about" },
    { name: "Packages", path: "/admin/packages" },
  ];

  function handleLogout() {
    localStorage.removeItem("vnd_admin_token");
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className="w-64 bg-[#0f0f0f] border-r border-white/10 p-6 flex flex-col">
        <h2 className="text-lg font-bold mb-8 text-green-400">ADMIN PANEL</h2>
        <div className="space-y-4 flex-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block ${
                location.pathname === item.path ? "text-green-400" : "text-white"
              } hover:text-green-400`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-400 text-left mt-8"
        >
          Logout
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
