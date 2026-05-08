import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("vnd_admin_token");
  
  console.log("ProtectedRoute token:", token); // இது console-ல என்ன காட்டுதுன்னு சொல்லுங்க
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}