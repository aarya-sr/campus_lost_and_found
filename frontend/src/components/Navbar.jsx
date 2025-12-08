import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Browse" },
  { to: "/report", label: "Report" },
  { to: "/claims", label: "Claims" },
  { to: "/about", label: "About" },
  { to: "/support", label: "Support" },
];

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUser({ id: payload.id, role: payload.role || "user" });
        } catch (e) {
          console.error("Error parsing token", e);
          localStorage.removeItem("token");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    return location.pathname.startsWith(path) && path !== "/";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="logo-icon group-hover:scale-105 transition-transform duration-150">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2L3 7V17H8V12H12V17H17V7L10 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <circle cx="10" cy="7" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 leading-none">campus lost+found</p>
              <p className="text-xs text-slate-500 leading-none">community-powered</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.to)
                    ? "text-emerald-700 bg-emerald-50 border border-emerald-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                {user.role === "admin" && (
                  <span className="pill bg-amber-50 text-amber-700 border-amber-200">Admin</span>
                )}
                <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm px-4 py-2">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
