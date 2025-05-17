// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-[#050519] text-white shadow-md">
      {/* Left - Logo */}
      <div className="flex items-center space-x-2">
        <div className="text-yellow-400 text-xl">🪙</div>
        <span className="font-bold text-3xl">Code Quest</span>
      </div>

      {/* Center - Nav links */}
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/game" className="hover:text-yellow-300">Learn</Link>
        <Link to="/game" className="hover:text-yellow-300">Practice</Link>
        <Link to="/game" className="hover:text-yellow-300">Community</Link>
      </div>

      {/* Right - Signup */}
      <div className="flex items-center space-x-4">
        <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-1.5 rounded shadow">
          Sign up
        </button>
      </div>
    </nav>
  );
}
