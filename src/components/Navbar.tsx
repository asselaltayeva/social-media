import { Link } from "react-router";
import { useState } from "react";
import Hamburger from "./Icons/Hamburger";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
  
    return (
        <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
        <div className="max-w-5xl mx-auto px-4">
            <div className= "flex justify-between items-center h-16" >
          <Link to="/" className="font-mono text-xl font-bold text-white">
            social<span className="text-green-400">.media</span>
          </Link>
  
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
                to="/"
                className="text-gray-300 hover:text-white transition-colors">Home
            </Link>

            <Link   
                to="/create"
                className="text-gray-300 hover:text-white transition-colors">Create Post
            </Link>

            <Link 
                to="/communities"
                className="text-gray-300 hover:text-white transition-colors">Communities
            </Link>

            <Link 
            to="/community/create"
            className="text-gray-300 hover:text-white transition-colors">Create Community
            </Link>
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
        <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Home
            </Link>

            <Link
              to="/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Create Post
            </Link>

            <Link
              to="/communities"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Communities
            </Link>

            <Link
              to="/community/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Create Community
            </Link>
          </div>
        </div>
      )}
    </nav>
    );
  };
