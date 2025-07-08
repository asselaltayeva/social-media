import { Link, useLocation } from "react-router";
import { useState } from "react";
import Hamburger from "./Icons/Hamburger";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGithub, signOut, user } = useAuth();
  const location = useLocation();

  const displayName = user?.user_metadata?.user_name || user?.email;

  const navLinks = [
    { to: "/", label: "Feed" },
    { to: "/create", label: "Create Post" },
    { to: "/communities", label: "Explore Tags" },
    { to: "/community/create", label: "Create Community" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-[rgba(15,15,15,0.85)] backdrop-blur border-b border-white/10 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-semibold font-mono text-white">
            social<span className="text-green-400">.media</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-base px-2 py-1 transition rounded ${
                  location.pathname === to
                    ? "text-white font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 hover:ring-green-400 transition"
                  />
                )}
                <span className="text-gray-300 text-base">{displayName}</span>
                <button
                  onClick={signOut}
                  className="p-1 rounded text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={signInWithGithub}
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded transition"
              >
                Sign in with GitHub
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <Hamburger
              menuOpen={menuOpen}
              toggleMenu={() => setMenuOpen((prev) => !prev)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.95)] backdrop-blur-sm border-t border-white/10 shadow-inner">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm rounded px-3 py-2 transition ${
                  location.pathname === to
                    ? "bg-gray-800 text-white font-medium"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="pt-4 border-t border-white/10">
              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full bg-red-500/10 text-red-400 py-2 px-4 rounded hover:bg-red-500/20 transition"
                >
                  <LogOut size={18} />
                  <span className="text-sm">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    signInWithGithub();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                >
                  Sign in with GitHub
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
