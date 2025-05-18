import { Link } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import AuthButton from "./icon";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-[#0a0a23] text-white shadow-md px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors">
          <span className="text-2xl">🪙</span>
          <span className="text-2xl font-bold tracking-tight">Code Quest</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 font-medium">
          <Link to="/learn" className="hover:text-yellow-300 transition">Learn</Link>
          <Link to="/practice" className="hover:text-yellow-300 transition">Practice</Link>
          <Link to="/community" className="hover:text-yellow-300 transition">Community</Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/profile" className="hover:underline text-blue-400 font-medium hidden md:block">
                Profile
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <AuthButton />
          )}

          {/* Mobile Menu Icon */}
          <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 px-2 pb-4 text-center bg-[#0f0f2f] rounded-lg shadow-lg">
          <Link to="/learn" onClick={toggleMenu} className="block hover:text-yellow-300">Learn</Link>
          <Link to="/practice" onClick={toggleMenu} className="block hover:text-yellow-300">Practice</Link>
          <Link to="/community" onClick={toggleMenu} className="block hover:text-yellow-300">Community</Link>
          {user && (
            <Link to="/profile" onClick={toggleMenu} className="block text-blue-400 hover:underline">Profile</Link>
          )}
        </div>
      )}
    </nav>
  );
}