import { Link } from "react-router";

export const Footer = () => {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[rgba(15,15,15,0.85)] backdrop-blur text-gray-400 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <Link to="/" className="font-mono text-white text-base">
          social<span className="text-green-400">.media</span>
        </Link>

        <div className="flex flex-wrap gap-6 justify-center text-sm">
          <Link to="/" className="hover:text-white transition">Feed</Link>
          <Link to="/create" className="hover:text-white transition">Create Post</Link>
          <Link to="/communities" className="hover:text-white transition">Explore Tags</Link>
          <Link to="/community/create" className="hover:text-white transition">Create Community</Link>
        </div>

        <div className="text-center md:text-right">
          © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};
