// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API = "http://localhost:5000/api/auth/login";

// export default function AdminLogin() {
//   const navigate = useNavigate();
//   const [form, setForm]       = useState({ username: "", password: "" });
//   const [error, setError]     = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!form.username || !form.password) {
//       setError("Please fill in both fields.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch(API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         // Send as both username AND email so backend accepts either
//         body: JSON.stringify({ username: form.username, email: form.username, password: form.password }),
//       });

//       const data = await res.json();

//       if (res.ok && data.token) {
//         localStorage.setItem("vnd_admin_token", data.token);
//         navigate("/admin/careers");
//       } else {
//         setError(data.message || "Invalid credentials.");
//       }
//     } catch (err) {
//       setError("Cannot connect to server. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
//       className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden"
//     >
//       {/* Background glow */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.07]"
//           style={{ background: "#0BB80F" }}
//         />
//       </div>

//       {/* Grid pattern overlay */}
//       <div
//         className="absolute inset-0 pointer-events-none opacity-[0.03]"
//         style={{
//           backgroundImage:
//             "linear-gradient(#0BB80F 1px, transparent 1px), linear-gradient(90deg, #0BB80F 1px, transparent 1px)",
//           backgroundSize: "40px 40px",
//         }}
//       />

//       <div className="relative z-10 w-full max-w-sm">
//         {/* Logo */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center gap-2 mb-6">
//             <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#0BB80F" }}>
//               <span className="text-black font-black text-xs">V</span>
//             </div>
//             <span className="font-extrabold tracking-[0.2em] text-white text-sm">VND MEDIA</span>
//           </div>
//           <h1 className="text-2xl font-extrabold italic text-white mb-1">ADMIN PORTAL</h1>
//           <p className="text-gray-600 text-xs tracking-wider">AUTHORISED ACCESS ONLY</p>
//         </div>

//         {/* Card */}
//         <div className="bg-[#111111] border border-white/[0.06] rounded-2xl p-8 shadow-2xl">
//           {error && (
//             <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="text-[10px] tracking-[0.15em] text-gray-500 block mb-2">EMAIL / USERNAME</label>
//               <input
//                 type="text"
//                 value={form.username}
//                 onChange={(e) => setForm({ ...form, username: e.target.value })}
//                 placeholder="Enter email"
//                 autoComplete="username"
//                 className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
//               />
//             </div>

//             <div>
//               <label className="text-[10px] tracking-[0.15em] text-gray-500 block mb-2">PASSWORD</label>
//               <div className="relative">
//                 <input
//                   type={showPass ? "text" : "password"}
//                   value={form.password}
//                   onChange={(e) => setForm({ ...form, password: e.target.value })}
//                   placeholder="Enter password"
//                   autoComplete="current-password"
//                   className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#0BB80F]/40 transition-colors"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPass(!showPass)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors text-lg"
//                 >
//                   {showPass ? "🙈" : "👁️"}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full text-black font-bold text-xs py-3.5 rounded-xl tracking-[0.15em] transition-all mt-2 ${
//                 loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-[0.98]"
//               }`}
//               style={{ background: "#0BB80F" }}
//             >
//               {loading ? "AUTHENTICATING..." : "SIGN IN →"}
//             </button>
//           </form>
//         </div>

//         <p className="text-center text-gray-700 text-[10px] tracking-wider mt-6">
//           VND MEDIA © {new Date().getFullYear()} · SECURE ADMIN PANEL
//         </p>
//       </div>
//     </div>
//   );
// }


import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();

  const menu = [
    { name: "Careers", path: "/admin/careers" },
    { name: "Blog", path: "/admin/blog" },
    { name: "Contact", path: "/admin/contact" },
    { name: "Services", path: "/admin/services" },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* Sidebar */}
      <div className="w-64 bg-[#0f0f0f] border-r border-white/10 p-6">
        <h2 className="text-lg font-bold mb-8 text-green-400">ADMIN PANEL</h2>

        <div className="space-y-4">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block ${
                location.pathname === item.path
                  ? "text-green-400"
                  : "text-white"
              } hover:text-green-400`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}