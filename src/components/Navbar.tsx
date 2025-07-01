import { Link } from "react-router";
import { useState } from "react";
import Hamburger from "./Icons/Hamburger";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGithub, signOut, user } = useAuth();

  const displayName = user?.user_metadata?.user_name || user?.email;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/create", label: "Create Post" },
    { to: "/communities", label: "Communities" },
    { to: "/community/create", label: "Create Community" },
  ];

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur border-b border-white/10 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-mono text-xl font-bold text-white">
            social<span className="text-green-400">.media</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-gray-300 hover:text-white transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-300 text-sm">{displayName}</span>
                <button
                  onClick={signOut}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={signInWithGithub}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
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
        <div className="md:hidden bg-[rgba(10,10,10,0.95)] border-t border-white/10">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="block text-gray-300 hover:text-white hover:bg-gray-700 rounded px-3 py-2 transition"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="mt-4">
              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    signInWithGithub();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-green-400 text-white py-2 rounded hover:bg-green-700 transition"
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
